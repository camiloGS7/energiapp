const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'energiapp.sqlite')

// Persiste la BD en disco después de cada escritura
function saveToDisk(sqlDb) {
  const data = sqlDb.export()
  fs.writeFileSync(DB_PATH, Buffer.from(data))
}

// Convierte args estilo better-sqlite3 al array que espera sql.js
// better-sqlite3: stmt.run(val1, val2)  o  stmt.run({ name: val })
// sql.js:         stmt.bind([val1,val2]) o  stmt.bind({ $name: val })
function normalizeParams(args) {
  if (args.length === 0) return []
  if (args.length === 1 && args[0] !== null && typeof args[0] === 'object' && !Array.isArray(args[0])) {
    // Objeto con nombre de columnas → prefija $ para sql.js
    const obj = {}
    for (const [k, v] of Object.entries(args[0])) {
      obj[k.startsWith('$') ? k : `$${k}`] = v
    }
    return obj
  }
  return args // array posicional
}

async function initDB() {
  const SQL = await initSqlJs()

  let sqlDb
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH)
    sqlDb = new SQL.Database(fileBuffer)
  } else {
    sqlDb = new SQL.Database()
  }

  // Schema inicial
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      role       TEXT NOT NULL CHECK(role IN ('comercio','cliente','fundacion')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Migración: agrega columna phone si no existe
  try { sqlDb.run('ALTER TABLE users ADD COLUMN phone TEXT') } catch (_) {}

  saveToDisk(sqlDb)

  // Adaptador con la misma API que better-sqlite3
  const db = {
    // Ejecuta SQL sin retorno (DDL, etc.)
    exec(sql) {
      sqlDb.exec(sql)
      saveToDisk(sqlDb)
    },

    // Prepara un statement con métodos .run() / .get() / .all()
    prepare(sql) {
      return {
        run(...args) {
          sqlDb.run(sql, normalizeParams(args))
          saveToDisk(sqlDb)
          const [[lastId]] = sqlDb.exec('SELECT last_insert_rowid()')[0]?.values ?? [[null]]
          return { lastInsertRowid: lastId, changes: sqlDb.getRowsModified() }
        },
        get(...args) {
          const stmt = sqlDb.prepare(sql)
          stmt.bind(normalizeParams(args))
          const row = stmt.step() ? stmt.getAsObject() : undefined
          stmt.free()
          return row
        },
        all(...args) {
          const results = sqlDb.exec(sql, normalizeParams(args))
          if (!results.length) return []
          const { columns, values } = results[0]
          return values.map(row =>
            Object.fromEntries(columns.map((col, i) => [col, row[i]]))
          )
        }
      }
    },

    // Atajo para INSERT/UPDATE/DELETE directos sin prepare
    run(sql, ...args) {
      sqlDb.run(sql, normalizeParams(args))
      saveToDisk(sqlDb)
      return { changes: sqlDb.getRowsModified() }
    }
  }

  return db
}

module.exports = { initDB }

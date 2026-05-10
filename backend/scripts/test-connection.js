require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Conexión establecida correctamente.');

    const result = await client.query(
      'SELECT NOW() AS server_time, version() AS postgres_version'
    );

    const row = result.rows[0];
    console.log('Hora del servidor:', row.server_time);
    console.log('Versión de PostgreSQL:', row.postgres_version);
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();

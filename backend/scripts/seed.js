require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');

const USUARIOS = [
  { name: 'Tienda El Progreso', email: 'comercio@energiapp.com', password: 'seed1234', role: 'comercio' },
  { name: 'Ana Martínez',       email: 'cliente@energiapp.com',  password: 'seed1234', role: 'cliente'  },
  { name: 'Fundación Luz Verde', email: 'fundacion@energiapp.com', password: 'seed1234', role: 'fundacion' },
];

const DISPOSITIVOS_POR_USUARIO = [
  [
    { nombre: 'Medidor Principal',   tipo: 'medidor'      },
    { nombre: 'Panel Solar Techo',   tipo: 'panel_solar'  },
  ],
  [
    { nombre: 'Contador Residencial', tipo: 'medidor'     },
    { nombre: 'Calentador Eléctrico', tipo: 'calentador'  },
  ],
  [
    { nombre: 'Medidor Sede Norte',  tipo: 'medidor'      },
    { nombre: 'Generador Respaldo',  tipo: 'generador'    },
  ],
];

function randomConsumo() {
  return Math.round((Math.random() * 45 + 5) * 10) / 10;
}

function fechasUltimos90Dias() {
  const fechas = [];
  const hoy = new Date();
  hoy.setHours(12, 0, 0, 0);
  for (let i = 89; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    fechas.push(new Date(d));
  }
  return fechas;
}

async function main() {
  const existente = await prisma.user.findUnique({
    where: { email: USUARIOS[0].email },
  });

  if (existente) {
    console.log('Los datos de prueba ya existen. No se insertó nada (seed idempotente).');
    return;
  }

  const fechas = fechasUltimos90Dias();
  let totalUsuarios = 0;
  let totalDispositivos = 0;
  let totalLecturas = 0;

  for (let i = 0; i < USUARIOS.length; i++) {
    const u = USUARIOS[i];
    const passwordHash = await bcrypt.hash(u.password, 10);

    const usuario = await prisma.user.create({
      data: { name: u.name, email: u.email, passwordHash, role: u.role },
    });
    totalUsuarios++;

    for (const disp of DISPOSITIVOS_POR_USUARIO[i]) {
      const dispositivo = await prisma.dispositivo.create({
        data: { nombre: disp.nombre, tipo: disp.tipo, userId: usuario.id },
      });
      totalDispositivos++;

      const lecturas = fechas.map((fecha) => ({
        dispositivoId: dispositivo.id,
        consumoKwh: randomConsumo(),
        fecha,
      }));

      const { count } = await prisma.lectura.createMany({ data: lecturas });
      totalLecturas += count;
    }
  }

  console.log('Seed completado:');
  console.log(`  Usuarios insertados:    ${totalUsuarios}`);
  console.log(`  Dispositivos insertados: ${totalDispositivos}`);
  console.log(`  Lecturas insertadas:     ${totalLecturas}`);
}

main()
  .catch((err) => {
    console.error('Error durante el seed:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

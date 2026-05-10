const prisma = require('../lib/prisma');

function parseFecha(str) {
  const d = new Date(str + 'T00:00:00.000Z');
  return isNaN(d.getTime()) ? null : d;
}

function generarLabels(desde, hasta) {
  const labels = [];
  const cur = new Date(desde + 'T00:00:00.000Z');
  const fin = new Date(hasta + 'T00:00:00.000Z');
  while (cur <= fin) {
    labels.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return labels;
}

const getConsumo = async (req, res) => {
  try {
    let { desde, hasta } = req.query;

    if (!desde || !hasta) {
      const hoy = new Date();
      hasta = hoy.toISOString().slice(0, 10);
      const hace30 = new Date(hoy);
      hace30.setUTCDate(hoy.getUTCDate() - 29);
      desde = hace30.toISOString().slice(0, 10);
    }

    const desdeDate = parseFecha(desde);
    const hastaDate = parseFecha(hasta);

    if (!desdeDate || !hastaDate || desdeDate > hastaDate) {
      return res.status(400).json({ message: 'Fechas inválidas. Formato esperado: YYYY-MM-DD' });
    }

    const lecturas = await prisma.lectura.findMany({
      where: {
        fecha: {
          gte: desdeDate,
          lte: new Date(hasta + 'T23:59:59.999Z'),
        },
      },
      include: {
        dispositivo: { select: { id: true, nombre: true } },
      },
      orderBy: [{ dispositivoId: 'asc' }, { fecha: 'asc' }],
    });

    const labels = generarLabels(desde, hasta);

    const mapaDispositivos = new Map();
    for (const l of lecturas) {
      const key = l.dispositivoId;
      if (!mapaDispositivos.has(key)) {
        mapaDispositivos.set(key, {
          dispositivoId: l.dispositivo.id,
          nombre: l.dispositivo.nombre,
          mapaFechas: new Map(),
        });
      }
      const fechaStr = l.fecha.toISOString().slice(0, 10);
      mapaDispositivos.get(key).mapaFechas.set(fechaStr, l.consumoKwh);
    }

    let total = 0;
    const series = [];

    for (const [, disp] of mapaDispositivos) {
      const data = labels.map((label) => disp.mapaFechas.get(label) ?? 0);
      total += data.reduce((acc, v) => acc + v, 0);
      series.push({ dispositivoId: disp.dispositivoId, nombre: disp.nombre, data });
    }

    res.json({
      labels,
      series,
      total: Math.round(total * 10) / 10,
      periodo: { desde, hasta },
    });

  } catch (error) {
    console.error('Error en getConsumo:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getConsumo };

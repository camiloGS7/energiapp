const recomendaciones = [
  {
    id: 1,
    icono: "lightbulb",
    titulo: "Iluminación eficiente",
    texto: "Reemplaza tus bombillas tradicionales por LED. Consumen hasta un 80% menos de energía y duran 10 veces más.",
    umbral: 0,
  },
  {
    id: 2,
    icono: "thermometer",
    titulo: "Climatización inteligente",
    texto: "Mantén el aire acondicionado entre 24°C y 26°C. Cada grado adicional puede aumentar el consumo hasta un 8%.",
    umbral: 1000,
  },
  {
    id: 3,
    icono: "plug",
    titulo: "Desconecta lo que no usas",
    texto: "Los dispositivos en modo standby pueden representar hasta el 10% de tu factura. Usa regletas con interruptor.",
    umbral: 0,
  },
  {
    id: 4,
    icono: "clock",
    titulo: "Horario de menor tarifa",
    texto: "Programa lavadoras, lavavajillas y otros electrodomésticos para operar en la madrugada (0h-6h).",
    umbral: 2000,
  },
  {
    id: 5,
    icono: "bar-chart",
    titulo: "Monitorea tu consumo",
    texto: "Revisar tu dashboard semanalmente te permite detectar picos anormales antes de que afecten tu factura.",
    umbral: 0,
  },
  {
    id: 6,
    icono: "sun",
    titulo: "Energía solar",
    texto: "Con el consumo actual de tu instalación, un panel solar de 2kW podría cubrir parte significativa de tu demanda.",
    umbral: 3000,
  },
]

export default recomendaciones

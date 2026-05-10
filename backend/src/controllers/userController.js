const prisma = require('../lib/prisma');

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone: phone || null },
      select: { id: true, name: true, email: true, role: true, phone: true }
    });

    res.json({ message: 'Perfil actualizado', user });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.error('Error en updateProfile:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { updateProfile };

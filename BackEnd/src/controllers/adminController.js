const { getAllUsers } = require('../services/userService');

// Obtener todos los usuarios administradores
const getAdminUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const result = await getAllUsers(page, limit);
    console.log(result);
    const adminUsers = result.data.filter(user => user.tipo_usuario === 'admin');
    res.status(200).json(adminUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAdminUsers,
}; 
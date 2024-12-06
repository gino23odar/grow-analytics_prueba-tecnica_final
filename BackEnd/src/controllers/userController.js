const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../services/userService');

// Obtener todos los usuarios (con paginación)
const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const result = await getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo usuario
const createUserHandler = async (req, res) => {
  const { usuario, correo, contrasena, rol_id, nombre, apell_paterno, apell_materno, tipo_usuario } = req.body;
  try {
    const newUser = await createUser(usuario, correo, contrasena, rol_id, nombre, apell_paterno, apell_materno, tipo_usuario);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Editar usuario
const updateUserHandler = async (req, res) => {
  const { id } = req.params;
  const { usuario, correo, contrasena, rol_id } = req.body;
  try {
    const updatedUser = await updateUser(id, usuario, correo, contrasena, rol_id);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar usuario
const deleteUserHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser: createUserHandler,
  updateUser: updateUserHandler,
  deleteUser: deleteUserHandler
};

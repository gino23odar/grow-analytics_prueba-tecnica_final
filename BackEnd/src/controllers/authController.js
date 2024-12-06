
const { register, login } = require('../services/authService');

const registerUser = async (req, res) => {
  const { usuario, correo, contrasena, rol_id, nombre, apell_paterno, apell_materno, tipo_usuario } = req.body;
  try {
    const newUser = await register(usuario, correo, contrasena, rol_id, nombre, apell_paterno, apell_materno, tipo_usuario);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const token = await login(correo, contrasena);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
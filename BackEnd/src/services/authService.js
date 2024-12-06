const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

const generateToken = (user) => {
  return jwt.sign({ id: user.id, rol: user.tipo_usuario }, JWT_SECRET, {
    expiresIn: '1h',
  });
};

const login = async (correo, contrasena) => {
  const user = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);
  if (!isValidPassword) {
    throw new Error('Password incorrecto');
  }

  const token = generateToken(user);
  return token;
};

const register = async (usuario, correo, contrasena, rol_id, nombre, apell_paterno, apell_materno, tipo_usuario) => {
  const hashedPassword = await bcrypt.hash(contrasena, 10);
  const newUser = await prisma.usuario.create({
    data: {
      usuario,
      correo,
      contrasena: hashedPassword,
      rol_id,
      nombre, 
      apell_paterno, 
      apell_materno,
      tipo_usuario
    },
  });
  return newUser;
};

module.exports = {
  login,
  register,
};

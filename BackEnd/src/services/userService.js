const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async (page, limit) => {
  const users = await prisma.usuario.findMany({
    skip: (page - 1) * limit,
    take: parseInt(limit),
    include: {
      Rol: true, // Include role data (if defined in Prisma schema)
    },
  });
  const totalUsers = await prisma.usuario.count();
  return {
    data: users,
    total: totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
  };
};

const getUserById = async (id) => {
  const user = await prisma.usuario.findUnique({
    where: { id: parseInt(id) },
  });
  if (!user) throw new Error('Usuario no encontrado');
  return user;
};

const createUser = async (usuario, correo, contrasena, rol_id, nombre, apell_paterno, apell_materno, tipo_usuario) => {
  if (!['admin'].includes(tipo_usuario)) {
    throw new Error('Tipo de usuario inválido');
  }

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
      tipo_usuario,
    },
  });
  return newUser;
};

const updateUser = async (id, usuario, correo, contrasena, rol_id) => {
  const updatedUser = await prisma.usuario.update({
    where: { id: parseInt(id) },
    data: {
      usuario,
      correo,
      contrasena: contrasena ? await bcrypt.hash(contrasena, 10) : undefined,
      rol_id,
    },
  });
  return updatedUser;
};

const deleteUser = async (id) => {
  await prisma.usuario.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
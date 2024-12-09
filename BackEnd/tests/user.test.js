const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const { describe, it, expect } = require('@jest/globals');
const prisma = new PrismaClient();
/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['./setup-jest.js'],
};

module.exports = config;
// Test user data
const testUser = {
  usuario: 'testuser',
  correo: 'test@example.com',
  contrasena: 'password123',
  nombre: 'Test',
  apell_paterno: 'User',
  apell_materno: 'Test',
  rol_id: 1,
  tipo_usuario: 'admin'
};
const testUser2 = {
  usuario: 'testuser2',
  correo: 'test2@example.com',
  contrasena: 'password321',
  nombre: 'Test2',
  apell_paterno: 'User2',
  apell_materno: 'Test2',
  rol_id: 2,
  tipo_usuario: 'user'
};

const testToDelete = {
  usuario: 'testdelete',
  correo: 'testdel@example.com',
  contrasena: 'password999',
  nombre: 'Testdel',
  apell_paterno: 'Userdel',
  apell_materno: 'Testdel',
  rol_id: 2,
  tipo_usuario: 'user'
};

const newUser = {
  usuario: 'newuser2077',
  correo: 'new2077@example.com',
  contrasena: 'password2077',
  nombre: 'New2077',
  apell_paterno: 'User2077',
  apell_materno: 'Test2077',
  rol_id: 1,
  tipo_usuario: 'admin'
};

let authToken;

beforeAll(async () => {
  await prisma.usuario.deleteMany({
    where: {
      OR: [
        { correo: testUser.correo },
        { correo: testUser2.correo },
        { correo: testToDelete.correo },
        { correo: newUser.correo }
      ]
    }
  });

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({
      usuario: testUser.usuario,
      correo: testUser.correo,
      contrasena: testUser.contrasena,
      rol_id: testUser.rol_id,
      nombre: testUser.nombre,
      apell_paterno: testUser.apell_paterno,
      apell_materno: testUser.apell_materno,
      tipo_usuario: testUser.tipo_usuario
    });
  console.log('Register Response:', registerResponse.body);

  const registerResponse2 = await request(app)
    .post('/api/auth/register')
    .send({
      usuario: testUser2.usuario,
      correo: testUser2.correo,
      contrasena: testUser2.contrasena,
      rol_id: testUser2.rol_id,
      nombre: testUser2.nombre,
      apell_paterno: testUser2.apell_paterno,
      apell_materno: testUser2.apell_materno,
      tipo_usuario: testUser2.tipo_usuario
    });
  console.log('Register Response2:', registerResponse.body);

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      correo: testUser.correo,
      contrasena: testUser.contrasena
    });

  console.log('Login Response:', loginResponse.body);
  authToken = loginResponse.body.token;
});

afterAll(async () => {
  await prisma.usuario.deleteMany({
    where: { correo: testUser.correo }
  });
  await prisma.$disconnect();
});

describe('GET /users', () => {
  it('debe mostrar todos los usuarios con paginación', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('totalPages');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('debe rechazar acceso sin token', async () => {
    const response = await request(app)
      .get('/api/users');

    expect(response.status).toBe(401);
  });
});

describe('POST /users', () => {


  it('debe crear un nuevo usuario (admin)', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.usuario).toBe(newUser.usuario);
  });

  it('debe rechazar crear usuario con correo duplicado', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newUser);

    expect(response.status).toBe(400);
  });
});

describe('PUT /users/:id', () => {
  let userId;

  beforeAll(async () => {
    const user = await prisma.usuario.findUnique({
      where: { correo: testUser.correo }
    });
    userId = user.id;
  });

  it('debe actualizar un usuario existente', async () => {
    const updateData = {
      usuario: 'updateduser',
      correo: testUser.correo,
      rol_id: 1
    };

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.usuario).toBe(updateData.usuario);
  });

  it('debe rechazar actualizar usuario inexistente', async () => {
    const response = await request(app)
      .put('/api/users/99999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario: 'test' });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /users/:id', () => {
  let userToDeleteId;

  beforeAll(async () => {
    const userToDelete = await prisma.usuario.create({
      data: {
        ...testToDelete,
      }
    });
    userToDeleteId = userToDelete.id;
  });

  it('debe eliminar un usuario existente', async () => {
    const response = await request(app)
      .delete(`/api/users/${userToDeleteId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);
  });

  it('debe rechazar eliminar usuario inexistente', async () => {
    const response = await request(app)
      .delete('/api/users/99999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(400);
  });
});



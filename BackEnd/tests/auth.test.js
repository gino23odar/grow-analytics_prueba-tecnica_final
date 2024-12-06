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
  tipo_usuario: 'user'
};

beforeAll(async () => {
  // Clean up database before tests
  await prisma.usuario.deleteMany({
    where: {
      correo: testUser.correo
    }
  });
});

afterAll(async () => {
  // Clean up database after tests
  await prisma.usuario.deleteMany({
    where: {
      correo: testUser.correo
    }
  });
  await prisma.$disconnect();
});

describe('POST /auth/register', () => {
  it('debe registrar un usuario nuevo correctamente', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    if (response.status !== 201) {
      console.log('Register Response:', response.body); // Log the error response
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.usuario).toBe(testUser.usuario);
    expect(response.body.correo).toBe(testUser.correo);
  });

  it('debe retornar un error si falta un campo', async () => {
    const incompleteUser = {
      usuario: 'incomplete',
      correo: 'incomplete@example.com'
      // Missing password and other required fields
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(incompleteUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('debe retornar error si el correo ya existe', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/correo/i);
  });
});

describe('POST /auth/login', () => {
  it('debe logearse exitosamente con credenciales correctas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        correo: testUser.correo,
        contrasena: testUser.contrasena
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('debe retornar un error con credenciales invalidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        correo: testUser.correo,
        contrasena: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/password incorrecto/i);
  });

  it('debe retornar un error si el usuario no existe', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        correo: 'nonexistent@example.com',
        contrasena: 'anypassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/usuario no encontrado/i);
  });
});

describe('GET /auth/protected', () => {
  let authToken;

  beforeAll(async () => {
    // Login to get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        correo: testUser.correo,
        contrasena: testUser.contrasena
      });
    authToken = response.body.token;
  });

  it('debe acceder a ruta protegida con token válido', async () => {
    const response = await request(app)
      .get('/api/auth/protected')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('user');
  });

  it('debe rechazar acceso sin token', async () => {
    const response = await request(app)
      .get('/api/auth/protected');

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/no autorizado/i);
  });

  it('debe rechazar acceso con token inválido', async () => {
    const response = await request(app)
      .get('/api/auth/protected')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/token invalido/i);
  });
});


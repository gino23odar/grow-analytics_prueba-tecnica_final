const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST
    }
  }
});

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['./setup-jest.js'],
};

module.exports = config;

beforeAll(async () => {
  try {
    console.log('Creating test database...');

    // Directly connect to MySQL to create the database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      port: 3306
    });
    console.log('Connected to MySQL');

    await connection.query('CREATE DATABASE IF NOT EXISTS test_db');
    console.log('Database created or already exists');

    // Use the test database
    await connection.query('USE test_db');
    

    // Run migrations on test database
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS Rol (
        id INT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(191) NOT NULL,
        PRIMARY KEY (id)
      )
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS Usuario (
        id INT NOT NULL AUTO_INCREMENT,
        usuario VARCHAR(191) NOT NULL UNIQUE,
        correo VARCHAR(191) NOT NULL UNIQUE,
        nombre VARCHAR(191) NOT NULL,
        apell_paterno VARCHAR(191) NOT NULL,
        apell_materno VARCHAR(191) NOT NULL,
        contrasena VARCHAR(191) NOT NULL,
        tipo_usuario VARCHAR(191) NOT NULL,
        rol_id INT NOT NULL,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (rol_id) REFERENCES Rol(id)
      )
    `;

    // Clear existing roles
    await prisma.rol.deleteMany({});

    // Insert roles into Rol table
    await prisma.rol.createMany({
      data: [
        { nombre: 'admin' },
        { nombre: 'user' }
      ]
    });
    const roles = await prisma.rol.findMany();
    console.log('Roles in database:', roles.map(role => ({ id: role.id, nombre: role.nombre }))); // Log the roles with IDs
    await connection.end();
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Clean up test database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      port: 3306
    });

    await connection.query('DROP DATABASE IF EXISTS test_db');
    await connection.end();

    await prisma.$disconnect();
  } catch (error) {
    console.error('Test cleanup failed:', error);
    throw error;
  }
});

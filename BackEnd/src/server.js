const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check db
    await prisma.$connect();
    console.log('Conexion a la base de datos exitosa');

    // incia servidor
    app.listen(port, () => {
      console.log(`El servidor esta activo en el puerto: ${port}`);
    });
  } catch (error) {
    console.error('Error db:', error);
    process.exit(1); // salir si falla conexion db
  }
};

startServer();

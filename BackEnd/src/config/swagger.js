const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Grow Analytics',
      description: 'Documentacion de la API para Grow Analytics',
      version: '1.0.0',
      contact: {
        name: 'Gino Odar',
        email: 'randomforgithub@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

// gen doc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;

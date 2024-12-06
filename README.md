# Prueba Técnica - Gino Odar

## Introducción

Gracias por participar en esta convocatoria para la empresa **GROW ANALYTICS**. Esta prueba técnica está diseñada para evaluar tus habilidades como programador Full Stack, enfocándose en el uso de tecnologías como ReactJS, NodeJS, Redux, ExpressJS, Prisma, Swagger, MySQL, Jest, Docker, entre otras.

El proyecto tiene como objetivo la creación de una plataforma desde cero, gestionando todo el ciclo de desarrollo, desde el frontend hasta el backend. A continuación, se describen los requisitos y las características de la prueba.

**Fecha de entrega:** Martes, 12 de noviembre.

## Tecnologías utilizadas

- **Frontend:** ReactJS, Ant Design, Tailwind CSS
- **Backend:** NodeJS, ExpressJS, Prisma
- **Base de datos:** MySQL (Docker)
- **Pruebas unitarias:** Jest
- **Documentación de API:** Swagger
- **Otros:** Docker para contenedores

## Requisitos

### Backend

1. **Base de datos `usuarios`:**
   - **ID**: `INT`
   - **usuario**: `STRING`
   - **Correo**: `STRING`
   - **Nombre**: `STRING`
   - **Apell_paterno**: `STRING`
   - **Apell_materno**: `STRING`
   - **Contrasena**: `STRING`
   - **Tipo_usuario**: `STRING`
   - **Created_At**: `DATETIME`
   - **Updated_At**: `DATETIME`

2. **Endpoints API:**
   - Crear, editar, eliminar y obtener usuarios.
   - Documentación de la API usando Swagger.
   - Autenticación de usuarios con correo y contraseña.

3. **Roles y permisos:**
   - Crear roles para gestionar el acceso a las funcionalidades.
   - Solo un tipo de usuario debe poder ver la segunda tabla de usuarios.

4. **Pruebas unitarias con Jest para el backend.**

### Frontend

1. **Login:**
   - Diseño responsive utilizando **Ant Design**.
   - Formulario de login con correo y contraseña.
   - No se requiere la integración con Google, Facebook o Twitter.

2. **Primera tabla:**
   - Mostrar las columnas: ID, usuario, correo, nombre completo (concatenación de nombre, apellido paterno y apellido materno), acciones (iconos de lápiz y tacho para editar y eliminar).
   - Paginación de 10 registros por página (manejado tanto en backend como en frontend).
   - Ordenación por columnas.
   - Filtro por cada columna con icono de lupa para búsqueda.
   - Buscador general para la columna nombre completo.
   - Opciones de editar y eliminar usuarios.
   - Al editar, mostrar un modal con los datos del registro seleccionado y permitir modificar y guardar los cambios.

3. **Segunda tabla:**
   - Mostrar las columnas: ID, usuario, tipo de usuario, acciones (iconos de lápiz y tacho).
   - Paginación, ordenación, filtro y opciones de editar y eliminar, similar a la primera tabla.
   - Para editar, habilitar los campos directamente en la tabla sin usar modal.

4. **Diseño:**
   - Utilizar **Tailwind CSS** para la maquetación.
   - Soporte para modo oscuro y claro (Dark/Light Mode).

5. **Pruebas unitarias para el frontend.**

### Deseables

1. **API documentada con Swagger.**
2. **Pruebas unitarias en Jest tanto para backend como para frontend.**
3. **Opción de crear un nuevo usuario con contraseña.**
4. **Restricción de visualización de la segunda tabla a un tipo de usuario específico mediante roles y permisos.**
5. **Uso de Tailwind CSS para maquetación.**
6. **Soporte para versión en modo oscuro (dark mode) y modo claro (light mode).**


### Estructura de Backend con Nodejs

```plaintext
grow-backend/
├── prisma/                
│   ├── migrations/          # Migraciones generadas por Prisma  
│   └── schema.prisma        # Esquema de la base de datos  
├── src/  
│   ├── config/               
│   │   ├── db.js            # Configuración de la conexión con la base de datos  
│   │   └── swagger.js       # Configuración de Swagger  
│   ├── controllers/         # Controladores de las rutas  
│   │   ├── authController.js  
│   │   └── userController.js  
│   ├── middlewares/         # Middlewares personalizados  
│   │   ├── auth.js          
│   │   └── roles.js         
│   ├── routes/              # Definición de las rutas del proyecto  
│   │   ├── auth.js          # Rutas de autenticación  
│   │   └── user.js          # Rutas CRUD de usuarios  
│   ├── services/            # Lógica adicional para la capa de servicios  
│   │   ├── authService.js   
│   │   └── userService.js   
│   ├── utils/               # Utilidades compartidas  
│   │   ├── jwt.js           # Funciones para manejar JWT  
│   │   └── helpers.js       # Funciones de soporte adicionales  
│   ├── app.js               # Configuración principal del servidor  
│   └── server.js            # Entrada principal del proyecto  
├── tests/                   # Pruebas unitarias  
│   ├── auth.test.js         
│   └── user.test.js         
├── docker-compose.yml       # Configuración de Docker para levantar la base de datos  
├── .env                     
├── package.json             
└── swagger.json             # Definición de la API para Swagger  
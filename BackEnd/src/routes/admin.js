const express = require('express');
const { getAdminUsers } = require('../controllers/adminController');
const authenticateJWT = require('../middlewares/auth');
const authorizeRole = require('../middlewares/roles');

const router = express.Router();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Obtener todos los usuarios administradores
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios administradores
 */
router.get('/users', authenticateJWT, authorizeRole(['admin']), getAdminUsers);

module.exports = router; 
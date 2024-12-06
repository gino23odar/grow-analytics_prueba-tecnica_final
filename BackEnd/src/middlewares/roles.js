const authorizeRole = (roles) => (req, res, next) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }
  console.log('User Role:', req.user.rol);
  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ error: 'Permiso denegado' });
  }
  next();
};

module.exports = authorizeRole;

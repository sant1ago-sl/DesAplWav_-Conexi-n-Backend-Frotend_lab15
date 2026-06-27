const { verifyToken } = require("../utils/jwt");

exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No autenticado",
      data: null,
    });
  }

  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
      data: null,
    });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "No tienes permiso para esta acción",
      data: null,
    });
  }
  next();
};

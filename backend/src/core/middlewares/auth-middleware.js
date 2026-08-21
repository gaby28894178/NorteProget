import { verifyToken } from '../config/jwt.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Middleware de autenticación
 * Verifica el token JWT en el header Authorization
 */
export const authenticate = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Token no proporcionado o formato inválido',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar el token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    // Agregar el usuario decodificado al request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Error de autenticación',
    });
  }
};

/**
 * Middleware de autorización
 * Verifica que el usuario tenga el rol requerido
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'No autenticado',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
      });
    }

    next();
  };
};

/**
 * Middleware opcional: verifica si hay usuario autenticado
 * No bloquea si no hay token
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }
    next();
  } catch {
    next();
  }
};

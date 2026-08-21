import jwt from 'jsonwebtoken';
import { env } from './env.js';

/**
 * Configuración JWT
 */
const JWT_CONFIG = {
  secret: env.jwtSecret || 'norte-secret-key-change-in-production',
  expiresIn: env.jwtExpiresIn || '7d',
  refreshExpiresIn: env.jwtRefreshExpiresIn || '30d',
};

/**
 * Genera un token JWT
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn,
  });
};

/**
 * Genera un refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.refreshExpiresIn,
  });
};

/**
 * Verifica un token JWT
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret);
  } catch (error) {
    return null;
  }
};

/**
 * Decodifica un token sin verificar (solo para obtener payload)
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default JWT_CONFIG;

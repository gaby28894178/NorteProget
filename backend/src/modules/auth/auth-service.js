import bcrypt from 'bcrypt';
import userRepository from '../users/user-repository.js';
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
} from '../../core/config/jwt.js';
import { USER_ROLES } from '../../core/utils/constants.js';
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} from '../../core/errors/index.js';

class AuthService {
  /**
   * Login de usuario
   */
  async login(email, password) {
    // Buscar usuario con contraseña
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new AuthenticationError('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {
      throw new AuthenticationError(
        'Usuario desactivado. Contacta al administrador',
      );
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Credenciales inválidas');
    }

    // Generar tokens
    const payload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Remover contraseña de la respuesta
    const userData = user.toJSON();
    delete userData.password_hash;

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Registro de usuario
   */
  async register(userData) {
    // Verificar si el email ya existe
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ValidationError(
        `El email ${userData.email} ya está registrado`,
      );
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Crear usuario (siempre CUSTOMER desde registro público)
    const user = await userRepository.create({
      full_name: userData.full_name,
      email: userData.email,
      password_hash: hashedPassword,
      role: USER_ROLES.CUSTOMER,
      is_active: true,
    });

    // Generar tokens
    const payload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new AuthenticationError('Refresh token requerido');
    }

    // Verificar el refresh token
    const decoded = verifyToken(refreshToken);

    if (!decoded) {
      throw new AuthenticationError('Refresh token inválido o expirado');
    }

    // Verificar que el usuario existe y está activo
    const user = await userRepository.findById(decoded.id);

    if (!user.is_active) {
      throw new AuthenticationError('Usuario desactivado');
    }

    // Generar nuevo access token
    const payload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };

    const newAccessToken = generateToken(payload);

    return {
      accessToken: newAccessToken,
    };
  }
  /**
   * Cambiar contraseña
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Buscar usuario con contraseña
    const user = await userRepository.findById(userId, true);

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new ValidationError('Contraseña actual incorrecta');
    }

    // Hash de la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña directamente en el modelo
    await user.update({ password_hash: hashedPassword });

    return { message: 'Contraseña actualizada exitosamente' };
  }
}

export default new AuthService();

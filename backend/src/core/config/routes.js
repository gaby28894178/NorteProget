import { Router } from 'express';
import authRoutes from '../../modules/auth/auth-router.js';
import userRoutes from '../../modules/users/user-router.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;

import { Router } from 'express';
import authRoutes from '../../modules/auth/auth-router.js';
import userRoutes from '../../modules/users/user-router.js';
import categoryRoutes from '../../modules/categories/category-router.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);

export default router;

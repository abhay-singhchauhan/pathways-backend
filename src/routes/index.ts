import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import serviceRoutes from './service.routes';
import sessionRoutes from './session.routes';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/sessions', sessionRoutes);

export default router; 
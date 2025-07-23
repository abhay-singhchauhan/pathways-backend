import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
  
} from '../controllers/user.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes - require authentication
router.use(protect);

// Get current user profile
router.get('/profile', getCurrentUser);

// Get user by ID - any authenticated user
router.get('/:id', getUserById);

// Update user - users can update their own profile, admins can update any
router.put('/:id', updateUser);


// Admin only routes
router.get('/', authorize('admin'), getAllUsers);

router.delete('/:id', authorize('admin'), deleteUser);

export default router; 
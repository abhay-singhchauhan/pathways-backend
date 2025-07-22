"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', user_controller_1.registerUser);
router.post('/login', user_controller_1.loginUser);
// Protected routes - require authentication
router.use(auth_middleware_1.protect);
// Get current user profile
router.get('/profile', user_controller_1.getCurrentUser);
// Get user by ID - any authenticated user
router.get('/:id', user_controller_1.getUserById);
// Update user - users can update their own profile, admins can update any
router.put('/:id', user_controller_1.updateUser);
// Admin only routes
router.get('/', (0, auth_middleware_1.authorize)('admin'), user_controller_1.getAllUsers);
router.delete('/:id', (0, auth_middleware_1.authorize)('admin'), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
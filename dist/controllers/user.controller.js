"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
const validation_1 = require("../utils/validation");
const jwt_2 = require("../utils/jwt");
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        // Validate input
        const { error, value } = validation_1.createUserSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
            return;
        }
        const userData = value;
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({ email: userData.email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }
        // Create new user
        const user = new user_model_1.default(userData);
        await user.save();
        // Generate JWT token
        const token = (0, jwt_1.generateToken)(user);
        // Prepare response
        const userResponse = user.toJSON();
        const { password, ...userWithoutPassword } = userResponse;
        const response = {
            user: userWithoutPassword,
            token
        };
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: response
        });
    }
    catch (error) {
        console.error('Register user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.registerUser = registerUser;
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        // Validate input
        const { error, value } = validation_1.loginSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
            return;
        }
        const { email, password } = value;
        // Find user and include password for comparison
        const user = await user_model_1.default.findOne({ email, isActive: true }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)(user);
        // Prepare response
        const userResponse = user.toJSON();
        const { password: userPassword, ...userWithoutPassword } = userResponse;
        const response = {
            user: userWithoutPassword,
            token
        };
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: response
        });
    }
    catch (error) {
        console.error('Login user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.loginUser = loginUser;
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await user_model_1.default.find({ isActive: true })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalUsers = await user_model_1.default.countDocuments({ isActive: true });
        const totalPages = Math.ceil(totalUsers / limit);
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getAllUsers = getAllUsers;
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        // Validate user ID
        const { error } = validation_1.userIdSchema.validate({ id: req.params.id });
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
            return;
        }
        const user = await user_model_1.default.findById(req.params.id);
        if (!user || !user.isActive) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: { user }
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getUserById = getUserById;
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
    try {
        // Validate user ID
        const { error: idError } = validation_1.userIdSchema.validate({ id: req.params.id });
        if (idError) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
            return;
        }
        // Validate update data
        const { error, value } = validation_1.updateUserSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
            return;
        }
        const updateData = value;
        // Check if email is being updated and is unique
        if (updateData.email) {
            const existingUser = await user_model_1.default.findOne({
                email: updateData.email,
                _id: { $ne: req.params.id }
            });
            if (existingUser) {
                res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
                return;
            }
        }
        const user = await user_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: { user }
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateUser = updateUser;
// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        // Validate user ID
        const { error } = validation_1.userIdSchema.validate({ id: req.params.id });
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
            return;
        }
        const user = await user_model_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteUser = deleteUser;
// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getCurrentUser = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided'
            });
            return;
        }
        // Verify token and extract user ID
        const decoded = (0, jwt_2.verifyToken)(token);
        const userId = decoded.id;
        const user = await user_model_1.default.findById(userId);
        if (!user || !user.isActive) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: { user }
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=user.controller.js.map
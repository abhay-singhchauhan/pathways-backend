import { Request, Response } from 'express';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { 
  createUserSchema, 
  updateUserSchema, 
  loginSchema, 
  userIdSchema 
} from '../utils/validation';
import { 
  ICreateUserInput, 
  IUpdateUserInput, 
  ILoginInput,
  IAuthResponse 
} from '../types/user.types';
import {OAuth2Client} from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const userData: ICreateUserInput = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Prepare response
    const userResponse = user.toJSON();
    const { password, ...userWithoutPassword } = userResponse;

    const response: IAuthResponse = {
      user: userWithoutPassword,
      token
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: response
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const { email, password }: ILoginInput = value;

    // Find user and include password for comparison
    const user = await User.findOne({ email, isActive: true }).select('+password');
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
    const token = generateToken(user);

    // Prepare response
    const userResponse = user.toJSON();
    const { password: userPassword, ...userWithoutPassword } = userResponse;

    const response: IAuthResponse = {
      user: userWithoutPassword,
      token
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: response
    });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqRole = req.query.role || 'user';

    if (req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    const users = await User.find({role: reqRole, isActive: true });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate user ID
    const { error } = userIdSchema.validate({ id: req.params.id });
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
      return;
    }

    const user = await User.findById(req.params.id);
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
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate user ID
    const { error: idError } = userIdSchema.validate({ id: req.params.id });
    if (idError) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
      return;
    }

    // Validate update data
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const updateData: IUpdateUserInput = value;

    // Check if email is being updated and is unique
    if (updateData.email) {
      const existingUser = await User.findOne({ 
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

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate user ID
    const { error } = userIdSchema.validate({ id: req.params.id });
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

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
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
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
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    console.log(user)
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
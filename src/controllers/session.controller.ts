import { Request, Response } from 'express';
import Session from '../models/session.model';
import { ICreateSessionInput, IUpdateSessionInput } from '../types/session.types';

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ICreateSessionInput = req.body;
    const session = new Session(data);
    await session.save();
    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Admin
export const getAllSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await Session.find().populate('user');
    res.status(200).json({
      success: true,
      message: 'Sessions retrieved successfully',
      data: sessions
    });
  } catch (error) {
    console.error('Get all sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await Session.findById(req.params.id).populate('user');
    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Session retrieved successfully',
      data: session
    });
  } catch (error) {
    console.error('Get session by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
export const updateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData: IUpdateSessionInput = req.body;
    const session = await Session.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Admin
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 
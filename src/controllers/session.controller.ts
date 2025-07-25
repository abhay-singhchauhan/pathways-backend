import { Request, Response } from 'express';
import Session from '../models/session.model';
import { ICreateSessionInput, IUpdateSessionInput } from '../types/session.types';
import { createSessionSchema } from '../utils/validation';
import serviceModel from '../models/service.model';
import Razorpay from 'razorpay';
import crypto from 'crypto';
// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ICreateSessionInput = req.body;
    const { error } = createSessionSchema.validate(data);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    const service = await serviceModel.findById(data.serviceId);
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found'
      });
      return;
    }
    
    const order = await razorpay.orders.create({
      amount: service.price * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}`
    });

    data.amount = service.price;
    data.orderId = order.id;
    data.userId = req.user?.id as string;

    const session = new Session(data);
    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session,
      orderId: order.id
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const validatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body)
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const shasum = crypto.createHmac('sha256',  process.env.RAZORPAY_KEY_SECRET || '');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`); 
    const digest = shasum.digest('hex');
    if (digest !== razorpay_signature) {
      res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
      return;
    }

    const session = await Session.findOneAndUpdate({ orderId: razorpay_order_id }, { paymentStatus: 'paid', paymentId: razorpay_payment_id }, { new: true });
    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      }); 
      return;
    }

   res.status(200).json({
    success: true,
    message: 'Payment validated successfully',
    data: session
   });

  } catch (error) {
    console.error('Validate payment error:', error);
    res.status(500).json({
      error: error,
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

    if(req.user?.role == 'admin'){
      const sessions = await Session.find();
      res.status(200).json(sessions);
    }else if (req.user?.role == 'therapist'){
      const userId = req.user?.id as string;
      const sessions = await Session.find({therapistId: userId});
      res.status(200).json(sessions);
    }
    else{
      const userId = req.user?.id as string;
      const sessions = await Session.find({userId});
      res.status(200).json(sessions);
    }
    
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
    const userId = req.user?.id as string;
    const session = await Session.findOne({ userId }).populate({
      path: 'userId',
      select: 'firstName lastName email' 
    });
    if (!session) {   
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
      return;
    }
    res.status(200).json(session);
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

export const assignTherapist = async (req: Request, res: Response): Promise<void> => {
  try {

    const { sessionId, therapistId } = req.body;
    const session = await Session.findByIdAndUpdate(sessionId, { therapistId, status: 'assigned' }, { new: true });
    res.status(200).json(session);
  } catch (error) {
    console.error('Assign therapist error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if(req.user?.role !== 'therapist' && req.user?.role !== 'admin'){
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }


    const { sessionId, status } = req.body;
    const session = await Session.findByIdAndUpdate(
      { _id: sessionId, therapistId: req.user?.id },
      { status },
      { new: true }
    );

    if(!session){
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
      return;
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false, 
      message: 'Internal server error'
    });
  }
};

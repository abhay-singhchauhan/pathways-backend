"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.assignTherapist = exports.deleteSession = exports.updateSession = exports.getSessionById = exports.getAllSessions = exports.validatePayment = exports.createSession = void 0;
const session_model_1 = __importDefault(require("../models/session.model"));
const validation_1 = require("../utils/validation");
const service_model_1 = __importDefault(require("../models/service.model"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
const createSession = async (req, res) => {
    try {
        const data = req.body;
        const { error } = validation_1.createSessionSchema.validate(data);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
            return;
        }
        const service = await service_model_1.default.findById(data.serviceId);
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
        data.userId = req.user?.id;
        const session = new session_model_1.default(data);
        await session.save();
        res.status(201).json({
            success: true,
            message: 'Session created successfully',
            data: session,
            orderId: order.id
        });
    }
    catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.createSession = createSession;
const validatePayment = async (req, res) => {
    try {
        console.log(req.body);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const shasum = crypto_1.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');
        if (digest !== razorpay_signature) {
            res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
            return;
        }
        const session = await session_model_1.default.findOneAndUpdate({ orderId: razorpay_order_id }, { paymentStatus: 'paid', paymentId: razorpay_payment_id }, { new: true });
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
    }
    catch (error) {
        console.error('Validate payment error:', error);
        res.status(500).json({
            error: error,
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.validatePayment = validatePayment;
// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Admin
const getAllSessions = async (req, res) => {
    try {
        if (req.user?.role == 'admin') {
            const sessions = await session_model_1.default.find().populate([
                { path: 'userId', select: 'firstName lastName email' },
                { path: 'therapistId', select: 'firstName lastName email' }
            ]);
            res.status(200).json(sessions);
        }
        else if (req.user?.role == 'therapist') {
            const userId = req.user?.id;
            const sessions = await session_model_1.default.find({ therapistId: userId }).populate([
                { path: 'userId', select: 'firstName lastName email' },
                { path: 'therapistId', select: 'firstName lastName email' }
            ]);
            res.status(200).json(sessions);
        }
        else {
            const userId = req.user?.id;
            const sessions = await session_model_1.default.find({ userId }).populate([
                { path: 'userId', select: 'firstName lastName email' },
                { path: 'therapistId', select: 'firstName lastName email' }
            ]);
            res.status(200).json(sessions);
        }
    }
    catch (error) {
        console.error('Get all sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getAllSessions = getAllSessions;
// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
    try {
        const userId = req.user?.id;
        const session = await session_model_1.default.findOne({ userId }).populate([
            { path: 'userId', select: 'firstName lastName email' },
            { path: 'therapistId', select: 'firstName lastName email' }
        ]);
        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Session not found'
            });
            return;
        }
        res.status(200).json(session);
    }
    catch (error) {
        console.error('Get session by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getSessionById = getSessionById;
// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = async (req, res) => {
    try {
        const updateData = req.body;
        const session = await session_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate([
            { path: 'userId', select: 'firstName lastName email' },
            { path: 'therapistId', select: 'firstName lastName email' }
        ]);
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
    }
    catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateSession = updateSession;
// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Admin
const deleteSession = async (req, res) => {
    try {
        const session = await session_model_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteSession = deleteSession;
const assignTherapist = async (req, res) => {
    try {
        const { sessionId, therapistId } = req.body;
        const session = await session_model_1.default.findByIdAndUpdate(sessionId, { therapistId, status: 'assigned' }, { new: true }).populate([
            { path: 'userId', select: 'firstName lastName email' },
            { path: 'therapistId', select: 'firstName lastName email' }
        ]);
        res.status(200).json(session);
    }
    catch (error) {
        console.error('Assign therapist error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.assignTherapist = assignTherapist;
const updateStatus = async (req, res) => {
    try {
        if (req.user?.role !== 'therapist' && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied'
            });
            return;
        }
        const { sessionId, status } = req.body;
        const session = await session_model_1.default.findByIdAndUpdate({ _id: sessionId, therapistId: req.user?.id }, { status }, { new: true });
        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Session not found'
            });
            return;
        }
        res.status(200).json(session);
    }
    catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=session.controller.js.map
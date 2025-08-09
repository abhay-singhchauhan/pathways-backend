"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.getServiceById = exports.getAllServices = exports.createService = void 0;
const service_model_1 = __importDefault(require("../models/service.model"));
// @desc    Create a new service
// @route   POST /api/services
// @access  Admin
const createService = async (req, res) => {
    try {
        const data = req.body;
        const service = new service_model_1.default(data);
        await service.save();
        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });
    }
    catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.createService = createService;
// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
    try {
        const services = await service_model_1.default.find();
        res.status(200).json(services);
    }
    catch (error) {
        console.error('Get all services error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getAllServices = getAllServices;
// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await service_model_1.default.findById(req.params.id);
        if (!service) {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Service retrieved successfully',
            data: service
        });
    }
    catch (error) {
        console.error('Get service by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getServiceById = getServiceById;
// @desc    Update service
// @route   PUT /api/services/:id
// @access  Admin
const updateService = async (req, res) => {
    try {
        const updateData = req.body;
        const service = await service_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!service) {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });
    }
    catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateService = updateService;
// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Admin
const deleteService = async (req, res) => {
    try {
        const service = await service_model_1.default.findByIdAndDelete(req.params.id);
        if (!service) {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteService = deleteService;
//# sourceMappingURL=service.controller.js.map
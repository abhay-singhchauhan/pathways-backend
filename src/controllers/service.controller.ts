import { Request, Response } from 'express';
import Service from '../models/service.model';
import { ICreateServiceInput, IUpdateServiceInput } from '../types/service.types';

// @desc    Create a new service
// @route   POST /api/services
// @access  Admin
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ICreateServiceInput = req.body;
    const service = new Service(data);
    await service.save();
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
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
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Admin
export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData: IUpdateServiceInput = req.body;
    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Admin
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
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
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 
import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.max': 'First name cannot exceed 50 characters'
  }),
  lastName: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required'
  }),
  dateOfBirth: Joi.date().max('now').optional().messages({
    'date.max': 'Date of birth cannot be in the future'
  }),
  phoneNumber: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  profileUrl: Joi.string().optional(),
  role: Joi.string().valid('user', 'admin', 'therapist').optional().default('user')
});

export const createSessionSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Invalid user ID format',
    'string.length': 'Invalid user ID format'
  }),
  serviceId: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Invalid service ID format',
    'string.length': 'Invalid service ID format'
  }),
  motivation: Joi.string().required().messages({
    'string.empty': 'Motivation is required'
  }),
  strugglingAreas: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Struggling areas must be an array',
    'array.empty': 'Struggling areas are required'
  }),
  otherArea: Joi.string().optional().allow(''),
  preferredMentorType: Joi.string().valid('male', 'female', "no-preference").required().messages({
    'string.empty': 'Preferred mentor type is required' 
  }),
  preferredLanguage: Joi.string().required().messages({
    'string.empty': 'Preferred language is required'
  }),
  communicationMode: Joi.string().valid('phone-call', 'google-meet').required().messages({
    'string.empty': 'Communication mode is required'
  }),
  // amount: Joi.number().required().messages({
  //   'number.base': 'Amount is required'
  // }),
  couponCode: Joi.string().optional(),
  date: Joi.date().required().messages({
    'date.base': 'Date is required'
  }),
  time: Joi.string().required().messages({
    'string.empty': 'Time is required'
  })
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).optional(),
  lastName: Joi.string().trim().min(1).max(50).optional(),
  email: Joi.string().email().optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say').optional(),
  isActive: Joi.boolean().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

export const userIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Invalid user ID format',
    'string.length': 'Invalid user ID format'
  })
});    
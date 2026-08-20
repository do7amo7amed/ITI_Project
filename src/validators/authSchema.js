//authScehma.js
const { z } = require('zod');

// Schema for User Registration
const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address format')
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
  university: z
    .string({ required_error: 'University is required' })
    .trim(),
  department: z
    .string({ required_error: 'Department is required' })
    .trim(),
  academicLevel: z
    .number({ required_error: 'Academic level is required' })
    .int('Academic level must be an integer')
    .min(1, 'Academic level must be between 1 and 4')
    .max(4, 'Academic level must be between 1 and 4'),
    profileInformation: z
    .object({
      bio: z.string().optional(),
    })
    .optional(),
});

// Schema for User Login
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address format')
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password cannot be empty'),
});

module.exports = {
  registerSchema,
  loginSchema,
};

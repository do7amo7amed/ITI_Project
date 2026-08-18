const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const register = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 'Email is already registered', 400);
    }

    const newUser = await userService.createUser(req.body);

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      university: newUser.university,
      department: newUser.department,
      academicLevel: newUser.academicLevel,
      role: newUser.role,
    };

    return sendSuccess(res, userResponse, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return sendSuccess(
      res,
      { user: userResponse, token },
      'Login successful',
      200
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
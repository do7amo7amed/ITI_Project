//src/controllers/authController.js
//implements business logic: register & login functions

const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { responseHandler } = require('../utils/responseHandler');

const register = async (req, res, next) => {
  try {
    const { email } = req.body;

    //checks whether email already saved in db
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return responseHandler(res, 400, 'Email is already registered');
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

    return responseHandler(res, 201, 'User registered successfully', userResponse);
  } catch (error) {
    next(error);
  }
};

//checks email & pass are correct
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return responseHandler(res, 401,'Invalid email or password');
    }

    //compares password against stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return responseHandler(res, 401, 'Invalid email or password');
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

    return responseHandler(res,200,'Login successful',{ user: userResponse, token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};

//src/services/userService.js
// talks to db 

const User = require('../models/userModel');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserById = async (id) => {
  //returning user data excluding pass field
  return await User.findById(id).select('-password'); 
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};

//src/controllers/userController.js
//implements profile retrieval, update, and delete

const User = require("../models/userModel");
const { responseHandler } = require('../utils/responseHandler');

const { updateProfileSchema } = require("../validators/userProfileSchema");

const getProfile = async (req, res, next) => {
  try {
    return responseHandler(res, 200, "Profile retrieved successfully", req.user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const cleanData = updateProfileSchema.parse(req.body);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: cleanData },
      { new: true, runValidators: true },
    ).select("-password");

    return responseHandler(res, 200, "Profile updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return responseHandler(res, 404, "User not found");
    }

    return responseHandler(res, 200, "User deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteUser,
};
 

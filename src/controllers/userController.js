const User = require("../models/userModel");
const { sendSuccess, sendError } = require("../utils/responseHandler");

const { updateProfileSchema } = require("../validators/userProfileSchema");

const getProfile = async (req, res, next) => {
  try {
    return sendSuccess(res, req.user, "Profile retrieved successfully", 200);
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

    return sendSuccess(res, updatedUser, "Profile updated successfully", 200);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, null, "User deleted successfully", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteUser,
};
 

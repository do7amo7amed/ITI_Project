const Course = require("../models/courseModel");
const responseHandler = require("../utils/responseHandler"); // استدعاء الفانكشن بتاعت الباشمهندس

//gettling all courses
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    if (!courses || courses.length === 0) {
      return responseHandler(res, 200, "No courses found", []);
    }
    responseHandler(res, 200, "Courses retrieved successfully", courses);
  } catch (error) {
    next(error);
  }
};

//get course by ID
const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return responseHandler(res, 404, "Course not found", null);
    }
    responseHandler(res, 200, "Course retrieved successfully", course);
  } catch (error) {
    next(error);
  }
};

//create course
const createCourse = async (req, res, next) => {
  try {
    const newCourse = await Course.create(req.body);
    responseHandler(res, 201, "Course created successfully", newCourse);
  } catch (error) {
    next(error);
  }
};

//  update course
const updateCourse = async (req, res, next) => {
  try {
    // new: true بترجع الكورس بعد التعديل مش قبله
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) {
      return responseHandler(res, 404, "Course not found", null);
    }
    responseHandler(res, 200, "Course updated successfully", updatedCourse);
  } catch (error) {
    next(error);
  }
};

//delete course 
const deleteCourse = async (req, res, next) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return responseHandler(res, 404, "Course not found", null);
    }
    return responseHandler(res, 200, "Course deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
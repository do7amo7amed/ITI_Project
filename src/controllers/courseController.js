//src/controllers/courseController.js
const Course = require("../models/courseModel");
const {responseHandler} = require("../utils/responseHandler");

//for getting all courses
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

//getting the course by courseCode
const getCourse = async (req, res, next) => {
  try {
    const courseCode = req.params.courseCode.toUpperCase();
    const course = await Course.findOne({ courseCode: courseCode });
    if (!course) {
      return responseHandler(res, 404, "Course not found", null);
    }
    responseHandler(res, 200, "Course retrieved successfully", course);
  } catch (error) {
    next(error);
  }
};


//creating a new course
const createCourse = async (req, res, next) => {
  try {
    const newCourse = await Course.create(req.body);
    responseHandler(res, 201, "Course created successfully", newCourse);
  } catch (error) {
    next(error);
  }
};


//updating the course by courseCode
const updateCourse = async (req, res, next) => {
  try {
    const courseCode = req.params.courseCode.toUpperCase();
    const updatedCourse = await Course.findOneAndUpdate(
      { courseCode: courseCode }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedCourse) {
      return responseHandler(res, 404, "Course not found", null);
    }
    responseHandler(res, 200, "Course updated successfully", updatedCourse);
  } catch (error) {
    next(error);
  }
};


//deleting the course by courseCode
const deleteCourse = async (req, res, next) => {
  try {
    const courseCode = req.params.courseCode.toUpperCase();
    const deletedCourse = await Course.findOneAndDelete({ courseCode: courseCode });
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

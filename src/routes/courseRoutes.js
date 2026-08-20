//src/routes/courseRoutes.js
const express = require("express");
const router = express.Router();

const { auth, authorize } = require("../middlewares");
const validate = require("../middlewares/validator");
const courseSchema = require("../validators/courseValidator");

const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.get("/", getAllCourses);

router.get("/:courseCode", getCourse);

router.post("/", auth, authorize('admin'), validate(courseSchema), createCourse);

router.put("/:courseCode", auth, authorize('admin'), validate(courseSchema), updateCourse);

router.delete("/:courseCode", auth, authorize('admin'), deleteCourse);

module.exports = router;

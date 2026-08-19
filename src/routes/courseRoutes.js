const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middlewares");
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

router.post("/", authenticate, authorize(['admin']), validate(courseSchema), createCourse);

router.put("/:courseCode", authenticate, authorize(['admin']), validate(courseSchema), updateCourse);

router.delete("/:courseCode", authenticate, authorize(['admin']), deleteCourse);

module.exports = router;
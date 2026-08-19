const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true, 
        trim: true,
        minlength: 4
    },
    courseCode: {
        type:String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true
    },
    academicLevel: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true, }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
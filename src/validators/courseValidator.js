const z= require('zod');

const courseSchema = z.object({
    courseName: z.string({ required_error: 'Course Name is required' })
    .min(4, "Course name must be at least 4 characters long"),
    courseCode : z.string({ required_error: 'Course Code is required' })
    .min(5, "Course code must be at least 5 characters long").max(10, "Course code can't be more than 10 characters "),
    academicLevel: z.string({ required_error: 'Academic Level is required' })
    .min(6, 'Academic level must be at least 6 characters long').max(10, 'Academic level cant be more than 10 characters'),
    semester: z.string({ required_error: 'Semester is required' })
    .min(4, 'Semester must be at least 4 characters long')
    .max(10, 'Semester cant be more than 10 characters'),
    description: z.string().max(200, "Description must be at most 200 characters long")
    .optional()
});

module.exports = courseSchema;
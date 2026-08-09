// import {z} from "zod";

const z = require("zod");

// Manual validition

// DRY Dont repeat Your self
// schema describe the data format
// const schema = z.object({
//   email : z.string().email().trim().toLowerCase(), 
//   age : z.number().min(18),
//   name : z.string().min(2)
// });
// schema.parse({email : "test@gmail.com", age : 20, name : "test"})
// schema.parse(req.body);
// the most popular validition libiraryies 
// 1.ZOD 2.Joi 3.Yup(react) 4.AJV
const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name) {
    errors.push("Name is required");
  } else if (typeof name !== 'string' || name.trim().length < 3) {
    errors.push("Name must be at least 3 characters long");
  }

  if (!email) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Email format is invalid");
    }
  }

  if (!password) {
    errors.push("Password is required");
  } else if (typeof password !== 'string' || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
};

module.exports = validateUser;


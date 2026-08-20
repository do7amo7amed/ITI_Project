//src/middlewares/validator.js
//checks body against zod schema

const { responseHandler } = require('../utils/responseHandler');

//takes registerSchema & loginSchema for ex
const validate = (schema) => { 
  //returns new fun
  return (req, res, next) => { 
    const result = schema.safeParse(req.body);
    //zod validation failed
    if (!result.success) {
     return responseHandler(res, 400, 'Validation failed', result.error.issues);
    }
    req.body = result.data; 
    next();
  };
};

module.exports = validate;

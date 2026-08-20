//src/routes/authRoutes.js
//maps url to controller functions

const express = require('express');
const router = express.Router(); 
const { register, login } = require('../controllers/authController');
const { validate } = require('../middlewares');
const { registerSchema, loginSchema } = require('../validators/authSchema');

//validation -> next -> controller
router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

module.exports = router;

//src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

router.use(authenticate);


router.route('/profile')
  .get(userController.getProfile)
  .put(
   
    userController.updateProfile
  );


router.route('/:id')
  .delete(
    authorize('admin'), 
    userController.deleteUser
  );

module.exports = router;

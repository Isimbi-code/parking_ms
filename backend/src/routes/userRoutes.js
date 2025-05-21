const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authUtils = require('../utils/auth');

// Protect all routes
router.use(authUtils.protect);

// Admin only routes


router.get('/', authUtils.restrictTo('ADMIN'), userController.getAllUsers);

// User routes

router.patch('/update-profile', userController.updateProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authUtils = require('../utils/auth');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authUtils.protect, authController.getMe);

module.exports = router;
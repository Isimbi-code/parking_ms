const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authController = require('../controllers/authController');
const authUtils = require('../utils/auth');

// Protect all routes
router.use(authUtils.protect);

router.post('/', requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.patch('/:id', requestController.updateRequest);

module.exports = router;
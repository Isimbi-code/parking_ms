const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const authController = require('../controllers/authController');
const authUtils = require('../utils/auth');

// Protect all routes
router.use(authUtils.protect);

// Admin only routes
router.post('/bulk', authUtils.restrictTo('ADMIN'), slotController.createSlots);
router.post('/', authUtils.restrictTo('ADMIN'), slotController.createSingleSlot);
router.patch('/:id', authUtils.restrictTo('ADMIN'), slotController.updateSlot);
router.delete('/:id', authUtils.restrictTo('ADMIN'), slotController.deleteSlot);

// All authenticated users
router.get('/', slotController.getAllSlots);
router.get('/available', slotController.getAvailableSlots);

module.exports = router;
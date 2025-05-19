const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');
const authUtils = require('../utils/auth');

// Protect all routes
router.use(authUtils.protect);

router.post('/', vehicleController.addVehicle);
router.get('/', vehicleController.getUserVehicles);
router.patch('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
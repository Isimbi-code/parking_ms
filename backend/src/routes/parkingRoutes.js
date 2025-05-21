const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const authUtils = require('../utils/auth');

router.use(authUtils.protect);

router.post('/', authUtils.restrictTo('ADMIN'), parkingController.createParking);
router.get('/', parkingController.getAllParkings);
router.post('/spaces', authUtils.restrictTo('ADMIN'), parkingController.createSpace);
router.get('/spaces', parkingController.getAllAvailableSpaces);

module.exports = router;

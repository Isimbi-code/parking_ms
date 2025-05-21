const express = require('express');
const router = express.Router();

const { enterCar, exitCar } = require('../controllers/carController');



const authUtils = require('../utils/auth');

router.use(authUtils.protect);


router.post('/enter', async (req, res) => {
  try {
    const { parkingCode, userId, plateNumber } = req.body;
    const result = await enterCar(parkingCode, userId, plateNumber);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error on entry:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.post('/exit', async (req, res) => {
  try {
    const { parkingCode, userId } = req.body;
    const result = await exitCar(parkingCode, userId);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error on exit:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const { enterCar, exitCar } = require('../controllers/carController');



const authUtils = require('../utils/auth');

router.use(authUtils.protect);

/**
 * @swagger
 * /api/cars/enter:
 *   post:
 *     summary: Register car entry into parking
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parkingCode:
 *                 type: string
 *               userId:
 *                 type: string
 *               plateNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Car entry registered successfully
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/cars/exit:
 *   post:
 *     summary: Register car exit from parking
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parkingCode:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Car exit registered successfully
 *       500:
 *         description: Server error
 */

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

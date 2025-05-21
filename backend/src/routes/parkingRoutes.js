const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const authUtils = require('../utils/auth');

router.use(authUtils.protect);

/**
 * @swagger
 * /api/parkings:
 *   post:
 *     summary: Create a new parking (ADMIN only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parking created successfully
 *       403:
 *         description: Forbidden
 */
router.post('/', authUtils.restrictTo('ADMIN'), parkingController.createParking);

/**
 * @swagger
 * /api/parkings:
 *   get:
 *     summary: Get all parkings
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parkings
 *       401:
 *         description: Unauthorized
 */
router.get('/', parkingController.getAllParkings);

/**
 * @swagger
 * /api/parkings/spaces:
 *   post:
 *     summary: Create a new parking space (ADMIN only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parkingId:
 *                 type: string
 *               spaceNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parking space created successfully
 *       403:
 *         description: Forbidden
 */
router.post('/spaces', authUtils.restrictTo('ADMIN'), parkingController.createSpace);

/**
 * @swagger
 * /api/parkings/spaces:
 *   get:
 *     summary: Get all available parking spaces
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available spaces
 *       401:
 *         description: Unauthorized
 */
router.get('/spaces', parkingController.getAllAvailableSpaces);

module.exports = router;

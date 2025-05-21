const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logAction } = require('../utils/logger');


// admins only
exports.createParking = async (req, res) => {
  try {
    const { code, name, Fee, location } = req.body;
    const userId = req.user.id;

    // Validate
    if (!code || !name || !Fee || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parking = await prisma.parking.create({
      data: { code, name, Fee, location, userId }
    });

    res.status(201).json({ status: 'success', data: { parking } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create parking' });
  }
};



// Get all parkings
exports.getAllParkings = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', name, Fee, location } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {
      AND: [
        { code: { contains: search, mode: 'insensitive' } },
        name ? { name } : {},
        Fee ? { Fee } : {},
        location ? { location } : {},
      ],
    };

    const parkings = await prisma.parking.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const totalParkings = await prisma.parking.count({ where: whereClause });

    // Log action
    // await logAction(req.user.id, 'PAS_VIEW');

    res.status(200).json({
      status: 'success',
      results: parkings.length,
      total: totalParkings,
      data: {
        parkings,
      },
    });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: 'Failed to get parkings' });
  }
};





exports.createSpace = async (req, res) => {
  try {
    const { spaceNumber, parkingId } = req.body;

    const spaceNum = parseInt(spaceNumber, 10);

    if (isNaN(spaceNum)) {
      return res.status(400).json({ error: "spaceNumber must be a valid number" });
    }


    const request = await prisma.space.create({
      data: {
        spaceNumber: spaceNum,
        parkingId: parseInt(parkingId),
      },
      include: {
        parking: true,
      }
    });

    // Log action
    await logAction(req.user.id, 'SPACE_CREATE');

    res.status(201).json({
      status: 'success',
      data: {
        request,
      },
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};


exports.getAllAvailableSpaces = async (req, res) => {
  try {

    const { parkingId } = req.query;

    if (!parkingId) {
      return res.status(400).json({ error: 'parkingId is required' });
    }

    const availableSpaces = await prisma.space.findMany({
      where: {
        parkingId: parseInt(parkingId),
      },
      include: {
        parking: true, // Optional: only if you want to return related parking data
      },
    });

    res.status(200).json({
      status: 'success',
      results: availableSpaces.length,
      data: {
        spaces: availableSpaces,
      },
    });
  } catch (error) {
    console.error('Error fetching available spaces:', error);
    res.status(500).json({ error: 'Failed to retrieve available spaces' });
  }
};

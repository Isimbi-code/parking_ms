const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logAction } = require('../utils/auth');

// Add a new vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { plateNumber, type, size, attributes } = req.body;

    // Check if vehicle already exists
    const existingVehicle = await prisma.vehicle.findUnique({ where: { plateNumber } });
    if (existingVehicle) {
      return res.status(400).json({ error: 'Vehicle with this plate number already exists' });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        type,
        size,
        attributes: attributes || {},
        userId: req.user.id,
      },
    });

    // Log action
    // await logAction(req.user.id, 'VEHICLE_ADD');

    res.status(201).json({
      status: 'success',
      data: {
        vehicle,
      },
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
};

// Get all vehicles for a user
exports.getUserVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {
      userId: req.user.id,
      OR: [
        { plateNumber: { contains: search, mode: 'insensitive' } },

        // Only add this filter if search matches an actual enum value
        ...(search
          ? [
            {
              type: search.toUpperCase(), // assuming enum values are uppercase (e.g., 'CAR', 'TRUCK')
            },
          ]
          : []),
      ],
    };

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const totalVehicles = await prisma.vehicle.count({ where: whereClause });

    // Log action
    // await logAction(req.user.id, 'VEHICLES_VIEW');

    res.status(200).json({
      status: 'success',
      results: vehicles.length,
      total: totalVehicles,
      data: {
        vehicles,
      },
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to get vehicles' });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { plateNumber, type, size, attributes } = req.body;

    // Check if vehicle belongs to user
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found or not owned by user' });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: {
        plateNumber,
        type,
        size,
        attributes: attributes || vehicle.attributes,
      },
    });

    // Log action
    // await logAction(req.user.id, 'VEHICLE_UPDATE');

    res.status(200).json({
      status: 'success',
      data: {
        vehicle: updatedVehicle,
      },
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle belongs to user
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found or not owned by user' });
    }

    // Check if vehicle has pending requests
    const pendingRequests = await prisma.request.findFirst({
      where: { vehicleId: parseInt(id), status: 'PENDING' },
    });

    if (pendingRequests) {
      return res.status(400).json({ error: 'Cannot delete vehicle with pending slot requests' });
    }

    await prisma.vehicle.delete({ where: { id: parseInt(id) } });

    // Log action
    // await logAction(req.user.id, 'VEHICLE_DELETE');

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};
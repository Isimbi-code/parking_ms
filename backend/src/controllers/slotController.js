const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logAction } = require('../utils/auth');

// Create parking slots in bulk (admin only)
exports.createSlots = async (req, res) => {
  try {
    const { slots } = req.body;

    if (!Array.isArray(slots)) {
      return res.status(400).json({ error: 'Slots must be an array' });
    }

    // Validate each slot
    for (const slot of slots) {
      if (!slot.slotNumber || !slot.size || !slot.type || !slot.location) {
        return res.status(400).json({ error: 'Each slot must have slotNumber, size, type, and location' });
      }
    }

    // Create slots
    const createdSlots = await prisma.$transaction(
      slots.map(slot =>
        prisma.parkingSlot.create({
          data: {
            slotNumber: slot.slotNumber,
            size: slot.size,
            type: slot.type,
            location: slot.location,
          },
        })
      )
    );

    // Log action
    // await logAction(req.user.id, 'SLOTS_CREATE_BULK');

    res.status(201).json({
      status: 'success',
      data: {
        slots: createdSlots,
      },
    });
  } catch (error) {
    console.error('Create slots error:', error);
    res.status(500).json({ error: 'Failed to create slots' });
  }
};

// In your controller
exports.createSingleSlot = async (req, res) => {
  try {
    const { slotNumber, size, type, location } = req.body;

    // Validate
    if (!slotNumber || !size || !type || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const slot = await prisma.parkingSlot.create({
      data: { slotNumber, size, type, location }
    });

    res.status(201).json({ status: 'success', data: { slot } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create slot' });
  }
};



// Get all parking slots (admin gets all, user gets only available)
exports.getAllSlots = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', type, size, location, status } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {
      AND: [
        { slotNumber: { contains: search, mode: 'insensitive' } },
        type ? { type } : {},
        size ? { size } : {},
        location ? { location } : {},
        status ? { status } : {},
        req.user.role === 'USER' ? { status: 'AVAILABLE' } : {},
      ],
    };

    const slots = await prisma.parkingSlot.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const totalSlots = await prisma.parkingSlot.count({ where: whereClause });

    // Log action
    // await logAction(req.user.id, 'SLOTS_VIEW');

    res.status(200).json({
      status: 'success',
      results: slots.length,
      total: totalSlots,
      data: {
        slots,
      },
    });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: 'Failed to get slots' });
  }
};

// Get available slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, size, location } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {
      status: 'AVAILABLE',
      ...(type && { type }),
      ...(size && { size }),
      ...(location && { location })
    };

    const slots = await prisma.parkingSlot.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const totalSlots = await prisma.parkingSlot.count({ where: whereClause });

    res.status(200).json({
      status: 'success',
      results: slots.length,
      total: totalSlots,
      data: {
        slots,
      },
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ error: 'Failed to get available slots' });
  }
};




// Update a parking slot (admin only)
exports.updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { slotNumber, size, type, location, status } = req.body;

    const slot = await prisma.parkingSlot.findUnique({ where: { id: parseInt(id) } });
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    // Check if slot is assigned to any approved request
    if (status === 'AVAILABLE' && slot.status === 'UNAVAILABLE') {
      const assignedRequest = await prisma.request.findFirst({
        where: { slotId: parseInt(id), status: 'APPROVED' },
      });

      if (assignedRequest) {
        return res.status(400).json({ error: 'Cannot make slot available as it is assigned to an approved request' });
      }
    }

    const updatedSlot = await prisma.parkingSlot.update({
      where: { id: parseInt(id) },
      data: {
        slotNumber,
        size,
        type,
        location,
        status,
      },
    });

    // Log action
    // await logAction(req.user.id, 'SLOT_UPDATE');

    res.status(200).json({
      status: 'success',
      data: {
        slot: updatedSlot,
      },
    });
  } catch (error) {
    console.error('Update slot error:', error);
    res.status(500).json({ error: 'Failed to update slot' });
  }
};

// Delete a parking slot (admin only)
exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await prisma.parkingSlot.findUnique({ where: { id: parseInt(id) } });
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    // Check if slot is assigned to any request
    const assignedRequests = await prisma.request.findFirst({
      where: { slotId: parseInt(id) },
    });

    if (assignedRequests) {
      return res.status(400).json({ error: 'Cannot delete slot as it is assigned to a request' });
    }

    await prisma.parkingSlot.delete({ where: { id: parseInt(id) } });

    // Log action
    // await logAction(req.user.id, 'SLOT_DELETE');

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Delete slot error:', error);
    res.status(500).json({ error: 'Failed to delete slot' });
  }
};
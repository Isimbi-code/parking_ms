const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logAction } = require('../utils/auth');
const { sendSlotApprovalEmail } = require('../utils/email');

// Create a slot request
exports.createRequest = async (req, res) => {
  try {
    const { vehicleId, slotId } = req.body;

    // Check if vehicle belongs to user
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: parseInt(vehicleId), userId: req.user.id },
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found or not owned by user' });
    }

    // Check if slot exists and is available
    const slot = await prisma.parkingSlot.findUnique({
      where: { id: parseInt(slotId) },
    });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    if (slot.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'This slot is not available' });
    }

    // Check if slot matches vehicle requirements
    if (slot.type !== vehicle.type) {
      return res.status(400).json({ error: 'Slot type does not match vehicle type' });
    }

    if (
      (vehicle.size === 'LARGE' && slot.size !== 'LARGE') ||
      (vehicle.size === 'MEDIUM' && slot.size === 'SMALL')
    ) {
      return res.status(400).json({ error: 'Slot size is not suitable for this vehicle' });
    }

    // Check if vehicle already has a pending request
    const existingRequest = await prisma.request.findFirst({
      where: { vehicleId: parseInt(vehicleId), status: 'PENDING' },
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'This vehicle already has a pending request' });
    }

    const request = await prisma.request.create({
      data: {
        userId: req.user.id,
        vehicleId: parseInt(vehicleId),
        slotId: parseInt(slotId),
        slotNumber: slot.slotNumber,
        status: 'PENDING',
      },
      include: {
        slot: true,
        vehicle: true
      }
    });

    // Log action
    // await logAction(req.user.id, 'REQUEST_CREATE');

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

// Get all requests (admin gets all, user gets their own)
exports.getAllRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {
      AND: [
        status ? { status } : {},
        req.user.role === 'USER' ? { userId: req.user.id } : {},
        {
          OR: [
            { vehicle: { plateNumber: { contains: search, mode: 'insensitive' } } },
            { slot: { slotNumber: { contains: search, mode: 'insensitive' } } },
          ],
        },
      ],
    };

    const requests = await prisma.request.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            type: true,
            size: true,
          },
        },
        slot: {
          select: {
            id: true,
            slotNumber: true,
            size: true,
            type: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const totalRequests = await prisma.request.count({ where: whereClause });

    // Log action
    // await logAction(req.user.id, 'REQUESTS_VIEW');

    res.status(200).json({
      status: 'success',
      results: requests.length,
      total: totalRequests,
      data: {
        requests,
      },
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to get requests' });
  }
};

// Update a request (admin can approve/reject, user can cancel)
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, slotId } = req.body;

    const request = await prisma.request.findUnique({
      where: { id: parseInt(id) },
      include: {
        vehicle: true,
        user: true,
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // User can only cancel their own pending requests
    if (req.user.role === 'USER') {
      if (request.userId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this request' });
      }

      if (status !== 'REJECTED') {
        return res.status(400).json({ error: 'Users can only cancel (reject) their own requests' });
      }

      if (request.status !== 'PENDING') {
        return res.status(400).json({ error: 'Only pending requests can be cancelled' });
      }

      const updatedRequest = await prisma.request.update({
        where: { id: parseInt(id) },
        data: { status: 'REJECTED' },
      });

      // Log action
      // await logAction(req.user.id, 'REQUEST_CANCEL');

      return res.status(200).json({
        status: 'success',
        data: {
          request: updatedRequest,
        },
      });
    }

    // Admin can approve or reject
    if (status === 'APPROVED') {
      if (!slotId) {
        return res.status(400).json({ error: 'Slot ID is required for approval' });
      }

      // Check if slot is available and matches vehicle type/size
      const slot = await prisma.parkingSlot.findUnique({ where: { id: parseInt(slotId) } });
      if (!slot || slot.status !== 'AVAILABLE') {
        return res.status(400).json({ error: 'Slot is not available' });
      }

      if (slot.type !== request.vehicle.type) {
        return res.status(400).json({ error: 'Slot type does not match vehicle type' });
      }

      // Check if slot size can accommodate vehicle
      if (
        (request.vehicle.size === 'LARGE' && slot.size !== 'LARGE') ||
        (request.vehicle.size === 'MEDIUM' && slot.size === 'SMALL')
      ) {
        return res.status(400).json({ error: 'Slot size is not suitable for this vehicle' });
      }

      // Update slot status
      await prisma.parkingSlot.update({
        where: { id: parseInt(slotId) },
        data: { status: 'UNAVAILABLE' },
      });

      // Update request
      const updatedRequest = await prisma.request.update({
        where: { id: parseInt(id) },
        data: {
          status: 'APPROVED',
          slotId: parseInt(slotId),
          slotNumber: slot.slotNumber,
        },
        include: {
          vehicle: true,
          slot: true,
          user: true,
        },
      });

      // Send approval email
      await sendSlotApprovalEmail(
        request.user,
        slot,
        request.vehicle
      );

      // Log action
      // await logAction(req.user.id, 'REQUEST_APPROVE');

      return res.status(200).json({
        status: 'success',
        data: {
          request: updatedRequest,
        },
      });
    } else if (status === 'REJECTED') {
      const updatedRequest = await prisma.request.update({
        where: { id: parseInt(id) },
        data: { status: 'REJECTED' },
      });

      // Log action
      // await logAction(req.user.id, 'REQUEST_REJECT');

      return res.status(200).json({
        status: 'success',
        data: {
          request: updatedRequest,
        },
      });
    } else {
      return res.status(400).json({ error: 'Invalid status update' });
    }
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
};
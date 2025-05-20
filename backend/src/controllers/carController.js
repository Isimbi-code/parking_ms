const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.enterCar = async function enterCar(parkingCode, userId) {
  // Find the parking lot by code
  const parking = await prisma.parking.findUnique({
    where: { code: parkingCode },
  });

  if (!parking) {
    throw new Error('Parking not found');
  }

  // Find the first available space
  const space = await prisma.space.findFirst({
    where: {
      parkingId: parking.id,
      status: 'AVAILABLE',
    },
  });

  if (!space) {
    throw new Error('Parking lot is full');
  }

  // Create a parking entry
  const entry = await prisma.carEntry.create({
    data: {
      userId,
      parkingId: parking.id,
    },
  });

  // Mark the space as OCCUPIED
  await prisma.space.update({
    where: { id: space.id },
    data: { status: 'UNAVAILABLE' },
  });

  // Create ticket
  const ticket = await prisma.ticket.create({
    data: {
      userId,
      parkingCode,
      amount: parking.fee,
    },
  });

  // Create bill
  const bill = await prisma.bill.create({
    data: {
      userId,
      parkingCode,
      amount: ticket.amount,
    },
  });

  return { entry, ticket, bill };
}


module.exports.exitCar= async function exitCar(parkingCode, userId) {
  // Find the parking lot
  const parking = await prisma.parking.findUnique({
    where: { code: parkingCode },
  });

  if (!parking) {
    throw new Error('Parking not found');
  }

  // Get the latest entry
  const entry = await prisma.carEntry.findFirst({
    where: {
      userId,
      parkingId: parking.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!entry) {
    throw new Error('Parking entry not found');
  }

  // Find the space number used (if stored in entry or needs mapping)
  const space = await prisma.space.findFirst({
    where: {
      parkingId: parking.id,
      status: 'UNAVAILABLE',
    },
  });

  if (!space) {
    throw new Error('Occupied space not found');
  }

  const entryTime = carEntry.entryTimeDate;
  const exitTime = carExit.exitTimeDate;
  if (!entryTime || !exitTime) {
    throw new Error('Entry or exit time not found');
  }
  const durationMs = exitTime - entryTime;
  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Round up to full hours

  const totalFee = durationHours * parking.fee;

  // Create car exit
  const exit = await prisma.carExit.create({
    data: {
      userId,
      parkingId: parking.id,
      spaceNumber: space.spaceNumber,
    },
  });

  // Free the space
  await prisma.space.update({
    where: { id: space.id },
    data: { status: 'AVAILABLE' },
  });

  // Update the ticket and bill
  await prisma.ticket.updateMany({
    where: {
      userId,
      parkingCode,
    },
    data: {
      amount: totalFee,
    },
  });

  await prisma.bill.updateMany({
    where: {
      userId,
      parkingCode,
    },
    data: {
      amount: totalFee,
    },
  });

  return { exit, totalFee, durationHours };
}

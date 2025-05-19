const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const logAction = async (userId, action) => {
    try {
        await prisma.log.create({
            data: {
                userId,
                action,
            },
        });
    } catch (error) {
        console.error('Error logging action:', error);
    }
};

module.exports = {
    logAction,
};
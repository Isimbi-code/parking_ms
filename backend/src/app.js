require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const prisma = require('@prisma/client');
const { PrismaClient } = prisma;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));



// Database connection
const prismaClient = new PrismaClient();

// Test database connection
prismaClient.$connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const parkingRoutes = require('./routes/parkingRoutes');



app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/parkings', parkingRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Smart Parking System API');
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
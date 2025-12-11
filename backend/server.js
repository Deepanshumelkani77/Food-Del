const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','https://food-del-beta-ebon.vercel.app/','https://food-del-admin-sigma.vercel.app/'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Start server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

// Enable CORS with specific origin and credentials
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://food-del-beta-ebon.vercel.app/','https://food-del-admin-sigma.vercel.app/'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));



// Database connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit process with failure
  }
};

connectDB();





const foodRoutes = require('./routes/Food');
app.use('/food', foodRoutes);
const userRoutes = require('./routes/User');
app.use('/user', userRoutes);
const cartRoutes = require('./routes/Cart');
app.use('/cart', cartRoutes);
const orderRoutes = require('./routes/order');
app.use('/order', orderRoutes);
const reviewRoutes = require('./routes/Review');
app.use('/review', reviewRoutes);
const adminRoutes = require('./routes/Admin');
app.use('/admin', adminRoutes);
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Main entry point for requested route
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

// General route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'secure and healthy' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mv-jewelers';

// Attempt DB connection, but don't crash aggressively if it's missing just for scaffolding
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connection established securely.');
    app.listen(PORT, () => {
      console.log(`Server running securely on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });

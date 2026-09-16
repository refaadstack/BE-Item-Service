import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/itemRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { sendErrorResponse } from './utils/response.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  });
});

// console.log('itemRoutes is:', itemRoutes);

// Routes
app.use('/api/items', itemRoutes);

// 404 handler
app.use('*', (req, res) => {
  sendErrorResponse(res, 404, 'Endpoint not found');
});

// Error handling middleware
app.use(errorHandler);

export default app;

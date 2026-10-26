import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './infrastructure/db';
import { authenticateJWT } from './infrastructure/auth';

import { authRoutes } from './modules/auth';
import { initKitchenModule, kitchenRoutes } from './modules/kitchen';
import { initTableModule, tableRoutes } from './modules/table';
import { initBillingModule, billingRoutes } from './modules/billing';
import { initInventoryModule, inventoryRoutes } from './modules/inventory';
import { initAnalyticsModule, analyticsRoutes } from './modules/analytics';
import { initOrderModule, orderRoutes } from './modules/order';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Initialize and register modules in the correct order so subscribers attach before publishers can emit
// Auth -> Kitchen -> Table -> Billing -> Inventory -> Analytics -> Order
// Auth doesn't have subscribers to init in this setup
initKitchenModule();
initTableModule();
initBillingModule();
initInventoryModule();
initAnalyticsModule();
initOrderModule();

// Routes that do NOT require authentication
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.status(200).json({ status: 'ok', db: 'connected' });
  } else {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});
app.use('/api/auth', authRoutes);

// Apply authentication middleware for all subsequent routes
app.use(authenticateJWT);

// Mount module routes
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// The Order module handles both /api/menu and /api/orders.
app.use('/api', orderRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Exception:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

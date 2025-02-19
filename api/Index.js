import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

// Import controllers
import { register, login, getUserProfile, updateProfile } from './Controller/AuthController.js';
import { createExpense, getExpenses, deleteExpense, updateExpense } from './Controller/ExpenseController.js';
import { initializeWallet, getWalletDetails, addFunds, deductFunds, getTransactionHistory, setMonthlyBudget, getMonthlyStats } from './Controller/WalletController.js';
import { protect } from './Middleware/authMiddleware.js';
import { exportExpenses } from './Controller/ExportController.js';

// Initialize app
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Configuration
app.use((req, res, next) => {
  const allowedOrigins = ['https://farmeshexpenses.netlify.app', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
  fs.mkdirSync('./uploads/profiles');
}

// Auth routes
app.post('/api/register', register);
app.post('/api/login', login);
app.get('/api/profile', protect, getUserProfile);
app.put('/api/profile', protect, updateProfile);

// Expense routes
app.post('/api/expenses', protect, createExpense);
app.get('/api/expenses', protect, getExpenses);
app.delete('/api/expenses/:id', protect, deleteExpense);
app.put('/api/expenses/:id', protect, updateExpense);
app.get('/api/expenses/export', protect, exportExpenses);

// Wallet routes
app.get('/api/wallet/initialize', protect, initializeWallet);
app.get('/api/wallet', protect, getWalletDetails);
app.post('/api/wallet/add', protect, addFunds);
app.post('/api/wallet/deduct', protect, deductFunds);
app.get('/api/wallet/transactions', protect, getTransactionHistory);
app.post('/api/wallet/monthly-budget', protect, setMonthlyBudget);
app.get('/api/wallet/monthly-stats', protect, getMonthlyStats);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
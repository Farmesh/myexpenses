import Expense from '../Models/Expense.js';
import Wallet from '../Models/Wallet.js';
import moment from 'moment';

// Create expense
export const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid amount' });
    }

    // Find user's wallet
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Check if sufficient balance
    if (wallet.currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create expense
    const expense = await Expense.create({
      user: req.user._id,
      amount: parseFloat(amount),
      description,
      category,
      date: date || new Date()
    });

    // Update wallet
    wallet.currentBalance -= parseFloat(amount);
    wallet.transactions.push({
      type: 'debit',
      amount: parseFloat(amount),
      description: description || 'Expense',
      date: new Date()
    });

    await wallet.save();

    res.status(201).json({
      expense,
      walletBalance: wallet.currentBalance,
      transactions: wallet.transactions
    });
  } catch (error) {
    console.error('Create Expense Error:', error);
    res.status(500).json({ 
      message: 'Error creating expense',
      error: error.message 
    });
  }
};

// Get expenses
export const getExpenses = async (req, res) => {
  try {
    const { filter, sort } = req.query;
    let query = { user: req.user._id };
    
    // Apply date filters
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today };
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query.date = { $gte: weekAgo };
    } else if (filter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query.date = { $gte: monthAgo };
    }

    // Apply sorting
    let sortOption = { date: -1 }; // default sort by date
    if (sort === 'amount') {
      sortOption = { amount: -1 };
    } else if (sort === 'category') {
      sortOption = { category: 1 };
    }

    const expenses = await Expense.find(query).sort(sortOption);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const amountDifference = req.body.amount - expense.amount;
    if (amountDifference > 0 && wallet.currentBalance < amountDifference) {
      return res.status(400).json({ message: 'Insufficient balance for update' });
    }

    // Update wallet balance
    wallet.currentBalance -= amountDifference;
    if (amountDifference !== 0) {
      wallet.transactions.push({
        type: amountDifference > 0 ? 'DEBIT' : 'CREDIT',
        amount: Math.abs(amountDifference),
        description: `Expense update: ${expense.description}`,
        date: new Date()
      });
      await wallet.save();
    }

    Object.assign(expense, req.body);
    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Find wallet and refund the amount
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Refund the amount to wallet
    wallet.currentBalance += expense.amount;
    
    // Add refund transaction
    wallet.transactions.push({
      type: 'credit',
      amount: expense.amount,
      description: `Refund: ${expense.description} (Deleted)`,
      date: new Date()
    });

    // Delete expense and update wallet
    await Promise.all([
      expense.deleteOne(),
      wallet.save()
    ]);

    res.json({
      message: 'Expense deleted successfully',
      currentBalance: wallet.currentBalance,
      transactions: wallet.transactions
    });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
};

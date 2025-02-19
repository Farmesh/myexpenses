import Expense from '../Models/Expense.js';
import Wallet from '../Models/Wallet.js';
import moment from 'moment';

// Create expense
export const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    // Enhanced validation
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid amount' });
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const parsedAmount = parseFloat(amount);

    // Find and validate wallet
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Check balance
    if (wallet.currentBalance < parsedAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create expense with validated data
    const expense = await Expense.create({
      user: req.user._id,
      amount: parsedAmount,
      description: description.trim(),
      category,
      date: date || new Date()
    });

    // Update wallet balance and add transaction
    wallet.currentBalance -= parsedAmount;
    wallet.transactions.push({
      type: 'debit',
      amount: parsedAmount,
      description: `Expense: ${description.trim()}`,
      date: new Date()
    });

    await wallet.save();

    // Return updated data
    res.status(201).json({
      expense,
      walletBalance: wallet.currentBalance,
      transactions: wallet.transactions
    });

  } catch (error) {
    console.error('Create Expense Error:', error);
    res.status(500).json({ 
      message: error.message || 'Error creating expense'
    });
  }
};

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Get Expenses Error:', error);
    res.status(500).json({ message: 'Error fetching expenses' });
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

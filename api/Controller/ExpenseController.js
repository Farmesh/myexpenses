import Expense from '../Models/Expense.js';
import Wallet from '../Models/Wallet.js';
import moment from 'moment';

// Create expense
export const createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    // Check wallet balance
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet || wallet.currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const expense = new Expense({
      user: req.user._id,
      description,
      amount,
      category,
      date: date || new Date()
    });

    // Update wallet balance
    wallet.currentBalance -= amount;
    wallet.transactions.push({
      type: 'DEBIT',
      amount,
      description: `Expense: ${description}`,
      date: new Date()
    });

    await Promise.all([expense.save(), wallet.save()]);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Update wallet balance
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (wallet) {
      wallet.currentBalance += expense.amount;
      wallet.transactions.push({
        type: 'CREDIT',
        amount: expense.amount,
        description: `Expense deleted: ${expense.description}`,
        date: new Date()
      });
      await wallet.save();
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted', amount: expense.amount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

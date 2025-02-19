import Wallet from '../Models/Wallet.js';
import moment from 'moment';

// Initialize wallet for a new user
export const initializeWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
      wallet = new Wallet({
        user: req.user._id,
        currentBalance: 0,
        monthlyBudget: 0,
        monthlyExpenses: [{
          month: moment().format('MMMM YYYY'),
          year: moment().year(),
          spent: 0,
          budget: 0
        }]
      });
      await wallet.save();
    }
    
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wallet balance and transactions
export const getWalletDetails = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set monthly budget
export const setMonthlyBudget = async (req, res) => {
  try {
    const { amount } = req.body;
    const currentDate = moment();
    const currentMonth = currentDate.format('MMMM YYYY');

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Update monthly budget
    wallet.monthlyBudget = amount;

    // Update or add monthly expense record
    const monthIndex = wallet.monthlyExpenses.findIndex(
      exp => exp.month === currentMonth
    );

    if (monthIndex === -1) {
      wallet.monthlyExpenses.push({
        month: currentMonth,
        year: currentDate.year(),
        budget: amount,
        spent: 0
      });
    } else {
      wallet.monthlyExpenses[monthIndex].budget = amount;
    }

    // Add transaction record
    wallet.transactions.push({
      type: 'BUDGET_SET',
      amount,
      description: `Monthly budget set for ${currentMonth}`,
      date: new Date()
    });

    await wallet.save();
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add funds to wallet
export const addFunds = async (req, res) => {
  try {
    const { amount, description = 'Added funds' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.currentBalance += parseFloat(amount);
    wallet.transactions.push({
      type: 'CREDIT',
      amount: parseFloat(amount),
      description,
      date: new Date()
    });

    await wallet.save();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deduct funds (for expenses)
export const deductFunds = async (req, res) => {
  try {
    const { amount, description = 'Expense deduction' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update current balance
    wallet.currentBalance -= parseFloat(amount);

    // Update monthly expenses
    const currentMonth = moment().format('MMMM YYYY');
    const monthIndex = wallet.monthlyExpenses.findIndex(
      exp => exp.month === currentMonth
    );

    if (monthIndex === -1) {
      wallet.monthlyExpenses.push({
        month: currentMonth,
        year: moment().year(),
        budget: wallet.monthlyBudget,
        spent: parseFloat(amount)
      });
    } else {
      wallet.monthlyExpenses[monthIndex].spent += parseFloat(amount);
    }

    // Add transaction record
    wallet.transactions.push({
      type: 'DEBIT',
      amount: parseFloat(amount),
      description,
      date: new Date()
    });

    await wallet.save();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transaction history
export const getTransactionHistory = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const transactions = wallet.transactions.sort((a, b) => b.date - a.date);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get monthly stats
export const getMonthlyStats = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const currentMonth = moment().format('MMMM YYYY');
    const monthStats = wallet.monthlyExpenses.find(exp => exp.month === currentMonth) || {
      month: currentMonth,
      year: moment().year(),
      budget: wallet.monthlyBudget,
      spent: 0
    };

    const stats = {
      currentBalance: wallet.currentBalance,
      monthlyBudget: wallet.monthlyBudget,
      currentMonth: monthStats.month,
      spent: monthStats.spent,
      remaining: monthStats.budget - monthStats.spent,
      percentageUsed: ((monthStats.spent / monthStats.budget) * 100) || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add category budget limit
export const addCategoryLimit = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const currentDate = moment();
    
    const wallet = await Wallet.findOne({
      user: req.user._id,
      month: currentDate.format('MMMM'),
      year: currentDate.year()
    });

    if (!wallet) {
      return res.status(404).json({ message: 'No wallet found for this month' });
    }

    const categoryIndex = wallet.categories.findIndex(cat => cat.name === category);
    if (categoryIndex === -1) {
      wallet.categories.push({ name: category, budgetLimit: limit, spent: 0 });
    } else {
      wallet.categories[categoryIndex].budgetLimit = limit;
    }

    await wallet.save();
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get spending alerts
export const getSpendingAlerts = async (req, res) => {
  try {
    const currentDate = moment();
    const wallet = await Wallet.findOne({
      user: req.user._id,
      month: currentDate.format('MMMM'),
      year: currentDate.year()
    });

    if (!wallet) {
      return res.json({ alerts: [] });
    }

    const alerts = [];
    const daysInMonth = currentDate.daysInMonth();
    const dayOfMonth = currentDate.date();
    const expectedSpendingRate = wallet.monthlyBudget / daysInMonth;
    const actualSpendingRate = (wallet.monthlyBudget - wallet.currentBalance) / dayOfMonth;

    // Overall budget alerts
    if (actualSpendingRate > expectedSpendingRate * 1.2) {
      alerts.push({
        type: 'warning',
        message: 'Your spending rate is higher than expected'
      });
    }

    // Category-specific alerts
    wallet.categories.forEach(cat => {
      const spentPercentage = (cat.spent / cat.budgetLimit) * 100;
      if (spentPercentage >= 80) {
        alerts.push({
          type: 'danger',
          message: `You've spent ${spentPercentage.toFixed(1)}% of your ${cat.name} budget`
        });
      }
    });

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
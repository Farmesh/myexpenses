import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One wallet per user
  },
  currentBalance: {
    type: Number,
    required: true,
    default: 0
  },
  monthlyBudget: {
    type: Number,
    required: true,
    default: 0
  },
  monthlyExpenses: [{
    month: String, // e.g., "March 2024"
    year: Number,
    spent: {
      type: Number,
      default: 0
    },
    budget: {
      type: Number,
      default: 0
    }
  }],
  transactions: [{
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT', 'BUDGET_SET'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet; 
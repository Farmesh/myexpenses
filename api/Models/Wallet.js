import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  monthlyBudget: {
    type: Number,
    default: 0
  },
  transactions: [{
    type: {
      type: String,
      enum: ['credit', 'debit'],
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

export default mongoose.model('Wallet', WalletSchema); 
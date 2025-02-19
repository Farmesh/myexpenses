import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentBalance: {
    type: Number,
    default: 0,
    validate: {
      validator: Number.isFinite,
      message: '{VALUE} is not a valid amount'
    }
  },
  monthlyBudget: {
    type: Number,
    default: 0,
    validate: {
      validator: Number.isFinite,
      message: '{VALUE} is not a valid amount'
    }
  },
  transactions: [{
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isFinite,
        message: '{VALUE} is not a valid amount'
      }
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
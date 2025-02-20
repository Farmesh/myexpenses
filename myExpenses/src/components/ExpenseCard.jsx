import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../config/axios';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';
import { withTranslation } from '../hoc/withTranslation';

const ExpenseCard = ({ expense, onDelete, onUpdate, t }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState({ ...expense });
  const { balance, setBalance, setTransactions } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    try {
      setLoading(true);
      const amountDifference = editedExpense.amount - expense.amount;
      
      if (amountDifference > balance) {
        toast.error('Insufficient balance for this update');
        return;
      }

      const { data } = await api.put(`/api/expenses/${expense._id}`, editedExpense);
      
      setBalance(data.walletBalance);
      setTransactions(data.transactions);
      onUpdate(data.expense);
      setIsEditing(false);
      toast.success('Expense updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  if (isEditing) {
    return (
      <motion.div
        className="card h-100"
        variants={cardVariants}
        whileHover="hover"
        layoutId={expense._id}
      >
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={editedExpense.description}
              onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              value={editedExpense.amount}
              onChange={(e) => setEditedExpense({ ...editedExpense, amount: parseFloat(e.target.value) })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={editedExpense.category}
              onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })}
            >
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={handleEdit}
              className="btn btn-primary flex-grow-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card h-100"
      variants={cardVariants}
      whileHover="hover"
      layoutId={expense._id}
    >
      <div className="card-body">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="d-flex justify-content-between align-items-start mb-2"
        >
          <h5 className="card-title">{expense.description}</h5>
          <motion.span
            className="badge bg-primary"
            whileHover={{ scale: 1.1 }}
          >
            {t(expense.category.toLowerCase())}
          </motion.span>
        </motion.div>
        
        <motion.h3 
          className="text-primary mb-3"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          ₹{expense.amount.toFixed(2)}
        </motion.h3>
        
        <p className="text-muted mb-3">
          <i className="far fa-calendar me-2"></i>
          {new Date(expense.date).toLocaleDateString()}
        </p>
        
        <motion.div 
          className="d-flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="btn btn-outline-primary flex-grow-1"
          >
            <i className="fas fa-edit me-2"></i>{t('edit')}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(expense._id)}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="fas fa-trash"></i>
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default withTranslation(ExpenseCard); 
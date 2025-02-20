import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ExpenseCard from './ExpenseCard';
import TransactionHistory from './TransactionHistory';
import { useWallet } from '../context/WalletContext';
import ExportExpenses from './ExportExpenses';
import { motion, AnimatePresence } from 'framer-motion';
import { withTranslation } from '../hoc/withTranslation';

const Dashboard = ({ t }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { balance, monthlyBudget, setNewMonthlyBudget } = useWallet();
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('date'); // date, amount, category
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudget, setNewBudget] = useState('');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter, sortBy]);

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(`https://myexpenses-wf9z.onrender.com/api/expenses?filter=${filter}&sort=${sortBy}`);
      setExpenses(data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`https://myexpenses-wf9z.onrender.com/api/expenses/${id}`);
      setNewMonthlyBudget(data.amount);
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      await setNewMonthlyBudget(parseFloat(newBudget));
      toast.success('Monthly budget set successfully');
      setShowBudgetModal(false);
    } catch (error) {
      toast.error('Failed to set monthly budget');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container py-4"
    >
      {/* Stats Section */}
      <motion.div className="row g-4 mb-4">
        <motion.div 
          className="col-md-4"
          variants={itemVariants}
        >
          <div className="card h-100">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">{t('balance')}</h6>
              <h3 className="text-success mb-0">₹{balance.toFixed(2)}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="col-md-4"
          variants={itemVariants}
        >
          <div className="card h-100">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">{t('monthlyBudget')}</h6>
              <h3 className="text-primary mb-0">₹{monthlyBudget.toFixed(2)}</h3>
              <button 
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => setShowBudgetModal(true)}
              >
                {t('setBudget')}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="col-md-4"
          variants={itemVariants}
        >
          <div className="card h-100">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">{t('totalExpenses')}</h6>
              <h3 className="text-danger mb-0">
                ₹{expenses.reduce((acc, exp) => acc + exp.amount, 0).toFixed(2)}
              </h3>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div 
        className="card mb-4"
        variants={itemVariants}
      >
        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-lg-3">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expenses List */}
      <motion.div 
        className="row g-4"
        variants={itemVariants}
      >
        <AnimatePresence>
          {expenses.map(expense => (
            <motion.div 
              key={expense._id}
              className="col-md-6 col-lg-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ExpenseCard 
                expense={expense} 
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="row mt-4">
        <div className="col">
          <ExportExpenses />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <TransactionHistory />
        </div>
      </div>

      {/* Budget Modal */}
      <AnimatePresence>
        {showBudgetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="modal-dialog"
            >
              <div className="modal-header ">
                <h5 className="modal-title">Set Monthly Budget</h5>
                <button type="button" className="btn-close" onClick={() => setShowBudgetModal(false)}></button>
              </div>
              <form onSubmit={handleSetBudget}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Budget Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBudgetModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Set Budget
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default withTranslation(Dashboard); 
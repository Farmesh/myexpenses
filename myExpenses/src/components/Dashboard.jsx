import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ExpenseCard from './ExpenseCard';
import TransactionHistory from './TransactionHistory';
import { useWallet } from '../context/WalletContext';
import ExportExpenses from './ExportExpenses';
import { motion, AnimatePresence } from 'framer-motion';
import { withTranslation } from '../hoc/withTranslation';
import MonthlyBudget from './MonthlyBudget';
import api from '../config/axios';

const Dashboard = ({ t }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { balance, monthlyBudget, setNewMonthlyBudget } = useWallet();
  const [filters, setFilters] = useState({
    category: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
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
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/expenses');
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
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

  // Filter and sort expenses
  const filteredExpenses = expenses.filter(expense => {
    if (filters.category !== 'all' && expense.category !== filters.category) {
      return false;
    }
    
    if (filters.startDate && new Date(expense.date) < new Date(filters.startDate)) {
      return false;
    }
    
    if (filters.endDate && new Date(expense.date) > new Date(filters.endDate)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    
    if (filters.sortBy === 'date') {
      return (new Date(b.date) - new Date(a.date)) * order;
    }
    if (filters.sortBy === 'amount') {
      return (b.amount - a.amount) * order;
    }
    return 0;
  });

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
          <motion.div 
            className="card h-100"
            whileHover={{ y: -5 }}
          >
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">{t('balance')}</h6>
              <h3 className="text-success mb-0">₹{balance.toFixed(2)}</h3>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="col-md-4"
          variants={itemVariants}
        >
          <motion.div 
            className="card h-100"
            whileHover={{ y: -5 }}
          >
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
          </motion.div>
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

      {/* Filters Section */}
      <motion.div 
        className="card mb-4"
        variants={itemVariants}
      >
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">{t('category')}</label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">{t('allCategories')}</option>
                <option value="Food">{t('food')}</option>
                <option value="Transportation">{t('transportation')}</option>
                <option value="Entertainment">{t('entertainment')}</option>
                <option value="Shopping">{t('shopping')}</option>
                <option value="Bills">{t('bills')}</option>
                <option value="Other">{t('other')}</option>
              </select>
            </div>
            
            <div className="col-md-3">
              <label className="form-label">{t('startDate')}</label>
              <input
                type="date"
                className="form-control"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            
            <div className="col-md-3">
              <label className="form-label">{t('endDate')}</label>
              <input
                type="date"
                className="form-control"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
            
            <div className="col-md-3">
              <label className="form-label">{t('sortBy')}</label>
              <div className="input-group">
                <select
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="date">{t('date')}</option>
                  <option value="amount">{t('amount')}</option>
                </select>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setFilters({
                    ...filters,
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
                  })}
                >
                  <i className={`fas fa-sort-${filters.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                </button>
              </div>
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
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('loading')}</span>
              </div>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="col-12 text-center py-5">
              <h5 className="text-muted">{t('noExpenses')}</h5>
            </div>
          ) : (
            filteredExpenses.map(expense => (
              <motion.div
                key={expense._id}
                className="col-md-6 col-lg-4"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ExpenseCard 
                  expense={expense}
                  onDelete={handleDelete}
                  onUpdate={fetchExpenses}
                />
              </motion.div>
            ))
          )}
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
            className="modal-backdrop"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1050
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <MonthlyBudget onClose={() => setShowBudgetModal(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default withTranslation(Dashboard); 
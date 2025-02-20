import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ExpenseCard from './ExpenseCard';
import TransactionHistory from './TransactionHistory';
import { useWallet } from '../context/WalletContext';
import ExportExpenses from './ExportExpenses';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { balance, monthlyBudget, setNewMonthlyBudget } = useWallet();
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('date'); // date, amount, category
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudget, setNewBudget] = useState('');

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
    <div className="container ">
      <div className="row g-3 m-2">
        <div className="col-12 col-md-4">
          <div className="card dashboard-card primary-gradient">
            <div className="card-body">
              <h5 className="card-title text-white">Current Balance</h5>
              <h2 className="text-white mb-0">₹{balance.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card dashboard-card purple-gradient">
            <div className="card-body">
              <h5 className="card-title text-white">Monthly Budget</h5>
              <h2 className="text-white mb-0">
              ₹{monthlyBudget.toFixed(2)}
                <button 
                  className="btn btn-light btn-sm ms-2"
                  onClick={() => setShowBudgetModal(true)}
                >
                  <i className="fas fa-edit"></i>
                </button>
              </h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card dashboard-card secondary-gradient">
            <div className="card-body">
              <h5 className="card-title text-white">Total Expenses</h5>
              <h2 className="text-white mb-0">
              ₹{expenses.reduce((acc, exp) => acc + exp.amount, 0).toFixed(2)}
              </h2>
            </div>
          </div>
        </div>
      </div>

     

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

      <div className="row mt-4">
        <div className="col">
          <ExportExpenses />
        </div>
      </div>

      <div className="row g-3">
        {expenses.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-receipt fa-3x text-light mb-3"></i>
            <h5 className="text-light">No expenses found</h5>
          </div>
        ) : (
          expenses.map(expense => (
            <div key={expense._id} className="col-12 col-md-6 col-lg-4">
              <ExpenseCard 
                expense={expense} 
                onDelete={handleDelete}
              />
            </div>
          ))
        )}
      </div>

      <div className="row">
        <div className="col">
          <TransactionHistory />
        </div>
      </div>

      {/* Budget Modal */}
      <div className={`modal ${showBudgetModal ? 'show' : ''}`} 
           style={{ display: showBudgetModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
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
          </div>
        </div>
      </div>
      {showBudgetModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default Dashboard; 
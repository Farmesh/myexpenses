import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/axios';
import { useWallet } from '../context/WalletContext';

const AddExpense = () => {
  const navigate = useNavigate();
  const { balance, setBalance, setTransactions } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0]
  });

  const validateForm = () => {
    const amount = parseFloat(formData.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return false;
    }

    if (amount > balance) {
      toast.error('Insufficient balance');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/api/expenses', {
        ...formData,
        amount: parseFloat(formData.amount),
        description: formData.description.trim()
      });
      
      setBalance(data.walletBalance);
      setTransactions(data.transactions);
      
      toast.success('Expense added successfully');
      navigate('/expenses');
    } catch (error) {
      console.error('Add Expense Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                'Add Expense'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense; 
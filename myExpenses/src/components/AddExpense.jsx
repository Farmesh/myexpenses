import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/axios';
import { useWallet } from '../context/WalletContext';

const AddExpense = () => {
  const navigate = useNavigate();
  const { balance, setBalance, setTransactions } = useWallet();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate amount
      const amount = parseFloat(formData.amount);
      if (!amount || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      // Check balance
      if (amount > balance) {
        toast.error('Insufficient balance');
        return;
      }

      const { data } = await api.post('/api/expenses', formData);
      
      // Update wallet context
      setBalance(data.walletBalance);
      setTransactions(data.transactions);
      
      toast.success('Expense added successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Add Expense Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            <button type="submit" className="btn btn-primary w-100">
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense; 
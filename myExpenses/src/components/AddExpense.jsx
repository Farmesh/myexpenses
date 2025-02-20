import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/axios';
import { useWallet } from '../context/WalletContext';
import { withTranslation } from '../hoc/withTranslation';

const AddExpense = ({ t }) => {
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
      navigate('/');
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
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">
                {t('addNewExpense')}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">{t('description')}</label>
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
                  <label className="form-label">{t('amount')}</label>
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
                  <label className="form-label">{t('category')}</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Food">{t('food')}</option>
                    <option value="Transportation">{t('transportation')}</option>
                    <option value="Entertainment">{t('entertainment')}</option>
                    <option value="Shopping">{t('shopping')}</option>
                    <option value="Bills">{t('bills')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">{t('date')}</label>
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
                  {loading ? t('loading') : t('addExpense')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation(AddExpense); 
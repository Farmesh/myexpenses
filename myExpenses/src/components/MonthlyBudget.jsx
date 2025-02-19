import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setNewMonthlyBudget } from '../context/WalletContext';

const MonthlyBudget = () => {
  const [budget, setBudget] = useState('');
  const [categories, setCategories] = useState([
    { name: 'Food', limit: '' },
    { name: 'Transportation', limit: '' },
    { name: 'Entertainment', limit: '' },
    { name: 'Shopping', limit: '' },
    { name: 'Bills', limit: '' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
        toast.error('Please enter a valid budget amount');
        return;
      }

      await setNewMonthlyBudget(parseFloat(budget));
      toast.success('Monthly budget set successfully');
      setBudget('');
    } catch (error) {
      console.error('Budget setting error:', error);
      toast.error(error.message || 'Failed to set monthly budget');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card shadow-lg"
    >
      <div className="card-body">
        <h3 className="card-title mb-4">Set Monthly Budget</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Total Monthly Budget</label>
            <input
              type="number"
              className="form-control form-control-lg"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter total budget"
              required
            />
          </div>

          <h4 className="mb-3">Category Budgets</h4>
          {categories.map((category, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">{category.name}</label>
              <input
                type="number"
                className="form-control"
                value={category.limit}
                onChange={(e) => {
                  const newCategories = [...categories];
                  newCategories[index].limit = e.target.value;
                  setCategories(newCategories);
                }}
                placeholder={`Budget for ${category.name}`}
              />
            </div>
          ))}

          <button type="submit" className="btn btn-primary w-100">
            Set Budget
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default MonthlyBudget; 
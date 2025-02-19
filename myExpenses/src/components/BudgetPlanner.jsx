import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const BudgetPlanner = () => {
  const [plan, setPlan] = useState({
    monthlyIncome: '',
    savingsGoal: '',
    essentials: '',
    nonEssentials: '',
    savings: ''
  });

  const calculateBudget = () => {
    const income = parseFloat(plan.monthlyIncome);
    return {
      essentials: (income * 0.5).toFixed(2),
      nonEssentials: (income * 0.3).toFixed(2),
      savings: (income * 0.2).toFixed(2)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const budget = calculateBudget();
    // Implementation for saving budget plan
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="card-body">
        <h3>Budget Planner</h3>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
        </form>
      </div>
    </motion.div>
  );
};

export default BudgetPlanner; 
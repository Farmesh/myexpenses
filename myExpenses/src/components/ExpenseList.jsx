import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../config/axios';
import { useWallet } from '../context/WalletContext';

const ExpenseList = ({ expenses, setExpenses }) => {
  const { setBalance, setTransactions } = useWallet();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const { data } = await api.delete(`/api/expenses/${id}`);
      
      // Update expenses list
      setExpenses(expenses.filter(expense => expense._id !== id));
      
      // Update wallet data
      setBalance(data.currentBalance);
      setTransactions(data.transactions);
      
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  // ... rest of your component
}; 
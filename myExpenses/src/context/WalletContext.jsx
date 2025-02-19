import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Reset wallet data when user changes or logs out
  useEffect(() => {
    if (!user) {
      setBalance(0);
      setMonthlyBudget(0);
      setTransactions([]);
      return;
    }

    // Fetch user-specific wallet data
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/wallet`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setBalance(response.data.currentBalance);
        setMonthlyBudget(response.data.monthlyBudget);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user]); // Re-fetch when user changes

  const addToWallet = async (amount) => {
    try {
      const response = await axios.post(`${API_URL}/api/wallet/add`, {
        amount,
        description: 'Added funds'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      setBalance(response.data.currentBalance);
      setTransactions(response.data.transactions);
    } catch (error) {
      throw new Error('Failed to add funds');
    }
  };

  const deductFromWallet = async (amount, description = 'Expense deduction') => {
    try {
      const response = await axios.post(`${API_URL}/api/wallet/deduct`, {
        amount,
        description
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      setBalance(response.data.currentBalance);
      setTransactions(response.data.transactions);
    } catch (error) {
      throw new Error('Failed to deduct funds');
    }
  };

  const setNewMonthlyBudget = async (amount) => {
    try {
      const response = await axios.post(`${API_URL}/api/wallet/monthly-budget`, {
        amount
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
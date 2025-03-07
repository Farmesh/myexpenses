import { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const updateWalletState = (data) => {
    if (data.currentBalance !== undefined) {
      setBalance(data.currentBalance);
    }
    if (data.monthlyBudget !== undefined) {
      setMonthlyBudget(data.monthlyBudget);
    }
    if (data.transactions) {
      setTransactions(data.transactions);
    }
  };

  useEffect(() => {
    if (!user) {
      setBalance(0);
      setMonthlyBudget(0);
      setTransactions([]);
      setLoading(false);
      return;
    }

    const fetchWalletData = async () => {
      try {
        const { data } = await api.get('/api/wallet');
        updateWalletState(data);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
        toast.error('Failed to fetch wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user]);

  const addToWallet = async (amount) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await api.post('/api/wallet/add', 
        {
          amount,
          description: 'Added funds'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      setBalance(response.data.currentBalance);
      setTransactions(response.data.transactions);
    } catch (error) {
      throw new Error('Failed to add funds');
    }
  };

  const deductFromWallet = async (amount, description = 'Expense deduction') => {
    try {
      const response = await api.post('/api/wallet/deduct', {
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
      const { data } = await api.post('/api/wallet/monthly-budget', { amount });
      updateWalletState(data);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to set monthly budget:', error);
      throw new Error(error.response?.data?.message || 'Failed to set monthly budget');
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        balance, 
        setBalance,
        monthlyBudget,
        setMonthlyBudget,
        transactions, 
        setTransactions,
        updateWalletState,
        loading,
        addToWallet, 
        deductFromWallet,
        setNewMonthlyBudget
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
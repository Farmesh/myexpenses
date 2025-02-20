import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useWallet } from '../context/WalletContext';

const ExpenseCard = ({ expense, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState(expense);
  const { balance, addToWallet, deductFromWallet } = useWallet();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async () => {
    try {
      const amountDifference = editedExpense.amount - expense.amount;
      
      if (amountDifference > balance) {
        toast.error('Insufficient balance for this update!');
        return;
      }

      await axios.put(`https://myexpenses-wf9z.onrender.com/updateExpense/${expense._id}`, editedExpense);
      
      if (amountDifference > 0) {
        deductFromWallet(amountDifference);
      } else if (amountDifference < 0) {
        addToWallet(Math.abs(amountDifference));
      }

      toast.success('Expense updated successfully');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update expense');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setIsDeleting(true);
      try {
        await onDelete(expense._id);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-2 mb-sm-0">{expense.description}</h5>
          <span className="badge bg-primary">{expense.category}</span>
        </div>
        <h3 className="text-primary mb-3">₹{expense.amount}</h3>
        <p className="text-light mb-3">
          <i className="far fa-calendar me-2"></i>
          {new Date(expense.date).toLocaleDateString()}
        </p>
        <div className="d-flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline-primary flex-grow-1"
          >
            <i className="fas fa-edit me-2 d-none d-sm-inline"></i>Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="fas fa-trash"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard; 
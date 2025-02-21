import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useWallet } from '../context/WalletContext';
import { withTranslation } from '../hoc/withTranslation';

const MonthlyBudget = ({ onClose, t }) => {
  const { setNewMonthlyBudget } = useWallet();
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      toast.error(t('invalidAmount'));
      return;
    }

    setLoading(true);
    try {
      await setNewMonthlyBudget(parseFloat(budget));
      toast.success(t('budgetSetSuccess'));
      onClose();
    } catch (error) {
      console.error('Budget setting error:', error);
      toast.error(error.message || t('budgetSetError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-content border-0">
      <div className="modal-header border-0">
        <h5 className="modal-title">{t('setMonthlyBudget')}</h5>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
        ></button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t('enterBudgetAmount')}</label>
            <div className="input-group">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control form-control-lg"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={t('enterAmount')}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {t('setting')}
                </>
              ) : t('setBudget')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withTranslation(MonthlyBudget); 
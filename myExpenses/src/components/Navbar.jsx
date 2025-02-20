import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { balance, monthlyBudget } = useWallet();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, language, changeLanguage, translate } = useThemeLanguage();

  const handleLogout = () => {
    if (window.confirm(translate('confirmLogout'))) {
      logout();
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="navbar navbar-expand-lg shadow-sm"
      >
        <div className="container">
          <Link to="/" className="navbar-brand">
            <i className="fas fa-wallet me-2 text-primary"></i>
            <span>{translate('expenseTracker')}</span>
          </Link>

          {user && (
            <>
              <div className="d-flex align-items-center gap-2 d-lg-none">
                <select
                  className="form-select form-select-sm"
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                >
                  <option value="en">EN</option>
                  <option value="hi">हि</option>
                </select>
                
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <button
                  className="navbar-toggler"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <i className={`fas fa-bars text-${theme === 'dark' ? 'light' : 'dark'}`}></i>
                </button>
              </div>

              <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                <ul className="navbar-nav mx-auto">
                  <li className="nav-item mx-2">
                    <div className="text-center">
                      <small>{translate('balance')}</small>
                      <div className="h5 mb-0 text-success">₹{balance.toFixed(2)}</div>
                    </div>
                  </li>
                  <li className="nav-item mx-2">
                    <div className="text-center">
                      <small>{translate('monthlyBudget')}</small>
                      <div className="h5 mb-0 text-primary">₹{monthlyBudget.toFixed(2)}</div>
                    </div>
                  </li>
                </ul>

                <div className="d-none d-lg-flex align-items-center gap-3">
                  <select
                    className="form-select form-select-sm"
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                  </select>
                  
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={toggleTheme}
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>

                  <div className="d-flex gap-2">
                    <Link to="/add-expense" className="btn btn-primary btn-sm">
                      <i className="fas fa-plus me-1"></i>
                      {translate('add')}
                    </Link>

                    <Link to="/profile" className="btn btn-outline-secondary btn-sm">
                      <i className="fas fa-user me-1"></i>
                    </Link>

                    <button 
                      onClick={handleLogout} 
                      className="btn btn-outline-danger btn-sm"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <AnimatePresence>
        {user && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="mobile-nav fixed-bottom py-2"
          >
            <div className="container">
              <div className="row g-0">
                <div className="col text-center">
                  <Link to="/" className="btn btn-link">
                    <i className="fas fa-home d-block mb-1"></i>
                    <small>{translate('home')}</small>
                  </Link>
                </div>
                <div className="col text-center">
                  <Link to="/add-expense" className="btn btn-link">
                    <i className="fas fa-plus d-block mb-1"></i>
                    <small>{translate('add')}</small>
                  </Link>
                </div>
                <div className="col text-center">
                  <Link to="/profile" className="btn btn-link">
                    <i className="fas fa-user d-block mb-1"></i>
                    <small>{translate('profile')}</small>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 
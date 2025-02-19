import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { balance, monthlyBudget } = useWallet();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <i className="fas fa-wallet me-2"></i>
            ExpenseTracker
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {user && (
            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
              <div className="d-flex flex-column flex-lg-row align-items-lg-center ms-auto">
                <div className="text-light me-lg-4 mb-2 mb-lg-0">
                  <small className="d-block text-light">Balance</small>
                  <span className="fw-bold">${balance.toFixed(2)}</span>
                </div>
                <div className="text-light me-lg-4 mb-2 mb-lg-0">
                  <small className="d-block text-light">Monthly Budget</small>
                  <span className="fw-bold">${monthlyBudget.toFixed(2)}</span>
                </div>
                <Link to="/" className="btn btn-outline-light me-lg-2 mb-2 mb-lg-0">
                  Dashboard
                </Link>
                <Link to="/add-expense" className="btn btn-success me-lg-3 mb-2 mb-lg-0">
                  <i className="fas fa-plus me-2"></i>Add Expense
                </Link>
                <Link to="/profile" className="btn btn-outline-light me-lg-3 mb-2 mb-lg-0">
                  <img 
                    src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                    alt={user?.name || 'Profile'} 
                    className="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  <span className="d-none d-lg-inline">{user?.name}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-danger mb-2 mb-lg-0"
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="d-lg-none mobile-menu">
        <Link to="/" className="text-light text-center">
          <i className="fas fa-home d-block mb-1"></i>
          <small>Home</small>
        </Link>
        <Link to="/add-expense" className="text-light text-center">
          <i className="fas fa-plus d-block mb-1"></i>
          <small>Add</small>
        </Link>
        <Link to="/profile" className="text-light text-center">
          <i className="fas fa-user d-block mb-1"></i>
          <small>Profile</small>
        </Link>
      </div>
    </>
  );
};

export default Navbar; 
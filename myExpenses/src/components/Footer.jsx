import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5 text-center">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="mb-3">Contact Information</h5>
            <p className="mb-1">
              <i className="fas fa-user me-2"></i>
              Farmesh Kumar
            </p>
            <p className="mb-1">
              <i className="fas fa-phone me-2"></i>
              +91 7876602243
            </p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="mb-3">About ExpenseTracker</h5>
            <p className="text-light ">
              A simple and efficient way to manage your expenses and track your spending habits.
              Built with React and Bootstrap.
            </p>
          </div>
          <div className="col-md-4 ">
            <h5 className="mb-3">Connect With Me</h5>
            <div className="p-7 gap-3">
              <a href="https://www.instagram.com/" className="text-light social-link p-2" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="https://www.linkedin.com/in/farmeshkumar/" className="text-light social-link p-2" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a href="https://www.facebook.com/" className="text-light social-link p-2" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center text-light">
          <small>&copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
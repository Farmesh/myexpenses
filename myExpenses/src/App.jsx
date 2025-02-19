import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import { WalletProvider } from './context/WalletContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <div className="min-vh-100 bg-gradient-light d-flex flex-column">
            <Navbar />
            <div className="container py-4 flex-grow-1">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/add-expense" element={
                  <PrivateRoute>
                    <AddExpense />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
            <Footer />
            <ToastContainer />
          </div>
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

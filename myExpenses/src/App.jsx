import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastContainer } from 'react-toastify';
import { WalletProvider } from './context/WalletContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

// Lazy load components
const Navbar = lazy(() => import('./components/Navbar'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AddExpense = lazy(() => import('./components/AddExpense'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Footer = lazy(() => import('./components/Footer'));
const Profile = lazy(() => import('./components/Profile'));

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

// Create a wrapper component for the routes that uses location
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <div className="container py-4 flex-grow-1">
          <Routes location={location}>
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
      </PageTransition>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeLanguageProvider>
          <WalletProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <div className="min-vh-100 bg-gradient-light d-flex flex-column">
                <Navbar />
                <AnimatedRoutes />
                <Footer />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div>
            </Suspense>
          </WalletProvider>
        </ThemeLanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

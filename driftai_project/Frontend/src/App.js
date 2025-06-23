// App.js
import React from 'react';
import { useAuth } from './Context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Components/Dashboard.js';
import Login from './Components/login.js';
import Setup from './Components/setup.js';
import { AuthProvider } from './Context/AuthContext.js';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/setup" element={<PrivateRoute><Setup /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Laster...</div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Laster...</div>;
  return user ? <Navigate to="/dashboard" /> : children;
};

export default App;

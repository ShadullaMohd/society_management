import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import VisitorManagement from './pages/VisitorManagement';
import Complaints from './pages/Complaints';
import Maintenance from './pages/Maintenance';
import Amenities from './pages/Amenities';
import Announcements from './pages/Announcements';
import Marketplace from './pages/Marketplace';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/visitors" element={<PrivateRoute><VisitorManagement /></PrivateRoute>} />
            <Route path="/complaints" element={<PrivateRoute><Complaints /></PrivateRoute>} />
            <Route path="/maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
            <Route path="/amenities" element={<PrivateRoute><Amenities /></PrivateRoute>} />
            <Route path="/announcements" element={<PrivateRoute><Announcements /></PrivateRoute>} />
            <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

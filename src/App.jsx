import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { InformationProvider } from './contexts/InformationContext';
import Layout from './components/common/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookingForm from './pages/BookingForm';
import UsersManagement from './pages/UsersManagement';
import InformationManagement from './pages/InformationManagement';

const App = () => {
  return (
    <AuthProvider>
      <InformationProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Protected */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/booking-form" element={<BookingForm />} />
                <Route path="/bookings" element={<div className="p-8"><h1 className="text-2xl font-bold text-gray-800">Bookings</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>} />
                <Route path="/payment" element={<div className="p-8"><h1 className="text-2xl font-bold text-gray-800">Payment</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>} />
                <Route path="/report" element={<div className="p-8"><h1 className="text-2xl font-bold text-gray-800">Report</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>} />
                <Route path="/information" element={<InformationManagement />} />

                {/* Admin only */}
                <Route element={<PrivateRoute requiredRole="admin" />}>
                  <Route path="/users" element={<UsersManagement />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <div className="flex items-center justify-center h-screen">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300">404</h1>
                    <p className="text-gray-400 mt-2">Page not found</p>
                    <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">Back to Dashboard</a>
                  </div>
                </div>
              } />
            </Routes>
          </Layout>
        </Router>
      </InformationProvider>
    </AuthProvider>
  );
};

export default App;

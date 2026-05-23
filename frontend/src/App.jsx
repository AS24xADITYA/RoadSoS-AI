import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import HomePage from './pages/HomePage'
import EmergencyPage from './pages/EmergencyPage'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import SOSButton from './components/SOSButton'
import BottomNav from './components/BottomNav'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-24">
      {children}
      <BottomNav />
      <SOSButton />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><HomePage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/emergency" element={
              <ProtectedRoute>
                <Layout><EmergencyPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Layout><ChatPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout><SettingsPage /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

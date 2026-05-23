import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EmergencyPage from './pages/EmergencyPage'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'
import SOSButton from './components/SOSButton'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
        <SOSButton />
      </div>
    </Router>
  )
}

export default App

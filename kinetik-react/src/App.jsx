import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components (Layout)
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages (Main App)
import Dashboard from './pages/Dashboard';
import Nutrition from './pages/Nutrition';
import Workout from './pages/Workout';
import BMICalculator from './pages/BMICalculator';

// Pages (Authentication & Onboarding)
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';

// --- AUTH GUARD COMPONENT ---
const RequireAuth = ({ children }) => {
  const userSession = sessionStorage.getItem('currentUser');
  
  if (!userSession) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES (No Sidebar/Header) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* --- PROTECTED APP ROUTES (Wrapped in Layout & Auth Check) --- */}
        <Route path="*" element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

// Helper Component: Wraps the main app pages with the Sidebar & Header
function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-kinetik-light-bg-from dark:bg-kinetik-dark-bg-from transition-colors duration-500">
      {/* Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      {/* Header (Fixed to Top Right) */}
      <Header onMenuClick={() => setIsMobileOpen(true)} />

      {/* Page Content Area */}
      {/* FIX: Added 'pt-[72px]' to push content down so it doesn't hide behind the header */}
      <div className="flex-1 transition-all duration-300 relative pt-[72px]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/bmi" element={<BMICalculator />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';

// Placeholder for missing pages (Prevents crashing until we build them)
const Placeholder = ({ title }) => (
  <div className="p-10 md:ml-64 text-kinetik-light-text dark:text-kinetik-dark-text">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-2 opacity-60">Coming Soon...</p>
  </div>
);

function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-kinetik-light-bg-from dark:bg-kinetik-dark-bg-from">
      {/* Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <Header onMenuClick={() => setIsMobileOpen(true)} />

      {/* Page Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nutrition" element={<Placeholder title="Nutrition Tracker" />} />
          <Route path="/workout" element={<Placeholder title="Workout Logger" />} />
          <Route path="/bmi" element={<Placeholder title="BMI Calculator" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
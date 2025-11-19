import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      onClick={() => setIsMobileOpen(false)} // Close mobile menu on click
      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
        isActive(to)
          ? 'text-kinetik-mint bg-black/5 dark:bg-white/10'
          : 'text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted hover:text-kinetik-light-text dark:hover:text-kinetik-mint hover:bg-black/5 dark:hover:bg-white/10'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:z-50 border-r border-white/5 bg-white/10 dark:bg-black/10 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-2.5 h-[72px] px-6">
          <svg className="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-gradient-sidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#30C0F0" />
              </linearGradient>
            </defs>
            <path d="M16 4L19.5 12.5L28 16L19.5 19.5L16 28L12.5 19.5L4 16L12.5 12.5L16 4Z" fill="url(#logo-gradient-sidebar)" />
            <circle cx="26" cy="6" r="2" fill="url(#logo-gradient-sidebar)" />
            <circle cx="6" cy="26" r="2" fill="url(#logo-gradient-sidebar)" />
          </svg>
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kinetik-mint to-kinetik-cyan">
            Kinetik
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink to="/" label="Home" />
          <NavLink to="/nutrition" label="Nutrition" />
          <NavLink to="/workout" label="Exercise" />
          {/* BMI is better as a component/modal, but linking for now if you have a route */}
          <NavLink to="/bmi" label="BMI" /> 
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        ></div>
        
        <nav 
          className={`relative flex flex-col w-64 h-full bg-gradient-to-b from-kinetik-light-bg-from to-kinetik-light-bg-to dark:from-kinetik-dark-bg-from dark:to-kinetik-dark-bg-to shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
           <div className="flex-shrink-0 flex items-center justify-between h-[72px] px-6">
             {/* Logo Mobile */}
             <div className="flex items-center gap-2.5">
                <svg className="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="logo-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2DD4BF" />
                            <stop offset="100%" stopColor="#30C0F0" />
                        </linearGradient>
                    </defs>
                    <path d="M16 4L19.5 12.5L28 16L19.5 19.5L16 28L12.5 19.5L4 16L12.5 12.5L16 4Z" fill="url(#logo-gradient-mobile)" />
                    <circle cx="26" cy="6" r="2" fill="url(#logo-gradient-mobile)" />
                    <circle cx="6" cy="26" r="2" fill="url(#logo-gradient-mobile)" />
                </svg>
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kinetik-mint to-kinetik-cyan">
                    Kinetik
                </span>
             </div>
             
             {/* Close Button */}
             <button 
               onClick={() => setIsMobileOpen(false)} 
               className="w-9 h-9 flex items-center justify-center rounded-full text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted hover:bg-black/5 dark:hover:bg-white/10"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
           </div>

           <div className="flex flex-col p-4 gap-2">
             <NavLink to="/" label="Home" />
             <NavLink to="/nutrition" label="Nutrition" />
             <NavLink to="/workout" label="Exercise" />
             <NavLink to="/bmi" label="BMI" />
           </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
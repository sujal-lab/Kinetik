import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const [isDark, setIsDark] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    const timer = setInterval(() => {
        setTime(new Date().toLocaleTimeString('en-US'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
    window.dispatchEvent(new Event('themeChanged'));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-40 h-[72px] backdrop-blur-xl border-b border-white/5 bg-white/10 dark:bg-black/10 transition-all duration-600">
      {/* FIX: 
          - w-full: Ensures it spans the whole width 
          - justify-between: Spreads items on Mobile (Button <-> Content)
          - md:justify-end: Pushes items to the Right on Desktop (Content ->)
      */}
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between md:justify-end">
        
        {/* Mobile Menu Button (Hidden on Desktop) */}
        <button 
          onClick={onMenuClick} 
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-medium text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted transition-colors duration-600">
            {time}
          </span>

          <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300">
            {isDark ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div 
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-kinetik-coral to-pink-500 text-white font-semibold text-sm cursor-pointer hover:scale-110 transition-transform"
            title="Logout"
          >
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
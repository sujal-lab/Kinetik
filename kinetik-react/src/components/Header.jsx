import React, { useEffect, useState } from 'react';

const Header = ({ onMenuClick }) => {
  const [isDark, setIsDark] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US'));

  // Initialize Theme
  useEffect(() => {
    // Check localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    // Live Clock
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
    // Dispatch a custom event so charts can re-render if needed
    window.dispatchEvent(new Event('themeChanged'));
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] md:ml-64 backdrop-blur-xl border-b border-white/5 bg-white/10 dark:bg-black/10 transition-all duration-600">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 h-full flex justify-between md:justify-end items-center">
        
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick} 
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Spacer for mobile */}
        <div className="md:hidden flex-1"></div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-medium text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted transition-colors duration-600">
            {time}
          </span>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300">
            {isDark ? (
               // Moon Icon
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            ) : (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Profile */}
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-kinetik-coral to-pink-500 text-white font-semibold text-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
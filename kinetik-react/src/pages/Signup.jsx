import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Theme State (Local state for this page, synced with global)
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check global theme on mount
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'light' || (!storedTheme && !prefersDark)) {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    // Update HTML class for Tailwind
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  // --- Crypto Helpers (from your original script) ---
  const hashPassword = async (pass) => {
    const enc = new TextEncoder();
    const data = enc.encode(pass);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('❌ Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('❌ Password must be at least 6 characters');
      return;
    }

    // Check existing users (Mock DB in localStorage)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError('❌ Username already exists');
      return;
    }

    try {
      // Create User
      const passwordHash = await hashPassword(password);
      const newUser = {
        username,
        passwordHash,
        firstLogin: true,
        createdAt: new Date().toISOString()
      };

      // Save
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set Session
      sessionStorage.setItem('currentUser', JSON.stringify({
        username,
        createdAt: newUser.createdAt
      }));

      setSuccess('✔ Account created! Redirecting...');
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/'); // Go to Dashboard
      }, 1000);

    } catch (err) {
      console.error(err);
      setError('❌ Error creating account');
    }
  };

  return (
    <div className={`min-h-screen w-full flex transition-colors duration-500 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f1f5f9]'}`}>
      
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 w-12 h-12 rounded-full bg-kinetik-mint text-white flex items-center justify-center text-xl shadow-lg hover:scale-110 transition-transform"
      >
        {isDark ? '🌙' : '☀️'}
      </button>

      {/* LEFT COLUMN: Images (Hidden on mobile) */}
      <div className={`hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden transition-colors duration-500
        ${isDark ? 'bg-gradient-to-br from-[#0f172a] to-[#14b8a6]' : 'bg-gradient-to-br from-[#14b8a6] to-[#99f6e4]'}`}
      >
        {/* Bubbles/Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>

        <div className="flex flex-col gap-8 items-center z-10">
           <img 
             src="https://cdn.loveandlemons.com/wp-content/uploads/2019/02/meal-prep-ideas-1.jpg" 
             alt="Healthy Food"
             className="w-48 h-48 object-cover rounded-full border-4 border-kinetik-mint shadow-[0_4px_24px_rgba(20,184,166,0.3)] hover:scale-110 transition-transform duration-300"
           />
           <img 
             src="https://t4.ftcdn.net/jpg/02/43/13/15/360_F_243131531_jmNppYX9Ux2Hj2RV9yYR1swicwcYr8EQ.jpg" 
             alt="Running"
             className="w-48 h-48 object-cover rounded-full border-4 border-kinetik-mint shadow-[0_4px_24px_rgba(20,184,166,0.3)] hover:scale-110 transition-transform duration-300"
           />
           <img 
             src="https://media.istockphoto.com/id/2027281054/photo/young-sportswoman-doing-side-sit-ups-with-medicine-ball-while-exercising-in-health-club.jpg?s=612x612&w=0&k=20&c=TM8DPYR-2TYdqXVWVRYv_Yr8QaJyCsMFBn8Bo9OViIE=" 
             alt="Workout"
             className="w-48 h-48 object-cover rounded-full border-4 border-kinetik-mint shadow-[0_4px_24px_rgba(20,184,166,0.3)] hover:scale-110 transition-transform duration-300"
           />
        </div>
      </div>

      {/* RIGHT COLUMN: Form */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 transition-colors duration-500
        ${isDark ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-white to-[#e2e8f0]'}`}
      >
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-kinetik-mint">Sign Up</h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Username" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={`w-full p-4 rounded-xl border outline-none transition-all
                ${isDark 
                  ? 'bg-[#0f172a]/80 border-kinetik-mint/20 text-white focus:border-kinetik-mint focus:shadow-[0_0_12px_rgba(20,184,166,0.4)]' 
                  : 'bg-white/80 border-gray-300 text-gray-800 focus:border-kinetik-mint focus:shadow-md'
                }`}
            />

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password (6+ characters)" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full p-4 rounded-xl border outline-none transition-all
                  ${isDark 
                    ? 'bg-[#0f172a]/80 border-kinetik-mint/20 text-white focus:border-kinetik-mint focus:shadow-[0_0_12px_rgba(20,184,166,0.4)]' 
                    : 'bg-white/80 border-gray-300 text-gray-800 focus:border-kinetik-mint focus:shadow-md'
                  }`}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-kinetik-mint"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full p-4 rounded-xl border outline-none transition-all
                  ${isDark 
                    ? 'bg-[#0f172a]/80 border-kinetik-mint/20 text-white focus:border-kinetik-mint focus:shadow-[0_0_12px_rgba(20,184,166,0.4)]' 
                    : 'bg-white/80 border-gray-300 text-gray-800 focus:border-kinetik-mint focus:shadow-md'
                  }`}
              />
            </div>

            {error && <p className="text-red-400 text-center text-sm font-medium">{error}</p>}
            {success && <p className="text-green-400 text-center text-sm font-medium">{success}</p>}

            <button 
              type="submit"
              className="w-full p-4 mt-4 rounded-xl font-bold text-white bg-gradient-to-r from-kinetik-mint to-[#0d9488] hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Create Account
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account? <Link to="/login" className="text-kinetik-mint hover:underline font-medium">Login</Link>
            </p>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2025 Kinetik. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
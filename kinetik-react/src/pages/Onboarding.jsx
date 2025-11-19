import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isDark, setIsDark] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    dob: '',
    height: '',
    weight: '',
    targetWeight: '',
    gender: '',
    mealsPerDay: '',
    mealPreference: '',
    allergies: '',
    activityLevel: '',
    workoutTime: '',
    activityType: ''
  });

  // --- Auth Guard & Theme Init ---
  useEffect(() => {
    // 1. Check if user is logged in
    const userSession = sessionStorage.getItem('currentUser');
    if (!userSession) {
      navigate('/login');
      return;
    }

    // 2. Load Theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDark(false);
    }
  }, [navigate]);

  // --- Handlers ---
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNext = () => {
    // Basic validation for required fields in current step can go here
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Save data to localStorage (Mock DB)
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const userData = {
      username: currentUser?.username,
      ...formData,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('userProfile', JSON.stringify(userData));
    
    alert('🎉 Onboarding Completed! Welcome to Kinetik.');
    navigate('/'); // Go to Dashboard
  };

  // --- Styles (Tailwind Classes) ---
  const containerClass = isDark 
    ? "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white transition-colors duration-500"
    : "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-slate-900 transition-colors duration-500";

  const cardClass = isDark
    ? "w-full max-w-lg p-8 rounded-2xl bg-[#1e293b]/80 border border-[#14b8a6]/20 shadow-[0_0_30px_rgba(20,184,166,0.1)] backdrop-blur-md"
    : "w-full max-w-lg p-8 rounded-2xl bg-white/80 border border-slate-200 shadow-xl backdrop-blur-md";

  const inputClass = isDark
    ? "w-full p-3 rounded-xl bg-[#0f172a] border border-[#14b8a6]/30 focus:border-[#14b8a6] outline-none text-white placeholder-slate-500 transition-all"
    : "w-full p-3 rounded-xl bg-white border border-slate-300 focus:border-[#0f766e] outline-none text-slate-900 transition-all";

  const labelClass = isDark ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-slate-600 mb-1";

  return (
    <div className={containerClass}>
      
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 w-10 h-10 rounded-full bg-transparent border border-current flex items-center justify-center text-xl hover:rotate-12 transition-transform"
      >
        {isDark ? '🌙' : '☀️'}
      </button>

      <div className={cardClass}>
        <h2 className="text-3xl font-bold text-center mb-6 text-kinetik-mint">Setup Profile</h2>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-kinetik-mint transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* --- STEP 1: Basic Info --- */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Age</label>
                <input type="number" id="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="25" />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select id="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" id="dob" value={formData.dob} onChange={handleChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Height (cm)</label>
                <input type="number" id="height" value={formData.height} onChange={handleChange} className={inputClass} placeholder="175" />
              </div>
              <div>
                <label className={labelClass}>Weight (kg)</label>
                <input type="number" id="weight" value={formData.weight} onChange={handleChange} className={inputClass} placeholder="70" />
              </div>
            </div>
            <div>
                <label className={labelClass}>Target Weight (kg)</label>
                <input type="number" id="targetWeight" value={formData.targetWeight} onChange={handleChange} className={inputClass} placeholder="65" />
            </div>

            <div className="pt-4 flex justify-end">
              <button onClick={handleNext} className="px-6 py-3 rounded-xl bg-gradient-to-r from-kinetik-mint to-[#0d9488] text-white font-bold shadow-lg hover:scale-105 transition-all">
                Next
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: Nutrition Info --- */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label className={labelClass}>Meals per Day</label>
              <input type="number" id="mealsPerDay" value={formData.mealsPerDay} onChange={handleChange} className={inputClass} placeholder="3" />
            </div>
            <div>
              <label className={labelClass}>Dietary Preference</label>
              <select id="mealPreference" value={formData.mealPreference} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Allergies (Optional)</label>
              <input type="text" id="allergies" value={formData.allergies} onChange={handleChange} className={inputClass} placeholder="Peanuts, Gluten..." />
            </div>

            <div className="pt-4 flex justify-between">
              <button onClick={handlePrev} className="px-6 py-3 rounded-xl border border-slate-500 text-slate-400 font-bold hover:text-white hover:border-white transition-all">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-xl bg-gradient-to-r from-kinetik-mint to-[#0d9488] text-white font-bold shadow-lg hover:scale-105 transition-all">
                Next
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: Fitness Info --- */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label className={labelClass}>Activity Level</label>
              <select id="activityLevel" value={formData.activityLevel} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Sedentary">Sedentary (Little to no exercise)</option>
                <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                <option value="Very Active">Very Active (6-7 days/week)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Preferred Workout Time</label>
              <select id="workoutTime" value={formData.workoutTime} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Primary Activity</label>
              <select id="activityType" value={formData.activityType} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Cardio">Cardio (Running, Cycling)</option>
                <option value="Strength">Strength Training (Gym)</option>
                <option value="Yoga">Yoga / Pilates</option>
                <option value="Mixed">Mixed / HIIT</option>
              </select>
            </div>

            <div className="pt-4 flex justify-between">
              <button onClick={handlePrev} className="px-6 py-3 rounded-xl border border-slate-500 text-slate-400 font-bold hover:text-white hover:border-white transition-all">
                Back
              </button>
              <button onClick={handleSubmit} className="px-6 py-3 rounded-xl bg-gradient-to-r from-kinetik-mint to-[#0d9488] text-white font-bold shadow-lg hover:scale-105 transition-all">
                Finish Setup
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
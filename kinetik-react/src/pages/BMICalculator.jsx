import React, { useState } from 'react';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const calculateBMI = () => {
    setError('');
    setBmi(null);
    setStatus('');

    if (!weight || !height) {
      setError('Please enter both weight and height.');
      return;
    }

    const hInMeters = height / 100;
    const bmiValue = weight / (hInMeters * hInMeters);
    const roundedBMI = bmiValue.toFixed(2);

    setBmi(roundedBMI);

    let bmiStatus = '';
    if (bmiValue < 18.5) bmiStatus = 'Underweight';
    else if (bmiValue < 24.9) bmiStatus = 'Normal Weight';
    else if (bmiValue < 29.9) bmiStatus = 'Overweight';
    else bmiStatus = 'Obese';
    
    setStatus(bmiStatus);
  };

  // Helper to get color based on status
  const getStatusColor = (s) => {
    if (s === 'Normal Weight') return 'text-kinetik-mint';
    if (s === 'Overweight') return 'text-yellow-400';
    if (s === 'Underweight') return 'text-blue-400';
    return 'text-red-500';
  };

  return (
    <div className="p-4 md:ml-64 min-h-screen flex items-center justify-center">
      <div className="kinetik-card p-8 max-w-md w-full flex flex-col gap-6 animate-fade-in-up">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kinetik-mint to-kinetik-cyan">
            BMI Calculator
          </h2>
          <p className="text-sm text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted mt-2">
            Calculate your Body Mass Index
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-kinetik-light-text dark:text-kinetik-dark-text">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 70"
              className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-kinetik-cyan outline-none text-kinetik-light-text dark:text-kinetik-dark-text transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-kinetik-light-text dark:text-kinetik-dark-text">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Ex: 175"
              className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-kinetik-cyan outline-none text-kinetik-light-text dark:text-kinetik-dark-text transition-all"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">{error}</p>
        )}

        <button
          onClick={calculateBMI}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-kinetik-mint to-kinetik-cyan shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all active:scale-95"
        >
          Calculate
        </button>

        {bmi && (
          <div className="mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 text-center border border-black/10 dark:border-white/10 animate-fade-in-up">
            <p className="text-sm text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted uppercase tracking-widest mb-1">Your Result</p>
            <div className="text-5xl font-extrabold text-kinetik-light-text dark:text-kinetik-dark-text mb-2">{bmi}</div>
            <div className={`text-lg font-bold ${getStatusColor(status)}`}>
              {status}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BMICalculator;
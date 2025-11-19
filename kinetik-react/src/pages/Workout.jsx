import React, { useState, useEffect } from 'react';
import WorkoutSection from '../components/WorkoutSection';

const Workout = () => {
    // --- STATE ---
    const [exerciseDB, setExerciseDB] = useState({ arms: [], legs: [], core: [], cardio: [] });
    const [logs, setLogs] = useState([]);
    const [goal, setGoal] = useState(500);
    
    // --- CONFIG ---
    const API_BASE_URL = 'http://localhost:3000';

    // --- EFFECTS ---
    useEffect(() => {
        // Fetch exercise DB
        fetch(`${API_BASE_URL}/api/exercises`)
            .then(res => {
                if(!res.ok) throw new Error('Failed to load exercises');
                return res.json();
            })
            .then(data => setExerciseDB(data))
            .catch(err => {
                console.error(err);
                // Fallback data
                setExerciseDB({
                    arms: [{name: 'Bicep Curl', perRep: 0.5}, {name: 'Tricep Dip', perRep: 0.8}],
                    legs: [{name: 'Squat', perRep: 1.2}, {name: 'Lunge', perRep: 1.0}],
                    core: [{name: 'Crunch', perRep: 0.3}, {name: 'Plank', perMinute: 4}],
                    cardio: [{name: 'Running', perMinute: 10}, {name: 'Cycling', perMinute: 8}]
                });
            });
    }, []);

    // --- HANDLERS ---
    const addLog = (newLog) => {
        setLogs(prev => [newLog, ...prev]);
    };

    const removeLog = (id) => {
        setLogs(prev => prev.filter(l => l.id !== id));
    };

    // --- CALCULATIONS ---
    const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
    const totalTime = logs.reduce((sum, log) => sum + (log.isDuration ? log.val1 : 0), 0) + 
                      logs.reduce((sum, log) => sum + (!log.isDuration ? (log.val1 * (log.val2 || 1) * 0.05) : 0), 0); 
    
    const percent = Math.min(100, (totalCalories / goal) * 100);
    const circumference = 2 * Math.PI * 96; 
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="p-4 md:ml-64 min-h-screen pb-20">
            <header className="text-center mb-8 mt-6 animate-fade-in-up">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kinetik-mint to-kinetik-cyan inline-flex items-center gap-2">
                    Track Your Workout! 
                    <span className="text-kinetik-cyan drop-shadow-[0_0_10px_rgba(48,192,240,0.5)]">💪</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr_1fr] gap-6 items-start">
                
                {/* LEFT COLUMN (Arms & Core) */}
                <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <WorkoutSection 
                        title="Arms & Upper" 
                        type="arms" 
                        exercises={exerciseDB.arms || []} 
                        onAddLog={addLog} 
                    />
                    <WorkoutSection 
                        title="Core Strength" 
                        type="core" 
                        exercises={exerciseDB.core || []} 
                        onAddLog={addLog} 
                    />
                </div>

                {/* CENTER COLUMN (Stats & Progress) */}
                <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <section className="kinetik-card p-8 flex flex-col items-center text-center relative overflow-hidden">
                        
                        {/* Progress Ring */}
                        <div className="relative w-64 h-64 mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="18" fill="none" className="text-black/5 dark:text-white/5" />
                                <circle 
                                    cx="128" cy="128" r="96" 
                                    stroke="url(#gradient)" 
                                    strokeWidth="18" 
                                    strokeLinecap="round" 
                                    fill="none" 
                                    style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#2DD4BF" />
                                        <stop offset="100%" stopColor="#30C0F0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">{Math.round(totalCalories)}</span>
                                <span className="text-sm font-bold text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted uppercase tracking-wider">kcal burned</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 w-full mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">{logs.length}</div>
                                <div className="text-xs text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted uppercase">Exercises</div>
                            </div>
                            <div className="text-center border-l border-r border-black/5 dark:border-white/10">
                                <div className="text-2xl font-bold text-kinetik-mint">{Math.round(totalCalories)}</div>
                                <div className="text-xs text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted uppercase">Total Cal</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">{Math.round(totalTime)}m</div>
                                <div className="text-xs text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted uppercase">Duration</div>
                            </div>
                        </div>

                        {/* Goal Input */}
                        <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-2 rounded-xl w-full max-w-xs">
                            <span className="pl-2 text-sm font-bold text-kinetik-light-text-muted">Goal:</span>
                            <input 
                                type="number" 
                                className="bg-transparent w-full outline-none font-bold text-kinetik-light-text dark:text-kinetik-dark-text text-right pr-2"
                                value={goal}
                                onChange={(e) => setGoal(Math.max(10, e.target.value))}
                            />
                        </div>

                    </section>

                    {/* Logs List */}
                    <section className="kinetik-card p-6 flex-grow">
                        <h3 className="text-lg font-bold text-kinetik-light-text dark:text-kinetik-dark-text mb-4">Session Logs</h3>
                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {logs.length === 0 ? (
                                <p className="text-center text-sm text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted py-4 opacity-50">
                                    No exercises logged yet.
                                </p>
                            ) : (
                                logs.map(log => (
                                    <div key={log.id} className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 rounded-lg animate-fade-in-up">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-kinetik-light-text dark:text-kinetik-dark-text">{log.name}</span>
                                            <span className="text-xs text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted capitalize">
                                                {log.section} • {log.isDuration ? `${log.val1} mins` : `${log.val1} x ${log.val2 || 1} sets`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-bold text-kinetik-mint text-sm">+{Math.round(log.calories)}</span>
                                            <button onClick={() => removeLog(log.id)} className="text-gray-400 hover:text-red-500 transition-colors">×</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN (Legs & Cardio) */}
                <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <WorkoutSection 
                        title="Legs & Lower" 
                        type="legs" 
                        exercises={exerciseDB.legs || []} 
                        onAddLog={addLog} 
                    />
                    <WorkoutSection 
                        title="Cardio" 
                        type="cardio" 
                        exercises={exerciseDB.cardio || []} 
                        onAddLog={addLog} 
                    />
                </div>

            </div>
        </div>
    );
};

export default Workout;
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
    // --- State Management ---
    const [summary, setSummary] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        targetCalories: 2500 // Default goal
    });
    const [calendarDays, setCalendarDays] = useState([]);
    
    // AI Modal State
    const [isAIModalOpen, setAIModalOpen] = useState(false);
    const [aiPlanType, setAiPlanType] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    // Refs for Charts (so we can destroy/recreate them)
    const calorieChartRef = useRef(null);
    const weightChartRef = useRef(null);
    const calorieChartInstance = useRef(null);
    const weightChartInstance = useRef(null);

    // --- Configuration ---
    const API_BASE_URL = 'http://localhost:3000';
    const USER_ID = 1; // Mocked User ID
    const GOALS = { protein: 150, carbs: 250, fat: 70 };

    // Helper: Get local YYYY-MM-DD
    const getLocalYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const currentDateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // --- 1. Fetch Dashboard Data ---
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const today = getLocalYYYYMMDD(new Date());
                const res = await fetch(`${API_BASE_URL}/api/nutrition/summary?user_id=${USER_ID}&date=${today}`);
                
                if (res.ok) {
                    const data = await res.json();
                    setSummary({
                        calories: Math.round(data.total_calories_consumed || 0),
                        protein: data.total_protein_g || 0,
                        carbs: data.total_carbs_g || 0,
                        fats: data.total_fats_g || 0,
                        targetCalories: 2500
                    });
                }
            } catch (error) {
                console.error("Error fetching summary:", error);
            }
        };

        const fetchCalendar = async () => {
            try {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 34); // 35 days grid
                const endDateStr = getLocalYYYYMMDD(endDate);

                const res = await fetch(`${API_BASE_URL}/api/nutrition/calendar-summary?user_id=${USER_ID}&endDate=${endDateStr}`);
                if (res.ok) {
                    const data = await res.json();
                    const summaryMap = new Map(data.map(e => [e.summary_date, e]));

                    const days = [];
                    for (let i = 0; i < 35; i++) {
                        const d = new Date(startDate);
                        d.setDate(startDate.getDate() + i);
                        const dayStr = getLocalYYYYMMDD(d);
                        const entry = summaryMap.get(dayStr);
                        
                        days.push({
                            dayOfMonth: d.getDate(),
                            fullDate: d.toLocaleDateString(),
                            meals: entry?.total_calories_consumed || 0,
                            exercise: entry?.total_calories_burned || 0,
                            hasMeal: entry?.meal_logged,
                            hasExercise: entry?.exercise_logged
                        });
                    }
                    setCalendarDays(days);
                }
            } catch (error) {
                console.error("Error fetching calendar:", error);
            }
        };

        fetchSummary();
        fetchCalendar();
    }, []);

    // --- 2. Initialize Calorie Gauge Chart ---
    useEffect(() => {
        if (calorieChartRef.current) {
            // Destroy old chart if it exists
            if (calorieChartInstance.current) {
                calorieChartInstance.current.destroy();
            }

            const ctx = calorieChartRef.current.getContext('2d');
            const remaining = Math.max(0, summary.targetCalories - summary.calories);
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, '#2DD4BF'); // mint
            gradient.addColorStop(1, '#30C0F0'); // cyan

            // Determine dark mode for background color (basic check)
            const isDark = document.documentElement.classList.contains('dark');
            const gaugeBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

            calorieChartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [summary.calories, remaining],
                        backgroundColor: [gradient, gaugeBg],
                        borderWidth: 0,
                        borderRadius: 20,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    cutout: '75%',
                    circumference: 180,
                    rotation: 270,
                    animation: { duration: 1000 },
                    plugins: { tooltip: { enabled: false }, legend: { display: false } }
                }
            });
        }
        
        return () => {
            if (calorieChartInstance.current) calorieChartInstance.current.destroy();
        };
    }, [summary]); // Re-run when summary changes

    // --- 3. Initialize Weight Chart (Static for demo) ---
    useEffect(() => {
        if (weightChartRef.current) {
            if (weightChartInstance.current) {
                weightChartInstance.current.destroy();
            }

            const ctx = weightChartRef.current.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, '#2DD4BF');
            gradient.addColorStop(1, '#FF9A59');

            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? 'rgba(230, 247, 242, 0.65)' : '#6B7280';

            weightChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Weight (lbs)',
                        data: [185, 182, 183, 180, 178],
                        backgroundColor: gradient,
                        borderRadius: 8,
                        barThickness: 30,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { 
                            min: 170, max: 190, 
                            grid: { display: false },
                            ticks: { color: textColor }
                        },
                        x: { 
                            grid: { display: false },
                            ticks: { color: textColor }
                        }
                    }
                }
            });
        }
        return () => {
            if (weightChartInstance.current) weightChartInstance.current.destroy();
        };
    }, []);

    // --- 4. AI Generation Logic ---
    const handleAIGenerate = async (planType) => {
        setAIModalOpen(true);
        setAiPlanType(planType);
        setIsLoadingAI(true);
        setAiResponse('');

        try {
            // 1. Get User Data
            const userRes = await fetch(`${API_BASE_URL}/api/user/get-user-data`);
            if (!userRes.ok) throw new Error('Failed to fetch user data');
            const userData = await userRes.json();

            // 2. Build Prompt
            const systemPrompt = "You are Kinetik, an expert fitness coach. Format your response in HTML (use <h3>, <ul>, <li>, <strong>). Do NOT use Markdown symbols like **.";
            const userQuery = `
                Generate a **${planType}** for me.
                Name: ${userData.full_name}, Goal: ${userData.goal}, 
                Weight: ${userData.weight_kg}kg, Target: ${userData.target_weight_kg}kg.
                Diet: ${userData.meal_preference}, Workout time: ${userData.preferred_workout_time}.
            `;

            // 3. Call Gemini API
            const apiKey = "AIzaSyDIByreG6s5ReuwMEhBajJA883QrzbrFaw"; // Use env variable in production
            const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userQuery }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });

            const result = await apiRes.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response.";
            setAiResponse(text);

        } catch (error) {
            setAiResponse(`Error: ${error.message}. Is the backend running?`);
        } finally {
            setIsLoadingAI(false);
        }
    };

    // --- Helper Component for Macros ---
    const MacroBar = ({ label, value, max, colorClass }) => {
        const percent = Math.min(100, (value / max) * 100);
        return (
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-semibold text-kinetik-light-text dark:text-kinetik-dark-text">{label}</span>
                    <span className="text-sm font-medium text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">{Math.round(value)}g / {max}g</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/10 rounded-full h-3">
                    <div 
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8 md:ml-64">
            <div className="flex flex-col gap-8">
                
                {/* Section 1: Snapshot */}
                <section className="animate-fade-in-up">
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kinetik-mint to-kinetik-cyan">
                        Today's Snapshot
                    </h1>
                    <p className="text-lg text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted mt-2">
                        {currentDateStr}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                        {/* Steps */}
                        <div className="kinetik-card p-7 flex flex-col items-center justify-center text-center">
                            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-kinetik-cyan/10 dark:bg-kinetik-cyan/20 text-kinetik-cyan flex items-center justify-center">
                                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-9 6 18 3-9h3" /></svg>
                            </div>
                            <div className="text-6xl font-extrabold text-kinetik-light-text dark:text-kinetik-dark-text mt-4">8547</div>
                            <div className="text-sm font-semibold uppercase tracking-wider text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted mt-2">Steps</div>
                        </div>
                        {/* Calories */}
                        <div className="kinetik-card p-7 flex flex-col items-center justify-center text-center">
                            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-kinetik-coral/10 dark:bg-kinetik-coral/20 text-kinetik-coral flex items-center justify-center">
                                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>
                            </div>
                            <div className="text-6xl font-extrabold text-kinetik-light-text dark:text-kinetik-dark-text mt-4">{summary.calories}</div>
                            <div className="text-sm font-semibold uppercase tracking-wider text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted mt-2">Calories Burned</div>
                        </div>
                        {/* Water */}
                        <div className="kinetik-card p-7 flex flex-col items-center justify-center text-center">
                             <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-kinetik-cyan/10 dark:bg-kinetik-cyan/20 text-kinetik-cyan flex items-center justify-center">
                                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5A5.25 5.25 0 0012 21.75a5.25 5.25 0 004.5-5.25c0-4.005-4.5-10.5-4.5-10.5s-4.5 6.495-4.5 10.5z" /></svg>
                            </div>
                            <div className="text-6xl font-extrabold text-kinetik-light-text dark:text-kinetik-dark-text mt-4">6 / 8</div>
                            <div className="text-sm font-semibold uppercase tracking-wider text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted mt-2">Glasses of Water</div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Tip of Day */}
                <section className="kinetik-card px-6 pt-7 pb-9 flex items-center gap-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-kinetik-mint to-kinetik-cyan/70 flex items-center justify-center text-white">
                        <span className="text-4xl">✦</span>
                    </div>
                    <div>
                        <h3 className="text-xs uppercase font-bold tracking-wider text-kinetik-mint">Tip of the Day</h3>
                        <p className="text-xl font-medium mt-1 text-kinetik-light-text dark:text-kinetik-dark-text">
                            Hydration is key! Aim for 8 glasses of water daily.
                        </p>
                    </div>
                </section>

                {/* Section 3: Gauges & Macros */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="kinetik-card px-6 pt-7 pb-9 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-2xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">Calorie Intake</h3>
                        <div className="relative w-full max-w-xs mx-auto mt-4">
                            <canvas ref={calorieChartRef}></canvas>
                            <div className="absolute inset-0 flex flex-col items-center justify-center top-10 pointer-events-none">
                                <div className="text-6xl font-extrabold text-kinetik-light-text dark:text-kinetik-dark-text">{summary.calories}</div>
                                <div className="text-sm font-semibold text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">Consumed</div>
                                <div className="text-lg font-bold text-kinetik-mint mt-1">
                                    <span>{summary.targetCalories}</span> 
                                    <span className="text-xs uppercase font-medium text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted ml-1">Target</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kinetik-card px-6 pt-7 pb-9 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <h3 className="text-2xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">Macros</h3>
                        <div className="flex flex-col gap-6 mt-6">
                            <MacroBar label="Protein" value={summary.protein} max={GOALS.protein} colorClass="bg-gradient-to-r from-kinetik-mint to-kinetik-cyan" />
                            <MacroBar label="Carbs" value={summary.carbs} max={GOALS.carbs} colorClass="bg-gradient-to-r from-kinetik-cyan to-blue-500" />
                            <MacroBar label="Fats" value={summary.fats} max={GOALS.fat} colorClass="bg-gradient-to-r from-kinetik-coral to-pink-500" />
                        </div>
                    </div>
                </section>

                {/* Section 4: Calendar & Weight */}
                <section className="kinetik-card px-6 pt-7 pb-9 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <h3 className="text-2xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">Activity Calendar</h3>
                    <div className="grid grid-cols-7 gap-1.5 md:gap-2 mt-4">
                        {calendarDays.length === 0 ? (
                            <div className="col-span-7 h-48 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-kinetik-cyan border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            calendarDays.map((day, idx) => {
                                let bgColor = 'bg-black/5 dark:bg-white/10';
                                let textColor = 'text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted';
                                
                                if (day.hasMeal && day.hasExercise) {
                                    bgColor = 'bg-kinetik-cyan/10 dark:bg-kinetik-cyan/20';
                                    textColor = 'text-kinetik-cyan/80 dark:text-kinetik-cyan';
                                } else if (day.hasMeal) {
                                    bgColor = 'bg-kinetik-mint/10 dark:bg-kinetik-mint/20';
                                    textColor = 'text-kinetik-mint/80 dark:text-kinetik-mint';
                                } else if (day.hasExercise) {
                                    bgColor = 'bg-kinetik-coral/10 dark:bg-kinetik-coral/20';
                                    textColor = 'text-kinetik-coral/80 dark:text-kinetik-coral';
                                }

                                return (
                                    <div 
                                        key={idx}
                                        className={`aspect-square rounded-lg p-2 flex items-center justify-center ${bgColor}`}
                                        title={`${day.fullDate}: ${Math.round(day.meals)} kcal meals, ${Math.round(day.exercise)} kcal exercise`}
                                    >
                                        <span className={`font-bold text-xs md:text-sm ${textColor}`}>{day.dayOfMonth}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-kinetik-mint/50"></div>
                            <span className="text-xs font-medium text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">Meal Logged</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-kinetik-coral/50"></div>
                            <span className="text-xs font-medium text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">Exercise Logged</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-kinetik-cyan/50"></div>
                            <span className="text-xs font-medium text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">Both Logged</span>
                        </div>
                    </div>
                </section>

                <section className="kinetik-card px-6 pt-7 pb-9 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <h3 className="text-2xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">Weight Trend</h3>
                    <div className="h-80 mt-4">
                        <canvas ref={weightChartRef}></canvas>
                    </div>
                </section>

                {/* Section 5: AI Plans */}
                <section className="kinetik-card animated-ai-card px-6 pt-8 pb-10 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <div className="absolute -top-1/3 -left-1/3 w-2/3 h-2/3 bg-kinetik-cyan/20 dark:bg-kinetik-cyan/10 rounded-full blur-3xl opacity-50 dark:opacity-30 pointer-events-none"></div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-center gap-5">
                        <div className="md:col-span-1 flex justify-center">
                            <span className="text-7xl lg:text-8xl bg-gradient-to-br from-kinetik-mint to-kinetik-cyan bg-clip-text text-transparent animate-pulse-bright">✦</span>
                        </div>
                        <div className="md:col-span-2 text-center md:text-left">
                            <h3 className="text-3xl lg:text-4xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">Generate Plans with AI</h3>
                            <p className="text-lg text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted mt-2">
                                Let Kinetik AI build a personalized nutrition and workout plan based on your goals.
                            </p>
                            <div className="flex gap-2.5 mt-4 flex-wrap justify-center md:justify-start">
                                <button onClick={() => handleAIGenerate('Workout Plan')} className="ai-chip ai-chip-coral">Workout Plan</button>
                                <button onClick={() => handleAIGenerate('Nutrition Plan')} className="ai-chip ai-chip-mint">Nutrition Plan</button>
                                <button onClick={() => handleAIGenerate('Combined Plan')} className="ai-chip ai-chip-cyan">Combined Plan</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* AI Modal */}
            {isAIModalOpen && (
                <div className="fixed inset-0 z-[100] p-4 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl max-h-[80vh] bg-gradient-to-b from-kinetik-light-bg-to to-kinetik-light-bg-from dark:from-kinetik-dark-bg-to dark:to-kinetik-dark-bg-from rounded-2xl shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-black/10 dark:border-white/10">
                            <h3 className="text-xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">
                                Your <span className="text-kinetik-mint">{aiPlanType}</span>
                            </h3>
                            <button onClick={() => setAIModalOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full text-kinetik-light-text-muted hover:bg-black/5 dark:hover:bg-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">
                            {isLoadingAI ? (
                                <div className="flex flex-col items-center justify-center p-8">
                                    <div className="w-12 h-12 border-4 border-kinetik-cyan border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-4 font-medium">Generating your plan...</p>
                                </div>
                            ) : (
                                <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aiResponse }} />
                            )}
                        </div>
                        <div className="p-4 border-t border-black/10 dark:border-white/10 text-right">
                            <p className="text-xs text-kinetik-light-text-muted/60 dark:text-kinetik-dark-text-muted/60">Generated by Kinetik AI ✨</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;
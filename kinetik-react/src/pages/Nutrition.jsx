import React, { useState, useEffect, useRef } from 'react';
import MealSection from '../components/MealSection';
import NutritionModals from '../components/NutritionModals';

const Nutrition = () => {
    // --- STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState('food');
    const [currentMeal, setCurrentMeal] = useState(null);
    const [currentFood, setCurrentFood] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [dailySummary, setDailySummary] = useState(null);
    const [mealLogs, setMealLogs] = useState([]);
    const [foodDataCache, setFoodDataCache] = useState({});
    const [foodSearchResults, setFoodSearchResults] = useState([]);
    const [isFoodLoading, setIsFoodLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [waterCount, setWaterCount] = useState(4);
    const [waterGoal] = useState(8);
    
    // Config
    const goals = { calories: 2200, protein: 150, carbs: 250, fat: 60 };
    const userId = 1;
    const apiBaseUrl = 'http://localhost:3000';
    const today = new Date().toISOString().split('T')[0];
    
    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // --- EFFECTS ---
    useEffect(() => {
        fetchAndRenderSummary();
        fetchAndRenderMeals();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery) searchFoods(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // --- API ---
    const fetchAndRenderSummary = async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/nutrition/summary?user_id=${userId}&date=${today}`);
            if (res.ok) setDailySummary(await res.json());
        } catch (error) { console.error("Summary failed", error); }
    };

    const fetchAndRenderMeals = async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/nutrition/logs?user_id=${userId}&date=${today}`);
            if (res.ok) setMealLogs(await res.json());
        } catch (error) { console.error("Logs failed", error); }
    };

    const searchFoods = async (query) => {
        setIsFoodLoading(true);
        try {
            const res = await fetch(`${apiBaseUrl}/api/nutrition/search?name=${encodeURIComponent(query)}`);
            if (res.ok) {
                const foods = await res.json();
                setFoodSearchResults(foods);
                const newCache = { ...foodDataCache };
                foods.forEach(f => newCache[f.food_id] = f);
                setFoodDataCache(newCache);
            }
        } catch (error) { console.error("Search failed", error); }
        finally { setIsFoodLoading(false); }
    };

    const logMeal = async () => {
        if (!currentFood || !currentMeal) return;
        try {
            const res = await fetch(`${apiBaseUrl}/api/nutrition/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    food_id: currentFood.food_id,
                    quantity: quantity,
                    date: today,
                    meal_type: currentMeal
                })
            });
            if (res.ok) {
                fetchAndRenderMeals();
                fetchAndRenderSummary();
                closeModal();
            }
        } catch (error) { console.error("Log failed", error); }
    };

    const deleteLog = async (logId) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/nutrition/log/${logId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchAndRenderMeals();
                fetchAndRenderSummary();
            }
        } catch (error) { console.error("Delete failed", error); }
    };

    // --- HANDLERS ---
    const openAddFoodModal = (meal) => {
        setCurrentMeal(meal);
        setActiveModal('food');
        setIsModalOpen(true);
        setSearchQuery('');
        setFoodSearchResults([]);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        stopCamera();
    };

    const handleSelectFood = (foodId) => {
        const food = foodDataCache[foodId] || foodSearchResults.find(f => f.food_id === foodId);
        if (food) {
            setCurrentFood(food);
            setQuantity(1);
            setActiveModal('quantity');
        }
    };

    const startCamera = async () => {
        setActiveModal('camera');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (err) { console.error("Camera failed", err); }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    };

    const snapPhoto = async () => {
        if (!canvasRef.current || !videoRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg');
        stopCamera();
        identifyFoodWithAI(base64);
    };

    const identifyFoodWithAI = async (base64) => {
        setActiveModal('food');
        setIsFoodLoading(true);
        setSearchQuery('Analyzing...');
        try {
            const apiKey = "AIzaSyDIByreG6s5ReuwMEhBajJA883QrzbrFaw";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{
                    parts: [
                        { text: "Identify the main food item. Respond with ONLY the food name." },
                        { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
                    ]
                }]
            };
            const res = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
            const data = await res.json();
            const foodName = data.candidates?.[0]?.content?.parts?.[0]?.text.trim();
            if (foodName) setSearchQuery(foodName);
            else setSearchQuery('Unknown Food');
        } catch (err) { console.error("AI ID failed", err); setSearchQuery('Error identifying'); }
        finally { setIsFoodLoading(false); }
    };

    // --- CALCULATIONS ---
    const totals = dailySummary || { total_calories_consumed: 0, total_protein_g: 0, total_carbs_g: 0, total_fats_g: 0 };
    const remaining = Math.max(0, goals.calories - totals.total_calories_consumed);
    const getLogs = (type) => ({ logs: mealLogs.filter(l => l.meal_type === type), totalCals: mealLogs.filter(l => l.meal_type === type).reduce((sum, l) => sum + l.calories, 0) });

    return (
        <div className="p-4 md:ml-64 min-h-screen pb-20">
            <header className="text-center mb-8 mt-6 animate-fade-in-up">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kinetik-mint to-kinetik-cyan inline-flex items-center gap-2">
                    Track Your Calories! 
                    <span className="text-kinetik-light-text dark:text-white">🥗</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-6">
                
                {/* LEFT: Breakfast & Lunch */}
                <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <MealSection title="Breakfast" mealName="breakfast" data={getLogs('breakfast')} onAddFood={openAddFoodModal} onDeleteLog={deleteLog} />
                    <MealSection title="Lunch" mealName="lunch" data={getLogs('lunch')} onAddFood={openAddFoodModal} onDeleteLog={deleteLog} />
                </div>

                {/* CENTER: Summary Card */}
                <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <section className="kinetik-card p-6 text-center flex flex-col justify-between h-full">
                        
                        <div className="mb-6">
                            <h2 className="text-6xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text mb-1">
                                {Math.round(totals.total_calories_consumed)}
                            </h2>
                            <p className="text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted text-sm font-semibold uppercase tracking-widest">Calories Consumed</p>
                            <p className="text-kinetik-mint font-bold mt-2">{remaining} kcal remaining</p>
                        </div>

                        <div className="space-y-4 mb-8 text-left">
                            {[
                                { label: 'Protein', val: totals.total_protein_g, goal: goals.protein, color: 'bg-gradient-to-r from-kinetik-mint to-kinetik-cyan' },
                                { label: 'Carbs', val: totals.total_carbs_g, goal: goals.carbs, color: 'bg-gradient-to-r from-cyan-400 to-blue-500' },
                                { label: 'Fat', val: totals.total_fats_g, goal: goals.fat, color: 'bg-gradient-to-r from-orange-400 to-pink-500' }
                            ].map(m => (
                                <div key={m.label}>
                                    <div className="flex justify-between mb-1 text-sm font-medium text-kinetik-light-text dark:text-kinetik-dark-text">
                                        <span>{m.label}</span>
                                        <span>{Math.round(m.val)}/{m.goal}g</span>
                                    </div>
                                    <div className="w-full h-3 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${m.color}`} style={{ width: `${Math.min(100, (m.val / m.goal) * 100)}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-black/5 dark:border-white/10 pt-6">
                            <h3 className="font-bold text-kinetik-light-text dark:text-kinetik-dark-text mb-3">Water Intake</h3>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl text-cyan-400">💧</span>
                                <div className="flex-grow h-3 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, (waterCount / waterGoal) * 100)}%` }}></div>
                                </div>
                            </div>
                            <p className="text-sm text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted mb-4">{waterCount} / {waterGoal} glasses</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setWaterCount(Math.max(0, waterCount - 1))} className="w-10 h-10 rounded-full border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 text-xl text-kinetik-light-text dark:text-kinetik-dark-text">-</button>
                                <button onClick={() => setWaterCount(waterCount + 1)} className="w-10 h-10 rounded-full bg-cyan-400 text-white shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 text-xl">+</button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT: Dinner & Snacks */}
                <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <MealSection title="Dinner" mealName="dinner" data={getLogs('dinner')} onAddFood={openAddFoodModal} onDeleteLog={deleteLog} />
                    <MealSection title="Snacks" mealName="snacks" data={getLogs('snacks')} onAddFood={openAddFoodModal} onDeleteLog={deleteLog} />
                </div>

            </div>

            <NutritionModals 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                activeModal={activeModal}
                mealName={currentMeal}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                foodSearchResults={foodSearchResults}
                isFoodLoading={isFoodLoading}
                onSelectFood={handleSelectFood}
                onStartCamera={startCamera}
                currentFood={currentFood}
                quantity={quantity}
                setQuantity={setQuantity}
                onConfirmAdd={logMeal}
                onBack={() => setActiveModal('food')}
                videoRef={videoRef}
                canvasRef={canvasRef}
                onSnapPhoto={snapPhoto}
                onCloseCamera={() => { stopCamera(); setActiveModal('food'); }}
            />
        </div>
    );
};

export default Nutrition;
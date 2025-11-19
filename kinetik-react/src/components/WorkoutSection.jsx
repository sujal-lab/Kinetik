import React, { useState } from 'react';

const WorkoutSection = ({ title, type, exercises, onAddLog }) => {
    const [selectedExercise, setSelectedExercise] = useState('');
    const [input1, setInput1] = useState(''); // Reps or Minutes
    const [input2, setInput2] = useState(''); // Sets (optional)
    const [search, setSearch] = useState('');

    // Filter exercises based on search
    const filteredExercises = exercises.filter(ex => 
        ex.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        if (!selectedExercise) return;
        
        const exerciseObj = exercises.find(e => e.name === selectedExercise);
        if (!exerciseObj) return;

        const val1 = parseFloat(input1) || 0;
        const val2 = parseFloat(input2) || 0;

        let calories = 0;
        // Logic: Calculate calories based on reps or duration
        if (exerciseObj.perRep) {
            calories = val1 * exerciseObj.perRep * (val2 || 1); // Reps * Cals * Sets
        } else if (exerciseObj.perMinute) {
            calories = val1 * exerciseObj.perMinute; // Minutes * Cals
        }

        onAddLog({
            id: Date.now(), // Temporary unique ID
            section: type,
            name: exerciseObj.name,
            val1,
            val2,
            calories,
            isDuration: !!exerciseObj.perMinute
        });

        // Reset inputs
        setInput1('');
        setInput2('');
        setSelectedExercise('');
    };

    return (
        <div className="kinetik-card p-6 flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text capitalize">{title}</h3>
                <span className="text-xs font-bold px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">
                    {type.toUpperCase()}
                </span>
            </div>

            {/* Search */}
            <input 
                type="text" 
                placeholder={`Search ${title}...`} 
                className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-kinetik-cyan outline-none text-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Controls */}
            <div className="flex flex-col gap-3 mt-auto">
                <select 
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-kinetik-cyan"
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                >
                    <option value="" disabled>Select Exercise</option>
                    {filteredExercises.map(ex => (
                        <option key={ex.name} value={ex.name}>{ex.name}</option>
                    ))}
                </select>
                
                <div className="flex gap-2">
                    <input 
                        type="number" 
                        placeholder={type === 'cardio' || type === 'core' ? "Mins/Reps" : "Reps"} 
                        className="w-1/2 p-3 rounded-xl bg-black/5 dark:bg-white/5 text-sm outline-none text-center"
                        value={input1}
                        onChange={(e) => setInput1(e.target.value)}
                    />
                    
                    {type !== 'cardio' && (
                        <input 
                            type="number" 
                            placeholder="Sets" 
                            className="w-1/2 p-3 rounded-xl bg-black/5 dark:bg-white/5 text-sm outline-none text-center"
                            value={input2}
                            onChange={(e) => setInput2(e.target.value)}
                        />
                    )}
                </div>

                <button 
                    onClick={handleAdd}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-kinetik-mint to-kinetik-cyan text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all active:scale-95"
                >
                    + Add Log
                </button>
            </div>
        </div>
    );
};

export default WorkoutSection;
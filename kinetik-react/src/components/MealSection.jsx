import React from 'react';

const MealSection = ({ title, mealName, data, onAddFood, onDeleteLog }) => {
    const { logs, totalCals } = data;

    return (
        <section className="kinetik-card p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">{title}</h3>
                <p className="font-mono font-bold text-kinetik-mint">{Math.round(totalCals)} kcal</p>
            </div>

            <div className="flex flex-col gap-3 flex-grow mb-4 min-h-[80px]">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-black/5 dark:border-white/10 rounded-xl opacity-60">
                        <svg className="w-6 h-6 mb-2 text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-sm text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">Add your first item</p>
                    </div>
                ) : (
                    logs.map(log => (
                        <div key={log.log_id} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-3 rounded-xl transition-all hover:bg-black/10 dark:hover:bg-white/10">
                            <div>
                                <p className="font-medium text-kinetik-light-text dark:text-kinetik-dark-text">{log.name}</p>
                                <p className="text-sm text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">{Math.round(log.calories)} kcal • {log.description}</p>
                            </div>
                            <button 
                                onClick={() => onDeleteLog(log.log_id)}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-kinetik-light-text-muted hover:text-white hover:bg-red-500 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>

            <button 
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-kinetik-mint to-kinetik-cyan shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all active:scale-95"
                onClick={() => onAddFood(mealName)}
            >
                + Add Food
            </button>
        </section>
    );
};

export default MealSection;
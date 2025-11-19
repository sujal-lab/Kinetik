import React from 'react';

const NutritionModals = ({
    isOpen,
    onClose,
    activeModal,
    mealName,
    // Search Props
    searchQuery,
    setSearchQuery,
    foodSearchResults,
    isFoodLoading,
    onSelectFood,
    onStartCamera,
    // Quantity Props
    currentFood,
    quantity,
    setQuantity,
    onConfirmAdd,
    onBack,
    // Camera Props
    videoRef,
    canvasRef,
    onSnapPhoto,
    onCloseCamera
}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity" onClick={onClose}>
            <div 
                className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-white dark:bg-kinetik-dark-bg-to rounded-2xl shadow-2xl border border-white/10 flex flex-col p-6" 
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                {/* --- MODAL 1: SEARCH FOOD --- */}
                {activeModal === 'food' && (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">Add to <span className="text-kinetik-mint capitalize">{mealName}</span></h2>
                            <p className="text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">Search or scan your food</p>
                        </div>

                        <div className="flex gap-3 mb-6">
                            <input 
                                type="search"
                                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent focus:border-kinetik-cyan focus:ring-1 focus:ring-kinetik-cyan outline-none transition-all text-kinetik-light-text dark:text-kinetik-dark-text"
                                placeholder="🔍 Search (e.g. Apple)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <button onClick={onStartCamera} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-kinetik-cyan hover:bg-kinetik-cyan hover:text-white transition-colors">
                                📷
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-h-[100px] relative">
                            {isFoodLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/50 rounded-xl z-10">
                                    <div className="w-8 h-8 border-4 border-kinetik-mint border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            {!isFoodLoading && foodSearchResults.length === 0 && (
                                <div className="col-span-full text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                                    {searchQuery ? 'No foods found.' : 'Start typing to search.'}
                                </div>
                            )}

                            {foodSearchResults.map(food => (
                                <button 
                                    key={food.food_id}
                                    onClick={() => onSelectFood(food.food_id)}
                                    className="flex flex-col items-center p-4 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-kinetik-mint rounded-xl hover:bg-kinetik-mint/10 transition-all group"
                                >
                                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🍽️</span>
                                    <span className="text-sm font-medium text-center text-kinetik-light-text dark:text-kinetik-dark-text">{food.name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* --- MODAL 2: QUANTITY --- */}
                {activeModal === 'quantity' && currentFood && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🍽️</div>
                            <h2 className="text-2xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">{currentFood.name}</h2>
                            <p className="text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted">Base: {currentFood.calories} kcal per {currentFood.serving_desc}</p>
                        </div>

                        <div className="flex items-center justify-center gap-4 mb-8">
                            <input 
                                type="number"
                                className="w-24 p-3 text-center text-2xl font-bold rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent focus:border-kinetik-mint outline-none text-kinetik-light-text dark:text-kinetik-dark-text"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
                                step="0.5"
                            />
                            <span className="text-lg text-gray-500 dark:text-gray-400">x ({currentFood.serving_desc})</span>
                        </div>

                        <div className="text-center text-xl font-bold mb-8 text-kinetik-light-text dark:text-kinetik-dark-text">
                            Total: <span className="text-kinetik-mint">{Math.round(currentFood.calories * quantity)}</span> kcal
                        </div>

                        <div className="flex gap-4">
                            <button onClick={onBack} className="w-full py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">Back</button>
                            <button onClick={onConfirmAdd} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-kinetik-mint to-kinetik-cyan hover:shadow-lg hover:scale-[1.02] transition-all">Add to Meal</button>
                        </div>
                    </>
                )}

                {/* --- MODAL 3: CAMERA --- */}
                {activeModal === 'camera' && (
                    <>
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold text-kinetik-light-text dark:text-kinetik-dark-text">Scan Food</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Center the food item in the frame</p>
                        </div>

                        <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden mb-6 ring-2 ring-white/10">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
                            <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={onCloseCamera} className="w-full py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">Cancel</button>
                            <button onClick={onSnapPhoto} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-kinetik-mint to-kinetik-cyan hover:shadow-lg transition-all">Snap Photo</button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default NutritionModals;
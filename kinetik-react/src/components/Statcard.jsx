import React from 'react';

const Statcard = ({ value, label, icon, color = "text-kinetik-cyan", bgColor = "bg-kinetik-cyan/10 dark:bg-kinetik-cyan/20" }) => {
  return (
    <div className="kinetik-card p-7 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] duration-300">
      <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center ${bgColor} ${color}`}>
        {icon}
      </div>
      <div className="text-5xl lg:text-6xl font-extrabold text-kinetik-light-text dark:text-kinetik-dark-text mt-4">
        {value}
      </div>
      <div className="text-sm font-semibold uppercase tracking-wider text-kinetik-light-text-muted dark:text-kinetik-dark-text-muted mt-2">
        {label}
      </div>
    </div>
  );
};

export default Statcard;
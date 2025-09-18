import React from 'react';

interface ThemeToggleProps {
  onToggle: () => void;
  isLiquidGlass: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle, isLiquidGlass }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 rounded-full px-2 py-2 text-sm text-white/80 hover:text-white
                 transition-all duration-300 ease-in-out"
      title={isLiquidGlass ? '切换到普通主题' : '切换到液态玻璃主题'}
    >
      {isLiquidGlass ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
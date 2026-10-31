import React from 'react';

interface WeatherIconProps {
  type: 'clear-night' | 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ type, className = '', size = 28 }) => {
  switch (type) {
    case 'clear-night':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`text-blue-200 drop-shadow-[0_0_8px_rgba(147,197,253,0.5)] ${className}`}
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="#93c5fd"
            stroke="#bfdbfe"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'sunny':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] ${className}`}
        >
          <circle cx="12" cy="12" r="5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="12" y1="1" x2="12" y2="3.5" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="20.5" x2="12" y2="23" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.22" y1="4.22" x2="5.99" y2="5.99" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="18.01" y1="18.01" x2="19.78" y2="19.78" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="1" y1="12" x2="3.5" y2="12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="20.5" y1="12" x2="23" y2="12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.22" y1="19.78" x2="5.99" y2="18.01" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="18.01" y1="5.99" x2="19.78" y2="4.22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'partly-cloudy':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] ${className}`}
        >
          {/* Sun behind */}
          <circle cx="15.5" cy="8.5" r="3.5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1" />
          <line x1="15.5" y1="2.5" x2="15.5" y2="3.8" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="5.5" x2="18.9" y2="6.6" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="21.5" y1="9" x2="20.2" y2="9" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cloud in front */}
          <path
            d="M8.5 19H17a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.4-1.5A4 4 0 0 0 8.5 19z"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'cloudy':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`text-slate-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] ${className}`}
        >
          <path
            d="M17.5 19H6.5A5.5 5.5 0 0 1 6.5 8a6 6 0 0 1 11.2-1.8A5 5 0 0 1 17.5 19z"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'rainy':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)] ${className}`}
        >
          <path
            d="M19 14.5A4.5 4.5 0 0 0 16 7a5.5 5.5 0 0 0-10.3 1.8A4 4 0 0 0 5 14.5"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line x1="8" y1="17" x2="7" y2="20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="17" x2="11" y2="20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="17" x2="15" y2="20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};


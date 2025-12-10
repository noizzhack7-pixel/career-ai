import React from 'react';

interface MatchScoreProps {
  score: number;
  compact?: boolean;
  isWhite?: boolean;
  // Legacy props
  size?: number;
  colorClass?: string;
  strokeWidth?: number;
  showLabel?: boolean;
  showScore?: boolean;
}

export const MatchScore = ({
  score,
  isWhite = false,
  compact = false,
  showScore = false
}: MatchScoreProps) => {

  // Determine level configuration based on score
  let config = {
    text: 'התאמה נמוכה',
    color: '#9DD9D2',
    fillPercent: 15
  };

  if (score >= 80) {
    config = { text: 'התאמה מצויינת', color: '#650F54', fillPercent: showScore ? score : 100 };
  } else if (score >= 60) {
    config = { text: 'התאמה גבוהה', color: '#8C2F7A', fillPercent: showScore ? score : 70 };
  } else if (score >= 40) {
    config = { text: 'התאמה טובה', color: '#CBA0E6', fillPercent: showScore ? score : 50 };
  } else if (score >= 20) {
    config = { text: 'התאמה בינונית', color: '#EAD8FD', fillPercent: showScore ? score : 30 };
  }

  // Dimensions
  const size = compact ? 48 : 96;
  const strokeWidth = compact ? 4 : 8; // Scaled down for compact
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (config.fillPercent / 100) * circumference;

  // Split text for display if needed
  const words = config.text.split(' ');
  const firstLine = words[0]; // התאמה
  const secondLine = words.slice(1).join(' '); // גבוהה מאוד / גבוהה / ...

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* SVG Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#E5E5E5"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={config.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Text Label */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center leading-tight">
        {showScore ? (
          <span className={`text-s ${isWhite ? 'color:white' : 'text-neutral-600'}`}>{score}%</span>
        ) : (
          compact ? (
            <span className="text-[10px] text-neutral-dark whitespace-nowrap">{secondLine}</span>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-neutral-dark font-rubik">{firstLine}</span>
              <span className="text-xs text-neutral-600">{secondLine}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

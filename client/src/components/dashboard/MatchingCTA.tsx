import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

interface MatchingCTAProps {
  onRunMatch?: () => void;
}

const PROCESS_STAGES = [
  "מנתח את הפרופיל והכישורים שלך...",
  "סורק הזדמנויות קידום בארגון...",
  "מחשב מדדי התאמה ופערים..."
];

export const MatchingCTA: React.FC<MatchingCTAProps> = ({ onRunMatch }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const handleStartProcess = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isProcessing) return;
    
    setIsProcessing(true);
    setCurrentStage(0);
  };

  useEffect(() => {
    if (!isProcessing) return;

    const stageDuration = 1500; // 1.5 seconds per stage
    
    const timer = setTimeout(() => {
      if (currentStage < PROCESS_STAGES.length - 1) {
        setCurrentStage(prev => prev + 1);
      } else {
        // Complete the process
        setTimeout(() => {
          onRunMatch?.();
        }, 500); // Small delay after last stage
      }
    }, stageDuration);

    return () => clearTimeout(timer);
  }, [isProcessing, currentStage, onRunMatch]);

  return (
    <section 
      onClick={handleStartProcess}
      className={`bg-gradient-to-r from-primary to-primary-dark rounded-card shadow-lg py-5 px-6 my-6 flex items-center justify-between border border-primary/20 relative overflow-hidden group hover:shadow-xl transition-all ${isProcessing ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 pointer-events-none blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full -ml-10 -mb-10 pointer-events-none blur-xl"></div>
      
      <div className="relative z-10 flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner backdrop-blur-sm">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
            רוצה לגלות אילו תפקידים מתאימים לך בארגון?
          </h2>
          <p className="text-sm text-white/90 font-medium">
            נחשב עבורך התאמות על בסיס הניסיון, הכישורים והיעדים שלך.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        {!isProcessing ? (
          <button 
            onClick={handleStartProcess}
            className="bg-white text-primary text-sm font-bold py-2.5 px-6 rounded-pill hover:bg-neutral-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            צור התאמות עבורך
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex flex-col items-end justify-center min-w-[240px]">
            <div className="flex items-center gap-3 mb-2 animate-in fade-in slide-in-from-right-4 duration-500">
              <span className="text-white text-sm font-bold tracking-wide">
                {PROCESS_STAGES[currentStage]}
              </span>
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                style={{ width: `${((currentStage + 1) / PROCESS_STAGES.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
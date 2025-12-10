import React from 'react';
import { MatchScore } from '../MatchScore';
import { Heart, ArrowLeft, Building2, MapPin } from 'lucide-react';

interface LikedJobsSummaryProps {
  onNavigate?: (page: 'match') => void;
  employeeData?: any;
}

export const LikedJobsSummary: React.FC<LikedJobsSummaryProps> = ({ onNavigate, employeeData }) => {
  const liked = Array.isArray(employeeData?.liked_positions) ? employeeData.liked_positions : [];
  return (
    <section className="bg-white rounded-card shadow-card overflow-hidden border-t-4 border-primary animate-in slide-in-from-top-6 duration-700 fade-in">
      <div className="p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-neutral-dark flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            משרות שאהבתי
          </h3>
          {liked.length > 0 && (
            <button
              onClick={() => onNavigate?.('match')}
              className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline flex items-center gap-1 transition-colors"
            >
              צפה בכל המשרות שאהבתי ({liked.length})<ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {liked.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-neutral-600 font-medium mb-2">עדיין לא סימנת משרות שאהבת</p>
            <p className="text-neutral-400 text-sm">גלה משרות חדשות וסמן את המועדפות שלך</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {liked.map((job: any, idx: number) => {
            const title = job.position_name || job.name || job.title || job.id || `משרה ${idx + 1}`;
            const rawScore = job.score ?? job.match ?? job.matchPercent ?? 0;
            let matchScoreNum = Number(rawScore);
            if (!Number.isFinite(matchScoreNum)) matchScoreNum = 0;
            const matchScore = Math.max(0, Math.min(100, matchScoreNum));
            const department = job.category || job.department || 'מחלקה';
            const location = job.location || job.work_model || '';

            return (
              <div key={job.position_id || job.id || idx} className="bg-white p-4 rounded-card border border-neutral-light hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-2.5">
                  <h5 className="font-bold text-neutral-dark group-hover:text-primary transition-colors line-clamp-1 text-sm" title={title}>{title}</h5>
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500 flex-shrink-0" />
                </div>
                <div className="text-xs text-neutral-medium mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="line-clamp-1">{department}{location ? ` | ${location}` : ''}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <MatchScore score={matchScore} compact={true} showScore={true} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

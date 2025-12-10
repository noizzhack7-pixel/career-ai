import React from 'react';
import { Target, CheckCircle, AlertCircle, Clock, Map } from 'lucide-react';

interface TargetRoleProps {
  employeeData?: any;
}

export const TargetRole: React.FC<TargetRoleProps> = ({ employeeData }) => {
  const starRaw = employeeData?.star_position;
  const star = starRaw?.raw_profile || starRaw || {};
  console.log(employeeData);
  const title =
    star.position_name ||
    star.profile_name ||
    star.position_title ||
    star.title ||
    star.name ||
    'תפקיד יעד';
  const subtitle = star.profile_name || star.subtitle;
  const division = star.category || star.department || 'חטיבת טכנולוגיות';
  const rawMatch =
    star.match_percentage ??
    star.matchPercent ??
    star.match ??
    star.score ??
    0;
  const numericMatch = Number(rawMatch);
  const normalizedMatch =
    Number.isFinite(numericMatch) && numericMatch > 0 && numericMatch <= 1
      ? numericMatch * 100
      : numericMatch;
  const match = Math.max(0, Math.min(100, normalizedMatch || 0));
  const description = star.profile_description || star.description;

  return (
    <section id="target-role-section" className="bg-gradient-to-br from-primary to-accent-dark text-white p-6 rounded-card shadow-panel">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Target className="w-5 h-5" />
        תפקיד היעד שלי
      </h3>

      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-card mb-4">
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <p className="text-sm text-white/90 mb-3">{subtitle}</p>
        {description && <p className="text-xs text-white/80 mb-3 line-clamp-3">{description}</p>}

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm">התאמה נוכחית</span>
          <span className="font-bold text-xl">{match}%</span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2 mb-3">
          <div className="bg-white h-2 rounded-full" style={{ width: `${match}%` }}></div>
        </div>

        {/* <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-status-success w-4 h-4" />
            <span>מיומנויות חובה</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-status-warning w-4 h-4" />
            <span>פערים לשיפור</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>זמן משוער</span>
          </div>
        </div> */}
      </div>

      <button className="w-full bg-white text-primary font-bold py-3 rounded-card hover:bg-neutral-extralight transition-colors flex items-center justify-center gap-2">
        <Map className="w-4 h-4" />
        צפה בתוכנית פיתוח
      </button>
    </section>
  );
};

import React from 'react';
import { MatchScore } from '../MatchScore';
import { Heart, ArrowLeft, Building2, MapPin } from 'lucide-react';

interface LikedJobsSummaryProps {
  onNavigate?: (page: 'match') => void;
  employeeData?: any;
}

export const LikedJobsSummary: React.FC<LikedJobsSummaryProps> = ({ onNavigate, employeeData }) => {
  return (
    <section className="bg-white rounded-card shadow-card overflow-hidden border-t-4 border-primary animate-in slide-in-from-top-6 duration-700 fade-in">
      <div className="p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-neutral-dark flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            משרות שאהבתי
            {/* <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full border border-neutral-200">12</span> */}
          </h3>
          {employeeData?.liked_positions && employeeData.liked_positions.length > 0 && (
            <button
              onClick={() => onNavigate?.('match')}
              className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline flex items-center gap-1 transition-colors"
            >
              צפה בכל המשרות שאהבתי ({employeeData?.liked_positions?.length || 0})<ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {employeeData?.liked_positions && employeeData.liked_positions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">

            <p className="text-neutral-600 font-medium mb-2">עדיין לא סימנת משרות שאהבת</p>
            <p className="text-neutral-400 text-sm">גלה משרות חדשות וסמן את המועדפות שלך</p>
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {employeeData?.liked_positions?.map((job: any) => (
            <div key={job.id} className="bg-white p-4 rounded-card border border-neutral-light hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-2.5">
                <h5 className="font-bold text-neutral-dark group-hover:text-primary transition-colors line-clamp-1 text-sm" title={job.title}>{job.title}</h5>
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500 flex-shrink-0" />
              </div>
              <div className="text-xs text-neutral-medium mb-3.5">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  {job.id === 102 ? 'חטיבת המוצר' : 'חטיבת הטכנולוגיות'} | {job.id === 101 ? 'פיתוח דיגיטל' : job.id === 102 ? 'פלטפורמה' : 'ארכיטקטורה'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <MatchScore score={job.match} compact={true} />
              </div>
            </div>
          ))}
          {/* {[
            { id: 101, title: 'Senior Full Stack Engineer', company: 'TechNova', location: 'תל אביב', match: 94 },
            { id: 102, title: 'Product Team Lead', company: 'StartUp Nation', location: 'הרצליה', match: 75 },
            { id: 103, title: 'Backend Architect', company: 'CyberShield', location: 'חיפה', match: 55 },
          ].map((job) => (
            <div key={job.id} className="bg-white p-4 rounded-card border border-neutral-light hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-2.5">
                <h5 className="font-bold text-neutral-dark group-hover:text-primary transition-colors line-clamp-1 text-sm" title={job.title}>{job.title}</h5>
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500 flex-shrink-0" />
              </div>
              <div className="text-xs text-neutral-medium mb-3.5">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  {job.id === 102 ? 'חטיבת המוצר' : 'חטיבת הטכנולוגיות'} | {job.id === 101 ? 'פיתוח דיגיטל' : job.id === 102 ? 'פלטפורמה' : 'ארכיטקטורה'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <MatchScore score={job.match} compact={true} />
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </section>
  );
};

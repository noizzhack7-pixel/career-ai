import React from 'react';
import { Zap, ClipboardList, Search, GraduationCap, Plus } from 'lucide-react';

export const QuickActions = () => {
  return (
    <section id="quick-actions" className="bg-white p-6 rounded-card shadow-card">
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        פעולות מהירות
      </h3>

      <div className="space-y-2">
        <button className="w-full text-right bg-primary-light/20 hover:bg-primary-light/40 p-3 rounded-card transition-colors flex items-center gap-3 group">
          <ClipboardList className="text-primary w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-neutral-dark">השלם שאלון מיומנויות</span>
        </button>
        <button className="w-full text-right bg-accent/10 hover:bg-accent/20 p-3 rounded-card transition-colors flex items-center gap-3 group">
          <Search className="text-accent-dark w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-neutral-dark">חפש תפקידים מתאימים</span>
        </button>
        <button className="w-full text-right bg-secondary/10 hover:bg-secondary/20 p-3 rounded-card transition-colors flex items-center gap-3 group">
          <GraduationCap className="text-secondary w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-neutral-dark">עדכן השכלה</span>
        </button>
        <button className="w-full text-right bg-status-success/10 hover:bg-status-success/20 p-3 rounded-card transition-colors flex items-center gap-3 group">
          <Plus className="text-status-success w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-neutral-dark">הוסף המלצה</span>
        </button>
      </div>
    </section>
  );
};

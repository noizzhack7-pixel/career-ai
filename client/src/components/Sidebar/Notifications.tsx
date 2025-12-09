import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';

export const Notifications = () => {
  return (
    <section id="notifications-section" className="bg-white p-6 rounded-card shadow-card">
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" />
        התראות אחרונות
      </h3>
      
      <div className="space-y-3">
        <div className="p-3 bg-primary-light/20 rounded-card border-r-4 border-primary">
          <p className="text-sm font-semibold text-neutral-dark mb-1">משרה חדשה מתאימה!</p>
          <p className="text-xs text-neutral-medium">נפתחה משרה "ראש צוות" עם 92% התאמה</p>
          <p className="text-xs text-neutral-medium mt-1">לפני שעתיים</p>
        </div>
        <div className="p-3 bg-accent/10 rounded-card border-r-4 border-accent">
          <p className="text-sm font-semibold text-neutral-dark mb-1">עדכון תוכנית פיתוח</p>
          <p className="text-xs text-neutral-medium">השלמת 2 משימות נוספות</p>
          <p className="text-xs text-neutral-medium mt-1">אתמול</p>
        </div>
        <div className="p-3 bg-secondary/10 rounded-card border-r-4 border-secondary">
          <p className="text-sm font-semibold text-neutral-dark mb-1">המלצה חדשה</p>
          <p className="text-xs text-neutral-medium">דני לוי הוסיף המלצה לפרופיל שלך</p>
          <p className="text-xs text-neutral-medium mt-1">לפני 3 ימים</p>
        </div>
      </div>

      <button className="w-full mt-3 text-primary hover:underline text-sm font-semibold flex items-center justify-center gap-1">
        צפה בכל ההתראות
        <ArrowLeft className="w-3 h-3" />
      </button>
    </section>
  );
};

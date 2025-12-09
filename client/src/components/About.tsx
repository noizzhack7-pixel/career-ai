import React from 'react';
import { User, Pen } from 'lucide-react';

export const About = () => {
  return (
    <section id="about-section" className="bg-white p-8 rounded-card shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
          <User className="w-6 h-6" />
          אודות
        </h2>
        <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-2">
          <Pen className="w-3 h-3" />
          ערוך
        </button>
      </div>
      <p className="text-neutral-dark leading-relaxed text-base">
        מפתחת תוכנה בכירה עם למעלה מ-5 שנות ניסיון בפיתוח מערכות Backend מורכבות. מתמחה בטכנולוגיות Java ו-Spring Boot, עם דגש על ארכיטקטורת Microservices ו-REST API. בעלת ניסיון מוכח בהובלת פרויקטים טכנולוגיים ובעבודת צוות. מחפשת הזדמנויות להתפתח לתפקידי הובלה טכנית וניהול.
      </p>
      
      <div className="mt-6 pt-6 border-t border-neutral-light">
        <h3 className="text-lg font-bold text-primary mb-4">תחומי עניין מקצועיים</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-pill text-sm font-semibold border border-primary/20">Cloud Architecture</span>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-pill text-sm font-semibold border border-primary/20">DevOps</span>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-pill text-sm font-semibold border border-primary/20">ניהול צוותים</span>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-pill text-sm font-semibold border border-primary/20">ארכיטקטורת מערכות</span>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-pill text-sm font-semibold border border-primary/20">Machine Learning</span>
        </div>
      </div>
    </section>
  );
};

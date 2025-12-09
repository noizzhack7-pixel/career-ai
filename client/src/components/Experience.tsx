import React from 'react';
import { Briefcase, Plus, Star, Code, Laptop, Calendar, CheckCircle } from 'lucide-react';

export const Experience = () => {
  return (
    <section id="experience-section" className="bg-white p-8 rounded-card shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
          <Briefcase className="w-6 h-6" />
          ניסיון תעסוקתי
        </h2>
        <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-2">
          <Plus className="w-3 h-3" />
          הוסף
        </button>
      </div>

      <div className="relative">
        <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-primary/20"></div>
        
        <div className="space-y-8">
          <div className="relative pr-16">
            <div className="absolute right-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-card border-4 border-white">
              <Star className="text-white w-6 h-6" />
            </div>
            <div className="bg-primary/5 p-6 rounded-card border-2 border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-primary">מפתחת תוכנה בכירה</h3>
                  <p className="text-neutral-dark font-semibold">חטיבת טכנולוגיות - מחלקת פיתוח Backend</p>
                  <p className="text-sm text-neutral-medium flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3" />
                    2021 - היום (3 שנים ו-11 חודשים)
                  </p>
                </div>
                <span className="bg-status-success/20 text-status-success px-3 py-1 rounded-pill text-xs font-bold">תפקיד נוכחי</span>
              </div>
              <p className="text-neutral-dark mb-4">פיתוח והובלת מערכות Backend מבוססות Java ו-Spring Boot. אחראית על תכנון ארכיטקטורה, פיתוח Microservices ושיפור ביצועים.</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-status-success w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">הובלת פיתוח מערכת ניהול לקוחות חדשה המשרתת 100,000+ משתמשים</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-status-success w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">שיפור ביצועי מערכת ב-40% באמצעות אופטימיזציות ושימוש ב-Caching</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-status-success w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">מנטורינג של 3 מפתחים זוטרים והובלת Code Reviews</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pr-16">
            <div className="absolute right-0 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-card border-4 border-white">
              <Code className="text-white w-6 h-6" />
            </div>
            <div className="bg-accent/5 p-6 rounded-card border-2 border-accent/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-accent-dark">מפתחת תוכנה</h3>
                  <p className="text-neutral-dark font-semibold">חטיבת טכנולוגיות - מחלקת פיתוח Backend</p>
                  <p className="text-sm text-neutral-medium flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3" />
                    2019 - 2021 (2 שנים)
                  </p>
                </div>
              </div>
              <p className="text-neutral-dark mb-4">פיתוח מערכות Backend בטכנולוגיות Java ו-Spring. עבודה על מגוון פרויקטים ארגוניים.</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-accent-dark w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">פיתוח ותחזוקה של 5 Microservices קריטיים</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-accent-dark w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">שיפור כיסוי בדיקות אוטומטיות ל-85%</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-accent-dark w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">השתתפות בתכנון ארכיטקטורה של מערכות חדשות</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pr-16">
            <div className="absolute right-0 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-card border-4 border-white">
              <Laptop className="text-white w-6 h-6" />
            </div>
            <div className="bg-secondary/5 p-6 rounded-card border-2 border-secondary/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-secondary">מפתחת תוכנה זוטרה</h3>
                  <p className="text-neutral-dark font-semibold">חטיבת טכנולוגיות - מחלקת פיתוח Backend</p>
                  <p className="text-sm text-neutral-medium flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3" />
                    2018 - 2019 (שנה אחת)
                  </p>
                </div>
              </div>
              <p className="text-neutral-dark mb-4">תפקיד ראשון לאחר התואר. למידה מואצת של טכנולוגיות ומתודולוגיות פיתוח.</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-secondary w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">פיתוח פיצ'רים חדשים במערכות קיימות</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-secondary w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">תיקון באגים ושיפור קוד Legacy</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-secondary w-4 h-4 mt-0.5" />
                  <p className="text-sm text-neutral-dark">השתתפות בפגישות Scrum וסקירות קוד</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

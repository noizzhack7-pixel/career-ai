import React from 'react';
import { MessageSquare, Settings, Star, Shield } from 'lucide-react';

export const Recommendations = () => {
  return (
    <section id="recommendations-section" className="bg-white p-8 rounded-card shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          המלצות
        </h2>
        <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-2">
          <Settings className="w-3 h-3" />
          נהל שיתוף
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-card border-2 border-primary/20">
          <div className="flex items-start gap-4 mb-4">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="דני לוי" className="w-16 h-16 rounded-full border-2 border-primary/30" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-primary">דני לוי</h3>
                  <p className="text-sm text-neutral-medium">מנהל מחלקת פיתוח Backend</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-pill font-semibold">מנהל ישיר</span>
                  <span className="text-xs text-neutral-medium">15.11.2024</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-status-warning w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-neutral-dark leading-relaxed">תמר היא מפתחת מצטיינת עם יכולות טכניות גבוהות מאוד. היא הובילה בהצלחה מספר פרויקטים קריטיים והוכיחה יכולת מנהיגות טבעית. תמר תמיד מוכנה לעזור לחברי הצוות ומשתפת ידע בנדיבות. אני ממליץ עליה בחום לתפקידי הובלה טכנית.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/10">
            <span className="bg-accent/20 text-accent-dark px-3 py-1 rounded-pill text-xs font-semibold">מנהיגות</span>
            <span className="bg-accent/20 text-accent-dark px-3 py-1 rounded-pill text-xs font-semibold">מומחיות טכנית</span>
            <span className="bg-accent/20 text-accent-dark px-3 py-1 rounded-pill text-xs font-semibold">עבודת צוות</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent/5 to-primary/5 p-6 rounded-card border-2 border-accent/20">
          <div className="flex items-start gap-4 mb-4">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="יוסי כהן" className="w-16 h-16 rounded-full border-2 border-accent/30" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-accent-dark">יוסי כהן</h3>
                  <p className="text-sm text-neutral-medium">ארכיטקט תוכנה</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-accent/20 text-accent-dark px-3 py-1 rounded-pill font-semibold">עמית צוות</span>
                  <span className="text-xs text-neutral-medium">03.10.2024</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-status-warning w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-neutral-dark leading-relaxed">עבדתי עם תמר על מספר פרויקטים מורכבים. היא מפתחת מעולה עם הבנה עמוקה של ארכיטקטורת מערכות. תמר תמיד מחפשת את הפתרון הטוב ביותר ולא רק את הפתרון המהיר. מומלצת בחום!</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-accent/10">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-pill text-xs font-semibold">חשיבה אנליטית</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-pill text-xs font-semibold">פתרון בעיות</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-pill text-xs font-semibold">ארכיטקטורה</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary/5 to-accent/5 p-6 rounded-card border-2 border-secondary/20">
          <div className="flex items-start gap-4 mb-4">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="מיכל לוי" className="w-16 h-16 rounded-full border-2 border-secondary/30" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-secondary">מיכל לוי</h3>
                  <p className="text-sm text-neutral-medium">מפתחת תוכנה</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-pill font-semibold">עמית צוות</span>
                  <span className="text-xs text-neutral-medium">20.09.2024</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-status-warning w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-neutral-dark leading-relaxed">תמר הייתה המנטורית שלי כשהתחלתי בצוות. היא סבלנית, מסבירה מצוין ותמיד זמינה לעזור. למדתי ממנה המון על best practices ועל איך לכתוב קוד נקי ואיכותי. אני אסירת תודה על ההכוונה שלה!</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-secondary/10">
            <span className="bg-accent/20 text-accent-dark px-3 py-1 rounded-pill text-xs font-semibold">מנטורינג</span>
            <span className="bg-accent/20 text-accent-dark px-3 py-1 rounded-pill text-xs font-semibold">סבלנות</span>
            <span className="bg-accent/20 text-accent-dark px-3 py-1 rounded-pill text-xs font-semibold">שיתוף ידע</span>
          </div>
        </div>
      </div>

      {/* <div className="mt-6 p-4 bg-primary-light/20 rounded-card border border-primary/20">
        <div className="flex items-center gap-3">
          <Shield className="text-primary w-6 h-6" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">שליטה על שיתוף המלצות</p>
            <p className="text-xs text-neutral-medium">ניתן לנהל את הגדרות השיתוף של ההמלצות שלך</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-card text-sm font-semibold hover:bg-primary-dark transition-colors">
            נהל הגדרות
          </button>
        </div>
      </div> */}
    </section>
  );
};

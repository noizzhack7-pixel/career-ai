import React from 'react';
import { Compass, Users, Code, Save } from 'lucide-react';

export const CareerPreferences = () => {
  return (
    <section id="career-preferences" className="bg-white p-6 rounded-card shadow-card">
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <Compass className="w-5 h-5" />
        העדפות קריירה
      </h3>
      
      <div className="space-y-6">
        {/* Category 1: Interests */}
        <div>
          <label className="text-sm font-bold text-neutral-dark mb-3 block">תחומי עניין</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'טכנולוגיה', checked: true },
              { label: 'פיננסים', checked: false },
              { label: 'משאבי אנוש', checked: false },
              { label: 'לוגיסטיקה', checked: false },
              { label: 'שיווק ומכירות', checked: false }
            ].map((tag, idx) => (
              <label key={idx} className="cursor-pointer group">
                <input type="checkbox" defaultChecked={tag.checked} className="peer sr-only" />
                <span className="inline-block px-3 py-1.5 bg-white border border-neutral-300 text-neutral-600 rounded-full text-xs font-medium hover:border-primary/50 transition-all peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary peer-checked:font-bold group-hover:bg-neutral-50">
                  {tag.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category 2: Location */}
        <div>
          <label className="text-sm font-bold text-neutral-dark mb-3 block">מיקום (חול/ארץ)</label>
          <div className="flex flex-wrap gap-2">
             {[
              { label: 'ישראל (מרכז)', checked: true },
              { label: 'ישראל (צפון)', checked: false },
              { label: 'ישראל (דרום)', checked: false },
              { label: 'רילוקיישן (חו"ל)', checked: false },
              { label: 'עבודה מרחוק', checked: true }
            ].map((tag, idx) => (
              <label key={idx} className="cursor-pointer group">
                <input type="checkbox" defaultChecked={tag.checked} className="peer sr-only" />
                <span className="inline-block px-3 py-1.5 bg-white border border-neutral-300 text-neutral-600 rounded-full text-xs font-medium hover:border-primary/50 transition-all peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary peer-checked:font-bold group-hover:bg-neutral-50">
                  {tag.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category 3: Development Path */}
        <div>
          <label className="text-sm font-bold text-neutral-dark mb-3 block">כיוון התפתחות (ניהולי/מקצועי)</label>
          <div className="flex flex-wrap gap-2">
             {[
              { label: 'מסלול ניהולי', checked: false },
              { label: 'מסלול מקצועי (Expert)', checked: true },
              { label: 'ניהול פרויקטים', checked: false },
              { label: 'הובלה טכנולוגית', checked: true }
            ].map((tag, idx) => (
              <label key={idx} className="cursor-pointer group">
                <input type="checkbox" defaultChecked={tag.checked} className="peer sr-only" />
                <span className="inline-block px-3 py-1.5 bg-white border border-neutral-300 text-neutral-600 rounded-full text-xs font-medium hover:border-primary/50 transition-all peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary peer-checked:font-bold group-hover:bg-neutral-50">
                  {tag.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category 4: Education */}
        <div>
          <label className="text-sm font-bold text-neutral-dark mb-3 block">לימודים והכשרות</label>
          <div className="flex flex-wrap gap-2">
             {[
              { label: 'קורס פנימי', checked: true },
              { label: 'הכשרה מקצועית', checked: true },
              { label: 'תואר ראשון', checked: false },
              { label: 'תואר שני', checked: false },
              { label: 'קורס חיצוני', checked: false },
              { label: 'סדנאות', checked: false }
            ].map((tag, idx) => (
              <label key={idx} className="cursor-pointer group">
                <input type="checkbox" defaultChecked={tag.checked} className="peer sr-only" />
                <span className="inline-block px-3 py-1.5 bg-white border border-neutral-300 text-neutral-600 rounded-full text-xs font-medium hover:border-primary/50 transition-all peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary peer-checked:font-bold group-hover:bg-neutral-50">
                  {tag.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button className="w-full mt-4 bg-primary-light/40 text-primary py-2 rounded-card text-sm font-semibold hover:bg-primary-light/60 transition-colors flex items-center justify-center gap-1">
        <Save className="w-4 h-4" />
        שמור העדפות
      </button>
    </section>
  );
};

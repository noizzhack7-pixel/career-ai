import React from 'react';
import { Languages as LanguagesIcon } from 'lucide-react';

export const Languages = () => {
  return (
    <section id="languages-section" className="bg-white p-6 rounded-card shadow-card">
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <LanguagesIcon className="w-5 h-5" />
        שפות
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-dark">עברית</span>
          <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-pill font-semibold">שפת אם</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-dark">אנגלית</span>
          <span className="text-sm bg-accent/20 text-accent-dark px-3 py-1 rounded-pill font-semibold">שוטף</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-dark">ספרדית</span>
          <span className="text-sm bg-neutral-light text-neutral-dark px-3 py-1 rounded-pill font-semibold">בסיסי</span>
        </div>
      </div>
    </section>
  );
};

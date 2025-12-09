import React from 'react';
import { Sparkles, Plus, Brain, Code } from 'lucide-react';

export const Skills = () => {
  return (
    <section id="skills-section" className="bg-white p-8 rounded-card shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          מיומנויות
        </h2>
        <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-2">
          <Plus className="w-3 h-3" />
          הוסף מיומנות
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-accent/5 p-6 rounded-card border-2 border-accent/20">
          <div className="flex items-center gap-3 mb-5">
            <Brain className="text-accent-dark w-6 h-6" />
            <h3 className="text-xl font-bold text-accent-dark">מיומנויות בין אישיות</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">מנהיגות</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">4/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">קליטה מהירה</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">5/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">למידה עצמית</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">5/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">חשיבה אנליטית</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">4/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">פתרון בעיות</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">5/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-card border-2 border-primary/20">
          <div className="flex items-center gap-3 mb-5">
            <Code className="text-primary w-6 h-6" />
            <h3 className="text-xl font-bold text-primary">מיומנויות תפקיד</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">Java & Spring Boot</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">5/5</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill">מומחה</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">Microservices Architecture</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">4/5</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill">מתקדם</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">REST API Design</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">5/5</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill">מומחה</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">SQL & Database Design</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">4/5</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill">מתקדם</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">Docker & Kubernetes</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">3/5</span>
                  <span className="text-xs bg-status-warning/20 text-status-warning px-2 py-1 rounded-pill">בינוני</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-status-warning h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">Cloud Infrastructure (AWS)</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">2/5</span>
                  <span className="text-xs bg-status-warning/20 text-status-warning px-2 py-1 rounded-pill">בסיסי</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-status-warning h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

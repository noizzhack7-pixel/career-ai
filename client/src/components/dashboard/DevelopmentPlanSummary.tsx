import React from 'react';
import { Link, Route, Briefcase, ChartLine, AlertTriangle, CheckCircle, Clock, Target, Brain, Code, Flame, Play, EllipsisVertical, Rocket, ArrowLeft, CalendarPlus, Download, Share2, Plus, X, GraduationCap, Users, Heart, MapPin, Building2 } from 'lucide-react';

interface DevelopmentPlanSummaryProps {
  selectedJob?: any | null;
}

export const DevelopmentPlanSummary: React.FC<DevelopmentPlanSummaryProps> = ({ selectedJob }) => {
  if (!selectedJob) return null;

  const matchPercentage = selectedJob?.matchPercent || 92;

  return (
    <section id="idp-connected" className="bg-white rounded-card shadow-card overflow-hidden border-t-4 border-primary mt-8 animate-in slide-in-from-top-4 duration-500 fade-in">
      <div className="p-6 space-y-8">
        {/* 1. Job Description */}
        <section>
          <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            תאור המשרה
          </h3>
          <div className="bg-white p-5 rounded-card border border-neutral-light shadow-sm space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg text-primary-dark">ראש צוות פיתוח</h4>
                <p className="text-sm text-neutral-medium mt-1">R&D Department · תל אביב (ישראל)</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-pill">
                  התאמה: {matchPercentage}%
                </span>
                <button className="flex items-center gap-1.5 text-neutral-400 hover:text-pink-500 transition-colors group">
                  <Heart className="w-5 h-5 group-hover:fill-pink-500" />
                  <span className="text-xs font-medium">124</span>
                </button>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-neutral-medium mb-2">תאור כללי</h5>
              <p className="text-sm text-neutral-dark leading-relaxed">
                הובלת צוות פיתוח בסטארטאפ צומח. אחריות על ארכיטקטורה (Client & Server), Code Reviews, ומנטורינג.
                דרישות: 5+ שנות ניסיון, React & Node.js, ניסיון בניהול צוות/הובלה טכנית.
              </p>
            </div>

            <div className="flex items-center gap-8 pt-4 border-t border-neutral-light/50">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.dribbble.com/userupload/30451113/file/original-a332396c4b90a7d292b3fa30fd2079ba.png?format=webp&resize=400x300&vertical=centerg"
                  alt="דני כהן"
                  className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <p className="text-xs text-neutral-medium">מנהל משרה</p>
                  <p className="text-sm font-bold text-neutral-dark">דני כהן</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pinimg.com/736x/74/70/9f/74709f0aa1e90ffb6de1f43ac19fa87a.jpg"
                  alt="רונית לוי"
                  className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <p className="text-xs text-neutral-medium">מש"א אחראית</p>
                  <p className="text-sm font-bold text-neutral-dark">רונית לוי</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Required Skills (Merged) */}
        <section>
          <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            כישורים נדרשים
          </h3>
          <div className="bg-white p-5 rounded-card border border-neutral-light shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {selectedJob?.requirements?.map((req: { met: any; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
                <li key={index} className="flex items-center gap-3">
                  {req.met ? (
                    <CheckCircle className="text-status-success w-4 h-4 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-medium flex-shrink-0"></div>
                  )}
                  <span className="text-sm font-medium text-neutral-dark">{req.text}</span>
                </li>
              ))}

              {/* Existing Skills */}
              {/* <li className="flex items-center gap-3">
                <CheckCircle className="text-status-success w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium text-neutral-dark">Java & Spring Ecosystem (Expert)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-status-success w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium text-neutral-dark">Microservices Architecture</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-status-success w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium text-neutral-dark">תקשורת בין-אישית גבוהה</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-status-success w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium text-neutral-dark">אנגלית ברמה גבוהה</span>
              </li> */}

              {/* Missing Skills */}
              {/* <li className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-neutral-medium flex-shrink-0"></div>
                <span className="text-sm font-medium text-neutral-dark">ניהול פרויקטים (PMP)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-neutral-medium flex-shrink-0"></div>
                <span className="text-sm font-medium text-neutral-dark">Cloud Native Architecture (AWS)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-neutral-medium flex-shrink-0"></div>
                <span className="text-sm font-medium text-neutral-dark">ניסיון בניהול משברים</span>
              </li> */}
            </ul>
          </div>
        </section>

        {/* 3. Plan Summary */}
        {/* <section>
          <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            3. הצעד הבא שלי למשרה
          </h3>
          <div className="bg-white p-6 rounded-card border-l-4 border-primary shadow-sm">
            <h4 className="font-semibold text-neutral-dark mb-4">פעולות מומלצות לסגירת הפערים:</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 bg-neutral-light/30 rounded border border-neutral-light">
                <div className="bg-white p-2 rounded-full border border-neutral-light text-primary font-bold">01</div>
                <div>
                  <h5 className="font-bold text-primary-dark">קורס ניהול פרויקטים (PMP)</h5>
                  <p className="text-sm text-neutral-medium">יעד: 15.02.25 · משך: 8 שבועות</p>
                </div>
              </div>
               <div className="flex items-start gap-4 p-3 bg-neutral-light/30 rounded border border-neutral-light">
                <div className="bg-white p-2 rounded-full border border-neutral-light text-primary font-bold">02</div>
                <div>
                  <h5 className="font-bold text-primary-dark">הסמכת AWS Solutions Architect</h5>
                  <p className="text-sm text-neutral-medium">יעד: 30.03.25 · לימוד עצמי</p>
                </div>
              </div>
               <div className="flex items-start gap-4 p-3 bg-neutral-light/30 rounded border border-neutral-light">
                <div className="bg-white p-2 rounded-full border border-neutral-light text-primary font-bold">03</div>
                <div>
                  <h5 className="font-bold text-primary-dark">מנטורינג ניהולי</h5>
                  <p className="text-sm text-neutral-medium">סדרה של 6 מפגשים עם CTO</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
               <button className="text-primary hover:underline font-semibold text-sm flex items-center gap-2">
                 צפה בתוכנית המלאה <ArrowLeft className="w-4 h-4" />
               </button>
            </div>
          </div>
        </section> */}
      </div>
    </section>
  );
};

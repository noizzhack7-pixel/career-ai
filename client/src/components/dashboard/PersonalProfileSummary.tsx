import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Pen, CalendarDays, Layers, User, MapPin, Brain, Code, GraduationCap, CheckCircle2, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/badge';

interface EmployeeData {
   name?: string;
   current_job?: string;
   photo_url?: string;
}

interface PersonalProfileSummaryProps {
   onNavigate?: () => void;
   employeeData?: any;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export const PersonalProfileSummary: React.FC<PersonalProfileSummaryProps> = ({ onNavigate, employeeData }) => {
   const navigate = useNavigate();

   // Get employee data with fallbacks
   const employeeName = employeeData?.name;
   const employeeTitle = employeeData?.current_job;
   const employeeAvatar = employeeData?.photo_url || DEFAULT_AVATAR;

   return (
      <div
         onClick={() => console.log('Navigate to full profile')}
         className="bg-white rounded-card shadow-card overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary/20 border border-transparent transition-all relative group"
      >
         <div className="relative">
            {/* Restored Gradient & Reduced Height (h-32) */}
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-neutral-50 overflow-hidden relative">
               <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
               <img
                  className="w-full h-full object-cover opacity-90 mix-blend-overlay"
                  src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                  alt="Cover"
               />
               <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 left-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
               >
                  <Camera className="text-neutral-dark w-4 h-4" />
               </button>
            </div>

            {/* Profile Avatar - Positioned for compact layout */}
            <div className="absolute top-12 right-6">
               <img
                  src={employeeAvatar}
                  alt={`תמונת פרופיל של ${employeeName}`}
                  className="w-32 h-32 rounded-full border-[6px] border-white shadow-panel object-cover"
               />
            </div>
         </div>

         <div className="pt-16 pb-6 px-6">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-primary mb-0.5 group-hover:text-primary-dark transition-colors">{employeeName}</h1>
                  <p className="text-base font-bold text-neutral-dark mb-3">{employeeTitle}</p>

                  <div className="space-y-1.5">
                     <div className="flex items-center gap-2 text-sm">
                        <MapPin className="text-primary w-4 h-4" />
                        <span className="font-semibold text-primary">מטה כללי, בניין אלון</span>
                        <span className="text-neutral-dark/80">|</span>
                        <span className="font-semibold text-primary">employeeData?.department</span>
                        <span className="text-neutral-dark/80">|</span>
                        <span className="text-neutral-dark/90">מחלקת פיתוח Backend</span>
                     </div>

                     <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                           <CalendarDays className="text-primary w-4 h-4" />
                           <span className="text-neutral-dark/80">ותק:</span>
                           <span className="font-semibold text-neutral-dark">5 שנים</span>
                        </div>
                        <div className="w-px h-3 bg-neutral-light"></div>
                        <div className="flex items-center gap-1.5">
                           <Layers className="text-primary w-4 h-4" />
                           <span className="text-neutral-dark/80">דרגה:</span>
                           <span className="font-semibold text-neutral-dark">Senior Developer</span>
                        </div>
                        <div className="w-px h-3 bg-neutral-light"></div>
                        <div className="flex items-center gap-1.5">
                           <User className="text-primary w-4 h-4" />
                           <span className="text-neutral-dark/80">מנהל/ת:</span>
                           <span className="font-semibold text-neutral-dark">דני לוי</span>
                        </div>
                     </div>

                     {/* Core Skills Row */}
                     <div className="mt-4">
                        <div className="w-fit flex items-center gap-3 bg-primary/5 p-2 rounded-xl border border-primary/10">
                           <span className="text-sm font-bold text-primary px-2">גלה את החוזקות שלך</span>
                           <button
                              onClick={(e) => { e.stopPropagation(); navigate("/questionnaire"); }}
                              className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark py-1.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer"
                           >
                              מלא את השאלון
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Profile Completion Widget - Unified */}
               <div
                  onClick={(e) => { e.stopPropagation(); onNavigate?.(); }}
                  className="hidden lg:flex items-center gap-4 bg-transparent border border-transparent hover:bg-neutral-50 hover:border-neutral-200 rounded-full pl-6 pr-4 py-2 shadow-none hover:shadow-sm transition-all cursor-pointer group/progress"
               >
                  <div className="relative w-16 h-16 flex-shrink-0">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-neutral-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-primary/80 group-hover/progress:text-primary transition-colors duration-500 ease-out" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary/80 group-hover/progress:text-primary transition-colors">
                        85%
                     </div>
                  </div>

                  <div className="flex flex-col items-start gap-1">
                     <span className="text-sm font-bold text-neutral-dark/80 group-hover/progress:text-neutral-dark transition-colors leading-none">השלמת פרופיל</span>
                     <div className="flex items-center gap-1.5 text-xs text-neutral-400 group-hover/progress:text-primary transition-colors">
                        <span>חסר: תעודות</span>
                        <Pen className="w-3.5 h-3.5" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Merged Skills & Education Section */}
            <div className="border-t border-neutral-light/50 pt-6 mb-6" onClick={(e) => e.stopPropagation()}>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Column 1: Skills (Primary Theme) */}
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 relative group/card hover:border-primary/30 transition-all">
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-primary">
                           <div className="p-1.5 bg-white rounded-lg shadow-sm">
                              <Brain className="w-3.5 h-3.5" />
                           </div>
                           <h3 className="font-bold text-sm">מיומנויות ליבה</h3>
                        </div>

                     </div>

                     <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-white text-primary hover:bg-white/90 shadow-sm border-primary/20 pointer-events-none px-2 py-0.5 text-xs">למידה עצמית</Badge>
                        <Badge className="bg-white text-primary hover:bg-white/90 shadow-sm border-primary/20 pointer-events-none px-2 py-0.5 text-xs">חשיבה אנליטית</Badge>
                        <Badge className="bg-white/50 text-primary/70 border-dashed border-primary/30 shadow-none hover:bg-white px-2 py-0.5 text-xs">+2 נוספים</Badge>
                     </div>
                  </div>

                  {/* Column 2: Tech (Accent/Dark Theme) */}
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 relative group/card hover:border-neutral-300 transition-all">
                     <div className="flex items-center gap-2 mb-3 text-neutral-dark">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                           <Code className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-bold text-sm">כישורים מקצועים</h3>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white text-neutral-dark shadow-sm border border-neutral-200 px-2 py-0.5 text-xs">Spring Boot</Badge>
                        <Badge variant="secondary" className="bg-white text-neutral-dark shadow-sm border border-neutral-200 px-2 py-0.5 text-xs">REST API</Badge>
                        <Badge variant="outline" className="bg-transparent border-neutral-300 text-neutral-500 px-2 py-0.5 text-xs">+3 נוספים</Badge>
                     </div>
                  </div>

                  {/* Column 3: Education (Emerald/Success Theme) */}
                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 relative group/card hover:border-emerald-200 transition-all">
                     <div className="flex items-center gap-2 mb-3 text-emerald-700">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                           <GraduationCap className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-bold text-sm">השכלה</h3>
                     </div>
                     <div className="bg-white/60 p-2.5 rounded-xl border border-emerald-100/50 flex items-start gap-2.5 backdrop-blur-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                           <p className="font-bold text-sm text-neutral-dark leading-tight">תואר ראשון במדעי המחשב</p>
                           <p className="text-[11px] text-neutral-500 mt-0.5">אוניברסיטת תל אביב</p>
                           <span className="inline-block mt-1.5 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">הצטיינות דיקן</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
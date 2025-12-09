import React from 'react';
import {
  Camera,
  Circle,
  Building,
  CalendarDays,
  Layers,
  User,
  MapPin,
  Mail,
  Phone,
  Pen,
  Share2,
  Download,
  Trophy,
  Briefcase,
  TrendingUp,
  ArrowUp
} from 'lucide-react';

export const ProfileHero = () => {
  return (
    <section id="profile-hero" className="bg-white rounded-card shadow-card overflow-hidden mb-8">
      <div className="relative">
        <div className="h-64 bg-gradient-to-l from-primary/20 via-accent/10 to-primary/20 overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-50"
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
            alt="Cover background"
          />
          <button className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow-card">
            <Camera className="text-neutral-dark w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-40 right-12">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="תמונת פרופיל של תמר כהן"
              className="w-48 h-48 rounded-full border-8 border-white shadow-panel"
            />
            <button className="absolute bottom-2 left-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-white shadow-card">
              <Camera className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-28 pb-8 px-12">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-4xl font-bold text-primary">תמר כהן</h1>
              <span className="bg-status-success/20 text-status-success px-4 py-1.5 rounded-pill text-sm font-bold flex items-center gap-2">
                <Circle className="w-2 h-2 fill-current" />
                פעילה
              </span>
            </div>
            <p className="text-xl font-semibold text-neutral-dark mb-4">מפתחת תוכנה בכירה</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Building className="text-primary w-4 h-4" />
                <span className="font-semibold text-primary">חטיבת טכנולוגיות</span>
                <span className="text-neutral-medium">|</span>
                <span className="text-neutral-dark">מחלקת פיתוח Backend</span>
                <span className="text-neutral-medium">|</span>
                <span className="text-neutral-dark">צוות ליבה</span>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="text-accent-dark w-4 h-4" />
                  <span className="text-neutral-medium">ותק:</span>
                  <span className="font-semibold text-neutral-dark">5 שנים ו-3 חודשים</span>
                </div>
                <div className="w-px h-4 bg-neutral-medium"></div>
                <div className="flex items-center gap-2">
                  <Layers className="text-accent-dark w-4 h-4" />
                  <span className="text-neutral-medium">דרגה:</span>
                  <span className="font-semibold text-neutral-dark">Senior Developer</span>
                </div>
                <div className="w-px h-4 bg-neutral-medium"></div>
                <div className="flex items-center gap-2">
                  <User className="text-accent-dark w-4 h-4" />
                  <span className="text-neutral-medium">מנהל/ת ישיר/ה:</span>
                  <span className="font-semibold text-neutral-dark">דני לוי</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="text-accent-dark w-4 h-4" />
                  <span className="text-neutral-medium">מיקום:</span>
                  <span className="font-semibold text-neutral-dark">מטה כללי, בניין אלון</span>
                </div>
                <div className="w-px h-4 bg-neutral-medium"></div>
                <div className="flex items-center gap-2">
                  <Mail className="text-accent-dark w-4 h-4" />
                  <span className="font-semibold text-neutral-dark">tamar.cohen@company.co.il</span>
                </div>
                <div className="w-px h-4 bg-neutral-medium"></div>
                <div className="flex items-center gap-2">
                  <Phone className="text-accent-dark w-4 h-4" />
                  <span className="font-semibold text-neutral-dark">03-1234567</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="bg-primary text-white px-6 py-3 rounded-card font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-2">
              <Pen className="w-4 h-4" />
              עריכת פרופיל
            </button>
            <button className="bg-white border-2 border-primary text-primary px-6 py-3 rounded-card font-semibold hover:bg-primary-light/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              שתף פרופיל
            </button>
            <button className="bg-white border-2 border-neutral-light text-neutral-dark px-6 py-3 rounded-card font-semibold hover:bg-neutral-light transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-medium focus:ring-offset-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              ייצא PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-accent/10 to-accent/20 p-5 rounded-card border-2 border-accent/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-card">
                <Trophy className="text-accent-dark w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-accent-dark">34</p>
                <p className="text-xs text-neutral-dark font-medium">קודוס שצברתי</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-5 rounded-card border-2 border-primary/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-neutral-light" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                  <path className="text-primary" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <p className="text-lg font-bold text-primary">85%</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-dark font-medium mb-1">איכות נתונים</p>
                <button className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  שפר נתונים
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary/10 to-secondary/20 p-5 rounded-card border-2 border-secondary/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-card">
                <Briefcase className="text-secondary w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">12</p>
                <p className="text-xs text-neutral-dark font-medium">משרות מתאימות</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-status-success/10 to-status-success/20 p-5 rounded-card border-2 border-status-success/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-card">
                <TrendingUp className="text-status-success w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-status-success">68%</p>
                <p className="text-xs text-neutral-dark font-medium">התקדמות IDP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

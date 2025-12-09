import React, { useState } from 'react';
import { MatchScore } from './MatchScore';
import {
  Search,
  MapPin,
  Building,
  Clock,
  Filter,
  Bookmark,
  Send,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Star,
  GraduationCap,
  Briefcase,
  Check,
  Map as MapIcon, // re-aliased to avoid conflict
  ChevronDown,
  Heart
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  matchPercent: number;
  matchLevel: string;
  matchColor: string; // 'primary' | 'accent-dark' | 'secondary'
  category: string;
  categoryColor: string;
  postedTime: string;
  description: string;
  responsibilities?: string[];
  requirements: {
    text: string;
    status: 'success' | 'warning';
    note: string;
  }[];
  isOpen: boolean;
}

const allJobsData: Job[] = [
  {
    id: 1,
    title: 'ראש צוות פיתוח',
    department: 'חטיבת טכנולוגיות',
    location: 'תל אביב | היברידי',
    matchPercent: 92,
    matchLevel: 'התאמה גבוהה',
    matchColor: 'primary',
    category: 'טכנולוגיה',
    categoryColor: 'bg-blue-100 text-blue-800',
    postedTime: 'פורסם לפני יומיים',
    description: 'אנו מחפשים ראש/ת צוות פיתוח מוכשר/ת ל��צטרף לחטיבת הטכנולוגיות שלנו ולהוביל צוות של מפתחי Backend מבריקים.',
    responsibilities: [
      'ניהול מקצועי ואישי של צוות מפתחי Java.',
      'הובלת תהליכי תכנון, ארכיטקטורה ו-Code Review.',
      'אחריות על איכות הקוד, ביצועים ו-scalability של המערכות.',
      'עבודה בסביבת Microservices ו-Cloud (AWS).',
      'שיתוף פעולה עם צוותים אחרים בארגון להשגת מטרות משותפות.'
    ],
    requirements: [
      { text: 'ניסיון של 5+ שנים בפיתוח Java ו-Spring Boot', status: 'success', note: 'תואם - יש לך 5 שנות ניסיון' },
      { text: 'ניסיון עם ארכיטקטורת Microservices', status: 'success', note: 'תואם - מיומנות קיימת בפרופיל' },
      { text: 'מיומנויות מנהיגות והובלת צוות', status: 'success', note: 'תואם - מיומנות רכה "מנהיגות" מופיעה כחוזקה' },
      { text: 'ניסיון של שנה לפחות בניהול צוות - יתרון', status: 'warning', note: 'פער קטן - ניתן לסגירה באמצעות קורס ניהול והתנסות מעשית' },
      { text: 'ניסיון עם תשתיות ענן (AWS/GCP/Azure) - יתרון', status: 'warning', note: 'פער - מומלץ קורס הסמכה AWS Solutions Architect' }
    ],
    isOpen: true
  },
  {
    id: 2,
    title: 'מנהל/ת תקציבים',
    department: 'חטיבת הכספים',
    location: 'ירושלים | היברידי',
    matchPercent: 81,
    matchLevel: 'התאמה טובה',
    matchColor: 'accent-dark',
    category: 'כספים',
    categoryColor: 'bg-green-100 text-green-800',
    postedTime: 'פורסם לפני 4 ימים',
    description: 'אנו מחפשים מנהל/ת תקציבים מנוסה להצטרף לחטיבת הכספים ולנהל את תהליכי התקצוב הארגוניים.',
    responsibilities: [
      'ניהול תהליכי תקצוב שנתיים ורב- السنوات.',
      'בקרה ומעקב אחר ביצוע תקציבי.',
      'הכנת דוחות כספיים והצגתם önüne הנהלה.',
      'שיתוף פעולה עם מנהלי יחידות לתכנון תקציבי.'
    ],
    requirements: [
      { text: 'תואר ראשון בכלכלה/חשבונאות', status: 'success', note: 'תואם - תואר רלוונטי' },
      { text: 'ניסיון של 3+ שנים בניהול תקציבים', status: 'success', note: 'תואם - 4 שנות ניסיון' },
      { text: 'שליטה מלאה ב-Excel ומערכות ERP', status: 'warning', note: 'פער קטן - מומלץ קורס מתקדם' }
    ],
    isOpen: true
  },
  {
    id: 3,
    title: 'שותף/ה עסקי HR',
    department: 'חטיבת משאבי אנוש',
    location: 'חיפה | משרד מלא',
    matchPercent: 73,
    matchLevel: 'התאמה בינונית',
    matchColor: 'secondary',
    category: 'משאבי אנוש',
    categoryColor: 'bg-purple-100 text-purple-800',
    postedTime: 'פורסם לפני שבוע',
    description: 'אנו מחפשים שותף/ה עסקי HR להצטרף לצוות משאבי האנוש ולתמוך ביחידות העסקיות.',
    responsibilities: [
      'ליווי מנהלים בתהליכי גיוס ופיתוח עובדים.',
      'ניהול תהליכי הערכה וביצועים.',
      'פיתוח תוכניות שימור והתפתחות.'
    ],
    requirements: [
      { text: 'תואר ראשון בניהול משאבי אנוש', status: 'success', note: 'תואם' },
      { text: 'ניסיון של 2+ שנים כשותף עסקי', status: 'warning', note: 'פער - שנה וחצי ניסיון' }
    ],
    isOpen: false
  },
  {
    id: 4,
    title: 'מפתח/ת Fullstack',
    department: 'חטיבת טכנולוגיות',
    location: 'תל אביב | היברידי',
    matchPercent: 89,
    matchLevel: 'התאמה גבוהה',
    matchColor: 'primary',
    category: 'טכנולוגיה',
    categoryColor: 'bg-blue-100 text-blue-800',
    postedTime: 'פורסם לפני 3 ימים',
    description: 'אנו מחפשים מפתח/ת Fullstack מוכשר/ת לפיתוח מערכות ליבה.',
    responsibilities: [
      'פיתוח Frontend ו-Backend.',
      'עבודה עם React ו-Node.js.',
      'שיתוף פעולה עם צוותי מוצר ועיצוב.'
    ],
    requirements: [
      { text: 'ניסיון של 3+ שנים בפיתוח Fullstack', status: 'success', note: 'תואם' },
      { text: 'שליטה ב-React ו-Node.js', status: 'success', note: 'תואם' }
    ],
    isOpen: true
  },
  {
    id: 5,
    title: 'אנליסט/ית דאטה',
    department: 'חטיבת הדאטה',
    location: 'מרוחק',
    matchPercent: 84,
    matchLevel: 'התאמה טובה',
    matchColor: 'accent-dark',
    category: 'טכנולוגיה',
    categoryColor: 'bg-blue-100 text-blue-800',
    postedTime: 'פורסם היום',
    description: 'אנו מחפשים אנליסט/ית דאטה לניתוח נתונים עסקיים.',
    responsibilities: [
      'ניתוח נתונים והפקת תובנות.',
      'בניית דשבורדים ב-Tableau/Power BI.',
      'עבודה עם SQL ו-Python.'
    ],
    requirements: [
      { text: 'ניסיון של 2+ שנים בניתוח דאטה', status: 'success', note: 'תואם' },
      { text: 'שליטה ב-SQL ו-Python', status: 'success', note: 'תואם' }
    ],
    isOpen: true
  },
  {
    id: 6,
    title: 'מנהל/ת פרויקטים',
    department: 'חטיבת תפעול',
    location: 'חיפה | היברידי',
    matchPercent: 68,
    matchLevel: 'התאמה בינונית',
    matchColor: 'secondary',
    category: 'לוגיסטיקה',
    categoryColor: 'bg-orange-100 text-orange-800',
    postedTime: 'פורסם לפני שבוע',
    description: 'אנו מחפשים מנהל/ת פרויקטים לניהול פרויקטים תפעוליים.',
    responsibilities: [
      'ניהול פרויקטים מקצה לקצה.',
      'תיאום בין צוותים.',
      'ניהול לוחות זמנים ותקציבים.'
    ],
    requirements: [
      { text: 'ניסיון של 3+ שנים בניהול פרויקטים', status: 'warning', note: 'פער - שנתיים ניסיון' }
    ],
    isOpen: false
  },
  {
    id: 7,
    title: 'מנהל/ת מוצר',
    department: 'חטיבת מוצר',
    location: 'תל אביב | היברידי',
    matchPercent: 79,
    matchLevel: 'התאמה טובה',
    matchColor: 'accent-dark',
    category: 'טכנולוגיה',
    categoryColor: 'bg-blue-100 text-blue-800',
    postedTime: 'פורסם לפני 5 ימים',
    description: 'אנו מחפשים מנהל/ת מוצר להובלת אסטרטגיית המוצר.',
    responsibilities: [
      'הגדרת חזון ואסטרטגיה.',
      'עבודה עם צוותי פיתוח ועיצוב.',
      'ניתוח שוק ומתחרים.'
    ],
    requirements: [
      { text: 'ניסיון של 3+ שנים בניהול מוצר', status: 'success', note: 'תואם' }
    ],
    isOpen: true
  }
];

export const JobsPage = () => {
  const [currentView, setCurrentView] = useState<'all' | 'open' | 'matched'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyIsrael, setShowOnlyIsrael] = useState<boolean>(false);
  const [showBestMatch, setShowBestMatch] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<number>(1);
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set([1])); // Track liked jobs

  const toggleLike = (jobId: number) => {
    setLikedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const filteredJobs = (() => {
    let jobs = allJobsData;

    if (selectedCategory !== 'all') {
      jobs = jobs.filter(job => job.category === selectedCategory);
    }

    if (showOnlyIsrael) {
      jobs = jobs.filter(job => !job.location.includes('חו״ל') && !job.location.toLowerCase().includes('abroad'));
    }

    if (showBestMatch) {
      jobs = jobs.filter(job => job.matchPercent >= 80);
    }

    switch (currentView) {
      case 'open':
        return jobs.filter(job => job.isOpen);
      case 'matched':
        return jobs.filter(job => job.matchPercent >= 80);
      default:
        return jobs;
    }
  })();

  const selectedJob = allJobsData.find(j => j.id === selectedJobId) || allJobsData[0];
  const isLiked = likedJobs.has(selectedJobId);

  // Helper to get text color class based on matchColor prop string
  const getTextColorClass = (colorName: string) => {
    switch (colorName) {
      case 'primary': return 'text-primary';
      case 'accent-dark': return 'text-accent-dark';
      case 'secondary': return 'text-secondary';
      default: return 'text-primary';
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col -m-10 p-8 max-w-[1800px] mx-auto overflow-y-auto">
      <style>{`
        .job-detail-content h3 { font-size: 1.125rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #541388; }
        .job-detail-content p { font-size: 0.95rem; line-height: 1.6; color: #1F2937; margin-bottom: 1rem; }
        .job-detail-content ul { list-style-type: disc; margin-right: 1.5rem; margin-bottom: 1rem; }
        .job-detail-content li { margin-bottom: 0.5rem; }
        .tab-active { border-bottom: 3px solid #541388; color: #541388; font-weight: 700; }
      `}</style>

      {/* Tabs Section */}
      <section id="jobs-tabs" className="bg-white rounded-card shadow-card mb-6 flex-shrink-0">

      </section>

      {/* Header and Filter Bar */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 id="jobs-count" className="text-xl font-bold text-primary">
            {currentView === 'open' ? `מציג ${filteredJobs.length} משרות פתוחות` : '156 משרות בארגון'}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sort-by" className="font-semibold">מיין לפי:</label>
            <div className="relative">
              <select id="sort-by" className="border-none bg-transparent font-bold text-primary focus:ring-0 appearance-none pr-4 pl-6 cursor-pointer">
                <option>התאמה הגבוהה ביותר</option>
                <option>החדשות ביותר</option>
              </select>
              <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-0 text-primary w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <section id="jobs-filter-bar" className="bg-white p-4 rounded-card shadow-card" aria-label="סינון משרות">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 relative">
              <label htmlFor="job-search" className="sr-only">חיפוש משרה</label>
              <input
                id="job-search"
                type="text"
                placeholder="חיפוש משרה..."
                className="w-full bg-neutral-extralight border-2 border-neutral-light rounded-card py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 right-4 text-neutral-medium w-4 h-4" />
            </div>
            <div className="col-span-2">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-neutral-extralight border-2 border-neutral-light rounded-card py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none"
                >
                  <option value="all">כל הקטגוריות ({currentView === 'open' ? allJobsData.filter(j => j.isOpen).length : 156})</option>
                  <option value="טכנולוגיה">טכנולוגיה ({allJobsData.filter(j => j.category === 'טכנולוגיה' && (currentView === 'open' ? j.isOpen : true)).length})</option>
                  <option value="כספים">כספים ({allJobsData.filter(j => j.category === 'כספים' && (currentView === 'open' ? j.isOpen : true)).length})</option>
                  <option value="משאבי אנוש">משאבי אנוש ({allJobsData.filter(j => j.category === 'משאבי אנוש' && (currentView === 'open' ? j.isOpen : true)).length})</option>
                  <option value="לוגיסטיקה">לוגיסטיקה ({allJobsData.filter(j => j.category === 'לוגיסטיקה' && (currentView === 'open' ? j.isOpen : true)).length})</option>
                </select>
                <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-3 text-neutral-medium w-4 h-4 pointer-events-none" />
              </div>
            </div>
            <div className="col-span-5 flex items-center gap-3 justify-center">
              {/* Toggle: Open Jobs */}
              <button
                onClick={() => setCurrentView(currentView === 'open' ? 'all' : 'open')}
                className="flex items-center gap-2 bg-neutral-extralight border-2 border-neutral-light rounded-card py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-primary/30 group"
                role="switch"
                aria-checked={currentView === 'open'}
              >
                <span className="text-xs text-neutral-dark font-medium group-hover:text-primary transition-colors">משרה פנויה</span>
                <div className={`relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0 ${currentView === 'open' ? 'bg-primary' : 'bg-neutral-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${currentView === 'open' ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </button>

              {/* Toggle: Israel Only */}
              <button
                onClick={() => setShowOnlyIsrael(!showOnlyIsrael)}
                className="flex items-center gap-2 bg-neutral-extralight border-2 border-neutral-light rounded-card py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-primary/30 group"
                role="switch"
                aria-checked={showOnlyIsrael}
              >
                <span className="text-xs text-neutral-dark font-medium group-hover:text-primary transition-colors">ישראל בלבד</span>
                <div className={`relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0 ${showOnlyIsrael ? 'bg-primary' : 'bg-neutral-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${showOnlyIsrael ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </button>

              {/* Toggle: Best Match */}
              <button
                onClick={() => setShowBestMatch(!showBestMatch)}
                className="flex items-center gap-2 bg-neutral-extralight border-2 border-neutral-light rounded-card py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-primary/30 group"
                role="switch"
                aria-checked={showBestMatch}
              >
                <span className="text-xs text-neutral-dark font-medium group-hover:text-primary transition-colors">התאמה גבוהה</span>
                <div className={`relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0 ${showBestMatch ? 'bg-primary' : 'bg-neutral-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${showBestMatch ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </button>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-3">
              <button className="text-sm text-primary hover:underline font-semibold">נקה הכל</button>

            </div>
          </div>
        </section>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-12 gap-6 flex-grow min-h-0">

        {/* Jobs List Column */}
        <div className="col-span-4 h-full flex flex-col max-h-[calc(100vh-280px)]">
          <div id="jobs-list-container" className="flex-grow overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`job-card ${job.id === selectedJobId ? 'bg-primary-light/40 border-primary' : 'bg-white hover:bg-primary-light/20 border-transparent'} border-r-4 p-4 rounded-card cursor-pointer transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-primary text-lg">{job.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-pill ${job.categoryColor} font-semibold`}>{job.category}</span>
                    </div>
                    <p className="text-sm text-neutral-dark mb-1">
                      {job.department} <span className="text-neutral-300">|</span> {
                        job.category === 'טכנולוגיה' ? 'מחלקת פיתוח' :
                          job.category === 'כספים' ? 'מחלקת חשבות' :
                            job.category === 'משאבי אנוש' ? 'מחלקת גיוס' :
                              'מחלקה כללית'
                      }
                    </p>

                  </div>
                  <div className="flex flex-col items-center flex-shrink-0 mr-3 gap-1">
                    <MatchScore
                      score={job.matchPercent}
                      compact={true}
                    />
                  </div>
                </div>
                <div className="text-xs text-neutral-medium flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{job.postedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Details Column */}
        <div className="col-span-8 h-full flex flex-col min-h-0 max-h-[calc(100vh-280px)]">
          <div
            id="job-detail-container"
            className="bg-white rounded-card shadow-card flex-1 flex flex-col overflow-hidden">
            {selectedJob && (
              <>
                {/* Sticky Header - Title Only */}
                <div className="flex-shrink-0 bg-primary-light/40 backdrop-blur-sm p-6 border-b border-neutral-light shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-primary">{selectedJob.title}</h1>
                        <span className={`text-sm px-3 py-1 rounded-pill ${selectedJob.categoryColor} font-semibold`}>{selectedJob.category}</span>
                        {selectedJob.isOpen && (
                          <div className="flex items-center gap-1.5 px-2">
                            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                            <span className="text-sm font-bold text-status-success">משרה פנויה</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-neutral-medium">
                        <span className="flex items-center gap-1.5"><Building className="text-primary w-4 h-4" />{selectedJob.department}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="text-primary w-4 h-4" />{selectedJob.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="text-primary w-4 h-4" />משרה מלאה</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className={`${isLiked ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'} font-bold py-3 px-6 rounded-card hover:bg-rose-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2`}
                        onClick={() => toggleLike(selectedJobId)}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : 'fill-none text-gray-500'}`} />
                        {isLiked ? 'אהבתי' : 'סמן אהבתי'} ({likedJobs.size}/12)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 scorllableJobDiv flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  {/* Personal Match Analysis */}
                  <div className="mb-8 bg-transparent p-0">
                    <div className="space-y-6">

                      {/* Match Breakdown */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-primary text-lg">למה אני מתאימה לתפקיד הזה?</h3>
                          <div className="flex items-center gap-3 bg-white/50 px-3 py-2 rounded-card border border-primary/10 w-full">
                            <MatchScore
                              score={selectedJob.matchPercent}
                              compact={false}
                            />
                          </div>
                        </div>

                        {/* Skills Match */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-neutral-dark">התאמת מיומנויות תפקיד</p>
                            <p className="text-sm font-bold text-status-success">4/5 מיומנויות</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs px-3 py-1 bg-status-success/10 text-status-success rounded-md font-medium">
                              Java & Spring Boot
                            </span>
                            <span className="text-xs px-3 py-1 bg-status-success/10 text-status-success rounded-md font-medium">
                              Microservices
                            </span>
                            <span className="text-xs px-3 py-1 bg-status-success/10 text-status-success rounded-md font-medium">
                              ניסיון 5+ שנים
                            </span>
                            <span className="text-xs px-3 py-1 bg-status-success/10 text-status-success rounded-md font-medium">
                              ארכיטקטורה
                            </span>
                            <span className="text-xs px-3 py-1 bg-status-warning/10 text-status-warning rounded-md font-medium">
                              ניסיון ניהולי - פער קטן
                            </span>
                          </div>
                        </div>

                        {/* Soft Skills Match */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-neutral-dark">מיומנויות בין-אישיות</p>
                            <p className="text-sm font-bold text-status-success">התאמה מלאה</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs px-3 py-1 bg-accent/10 text-accent-dark rounded-md font-medium">
                              מנהיגות
                            </span>
                            <span className="text-xs px-3 py-1 bg-accent/10 text-accent-dark rounded-md font-medium">
                              קליטה מהירה
                            </span>
                            <span className="text-xs px-3 py-1 bg-accent/10 text-accent-dark rounded-md font-medium">
                              למידה עצמית
                            </span>
                          </div>
                        </div>

                        {/* Experience Match */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-neutral-dark">ניסיון והשכלה</p>
                            <p className="text-sm font-bold text-status-success">התאמה מלאה</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs px-3 py-1 bg-primary-light/50 text-primary rounded-md font-medium">
                              תואר במדעי המחשב
                            </span>
                            <span className="text-xs px-3 py-1 bg-primary-light/50 text-primary rounded-md font-medium">
                              5 שנות ניסיון רלוונטי
                            </span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-white/60 p-3 rounded-card border border-primary/20">
                          <p className="text-xs text-neutral-dark leading-relaxed flex items-start gap-1">
                            <Lightbulb className="text-primary w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="font-bold">סיכום:</span> הפרופיל שלך מתאים מאוד לתפקיד הזה. יש לך את כל המיומנויות הטכניות הנדרשות והחוזקות הבין-אישיות המתאימות. פער קטן בניסיון ניהולי ניתן לסגירה בקלות.
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Development Plan Area */}
                      <div className="pt-4 border-t border-primary/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-primary text-sm mb-1">תוכנית הפיתוח שלי</h4>
                            <p className="text-xs text-neutral-medium">צפה בפערים ובהמלצות לשיפור ההתאמה לתפקיד</p>
                          </div>
                          <a href="#" className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary font-bold py-2 px-4 rounded-card hover:bg-primary-light/20 transition-colors text-sm whitespace-nowrap">
                            <MapIcon className="w-4 h-4" />
                            <span>פתח תוכנית</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Description Content */}
                  <div className="job-detail-content">
                    <h3>אודות התפקיד</h3>
                    <p>{selectedJob.description}</p>

                    {selectedJob.responsibilities && (
                      <>
                        <h3>תחומי אחריות</h3>
                        <ul>
                          {selectedJob.responsibilities.map((r, idx) => <li key={idx}>{r}</li>)}
                        </ul>
                      </>
                    )}

                    <h3>דרישות התפקיד וניתוח פערים</h3>
                    <div className="space-y-3">
                      {selectedJob.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 border-b border-neutral-light/50 last:border-0">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-neutral-dark">{req.text}</span>
                        </div>
                      ))}
                    </div>

                    <h3>על הצוות</h3>
                    <p>צוות הליבה אחראי על פיתוח ותחזוקת השירותים המרכזיים של הארגון. אנחנו צוות דינמי, שאוהב אתגרים טכנולוגיים ועובד בשיתוף פעולה הדוק. אנחנו מאמינים בלמידה מתמדת, שיתוף ידע ופיתוח אישי של כל חברי הצוות.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { MatchScore } from './MatchScore';
import { Tooltip } from './Tooltip';
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
  Heart,
  XCircle
} from 'lucide-react';

interface Job {
  profile_description?: string;
  id: number;
  title: string;
  subtitle?: string;
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
    skill?: string;
    text: string;
    status: string;
    note: string;
  }[];
  isOpen: boolean;
  match_summary?: string;
  hard_skills_match?: {
    name?: string;
    matched: boolean;
    gap: any
    skill?: string,
    candidate_level?: number,
    required_level?: number,
    status?: string
  }[];
  soft_skills_match?: {
    name?: string;
    matched: boolean;
    gap: any
    skill?: string,
    candidate_level?: number,
    required_level?: number,
    status?: string
  }[];
  experience_match?: {
    name?: string;
    matched: boolean;
    gap: any
  }[];
}

// const allJobsData: Job[] = [
//   {
//     id: 1,
//     title: 'ראש צוות פיתוח',
//     department: 'חטיבת טכנולוגיות',
//     location: 'תל אביב | היברידי',
//     matchPercent: 92,
//     matchLevel: 'התאמה גבוהה',
//     matchColor: 'primary',
//     category: 'טכנולוגיה',
//     categoryColor: 'bg-blue-100 text-blue-800',
//     postedTime: 'פורסם לפני יומיים',
//     description: 'אנו מחפשים ראש/ת צוות פיתוח מוכשר/ת ל��צטרף לחטיבת הטכנולוגיות שלנו ולהוביל צוות של מפתחי Backend מבריקים.',
//     responsibilities: [
//       'ניהול מקצועי ואישי של צוות מפתחי Java.',
//       'הובלת תהליכי תכנון, ארכיטקטורה ו-Code Review.',
//       'אחריות על איכות הקוד, ביצועים ו-scalability של המערכות.',
//       'עבודה בסביבת Microservices ו-Cloud (AWS).',
//       'שיתוף פעולה עם צוותים אחרים בארגון להשגת מטרות משותפות.'
//     ],
//     requirements: [
//       { text: 'ניסיון של 5+ שנים בפיתוח Java ו-Spring Boot', status: 'success', note: 'תואם - יש לך 5 שנות ניסיון' },
//       { text: 'ניסיון עם ארכיטקטורת Microservices', status: 'success', note: 'תואם - מיומנות קיימת בפרופיל' },
//       { text: 'מיומנויות מנהיגות והובלת צוות', status: 'success', note: 'תואם - מיומנות רכה "מנהיגות" מופיעה כחוזקה' },
//       { text: 'ניסיון של שנה לפחות בניהול צוות - יתרון', status: 'warning', note: 'פער קטן - ניתן לסגירה באמצעות קורס ניהול והתנסות מעשית' },
//       { text: 'ניסיון עם תשתיות ענן (AWS/GCP/Azure) - יתרון', status: 'warning', note: 'פער - מומלץ קורס הסמכה AWS Solutions Architect' }
//     ],
//     isOpen: true
//   },
//   {
//     id: 2,
//     title: 'מנהל/ת תקציבים',
//     department: 'חטיבת הכספים',
//     location: 'ירושלים | היברידי',
//     matchPercent: 81,
//     matchLevel: 'התאמה טובה',
//     matchColor: 'accent-dark',
//     category: 'כספים',
//     categoryColor: 'bg-green-100 text-green-800',
//     postedTime: 'פורסם לפני 4 ימים',
//     description: 'אנו מחפשים מנהל/ת תקציבים מנוסה להצטרף לחטיבת הכספים ולנהל את תהליכי התקצוב הארגוניים.',
//     responsibilities: [
//       'ניהול תהליכי תקצוב שנתיים ורב- السنوات.',
//       'בקרה ומעקב אחר ביצוע תקציבי.',
//       'הכנת דוחות כספיים והצגתם önüne הנהלה.',
//       'שיתוף פעולה עם מנהלי יחידות לתכנון תקציבי.'
//     ],
//     requirements: [
//       { text: 'תואר ראשון בכלכלה/חשבונאות', status: 'success', note: 'תואם - תואר רלוונטי' },
//       { text: 'ניסיון של 3+ שנים בניהול תקציבים', status: 'success', note: 'תואם - 4 שנות ניסיון' },
//       { text: 'שליטה מלאה ב-Excel ומערכות ERP', status: 'warning', note: 'פער קטן - מומלץ קורס מתקדם' }
//     ],
//     isOpen: true
//   },
//   {
//     id: 3,
//     title: 'שותף/ה עסקי HR',
//     department: 'חטיבת משאבי אנוש',
//     location: 'חיפה | משרד מלא',
//     matchPercent: 73,
//     matchLevel: 'התאמה בינונית',
//     matchColor: 'secondary',
//     category: 'משאבי אנוש',
//     categoryColor: 'bg-purple-100 text-purple-800',
//     postedTime: 'פורסם לפני שבוע',
//     description: 'אנו מחפשים שותף/ה עסקי HR להצטרף לצוות משאבי האנוש ולתמוך ביחידות העסקיות.',
//     responsibilities: [
//       'ליווי מנהלים בתהליכי גיוס ופיתוח עובדים.',
//       'ניהול תהליכי הערכה וביצועים.',
//       'פיתוח תוכניות שימור והתפתחות.'
//     ],
//     requirements: [
//       { text: 'תואר ראשון בניהול משאבי אנוש', status: 'success', note: 'תואם' },
//       { text: 'ניסיון של 2+ שנים כשותף עסקי', status: 'warning', note: 'פער - שנה וחצי ניסיון' }
//     ],
//     isOpen: false
//   },
//   {
//     id: 4,
//     title: 'מפתח/ת Fullstack',
//     department: 'חטיבת טכנולוגיות',
//     location: 'תל אביב | היברידי',
//     matchPercent: 89,
//     matchLevel: 'התאמה גבוהה',
//     matchColor: 'primary',
//     category: 'טכנולוגיה',
//     categoryColor: 'bg-blue-100 text-blue-800',
//     postedTime: 'פורסם לפני 3 ימים',
//     description: 'אנו מחפשים מפתח/ת Fullstack מוכשר/ת לפיתוח מערכות ליבה.',
//     responsibilities: [
//       'פיתוח Frontend ו-Backend.',
//       'עבודה עם React ו-Node.js.',
//       'שיתוף פעולה עם צוותי מוצר ועיצוב.'
//     ],
//     requirements: [
//       { text: 'ניסיון של 3+ שנים בפיתוח Fullstack', status: 'success', note: 'תואם' },
//       { text: 'שליטה ב-React ו-Node.js', status: 'success', note: 'תואם' }
//     ],
//     isOpen: true
//   },
//   {
//     id: 5,
//     title: 'אנליסט/ית דאטה',
//     department: 'חטיבת הדאטה',
//     location: 'מרוחק',
//     matchPercent: 84,
//     matchLevel: 'התאמה טובה',
//     matchColor: 'accent-dark',
//     category: 'טכנולוגיה',
//     categoryColor: 'bg-blue-100 text-blue-800',
//     postedTime: 'פורסם היום',
//     description: 'אנו מחפשים אנליסט/ית דאטה לניתוח נתונים עסקיים.',
//     responsibilities: [
//       'ניתוח נתונים והפקת תובנות.',
//       'בניית דשבורדים ב-Tableau/Power BI.',
//       'עבודה עם SQL ו-Python.'
//     ],
//     requirements: [
//       { text: 'ניסיון של 2+ שנים בניתוח דאטה', status: 'success', note: 'תואם' },
//       { text: 'שליטה ב-SQL ו-Python', status: 'success', note: 'תואם' }
//     ],
//     isOpen: true
//   },
//   {
//     id: 6,
//     title: 'מנהל/ת פרויקטים',
//     department: 'חטיבת תפעול',
//     location: 'חיפה | היברידי',
//     matchPercent: 68,
//     matchLevel: 'התאמה בינונית',
//     matchColor: 'secondary',
//     category: 'לוגיסטיקה',
//     categoryColor: 'bg-orange-100 text-orange-800',
//     postedTime: 'פורסם לפני שבוע',
//     description: 'אנו מחפשים מנהל/ת פרויקטים לניהול פרויקטים תפעוליים.',
//     responsibilities: [
//       'ניהול פרויקטים מקצה לקצה.',
//       'תיאום בין צוותים.',
//       'ניהול לוחות זמנים ותקציבים.'
//     ],
//     requirements: [
//       { text: 'ניסיון של 3+ שנים בניהול פרויקטים', status: 'warning', note: 'פער - שנתיים ניסיון' }
//     ],
//     isOpen: false
//   },
//   {
//     id: 7,
//     title: 'מנהל/ת מוצר',
//     department: 'חטיבת מוצר',
//     location: 'תל אביב | היברידי',
//     matchPercent: 79,
//     matchLevel: 'התאמה טובה',
//     matchColor: 'accent-dark',
//     category: 'טכנולוגיה',
//     categoryColor: 'bg-blue-100 text-blue-800',
//     postedTime: 'פורסם לפני 5 ימים',
//     description: 'אנו מחפשים מנהל/ת מוצר להובלת אסטרטגיית המוצר.',
//     responsibilities: [
//       'הגדרת חזון ואסטרטגיה.',
//       'עבודה עם צוותי פיתוח ועיצוב.',
//       'ניתוח שוק ומתחרים.'
//     ],
//     requirements: [
//       { text: 'ניסיון של 3+ שנים בניהול מוצר', status: 'success', note: 'תואם' }
//     ],
//     isOpen: true
//   }
// ];

interface JobsPageProps {
  positionsData?: any[];
  employeeData?: any;
  onLikedChange?: (profiles: any[]) => void;
  allPositions?: any[];
}

export const JobsPage = ({ positionsData = [], employeeData, onLikedChange, allPositions }: JobsPageProps) => {
  const [currentView, setCurrentView] = useState<'all' | 'open' | 'matched'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyIsrael, setShowOnlyIsrael] = useState<boolean>(false);
  const [showBestMatch, setShowBestMatch] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<number>(1);
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set()); // Track liked jobs by position/profile id
  const [likedProfiles, setLikedProfiles] = useState<any[]>([]); // Track liked profile objects for saving
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('התאמה הגבוהה ביותר');
  // const [jobsData, setJobsData] = useState<Job[]>(allJobsData);
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const sortOptions = ['התאמה הגבוהה ביותר', 'החדשות ביותר'];

  const normalizeId = (value: any, fallback: number) => {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
    return fallback;
  };

  // Sync liked jobs from server data
  useEffect(() => {
    const likedFromServer = Array.isArray(employeeData?.liked_positions)
      ? employeeData.liked_positions
      : [];
    setLikedProfiles(likedFromServer);
    const ids = likedFromServer
      .map((p: any, idx: number) => normalizeId(p?.position_id ?? p?.id ?? p?.profile_id, idx))
      .filter((id: any) => Number.isFinite(id));
    setLikedJobs(new Set(ids));
  }, [employeeData?.liked_positions]);

  // Transform positionsData from props when it changes
  useEffect(() => {
    if (positionsData && positionsData.length > 0) {
      // Transform API data to match Job interface
      const transformedJobs: Job[] = positionsData.map((job: any, index: number) => ({
        id: job.profile_id || index + 1,
        title: job.position_name || 'תפקיד',
        subtitle: job.profile_name || 'תפקיד',
        department: 'מחלקת טכנולוגיה',
        location: 'ישראל',
        matchPercent: Math.floor(job.score),
        matchLevel: job.score || (job.score >= 85 ? 'התאמה גבוהה' : 'התאמה בינונית'),
        matchColor: job.category_colour || 'primary',
        category: job.category || 'כללי',
        categoryColor: job.category_colour ? 'bg-' + job.category_colour + '-100 text-' + job.category_colour + '-800' : 'bg-blue-100 text-blue-800',
        postedTime: 'פורסם לאחרונה',
        description: (allPositions || []).find((p: any) => p.position_id === job.position_id)?.description || '',
        profile_description: job.profile_description || '',
        responsibilities: job.responsibilities || [],
        requirements: job.requirements || [],
        isOpen: job.isOpen !== undefined ? job.isOpen : true,
        match_summary: job.match_summary || '',
        hard_skills_match: job?.gaps?.hard_skill_gaps || [],
        soft_skills_match: job?.gaps?.soft_skill_gaps || [],
        experience_match: []
      }));
      // const transformedJobs: Job[] = positionsData.map((job: any, index: number) => {
      //   const title = job.title || job.position_name || job.profile_name || 'תפקיד';
      //   const rawScore = job.match_percentage ?? job.score ?? job.match ?? job.matchPercent ?? 0;
      //   let matchPercent = Number(rawScore);
      //   if (!Number.isFinite(matchPercent)) matchPercent = 0;
      //   // server returns percentages; keep as-is
      //   const id = normalizeId(job.id ?? job.position_id ?? job.profile_id, index + 1);
      //   return {
      //     id,
      //     title,
      //     department: job.department || job.division || 'מחלקה',
      //     location: job.location || job.work_model || 'ישראל',
      //     matchPercent,
      //     matchLevel: job.matchLevel || (matchPercent >= 85 ? 'התאמה גבוהה' : matchPercent >= 60 ? 'התאמה בינונית' : 'התאמה נמוכה'),
      //     matchColor: job.matchColor || 'primary',
      //     category: job.category || 'כללי',
      //     categoryColor: job.category_color ? 'bg-' + job.category_color + '-100 text-' + job.category_color + '-800' : 'bg-blue-100 text-blue-800',
      //     postedTime: job.postedTime || job.posted_time || 'פורסם לאחרונה',
      //     description: job.profile_description || job.description || '',
      //     responsibilities: job.responsibilities || [],
      //     requirements: job.requirements || job.gaps || [],
      //     isOpen: job.isOpen !== undefined ? job.isOpen : true,
      //     match_summary: job.match_summary || '',
      //     hard_skills_match: job.hard_skills_match || [],
      //     soft_skills_match: job.soft_skills_match || [],
      //     experience_match: job.experience_match || [],
      //     raw_profile: job
      //   };
      // });

      setJobsData(transformedJobs);

      if (transformedJobs.length > 0) {
        const sortedJobs = transformedJobs.sort((a, b) => b.matchPercent - a.matchPercent);
        setSelectedJobId(sortedJobs[0].id);
      }
      setIsLoading(false);
    } else {
      // Use fallback static data if no positions data
      setJobsData(jobsData);
      setIsLoading(false);
    }
  }, [positionsData]);

  // Get all unique categories
  // const allCategories = Array.from(new Set(allJobsData.map(job => job.category))).sort();
  const getCategoryLabel = (value: string) => {
    if (value === 'all') return 'כל הקטגוריות';
    const count = jobsData.filter(job => job.category === value).length;
    return `${value} (${count})`;
  };

  // Close dropdowns on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsCategoryDropdownOpen(false);
      setIsSortDropdownOpen(false);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const employeeNumber = employeeData?.employee_number ?? employeeData?.id ?? 1001;

  const updateServerLikes = async (profiles: any[]) => {
    try {
      const payload = {
        liked_positions: profiles,
      };
      await fetch(`http://localhost:8000/api/v1/employees/${employeeNumber}/positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to update liked positions", error);
    }
  };

  const toggleLike = (job: any) => {
    const jobId = normalizeId(job?.id ?? job?.position_id ?? job?.profile_id, -1);
    if (!Number.isFinite(jobId) || jobId === -1) {
      console.error("Cannot like job without valid id", job);
      return;
    }
    setLikedJobs(prev => {
      const newSet = new Set(prev);
      let newProfiles = [...likedProfiles];
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
        newProfiles = newProfiles.filter((p) => {
          const pid = Number(p?.id ?? p?.position_id);
          return pid !== jobId;
        });
      } else {
        newSet.add(jobId);
        const profileObj = job.raw_profile || job;
        newProfiles = [...newProfiles, profileObj];
      }
      setLikedProfiles(newProfiles);
      updateServerLikes(newProfiles);
      onLikedChange?.(newProfiles);
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setCurrentView('all');
    setSelectedCategory('all');
    setShowOnlyIsrael(false);
    setShowBestMatch(false);
    setSearchQuery('');
  };

  const filteredJobs = (() => {
    let jobs = jobsData;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.subtitle?.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    }

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
        jobs = jobs.filter(job => job.isOpen);
        break;
      case 'matched':
        jobs = jobs.filter(job => job.matchPercent >= 80);
        break;
    }

    // Apply sorting
    if (selectedSort === 'התאמה הגבוהה ביותר') {
      jobs = [...jobs].sort((a, b) => b.matchPercent - a.matchPercent);
    } else if (selectedSort === 'החדשות ביותר') {
      // Sort by postedTime - extract number of days from the Hebrew text
      jobs = [...jobs].sort((a, b) => {
        const getDateValue = (timeStr: string) => {
          if (timeStr.includes('היום')) return 0;
          if (timeStr.includes('יומיים')) return 2;
          const match = timeStr.match(/(\d+)/);
          return match ? parseInt(match[1]) : 999;
        };
        return getDateValue(a.postedTime) - getDateValue(b.postedTime);
      });
    }

    return jobs;
  })();

  const selectedJob = jobsData.find(j => j.id === selectedJobId) || jobsData[0];
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
    <div style={{ marginLeft: '-2rem', marginRight: '-2rem' }} className="min-h-[calc(100vh-80px)] flex flex-col -m-10 px-8 py-3 max-w-[1800px] overflow-y-hidden">
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
          <h2 id="jobs-count" className="text-xl font-bold text-primary" style={{ marginTop: '-1.5rem' }}>
            {jobsData.length} משרות בארגון
            {/* {currentView === 'open' ? `מציג ${filteredJobs.length} משרות פתוחות` : '156 משרות בארגון'} */}
          </h2>
          <div className="flex items-center gap-2 text-sm" style={{ marginTop: '-1.5rem' }}>
            <span className="font-semibold">מיין לפי:</span>
            <div className="relative">
              <button
                onClick={() => {
                  setIsSortDropdownOpen(!isSortDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                }}
                className="flex items-center gap-1 font-bold text-primary cursor-pointer hover:text-primary-dark transition-colors"
              >
                <span style={{ width: '9rem' }}>{selectedSort}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSortDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-card shadow-lg border border-neutral-light z-50 overflow-hidden min-w-[180px]">
                    {sortOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => { setSelectedSort(option); setIsSortDropdownOpen(false); }}
                        className={`w-full text-right px-4 py-2.5 text-sm transition-colors cursor-pointer ${selectedSort === option ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-dark hover:bg-neutral-extralight'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-extralight border-2 border-neutral-light rounded-card py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 right-4 text-neutral-medium w-4 h-4" />
            </div>
            <div className="col-span-2">
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    setIsSortDropdownOpen(false);
                  }}
                  className="w-full bg-neutral-extralight border-2 border-neutral-light rounded-card py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors flex items-center justify-between gap-2"
                >
                  <span className="font-medium text-neutral-dark truncate">{getCategoryLabel(selectedCategory)}</span>
                  <ChevronDown className={`text-neutral-medium w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-card shadow-lg border border-neutral-light z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <button
                          onClick={() => { setSelectedCategory('all'); setIsCategoryDropdownOpen(false); }}
                          className={`w-full text-right px-4 py-2.5 text-sm transition-colors cursor-pointer ${selectedCategory === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-dark hover:bg-neutral-extralight'}`}
                        >
                          כל הקטגוריות
                        </button>
                        {Array.from(new Set(jobsData.map(job => job.category))).sort().map(category => {
                          const count = jobsData.filter(job => job.category === category).length;
                          return (
                            <button
                              key={category}
                              onClick={() => { setSelectedCategory(category); setIsCategoryDropdownOpen(false); }}
                              className={`w-full text-right px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${selectedCategory === category ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-dark hover:bg-neutral-extralight'}`}
                            >
                              <span>{category}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category ? 'bg-primary/20 text-primary' : 'bg-neutral-light text-neutral-medium'}`}>{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
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
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:underline font-semibold"
              >
                נקה הכל
              </button>

            </div>
          </div>
        </section>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-12 gap-6 flex-grow min-h-0">

        {/* Jobs List Column */}
        <div className="col-span-4 flex flex-col" style={{ maxHeight: "calc(100vh - 270px)" }}>
          <div id="jobs-list-container" className="px-2 flex-grow overflow-y-auto pl-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="w-12 h-12 text-neutral-300 mb-4" />
                <p className="text-neutral-medium text-sm">לא נמצאו משרות התואמות לחיפוש</p>
                <p className="text-neutral-300 text-xs mt-1">נסה לשנות את מילות החיפוש או הסינון</p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`job-card ${job.id === selectedJobId ? 'bg-primary-light/40 border-primary' : 'bg-white hover:bg-primary-light/20 border-transparent'} border-r-4 p-4 rounded-card cursor-pointer transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2 ">
                        <h3 className="font-bold text-primary text-md">{job.title}</h3>
                      </div>
                      <p className="text-neutral-dark font-bold text-sm mb-2 ">{job.subtitle}</p>

                      <p className="items-center text-sm text-neutral-dark mb-1 gap-2 flex flex-row align-center">
                        <span
                          className={`bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-pill ${job.categoryColor} font-semibold`}>{job.category}</span>
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
                        showScore={true}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-neutral-medium flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{job.postedTime}</span>
                  </div>
                </div>
              ))
            )}
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
                        <h1 className="text-2xl font-bold text-primary">{selectedJob.title}</h1>
                        <span className={`text-sm px-3 py-1 rounded-pill ${selectedJob.categoryColor} font-semibold`}>{selectedJob.category}</span>
                        {selectedJob.isOpen && (
                          <div className="flex items-center gap-1.5 px-2">
                            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                            <span className="text-sm font-bold text-status-success">משרה פנויה</span>
                          </div>
                        )}
                      </div>
                      <span className="text-primary mb-2 flex">{selectedJob.subtitle}</span>
                      <div className="flex items-center gap-3 text-sm text-neutral-medium">
                        <span className="flex items-center gap-1.5"><Building className="text-primary w-4 h-4" />{selectedJob.department}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="text-primary w-4 h-4" />{selectedJob.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="text-primary w-4 h-4" />משרה מלאה</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className={`${isLiked ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'} font-bold py-3 px-6 rounded-card hover:bg-rose-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2`}
                        onClick={() => toggleLike(selectedJob)}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : 'fill-none text-gray-500'}`} />
                        {isLiked ? 'אהבתי' : 'סמן אהבתי'} ({likedJobs.size}/12)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div style={{ maxHeight: "calc(100vh - 400px)", paddingTop: "0rem", marginLeft: "0.5rem", marginBottom: "0.5rem", marginTop: "0.5rem" }} className="p-6  flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  {/* Personal Match Analysis */}
                  <div className="mb-8 bg-transparent p-0">
                    <div className="space-y-6">

                      {/* Match Breakdown */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-primary text-lg">למה אני מתאימ.ה לתפקיד הזה?</h3>
                          <div className="flex items-center gap-3 bg-white/50 px-3 py-2 rounded-card ">
                            <MatchScore
                              score={selectedJob.matchPercent}
                              compact={true}
                              showScore={true}
                            />
                          </div>
                        </div>

                        {/* Skills Match */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-neutral-dark">התאמת מיומנויות תפקיד</p>
                            <p className="text-sm font-bold text-status-success">
                              {selectedJob.hard_skills_match?.filter((skill) => skill.matched || skill.gap <= 0).length === selectedJob.hard_skills_match?.length ? (
                                "התאמה מלאה"
                              ) : (
                                `${selectedJob.hard_skills_match?.filter((skill) => skill.matched || skill.gap <= 0).length}/${selectedJob.hard_skills_match?.length} מיומנויות`
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {selectedJob.hard_skills_match?.map((skill, index) => (
                              <span
                                key={index}
                                style={{
                                  backgroundColor: skill.gap > 0 ? "#dc26261a" : "",
                                  color: skill.gap > 0 ? "#dc2626" : ""
                                }}
                                className={`text-xs px-3 py-1 rounded-md font-medium ${skill.gap <= 0
                                  ? "bg-status-success/10 text-status-success"
                                  : ""
                                  }`}
                              >
                                {/* <Tooltip content={skill.gap}> */}
                                {skill.skill}
                                {/* </Tooltip> */}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Soft Skills Match */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-neutral-dark">מיומנויות בין-אישיות</p>
                            <p className="text-sm font-bold text-status-success">
                              {selectedJob.soft_skills_match?.filter((skill) => skill.matched || skill.gap <= 0).length === selectedJob.soft_skills_match?.length ? (
                                "התאמה מלאה"
                              ) : (
                                `${selectedJob.soft_skills_match?.filter((skill) => skill.matched || skill.gap <= 0).length}/${selectedJob.soft_skills_match?.length} מיומנויות`
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {selectedJob.soft_skills_match?.map((skill, index) => (
                              <span
                                key={index}
                                style={{
                                  backgroundColor: !(skill.matched || skill.gap <= 0) ? "#dcd6261a" : "",
                                  color: !(skill.matched || skill.gap <= 0) ? "#dcd626" : ""
                                }}
                                className={`text-xs px-3 py-1 rounded-md font-medium ${(skill.matched || skill.gap <= 0)
                                  ? "bg-status-success/10 text-status-success"
                                  : ""
                                  }`}
                              >
                                {/* <Tooltip content={skill.gap}> */}
                                {skill.skill || skill.name}
                                {/* </Tooltip> */}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Experience Match */}
                        {/* <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-neutral-dark">ניסיון והשכלה</p>
                            <p className="text-sm font-bold text-status-success">
                              {selectedJob.experience_match?.filter((skill) => skill.matched || skill.gap <= 0).length === selectedJob.experience_match?.length ? (
                                "התאמה מלאה"
                              ) : (
                                `${selectedJob.experience_match?.filter((skill) => skill.matched || skill.gap <= 0).length}/${selectedJob.experience_match?.length} התאמות`
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {selectedJob.experience_match?.map((skill, index) => (
                              <span
                                key={index}
                                style={{
                                  backgroundColor: !(skill.matched || skill.gap <= 0) ? "#dc26261a" : "",
                                  color: !(skill.matched || skill.gap <= 0) ? "#dc2626" : ""
                                }}
                                className={`text-xs px-3 py-1 rounded-md font-medium ${(skill.matched || skill.gap <= 0)
                                  ? "bg-status-success/10 text-status-success"
                                  : ""
                                  }`}
                              >
                                <Tooltip content={skill.gap}>
                                  {skill.skill || skill.name}
                                </Tooltip>
                              </span>
                            ))}
                          </div>
                        </div> */}

                        {/* Summary */}
                        {/* <div className="bg-white/60 p-3 rounded-card border border-primary/20 mt-5">
                          <p className="text-xs text-neutral-dark leading-relaxed flex items-start gap-1">
                            <Lightbulb className="text-primary w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="font-bold">סיכום: </span>
                              {selectedJob.match_summary}
                            </span>
                          </p>
                        </div> */}
                      </div>

                      {/* Development Plan Area */}
                      {/* <div className="pt-4 border-t border-primary/10">
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
                      </div> */}
                    </div>
                  </div>

                  {/* Job Description Content */}
                  <div className="job-detail-content">
                    <h3>אודות המשרה</h3>
                    <p>{selectedJob.description}</p>

                    <h3>אודות התפקיד</h3>
                    <p>{selectedJob?.profile_description}</p>

                    {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                      <>
                        <h3>תחומי אחריות</h3>
                        <ul>
                          {selectedJob.responsibilities.map((r, idx) => <li key={idx}>{r}</li>)}
                        </ul>
                      </>
                    )}

                    {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                      <>
                        <h3>דרישות התפקיד וניתוח פערים</h3>
                        <div className="space-y-3">
                          {selectedJob.requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 border-b border-neutral-light/50 last:border-0">
                              {/* <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div> */}
                              {req.status === 'יש' ? (
                                <CheckCircle className="w-4 h-4 text-status-success flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-neutral-medium flex-shrink-0"></div>
                                // {/* <XCircle style={{ color: 'darkred' }} className="w-4 h-4 text-status-error flex-shrink-0" /> */}
                              )}
                              <span className="text-neutral-dark">{req.skill}</span>

                              {req.status === 'חסר' && (
                                <span className="text-sm text-neutral-medium ml-2">({req.note})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* <h3>על הצוות</h3>
                    <p>צוות הליבה אחראי על פיתוח ותחזוקת השירותים המרכזיים של הארגון. אנחנו צוות דינמי, שאוהב אתגרים טכנולוגיים ועובד בשיתוף פעולה הדוק. אנחנו מאמינים בלמידה מתמדת, שיתוף ידע ופיתוח אישי של כל חברי הצוות.</p> */}
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
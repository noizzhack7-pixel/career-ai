import React from 'react';
import { MatchScore } from './MatchScore';
import {
  Filter,
  ListChecks,
  Calendar,
  Trophy,
  Briefcase,
  Heart,
  ArrowLeft,
  TrendingUp,
  CheckCheck,
  BarChart2,
  Target,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Users,
  CalendarX2,
  MapPin,
  Clock,
  Layers,
  Info,
  Route,
  ChevronDown,
  SlidersHorizontal,
  BarChart,
  GraduationCap,
  Star
} from 'lucide-react';


export const MatchAndDevelopment = ({ onNavigate, employeeData, positionsData }: { onNavigate?: (view: "dashboard" | "home" | "jobs" | "match") => void, employeeData?: any, positionsData?: any }) => {
  const [expandedJobId, setExpandedJobId] = React.useState<number | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('כל הקטגוריות');
  const [selectedSort, setSelectedSort] = React.useState('מיין לפי התאמה');

  const categoryOptions = ['כל הקטגוריות', 'טכנולוגיה', 'כספים', 'משאבי אנוש', 'לוגיסטיקה'];
  const sortOptions = ['מיין לפי התאמה', 'מיין לפי תאריך פרסום', 'מיין לפי דרגה'];

  // Close dropdowns on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setIsCategoryDropdownOpen(false);
      setIsSortDropdownOpen(false);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const toggleDevelopmentPlan = (jobId: number) => {
    setExpandedJobId(prev => prev === jobId ? null : jobId);
  };

  return (
    <div className="space-y-8">
      <section id="page-header" className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">התאמה ומסלול פיתוח</h1>
            <p className="text-neutral-medium text-lg">גלה.י את התפקידים המתאימים לך ביותר ובנה.י תוכנית פיתוח אישית</p>
          </div>

        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-8">
          <section id="profile-summary-bar" className="bg-white p-5 rounded-card shadow-card">
            <div className="flex items-center gap-6">
              <img
                src={employeeData?.photo_url}
                alt={employeeData?.name}
                className="w-20 h-20 rounded-full border-4 border-primary/30"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-primary mb-1">{employeeData?.name}</h2>
                <p className="text-neutral-dark font-semibold mb-2">{employeeData?.current_job} | {employeeData?.department}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-accent-dark w-4 h-4" />
                    <span className="text-neutral-medium">ותק:</span>
                    <span className="font-semibold text-neutral-dark">{employeeData?.office_seniority} שנים</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-medium"></div>
                  <div className="flex items-center gap-2">
                    <Trophy className="text-accent-dark w-4 h-4" />
                    <span className="text-neutral-medium">קודוס:</span>
                    <span className="font-semibold text-neutral-dark">34</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-medium"></div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-accent-dark w-4 h-4" />
                    <span className="text-neutral-medium">משרות מתאימות:</span>
                    <span className="font-semibold text-status-success">{positionsData?.length || 0}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate?.("home")}
                className="text-primary hover:underline text-sm font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-3 h-3" />
                לפרופיל המלא
              </button>
            </div>
          </section>



          <section id="job-matches-list" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                <Heart className="w-6 h-6" />
                משרות שאהבתי              </h2>
              <div className="flex items-center gap-3">
                {/* Category Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                      setIsSortDropdownOpen(false);
                    }}
                    className="flex items-center justify-between gap-2 border-2 border-neutral-light rounded-card py-2 px-4 text-sm bg-white hover:border-primary/30 transition-colors cursor-pointer min-w-[140px]"
                  >
                    <span className="font-medium text-neutral-dark">{selectedCategory}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-medium transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCategoryDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                      />
                      <div className="absolute top-full right-0 mt-1 bg-white rounded-card shadow-lg border border-neutral-light z-50 overflow-hidden min-w-[160px]">
                        {categoryOptions.map(option => (
                          <button
                            key={option}
                            onClick={() => { setSelectedCategory(option); setIsCategoryDropdownOpen(false); }}
                            className={`w-full text-right px-4 py-2.5 text-sm transition-colors cursor-pointer ${selectedCategory === option ? 'bg-primary/10 text-primary font-semibold' : 'text-neutral-dark hover:bg-neutral-extralight'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsSortDropdownOpen(!isSortDropdownOpen);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="flex items-center justify-between gap-2 border-2 border-neutral-light rounded-card py-2 px-4 text-sm bg-white hover:border-primary/30 transition-colors cursor-pointer min-w-[180px]"
                  >
                    <span className="font-medium text-neutral-dark">{selectedSort}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-medium transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
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

            {/* Job Card 1 */}
            <div id="job-card-1" className="bg-white rounded-card shadow-card hover:shadow-panel transition-shadow border-2 border-transparent hover:border-primary/30 cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-primary">ראש צוות פיתוח Backend</h3>
                      <button className="text-rose-500 hover:text-rose-600 transition-colors" title="הסר מהמועדפים">
                        <Heart className="w-6 h-6 fill-current" />
                      </button>
                      <span className="bg-category-tech/20 text-category-tech px-3 py-1 rounded-pill text-xs font-bold">טכנולוגיה</span>
                    </div>
                    <p className="text-neutral-medium mb-3">חטיבת טכנולוגיות | מחלקת פיתוח Backend</p>
                    <div className="text-neutral-dark text-sm leading-relaxed">
                      <p>הובלת צוות פיתוח של 6-8 מפתחים, תכנון ארכיטקטורה, ניהול פרויקטים טכנולוגיים מורכבים ופיתוח מערכות Backend בקנה מידה גדול.</p>
                      <details className="group mt-2">
                        <summary className="list-none text-primary cursor-pointer hover:underline flex items-center gap-1 font-semibold text-sm">
                          תציג עוד פרטים
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-2 animate-in fade-in slide-in-from-top-1">
                          אחריות על הובלת הספרינטים, Code Reviews, עבודה מול מנהלי מוצר, ופיתוח Hands-on של רכיבי ליבה במערכת. נדרשת יכולת הובלה טכנולוגית ובין-אישית גבוהה.
                        </p>
                      </details>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <MatchScore score={92} compact={true} />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-neutral-dark mb-3">דרישות מרכזיות:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">ניסיון בניהול צוותים</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">מומחיות Java & Spring Boot</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">ניסיון בארכיטקטורת מערכות</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-300 flex-shrink-0" />
                      <span className="text-neutral-dark">ניסיון בניהול תקציבים</span>
                    </div>
                  </div>
                </div>
                <div className="bg-primary-light/20 p-3 rounded-card mb-4 border-r-4 border-primary">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="text-rose-500 w-4 h-4 fill-current" />
                        <span className="text-neutral-dark font-semibold"> 24 אנשים אהבו את המשרה</span>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-light">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">תל אביב, ישראל</span>
                    </div>
                    <div className="w-px h-4 bg-neutral-medium"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">פורסם לפני 3 ימים</span>
                    </div>
                    <div className="w-px h-4 bg-neutral-medium"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">דרגה: Senior Manager</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDevelopmentPlan(1);
                      }}
                      className="bg-primary text-white px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
                    >
                      <Route className="w-4 h-4" />
                      הצג תוכנית פיתוח
                    </button>
                  </div>
                </div>
                {expandedJobId === 1 && (
                  <div className="mt-6 border-t border-neutral-light pt-6 animate-in slide-in-from-top-4 duration-300 cursor-default" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-neutral-50/50 rounded-xl p-6 border border-neutral-light/50">
                      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Route className="w-5 h-5" />
                        תוכנית פיתוח אישית
                      </h3>

                      <div className="bg-white p-5 rounded-xl border border-neutral-light shadow-sm mb-6">
                        <h4 className="font-bold text-neutral-dark mb-4 flex items-center gap-2">
                          <ListChecks className="w-5 h-5 text-primary" />
                          דרישות התפקיד
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-light/50">
                            <CheckCircle className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-dark">ניסיון בניהול צוותים</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-light/50">
                            <CheckCircle className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-dark">מומחיות Java & Spring Boot</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-light/50">
                            <CheckCircle className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-dark">ניסיון בארכיטקטורת מערכות</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-light/50">
                            <CheckCircle className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-dark">ניסיון בניהול תקציבים</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-light/50">
                            <CheckCircle className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-dark">קורס ניהול פרויקטים מתקדם</span>
                          </div>
                        </div>
                      </div>

                      {/* Next Steps */}
                      <div className="bg-white p-5 rounded-xl border-l-4 border-primary shadow-sm">
                        <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          הצעד הבא שלי
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-3 bg-neutral-light/20 rounded-lg hover:bg-neutral-light/40 transition-colors cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs border border-primary/20 shadow-sm group-hover:scale-110 transition-transform">01</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-neutral-dark text-sm">הירשם לקורס ניהול תקציבים</h5>
                              <p className="text-xs text-neutral-medium">נפתח בקרוב • מכללת הניהול</p>
                            </div>
                            <button className="text-primary text-xs font-bold hover:underline">ביצוע</button>
                          </div>
                          <div className="flex items-center gap-4 p-3 bg-neutral-light/20 rounded-lg hover:bg-neutral-light/40 transition-colors cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs border border-primary/20 shadow-sm group-hover:scale-110 transition-transform">02</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-neutral-dark text-sm">תיאום שיחת מנטורינג</h5>
                              <p className="text-xs text-neutral-medium">עם סמנכ"ל כספים</p>
                            </div>
                            <button className="text-primary text-xs font-bold hover:underline">ביצוע</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Card 2 */}
            <div id="job-card-2" className="bg-white rounded-card shadow-card hover:shadow-panel transition-shadow border-2 border-transparent hover:border-primary/30 cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-primary">ארכיטקט תוכנה</h3>
                      <span className="bg-category-tech/20 text-category-tech px-3 py-1 rounded-pill text-xs font-bold">טכנולוגיה</span>
                    </div>
                    <p className="text-neutral-medium mb-3">חטיבת טכנולוגיות | מחלקת ארכיטקטורה</p>
                    <div className="text-neutral-dark text-sm leading-relaxed">
                      <p>תכנון והובלת ארכיטקטורה טכנולוגית ארגונית, ייעוץ לצוותי פיתוח, הגדרת תקנים טכנולוגיים ובחירת טכנולוגיות עתידיות.</p>
                      <details className="group mt-2">
                        <summary className="list-none text-primary cursor-pointer hover:underline flex items-center gap-1 font-semibold text-sm">
                          תציג עוד פרטים
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-2 animate-in fade-in slide-in-from-top-1">
                          ליווי צוותי הפיתוח במימוש הארכיטקטורה, ביצוע PoC לטכנולוגיות חדשות, וכתיבת מסמכי Design טכניים מפורטים למערכות מבוזרות.
                        </p>
                      </details>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2 mr-6">
                      <MatchScore score={88} compact={true} />
                    </div>
                    <button className="text-rose-500 hover:text-rose-600 transition-colors mt-1" title="הסר מהמועדפים">
                      <Heart className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-neutral-dark mb-3">דרישות מרכזיות:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">ניסיון בתכנון ארכיטקטורה</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">מומחיות Microservices</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="text-status-warning w-4 h-4" />
                      <span className="text-neutral-dark">ניסיון Cloud Architecture</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">יכולות הדרכה וייעוץ</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-light">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">תל אביב</span>
                    </div>
                    <div className="w-px h-4 bg-neutral-medium"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">פורסם לפני שבוע</span>
                    </div>
                    <div className="w-px h-4 bg-neutral-medium"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">דרגה: Principal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-white border-2 border-primary text-primary px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-light/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      פרטים מלאים
                    </button>
                    <button className="bg-primary text-white px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2">
                      <Route className="w-4 h-4" />
                      בנה תוכנית פיתוח
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Card 3 */}
            <div id="job-card-3" className="bg-white rounded-card shadow-card hover:shadow-panel transition-shadow border-2 border-transparent hover:border-primary/30 cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-primary">Tech Lead - פיתוח מוצר</h3>
                      <span className="bg-category-tech/20 text-category-tech px-3 py-1 rounded-pill text-xs font-bold">טכנולוגיה</span>
                    </div>
                    <p className="text-neutral-medium mb-3">חטיבת מוצר | צוות Core Platform</p>
                    <div className="text-neutral-dark text-sm leading-relaxed">
                      <p>
                        הובלה טכנית של פיתוח מוצר ליבה, עבודה צמודה עם Product Managers, קבלת החלטות ��כנולוגיות ומנטורינג של מפתחים.
                      </p>
                      <details className="group mt-2">
                        <summary className="list-none text-primary cursor-pointer hover:underline flex items-center gap-1 font-semibold text-sm">
                          תציג עוד פרטים
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-2 animate-in fade-in slide-in-from-top-1">
                          שותפות מלאה בתהליך הגדרת המוצר, אחריות על האיכות הטכנית של הקוד, ופתרון בעיות מורכבות בסביבת Production.
                        </p>
                      </details>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2 mr-6">
                      <MatchScore score={86} compact={true} />
                    </div>
                    <button className="text-rose-500 hover:text-rose-600 transition-colors mt-1" title="הסר מהמועדפים">
                      <Heart className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-neutral-dark mb-3">דרישות מרכזיות:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">מומחיות טכנית Backend</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">ניסיון בהובלת צוותים</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">הבנה עמוקה של מוצר</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="text-status-warning w-4 h-4" />
                      <span className="text-neutral-dark">ניסיון DevOps</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-light">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">היברידי</span>
                    </div>
                    <div className="w-px h-4 bg-neutral-medium"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">פורסם לפני שבועיים</span>
                    </div>
                    <div className="w-px h-4 bg-neutral-medium"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">דרגה: Senior</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-white border-2 border-primary text-primary px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-light/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      פרטים מלאים
                    </button>
                    <button className="bg-primary text-white px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2">
                      <Route className="w-4 h-4" />
                      בנה תוכנית פיתוח
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Card 4 */}
            <div id="job-card-4" className="bg-white rounded-card shadow-card hover:shadow-panel transition-shadow border-2 border-transparent hover:border-primary/30 cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-primary">מנהל/ת פרויקטים טכנולוגיים</h3>
                      <span className="bg-category-tech/20 text-category-tech px-3 py-1 rounded-pill text-xs font-bold">טכנולוגיה</span>
                    </div>
                    <p className="text-neutral-medium mb-3">חטיבת טכנולוגיות | PMO</p>
                    <div className="text-neutral-dark text-sm leading-relaxed">
                      <p>ניהול פרויקטים טכנולוגיים מורכבים, תיאום בין צוותים, ניהול סיכונים ותקציבים, דיווח להנהלה ועמידה ביעדים.</p>
                      <details className="group mt-2">
                        <summary className="list-none text-primary cursor-pointer hover:underline flex items-center gap-1 font-semibold text-sm">
                          תציג עוד פרטים
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-2 animate-in fade-in slide-in-from-top-1">
                          בניית תוכניות עבודה מפורטות, מעקב אחר התקדמות, ניהול בעלי עניין (Stakeholders) והובלת ישיבות סטטוס ותכנון רבעוני.
                        </p>
                      </details>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2 mr-6">
                      <MatchScore score={78} compact={true} />
                    </div>
                    <button className="text-rose-500 hover:text-rose-600 transition-colors mt-1" title="הסר מהמועדפים">
                      <Heart className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-neutral-dark mb-3">דרישות מרכזיות:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="text-status-warning w-4 h-4" />
                      <span className="text-neutral-dark">ניסיון ניהול פרויקטים</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">רקע טכנולוגי</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="text-status-warning w-4 h-4" />
                      <span className="text-neutral-dark">הסמכת PMP/Agile</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-status-success w-4 h-4" />
                      <span className="text-neutral-dark">מיומנויות תקשורת</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-light">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">תל אביב</span>
                    </div>
                    <div className="w-px h-4 bg-neutral-medium"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">פורסם לפני 4 ימים</span>
                    </div>
                    <div className="w-px h-4 bg-neutral-medium"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="text-primary w-4 h-4" />
                      <span className="text-neutral-medium">דרגה: Manager</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-white border-2 border-primary text-primary px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-light/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      פרטים מלאים
                    </button>
                    <button className="bg-primary text-white px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2">
                      <Route className="w-4 h-4" />
                      בנה תוכנית פיתוח
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-8">
              <button className="bg-white border-2 border-primary text-primary px-8 py-3 rounded-card font-semibold hover:bg-primary-light/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2 mx-auto">
                <ChevronDown className="w-4 h-4" />
                טען עוד משרות (8 נוספות)
              </button>
            </div>
          </section>
        </div>


      </div>
    </div>
  );
};

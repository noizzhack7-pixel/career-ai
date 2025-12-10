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
  Star,
  Check
} from 'lucide-react';


export const MatchAndDevelopment = ({
  onNavigate,
  employeeData,
  positionsData,
  onStarChange,
}: {
  onNavigate?: (view: "dashboard" | "home" | "jobs" | "match") => void;
  employeeData?: any;
  positionsData?: any;
  onStarChange?: (star: any | null) => void;
}) => {
  const [expandedJobId, setExpandedJobId] = React.useState<number | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('כל הקטגוריות');
  const [selectedSort, setSelectedSort] = React.useState('מיין לפי התאמה');
  const [targetRoleId, setTargetRoleId] = React.useState<number | null>(null);
  const employeeNumber = employeeData?.employee_number ?? employeeData?.id ?? 1001;

  const normalizeId = (value: any, fallback: number = 0): number => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

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

  const updateStarPosition = async (position: any | null) => {
    try {
      await fetch(`http://localhost:8000/api/v1/employees/${employeeNumber}/positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ star_position: position }),
      });
      onStarChange?.(position);
    } catch (error) {
      console.error("Failed to update star_position", error);
    }
  };

  React.useEffect(() => {
    const raw = employeeData?.star_position;
    const starId = Number(raw?.id ?? raw?.position_id);
    if (Number.isFinite(starId)) setTargetRoleId(starId);
  }, [employeeData?.star_position]);

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

            {Array.isArray(employeeData?.liked_positions) && employeeData.liked_positions.length === 0 && (
              <div className="bg-white rounded-card border border-neutral-light p-6 text-center text-neutral-medium">
                אין משרות אהובות להצגה
              </div>
            )}

            {Array.isArray(employeeData?.liked_positions) && employeeData.liked_positions.map((position: any, idx: number) => {
              console.log(position)
              const title = position.position_name || position.title || position.name || `משרה ${idx + 1}`;
              const subtitle = position.profile_name || position.subtitle || `משרה ${idx + 1}`;
              const category = position.category || 'טכנולוגיה';
              const description = position.profile_description || position.description || '';
              const location = position.location || position.work_model || 'ישראל';
              const rawScore = position.match_percentage ?? position.score ?? position.match ?? position.matchPercent ?? 0;
              let matchScore = Number(rawScore);
              if (!Number.isFinite(matchScore)) matchScore = 0;
              matchScore = Math.max(0, Math.min(100, matchScore));
              const posId = normalizeId(position.id ?? position.position_id, idx);

              return (
                <div
                  key={posId}
                  id={`job-card-${posId}`}
                  className={targetRoleId === posId ? 'destPosition bg-gradient-to-br from-primary to-accent-dark text-white rounded-card shadow-panel border-2 border-accent-light' : 'rounded-card shadow-card hover:shadow-panel transition-shadow border-2 cursor-pointer bg-white border-transparent hover:border-primary/30'}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-2xl font-bold ${targetRoleId === posId ? 'text-white' : 'text-primary'}`}>{title}</h3>
                          <span className="bg-category-tech/20 text-category-tech px-3 py-1 rounded-pill text-xs font-bold">{category}</span>

                          <button className="text-rose-500 hover:text-rose-600 transition-colors" title="הסר מהמועדפים">
                            <Heart className="w-6 h-6 fill-current" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStarId = targetRoleId === posId ? null : posId;
                              const starPayload = targetRoleId === posId ? null : (position?.raw_profile || position);
                              setTargetRoleId(nextStarId);
                              updateStarPosition(starPayload);
                            }}
                            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-bold transition-colors ${targetRoleId === posId ? 'bg-white/20 text-white border border-white/30' : 'bg-primary text-white  hover:bg-purple-200'}`}
                          >
                            <Target className="w-3.5 h-3.5" />
                            {targetRoleId === posId ? 'תפקיד יעד' : 'סמן כתפקיד יעד'}
                          </button>
                        </div>
                        <p className={`mb-3 ${targetRoleId === posId ? 'text-white/80' : 'text-neutral-medium'}`}>{subtitle}</p>
                        <div className={`text-sm leading-relaxed ${targetRoleId === posId ? 'text-white/90' : 'text-neutral-dark'}`}>
                          <p>{description}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className={`flex flex-col items-center gap-2 `}>
                          <MatchScore score={matchScore} compact={true} showScore={true} isWhite={targetRoleId === posId} />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className={`text-sm font-semibold mb-3 ${targetRoleId === posId ? 'text-white' : 'text-neutral-dark'}`}>דרישות מרכזיות:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`w-4 h-4 ${targetRoleId === posId ? 'text-green-300' : 'text-status-success'}`} />
                          <span className={targetRoleId === posId ? 'text-white' : 'text-neutral-dark'}>ניסיון בניהול צוותים</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`w-4 h-4 ${targetRoleId === posId ? 'text-green-300' : 'text-status-success'}`} />
                          <span className={targetRoleId === posId ? 'text-white' : 'text-neutral-dark'}>מומחיות Java & Spring Boot</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`w-4 h-4 ${targetRoleId === posId ? 'text-green-300' : 'text-status-success'}`} />
                          <span className={targetRoleId === posId ? 'text-white' : 'text-neutral-dark'}>ניסיון בארכיטקטורת מערכות</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${targetRoleId === posId ? 'border-white/50' : 'border-neutral-300'}`} />
                          <span className={targetRoleId === posId ? 'text-white' : 'text-neutral-dark'}>ניסיון בניהול תקציבים</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#fef9c370', borderRightColor: '#eab208cf' }} className="p-3 rounded-card mb-4 border-r-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Info style={{ color: '#eab208' }} className="text-accent-dark w-4 h-4" />
                            <span className={targetRoleId === posId ? 'text-white font-semibold' : 'text-neutral-dark font-semibold'}> יש לשים לב, המשרה עלולה לגרוע משכרך</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between pt-4 border-t ${targetRoleId === posId ? 'border-white/20' : 'border-neutral-light'}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className={`w-4 h-4 ${targetRoleId === posId ? 'text-white/70' : 'text-primary'}`} />
                          <span className={targetRoleId === posId ? 'text-white/80' : 'text-neutral-medium'}>{location}</span>
                        </div>
                        <div className={`w-px h-4 ${targetRoleId === posId ? 'bg-white/30' : 'bg-neutral-medium'}`}></div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className={`w-4 h-4 ${targetRoleId === posId ? 'text-white/70' : 'text-primary'}`} />
                          <span className={targetRoleId === posId ? 'text-white/80' : 'text-neutral-medium'}>פורסם לאחרונה</span>
                        </div>
                        <div className={`w-px h-4 ${targetRoleId === posId ? 'bg-white/30' : 'bg-neutral-medium'}`}></div>
                        <div className="flex items-center gap-2 text-sm">
                          <Layers className={`w-4 h-4 ${targetRoleId === posId ? 'text-white/70' : 'text-primary'}`} />
                          <span className={targetRoleId === posId ? 'text-white/80' : 'text-neutral-medium'}>דרגה: Senior Manager</span>
                        </div>
                        <div className={`w-px h-4 ${targetRoleId === posId ? 'bg-white/30' : 'bg-neutral-medium'}`}></div>
                        <div className="flex items-center gap-2 text-sm">
                          <Heart className={`w-4 h-4 ${targetRoleId === posId ? 'text-white/70' : 'text-primary'}`} />
                          <span className={targetRoleId === posId ? 'text-white/80' : 'text-neutral-medium'}>24 אנשים אהבו את המשרה</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDevelopmentPlan(posId);
                          }}
                          className="bg-primary text-white px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
                        >
                          <Route className="w-4 h-4" />
                          הצג תוכנית פיתוח
                        </button>
                      </div>
                    </div>

                    {expandedJobId === posId && (
                      <div
                        className="mt-6 border-t border-neutral-light pt-6 animate-in slide-in-from-top-4 duration-300 cursor-default"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="bg-neutral-50/50 rounded-xl p-6 border border-neutral-light/50">
                          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Route className="w-5 h-5" />
                            תוכנית פיתוח אישית
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}



          </section>
        </div>


      </div>
    </div>
  );
};

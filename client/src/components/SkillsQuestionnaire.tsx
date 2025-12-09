import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Sparkles, ArrowLeft, ArrowRight, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuestionnaireLayout } from "./questionnaire/QuestionnaireLayout";
import { QuestionCard } from "./questionnaire/QuestionCard";
import { SkillsRadarChart } from "./questionnaire/RadarChart";

const QUESTIONS = [
  // מנהיגות
  { id: 1, category: "מנהיגות", text: "כשקבוצה מתלבטת, אני נוטה לקחת אחריות ולהוביל את הכיוון." },
  { id: 2, category: "מנהיגות", text: "נוח לי לתת משוב בונה לעמיתים." },
  { id: 3, category: "מנהיגות", text: "אני נהנה לחנוך אחרים ולעזור להם להתפתח." },
  { id: 4, category: "מנהיגות", text: "אני יודע לשמור את הצוות מחויב ומוטיבציוני גם תחת לחץ." },
  { id: 5, category: "מנהיגות", text: "אני נותן עדיפות ליעדי הצוות על פני הכרה אישית." },
  { id: 6, category: "מנהיגות", text: "אני לא חושש לקבל החלטות קשות." },
  { id: 7, category: "מנהיגות", text: "אני מקשיב לדעות מגוונות לפני שאני מחליט." },
  { id: 8, category: "מנהיגות", text: "אני יודע להאציל משימות לפי החוזקות של האנשים." },
  // עבודת צוות ותקשורת
  { id: 9, category: "עבודת צוות", text: "אני מעדיף לעבוד בשיתוף עם אחרים מאשר לבד." },
  { id: 10, category: "עבודת צוות", text: "אני דואג לשלב בדיונים גם חברי צוות שקטים." },
  { id: 11, category: "עבודת צוות", text: "אני מתקשר רעיונות מורכבים בצורה ברורה ופשוטה." },
  { id: 12, category: "עבודת צוות", text: "אני פועל מהר לפתור קונפליקטים בתוך הצוות." },
  { id: 13, category: "עבודת צוות", text: "אני מעדכן את הצוות באופן קבוע בהתקדמות שלי." },
  { id: 14, category: "עבודת צוות", text: "אני מעריך משוב ומשתמש בו כדי להשתפר." },
  { id: 15, category: "עבודת צוות", text: "אני יוצר קשרים מקצועיים חזקים בקלות." },
  { id: 16, category: "עבודת צוות", text: "אני תומך כשחבר צוות מתקשה." },
  // פתרון בעיות
  { id: 17, category: "פתרון בעיות", text: "אני נהנה לנתח נתונים מורכבים כדי למצוא דפוסים." },
  { id: 18, category: "פתרון בעיות", text: "אני מחפש את שורש הבעיה ולא רק את הסימפטומים." },
  { id: 19, category: "פתרון בעיות", text: "אני יודע לפרק בעיה גדולה לצעדים ניתנים לביצוע." },
  { id: 20, category: "פתרון בעיות", text: "אני יצירתי במציאת דרכי עקיפה למכשולים." },
  { id: 21, category: "פתרון בעיות", text: "אני מסתמך על היגיון ועובדות יותר מאשר על אינטואיציה." },
  { id: 22, category: "פתרון בעיות", text: "אני נהנה לייעל תהליכים ולהפוך אותם ליעילים יותר." },
  { id: 23, category: "פתרון בעיות", text: "אני נשאר רגוע כשדברים לא מתקדמים כמתוכנן." },
  { id: 24, category: "פתרון בעיות", text: "אני מציע לעיתים קרובות פתרונות חדשניים לבעיות ותיקות." },
  // הסתגלות (אדפטיביות)
  { id: 25, category: "הסתגלות", text: "אני מסתגל מהר לשינויים בהיקף הפרויקט." },
  { id: 26, category: "הסתגלות", text: "נוח לי לעבוד גם עם הנחיות עמומות." },
  { id: 27, category: "הסתגלות", text: "אני רואה בכישלון הזדמנות ללמידה." },
  { id: 28, category: "הסתגלות", text: "אני יודע לעבור בין משימות שונות בקלות." },
  { id: 29, category: "הסתגלות", text: "אני פתוח לנסות שיטות עבודה חדשות." },
  { id: 30, category: "הסתגלות", text: "אני מתאושש מהר ממכשולים." },
  { id: 31, category: "הסתגלות", text: "אני משגשג בסביבות דינמיות ומהירות." },
  { id: 32, category: "הסתגלות", text: "אני מוכן לקחת משימות מחוץ לתפקיד הרשמי שלי." },
  // צמיחה ולמידה
  { id: 33, category: "צמיחה", text: "אני מחפש באופן פעיל דברים חדשים ללמוד." },
  { id: 34, category: "צמיחה", text: "אני מלמד את עצמי כלים או תוכנות חדשות באופן קבוע." },
  { id: 35, category: "צמיחה", text: "אני מתעדכן במגמות האחרונות בתעשייה." },
  { id: 36, category: "צמיחה", text: "אני מציב לעצמי יעדים מקצועיים שאפתניים." },
  { id: 37, category: "צמיחה", text: "אני מבקש עזרה כשאני לא מבין משהו." },
  { id: 38, category: "צמיחה", text: "אני נהנה מאתגרים מחשבתיים." },
  { id: 39, category: "צמיחה", text: "אני מחפש כל הזמן דרכים לשפר את הכישורים שלי." },
  { id: 40, category: "צמיחה", text: "אני מאמין שהיכולות שלי מתפתחות דרך השקעה והתמדה." },
];

type Stage = "questions" | "analyzing" | "results";

const QUESTIONS_PER_STEP = 5;
const MARKET_AVG: Record<string, number> = {
  מנהיגות: 3.9,
  "עבודת צוות": 4.1,
  "פתרון בעיות": 4.0,
  הסתגלות: 3.8,
  צמיחה: 4.2,
};

interface SkillsQuestionnaireProps {
  testMode?: boolean;
}

interface AIAnalysis {
  summary: string;
  strengths: string[];
  recommendation: string;
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const SkillsQuestionnaire: React.FC<SkillsQuestionnaireProps> = ({ testMode = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stage, setStage] = useState<Stage>("questions");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const navigate = useNavigate();

  // In test mode, use one question from each category for variety
  const activeQuestions = useMemo(() => {
    if (testMode) {
      // Get one question from each category
      const categories = ["מנהיגות", "עבודת צוות", "פתרון בעיות", "הסתגלות", "צמיחה"];
      return categories.map(cat =>
        QUESTIONS.find(q => q.category === cat)!
      );
    }
    return QUESTIONS;
  }, [testMode]);

  const stepStart = currentStep * QUESTIONS_PER_STEP + 1;
  const stepEnd = Math.min((currentStep + 1) * QUESTIONS_PER_STEP, activeQuestions.length);

  const totalSteps = Math.ceil(activeQuestions.length / QUESTIONS_PER_STEP);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / activeQuestions.length) * 100);
  const barProgress = Math.min(100, Math.max(progress, progress > 0 ? 6 : 0));
  const knobPosition = Math.max(progress, progress > 0 ? 8 : 4);

  const currentQuestions = useMemo(() => {
    const start = currentStep * QUESTIONS_PER_STEP;
    return activeQuestions.slice(start, start + QUESTIONS_PER_STEP);
  }, [currentStep, activeQuestions]);

  const categories = useMemo(
    () => Array.from(new Set(activeQuestions.map((q) => q.category))),
    [activeQuestions]
  );

  const categoryScores = useMemo(() => {
    const totals: Record<string, { sum: number; count: number }> = {};
    categories.forEach((cat) => (totals[cat] = { sum: 0, count: 0 }));

    QUESTIONS.forEach((q) => {
      const val = answers[q.id];
      if (val) {
        totals[q.category].sum += val;
        totals[q.category].count += 1;
      }
    });

    return categories.map((cat) => {
      const { sum, count } = totals[cat];
      if (count === 0) return 0;
      return Number((sum / count).toFixed(2));
    });
  }, [answers, categories]);

  const canGoNext = currentQuestions.every((q) => answers[q.id]);

  // Refs for scrolling to questions
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  const scrollToQuestion = useCallback((index: number) => {
    setTimeout(() => {
      const element = questionRefs.current[index];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, []);

  const handleChange = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));

    // Find index of current question within current page
    const currentIndex = currentQuestions.findIndex((q) => q.id === id);

    // If there's a next question on this page, scroll to it
    if (currentIndex < currentQuestions.length - 1) {
      scrollToQuestion(currentIndex + 1);
    }
  };

  const handleNext = () => {
    if (stage !== "questions") return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      // Scroll to top of page after page change
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }
    // Completed all
    setStage("analyzing");
  };

  useEffect(() => {
    if (stage !== "analyzing") return;

    const submitToAI = async () => {
      try {
        // Generate a unique user ID for this session
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Prepare the answers in the format the API expects
        const answersMap: Record<number, number> = {};
        Object.entries(answers).forEach(([id, score]) => {
          answersMap[parseInt(id)] = score;
        });

        // Call the appropriate endpoint based on test mode
        const endpoint = testMode
          ? `${API_BASE_URL}/assessment/submit/test`
          : `${API_BASE_URL}/assessment/submit`;

        console.log('Submitting to:', endpoint, 'Answers:', answersMap);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
          body: JSON.stringify({ answers: answersMap }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('AI Analysis result:', result);

        // Set the AI analysis from the response
        setAiAnalysis({
          summary: result.ai_summary,
          strengths: result.top_strengths,
          recommendation: result.growth_recommendation,
        });

        setStage("results");
      } catch (error) {
        console.error('Error calling AI API:', error);
        setAnalysisError('Failed to get AI analysis. Showing local results.');
        // Still show results even if AI fails
        setStage("results");
      }
    };

    submitToAI();
  }, [stage, answers, testMode]);

  const renderQuestions = () => (
    <div className="space-y-6">


      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-4"
          ref={questionsContainerRef}
        >
          {currentQuestions.map((q, idx) => (
            <div
              key={q.id}
              ref={(el) => { questionRefs.current[idx] = el; }}
            >
              <QuestionCard
                index={currentStep * QUESTIONS_PER_STEP + idx + 1}
                question={q}
                value={answers[q.id]}
                onChange={(value) => handleChange(q.id, value)}
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
        <button
          type="button"
          onClick={() => {
            setCurrentStep((s) => Math.max(0, s - 1));
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
          }}
          disabled={currentStep === 0}
          className="group flex items-center justify-center gap-3 w-44 px-8 py-2 rounded-xl bg-white border-2 border-neutral-200 text-neutral-700 font-semibold hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200 disabled:hover:text-neutral-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span>הקודם</span>
        </button>

        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <span>עמוד</span>
          <span className="font-bold text-purple-700">{currentStep + 1}</span>
          <span>מתוך</span>
          <span className="font-bold text-purple-700">{totalSteps}</span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className="group flex items-center justify-center gap-3 w-44 px-8 py-2 rounded-xl text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer"
          style={{
            background: canGoNext
              ? 'linear-gradient(135deg, #541388 0%, #7c3aed 100%)'
              : '#d1d5db',
            opacity: canGoNext ? 1 : 0.6
          }}
        >
          <span>{currentStep === totalSteps - 1 ? "צפה בתוצאות ✨" : "הבא"}</span>
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="bg-white border border-neutral-light/70 rounded-card shadow-card p-10 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
      <h3 className="text-xl font-bold text-neutral-dark">מחשב עבורך את התובנות</h3>
      <p className="text-neutral-medium max-w-xl">
        אנחנו מנתחים את התשובות ומרכיבים עבורך פרופיל כישורים מאוזן ביחס לממוצע השוק.
      </p>
    </div>
  );

  const renderResults = () => {
    const labels = categories;
    const myScores = categoryScores.map((score) =>
      score > 0 ? score : 3.5
    );

    // Get top 3 strengths sorted by score
    const sortedSkills = labels
      .map((label, idx) => ({ label, score: myScores[idx] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return (
      <div className="space-y-8" dir="rtl">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">
            פרופיל הכישורים שלך
          </h2>
          <p className="text-neutral-500 text-lg">
            סיכום התוצאות וניתוח נטיות תעסוקתיות
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card - Top Strengths (appears on right in RTL) */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 md:p-8">
            <h3 className="text-xl font-bold text-neutral-700 text-start mb-6">
              החוזקות המובילות שלך
            </h3>
            <div className="space-y-5">
              {sortedSkills.map((skill, idx) => (
                <div key={skill.label} className="space-y-2">
                  {/* Top row: Badge + Name on right, Score on left */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-neutral-700">
                        {skill.label}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-neutral-600">
                      {skill.score.toFixed(1)}/5
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.score / 5) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.2 }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card - Radar Chart (appears on left in RTL) */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-neutral-700 text-center mb-4">
              מפת כישורים
            </h3>
            <div className="w-full flex items-center justify-center">
              <div className="w-full max-w-[220px]">
                <SkillsRadarChart labels={labels} myScores={myScores} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Deep Analysis Section */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-700">ניתוח מעמיק (AI)</h3>
          </div>

          {analysisError && (
            <p className="text-amber-600 text-sm mb-4">{analysisError}</p>
          )}

          {/* Content - Show AI-generated or fallback */}
          <div className="text-slate-700 leading-relaxed space-y-4">
            <p className="font-semibold text-lg">שלום,</p>

            {aiAnalysis ? (
              <>
                {/* AI Summary */}
                <p>{aiAnalysis.summary}</p>

                {/* AI Strengths */}
                <div>
                  <p className="font-bold text-slate-800 mb-2">חוזקות בולטות:</p>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    {aiAnalysis.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>

                {/* AI Recommendation */}
                {aiAnalysis.recommendation && (
                  <div>
                    <p className="font-bold text-slate-800 mb-2">המלצות לצמיחה:</p>
                    <p>{aiAnalysis.recommendation}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Fallback content when AI is not available */}
                <p>
                  ניתוח הכישורים שלך חושף פרופיל מרתק ובעל פוטנציאל רב לפיתוח קריירה.
                  אתה ניחן בחוזקות משמעותיות בתחומים קריטיים להצלחה ארגונית.
                </p>

                <div>
                  <p className="font-bold text-slate-800 mb-2">חוזקות בולטות:</p>
                  <p>
                    בראש ובראשונה, בולטת יכולתך הגבוהה ב<strong>{sortedSkills[0]?.label} ({sortedSkills[0]?.score.toFixed(1)})</strong>,
                    המעידה על מסוגלות יוצאת דופן לתכנון, סדר וביצוע משימות ביעילות.
                    לצד זאת, <strong>{sortedSkills[1]?.label} ({sortedSkills[1]?.score.toFixed(1)})</strong> מצביע על אדם יציב,
                    המסוגל לתפקד היטב גם בסביבות מאתגרות. כישורי <strong>{sortedSkills[2]?.label} ({sortedSkills[2]?.score.toFixed(1)})</strong> תורמים
                    ליכולתך להשתלב ולהניע קדימה הן יחידים והן קבוצות.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <QuestionnaireLayout
      header={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary text-3xl font-extrabold">
              <List className="w-8 h-8" />
              <span>שאלון התאמה</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 -scale-x-100" />
              חזרה לדף הבית
            </button>

          </div>

          <p className="text-start text-neutral-medium font-semibold text-lg">
            ענה על כל השאלות כדי לזהות את החוזקות המקצועיות שלך ולשפר את איכות ההתאמות
          </p>

          <div className="w-full">
            <div className="mx-auto max-w-5xl space-y-3">


              <div className="relative h-12 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Progress fill - anchored to right, expands left for RTL */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barProgress - 1}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="rounded-full"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    bottom: '4px',
                    right: '4px',
                    backgroundColor: '#541388'
                  }}
                />

                <span className="relative z-10 text-neutral-800 font-bold">
                  {answeredCount} / {QUESTIONS.length} נענו
                </span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      {stage === "questions" && renderQuestions()}
      {stage === "analyzing" && renderAnalyzing()}
      {stage === "results" && renderResults()}
    </QuestionnaireLayout>
  );
};


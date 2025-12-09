import React, { useState, useEffect } from 'react';
import { MatchScore } from '../MatchScore';
import { ArrowLeft, Laptop, ChartLine, Users, Circle, Eye, Search, Sparkles, CheckCircle2, ScanSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchingOpportunitiesSummaryProps {
  onNavigate?: (view: 'dashboard' | 'home' | 'jobs' | 'match') => void;
  scanTrigger?: number;
  onJobSelect?: (job: { id: number; title: string; matchPercent: number }) => void;
  selectedJobId?: number;
}

export const MatchingOpportunitiesSummary: React.FC<MatchingOpportunitiesSummaryProps> = ({ 
  onNavigate, 
  scanTrigger = 0,
  onJobSelect,
  selectedJobId
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanText, setScanText] = useState('מנתח פרופיל אישי...');
  
  // Re-run scan when scanTrigger changes (and is > 0)
  useEffect(() => {
    if (scanTrigger > 0) {
      setIsScanning(true);
      setScanText('מנתח פרופיל אישי...');
    }
  }, [scanTrigger]);
  
  useEffect(() => {
    if (!isScanning) return;

    // Sequence of scanning texts
    const steps = [
      { text: 'מנתח מיומנויות וכישורים...', delay: 0 },
      { text: 'מצליב נתונים עם משרות פתוחות...', delay: 1000 },
      { text: 'מח��ב אחוזי התאמה...', delay: 2000 },
      { text: 'נמצאו 3 התאמות מובילות!', delay: 3000 }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanText(steps[currentStep].text);
      }
    }, 1000);

    const timeout = setTimeout(() => {
      setIsScanning(false);
      clearInterval(interval);
    }, 3500); // Total animation time

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="matching-opportunities" className="bg-white rounded-card shadow-card overflow-hidden min-h-[500px] flex flex-col">
      <div className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">משרות מותאמות עבורך</h2>
            <p className="text-neutral-medium text-sm">על בסיס הכישורים הקשים והרכים שלך · בחר/י משרה לצפייה בתוכנית פיתוח מותאמת</p>
          </div>
          <button 
            onClick={() => onNavigate?.('jobs')}
            className="text-primary hover:underline font-semibold text-sm flex items-center gap-2 h-[44px] px-5 rounded-button border border-primary/20 hover:border-primary transition-colors"
          >
            צפה בכל ההזדמנויות (12 משרות)
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 relative bg-neutral-50/50">
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10"
            >
              {/* Radar Animation */}
              <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                {/* Ripples */}
                <motion.div 
                  className="absolute inset-0 border-2 border-primary/30 rounded-full"
                  animate={{ scale: [1, 2], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div 
                  className="absolute inset-0 border-2 border-primary/30 rounded-full"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />
                
                {/* Center Icon */}
                <div className="relative z-10 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 text-primary">
                  <ScanSearch className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              {/* Scanning Text */}
              <motion.div
                key={scanText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg font-bold text-primary flex items-center gap-2"
              >
                {scanText === 'נמצאו 3 התאמות מובילות!' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Sparkles className="w-4 h-4" />}
                {scanText}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              {/* Job Card 1 */}
              <motion.div 
                onClick={() => onJobSelect?.({ id: 1, title: 'ראש צוות פיתוח', matchPercent: 92 })}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className={`relative border ${selectedJobId === 1 ? 'border-primary shadow-panel ring-1 ring-primary' : 'border-neutral-light'} rounded-card p-6 hover:border-primary hover:shadow-panel transition-all cursor-pointer bg-white group hover:-translate-y-1 duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-primary">ראש צוות פיתוח</h3>
                    <span className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-pill font-bold border border-primary/20 flex items-center gap-1 w-fit">
                      <Laptop className="w-3 h-3" />
                      טכנולוגיה
                    </span>
                  </div>
                  <div className="shrink-0">
                    <MatchScore score={92} compact={true} />
                  </div>
                </div>

                <p className="text-neutral-medium text-sm mb-3">חטיבת טכנולוגיות | מחלקת פיתוח</p>
                
                <p className="text-sm text-neutral-dark mb-4 leading-relaxed">הובלת צוות פיתוח Backend בטכנולוגיות Java ו-Spring, ניהול ארכיטקטורה ופיתוח מערכות מורכבות.</p>

                <div className="mb-4 bg-neutral-extralight rounded-card p-4">
                  <p className="text-xs font-bold text-neutral-dark mb-2">דרישות עיקריות:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">Java & Spring - מתאים</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">מנהיגות - חוזקה</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">ניהול פרויקטים - פער קטן</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary text-white py-3 rounded-button text-sm font-semibold hover:bg-primary-dark transition-colors h-[44px] flex items-center justify-center gap-2">
                  פרטי משרה
                </button>
              </motion.div>

              {/* Job Card 2 */}
              <motion.div 
                onClick={() => onJobSelect?.({ id: 2, title: 'מנהל/ת תקציבים', matchPercent: 81 })}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className={`relative border ${selectedJobId === 2 ? 'border-accent shadow-panel ring-1 ring-accent' : 'border-neutral-light'} rounded-card p-6 hover:border-accent hover:shadow-panel transition-all cursor-pointer bg-white group hover:-translate-y-1 duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-primary">מנהל/ת תקציבים</h3>
                    <span className="bg-accent/10 text-accent-dark text-xs px-3 py-1.5 rounded-pill font-bold border border-accent/30 flex items-center gap-1 w-fit">
                      <ChartLine className="w-3 h-3" />
                      כספים
                    </span>
                  </div>
                  <div className="shrink-0">
                    <MatchScore score={81} compact={true} />
                  </div>
                </div>

                <p className="text-neutral-medium text-sm mb-3">חטיבת הכספים | מחלקת תקציבים</p>
                
                <p className="text-sm text-neutral-dark mb-4 leading-relaxed">ניהול תקציבי פרויקטים, ניתוח פיננסי ובקרה תקציבית לפרויקטים אסטרטגיים בארגון.</p>

                <div className="mb-4 bg-neutral-extralight rounded-card p-4">
                  <p className="text-xs font-bold text-neutral-dark mb-2">דרישות עיקריות:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">חשיבה אנליטית - חוזקה</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">Excel מתקדם - פער קטן</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">הכרת SAP - חסר</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary text-white py-3 rounded-button text-sm font-semibold hover:bg-primary-dark transition-colors h-[44px] flex items-center justify-center gap-2">
                  פרטי משרה
                </button>
              </motion.div>

              {/* Job Card 3 */}
              <motion.div 
                onClick={() => onJobSelect?.({ id: 3, title: 'שותף/ה עסקי HR', matchPercent: 73 })}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className={`relative border ${selectedJobId === 3 ? 'border-secondary shadow-panel ring-1 ring-secondary' : 'border-neutral-light'} rounded-card p-6 hover:border-secondary hover:shadow-panel transition-all cursor-pointer bg-white group hover:-translate-y-1 duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-primary">שותף/ה עסקי HR</h3>
                    <span className="bg-secondary/10 text-secondary text-xs px-3 py-1.5 rounded-pill font-bold border border-secondary/30 flex items-center gap-1 w-fit">
                      <Users className="w-3 h-3" />
                      משאבי אנוש
                    </span>
                  </div>
                  <div className="shrink-0">
                    <MatchScore score={73} compact={true} />
                  </div>
                </div>

                <p className="text-neutral-medium text-sm mb-3">חטיבת משאבי אנוש | מחלקת פיתוח ארגוני</p>
                
                <p className="text-sm text-neutral-dark mb-4 leading-relaxed">ליווי מנהלים בתהליכי פיתוח ארגוני, גיו�� ושימור עובדים, וניהול תהליכי שינוי ארגוני.</p>

                <div className="mb-4 bg-neutral-extralight rounded-card p-4">
                  <p className="text-xs font-bold text-neutral-dark mb-2">דרישות עיקריות:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">תקשורת בין-אישית - חוזקה</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">ניהול שינוי ארגוני - פער</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <Circle className="text-neutral-dark w-1.5 h-1.5 mt-1 fill-current" />
                      <span className="text-neutral-dark">תואר בפסיכולוגיה - חסר</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary text-white py-3 rounded-button text-sm font-semibold hover:bg-primary-dark transition-colors h-[44px] flex items-center justify-center gap-2">
                  פרטי משרה
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
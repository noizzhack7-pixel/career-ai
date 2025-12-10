import React from 'react';
import { PersonalProfileSummary } from './dashboard/PersonalProfileSummary';
import { MatchingOpportunitiesSummary } from './dashboard/MatchingOpportunitiesSummary';
import { DevelopmentPlanSummary } from './dashboard/DevelopmentPlanSummary';
import { LikedJobsSummary } from './dashboard/LikedJobsSummary';
import { MatchingCTA } from './dashboard/MatchingCTA';
import { ListChecks, ArrowLeft, Bot, Send, CalendarPlus, Bell, User } from 'lucide-react';

interface DashboardProps {
  onNavigate?: (view: 'dashboard' | 'home' | 'jobs' | 'match') => void;
  employeeData?: any;
  positionsData?: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, employeeData, positionsData }) => {
  const [scanTrigger, setScanTrigger] = React.useState(0);
  const [selectedJob, setSelectedJob] = React.useState<{ id: number; title: string; matchPercent: number } | null>(null);

  const handleRunMatch = () => {
    setScanTrigger(prev => prev + 1);
    setSelectedJob(null);
  };

  return (
    <div className="grid grid-cols-12 gap-8 items-start">
      {/* Center Column */}
      <div className="col-span-9 space-y-8">
        <PersonalProfileSummary onNavigate={() => onNavigate?.('home')} employeeData={employeeData} />
        <MatchingCTA onRunMatch={handleRunMatch} />
        <MatchingOpportunitiesSummary
          onNavigate={onNavigate}
          scanTrigger={scanTrigger}
          onJobSelect={setSelectedJob}
          selectedJobId={selectedJob?.id}
          positionsData={positionsData}
        />
        <DevelopmentPlanSummary selectedJob={selectedJob} />
        <LikedJobsSummary onNavigate={onNavigate} />

      </div>

      {/* Right Sidebar */}
      <div className="col-span-3 space-y-6 sticky top-24">
        {/* Matching Questionnaire Card */}


        {/* AI Guidance Card */}
        <div id="ai-guidance" className="bg-white p-6 rounded-card shadow-sm border border-neutral-light/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-neutral-dark">יועץ תעסוקתי AI </h3>
          </div>
          <p className="text-sm text-neutral-medium mb-4">התייעצ/י עם ה-AI שלנו כדי לקבל הכוונה אישית למסלול הקריירה שלך.</p>

          <div className="relative mb-3">
            <textarea rows={3} placeholder="שאל/י אותי כל דבר..." className="w-full bg-neutral-50 border border-neutral-light rounded-button p-3 text-sm text-neutral-dark placeholder:text-neutral-medium/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"></textarea>
          </div>

          <div className="space-y-2 mb-4 text-xs">
            <p className="font-semibold text-neutral-dark">נסה/י לשאול:</p>
            <button className="block w-full text-right bg-neutral-50 hover:bg-neutral-100 p-2.5 rounded-button transition-colors border border-neutral-light text-neutral-medium hover:text-primary">"מה כדאי לי ללמוד כדי להתקדם בארגון?"</button>
            <button className="block w-full text-right bg-neutral-50 hover:bg-neutral-100 p-2.5 rounded-button transition-colors border border-neutral-light text-neutral-medium hover:text-primary">"מה התפקיד שהכי מתאים לי כרגע?"</button>
          </div>

          <button className="w-full bg-primary text-white font-bold py-3 rounded-button hover:bg-primary-dark transition-colors h-[44px] flex items-center justify-center gap-2 shadow-sm">
            <Send className="w-4 h-4" />
            שלח/י שאלה
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Search, Bell } from 'lucide-react';

interface EmployeeData {
  name?: string;
  current_job?: string;
  photo_url?: string;
}

interface NavbarProps {
  onNavigate?: (page: 'dashboard' | 'home' | 'jobs' | 'match') => void;
  currentView?: 'dashboard' | 'home' | 'jobs' | 'match';
  employeeData?: EmployeeData | null;
}

export const Navbar = ({ onNavigate, currentView = 'dashboard', employeeData }: NavbarProps) => {
  // Build full name from first/last name
  const employeeName = employeeData
    ? `${employeeData.name}`.trim()
    : 'טוען...';
  const employeeTitle = employeeData?.current_job || '...';
  const employeeAvatar = employeeData?.photo_url;
  return (
    <nav id="top-navigation" className="bg-white border-b border-neutral-light sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img
              style={{ marginRight: '-1.5rem' }}
              src="/logo.png"
              alt="GO-PRO Logo"
              className="w-30 h-16 rounded-lg object-contain cursor-pointer"
              onClick={() => onNavigate?.('dashboard')}
            />

            <div className="flex items-center gap-1">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate?.('dashboard'); }}
                className={`px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none flex items-center h-[44px] ${currentView === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-neutral-dark hover:text-primary border-b-2 border-transparent'}`}
              >
                בית
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate?.('jobs'); }}
                className={`px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none flex items-center h-[44px] ${currentView === 'jobs' ? 'text-primary border-b-2 border-primary' : 'text-neutral-dark hover:text-primary border-b-2 border-transparent'}`}
              >
                משרות בארגון
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate?.('match'); }}
                className={`px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none flex items-center h-[44px] ${currentView === 'match' ? 'text-primary border-b-2 border-primary' : 'text-neutral-dark hover:text-primary border-b-2 border-transparent'}`}
              >
                המשרות שלי
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}
                className={`px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none flex items-center h-[44px] ${currentView === 'home' ? 'text-primary border-b-2 border-primary' : 'text-neutral-dark hover:text-primary border-b-2 border-transparent'}`}
              >
                הפרופיל שלי
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-72">
              <label htmlFor="global-search" className="sr-only">חיפוש בשפה חופשית</label>
              <input
                id="global-search"
                type="text"
                placeholder="חיפוש בשפה חופשית..."
                className="w-full bg-neutral-extralight border-2 border-neutral-light rounded-card py-2 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 right-3 text-neutral-dark w-4 h-4" />
            </div>

            <div className="flex items-center gap-4">
              <button className="relative text-neutral-dark hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
              </button>
              <div className="flex items-center gap-3 pr-4 border-r-2 border-neutral-light">
                <img src={employeeAvatar} alt={`תמונת פרופיל של ${employeeName}`} className="w-9 h-9 rounded-full border-2 border-primary/40" />
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-dark">{employeeName}</p>
                  <p className="text-xs text-neutral-medium">{employeeTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

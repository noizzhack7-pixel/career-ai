import React, { useEffect, useRef, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProfileHero } from "./components/ProfileHero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Education } from "./components/Education";
import { Experience } from "./components/Experience";
import { Recommendations } from "./components/Recommendations";
import { Wishlist } from "./components/Wishlist";
import { CareerPreferences } from "./components/Sidebar/CareerPreferences";
import { Languages } from "./components/Sidebar/Languages";
import { TargetRole } from "./components/Sidebar/TargetRole";
import { QuickActions } from "./components/Sidebar/QuickActions";
import { Notifications } from "./components/Sidebar/Notifications";
import { JobsPage } from "./components/JobsPage";
import { Dashboard } from "./components/Dashboard";
import { MatchAndDevelopment } from "./components/MatchAndDevelopment";
import { SkillsQuestionnaire } from "./components/SkillsQuestionnaire";

const ProfilePage = ({ employeeData }: { employeeData?: any }) => (
  <>
    <ProfileHero employeeData={employeeData} />

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 space-y-8">
        <About employeeData={employeeData} />
        <Skills employeeData={employeeData} />
        <Education employeeData={employeeData} />
        <Experience />
        {/* <Recommendations /> */}
        {/* <Wishlist /> */}
      </div>

      <div className="col-span-4 space-y-6">
        <CareerPreferences />
        <Languages employeeData={employeeData} />
        <TargetRole />
        <QuickActions />
        <Notifications />
      </div>
    </div>
  </>
);

const getCurrentView = (
  pathname: string
): "dashboard" | "home" | "jobs" | "match" => {
  if (pathname.startsWith("/positions")) return "jobs";
  if (pathname.startsWith("/my-positions")) return "match";
  if (pathname.startsWith("/profile")) return "home";
  return "dashboard";
};

// Loading spinner component
const AppLoader = () => (
  <div
    dir="rtl"
    className="bg-neutral-extralight font-heebo text-neutral-dark min-h-screen flex items-center justify-center"
  >
    <div className="flex flex-col items-center gap-6">
      {/* Outer glow effect */}
      <div className="relative">
        {/* Pulsing background glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        ></div>

        {/* Outer spinning ring */}
        <div
          className="w-20 h-20 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #6366f1, #8b5cf6, #a855f7, transparent)',
            animation: 'spin 1.5s linear infinite',
          }}
        >
          {/* Inner circle cutout */}
          <div className="absolute inset-2 bg-neutral-extralight rounded-full"></div>
        </div>

        {/* Inner spinning ring (opposite direction) */}
        <div
          className="absolute inset-3 rounded-full"
          style={{
            background: 'conic-gradient(from 180deg, transparent, #a855f7, #8b5cf6, #6366f1, transparent)',
            animation: 'spin 1s linear infinite reverse',
          }}
        >
          {/* Inner circle cutout */}
          <div className="absolute inset-2 bg-neutral-extralight rounded-full"></div>
        </div>

        {/* Center dot */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          ></div>
        </div>
      </div>

      {/* Loading text with fade animation */}
      <p
        className="text-lg font-medium"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        טוען...
      </p>
    </div>

    {/* Keyframe animations */}
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
      }
    `}</style>
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Guard to prevent double fetch in StrictMode
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchEmployeeMe = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/employees/me");
        const data = await response.json();
        console.log("employees/me response:", data);
        setEmployeeData(data);
      } catch (error) {
        console.error("Error fetching employees/me:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeMe();
  }, []);

  const handleNavigate = (view: "dashboard" | "home" | "jobs" | "match") => {
    switch (view) {
      case "dashboard":
        navigate("/");
        break;
      case "jobs":
        navigate("/positions");
        break;
      case "match":
        navigate("/my-positions");
        break;
      case "home":
        navigate("/profile");
        break;
      default:
        navigate("/");
    }
  };

  const currentView = getCurrentView(location.pathname);

  // Show loader while fetching employee data
  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <div
      dir="rtl"
      className="bg-neutral-extralight font-heebo text-neutral-dark min-h-screen"
    >
      <Navbar
        onNavigate={handleNavigate}
        currentView={currentView}
        employeeData={employeeData}
      />

      <main
        id="main-content"
        className="max-w-[1600px] mx-auto p-10"
      >
        <Routes>
          <Route
            path="/"
            element={<Dashboard onNavigate={handleNavigate} employeeData={employeeData} />}
          />
          <Route path="/positions" element={<JobsPage />} />
          <Route
            path="/my-positions"
            element={<MatchAndDevelopment onNavigate={handleNavigate} />}
          />
          <Route path="/questionnaire" element={<SkillsQuestionnaire />} />
          <Route path="/questionnaire-test" element={<SkillsQuestionnaire testMode />} />
          <Route path="/profile" element={<ProfilePage employeeData={employeeData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

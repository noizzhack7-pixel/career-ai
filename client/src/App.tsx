import React from "react";
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

const ProfilePage = () => (
  <>
    <ProfileHero />

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 space-y-8">
        <About />
        <Skills />
        <Education />
        <Experience />
        <Recommendations />
        <Wishlist />
      </div>

      <div className="col-span-4 space-y-6">
        <CareerPreferences />
        <Languages />
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

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div
      dir="rtl"
      className="bg-neutral-extralight font-heebo text-neutral-dark min-h-screen"
    >
      <Navbar
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      <main
        id="main-content"
        className="max-w-[1600px] mx-auto p-10"
      >
        <Routes>
          <Route
            path="/"
            element={<Dashboard onNavigate={handleNavigate} />}
          />
          <Route path="/positions" element={<JobsPage />} />
          <Route
            path="/my-positions"
            element={<MatchAndDevelopment onNavigate={handleNavigate} />}
          />
          <Route path="/questionnaire" element={<SkillsQuestionnaire />} />
          <Route path="/questionnaire-test" element={<SkillsQuestionnaire testMode />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
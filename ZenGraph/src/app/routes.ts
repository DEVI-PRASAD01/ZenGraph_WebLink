import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import SessionLayout from "./layouts/SessionLayout";

// Onboarding & Auth
import Welcome from "./pages/Welcome";
import GoalSelection from "./pages/GoalSelection";
import Experience from "./pages/Experience";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

// Main App (with sidebar)
import Home from "./pages/Home";
import Library from "./pages/Library";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import FriendStreak from "./pages/FriendStreak";
import History from "./pages/History";


// Session Flow
import MoodSelection from "./pages/MoodSelection";
import AIRecommendation from "./pages/AIRecommendation";
import PlanDetails from "./pages/PlanDetails";
import SessionReady from "./pages/SessionReady";
import MeditationPlayer from "./pages/MeditationPlayer";
import SessionCompletion from "./pages/SessionCompletion";
import Reflection from "./pages/Reflection";
import AIProgress from "./pages/AIProgress";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // Landing page — standalone, no auth layout
      { index: true, Component: Welcome },

      // Auth & Onboarding — wrapped in split-screen AuthLayout
      {
        Component: AuthLayout,
        children: [
          { path: "onboarding/goals", Component: GoalSelection },
          { path: "onboarding/experience", Component: Experience },
          { path: "auth/login", Component: Login },
          { path: "auth/signup", Component: Signup },
          { path: "auth/reset", Component: ResetPassword },
        ],
      },

      // Main App with sidebar navigation
      {
        path: "app",
        Component: AppLayout,
        children: [
          { path: "home", Component: Home },
          { path: "library", Component: Library },
          { path: "analytics", Component: Analytics },
          { path: "profile", Component: Profile },
          { path: "settings", Component: Settings },
          { path: "friends", Component: FriendStreak },
          { path: "history", Component: History },
        ],
      },

      // Session Flow — centered panel layout
      {
        path: "session",
        Component: SessionLayout,
        children: [
          { path: "goals", Component: GoalSelection },
          { path: "experience", Component: Experience },
          { path: "mood", Component: MoodSelection },
          { path: "recommendation", Component: AIRecommendation },
          { path: "plan", Component: PlanDetails },
          { path: "ready", Component: SessionReady },
          { path: "player", Component: MeditationPlayer },
          { path: "complete", Component: SessionCompletion },
          { path: "reflection", Component: Reflection },
          { path: "analysis", Component: AIProgress },
        ],
      },
    ],
  },
]);

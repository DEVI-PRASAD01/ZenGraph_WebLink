import { useNavigate, useLocation } from "react-router";
import {
  Home,
  BookOpen,
  BarChart2,
  User,
  Settings,
  Sparkles,
  Zap,
  LogOut,
} from "lucide-react";

const PROFILE_IMG =
  "https://images.unsplash.com/photo-1759873911661-d4cba84d2eff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMG1lZGl0YXRpbmclMjBzZXJlbmUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI3ODA2MDZ8MA&ixlib=rb-4.1.0&q=80&w=400";

const navItems = [
  { label: "Home", icon: Home, path: "/app/home" },
  { label: "Library", icon: BookOpen, path: "/app/library" },
  { label: "Analytics", icon: BarChart2, path: "/app/analytics" },
  { label: "Profile", icon: User, path: "/app/profile" },
  { label: "Settings", icon: Settings, path: "/app/settings" },
];

export function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePlanRaw = localStorage.getItem("zengraph_active_plan");
  const activePlan = activePlanRaw ? JSON.parse(activePlanRaw) : { name: "Basic" };

  return (
    <div
      style={{
        width: "260px",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "#FFFFFF",
        borderRight: "1px solid #F3F4F6",
        display: "flex",
        flexDirection: "column",
        padding: "28px 16px 24px",
        overflowY: "auto",
        zIndex: 40,
        boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 mb-8 px-2 cursor-pointer"
        onClick={() => navigate("/app/home")}
      >
        <div
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)" }}
        >
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <span style={{ color: "#1F2933", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.3px" }}>
            ZenGraph
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <Zap size={10} style={{ color: "#F59E0B" }} />
            <span style={{ color: "#9CA3AF", fontSize: "11px", fontWeight: 500 }}>
              AI Meditation
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        <p
          style={{
            color: "#9CA3AF",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "0 12px",
            marginBottom: "8px",
          }}
        >
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all duration-200 group"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #EEF0FF, #E8F8F5)"
                  : "transparent",
                border: isActive ? "1px solid #E0E3FF" : "1px solid transparent",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #6F7BF7, #8BD3C7)"
                    : "#F5F7FA",
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? "#FFFFFF" : "#9CA3AF" }}
                />
              </div>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#6F7BF7" : "#4B5563",
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#6F7BF7" }}
                />
              )}
            </button>
          );
        })}

        {/* Start Session CTA */}
        <div className="mt-4 px-1">
          <button
            onClick={() => navigate("/session/mood")}
            className="w-full py-3 px-4 rounded-2xl flex items-center gap-3 transition-all duration-200 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)",
              boxShadow: "0 6px 20px rgba(111,123,247,0.3)",
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <span style={{ fontSize: "16px" }}>🧘</span>
            </div>
            <div className="text-left">
              <p style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 700 }}>
                Start Session
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px" }}>
                AI-recommended
              </p>
            </div>
            <Zap size={14} style={{ color: "rgba(255,255,255,0.8)", marginLeft: "auto" }} />
          </button>
        </div>
      </nav>

      {/* User info at bottom */}
      <div className="mt-4 pt-4" style={{ borderTop: "1px solid #F3F4F6" }}>
        <div className="flex items-center gap-3 px-2 mb-3">
          <img
            src={PROFILE_IMG}
            alt="User"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            style={{ border: "2px solid #E0E3FF" }}
          />
          <div className="flex-1 min-w-0">
            <p style={{ color: "#1F2933", fontSize: "14px", fontWeight: 600 }} className="truncate">
              Alex Johnson
            </p>
            <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
              {activePlan.name} · 7-day streak 🔥
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-red-50"
        >
          <LogOut size={16} style={{ color: "#EF4444" }} />
          <span style={{ color: "#EF4444", fontSize: "14px", fontWeight: 500 }}>
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
}

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
  Users,
  Clock,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/app/home", color: "linear-gradient(135deg, #8BD3C7, #6F7BF7)", shadow: "rgba(111,123,247,0.4)" },
  { label: "Library", icon: BookOpen, path: "/app/library", color: "linear-gradient(135deg, #FECFEF, #FA709A)", shadow: "rgba(250,112,154,0.4)" },
  { label: "History", icon: Clock, path: "/app/history", color: "linear-gradient(135deg, #FF6B6B, #FFD93D)", shadow: "rgba(255,107,107,0.4)" },
  { label: "Analytics", icon: BarChart2, path: "/app/analytics", color: "linear-gradient(135deg, #6EE7B7, #10B981)", shadow: "rgba(16,185,129,0.4)" },
  { label: "Profile", icon: User, path: "/app/profile", color: "linear-gradient(135deg, #FDE047, #F59E0B)", shadow: "rgba(245,158,11,0.4)" },
  { label: "Friends", icon: Users, path: "/app/friends", color: "linear-gradient(135deg, #C4B5FD, #8B5CF6)", shadow: "rgba(139,92,246,0.4)" },
  { label: "Settings", icon: Settings, path: "/app/settings", color: "linear-gradient(135deg, #D1D5DB, #9CA3AF)", shadow: "rgba(156,163,175,0.4)" },
];

export function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

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
          <span style={{ color: "#1F2933", fontSize: "18px", fontWeight: 800 }}>
            ZenGraph
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <Zap size={10} style={{ color: "#F59E0B" }} />
            <span style={{ color: "#9CA3AF", fontSize: "11px" }}>
              AI Meditation
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-gray-400 px-3 mb-2 uppercase">
          Menu
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-3 py-3 rounded-2xl group transition-colors hover:bg-gray-50"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ 
                    background: item.color,
                    boxShadow: `0 8px 16px -4px ${item.shadow}` 
                }}
              >
                <Icon size={18} color="#fff" />
              </div>

              <span
                style={{
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#6F7BF7" : "#4B5563",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* USER */}
      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2 text-red-500"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
}
import { Home, BookOpen, BarChart2, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const tabs = [
  { label: "Home", icon: Home, path: "/app/home" },
  { label: "Library", icon: BookOpen, path: "/app/library" },
  { label: "Analytics", icon: BarChart2, path: "/app/analytics" },
  { label: "Profile", icon: User, path: "/app/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        flexShrink: 0,
        background: "#FFFFFF",
        borderTop: "1px solid #F3F4F6",
        padding: "12px 16px 24px",
        zIndex: 50,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 min-w-[56px] active:scale-95 transition-transform duration-100"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #6F7BF7, #8BD3C7)"
                    : "transparent",
                }}
              >
                <Icon
                  size={20}
                  color={isActive ? "#FFFFFF" : "#9CA3AF"}
                />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  color: isActive ? "#6F7BF7" : "#6B7280",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
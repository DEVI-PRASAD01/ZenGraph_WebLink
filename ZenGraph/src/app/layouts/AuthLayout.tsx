import { Outlet, useNavigate } from "react-router";
import { Sparkles, CheckCircle2 } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1758607234692-51ac051a2a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6ZW4lMjBtaW5kZnVsbmVzcyUyMHdvbWFuJTIwbWVkaXRhdGluZyUyMHN1bnJpc2V8ZW58MXx8fHwxNzczMTE3ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  "AI-personalized meditation sessions",
  "Real-time mood tracking & analytics",
  "500+ guided breathwork & mindfulness",
  "Daily streaks & progress insights",
];

export default function AuthLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* ── Left branded panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
        style={{
          width: "480px",
          flexShrink: 0,
          background: "linear-gradient(160deg, #4A3FD4 0%, #6F7BF7 40%, #8BD3C7 100%)",
        }}
      >
        {/* Background decoration */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full"
          style={{
            background: "rgba(255,255,255,0.06)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-20 left-0 w-52 h-52 rounded-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            transform: "translateX(-40%)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Sparkles size={20} className="text-white" />
          </div>
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer"
            style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}
          >
            ZenGraph
          </span>
        </div>

        {/* Hero image */}
        <div className="relative z-10 rounded-3xl overflow-hidden my-6" style={{ height: "260px" }}>
          <img
            src={HERO_IMG}
            alt="Meditation"
            className="w-full h-full object-cover"
            style={{ opacity: 0.85 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(79,62,212,0.6) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Tagline + features */}
        <div className="relative z-10">
          <h2
            style={{ color: "#FFFFFF", fontSize: "26px", fontWeight: 800, lineHeight: 1.3 }}
            className="mb-2"
          >
            Find Your Inner
            <br />
            Balance, Anywhere.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px" }} className="mb-6">
            AI-powered meditation tailored to your mood, goals, and schedule.
          </p>

          <div className="flex flex-col gap-2.5">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 size={18} style={{ color: "#8BD3C7", flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "14px" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right content panel ── */}
      <div
        className="flex-1 overflow-y-auto flex items-center justify-center p-8 lg:p-16"
        style={{ background: "#FFFFFF", minHeight: "100vh" }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Mobile-only logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)" }}
            >
              <Sparkles size={18} className="text-white" />
            </div>
            <span style={{ color: "#1F2933", fontSize: "20px", fontWeight: 800 }}>
              ZenGraph
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

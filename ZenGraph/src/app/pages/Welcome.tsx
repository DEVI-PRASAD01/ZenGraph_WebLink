import { useNavigate } from "react-router";
import { Sparkles, Zap, Brain, TrendingUp, Play, Star, ArrowRight, CheckCircle2 } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1557929878-b358f3bdbdd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjBuYXR1cmUlMjBjYWxtfGVufDF8fHx8MTc3MzExNzg0N3ww&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  {
    icon: Zap,
    color: "#6F7BF7",
    bg: "#EEF0FF",
    title: "AI Personalization",
    desc: "Sessions tailored to your mood, goals, and energy levels — every single day.",
  },
  {
    icon: Brain,
    color: "#4AAFA9",
    bg: "#E8F8F5",
    title: "Mood Tracking",
    desc: "Log your emotional state before and after sessions to see real progress over time.",
  },
  {
    icon: TrendingUp,
    color: "#8B5CF6",
    bg: "#F0EEFF",
    title: "Progress Analytics",
    desc: "Visual dashboards show your calm score, streak, and wellness improvements.",
  },
];

const testimonials = [
  { name: "Beta Tester", stars: 5, text: "ZenGraph changed my mornings completely. The AI recommendations are spot-on." },
  { name: "Early Access User", stars: 5, text: "Finally a meditation app that adapts to me. This is exactly what I needed." },
  { name: "Wellness Partner", stars: 5, text: "The analytics make it feel like a real wellness journey. Truly impressive AI." },
];

const stats = [
  { value: "100%", label: "Personalized" },
  { value: "0.0s", label: "Latency" },
  { value: "24/7", label: "AI Support" },
  { value: "∞", label: "Possibilities" },
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
    >
      {/* ── Top Nav ── */}
      <nav
        className="flex items-center justify-between px-6 lg:px-16 py-5 sticky top-0 z-50"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)" }}
          >
            <Sparkles size={18} className="text-white" />
          </div>
          <span style={{ color: "#1F2933", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            ZenGraph
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Testimonials"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{ color: "#6B7280", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}
              className="hover:text-gray-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/auth/login")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 600,
              boxShadow: "0 4px 16px rgba(111,123,247,0.35)",
            }}
          >
            Login
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="px-6 lg:px-16 py-16 lg:py-24"
        style={{ background: "linear-gradient(160deg, #FAFBFF 0%, #F0F4FF 50%, #E8F8F5 100%)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: "#EEF0FF", border: "1px solid #D0D5FF" }}
            >
              <Zap size={14} style={{ color: "#6F7BF7" }} />
              <span style={{ color: "#6F7BF7", fontSize: "13px", fontWeight: 600 }}>
                AI-Powered Meditation Platform
              </span>
            </div>

            <h1
              style={{
                color: "#1F2933",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
              }}
              className="mb-5"
            >
              Find Your Inner
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Balance, Daily.
              </span>
            </h1>

            <p
              style={{ color: "#6B7280", fontSize: "18px", lineHeight: 1.7 }}
              className="mb-8"
            >
              ZenGraph's AI analyzes your mood, goals, and stress patterns to craft
              meditation sessions that actually work — personalized for you, every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => navigate("/auth/signup")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl transition-all duration-200 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)",
                  color: "#FFFFFF",
                  fontSize: "17px",
                  fontWeight: 700,
                  boxShadow: "0 8px 28px rgba(111,123,247,0.4)",
                }}
              >
                Sign Up
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/auth/login")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl transition-all duration-200"
                style={{
                  background: "#FFFFFF",
                  color: "#1F2933",
                  fontSize: "17px",
                  fontWeight: 600,
                  border: "2px solid #E5E7EB",
                }}
              >
                <Play size={16} style={{ color: "#6F7BF7" }} />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: "#F5E6A6", color: "#D4A017", border: "1px solid #F0D48D" }}
              >
                Limited Beta Access
              </div>
              <p style={{ color: "#6B7280", fontSize: "14px", fontWeight: 500 }}>
                Join the revolution in mindfulness.
              </p>
            </div>
          </div>

          {/* Right: App preview card */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div
              className="relative"
              style={{ maxWidth: "400px", width: "100%" }}
            >
              {/* Shadow glow */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)",
                  filter: "blur(40px)",
                  opacity: 0.25,
                  transform: "scale(0.9) translateY(10%)",
                }}
              />
              {/* Card */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 24px 60px rgba(111,123,247,0.2)" }}
              >
                <img
                  src={HERO_IMG}
                  alt="Meditation"
                  className="w-full"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(111,123,247,0.85) 0%, transparent 50%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl mb-3"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  >
                    <Zap size={12} style={{ color: "#FCD34D" }} />
                    <span style={{ color: "#FFFFFF", fontSize: "12px", fontWeight: 600 }}>
                      AI Recommended
                    </span>
                  </div>
                  <h3 style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}>
                    Zen Harmony
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
                    Breathwork · 10 min · Beginner
                  </p>
                  <div className="mt-3 flex gap-2">
                    {["😰 Anxious", "Stress Relief", "Cortisol ↓35%"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold"
                        style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating stat badge */}
              <div
                className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                <p style={{ color: "#6F7BF7", fontSize: "22px", fontWeight: 800 }}>8.4</p>
                <p style={{ color: "#6B7280", fontSize: "12px" }}>Calm Score</p>
              </div>

              {/* Floating streak badge */}
              <div
                className="absolute -bottom-4 -left-4 px-4 py-3 rounded-2xl flex items-center gap-2"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                <span style={{ fontSize: "22px" }}>🔥</span>
                <div>
                  <p style={{ color: "#1F2933", fontSize: "15px", fontWeight: 800 }}>7 Days</p>
                  <p style={{ color: "#6B7280", fontSize: "12px" }}>Current Streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-6 lg:px-16 py-12" style={{ background: "#1F2933" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="px-6 lg:px-16 py-20"
        style={{ background: "#F9FAFB" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: "#EEF0FF" }}
            >
              <Sparkles size={14} style={{ color: "#6F7BF7" }} />
              <span style={{ color: "#6F7BF7", fontSize: "13px", fontWeight: 600 }}>
                Why ZenGraph
              </span>
            </div>
            <h2
              style={{ color: "#1F2933", fontSize: "36px", fontWeight: 800, letterSpacing: "-0.5px" }}
              className="mb-3"
            >
              Smarter than your average
              <br />
              meditation app
            </h2>
            <p style={{ color: "#6B7280", fontSize: "17px" }}>
              We combine cutting-edge AI with proven mindfulness techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-7 rounded-3xl"
                  style={{ background: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: f.bg }}
                  >
                    <Icon size={24} style={{ color: f.color }} />
                  </div>
                  <h3
                    style={{ color: "#1F2933", fontSize: "18px", fontWeight: 700 }}
                    className="mb-2"
                  >
                    {f.title}
                  </h3>
                  <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        className="px-6 lg:px-16 py-20"
        style={{ background: "#FFFFFF" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            style={{ color: "#1F2933", fontSize: "36px", fontWeight: 800, letterSpacing: "-0.5px" }}
            className="mb-3"
          >
            Three steps to inner calm
          </h2>
          <p style={{ color: "#6B7280", fontSize: "17px" }} className="mb-14">
            ZenGraph makes it effortless to build a consistent practice.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", emoji: "🎯", title: "Set Your Goals", desc: "Tell us what you want to achieve — less stress, better focus, deeper sleep." },
              { step: "02", emoji: "🤖", title: "AI Crafts Your Plan", desc: "Our AI analyzes your mood and creates a personalized session just for you." },
              { step: "03", emoji: "📈", title: "Track & Grow", desc: "Watch your calm score rise and your stress patterns improve week over week." },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] w-8 h-0.5 z-10"
                    style={{ background: "linear-gradient(90deg, #6F7BF7, #8BD3C7)" }}
                  />
                )}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #EEF0FF, #E8F8F5)" }}
                >
                  {item.emoji}
                </div>
                <p style={{ color: "#D1D5DB", fontSize: "13px", fontWeight: 700 }} className="mb-1">
                  STEP {item.step}
                </p>
                <h3 style={{ color: "#1F2933", fontSize: "18px", fontWeight: 700 }} className="mb-2">
                  {item.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        className="px-6 lg:px-16 py-20"
        style={{ background: "#F9FAFB" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center mb-12"
            style={{ color: "#1F2933", fontSize: "36px", fontWeight: 800, letterSpacing: "-0.5px" }}
          >
            Loved by meditators worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-3xl"
                style={{ background: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={16} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ color: "#4B5563", fontSize: "15px", lineHeight: 1.65 }} className="mb-5">
                  "{t.text}"
                </p>
                <p style={{ color: "#1F2933", fontSize: "14px", fontWeight: 700 }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="px-6 lg:px-16 py-20">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)",
            boxShadow: "0 20px 60px rgba(111,123,247,0.35)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full"
            style={{ background: "rgba(255,255,255,0.08)", transform: "translate(20%, -40%)" }}
          />
          <span style={{ fontSize: "48px" }} className="block mb-4">✨</span>
          <h2
            style={{ color: "#FFFFFF", fontSize: "36px", fontWeight: 900, letterSpacing: "-0.5px" }}
            className="mb-3"
          >
            Start your journey today
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "17px" }} className="mb-8">
            Be among the first to experience the future of AI-powered mindfulness.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {["Personalized AI sessions", "Zen Pro features", "Cancel anytime"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <CheckCircle2 size={16} style={{ color: "rgba(255,255,255,0.8)" }} />
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>{f}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/auth/login")}
            className="px-10 py-4 rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 mx-auto"
            style={{
              background: "#FFFFFF",
              color: "#6F7BF7",
              fontSize: "17px",
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <Play size={18} fill="#6F7BF7" />
            Watch Demo
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 lg:px-16 py-8"
        style={{ borderTop: "1px solid #F3F4F6" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)" }}
            >
              <Sparkles size={14} className="text-white" />
            </div>
            <span style={{ color: "#1F2933", fontSize: "16px", fontWeight: 700 }}>ZenGraph</span>
          </div>
          <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
            © 2026 ZenGraph · AI Meditation Platform · All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Support"].map((link) => (
              <a
                key={link}
                href="#"
                style={{ color: "#9CA3AF", fontSize: "14px", textDecoration: "none" }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

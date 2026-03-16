import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MoodButton, SessionCard, ProgressCard } from "../components/zen/ZenComponents";
import { Zap, Clock, TrendingUp, Loader2 } from "lucide-react";
import { sessionHelper, authApi, sessionApi } from "../services/sessionApi";
import type { DashboardData } from "../services/sessionApi";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "🤩", label: "Excited" },
];

const quickSessions = [
  { title: "Morning Calm", duration: "5 min", technique: "Breathwork" },
  { title: "Focus Flow", duration: "10 min", technique: "Mindfulness" },
  { title: "Stress Reset", duration: "8 min", technique: "Body Scan" },
];

export default function Home() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const userName = sessionHelper.getUserName() ?? "Friend";
  const userId = sessionHelper.getUserId();

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    if (!userId) return;

    // Map mood labels to scores (1-10)
    const moodScores: Record<string, number> = {
      "Happy": 8,
      "Sad": 3,
      "Angry": 2,
      "Anxious": 4,
      "Neutral": 6,
      "Excited": 10
    };

    const score = moodScores[mood] || 5;

    try {
      await sessionApi.checkin(Number(userId), score);
      // Optional: Refresh dashboard to see new graph data
      const newData = await authApi.getDashboard(Number(userId));
      setDashboard(newData);
    } catch (err) {
      console.error("Failed to log mood:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      authApi.getDashboard(Number(userId))
        .then(data => {
          setDashboard(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch dashboard:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-[#6F7BF7] animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Hero Welcome Section */}
      <div
        className="relative overflow-hidden rounded-[48px] p-12 text-white shadow-2xl shadow-indigo-100"
        style={{ background: "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)" }}
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-bold uppercase tracking-tight">
                LEVEL: {dashboard?.level || 1} ⭐
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tighter">Welcome back, {userName}.</h1>
            <p className="text-xl text-white/80 max-w-md mb-8">Ready to find your inner calm? Choose how you feel today to get started.</p>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {moods.map((m) => (
                <MoodButton
                  key={m.label}
                  emoji={m.emoji}
                  label={m.label}
                  selected={selectedMood === m.label}
                  onClick={() => handleMoodSelect(m.label)}
                />
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-pulse">
              <span className="text-9xl">🧘</span>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Columns: Main Content */}
        <div className="xl:col-span-2 space-y-10">

          {/* AI Recommendation Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-[#1F2933]">Personalized For You</h2>
              <button
                onClick={() => navigate("/session/mood")}
                className="text-[#6F7BF7] font-bold hover:underline"
              >
                Customize →
              </button>
            </div>

            <div
              className="group relative overflow-hidden rounded-[40px] p-10 bg-white border border-gray-100 shadow-sm hover:shadow-xl duration-500 cursor-pointer"
              onClick={() => navigate("/session/goals")}
            >
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-32 h-32 rounded-3xl bg-[#EEF0FF] flex items-center justify-center text-5xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  🌬️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={18} className="text-[#6F7BF7]" />
                    <span className="text-[#6F7BF7] text-xs font-black uppercase tracking-widest">AI Recommendation</span>
                  </div>
                  <h3 className="text-4xl font-black text-[#1F2933] mb-3">Zen Harmony</h3>
                  <p className="text-gray-500 text-lg mb-6 leading-relaxed">A specialized breathwork session calibrated for your current mood. Reduces cortisol and improves focus in just 10 minutes.</p>

                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-gray-400" />
                      <span className="text-gray-900 font-bold">10 MINS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-gray-400" />
                      <span className="text-gray-900 font-bold">INTERMEDIATE</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 rounded-full bg-[#6F7BF7] text-white flex items-center justify-center text-3xl shadow-lg shadow-indigo-100">
                    →
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Sessions Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#1F2933]">Quick Sessions</h2>
              <button onClick={() => navigate("/app/library")} className="text-gray-400 hover:text-gray-600 font-bold text-sm">VIEW ALL</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickSessions.map((s) => (
                <SessionCard
                  key={s.title}
                  title={s.title}
                  duration={s.duration}
                  technique={s.technique}
                  onPress={() => navigate("/session/plan")}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-black text-[#1F2933] mb-6">Your Vitality</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProgressCard
                label="Level"
                value={dashboard?.level || 1}
                unit="Exp"
                progress={(dashboard?.total_sessions || 0) % 5 * 20}
                color="linear-gradient(135deg, #6F7BF7, #8BD3C7)"
              />
              <ProgressCard
                label="Time"
                value={dashboard?.total_hours || 0}
                unit="hrs"
                progress={Math.min((dashboard?.total_hours || 0) * 10, 100)}
                color="linear-gradient(135deg, #F5E6A6, #F4C47A)"
              />
              <ProgressCard
                label="Sessions"
                value={dashboard?.total_sessions || 0}
                unit="total"
                progress={Math.min((dashboard?.total_sessions || 0) * 5, 100)}
                color="linear-gradient(135deg, #8BD3C7, #4AAFA9)"
              />
              <ProgressCard
                label="Profile"
                value={dashboard?.profile_completed ? "100" : "50"}
                unit="%"
                progress={dashboard?.profile_completed ? 100 : 50}
                color="linear-gradient(135deg, #F7B8D3, #E87DB0)"
              />
            </div>
          </section>

          {/* Activity Chart (Mood Trend) */}
          <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-[#6F7BF7]" />
              <span className="text-[#1F2933] font-black text-xl">Mood Trend</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {(dashboard?.graph_data || [40, 70, 55, 90, 60, 100, 45]).map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${i === (dashboard?.graph_data?.length || 7) - 1 ? 'bg-[#6F7BF7]' : 'bg-[#EEF0FF]'}`}
                    style={{ height: `${val * 10}%` }} // Mood score is usually 1-10
                  />
                  <span className={`text-[10px] font-bold ${i === (dashboard?.graph_data?.length || 7) - 1 ? 'text-[#6F7BF7]' : 'text-gray-300'}`}>
                    {['T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now'][i] || i}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>

  );
}
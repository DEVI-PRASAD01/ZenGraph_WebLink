import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Flame, Clock, Brain, Lock, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useSubscription } from "../hooks/useSubscription";
import { useNavigate } from "react-router";
import { analyticsApi, sessionHelper, type Period, type EmotionPoint, type CompletionMap } from "../services/sessionApi";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl shadow-lg" style={{ background: "#1F2933" }}>
        <p style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600 }}>
          {label}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { isPremium } = useSubscription();
  const navigate = useNavigate();

  const userId = Number(sessionHelper.getUserId() ?? 1);
  const [period, setPeriod] = useState<Period>("week");

  const [progress, setProgress] = useState<{ calm_score: number; mindful_minutes: number; stress_reduced: number } | null>(null);
  const [moodData, setMoodData] = useState<{ day: string; score: number }[]>([]);
  const [completion, setCompletion] = useState<CompletionMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAll() {
    setLoading(true);
    setError("");
    try {
      const [prog, trend, comp] = await Promise.all([
        analyticsApi.progress(userId, period),
        analyticsApi.emotionTrend(userId, period),
        analyticsApi.completionMap(userId),
      ]);

      setProgress(prog);

      // Format emotion trend for recharts — use short date label
      const formatted = (trend as EmotionPoint[]).map((pt) => ({
        day: new Date(pt.date).toLocaleDateString("en-US", { weekday: "short" }),
        score: pt.score,
      }));
      setMoodData(formatted.length ? formatted : []);
      setCompletion(comp);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, [period, userId]);

  // Build weekly bar chart from completion map
  const completionData = DAYS.map((d, i) => ({
    day: d,
    sessions: completion[String(i)] ?? 0,
  }));

  const stats = [
    { label: "Mindful Minutes", value: progress ? String(progress.mindful_minutes) : "—", icon: Clock, color: "#6F7BF7", bg: "#EEF0FF" },
    { label: "Calm Score", value: progress ? String(progress.calm_score) : "—", icon: TrendingUp, color: "#8B5CF6", bg: "#F0EEFF" },
    { label: "Stress Reduced", value: progress ? `${progress.stress_reduced}%` : "—", icon: Brain, color: "#4AAFA9", bg: "#E8F8F5" },
    { label: "Sessions This Wk", value: Object.values(completion).reduce((a, b) => a + b, 0).toString(), icon: Flame, color: "#F97316", bg: "#FFF4ED" },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-5xl font-black text-[#1F2933] mb-2 tracking-tight">Your Analytics</h1>
          <p className="text-gray-500 font-medium text-lg">Track your journey to mindfulness and productivity.</p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-5 py-2 rounded-full font-bold capitalize transition-all duration-200"
              style={{
                background: period === p ? "#6F7BF7" : "#F3F4F6",
                color: period === p ? "#FFFFFF" : "#6B7280",
                fontSize: "13px",
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={fetchAll}
            className="ml-2 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#F3F4F6" }}
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#6F7BF7]" : "text-gray-400"} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
          <AlertCircle size={18} style={{ color: "#EF4444" }} />
          <span style={{ color: "#EF4444", fontSize: "14px" }}>{error}</span>
          <button onClick={fetchAll} className="ml-auto font-bold" style={{ color: "#EF4444", fontSize: "13px" }}>Retry</button>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: s.bg }}>
                {loading ? <Loader2 size={28} className="animate-spin" style={{ color: s.color }} /> : <Icon size={28} style={{ color: s.color }} />}
              </div>
              <p className="text-[#1F2933] text-4xl font-black mb-1">{loading ? "…" : s.value}</p>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

        {/* Mood History */}
        <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-[#1F2933]">Mood Trend</h3>
              <p className="text-gray-400 font-medium italic text-sm">Emotional score over {period}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <TrendingUp size={20} className="text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-[#6F7BF7]" />
            </div>
          ) : moodData.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center">
              <p className="text-gray-400 font-medium">No mood check-ins found for this period.</p>
              <p className="text-gray-300 text-sm mt-1">Complete a session and log your mood to see trends.</p>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F7FA" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 700 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#F1F5F9", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="score" stroke="#6F7BF7" strokeWidth={6}
                    dot={{ fill: "#6F7BF7", r: 6, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 10, fill: "#6F7BF7", stroke: "#fff", strokeWidth: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Weekly Session Completion */}
        <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-[#1F2933]">Weekly Sessions</h3>
              <p className="text-gray-400 font-medium italic text-sm">Sessions completed per day this week</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Clock size={20} className="text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-[#8BD3C7]" />
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} barSize={44}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 700 }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
                  <Bar dataKey="sessions" fill="#8BD3C7" radius={[16, 16, 8, 8]} animationBegin={200} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section (premium) */}
      <div className="bg-gray-900 rounded-[56px] p-12 text-white shadow-3xl relative overflow-hidden">
        {!isPremium && (
          <div className="absolute inset-0 z-20 bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-8">
            <div className="bg-white rounded-[40px] p-10 max-w-lg w-full text-center shadow-2xl">
              <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6 mx-auto">
                <Lock size={36} className="text-[#6F7BF7]" />
              </div>
              <h3 className="text-3xl font-black text-[#1F2933] mb-4">Unlock Intelligent Insights</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                Our advanced AI analyzes your biometric trends to provide personalized wellness breakthroughs. Available exclusively for Zen Pro members.
              </p>
              <button
                onClick={() => navigate("/app/subscription/plans")}
                className="w-full py-5 rounded-[24px] bg-[#6F7BF7] text-white font-black text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-indigo-100"
              >
                Upgrade to Zen Pro
              </button>
            </div>
          </div>
        )}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6F7BF7]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Brain size={24} className="text-[#8BD3C7]" />
              <span className="text-[#8BD3C7] font-black uppercase tracking-widest text-xs">Intelligent Analytics</span>
            </div>
            <h3 className="text-4xl font-black mb-8 leading-tight">Your mindfulness consistency is in the top 5% this month.</h3>
            <p className="text-gray-400 text-lg mb-10">Based on your sessions, we recommend focusing on 'Deep Sleep' techniques this week to balance your increased cortisol levels on Wednesdays.</p>
            <button className="px-8 py-4 rounded-3xl bg-[#6F7BF7] text-white font-black hover:bg-[#5E6AE6] transition-all">Get Weekly Plan</button>
          </div>
          <div className="space-y-8">
            {[
              { label: "Stress Reduction", value: progress?.stress_reduced ?? 72, color: "#6F7BF7" },
              { label: "Calm Improvement", value: progress?.calm_score ?? 85, color: "#8BD3C7" },
              { label: "Focus Score", value: 68, color: "#8B5CF6" },
              { label: "Consistency", value: 91, color: "#F97316" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between mb-3 items-end">
                  <span className="font-black text-lg tracking-tight">{m.label}</span>
                  <span className="text-[#8BD3C7] font-black text-xl">{m.value}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    style={{ width: `${Math.min(m.value, 100)}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
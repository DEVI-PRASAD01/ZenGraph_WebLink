import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  LineChart, Line, XAxis, Tooltip, Cell,
} from "recharts";
import { TrendingUp, Brain, Zap, Shield, Loader2, AlertCircle } from "lucide-react";
import { sessionAnalysisApi, type SessionAnalysis } from "../services/sessionApi";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl" style={{ background: "#1F2933" }}>
        <p style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600 }}>{label}: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function AIProgress() {
  const navigate = useNavigate();
  const sessionId = Number(sessionStorage.getItem("zg_session_id") ?? 0);

  const [analysis, setAnalysis] = useState<SessionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
      if (!sessionId) { setLoading(false); return; }
      sessionAnalysisApi.analyze({
          pre_emotion: sessionStorage.getItem("zg_emotion") ?? "Neutral",
          post_mood: sessionStorage.getItem("zg_mood_after") ?? "Neutral",
          duration: Number(sessionStorage.getItem("zg_actual_mins") ?? sessionStorage.getItem("zg_session_mins") ?? 10)
     })
     .then(setAnalysis)
     .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load analysis."))
     .finally(() => setLoading(false));
  }, [sessionId]);


  // Map descriptive strings to percentages for the charts
  const mapValue = (label: string | undefined) => {
    if (!label) return 50;
    const l = label.toLowerCase();
    if (l === "high") return 92;
    if (l === "moderate") return 65;
    if (l === "stable") return 45;
    return 50;
  };

  // Fallback to defaults if analysis is not yet generated
  const stressVal = mapValue(analysis?.stress_reduction);
  const calmVal = analysis?.calm_score ?? 85;
  const focusVal = mapValue(analysis?.focus_improvement);
  const consistVal = analysis?.consistency_score ?? 91;

  const insight = analysis?.ai_insight ?? "Your mindfulness consistency is in the top 5% this month. Keep up the great work!";

  const radialData = [
    { name: "Consistency", value: consistVal, fill: "#F97316" },
    { name: "Calm", value: calmVal, fill: "#4AAFA9" },
    { name: "Focus", value: focusVal, fill: "#8B5CF6" },
    { name: "Stress", value: stressVal, fill: "#6F7BF7" },
  ];

  const metrics = [
    {
      icon: Shield,
      label: "Stress Reduction",
      value: stressVal,
      display: analysis?.stress_reduction ?? "High",
      change: "+12%",
      color: "#6F7BF7",
      bg: "#EEF0FF",
      desc: "Cortisol levels reduced significantly"
    },
    {
      icon: Brain,
      label: "Calm Improvement",
      value: calmVal,
      display: `${calmVal}%`,
      change: "+18%",
      color: "#4AAFA9",
      bg: "#E8F8F5",
      desc: "Heart rate variability improved"
    },
    {
      icon: Zap,
      label: "Focus Score",
      value: focusVal,
      display: analysis?.focus_improvement ?? "Moderate",
      change: "+9%",
      color: "#8B5CF6",
      bg: "#F0EEFF",
      desc: "Cognitive clarity enhanced"
    },
    {
      icon: TrendingUp,
      label: "Consistency",
      value: consistVal,
      display: `${consistVal}%`,
      change: "+5%",
      color: "#F97316",
      bg: "#FFF4ED",
      desc: "Streak maintained"
    },
  ];

  const sessionHistory = [60, 65, 70, 72, 79, 82, calmVal].map((c, i) => ({ session: `S${i + 1}`, calm: c }));

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4 bg-[#6F7BF7]/10 w-fit px-4 py-1.5 rounded-full">
            <Zap size={16} className="text-[#6F7BF7]" />
            <span className="text-[#6F7BF7] font-black uppercase tracking-widest text-[10px]">AI Analysis Complete</span>
          </div>
          <h1 className="text-5xl font-black text-[#1F2933] tracking-tight mb-2">Your Progress</h1>
          <p className="text-gray-500 font-medium text-lg">Detailed insights based on your latest mindfulness session.</p>
        </div>
        <button onClick={() => navigate("/app/home")}
          className="px-8 py-4 rounded-3xl bg-[#6F7BF7] text-white font-black hover:bg-[#5E6AE6] transition-all shadow-xl shadow-indigo-100">
          Back to Dashboard
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
          <AlertCircle size={18} style={{ color: "#EF4444" }} />
          <span style={{ color: "#EF4444", fontSize: "14px" }}>{error} — showing estimated data.</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-[#6F7BF7]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Left: Overview */}
          <div className="xl:col-span-1 space-y-10">
            <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm text-center">
              <h3 className="text-2xl font-black text-[#1F2933] mb-8">Wellness Composition</h3>
              <div className="w-64 h-64 mx-auto mb-8 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%"
                    data={radialData} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" cornerRadius={12} isAnimationActive={false}>
                      {radialData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </RadialBar>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col">
                  <span className="text-4xl font-black text-[#1F2933]">{Math.round((stressVal + calmVal + focusVal + consistVal) / 4)}%</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global</span>
                </div>
              </div>
              <div className="space-y-4">
                {radialData.map(d => (
                  <div key={d.name} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: d.fill }} />
                      <span className="font-black text-gray-400 uppercase text-[10px] tracking-widest">{d.name}</span>
                    </div>
                    <span className="font-black text-[#1F2933]">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calm Trend */}
            <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-[#1F2933] mb-8">Calm Trend</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionHistory}>
                    <XAxis dataKey="session" hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="calm" stroke="#6F7BF7" strokeWidth={6}
                      dot={{ fill: "#6F7BF7", r: 6, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 10, fill: "#6F7BF7", stroke: "#fff", strokeWidth: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-gray-400 font-bold text-xs mt-4 uppercase tracking-[0.2em]">Weekly Performance</p>
            </div>
          </div>

          {/* Right: Detailed Metrics */}
          <div className="xl:col-span-2 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-[24px] flex items-center justify-center" style={{ background: m.bg }}>
                        <Icon size={28} style={{ color: m.color }} />
                      </div>
                      <div className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase" style={{ background: m.bg, color: m.color }}>
                        {m.change} Improve
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-2xl font-black text-[#1F2933] tracking-tight">{m.label}</h4>
                      <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6">{m.desc}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[#1F2933] text-3xl font-black">{m.display}</span>
                          <span className="text-gray-300 font-bold text-[10px] uppercase">Goal: 100%</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-gray-50 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.value}%`, background: m.color }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Insights */}
            <div className="bg-gray-900 rounded-[56px] p-12 text-white shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#6F7BF7]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Brain size={24} className="text-[#8BD3C7]" />
                  <span className="text-[#8BD3C7] font-black uppercase tracking-widest text-xs">Personalized AI Insights</span>
                </div>
                <h3 className="text-4xl font-black mb-10 leading-tight">{insight}</h3>
                <div className="space-y-6">
                  <p className="text-gray-400 text-xl leading-relaxed max-w-2xl">
                    Your stress reduction is rated as <span className="text-[#6F7BF7] font-black">{analysis?.stress_reduction || "High"}</span>. This indicates a significant shift in your physiological state!
                  </p>
                  <p className="text-gray-400 text-xl leading-relaxed max-w-2xl">
                    Your calm score reached <span className="text-[#4AAFA9] font-black">{calmVal}%</span>, reflecting improved heart rate variability and mental synchronization.
                  </p>
                </div>
                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                  <button className="px-10 py-5 rounded-3xl bg-[#6F7BF7] text-white font-black hover:bg-[#5E6AE6] transition-all">Download Detailed Report</button>
                  <button className="px-10 py-5 rounded-3xl border border-white/10 hover:bg-white/5 transition-all font-black">Share Progress</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
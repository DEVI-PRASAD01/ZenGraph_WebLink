import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Clock, Wind, Volume2, Lightbulb, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { recommendationApi, sessionApi, planApi, sessionHelper, type RecommendPlanResponse } from "../services/sessionApi";

// Mood-to-session mapping for dynamic fallback
const REC_MAP: Record<string, RecommendPlanResponse> = {
  Happy: {
    session_name: "Gratitude Flow",
    message: "Amplify your joy and cultivate a lasting sense of thankfulness.",
    meditation_type: "Visualization",
    duration: 12,
    guidance_style: "Energizing",
    match_score: 100,
  },
  Sad: {
    session_name: "Inner Light",
    message: "A gentle session to comfort the spirit and find your inner peace.",
    meditation_type: "Breathwork",
    duration: 15,
    guidance_style: "Gentle & Compassionate",
    match_score: 100,
  },
  Angry: {
    session_name: "Heat Release",
    message: "Release tension and transform frustration into calm awareness.",
    meditation_type: "Focused Attention",
    duration: 10,
    guidance_style: "Calm & Grounding",
    match_score: 100,
  },
  Anxious: {
    session_name: "Grounding Earth",
    message: "Anchor yourself in the present moment and ease racing thoughts.",
    meditation_type: "Body Scan",
    duration: 20,
    guidance_style: "Soothing",
    match_score: 100,
  },
  Excited: {
    session_name: "Focus Fountain",
    message: "Channel your high energy into creative focus and clarity.",
    meditation_type: "Concentration",
    duration: 8,
    guidance_style: "Direct",
    match_score: 100,
  },
  Neutral: {
    session_name: "Pure Awareness",
    message: "A balanced session to maintain clarity and presence.",
    meditation_type: "Zen",
    duration: 10,
    guidance_style: "Minimalist",
    match_score: 100,
  },
};

export default function AIRecommendation() {
  const navigate = useNavigate();
  const userId = Number(sessionHelper.getUserId() ?? 1);
  const emotion = sessionStorage.getItem("zg_emotion") ?? "your mood";

  const [rec, setRec] = useState<RecommendPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  const load = () => {
    setLoading(true); setError("");
    const goal = sessionStorage.getItem("zg_goal") ?? "Reduce Stress";
    const experience = sessionStorage.getItem("zg_experience") ?? "Beginner";
    const emotionStr = sessionStorage.getItem("zg_emotion") ?? "Neutral";

    recommendationApi.generate({
      user_id: userId,
      goal_type: goal,
      experience_level: experience,
      predicted_emotion: emotionStr
    })
      .then(res => {
        setRec({
          ...res,
          session_name: res.session_name || res.meditation_type,
          match_score: res.match_score || 95
        });
      })
      .catch((err) => {
        console.error("AI Recommendation failed:", err);
        const fallback = REC_MAP[emotionStr] || REC_MAP["Neutral"];
        setRec(fallback);
        setError("Recommendation engine unavailable — showing localized fallback.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [userId]);

  const handleBegin = async () => {
    if (!rec) return;
    setStarting(true);
    try {
      const goal = sessionStorage.getItem("zg_goal") ?? "Reduce Stress";
      const experience = sessionStorage.getItem("zg_experience") ?? "Beginner";
      const emotionStr = sessionStorage.getItem("zg_emotion") ?? "Neutral";

      // Step 1: Save the recommendation results as a persistent AIPlan
      const planRes = await planApi.generate({
        user_id: userId,
        goal: goal,
        mood: emotionStr,
        level: experience
      });

      // Step 2: Start the session using the new plan_id
      const sessionRecord = await sessionApi.start({
        user_id: userId,
        plan_id: planRes.plan_id
      });

      sessionStorage.setItem("zg_session_id", String(sessionRecord.session_id));
      sessionStorage.setItem("zg_session_name", sessionRecord.session_name);
      sessionStorage.setItem("zg_session_mins", String(sessionRecord.planned_duration));

      // Store recommendation metadata for PlanDetails
      sessionStorage.setItem("zg_rec_type", rec.meditation_type);
      sessionStorage.setItem("zg_rec_style", rec.guidance_style);
      sessionStorage.setItem("zg_rec_score", String(rec.match_score ?? 100));

      navigate("/session/plan");
    } catch (err: unknown) {
      console.error("Failed to start AI session:", err);
      setError(err instanceof Error ? err.message : "Failed to start session. Please try again.");
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="mb-2" style={{ color: "#1F2933", fontSize: "36px", fontWeight: 800 }}>Your AI-Generated Path</h1>
          <p style={{ color: "#6B7280", fontSize: "18px" }}>
            Based on your <strong>{emotion}</strong> — here's your personalized session.
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium text-gray-600 transition-colors">
          Change Mood
        </button>
      </div>

      {/* Soft warning if using fallback */}
      {error && (
        <div className="flex items-center gap-3 mb-6 px-5 py-3 rounded-2xl" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <AlertCircle size={16} style={{ color: "#D97706", flexShrink: 0 }} />
          <span style={{ color: "#92400E", fontSize: "13px", flex: 1 }}>{error}</span>
          <button onClick={load} className="flex items-center gap-1 font-bold text-sm" style={{ color: "#D97706" }}>
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-[#6F7BF7] mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Generating your personalized recommendation...</p>
          </div>
        </div>
      ) : rec && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <div className="rounded-[40px] p-10 mb-8 shadow-xl shadow-indigo-100"
              style={{ background: "linear-gradient(145deg,#F0EBFF 0%,#E2DAFF 100%)" }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-8" style={{ background: "rgba(111,123,247,0.12)" }}>
                <Zap size={16} className="text-[#6F7BF7]" />
                <span className="text-[#6F7BF7] text-sm font-bold uppercase">Optimized for your mood</span>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="mb-4" style={{ color: "#1F2933", fontSize: "52px", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px" }}>
                    {rec.session_name}
                  </h2>
                  <p style={{ color: "#4B5563", fontSize: "18px", lineHeight: 1.6 }}>{rec.message}</p>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center bg-white/60"
                  style={{ width: "160px", height: "160px", borderRadius: "56px", border: "2px solid #8BD3C7" }}>
                  <div style={{ fontSize: "72px" }}>🧘</div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Clock, label: "Duration", val: `${rec.duration} Minutes`, color: "#F97316" },
                { icon: Wind, label: "Technique", val: rec.meditation_type, color: "#4AAFA9" },
                { icon: Volume2, label: "Voice", val: "Guided", color: "#6F7BF7" },
              ].map((s) => (
                <div key={s.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <s.icon size={24} style={{ color: s.color, marginBottom: "12px" }} />
                  <p style={{ color: "#9CA3AF", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</p>
                  <p style={{ color: "#1F2933", fontSize: "19px", fontWeight: 700 }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#FFFBEA] p-8 rounded-[32px] border border-[#FEF3C7]">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb size={24} className="text-[#F59E0B]" />
                <h3 className="text-[#1F2933] text-xl font-bold">Why this session?</h3>
              </div>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Tailored with <strong>{rec.guidance_style}</strong> — this session helps restore mental balance based on your goals.
              </p>
              {["Restore mental focus", "Calm rising tension", "Prepare for deep work"].map((b) => (
                <div key={b} className="flex items-center gap-3 mb-3">
                  <span>✨</span>
                  <span className="text-gray-700 font-medium">{b}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center p-8 bg-blue-50/50 rounded-[32px] border border-blue-100/50 gap-4">
              <button
                onClick={handleBegin}
                disabled={starting}
                className="w-full py-5 rounded-[24px] bg-[#6F7BF7] text-white flex items-center justify-center gap-3 hover:bg-[#5E6AE6] transition-all shadow-xl shadow-indigo-100 active:scale-95"
              >
                {starting
                  ? <><Loader2 size={18} className="animate-spin" /> Starting...</>
                  : <><span className="text-xl font-extrabold uppercase">Begin Session</span><span>▶</span></>}
              </button>
              <button onClick={() => navigate("/app/home")} className="text-gray-400 font-medium hover:text-gray-600 transition-colors">
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
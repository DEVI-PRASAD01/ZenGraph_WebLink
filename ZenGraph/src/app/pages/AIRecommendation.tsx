import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Clock, Wind, Loader2, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";
import { recommendationApi, sessionApi, sessionHelper, type RecommendPlanResponse } from "../services/sessionApi";

const REC_MAP: Record<string, RecommendPlanResponse> = {
  Happy: {
    session_name: "Gratitude Flow",
    message: "Amplify your joy and cultivate a lasting sense of thankfulness.",
    meditation_type: "Visualization",
    technique: "Gratitude Visualization",
    duration: 12,
    guidance_style: "Guided",
    match_score: 100,
  },
  Sad: {
    session_name: "Inner Light",
    message: "A gentle session to comfort the spirit and find your inner peace.",
    meditation_type: "Breathwork",
    technique: "Compassion Breathing",
    duration: 15,
    guidance_style: "Guided",
    match_score: 100,
  },
  Angry: {
    session_name: "Heat Release",
    message: "Release tension and transform frustration into calm awareness.",
    meditation_type: "Focused Attention",
    technique: "Anger Release Breathing",
    duration: 10,
    guidance_style: "Guided",
    match_score: 100,
  },
  Anxious: {
    session_name: "Safe Harbor",
    message: "Anchor your mind and calm the nervous system with box breathing.",
    meditation_type: "Breathwork",
    technique: "Box Breathing",
    duration: 8,
    guidance_style: "Guided",
    match_score: 100,
  },
  Neutral: {
    session_name: "Deep Breath Reset",
    message: "Restore balance with simple breathing.",
    meditation_type: "Breathing",
    technique: "Breathing Meditation",
    duration: 5,
    guidance_style: "Guided",
    match_score: 100,
  },
  Excited: {
    session_name: "Grounded Energy",
    message: "Channel your excitement into focused, productive calm.",
    meditation_type: "Breathwork",
    technique: "Rhythmic Breathing",
    duration: 8,
    guidance_style: "Guided",
    match_score: 100,
  },
};

const WHY_MAP: Record<string, { points: string[]; tagline: string }> = {
  stress:  { tagline: "Calm and supportive",  points: ["Release daily tension", "Restore nervous system balance", "Find your inner calm"] },
  focus:   { tagline: "Sharp and focused",    points: ["Restore mental focus", "Calm rising tension", "Prepare for deep work"] },
  sleep:   { tagline: "Calm and supportive",  points: ["Calm the racing mind", "Relax the body fully", "Prepare for deep sleep"] },
  happy:   { tagline: "Warm and uplifting",   points: ["Amplify positive emotions", "Cultivate gratitude", "Sustain your joy"] },
  calm:    { tagline: "Calm and supportive",  points: ["Find inner stillness", "Release surface tension", "Anchor in the present"] },
  mindful: { tagline: "Present and aware",    points: ["Deepen present awareness", "Reduce mental noise", "Cultivate clarity"] },
  // Emotion-based keys
  sad:     { tagline: "Gentle and healing",   points: ["Comfort the spirit", "Find inner peace", "Release emotional tension"] },
  angry:   { tagline: "Releasing and calm",   points: ["Release built-up tension", "Transform frustration", "Restore inner calm"] },
  anxious: { tagline: "Grounding and safe",   points: ["Anchor the nervous system", "Slow the racing mind", "Feel safe and steady"] },
  excited: { tagline: "Focused and grounded", points: ["Channel your energy", "Build focused calm", "Stay present"] },
  neutral: { tagline: "Calm and balanced",    points: ["Restore mental balance", "Reset your baseline", "Center yourself"] },
  default: { tagline: "Calm and supportive",  points: ["Restore mental focus", "Calm rising tension", "Prepare for deep work"] },
};

export default function AIRecommendation() {
  const navigate = useNavigate();
  const userId = Number(sessionHelper.getUserId() ?? 1);

  const [rec, setRec] = useState<RecommendPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    console.log("SESSION STORAGE →", {
      goal:       sessionStorage.getItem("zg_goal"),
      emotion:    sessionStorage.getItem("zg_emotion"),
      experience: sessionStorage.getItem("zg_experience"),
    });
  }, []);

  const load = () => {
    setLoading(true);
    setError("");

    const goal       = sessionStorage.getItem("zg_goal")       ?? "stress";
    const emotion    = sessionStorage.getItem("zg_emotion")    ?? "Neutral";
    const experience = sessionStorage.getItem("zg_experience") ?? "Beginner";

    console.log("SENDING →", { goal, emotion, experience });

    recommendationApi.generate({
      user_id:           userId,
      goal_type:         goal,
      experience_level:  experience,
      predicted_emotion: emotion,
    })
      .then(res => {
        console.log("API RESPONSE →", res);

        // If backend returns a generic/recovery fallback, use emotion-based local data instead
        const isGenericResponse =
          !res.session_name ||
          res.session_name.toLowerCase().includes("recovery") ||
          res.message?.toLowerCase().includes("system recovery");

        if (isGenericResponse) {
          console.warn("API returned generic response, using emotion fallback");
          const fallback = REC_MAP[emotion] || REC_MAP["Neutral"];
          setRec(fallback);
          setError("Using local recommendation");
          return;
        }

        setRec({
          ...res,
          session_name:   res.session_name || res.meditation_type,
          match_score:    res.match_score  || 95,
          guidance_style: "Guided",
        });
      })
      .catch((err) => {
        console.error("AI Recommendation failed:", err);
        const emotion = sessionStorage.getItem("zg_emotion") ?? "Neutral";
        const fallback = REC_MAP[emotion] || REC_MAP["Neutral"];
        setRec(fallback);
        setError("Using local recommendation");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleBegin = async () => {
    if (!rec) return;
    setStarting(true);
    try {
      const sessionRecord = await sessionApi.start({
        user_id:          userId,
        goal:             sessionStorage.getItem("zg_goal")       ?? "stress",
        mood_before:      sessionStorage.getItem("zg_emotion")    ?? "Neutral",
        experience_level: sessionStorage.getItem("zg_experience") ?? "Beginner",
        session_name:     rec.session_name,
        duration:         rec.duration,
        techniques:       rec.technique,
        match_score:      Math.round(rec.match_score || 95),
      });

      sessionStorage.setItem("zg_session_id",   String(sessionRecord.session_id));
      sessionStorage.setItem("zg_session_name", rec.session_name);
      sessionStorage.setItem("zg_session_mins", String(rec.duration));
      sessionStorage.setItem("zg_rec_score",    String(Math.round(rec.match_score || 95)));

      navigate("/session/plan");
    } catch (err) {
      console.error(err);
    } finally {
      setStarting(false);
    }
  };

  const goal       = sessionStorage.getItem("zg_goal")    ?? "default";
  const emotion    = sessionStorage.getItem("zg_emotion") ?? "Neutral";
  const emotionKey = emotion.toLowerCase();
  // If using local fallback (error is set), prioritize emotion over goal
  const why        = error
  ? (WHY_MAP[emotionKey] ?? WHY_MAP["default"])
  : (WHY_MAP[goal] ?? WHY_MAP[emotionKey] ?? WHY_MAP["default"]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#6F7BF7] mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Generating your personalized session...</p>
        </div>
      </div>
    );
  }

  if (!rec) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No recommendation found</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#1F2933] tracking-tight mb-2">
            Your AI-Generated Path
          </h1>
          <p className="text-gray-500 text-lg">
            Based on your <span className="font-bold text-[#1F2933]">{emotion}</span> — here's your personalized session.
          </p>
        </div>
        <button
          onClick={() => navigate("/session/mood")}
          className="px-4 py-2 rounded-2xl border border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-all text-sm"
        >
          Change Mood
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl mb-6"
          style={{ background: "#FEF9C3", border: "1px solid #FDE047" }}>
          <AlertCircle size={16} style={{ color: "#CA8A04" }} />
          <span style={{ color: "#92400E", fontSize: "13px" }}>{error}</span>
          <button onClick={load} className="ml-auto flex items-center gap-1 text-xs font-bold" style={{ color: "#CA8A04" }}>
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Recommendation Card */}
        <div className="lg:col-span-2">
          <div
            className="p-8 rounded-[40px] relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #EEF0FF 0%, #E8F8F5 100%)" }}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: "rgba(111,123,247,0.15)" }}
              >
                <Zap size={14} className="text-[#6F7BF7]" />
                <span className="text-[#6F7BF7] font-black uppercase tracking-widest text-[10px]">
                  Optimized For Your Mood
                </span>
              </div>
              <span className="text-5xl">🧘</span>
            </div>

            <h2 className="text-4xl font-black text-[#1F2933] mb-4 tracking-tight leading-tight">
              {rec.session_name}
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              {rec.message}
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-[#F97316]" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Duration</span>
              </div>
              <p className="text-xl font-black text-[#1F2933]">{rec.duration} Minutes</p>
            </div>

            <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Wind size={16} className="text-[#6F7BF7]" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Technique</span>
              </div>
              <p className="text-xl font-black text-[#1F2933]">{rec.technique}</p>
            </div>

            <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-[#4AAFA9]" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Voice</span>
              </div>
              <p className="text-xl font-black text-[#1F2933]">{rec.guidance_style}</p>
            </div>
          </div>

          {/* Begin Button */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleBegin}
              disabled={starting}
              className="w-full py-5 rounded-[24px] text-white text-xl font-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
              style={{ background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)" }}
            >
              {starting ? (
                <><Loader2 size={20} className="animate-spin" /> Starting...</>
              ) : (
                <> BEGIN SESSION <ChevronRight size={22} /> </>
              )}
            </button>
            <button
              onClick={() => navigate("/app/home")}
              className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Why This Session Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">💡</span>
              <h3 className="text-xl font-black text-[#1F2933]">Why this session?</h3>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Tailored with{" "}
              <span className="font-bold text-[#6F7BF7]">{why.tagline}</span>
              {" "}— this session helps restore mental balance based on your goals.
            </p>

            <div className="space-y-4">
              {why.points.map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)" }}
                  >
                    <Zap size={10} className="text-white" />
                  </div>
                  <span className="text-[#1F2933] font-medium text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
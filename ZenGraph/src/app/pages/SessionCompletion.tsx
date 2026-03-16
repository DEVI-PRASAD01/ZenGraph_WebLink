import { useNavigate } from "react-router";
import { CheckCircle2, Clock, Flame, Star } from "lucide-react";
import { sessionApi } from "../services/sessionApi";
import { useEffect } from "react";

export default function SessionCompletion() {
  const navigate = useNavigate();
  const sessionId = Number(sessionStorage.getItem("zg_session_id") ?? 0);

  // Mark session as complete when this page mounts
  useEffect(() => {
    if (sessionId) {
      sessionApi.complete({ session_id: sessionId }).catch(console.error);
    }
  }, [sessionId]);

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Success Message */}
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="relative mb-10">
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: "#8BD3C7", transform: "scale(1.8)" }}
            />
            <div
              className="w-32 h-32 rounded-[40px] flex items-center justify-center rotate-6 shadow-2xl shadow-indigo-100"
              style={{ background: "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)" }}
            >
              <CheckCircle2 size={64} className="text-white" />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={24} className="fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            ))}
          </div>

          <h1 className="mb-4"
            style={{ color: "#1F2933", fontSize: "56px", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px" }}>
            Peace Achieved.
          </h1>
          <p className="mb-10 text-gray-500 text-xl max-w-lg leading-relaxed">
            Exceptional focus today. You've completed your session and taken another step toward lasting mindfulness.
          </p>

          <div className="w-full max-w-md flex flex-col gap-4">
            <button
              onClick={() => navigate("/session/reflection")}
              className="w-full py-5 rounded-[24px] bg-[#6F7BF7] text-white text-xl font-extrabold shadow-xl shadow-indigo-100 hover:bg-[#5E6AE6] transition-all active:scale-[0.98]"
            >
              Reflect on Progress ✨
            </button>
            <button
              onClick={() => navigate("/app/home")}
              className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Skip to Dashboard
            </button>
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Clock, label: "Duration", value: "10 min", color: "#6F7BF7", bg: "rgba(111,123,247,0.08)" },
              { icon: Flame, label: "Streak", value: "Day +1", color: "#F97316", bg: "rgba(249,115,22,0.08)" },
              { icon: Star, label: "Score", value: "9.2 / 10", color: "#EAB308", bg: "rgba(234,179,8,0.08)" },
            ].map((s) => (
              <div key={s.label}
                className="flex flex-col items-center p-6 rounded-[32px] border border-gray-100 shadow-sm"
                style={{ background: s.bg }}>
                <s.icon size={24} style={{ color: s.color }} className="mb-2" />
                <p className="text-[#1F2933] text-xl font-black">{s.value}</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
            <h3 className="text-[#1F2933] text-2xl font-bold mb-8">Completed Techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Guided Breathing", icon: "🌬️" },
                { label: "Body Scan", icon: "🔍" },
                { label: "Nature Sounds", icon: "🌿" },
                { label: "Mindfulness", icon: "🧘" },
              ].map((t) => (
                <div key={t.label}
                  className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-[#8BD3C7] transition-all">
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1">
                    <p className="text-[#1F2933] font-extrabold leading-tight">{t.label}</p>
                    <p className="text-[#4AAFA9] text-xs font-bold uppercase">Mastered</p>
                  </div>
                  <CheckCircle2 size={24} className="text-[#4AAFA9]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

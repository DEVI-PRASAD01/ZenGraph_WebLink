import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Calendar, Loader2, Sparkles } from "lucide-react";
import { aiEmotionApi, sessionHelper } from "../services/sessionApi";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "🤩", label: "Excited" },
];

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

export default function MoodSelection() {
  const navigate = useNavigate();
  const userId = Number(sessionHelper.getUserId() ?? 1);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [predicted, setPredicted] = useState<{ emotion: string; confidence: number } | null>(null);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setLoading(true);

    // Try AI prediction — silently fall back if unavailable
    try {
      const aiResult = await aiEmotionApi.predict({
        user_id: userId,
        mood: selectedMood,
        thought: note.trim() || undefined,
      });
      sessionStorage.setItem("zg_emotion", aiResult.predicted_emotion);
      sessionStorage.setItem("zg_confidence", String(aiResult.confidence));
      setPredicted({ emotion: aiResult.predicted_emotion, confidence: aiResult.confidence });
      // Small pause to show the AI result badge, then navigate
      await new Promise(r => setTimeout(r, 800));
    } catch {
      // AI endpoint unavailable — use selected mood as fallback
      sessionStorage.setItem("zg_emotion", selectedMood);
    }

    setLoading(false);
    navigate("/session/recommendation");
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100" style={{ background: "#F5F7FA" }}>
          <ChevronLeft size={22} style={{ color: "#1F2933" }} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100" style={{ background: "#F5F7FA" }}>
          <Calendar size={20} style={{ color: "#1F2933" }} />
        </button>
      </div>

      {/* AI prediction badge (shown briefly before navigating) */}
      {predicted && (
        <div className="flex items-center gap-3 mb-6 px-5 py-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500"
          style={{ background: "linear-gradient(135deg,#F0EBFF,#E2DAFF)", border: "1px solid #C4B5FD" }}>
          <Sparkles size={18} style={{ color: "#6F7BF7", flexShrink: 0 }} />
          <span style={{ color: "#1F2933", fontSize: "14px", fontWeight: 700 }}>AI detected: </span>
          <span style={{ color: "#6F7BF7", fontSize: "14px", fontWeight: 800 }}>{predicted.emotion}</span>
          <span style={{ color: "#9CA3AF", fontSize: "12px", marginLeft: "4px" }}>
            ({Math.round(predicted.confidence * 100)}% confidence)
          </span>
        </div>
      )}

      <div>
        <h1 className="text-center mb-6" style={{ color: "#1F2933", fontSize: "32px", fontWeight: 800, lineHeight: 1.2 }}>
          How are you feeling today?
        </h1>

        <div className="flex justify-center mb-10">
          <div className="px-6 py-2.5 rounded-full" style={{ background: "#F0F0F5" }}>
            <span style={{ color: "#6B7280", fontSize: "15px", fontWeight: 500 }}>{today}</span>
          </div>
        </div>

        <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.label;
            return (
              <button
                key={mood.label}
                onClick={() => { setSelectedMood(mood.label); setPredicted(null); }}
                className="flex flex-col items-center py-6 rounded-3xl transition-all duration-200 active:scale-95"
                style={{
                  background: isSelected ? "linear-gradient(135deg,rgba(74,175,169,0.08),rgba(111,123,247,0.08))" : "#F5F7FA",
                  border: isSelected ? "2px solid #4AAFA9" : "2px solid #F5F7FA",
                  boxShadow: isSelected ? "0 8px 20px rgba(74,175,169,0.15)" : "none",
                }}
              >
                <span style={{ fontSize: "56px", lineHeight: 1, marginBottom: "12px" }}>{mood.emoji}</span>
                <span style={{ color: isSelected ? "#4AAFA9" : "#4B5563", fontSize: "16px", fontWeight: isSelected ? 700 : 500 }}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-10 max-w-2xl mx-auto">
          <label className="block mb-4" style={{ color: "#1F2933", fontSize: "18px", fontWeight: 700 }}>
            Add a note{" "}
            <span style={{ color: "#9CA3AF", fontWeight: 400, fontSize: "14px" }}>(Optional — helps AI personalize your session)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full resize-none outline-none focus:ring-2 focus:ring-[#6F7BF7]/20 transition-all border border-transparent"
            style={{ background: "#F5F7FA", borderRadius: "20px", padding: "20px", color: "#1F2933", fontSize: "15px", lineHeight: 1.6 }}
          />
        </div>

        <div className="max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!selectedMood || loading}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 mb-12 shadow-lg"
            style={{
              background: selectedMood ? "linear-gradient(135deg,#6F7BF7 0%,#8BD3C7 100%)" : "#E5E7EB",
              color: selectedMood ? "#FFFFFF" : "#9CA3AF",
              fontSize: "18px", fontWeight: 800,
              boxShadow: selectedMood ? "0 8px 24px rgba(111,123,247,0.3)" : "none",
            }}
          >
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> Analyzing mood...</>
              : <><Sparkles size={18} /> Start Personalized Session</>}
          </button>
        </div>
      </div>
    </div>
  );
}
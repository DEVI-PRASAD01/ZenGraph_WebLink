import { useState } from "react";
import { useNavigate } from "react-router";
import { GradientButton } from "../components/zen/ZenComponents";
import { ChevronLeft, Loader2 } from "lucide-react";
import { sessionApi, sessionHelper } from "../services/sessionApi";

const levels = [
  {
    id: "beginner",
    label: "Beginner",
    emoji: "🌱",
    desc: "New to meditation. Just getting started on my journey.",
    sessions: "5–10 min sessions",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    emoji: "🌿",
    desc: "Some experience. Looking to deepen my practice.",
    sessions: "10–20 min sessions",
  },
  {
    id: "advanced",
    label: "Advanced",
    emoji: "🌳",
    desc: "Regular meditator. Ready for deeper exploration.",
    sessions: "20–45 min sessions",
  },
];

export default function Experience() {
  const navigate = useNavigate();
  const userId = Number(sessionHelper.getUserId() ?? 1);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      // The backend expects labels like "Beginner", "Intermediate", "Advanced"
      const selectedLevel = levels.find(l => l.id === selected)?.label || "Beginner";

      await sessionApi.selectExperience(userId, selectedLevel);
      sessionStorage.setItem("zg_experience", selectedLevel);
      navigate("/session/mood");
    } catch (err) {
      console.error("Failed to save experience:", err);
      // Fallback: still navigate
      navigate("/session/mood");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-8 lg:p-12 max-w-5xl mx-auto"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 transition-colors hover:text-gray-900"
        style={{ color: "#6B7280" }}
      >
        <ChevronLeft size={22} />
        <span style={{ fontSize: "16px", fontWeight: 500 }}>Back</span>
      </button>

      <div className="flex justify-center gap-2 mb-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === 1 ? "40px" : "12px",
              background: i <= 1 ? "linear-gradient(135deg, #6F7BF7, #8BD3C7)" : "#E5E7EB",
            }}
          />
        ))}
      </div>

      <div className="text-center mb-12">
        <h1
          className="mb-3"
          style={{ color: "#1F2933", fontSize: "36px", fontWeight: 800, lineHeight: 1.2 }}
        >
          Your experience level
        </h1>
        <p style={{ color: "#6B7280", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
          This helps us tailor the session lengths and guidance techniques to perfectly match your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {levels.map((level) => {
          const isSelected = selected === level.id;
          return (
            <button
              key={level.id}
              onClick={() => setSelected(level.id)}
              className="p-8 rounded-3xl text-left transition-all duration-200 active:scale-95 hover:shadow-xl flex flex-col items-center text-center"
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)"
                  : "#FFFFFF",
                boxShadow: isSelected
                  ? "0 20px 40px rgba(111,123,247,0.3)"
                  : "0 4px 20px rgba(0,0,0,0.06)",
                border: "2px solid transparent",
              }}
            >
              <div className="mb-6">
                <span className="text-6xl" style={{ display: 'block', marginBottom: '16px' }}>{level.emoji}</span>
                <span
                  style={{
                    color: isSelected ? "#FFFFFF" : "#1F2933",
                    fontSize: "24px",
                    fontWeight: 800,
                  }}
                >
                  {level.label}
                </span>
              </div>
              <p
                className="mb-8 flex-1"
                style={{
                  color: isSelected ? "rgba(255,255,255,0.9)" : "#6B7280",
                  fontSize: "15px",
                  lineHeight: 1.6,
                }}
              >
                {level.desc}
              </p>
              <div
                className="inline-flex items-center px-4 py-2 rounded-2xl"
                style={{
                  background: isSelected
                    ? "rgba(255,255,255,0.15)"
                    : "#F5F7FA",
                }}
              >
                <span
                  style={{
                    color: isSelected ? "#FFFFFF" : "#6F7BF7",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {level.sessions}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="max-w-md mx-auto">
        <GradientButton
          onClick={handleContinue}
          disabled={!selected || loading}
          className="h-[60px] !text-lg !rounded-[20px]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Saving...</span>
            </div>
          ) : (
            "Continue →"
          )}
        </GradientButton>
      </div>
    </div>
  );
}
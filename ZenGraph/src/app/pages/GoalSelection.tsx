import { useState } from "react";
import { useNavigate } from "react-router";
import { GradientButton } from "../components/zen/ZenComponents";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import { sessionApi, sessionHelper } from "../services/sessionApi";

const goals = [
  { id: "stress", label: "Reduce Stress", emoji: "🧘", desc: "Find relief from daily tension" },
  { id: "focus", label: "Improve Focus", emoji: "🎯", desc: "Sharpen your concentration" },
  { id: "sleep", label: "Sleep Better", emoji: "🌙", desc: "Drift into restful nights" },
  { id: "happy", label: "Feel Happier", emoji: "☀️", desc: "Boost your mood and joy" },
  { id: "calm", label: "Increase Calm", emoji: "🌊", desc: "Cultivate inner peace" },
  { id: "mindful", label: "Build Mindfulness", emoji: "🌿", desc: "Live in the present moment" },
];

export default function GoalSelection() {
  const navigate = useNavigate();
  const userId = Number(sessionHelper.getUserId() ?? 1);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected(id);
  };

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      // Find the label for the selected goal ID
      const selectedLabel = goals.find(g => g.id === selected)?.label || "";

      await sessionApi.selectGoal(userId, selectedLabel);
      sessionStorage.setItem("zg_goal", selectedLabel);
      navigate("/session/experience");
    } catch (err) {
      console.error("Failed to save goal:", err);
      // Fallback: still navigate
      navigate("/session/experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-8 lg:p-12 max-w-5xl mx-auto"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
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
              width: i === 0 ? "40px" : "12px",
              background:
                i === 0
                  ? "linear-gradient(135deg, #6F7BF7, #8BD3C7)"
                  : "#E5E7EB",
            }}
          />
        ))}
      </div>

      <div className="text-center mb-12">
        <h1
          className="mb-3"
          style={{ color: "#1F2933", fontSize: "36px", fontWeight: 800, lineHeight: 1.2 }}
        >
          What's your goal?
        </h1>
        <p style={{ color: "#6B7280", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
          We'll personalize your AI-meditation experience based on your choices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {goals.map((goal) => {
          const isSelected = selected === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              className="flex flex-col items-start gap-4 p-6 rounded-3xl text-left transition-all duration-200 active:scale-95 hover:shadow-md bg-white border-2"
              style={{
                borderColor: isSelected ? "#6F7BF7" : "#F3F4F6",
                background: isSelected
                  ? "linear-gradient(135deg, rgba(111,123,247,0.05), rgba(139,211,199,0.05))"
                  : "#FFFFFF",
                boxShadow: isSelected ? "0 8px 20px rgba(111,123,247,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-4xl">{goal.emoji}</span>
                {isSelected && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)",
                    }}
                  >
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
              <div>
                <p
                  style={{
                    color: "#1F2933",
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  {goal.label}
                </p>
                <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.5 }}>
                  {goal.desc}
                </p>
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
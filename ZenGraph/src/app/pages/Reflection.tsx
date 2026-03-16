import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Loader2 } from "lucide-react";
import { checkInApi, sessionHelper } from "../services/sessionApi";

const moods = [
  { emoji: "😌", label: "Calm" },
  { emoji: "😮‍💨", label: "Relaxed" },
  { emoji: "🧠", label: "Focused" },
  { emoji: "😊", label: "Happy" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😶", label: "Neutral" },
];

export default function Reflection() {
  const navigate = useNavigate();
  const userId = Number(sessionHelper.getUserId() ?? 1);
  const sessionId = Number(sessionStorage.getItem("zg_session_id") ?? 0);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const goNext = () => navigate("/session/analysis");

  const handleSave = async () => {
    setLoading(true);
    try {
      // Try to submit checkin — if endpoint unavailable, skip silently
      if (selectedMood) {
        await checkInApi.submit({
          user_id: userId,
          session_id: sessionId || undefined,
          mood_after: selectedMood,
          notes: notes.trim() || undefined,
        });
      }
    } catch {
      // /session/checkin not available — silently ignore and navigate
    } finally {
      setLoading(false);
      goNext();
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#1F2933] mb-2 tracking-tight">Session Reflection</h1>
          <p className="text-gray-500 font-medium text-lg">Take a moment to process your experience.</p>
        </div>
        <div className="flex items-center gap-2 text-[#6F7BF7] font-black uppercase tracking-widest text-sm">
          <Zap size={20} />
          <span>Session Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Mood Selection */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black text-[#1F2933] mb-2">How do you feel now?</h2>
            <p className="text-gray-400 font-medium">Select the emoji that best reflects your current state.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setSelectedMood(m.label)}
                className={`group p-8 rounded-[40px] border-2 transition-all duration-300 text-center ${selectedMood === m.label
                  ? "bg-white border-[#6F7BF7] shadow-2xl shadow-indigo-100 scale-105"
                  : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50"
                  }`}
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500">{m.emoji}</div>
                <p className="font-black text-[#1F2933] tracking-tight">{m.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black text-[#1F2933] mb-2">Reflective Notes</h2>
            <p className="text-gray-400 font-medium">Capture your thoughts, breakthroughs, or any distractions.</p>
          </div>
          <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm space-y-8">
            <textarea
              placeholder="I noticed my breath was shallow at first..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[300px] bg-transparent text-[#1F2933] text-xl font-medium placeholder:text-gray-200 outline-none resize-none"
            />
            <div className="flex items-center gap-4 text-gray-300 font-bold uppercase tracking-widest text-[10px]">
              <div className="flex-1 h-px bg-gray-50" />
              <span>AI will analyze these notes for your progress</span>
              <div className="flex-1 h-px bg-gray-50" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-6 rounded-[32px] bg-[#6F7BF7] text-white text-xl font-black shadow-xl shadow-indigo-100 hover:bg-[#5E6AE6] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Saving...</>
                : "Save Reflection"}
            </button>
            <button
              onClick={goNext}
              className="px-10 py-6 rounded-[32px] border-2 border-gray-100 text-gray-400 font-black hover:bg-gray-50 transition-all"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

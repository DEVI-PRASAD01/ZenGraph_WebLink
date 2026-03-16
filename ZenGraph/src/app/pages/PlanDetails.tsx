import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Clock, CheckCircle2, Wind, Waves, Music, Sparkles } from "lucide-react";

export default function PlanDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Read data stored in AIRecommendation.tsx
  const sessionName = sessionStorage.getItem("zg_session_name") ?? "Mind Balance";
  const sessionMins = sessionStorage.getItem("zg_session_mins") ?? "15";
  const recType = sessionStorage.getItem("zg_rec_type") ?? "Meditation";
  const recStyle = sessionStorage.getItem("zg_rec_style") ?? "Calm and supportive";
  const recScore = sessionStorage.getItem("zg_rec_score") ?? "95";

  const techniques = [recType, "Neural Sync", "Deep Breathing", "Mindfulness"];

  const aims = [
    `Personalized for ${recStyle.toLowerCase()}`,
    "Optimized based on your mood",
    `AI Match Score: ${recScore}%`,
  ];

  return (
    <div
      className="p-8 lg:p-12 max-w-5xl mx-auto"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100 bg-[#F5F7FA]"
          >
            <ChevronLeft size={22} className="text-gray-700" />
          </button>
          <h2 className="text-[#1F2933] text-2xl font-extrabold tracking-tight">Your Meditation Plan</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0FDFB] border border-[#C4EAE2]">
          <Sparkles size={16} className="text-[#4AAFA9]" />
          <span className="text-[#4AAFA9] font-bold text-sm tracking-tight">{recScore}% Match</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left Column: Plan Overview */}
        <div>
          <div
            className="rounded-[32px] p-8 mb-8 relative overflow-hidden shadow-sm"
            style={{
              background: "linear-gradient(160deg, #E8F8F5 0%, #D5F5EE 100%)",
              border: "1px solid #C4EAE2",
            }}
          >
            <p className="text-[#4AAFA9] text-sm font-bold tracking-widest uppercase mb-4">AI Deep Personalization</p>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#1F2933] text-4xl font-black leading-tight">{sessionName}</h2>
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                <Clock size={16} className="text-[#6B7280]" />
                <span className="text-[#6B7280] text-sm font-bold">{sessionMins} MIN</span>
              </div>
            </div>

            <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
              A sequence custom-built by our AI to align with your current state.
              Applying <strong>{recType}</strong> techniques with a <strong>{recStyle.toLowerCase()}</strong> guidance style.
            </p>

            <div className="flex justify-between items-end">
              <div className="space-y-2">
                {aims.map((aim) => (
                  <div key={aim} className="flex items-center gap-2 text-[#4AAFA9] font-semibold">
                    <CheckCircle2 size={16} />
                    <span>{aim}</span>
                  </div>
                ))}
              </div>
              <div
                className="w-24 h-24 rounded-[32px] bg-white flex items-center justify-center border-2 border-[#4AAFA9]/20 shadow-inner"
              >
                <div className="text-5xl">🧘</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/session/ready")}
            className="w-full py-5 rounded-3xl bg-[#4AAFA9] text-white text-xl font-bold tracking-wide hover:shadow-xl hover:bg-[#3E928D] transition-all active:scale-[0.98] shadow-lg shadow-teal-100"
          >
            Activate Plan
          </button>
        </div>

        {/* Right Column: Techniques Breakdown */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-[#1F2933] text-2xl font-bold mb-8">Personalized Techniques</h3>

          <div className="space-y-4 mb-8">
            {techniques.map((t, i) => {
              const icons = [Waves, Wind, Music, Sparkles];
              const Icon = icons[i % icons.length];
              const isActive = activeTab === i;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTab(i)}
                  className="w-full flex items-center justify-between p-5 rounded-3xl transition-all border-2 group"
                  style={{
                    background: isActive ? "#F0FDFB" : "transparent",
                    borderColor: isActive ? "#4AAFA9" : "#F3F4F6",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-[#4AAFA9] text-white' : 'bg-[#F5F7FA] text-gray-400'}`}>
                      <Icon size={24} />
                    </div>
                    <span className={`text-lg font-bold ${isActive ? 'text-[#1F2933]' : 'text-[#6B7280]'}`}>{t}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? 'border-[#4AAFA9] bg-[#4AAFA9]' : 'border-gray-200'}`}>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-6 bg-[#F5F7FA] rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="text-2xl mt-1">💡</div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Focus Area: {techniques[activeTab]}</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  The recommendation engine selected <strong>{techniques[activeTab]}</strong> as the primary focus to maximize your <strong>{recScore}% AI match</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
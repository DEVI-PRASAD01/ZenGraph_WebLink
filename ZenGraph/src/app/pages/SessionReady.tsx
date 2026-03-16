import { useNavigate } from "react-router";
import { ChevronLeft, Clock, Check, Loader2 } from "lucide-react";
import { useState } from "react";

const checkItems = ["Calming breaths", "Body awareness scan", "Mindful presence"];

export default function SessionReady() {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  // Session info stored when session was started in AIRecommendation or Library
  const sessionName = sessionStorage.getItem("zg_session_name") ?? "Your Session";
  const sessionMins = sessionStorage.getItem("zg_session_mins") ?? "–";

  const handleBegin = () => {
    setStarting(true);
    // Short delay for smooth UX then navigate to player
    setTimeout(() => navigate("/session/player"), 800);
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto flex flex-col gap-10" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-[#1F2933] text-3xl font-extrabold tracking-tight">Prepare Your Space</h1>
          <p className="text-[#6B7280] font-medium">Session is ready for you to begin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Illustration */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-12 bg-[#EEF0FF] rounded-[48px] border-2 border-white shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8BD3C7 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="w-48 h-48 rounded-full flex items-center justify-center border-4 border-white bg-white/40 backdrop-blur-sm shadow-xl relative z-10">
            <div style={{ fontSize: "96px", lineHeight: 1 }}>🧘</div>
          </div>
          <div className="mt-8 text-center relative z-10">
            <div className="flex justify-center gap-2 mb-2">
              {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8BD3C7]" />)}
            </div>
            <p className="text-[#6F7BF7] font-bold text-lg uppercase tracking-widest">Calm Awaits</p>
          </div>
        </div>

        {/* Info & Action */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
            {/* Session name & duration from backend */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[#1F2933] text-3xl font-black">{sessionName}</h2>
              <div className="flex items-center gap-2 bg-[#F5F7FA] px-4 py-2 rounded-xl">
                <Clock size={18} className="text-[#6B7280]" />
                <span className="text-[#1F2933] font-bold text-lg">{sessionMins} MINS</span>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <p className="text-gray-500 font-medium text-lg border-l-4 border-[#8BD3C7] pl-4">
                Before we start, ensure you're in a comfortable position and your notifications are silenced.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checkItems.map((item) => (
                  <div key={item} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Check size={18} className="text-[#4AAFA9]" />
                    </div>
                    <span className="text-[#1F2933] font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBegin}
                disabled={starting}
                className="flex-1 flex items-center justify-center gap-4 py-5 px-8 rounded-[24px] bg-[#4AAFA9] hover:bg-[#3E928D] transition-all text-white shadow-xl shadow-teal-50 active:scale-[0.98]"
              >
                {starting ? (
                  <><Loader2 size={20} className="animate-spin" /><span className="text-xl font-black">Starting...</span></>
                ) : (
                  <><div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><span className="text-xl ml-1">▶</span></div>
                    <span className="text-xl font-black uppercase tracking-tight">Begin Session</span></>
                )}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-5 rounded-[24px] border-2 border-[#E5E7EB] text-gray-400 font-bold hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-[0.98]"
              >
                Modify Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
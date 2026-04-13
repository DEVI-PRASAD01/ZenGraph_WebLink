import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Pause, Play, RotateCcw, Volume2, VolumeX, ChevronLeft, SkipForward, Loader2 } from "lucide-react";

const phases = ["Guided Breathing", "Body Scan", "Nature Sounds", "Mindfulness"];
const phaseColors = ["#6F7BF7", "#4AAFA9", "#8B5CF6", "#F97316"];

export default function MeditationPlayer() {
  const navigate = useNavigate();

  const sessionName = sessionStorage.getItem("zg_session_name") ?? "Zen Harmony";
  const sessionMins = Number(sessionStorage.getItem("zg_session_mins") ?? 10);
  const TOTAL = sessionMins * 60;
  const sessionId = Number(sessionStorage.getItem("zg_session_id") ?? 0);

  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [isPlaying, setIsPlaying] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [phase, setPhase] = useState(0);

  const handleComplete = async () => {
    if (finishing) return;
    setFinishing(true);

    // Calculate actual elapsed time
    const elapsedSeconds = TOTAL - timeLeft;
    const elapsedMins = Math.max(1, Math.round(elapsedSeconds / 60));
    sessionStorage.setItem("zg_actual_mins", String(elapsedMins));

    try {
      // Call backend with actual duration immediately
      if (sessionId) {
        await fetch(`http://localhost:8000/session/complete/${sessionId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            mood_after: sessionStorage.getItem("zg_mood") ?? "Neutral",
            actual_duration: elapsedMins,
            notes: ""
          })
        });
      }
    } catch (err) {
      console.error("Failed to complete session on backend:", err);
      // Still navigate even if API fails
    } finally {
      setFinishing(false);
      navigate("/session/complete");
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleComplete();
          return 0;
        }
        const elapsed = TOTAL - t + 1;
        const seg = TOTAL / 4;
        setPhase(Math.min(3, Math.floor(elapsed / seg)));
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, TOTAL]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progress = ((TOTAL - timeLeft) / TOTAL) * 100;
  const circumference = 2 * Math.PI * 160;

  return (
    <div
      className="p-8 lg:p-12 h-screen flex flex-col justify-between relative overflow-hidden text-white"
      style={{
        fontFamily: "Inter, sans-serif",
        background: `linear-gradient(160deg, ${phaseColors[phase]}CC 0%, #1a1a2e 100%)`,
        transition: "background 1s ease",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-10 animate-pulse"
        style={{ background: phaseColors[phase], top: "-20%", right: "-10%", filter: "blur(120px)" }}
      />

      {/* Header */}
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">CURRENT SESSION</p>
            <h2 className="text-2xl font-black tracking-tight">{sessionName}</h2>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="flex items-center gap-4">
          {phases.map((p, i) => (
            <div key={p} className="flex flex-col items-center gap-2">
              <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= phase ? 'bg-white' : 'bg-white/20'}`} />
              <span className={`text-[9px] font-black uppercase tracking-tighter ${i === phase ? 'text-white' : 'text-white/40'}`}>
                {p.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setMuted(!muted)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all"
        >
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Timer */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-12">
        <div className="text-center space-y-4">
          <div className="px-6 py-2 rounded-full bg-white/10 border border-white/10 inline-block backdrop-blur-md">
            <span className="text-xl font-black tracking-tight uppercase text-[#8BD3C7]">{phases[phase]}</span>
          </div>
          {phase === 0 && (
            <h3 className="text-4xl font-black animate-pulse h-12">
              {timeLeft % 11 < 4 ? "Breathe In..." : timeLeft % 11 < 11 ? "Hold..." : "Breathe Out..."}
            </h3>
          )}
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute w-[320px] h-[320px] rounded-full bg-white/10" />
          <svg width="350" height="350" className="rotate-[-90deg]">
            <circle cx="175" cy="175" r="160" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle
              cx="175" cy="175" r="160" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * progress) / 100}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-9xl font-black tracking-tighter tabular-nums">{minutes}:{seconds}</span>
            <span className="text-white/40 font-black uppercase tracking-[0.3em] text-xs mt-4">MINUTES REMAINING</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex flex-col items-center gap-10 pb-4">
        <div className="flex items-center gap-12">
          <button
            onClick={() => setTimeLeft(TOTAL)}
            className="w-16 h-16 rounded-3xl flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            <RotateCcw size={24} className="group-hover:rotate-[-45deg] transition-transform" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-32 h-32 rounded-[48px] bg-white flex items-center justify-center text-gray-900 shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
          </button>
          <button
            onClick={handleComplete}
            disabled={finishing}
            className="w-16 h-16 rounded-3xl flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            {finishing ? <Loader2 className="animate-spin" /> : <SkipForward size={24} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
        <div className="w-full max-w-lg h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
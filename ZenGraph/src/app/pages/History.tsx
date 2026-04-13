import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { sessionHelper, sessionApi, type HistoryItem } from "../services/sessionApi";
import { Loader2, Clock, Calendar, Star, Smile, Target, ChevronLeft, Search } from "lucide-react";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = sessionHelper.getUserId();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    sessionApi.history(Number(userId))
      .then(data => {
        if (data?.status === "success" && Array.isArray(data.sessions)) {
          setHistory(data.sessions);
        } else {
            console.error("History data is invalid:", data);
        }
      })
      .catch(err => console.error("Failed to fetch history:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const filteredHistory = history.filter(item => 
    item.session_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.goal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "--:--:--";
    try {
      // Remove + 'Z' to avoid forcing UTC if the server didn't specify it
      const date = new Date(isoString.replace(' ', 'T'));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "Unknown Date";
    try {
      // Remove + 'Z' to avoid forcing UTC if the server didn't specify it
      const date = new Date(isoString.replace(' ', 'T'));
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-[#6F7BF7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button
            onClick={() => navigate("/app/home")}
            className="flex items-center gap-2 text-[#6F7BF7] font-black uppercase tracking-widest text-[10px] mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft size={14} /> Back to Home
          </button>
          <h1 className="text-5xl font-black text-[#1F2933] tracking-tight">Meditation History</h1>
          <p className="text-gray-500 text-lg mt-2">Track your journey to mindfulness and peace.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search sessions..."
            className="pl-12 pr-6 py-4 rounded-2xl bg-white border-transparent focus:border-[#6F7BF7] focus:shadow-indigo-100 shadow-sm w-full md:w-80 transition-all font-medium outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-[48px] p-20 text-center shadow-sm border border-gray-100 flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-4xl">🧘</div>
          <div>
            <h3 className="text-2xl font-black text-[#1F2933]">No history found</h3>
            <p className="text-gray-500 mt-2">Start your first meditation to see your progress here.</p>
          </div>
          <button 
            onClick={() => navigate("/session/mood")}
            className="px-8 py-4 rounded-2xl bg-[#6F7BF7] text-white font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
          >
            Start Meditation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredHistory.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#6F7BF7]/20 transition-all group overflow-hidden relative"
            >
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Session Info */}
                <div className="lg:col-span-1 border-r border-gray-50 pr-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-[#6F7BF7]" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formatDate(item.started_at)}</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#1F2933] mb-4 group-hover:text-[#6F7BF7] transition-colors leading-tight">
                    {item.session_name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-[#6F7BF7] text-[10px] font-black uppercase tracking-tight">
                      {item.duration_minutes} MINS
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0 shadow-inner">
                      <Smile size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mood</p>
                      <p className="text-[#1F2933] font-bold text-lg capitalize">{item.mood_before} → {item.mood_after}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0 shadow-inner">
                      <Star size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Level</p>
                      <p className="text-[#1F2933] font-bold text-lg capitalize">{item.experience_level}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0 shadow-inner">
                      <Target size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Goal</p>
                      <p className="text-[#1F2933] font-bold text-lg capitalize">{item.goal}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0 shadow-inner">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Exact Time</p>
                      <div className="text-[#1F2933] font-bold text-sm">
                        <p>Start: {formatTime(item.started_at)}</p>
                        <p>End: {formatTime(item.completed_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side decoration/CTA */}
                <div className="lg:col-span-1 flex items-center justify-end">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#6F7BF7] group-hover:text-white transition-all cursor-pointer shadow-sm group-hover:shadow-indigo-200">
                    <ChevronLeft size={20} className="rotate-180" />
                  </div>
                </div>
              </div>

              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

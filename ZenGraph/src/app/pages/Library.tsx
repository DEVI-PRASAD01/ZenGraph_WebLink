import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, Clock, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { libraryApi, sessionApi, sessionHelper, type LibrarySession } from "../services/sessionApi";

const categoryMeta: Record<string, { emoji: string; color: string }> = {
  anxiety: { emoji: "🌊", color: "#EEF0FF" },
  focus: { emoji: "🎯", color: "#E8F8F5" },
  sleep: { emoji: "🌙", color: "#F0EEFF" },
  quick: { emoji: "⚡", color: "#FFF8E8" },
  stress: { emoji: "🌿", color: "#E8F5F0" },
  walk: { emoji: "🚶", color: "#FFF0F5" },
};
const levelColor: Record<string, string> = {
  Beginner: "#E8F8F5", Intermediate: "#EEF0FF", Advanced: "#F0EEFF", All: "#FFF8E8",
};
const levelText: Record<string, string> = {
  Beginner: "#4AAFA9", Intermediate: "#6F7BF7", Advanced: "#8B5CF6", All: "#D4A017",
};

export default function Library() {
  const navigate = useNavigate();
  const userId = Number(sessionHelper.getUserId() ?? 1);

  const [allSessions, setAllSessions] = useState<LibrarySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [starting, setStarting] = useState<number | null>(null);

  async function fetchSessions() {
    setLoading(true); setError("");
    try {
      const data = await libraryApi.all();
      setAllSessions(data);
      if (data.length > 0 && !activeCategory) setActiveCategory(data[0].category);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSessions(); }, []);

  const handleStart = async (s: LibrarySession) => {
    setStarting(s.id);
    setError("");
    try {
      const sessionRecord = await sessionApi.start({
        user_id: userId,
        goal: "improve_focus",
        mood_before: "neutral",
        experience_level: s.level?.toLowerCase() ?? "beginner",
        session_name: s.title,
        duration: s.duration,
        techniques: s.technique,
        match_score: 90,
      });

      sessionStorage.setItem("zg_session_id", String(sessionRecord.session_id));
      sessionStorage.setItem("zg_session_name", s.title);
      sessionStorage.setItem("zg_session_mins", String(s.duration));
      sessionStorage.setItem("zg_emotion", "Neutral");

      navigate("/session/player");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start session.");
    } finally {
      setStarting(null);
    }
  };

  const categories = Array.from(new Set(allSessions.map(s => s.category))).map(cat => ({
    id: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " "),
    emoji: categoryMeta[cat]?.emoji ?? "🧘",
    color: categoryMeta[cat]?.color ?? "#EEF0FF",
    count: allSessions.filter(s => s.category === cat).length,
  }));

  const currentCat = allSessions.filter(s => s.category === activeCategory);
  const filtered = search
    ? currentCat.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.technique.toLowerCase().includes(search.toLowerCase()))
    : currentCat;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1">
          <h1 className="text-5xl font-black text-[#1F2933] mb-2 tracking-tight">Meditation Library</h1>
          <p className="text-gray-500 font-medium text-lg">Explore {allSessions.length}+ expert-guided mindfulness sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-96">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by technique or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl bg-white border border-gray-100 py-4 pl-14 pr-6 text-gray-700 font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#6F7BF7]/20 transition-all"
            />
          </div>
          <button onClick={fetchSessions}
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <RefreshCw size={16} className={`text-gray-400 ${loading ? "animate-spin text-[#6F7BF7]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
          <AlertCircle size={18} style={{ color: "#EF4444" }} />
          <span style={{ color: "#EF4444", fontSize: "14px" }}>{error}</span>
          <button onClick={fetchSessions} className="ml-auto font-bold" style={{ color: "#EF4444", fontSize: "13px" }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-[#6F7BF7] mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Loading sessions from backend...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          {/* Categories Sidebar */}
          <div className="xl:col-span-1 space-y-8">
            <h2 className="text-xl font-black text-[#1F2933] uppercase tracking-widest">CATEGORIES</h2>
            <div className="grid grid-cols-1 gap-3">
              {categories.length === 0 ? (
                <p className="text-gray-400 text-sm">No categories found.</p>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-4 p-5 rounded-3xl transition-all duration-300 group ${activeCategory === cat.id ? 'bg-[#6F7BF7] text-white shadow-xl shadow-indigo-100' : 'bg-white text-[#1F2933] hover:bg-gray-50'}`}
                  >
                    <span className="text-3xl filter saturate-150">{cat.emoji}</span>
                    <div className="text-left flex-1">
                      <p className="font-black leading-tight">{cat.label}</p>
                      <p className={`text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>{cat.count} sessions</p>
                    </div>
                    {activeCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="xl:col-span-3">
            <div className="mb-8 flex items-baseline gap-4">
              <h2 className="text-4xl font-black text-[#1F2933]">
                {categories.find(c => c.id === activeCategory)?.label ?? activeCategory}
              </h2>
              <span className="text-gray-400 font-bold">{filtered.length} AVAILABLE</span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 font-medium">No sessions found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleStart(s)}
                    className="group bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                  >
                    {starting === s.id && (
                      <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-[40px]">
                        <Loader2 size={32} className="animate-spin text-[#6F7BF7]" />
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                          style={{ background: categoryMeta[s.category]?.color ?? "#EEF0FF" }}>
                          {categoryMeta[s.category]?.emoji ?? "🧘"}
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                          style={{ background: levelColor[s.level] ?? "#EEF0FF", color: levelText[s.level] ?? "#6F7BF7" }}>
                          {s.level}
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-[#1F2933] mb-2 group-hover:text-[#6F7BF7] transition-colors">{s.title}</h3>
                      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-4">{s.technique}</p>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">{s.description}</p>
                    </div>
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 font-bold">
                        <Clock size={16} />
                        <span>{s.duration} min</span>
                      </div>
                      <button className="text-[#6F7BF7] font-black group-hover:translate-x-1 transition-transform">START →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
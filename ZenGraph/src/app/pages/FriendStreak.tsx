import { useState, useEffect } from "react";
import { Search, Flame, UserPlus, Check, Users, Bell, Loader2, AlertCircle } from "lucide-react";
import { sessionHelper } from "../services/sessionApi";

const API = "http://localhost:8000";

interface Friend {
  user_id: number;
  name: string;
  initials: string;
  streak: number;
  meditated_today: boolean;
  total_sessions: number;
  is_self: boolean;
  color_index: number;
}

interface SearchUser {
  user_id: number;
  name: string;
  initials: string;
  color_index: number;
}

const AVATAR_COLORS = [
  "linear-gradient(135deg, #6F7BF7, #8BD3C7)",
  "linear-gradient(135deg, #F97316, #FBBF24)",
  "linear-gradient(135deg, #8B5CF6, #EC4899)",
  "linear-gradient(135deg, #4AAFA9, #6F7BF7)",
  "linear-gradient(135deg, #10B981, #4AAFA9)",
  "linear-gradient(135deg, #F43F5E, #F97316)",
];

export default function FriendStreak() {
  const userId = Number(sessionHelper.getUserId() ?? 1);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [nudgingId, setNudgingId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Load friend streaks on mount
  useEffect(() => {
    fetchFriends();
  }, []);

  async function fetchFriends() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/social/friend-streaks/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.status === "success") {
        setFriends(data.friends);
      } else {
        setError("Could not load friend streaks.");
      }
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  // Search users by name
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${API}/social/find-user?name=${encodeURIComponent(searchQuery)}&current_user_id=${userId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.status === "success") {
          // Filter out already-friends
          const friendIds = new Set(friends.map((f) => f.user_id));
          setSearchResults(data.users.filter((u: SearchUser) => !friendIds.has(u.user_id)));
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  async function handleAddFriend(user: SearchUser) {
    setAddingId(user.user_id);
    try {
      const res = await fetch(`${API}/social/add-friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id: userId, friend_id: user.user_id }),
      });
      const data = await res.json();
      showStatus(data.message ?? "Friend added!");
      setSearchQuery("");
      setSearchResults([]);
      fetchFriends(); // Reload to show new friend
    } catch {
      showStatus("Failed to add friend.");
    } finally {
      setAddingId(null);
    }
  }

  async function handleNudge(friendId: number, friendName: string) {
    setNudgingId(friendId);
    try {
      const res = await fetch(`${API}/social/nudge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id: userId, friend_id: friendId }),
      });
      const data = await res.json();
      showStatus(data.message ?? `Nudge sent to ${friendName}!`);
    } catch {
      showStatus("Failed to send nudge.");
    } finally {
      setNudgingId(null);
    }
  }

  function showStatus(msg: string) {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  }

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto flex flex-col gap-10" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Toast */}
      {statusMsg && (
        <div className="fixed top-8 right-8 z-50 bg-[#1F2933] text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check size={20} className="text-[#8BD3C7]" />
          {statusMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#1F2933] mb-2 tracking-tighter">
            Friend Streaks
          </h1>
          <p className="text-lg text-gray-500">
            Keep each other motivated on your mindfulness journey.
          </p>
        </div>
        <button
          onClick={() => { setIsAdding(!isAdding); setSearchQuery(""); setSearchResults([]); }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold transition-transform active:scale-95 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)",
            boxShadow: "0 6px 20px rgba(111,123,247,0.3)",
          }}
        >
          {isAdding ? <Check size={20} /> : <UserPlus size={20} />}
          {isAdding ? "DONE" : "ADD"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
          <AlertCircle size={18} style={{ color: "#EF4444" }} />
          <span style={{ color: "#EF4444", fontSize: "14px" }}>{error}</span>
          <button onClick={fetchFriends} className="ml-auto font-bold text-red-500 text-sm">Retry</button>
        </div>
      )}

      {/* Add Friend Search */}
      {isAdding && (
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-indigo-50/50">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F5F7FA] border border-transparent focus:border-[#6F7BF7] focus:bg-white outline-none transition-all text-[#1F2933] font-medium"
              autoFocus
            />
            {searching && (
              <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#6F7BF7]" />
            )}
          </div>

          {searchQuery && (
            <div className="mt-4 flex flex-col gap-2">
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div key={user.user_id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#F5F7FA] transition-colors">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm"
                        style={{ background: AVATAR_COLORS[user.color_index] ?? AVATAR_COLORS[0] }}
                      >
                        {user.initials}
                      </div>
                      <span className="font-bold text-[#1F2933] text-lg">{user.name}</span>
                    </div>
                    <button
                      onClick={() => handleAddFriend(user)}
                      disabled={addingId === user.user_id}
                      className="px-5 py-2 rounded-xl text-sm font-bold bg-[#EEF0FF] text-[#6F7BF7] hover:bg-[#6F7BF7] hover:text-white transition-colors disabled:opacity-50"
                    >
                      {addingId === user.user_id ? <Loader2 size={14} className="animate-spin" /> : "ADD"}
                    </button>
                  </div>
                ))
              ) : !searching ? (
                <div className="p-4 text-center text-gray-500 font-medium">
                  No users found matching "{searchQuery}"
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Friends List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={48} className="animate-spin text-[#6F7BF7]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {friends.length === 0 ? (
            <div className="col-span-full py-12 text-center flex flex-col items-center gap-4 bg-white rounded-[32px] border border-gray-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#EEF0FF] flex items-center justify-center text-[#6F7BF7]">
                <Users size={32} />
              </div>
              <p className="text-xl text-[#1F2933] font-bold">No friends yet</p>
              <p className="text-gray-500">Add friends to start building streaks together!</p>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.user_id}
                className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl duration-500 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg shadow-inner"
                      style={{ background: AVATAR_COLORS[friend.color_index] ?? AVATAR_COLORS[0] }}
                    >
                      {friend.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <div className={`w-3 h-3 rounded-full ${friend.meditated_today ? "bg-green-400" : "bg-gray-300"}`} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-[#1F2933]">{friend.name}</h3>
                      {friend.is_self && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#6F7BF7]">You</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      {friend.meditated_today ? "✅ Meditated today" : "⏳ Not yet today"} · {friend.total_sessions} sessions
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex flex-col items-center bg-[#FFF4E5] px-4 py-2 rounded-2xl border border-orange-100">
                    <Flame size={20} className="text-[#F59E0B] mb-1" />
                    <span className="text-lg font-black text-[#D97706] leading-none">{friend.streak}</span>
                    <span className="text-[10px] font-bold text-[#F59E0B] uppercase mt-1">Days</span>
                  </div>
                  {!friend.is_self && (
                    <button
                      onClick={() => handleNudge(friend.user_id, friend.name)}
                      disabled={nudgingId === friend.user_id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EEF0FF] text-[#6F7BF7] hover:bg-[#6F7BF7] hover:text-white transition-colors disabled:opacity-50"
                    >
                      {nudgingId === friend.user_id
                        ? <Loader2 size={12} className="animate-spin" />
                        : <Bell size={12} />}
                      Nudge
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
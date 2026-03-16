import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { profileApi, sessionHelper, type ProfileData } from "../services/sessionApi";
import {
  ChevronRight,
  Zap,
  Star,
  Edit2,
  Check,
  X,
  HelpCircle,
  Shield,
  Bell,
  Download,
  LogOut,
  Music,
} from "lucide-react";

const PROFILE_IMG =
  "https://images.unsplash.com/photo-1759873911661-d4cba84d2eff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMG1lZGl0YXRpbmclMjBzZXJlbmUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI3ODA2MDZ8MA&ixlib=rb-4.1.0&q=80&w=400";

const achievements = [
  { emoji: "🔥", label: "7-Day Streak", unlocked: true },
  { emoji: "🧘", label: "Zen Master", unlocked: true },
  { emoji: "🌙", label: "Night Owl", unlocked: false },
  { emoji: "⚡", label: "Speed Meditator", unlocked: false },
];

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Alex Johnson");
  const [role, setRole] = useState("INTERMEDIATE MEDITATOR");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const USER_ID = Number(sessionHelper.getUserId() ?? 1);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileApi.fetch(USER_ID);
        setProfile(data);
        setName(data.name);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    loadProfile();
  }, []);

  // Set local state from profile once loaded
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (profile) {
      setNotifications(profile.enable_notifications);
      setAnalytics(profile.data_sharing_consent);
    }
  }, [profile]);


  // Settings states
  const [reminders, setReminders] = useState(true);
  const [sounds, setSounds] = useState(true);

  const handleAction = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const updatePreference = async (key: 'notifications' | 'analytics', val: boolean) => {
    if (!profile) return;

    // Optimistic update
    if (key === 'notifications') setNotifications(val);
    else setAnalytics(val);

    try {
      await profileApi.updatePreferences(USER_ID, {
        enable_notifications: key === 'notifications' ? val : notifications,
        data_sharing_consent: key === 'analytics' ? val : analytics,
      });
      handleAction("Preferences updated successfully!");
    } catch (err) {
      console.error("Error updating preferences:", err);
      // Rollback
      if (key === 'notifications') setNotifications(!val);
      else setAnalytics(!val);
      handleAction("Failed to update preferences.");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleAction("Uploading your new profile photo...");
    try {
      const newUrl = await profileApi.uploadPhoto(USER_ID, file);
      if (profile) {
        setProfile({ ...profile, profile_image: newUrl });
      }
      handleAction("Profile photo updated!");
    } catch (err) {
      console.error("Error uploading photo:", err);
      handleAction("Upload failed. Please try again.");
    }
  };

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange(!value);
      }}
      className="relative w-12 h-7 rounded-full transition-all duration-300"
      style={{
        background: value
          ? "linear-gradient(135deg, #6F7BF7, #8BD3C7)"
          : "#E5E7EB",
      }}
    >
      <div
        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
        style={{ left: value ? "calc(100% - 24px)" : "4px" }}
      />
    </button>
  );

  return (
    <div
      className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {statusMsg && (
        <div className="fixed top-8 right-8 z-50 bg-[#1F2933] text-white px-6 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 font-bold flex items-center gap-3">
          <Zap size={20} className="text-yellow-400" />
          {statusMsg}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Profile Card */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#6F7BF7] to-[#8BD3C7]" />

            <div className="relative mt-12 mb-8 inline-block">
              <img
                src={profile?.profile_image || PROFILE_IMG}
                alt="Profile"
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 rounded-[48px] object-cover border-8 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              />
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-[20px] bg-[#F5E6A6] border-4 border-white flex items-center justify-center shadow-lg">
                <Star size={20} className="fill-[#D4A017] text-[#D4A017]" />
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-center text-3xl font-black text-[#1F2933] bg-gray-50 rounded-2xl p-2 outline-none border-2 border-[#6F7BF7]"
                  autoFocus
                />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-center text-[#6F7BF7] font-black uppercase tracking-[0.2em] text-[10px] bg-gray-50 rounded-xl p-2 outline-none border border-gray-100"
                />
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-3 rounded-xl bg-[#6F7BF7] text-white hover:bg-[#5E6AE6] transition-all"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-3 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-[#1F2933] mb-2 tracking-tight">{name}</h2>
                <p className="text-[#6F7BF7] font-black uppercase tracking-[0.2em] text-[10px] mb-8">{role}</p>
              </>
            )}



            <div className="grid grid-cols-3 gap-4 mb-2">
              {[
                { label: "Sessions", value: "32" },
                { label: "Hours", value: "4.4" },
                { label: "Streak", value: "7d" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-3xl bg-gray-50/50">
                  <p className="text-[#1F2933] text-xl font-black leading-tight">{s.value}</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-5 rounded-[24px] border-2 border-gray-100 bg-white text-gray-500 font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
            >
              <Edit2 size={20} /> {isEditing ? "Cancel Editing" : "Edit Public Profile"}
            </button>
          </div>
        </div>

        {/* Right Column: Dash Content */}
        <div className="lg:w-2/3 space-y-10">
          {/* Achievements section */}
          <section>
            <h2 className="text-2xl font-black text-[#1F2933] mb-6">Achievements</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((a) => (
                <div
                  key={a.label}
                  className={`p-6 rounded-[32px] border transition-all duration-300 ${a.unlocked ? 'bg-white border-gray-100 shadow-sm hover:shadow-xl group' : 'bg-gray-50 border-transparent opacity-40'}`}
                >
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">{a.emoji}</div>
                  <p className="font-black text-[#1F2933] leading-tight text-sm tracking-tight">{a.label}</p>
                  {a.unlocked && <p className="text-[#4AAFA9] text-[9px] font-black tracking-widest uppercase mt-1">UNLOCKED</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Account Settings */}
          <section>
            <h2 className="text-2xl font-black text-[#1F2933] mb-6">Account Settings</h2>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              {/* Push Notifications Toggle Row */}
              <div className="group border-b border-gray-50 p-8 flex items-center gap-6">
                <span className="text-3xl"><Bell className="text-orange-400" /></span>
                <div className="flex-1">
                  <p className="text-xl font-black text-[#1F2933] leading-tight mb-1">Push Notifications</p>
                  <p className="text-gray-400 font-medium text-sm">Alerts for scheduled sessions</p>
                </div>
                <Toggle value={notifications} onChange={(v) => updatePreference('notifications', v)} />
              </div>

              {/* Session Reminders Toggle Row */}
              <div className="group border-b border-gray-50 p-8 flex items-center gap-6">
                <span className="text-3xl"><Zap className="text-yellow-500" /></span>
                <div className="flex-1">
                  <p className="text-xl font-black text-[#1F2933] leading-tight mb-1">Session Reminders</p>
                  <p className="text-gray-400 font-medium text-sm">Gentle nudges to keep your streak</p>
                </div>
                <Toggle value={reminders} onChange={setReminders} />
              </div>

              {/* Privacy Toggle Row */}
              <div className="group border-b border-gray-50 p-8 flex items-center gap-6">
                <span className="text-3xl"><Shield className="text-[#4AAFA9]" /></span>
                <div className="flex-1">
                  <p className="text-xl font-black text-[#1F2933] leading-tight mb-1">Privacy & Data</p>
                  <p className="text-gray-400 font-medium text-sm">Anonymously share analytics with AI</p>
                </div>
                <Toggle value={analytics} onChange={(v) => updatePreference('analytics', v)} />
              </div>

              {/* Ambient Sounds Toggle Row */}
              <div className="group border-b border-gray-50 p-8 flex items-center gap-6">
                <span className="text-3xl"><Music className="text-purple-400" /></span>
                <div className="flex-1">
                  <p className="text-xl font-black text-[#1F2933] leading-tight mb-1">Ambient Sounds</p>
                  <p className="text-gray-400 font-medium text-sm">Background audio during sessions</p>
                </div>
                <Toggle value={sounds} onChange={setSounds} />
              </div>

              {/* Data Export Row */}
              <button
                onClick={() => handleAction("Preparing your session history for download...")}
                className="w-full group border-b border-gray-50 p-8 flex items-center gap-6 hover:bg-gray-50 transition-all text-left"
              >
                <span className="text-3xl"><Download className="text-indigo-400" /></span>
                <div className="flex-1">
                  <p className="text-xl font-black text-[#1F2933] leading-tight mb-1">Data Export</p>
                  <p className="text-gray-400 font-medium text-sm">Download your meditation history</p>
                </div>
                <ChevronRight size={24} className="text-gray-300" />
              </button>

              {/* Support Row */}
              <button
                onClick={() => handleAction("Our support team will contact you shortly!")}
                className="w-full group p-8 flex items-center gap-6 hover:bg-gray-50 transition-all text-left"
              >
                <span className="text-3xl"><HelpCircle className="text-pink-400" /></span>
                <div className="flex-1">
                  <p className="text-xl font-black text-[#1F2933] leading-tight mb-1">Help & Support</p>
                  <p className="text-gray-400 font-medium text-sm">Contact our team or read documentation</p>
                </div>
                <ChevronRight size={24} className="text-gray-300" />
              </button>
            </div>

            <button
              className="w-full mt-8 py-5 rounded-[24px] text-red-500 font-black hover:bg-red-50 transition-all flex items-center justify-center gap-3 active:scale-95 transition-transform"
              onClick={() => navigate("/")}
            >
              <LogOut size={24} /> Sign Out from All Devices
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
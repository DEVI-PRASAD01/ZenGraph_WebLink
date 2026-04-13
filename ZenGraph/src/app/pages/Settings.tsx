import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { profileApi } from "../services/profileApi";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  // Still local states for other settings not yet in the profile schema
  const [reminders, setReminders] = useState(true);
  const [sounds, setSounds] = useState(true);

  const USER_ID = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    const loadSettings = async () => {
      if (!USER_ID) {
        setLoading(false);
        return;
      }
      try {
        const profile = await profileApi.fetch(USER_ID);
        setNotifications(profile.enable_notifications);
        setAnalytics(profile.data_sharing_consent);
      } catch (err) {
        console.error("Settings: Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [USER_ID]);

  const updatePreference = async (key: 'notifications' | 'analytics', val: boolean) => {
    // Optimistic update
    if (key === 'notifications') setNotifications(val);
    else setAnalytics(val);

    try {
      await profileApi.updatePreferences(USER_ID, {
        enable_notifications: key === 'notifications' ? val : notifications,
        data_sharing_consent: key === 'analytics' ? val : analytics,
      });
    } catch (err) {
      console.error(`Settings: Error updating ${key}:`, err);
      // Rollback on error
      if (key === 'notifications') setNotifications(!val);
      else setAnalytics(!val);
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
      onClick={() => onChange(!value)}
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-2xl font-black text-[#6F7BF7] animate-pulse">Loading Settings...</div>
    </div>
  );

  return (
    <div
      className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#1F2933] mb-2 tracking-tight">Settings</h1>
          <p className="text-gray-500 font-medium text-lg">Manage your account, notifications, and privacy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Notifications & Privacy */}
        <div className="space-y-12">
          {/* Notifications Section */}
          <section id="notifications">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[#6F7BF7] rounded-full" />
              <h2 className="text-2xl font-black text-[#1F2933]">Notifications</h2>
            </div>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-8 border-b border-gray-50">
                <div>
                  <p className="text-xl font-black text-[#1F2933] mb-1">Push Notifications</p>
                  <p className="text-gray-400 font-medium text-sm">Receive alerts for scheduled sessions</p>
                </div>
                <Toggle value={notifications} onChange={(v) => updatePreference('notifications', v)} />
              </div>
              <div className="flex items-center justify-between p-8 border-b border-gray-50">
                <div>
                  <p className="text-xl font-black text-[#1F2933] mb-1">Session Reminders</p>
                  <p className="text-gray-400 font-medium text-sm">Gentle nudges to keep your streak</p>
                </div>
                <Toggle value={reminders} onChange={setReminders} />
              </div>
              <div className="flex items-center justify-between p-8">
                <div>
                  <p className="text-xl font-black text-[#1F2933] mb-1">Ambient Sounds</p>
                  <p className="text-gray-400 font-medium text-sm">Enable background audio during sessions</p>
                </div>
                <Toggle value={sounds} onChange={setSounds} />
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section id="privacy">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[#4AAFA9] rounded-full" />
              <h2 className="text-2xl font-black text-[#1F2933]">Privacy & Data</h2>
            </div>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-8 border-b border-gray-50">
                <div>
                  <p className="text-xl font-black text-[#1F2933] mb-1">Share Analytics</p>
                  <p className="text-gray-400 font-medium text-sm">Help us improve ZenGraph anonymously</p>
                </div>
                <Toggle value={analytics} onChange={(v) => updatePreference('analytics', v)} />
              </div>
              <button className="w-full flex items-center justify-between p-8 hover:bg-gray-50 transition-all text-left">
                <div>
                  <p className="text-xl font-black text-[#1F2933] mb-1">Download My Data</p>
                  <p className="text-gray-400 font-medium text-sm">Get a copy of your session history</p>
                </div>
                <ChevronRight size={24} className="text-gray-300" />
              </button>
            </div>
          </section>
        </div>

        {/* Support Section */}
        <div className="space-y-12">
          {/* Account Section */}
          <section id="account">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[#F97316] rounded-full" />
              <h2 className="text-2xl font-black text-[#1F2933]">Account</h2>
            </div>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              {["Edit Profile", "Change Password", "Delete Account"].map((label) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between p-8 hover:bg-gray-50 border-b border-gray-50 last:border-none transition-all group"
                >
                  <span className="text-xl font-black text-[#1F2933] group-hover:text-[#6F7BF7] transition-colors">{label}</span>
                  <ChevronRight size={24} className="text-gray-300 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </section>

          {/* Support Section */}
          <section id="support">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gray-200 rounded-full" />
              <h2 className="text-2xl font-black text-[#1F2933]">Support</h2>
            </div>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              {["Help & FAQ", "Contact Support", "Privacy Policy", "Terms of Service"].map((label) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between p-8 hover:bg-gray-50 border-b border-gray-50 last:border-none transition-all group"
                >
                  <span className="text-xl font-black text-[#1F2933] group-hover:text-[#6F7BF7] transition-colors">{label}</span>
                  <ChevronRight size={24} className="text-gray-300 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center p-6 rounded-[32px] bg-gray-50">
              <span className="text-gray-400 font-black uppercase tracking-widest text-xs">App Version 1.0.0 (Build 240)</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
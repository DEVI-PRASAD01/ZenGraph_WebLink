import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [analytics, setAnalytics] = useState(false);

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
              {[
                { label: "Push Notifications", desc: "Receive alerts for scheduled sessions", value: notifications, onChange: setNotifications },
                { label: "Session Reminders", desc: "Gentle nudges to keep your streak", value: reminders, onChange: setReminders },
                { label: "Ambient Sounds", desc: "Enable background audio during sessions", value: sounds, onChange: setSounds },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-8 border-b border-gray-50 last:border-none">
                  <div>
                    <p className="text-xl font-black text-[#1F2933] mb-1">{item.label}</p>
                    <p className="text-gray-400 font-medium text-sm">{item.desc}</p>
                  </div>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}
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
                <Toggle value={analytics} onChange={setAnalytics} />
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

        {/* Right Column: Subscription & Support */}
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
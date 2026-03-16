import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Mail, Phone, ChevronDown } from "lucide-react";
import { authApi, sessionHelper } from "../services/sessionApi";

const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+61", flag: "🇦🇺", name: "AU" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+55", flag: "🇧🇷", name: "BR" },
  { code: "+27", flag: "🇿🇦", name: "ZA" },
  { code: "+971", flag: "🇦🇪", name: "AE" },
  { code: "+65", flag: "🇸🇬", name: "SG" },
  { code: "+60", flag: "🇲🇾", name: "MY" },
  { code: "+64", flag: "🇳🇿", name: "NZ" },
  { code: "+7", flag: "🇷🇺", name: "RU" },
];

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(COUNTRY_CODES[2]); // +91 IN
  const [showDrop, setShowDrop] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    if (loginMethod === "email") {
      if (!email.trim()) { setError("Please enter your email."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter a valid email."); return; }
    }
    if (loginMethod === "phone") {
      if (!phone.trim()) { setError("Please enter your phone number."); return; }
      if (!/^\d{7,12}$/.test(phone.trim())) { setError("Enter a valid number (7-12 digits)."); return; }
    }
    if (!password.trim()) { setError("Please enter your password."); return; }

    setLoading(true);
    try {
      const payload = loginMethod === "email"
        ? { email: email.trim(), password }
        : { phone_number: `${country.code}${phone.trim()}`, password };

      const res = await authApi.login(payload);
      if (res.status === "success") {
        sessionHelper.save(res.user_id, res.name);
        navigate("/app/home");
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <h1
        className="mb-1 text-center"
        style={{ color: "#1F2933", fontSize: "30px", fontWeight: 900, letterSpacing: "-0.5px" }}
      >
        Welcome back 👋
      </h1>
      <p className="mb-8 text-center" style={{ color: "#6B7280", fontSize: "16px" }}>
        Continue your mindfulness journey
      </p>

      {/* Error banner */}
      {error && (
        <div
          className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl"
          style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}
        >
          <AlertCircle size={18} style={{ color: "#EF4444", flexShrink: 0 }} />
          <span style={{ color: "#EF4444", fontSize: "14px" }}>{error}</span>
        </div>
      )}

      {/* Login Method Toggle */}
      <div className="flex p-1 mb-6 rounded-2xl" style={{ background: "#F3F4F6" }}>
        <button
          onClick={() => { setLoginMethod("email"); setError(""); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: loginMethod === "email" ? "#FFFFFF" : "transparent",
            color: loginMethod === "email" ? "#6F7BF7" : "#6B7280",
            boxShadow: loginMethod === "email" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
          }}
        >
          Email
        </button>
        <button
          onClick={() => { setLoginMethod("phone"); setError(""); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: loginMethod === "phone" ? "#FFFFFF" : "transparent",
            color: loginMethod === "phone" ? "#6F7BF7" : "#6B7280",
            boxShadow: loginMethod === "phone" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
          }}
        >
          Phone
        </button>
      </div>

      <div className="flex flex-col gap-5 mb-5">
        {loginMethod === "email" ? (
          <div>
            <label className="block mb-2" style={{ color: "#1F2933", fontSize: "14px", fontWeight: 600 }}>
              Email address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full rounded-2xl outline-none transition-all duration-200"
                style={{
                  background: "#F9FAFB",
                  padding: "14px 16px 14px 52px",
                  color: "#1F2933",
                  fontSize: "15px",
                  border: "1.5px solid #E5E7EB",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block mb-2" style={{ color: "#1F2933", fontSize: "14px", fontWeight: 600 }}>
              Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="relative" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setShowDrop(!showDrop)}
                  className="flex items-center gap-1.5 rounded-2xl h-full px-3"
                  style={{
                    background: "#F9FAFB",
                    border: "1.5px solid #E5E7EB",
                    fontSize: "15px",
                    color: "#1F2933",
                    fontWeight: 600,
                  }}
                >
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                  <ChevronDown size={14} style={{ color: "#9CA3AF" }} />
                </button>
                {showDrop && (
                  <div
                    className="absolute left-0 top-full mt-2 rounded-xl overflow-y-auto"
                    style={{
                      background: "#FFFFFF",
                      border: "1.5px solid #E5E7EB",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      zIndex: 50,
                      maxHeight: 200,
                      minWidth: 140,
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <button
                        key={c.code + c.name}
                        type="button"
                        onClick={() => { setCountry(c); setShowDrop(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                        style={{
                          fontSize: "14px",
                          color: "#1F2933",
                          background: country.code === c.code ? "#F3F4F6" : "transparent",
                        }}
                      >
                        <span>{c.flag}</span>
                        <span style={{ fontWeight: 600 }}>{c.code}</span>
                        <span style={{ color: "#9CA3AF" }}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative flex-1">
                <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full rounded-2xl outline-none transition-all duration-200"
                  style={{
                    background: "#F9FAFB",
                    padding: "14px 16px 14px 52px",
                    color: "#1F2933",
                    fontSize: "15px",
                    border: "1.5px solid #E5E7EB",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label style={{ color: "#1F2933", fontSize: "14px", fontWeight: 600 }}>
              Password
            </label>
            <button
              onClick={() => navigate("/auth/reset")}
              style={{ color: "#6F7BF7", fontSize: "13px", fontWeight: 600 }}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full rounded-2xl outline-none transition-all duration-200"
              style={{
                background: "#F9FAFB",
                padding: "14px 48px 14px 56px",
                color: "#1F2933",
                fontSize: "15px",
                border: "1.5px solid #E5E7EB",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "#9CA3AF" }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl mb-4 transition-all duration-200 active:scale-95"
        style={{
          background: loading ? "#A5B4FC" : "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: 700,
          boxShadow: loading ? "none" : "0 8px 24px rgba(111,123,247,0.35)",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Logging in...</>
        ) : (
          <>Log In <ArrowRight size={18} /></>
        )}
      </button>

      <div className="flex items-center gap-2 justify-center" style={{ color: "#6B7280", fontSize: "14px" }}>
        <span>Don't have an account?</span>
        <button onClick={() => navigate("/auth/signup")} style={{ color: "#6F7BF7", fontWeight: 700 }}>
          Sign Up Free
        </button>
      </div>
    </div>
  );
}

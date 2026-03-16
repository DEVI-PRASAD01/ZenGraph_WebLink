import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Eye, EyeOff, User, Phone, Mail, CheckCircle2, ArrowRight, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import { authApi } from "../services/sessionApi";

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

function validatePassword(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    symbol: /[!@#$%^&*(),.?\":{}|<>]/.test(pw),
  };
}

export default function Signup() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [country, setCountry] = useState(COUNTRY_CODES[2]); // +91 IN
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pwChecks = validatePassword(form.password);
  const pwValid = Object.values(pwChecks).every(Boolean);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
    setApiError("");
  }

  async function handleSubmit() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phone.trim()) e.phone = "Mobile number is required.";
    else if (!/^\d{7,12}$/.test(form.phone)) e.phone = "Enter a valid number (7-12 digits).";
    if (!form.password) e.password = "Password is required.";
    else if (!pwValid) e.password = "Password does not meet all requirements.";
    if (!form.confirm) e.confirm = "Please confirm your password.";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match.";

    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setApiError("");
    try {
      const res = await authApi.signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone_number: `${country.code}${form.phone}`,
        password: form.password,
        confirm_password: form.confirm,
        enable_notifications: true,
      });
      if (res.status === "success") {
        setSuccess(true);
      } else {
        setApiError(res.message);
      }
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Success screen ── */
  if (success) return (
    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "55vh" }}>
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)" }}
      >
        <CheckCircle2 size={40} className="text-white" />
      </div>
      <h2 style={{ color: "#1F2933", fontSize: "26px", fontWeight: 900 }} className="mb-2">Account Created! 🎉</h2>
      <p style={{ color: "#6B7280", fontSize: "15px" }} className="mb-8">
        Your ZenGraph account is ready. Let's get started!
      </p>
      <button
        onClick={() => navigate("/auth/login")}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl transition-all duration-200 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)",
          color: "#FFFFFF", fontSize: "16px", fontWeight: 700,
          boxShadow: "0 8px 24px rgba(111,123,247,0.35)",
        }}
      >
        Go to Login <ArrowRight size={18} />
      </button>
    </div>
  );

  /* ── Form ── */
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <h1 className="mb-1 text-center" style={{ color: "#1F2933", fontSize: "28px", fontWeight: 900, letterSpacing: "-0.5px" }}>
        Create account ✨
      </h1>
      <p className="mb-6 text-center" style={{ color: "#6B7280", fontSize: "15px" }}>
        Begin your wellness journey today
      </p>

      {/* API Error banner */}
      {apiError && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-2xl" style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
          <AlertCircle size={18} style={{ color: "#EF4444", flexShrink: 0 }} />
          <span style={{ color: "#EF4444", fontSize: "14px" }}>{apiError}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-5">

        {/* Full Name */}
        <div>
          <label className="block mb-1.5" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input type="text" placeholder="Your name" value={form.name} onChange={e => set("name", e.target.value)}
              className="w-full rounded-xl outline-none transition-all duration-200"
              style={{
                background: "#F9FAFB", padding: "12px 16px 12px 44px", color: "#1F2933", fontSize: "14px",
                border: `1.5px solid ${errors.name ? "#EF4444" : "#E5E7EB"}`, boxSizing: "border-box"
              }} />
          </div>
          {errors.name && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: 4 }}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1.5" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)}
              className="w-full rounded-xl outline-none transition-all duration-200"
              style={{
                background: "#F9FAFB", padding: "12px 16px 12px 44px", color: "#1F2933", fontSize: "14px",
                border: `1.5px solid ${errors.email ? "#EF4444" : "#E5E7EB"}`, boxSizing: "border-box"
              }} />
          </div>
          {errors.email && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: 4 }}>{errors.email}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-1.5" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>Mobile Number</label>
          <div className="flex gap-2">
            {/* Country code picker */}
            <div className="relative" style={{ flexShrink: 0 }}>
              <button type="button" onClick={() => setShowDrop(!showDrop)}
                className="flex items-center gap-1.5 rounded-xl h-full"
                style={{
                  background: "#F9FAFB", border: `1.5px solid ${errors.phone ? "#EF4444" : "#E5E7EB"}`,
                  padding: "12px 10px", fontSize: "14px", color: "#1F2933", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
                }}>
                <span>{country.flag}</span>
                <span>{country.code}</span>
                <ChevronDown size={13} style={{ color: "#9CA3AF" }} />
              </button>
              {showDrop && (
                <div className="absolute left-0 top-full mt-1 rounded-xl overflow-y-auto"
                  style={{ background: "#FFF", border: "1.5px solid #E5E7EB", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, maxHeight: 200, minWidth: 140 }}>
                  {COUNTRY_CODES.map(c => (
                    <button key={c.code + c.name} type="button"
                      onClick={() => { setCountry(c); setShowDrop(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left"
                      style={{ fontSize: "13px", color: "#1F2933", background: country.code === c.code ? "#F3F4F6" : "transparent" }}>
                      <span>{c.flag}</span>
                      <span style={{ fontWeight: 600 }}>{c.code}</span>
                      <span style={{ color: "#9CA3AF" }}>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Number input */}
            <div className="relative flex-1">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
              <input type="tel" placeholder="Mobile number" value={form.phone}
                onChange={e => set("phone", e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl outline-none transition-all duration-200"
                style={{
                  background: "#F9FAFB", padding: "12px 16px 12px 44px", color: "#1F2933", fontSize: "14px",
                  border: `1.5px solid ${errors.phone ? "#EF4444" : "#E5E7EB"}`, boxSizing: "border-box"
                }} />
            </div>
          </div>
          {errors.phone && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: 4 }}>{errors.phone}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1.5" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input type={showPw ? "text" : "password"} placeholder="Create a password" value={form.password}
              onChange={e => set("password", e.target.value)}
              className="w-full rounded-xl outline-none transition-all duration-200"
              style={{
                background: "#F9FAFB", padding: "12px 44px 12px 44px", color: "#1F2933", fontSize: "14px",
                border: `1.5px solid ${errors.password ? "#EF4444" : "#E5E7EB"}`, boxSizing: "border-box"
              }} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "#9CA3AF" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Strength checklist */}
          {form.password.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-1">
              {([["length", "8+ characters"], ["upper", "One uppercase"], ["lower", "One lowercase"], ["number", "One number"], ["symbol", "One symbol"]] as [keyof typeof pwChecks, string][]).map(([k, label]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: pwChecks[k] ? "#10B981" : "#E5E7EB" }} />
                  <span style={{ fontSize: "11px", color: pwChecks[k] ? "#10B981" : "#9CA3AF" }}>{label}</span>
                </div>
              ))}
            </div>
          )}
          {errors.password && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: 4 }}>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1.5" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input type={showConfirm ? "text" : "password"} placeholder="Re-enter your password" value={form.confirm}
              onChange={e => set("confirm", e.target.value)}
              className="w-full rounded-xl outline-none transition-all duration-200"
              style={{
                background: "#F9FAFB", padding: "12px 44px 12px 44px", color: "#1F2933", fontSize: "14px",
                border: `1.5px solid ${errors.confirm ? "#EF4444" : "#E5E7EB"}`, boxSizing: "border-box"
              }} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "#9CA3AF" }}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirm && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: 4 }}>{errors.confirm}</p>}
        </div>
      </div>

      {/* Submit */}
      <button type="button" onClick={handleSubmit} disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl mb-4 transition-all duration-200 active:scale-95"
        style={{
          background: loading ? "#A5B4FC" : "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)",
          color: "#FFFFFF", fontSize: "15px", fontWeight: 700,
          boxShadow: loading ? "none" : "0 8px 24px rgba(111,123,247,0.35)",
          cursor: loading ? "not-allowed" : "pointer",
        }}>
        {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={18} /></>}
      </button>

      <p style={{ color: "#9CA3AF", fontSize: "11px", textAlign: "center" }} className="mb-4">
        By signing up, you agree to our{" "}
        <a href="#" style={{ color: "#6F7BF7" }}>Terms</a> and{" "}
        <a href="#" style={{ color: "#6F7BF7" }}>Privacy Policy</a>
      </p>

      <div className="flex items-center gap-2 justify-center" style={{ color: "#6B7280", fontSize: "14px" }}>
        <span>Already have an account?</span>
        <button onClick={() => navigate("/auth/login")} style={{ color: "#6F7BF7", fontWeight: 700 }}>Log In</button>
      </div>
    </div>
  );
}

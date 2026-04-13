import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Mail } from "lucide-react";
import { authApi, sessionHelper } from "../services/sessionApi";



export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter a valid email."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }

    setLoading(true);
    try {
      const payload = { email: email.trim(), password };

      const res = await authApi.login(payload);
      if (res.status === "success") {
        sessionHelper.save(res.user_id, res.name);
        // ✅ ADD THIS LINE
        localStorage.setItem("user_id", String(res.user_id));

        window.location.href = "/app/home";
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



      <div className="flex flex-col gap-5 mb-5">
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

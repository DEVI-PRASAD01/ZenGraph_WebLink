import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { authApi } from "../services/sessionApi";

type Step = "email" | "otp" | "reset" | "done";

function validatePassword(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    symbol: /[!@#$%^&*(),.?\":{}|<>]/.test(pw),
  };
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pwChecks = validatePassword(newPw);
  const pwValid = Object.values(pwChecks).every(Boolean);

  async function handleSendOTP() {
    if (!email.trim()) { setError("Enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setLoading(true); setError("");
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP. Try again.");
    } finally { setLoading(false); }
  }

  async function handleVerifyOTP() {
    if (otp.length < 4) { setError("Enter the complete OTP."); return; }
    setLoading(true); setError("");
    try {
      await authApi.verifyOTP({ email: email.trim(), otp });
      setStep("reset");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid or expired OTP.");
    } finally { setLoading(false); }
  }

  async function handleResetPassword() {
    if (!newPw) { setError("Enter a new password."); return; }
    if (!pwValid) { setError("Password does not meet all requirements."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    setLoading(true); setError("");
    try {
      await authApi.resetPassword({ email: email.trim(), new_password: newPw });
      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Password reset failed. Try again.");
    } finally { setLoading(false); }
  }

  const btnStyle = (disabled = false) => ({
    background: disabled ? "#A5B4FC" : "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)",
    color: "#FFFFFF", fontSize: "15px", fontWeight: 700,
    boxShadow: disabled ? "none" : "0 8px 24px rgba(111,123,247,0.3)",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Back button */}
      {step !== "done" && (
        <button
          onClick={() => step === "email" ? navigate(-1) : setStep(step === "otp" ? "email" : "otp")}
          className="flex items-center gap-1.5 mb-8"
          style={{ color: "#6B7280", fontSize: "14px" }}
        >
          <ChevronLeft size={18} /> Back
        </button>
      )}

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)" }}
      >
        {step === "done" ? <CheckCircle2 size={28} className="text-white" /> : <KeyRound size={28} className="text-white" />}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-2xl"
          style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
          <AlertCircle size={16} style={{ color: "#EF4444" }} />
          <span style={{ color: "#EF4444", fontSize: "13px" }}>{error}</span>
        </div>
      )}

      {/* ── Step 1: Enter Email ── */}
      {step === "email" && (
        <>
          <h1 className="mb-2" style={{ color: "#1F2933", fontSize: "26px", fontWeight: 900 }}>Forgot password?</h1>
          <p className="mb-8" style={{ color: "#6B7280", fontSize: "15px" }}>
            Enter your registered email — we'll send you an OTP.
          </p>
          <label className="block mb-2" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>Email Address</label>
          <div className="relative mb-6">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSendOTP()}
              className="w-full rounded-xl outline-none transition-all duration-200"
              style={{
                background: "#F9FAFB", padding: "13px 16px 13px 44px", fontSize: "14px", color: "#1F2933",
                border: "1.5px solid #E5E7EB", boxSizing: "border-box"
              }} />
          </div>
          <button onClick={handleSendOTP} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-200 active:scale-95"
            style={btnStyle(loading)}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight size={16} /></>}
          </button>
        </>
      )}

      {/* ── Step 2: Enter OTP ── */}
      {step === "otp" && (
        <>
          <h1 className="mb-2" style={{ color: "#1F2933", fontSize: "26px", fontWeight: 900 }}>Enter OTP</h1>
          <p className="mb-2" style={{ color: "#6B7280", fontSize: "15px" }}>
            We sent a 4-digit code to <strong>{email}</strong>
          </p>
          <p className="mb-8" style={{ color: "#9CA3AF", fontSize: "13px" }}>The code expires in 5 minutes.</p>

          <label className="block mb-2" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>OTP Code</label>
          <input
            type="text"
            placeholder="Enter OTP"
            maxLength={6}
            value={otp}
            onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleVerifyOTP()}
            className="w-full rounded-xl outline-none text-center mb-6"
            style={{
              background: "#F9FAFB", padding: "16px", fontSize: "22px", fontWeight: 700, letterSpacing: "10px",
              color: "#1F2933", border: "1.5px solid #E5E7EB", boxSizing: "border-box"
            }}
          />

          <button onClick={handleVerifyOTP} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl mb-4 transition-all duration-200 active:scale-95"
            style={btnStyle(loading)}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <>Verify OTP <ArrowRight size={16} /></>}
          </button>
          <p className="text-center" style={{ color: "#9CA3AF", fontSize: "13px" }}>
            Didn't receive it?{" "}
            <button onClick={handleSendOTP} style={{ color: "#6F7BF7", fontWeight: 700 }}>Resend</button>
          </p>
        </>
      )}

      {/* ── Step 3: New Password ── */}
      {step === "reset" && (
        <>
          <h1 className="mb-2" style={{ color: "#1F2933", fontSize: "26px", fontWeight: 900 }}>Set new password</h1>
          <p className="mb-8" style={{ color: "#6B7280", fontSize: "15px" }}>Choose a strong password for your account.</p>

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="block mb-1.5" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                <input type={showPw ? "text" : "password"} placeholder="New password" value={newPw}
                  onChange={e => { setNewPw(e.target.value); setError(""); }}
                  className="w-full rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: "#F9FAFB", padding: "12px 44px", fontSize: "14px", color: "#1F2933",
                    border: "1.5px solid #E5E7EB", boxSizing: "border-box"
                  }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPw.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {([["length", "8+ characters"], ["upper", "One uppercase"], ["lower", "One lowercase"], ["number", "One number"], ["symbol", "One symbol"]] as [keyof typeof pwChecks, string][]).map(([k, label]) => (
                    <div key={k} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: pwChecks[k] ? "#10B981" : "#E5E7EB" }} />
                      <span style={{ fontSize: "11px", color: pwChecks[k] ? "#10B981" : "#9CA3AF" }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1.5" style={{ color: "#1F2933", fontSize: "13px", fontWeight: 600 }}>Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                <input type="password" placeholder="Re-enter password" value={confirmPw}
                  onChange={e => { setConfirmPw(e.target.value); setError(""); }}
                  className="w-full rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: "#F9FAFB", padding: "12px 44px", fontSize: "14px", color: "#1F2933",
                    border: "1.5px solid #E5E7EB", boxSizing: "border-box"
                  }} />
              </div>
            </div>
          </div>

          <button onClick={handleResetPassword} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-200 active:scale-95"
            style={btnStyle(loading)}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : <>Reset Password <ArrowRight size={16} /></>}
          </button>
        </>
      )}

      {/* ── Step 4: Done ── */}
      {step === "done" && (
        <div className="text-center">
          <h2 style={{ color: "#1F2933", fontSize: "26px", fontWeight: 900 }} className="mb-2">Password Updated! 🎉</h2>
          <p style={{ color: "#6B7280", fontSize: "15px" }} className="mb-8">
            Your password has been reset successfully. Log in with your new password.
          </p>
          <button onClick={() => navigate("/auth/login")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl transition-all duration-200 active:scale-95 mx-auto"
            style={btnStyle()}>
            Back to Login <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

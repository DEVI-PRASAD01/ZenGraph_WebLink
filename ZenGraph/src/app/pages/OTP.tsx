import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { GradientButton } from "../components/zen/ZenComponents";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export default function OTP() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  const filled = code.every((c) => c !== "");

  return (
    <div
      className="min-h-screen px-6 pt-14 pb-10 flex flex-col"
      style={{ fontFamily: "Inter, sans-serif", background: "#F5F7FA" }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-10"
        style={{ color: "#6B7280" }}
      >
        <ChevronLeft size={20} />
        <span style={{ fontSize: "15px" }}>Back</span>
      </button>

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "linear-gradient(135deg, #6F7BF7, #8BD3C7)" }}
      >
        <ShieldCheck size={32} className="text-white" />
      </div>

      <h1
        className="mb-2"
        style={{ color: "#1F2933", fontSize: "28px", fontWeight: 800 }}
      >
        Verify your email
      </h1>
      <p className="mb-10" style={{ color: "#6B7280", fontSize: "16px" }}>
        We sent a 6-digit code to your email address.
      </p>

      <div className="flex justify-between gap-2 mb-8">
        {code.map((c, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={c}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="flex-1 text-center rounded-2xl border-0 outline-none transition-all duration-200"
            style={{
              background: "#FFFFFF",
              height: "56px",
              color: "#1F2933",
              fontSize: "22px",
              fontWeight: 700,
              boxShadow: c
                ? "0 4px 16px rgba(111,123,247,0.25)"
                : "0 2px 8px rgba(0,0,0,0.06)",
              border: c ? "2px solid #6F7BF7" : "2px solid transparent",
            }}
          />
        ))}
      </div>

      <GradientButton
        onClick={() => navigate("/app/home")}
        disabled={!filled}
      >
        Verify & Continue
      </GradientButton>

      <button
        className="mt-6 text-center"
        style={{ color: "#6B7280", fontSize: "14px" }}
      >
        Didn't receive code?{" "}
        <span style={{ color: "#6F7BF7", fontWeight: 600 }}>Resend</span>
      </button>
    </div>
  );
}

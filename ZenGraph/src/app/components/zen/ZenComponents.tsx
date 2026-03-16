import React from "react";

// ── Primary Gradient Button ──────────────────────────────────────────────────
export function GradientButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl text-white transition-all duration-200 active:scale-95 shadow-lg ${className}`}
      style={{
        background: disabled
          ? "#ccc"
          : "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)",
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        boxShadow: disabled ? "none" : "0 8px 24px rgba(111,123,247,0.35)",
      }}
    >
      {children}
    </button>
  );
}

// ── Secondary Button ─────────────────────────────────────────────────────────
export function SecondaryButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${className}`}
      style={{
        borderColor: "#6F7BF7",
        color: "#6F7BF7",
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        background: "transparent",
      }}
    >
      {children}
    </button>
  );
}

// ── Session Card ─────────────────────────────────────────────────────────────
export function SessionCard({
  title,
  duration,
  technique,
  onPress,
  highlight = false,
}: {
  title: string;
  duration: string;
  technique: string;
  onPress?: () => void;
  highlight?: boolean;
}) {
  return (
    <div
      onClick={onPress}
      className="rounded-2xl p-4 cursor-pointer active:scale-95 transition-all duration-200"
      style={{
        background: highlight
          ? "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)"
          : "#FFFFFF",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="mb-1"
            style={{
              color: highlight ? "rgba(255,255,255,0.8)" : "#6B7280",
              fontFamily: "Inter",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {technique}
          </p>
          <h3
            style={{
              color: highlight ? "#FFFFFF" : "#1F2933",
              fontFamily: "Inter",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            {title}
          </h3>
        </div>
        <div
          className="px-3 py-1 rounded-xl ml-3"
          style={{
            background: highlight ? "rgba(255,255,255,0.25)" : "#F5F7FA",
          }}
        >
          <span
            style={{
              color: highlight ? "#FFFFFF" : "#6B7280",
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Category Card ─────────────────────────────────────────────────────────────
export function CategoryCard({
  title,
  count,
  emoji,
  color,
  onClick,
}: {
  title: string;
  count: number;
  emoji: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer active:scale-95 transition-all duration-200 flex-1"
      style={{ background: color, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <p
        style={{
          color: "#1F2933",
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        {title}
      </p>
      <p
        style={{
          color: "#6B7280",
          fontFamily: "Inter",
          fontSize: "12px",
          fontWeight: 400,
        }}
      >
        {count} sessions
      </p>
    </div>
  );
}

// ── Mood Button ───────────────────────────────────────────────────────────────
export function MoodButton({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 active:scale-95"
      style={{
        background: selected
          ? "linear-gradient(135deg, #6F7BF7 0%, #8BD3C7 100%)"
          : "#FFFFFF",
        boxShadow: selected
          ? "0 4px 16px rgba(111,123,247,0.35)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        minWidth: "60px",
      }}
    >
      <span className="text-xl">{emoji}</span>
      <span
        style={{
          color: selected ? "#FFFFFF" : "#6B7280",
          fontFamily: "Inter",
          fontSize: "11px",
          fontWeight: selected ? 600 : 400,
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Progress Card ─────────────────────────────────────────────────────────────
export function ProgressCard({
  label,
  value,
  unit,
  progress,
  color,
}: {
  label: string;
  value: string | number;
  unit?: string;
  progress: number;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 bg-white"
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
    >
      <p
        style={{
          color: "#6B7280",
          fontFamily: "Inter",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <div className="flex items-end gap-1 my-2">
        <span
          style={{
            color: "#1F2933",
            fontFamily: "Inter",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="mb-1"
            style={{ color: "#6B7280", fontFamily: "Inter", fontSize: "12px" }}
          >
            {unit}
          </span>
        )}
      </div>
      <div
        className="w-full h-2 rounded-full"
        style={{ background: "#F5F7FA" }}
      >
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Screen Container ──────────────────────────────────────────────────────────
export function ScreenContainer({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`min-h-screen overflow-y-auto ${className}`}
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#F5F7FA",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Input Field ───────────────────────────────────────────────────────────────
export function ZenInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}: {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          className="block mb-2"
          style={{
            color: "#1F2933",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-2xl border-0 outline-none transition-all duration-200 focus:ring-2"
          style={{
            background: "#FFFFFF",
            padding: icon ? "16px 16px 16px 48px" : "16px",
            color: "#1F2933",
            fontFamily: "Inter",
            fontSize: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            focusRingColor: "#6F7BF7",
          }}
        />
      </div>
    </div>
  );
}

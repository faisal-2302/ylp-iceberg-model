"use client";
import { useEffect, useState } from "react";

/** The signature motif: a 240° arc that fills. Used as gauge, progress, divider, loader, favicon. */
const START = 150; // degrees, measured clockwise from 3 o'clock
const SWEEP = 240;

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}
function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

type Props = {
  value: number; // 0–100
  /** earlier scores, oldest first: drawn as dots on the arc */
  trail?: number[];
  /** band thresholds from the deck: 50 and 80 */
  bands?: number[];
  label?: string;
  caption?: string;
  className?: string;
  tone?: "default" | "onNavy";
};

export default function Battery({ value, trail = [], bands = [50, 80], label, caption, className, tone = "default" }: Props) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const cx = 120, cy = 120, r = 96;
  const track = arcPath(cx, cy, r, START, START + SWEEP);
  const len = (Math.PI * r * SWEEP) / 180;
  const at = (v: number) => START + (SWEEP * Math.max(0, Math.min(100, v))) / 100;
  const trackColor = tone === "onNavy" ? "rgba(255,255,255,0.16)" : "var(--hair-strong)";
  const ink = tone === "onNavy" ? "var(--on-navy)" : "var(--ink)";
  const sub = tone === "onNavy" ? "var(--on-navy-muted)" : "var(--muted)";

  return (
    <figure className={className} style={{ margin: 0 }}>
      <svg viewBox="0 0 240 210" role="img" aria-label={`${label ?? "Trust battery"}: ${value} percent`} style={{ width: "100%", height: "auto", display: "block" }}>
        <path d={track} fill="none" stroke={trackColor} strokeWidth={10} strokeLinecap="round" />
        <path
          d={track}
          className="arc-fill"
          fill="none"
          stroke="var(--amber)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - shown / 100)}
        />
        {bands.map((b) => {
          const [x1, y1] = polar(cx, cy, r + 12, at(b));
          const [x2, y2] = polar(cx, cy, r + 20, at(b));
          return <line key={b} x1={x1} y1={y1} x2={x2} y2={y2} stroke={sub} strokeWidth={1.5} opacity={0.7} />;
        })}
        {trail.map((v, i) => {
          const [x, y] = polar(cx, cy, r, at(v));
          return <circle key={i} cx={x} cy={y} r={4} fill={ink} opacity={0.35 + (0.5 * (i + 1)) / (trail.length + 1)} />;
        })}
        <text x={cx} y={cy + 6} textAnchor="middle" fill={ink} style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 56, fontWeight: 500, fontVariationSettings: '"opsz" 40' }}>
          {Math.round(value)}
          <tspan style={{ fontSize: 22 }} dx={2} fill={sub}>%</tspan>
        </text>
        {label && (
          <text x={cx} y={cy + 34} textAnchor="middle" fill={sub} style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
            {label}
          </text>
        )}
      </svg>
      {caption && <figcaption style={{ textAlign: "center", color: sub, fontSize: 14, marginTop: -8 }}>{caption}</figcaption>}
    </figure>
  );
}

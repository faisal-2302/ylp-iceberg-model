/** MAIN = Moment, Action, Impact, Now — YLP Workbook p.14. */
export const W = 1080;
export const H = 1350;

export type Kind = "maestro" | "konnect";
export type DesignId = "navy" | "ink" | "paper";

export type CardData = {
  kind: Kind;
  to: string;
  from: string;
  moment: string;
  action: string;
  impact: string;
  now: string;
  thanks: string;
};

export const LIMIT = 180;

export const KIND_LABEL: Record<Kind, { name: string; who: string }> = {
  maestro: { name: "Maestro", who: "to someone in my team" },
  konnect: { name: "Konnect", who: "to a peer" },
};

export const PLACEHOLDER: CardData = {
  kind: "maestro",
  to: "Ravi",
  from: "Your manager",
  moment: "Last Tuesday, when you noticed the error before it left your desk.",
  action: "You stayed back and fixed it yourself instead of waiting for someone else to catch it.",
  impact: "We avoided a problem that could have affected the whole team’s reputation.",
  now: "I’m recognising this today while it’s still fresh, rather than waiting for the next review conversation.",
  thanks: "Thank you for taking ownership and protecting the team’s standards.",
};

export const DESIGNS: Record<DesignId, { label: string; bg: string; ink: string; muted: string; accent: string; hair: string; track: string }> = {
  navy:  { label: "Navy",  bg: "#1E2761", ink: "#F3F1EA", muted: "#B4B9D6", accent: "#FBB914", hair: "rgba(255,255,255,0.20)", track: "rgba(255,255,255,0.18)" },
  ink:   { label: "Ink",   bg: "#101014", ink: "#F3F1EA", muted: "#A4A4AD", accent: "#FBB914", hair: "rgba(255,255,255,0.14)", track: "rgba(255,255,255,0.14)" },
  paper: { label: "Paper", bg: "#F6F4EE", ink: "#14141A", muted: "#565661", accent: "#C58500", hair: "rgba(20,20,26,0.18)", track: "rgba(20,20,26,0.14)" },
};

/* ── Specificity check ─────────────────────────────────────
   Local first pass. The coach (step 5) replaces this with a real read. */
export type Check = { level: "block" | "nudge"; msg: string } | null;

const GENERIC = /\b(great job|good job|great work|good work|nice work|well done|keep it up|keep up the good work|excellent work|awesome|amazing job|superb|fantastic)\b/i;
const TRAIT = /\byou(?:'|’)?(?:re| are)\s+(?:so |very |really )?(?:hard-?working|smart|talented|dedicated|reliable|a (?:star|rockstar|great|good))\b/i;
const WHEN = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|yesterday|today|last (?:week|month|\w+day)|this (?:week|month)|when|during|after|before)\b|\d/i;

export function check(field: "moment" | "action" | "impact", text: string): Check {
  const t = text.trim();
  if (!t) return null;
  if (GENERIC.test(t) && t.length < 70)
    return { level: "block", msg: "That’s praise, not recognition. Say what they did. Not “Great job”, but “You stayed back and fixed it yourself instead of waiting for someone else to catch it.”" };
  if (field === "action" && TRAIT.test(t))
    return { level: "nudge", msg: "That describes who they are. Recognise a behaviour, not a personality trait: what did they do?" };
  if (field === "moment" && !WHEN.test(t))
    return { level: "nudge", msg: "Name the moment: when, and where? “Last Tuesday, when you noticed the error before it left your desk.”" };
  if (field === "action" && t.length < 30)
    return { level: "nudge", msg: "What did they actually do? One behaviour, in your own words." };
  if (field === "impact" && t.length < 30)
    return { level: "nudge", msg: "What did it make possible? The effect on the work, the team, a customer, or you." };
  return null;
}

export function readyToExport(d: CardData) {
  const filled = d.to.trim() && d.moment.trim() && d.action.trim() && d.impact.trim();
  const blocked = (["moment", "action", "impact"] as const).some((f) => check(f, d[f])?.level === "block");
  return Boolean(filled) && !blocked;
}

export function teamsText(d: CardData) {
  const lines = [
    `${KIND_LABEL[d.kind].name} recognition for ${d.to.trim()}`,
    "",
    `Moment: ${d.moment.trim()}`,
    `Action: ${d.action.trim()}`,
    `Impact: ${d.impact.trim()}`,
  ];
  if (d.now.trim()) lines.push(`Now: ${d.now.trim()}`);
  if (d.thanks.trim()) lines.push("", d.thanks.trim());
  if (d.from.trim()) lines.push("", `— ${d.from.trim()}`);
  return lines.join("\n");
}

/* ── Canvas rendering: the preview IS the export ──────────── */
type Fonts = { display: string; ui: string };

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function fit(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, maxW: number, tries: { px: number; lh: number; max: number }[]) {
  for (const t of tries) {
    ctx.font = font(t.px);
    const lines = wrap(ctx, text, maxW);
    if (lines.length <= t.max) return { ...t, lines };
  }
  const t = tries[tries.length - 1];
  ctx.font = font(t.px);
  const lines = wrap(ctx, text, maxW).slice(0, t.max);
  lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*\S*$/, "…");
  return { ...t, lines };
}

export function drawCard(ctx: CanvasRenderingContext2D, raw: CardData, design: DesignId, fonts: Fonts, preview: boolean) {
  const c = DESIGNS[design];
  const pad = 88;
  const innerW = W - pad * 2;

  const pick = (v: string, ph: string) => (v.trim() ? { t: v.trim(), dim: false } : { t: ph, dim: true });
  const d = {
    to: pick(raw.to, PLACEHOLDER.to),
    from: pick(raw.from, PLACEHOLDER.from),
    moment: pick(raw.moment, PLACEHOLDER.moment),
    action: pick(raw.action, PLACEHOLDER.action),
    impact: pick(raw.impact, PLACEHOLDER.impact),
    now: raw.now.trim() ? { t: raw.now.trim(), dim: false } : preview ? { t: PLACEHOLDER.now, dim: true } : null,
    thanks: raw.thanks.trim() ? { t: raw.thanks.trim(), dim: false } : preview ? { t: PLACEHOLDER.thanks, dim: true } : null,
  };

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";
  const alpha = (dim: boolean) => (dim ? 0.38 : 1);

  /* the motif, large and quiet in the corner */
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = 22;
  ctx.globalAlpha = 0.7;
  const cx = W + 150, cy = H + 40, R = 560;
  const a0 = (150 * Math.PI) / 180, a1 = (390 * Math.PI) / 180;
  ctx.strokeStyle = c.track;
  ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.stroke();
  ctx.restore();

  /* header: mark + kind */
  ctx.save();
  ctx.lineCap = "round"; ctx.lineWidth = 7;
  ctx.strokeStyle = c.track; ctx.beginPath(); ctx.arc(pad + 28, 112, 26, (150 * Math.PI) / 180, (390 * Math.PI) / 180); ctx.stroke();
  ctx.strokeStyle = c.accent; ctx.beginPath(); ctx.arc(pad + 28, 112, 26, (150 * Math.PI) / 180, (215 * Math.PI) / 180); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = c.muted;
  ctx.font = `600 24px ${fonts.ui}`;
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "5px";
  ctx.fillText(`${KIND_LABEL[raw.kind].name.toUpperCase()}  ·  RECOGNITION`, pad + 84, 121);
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";

  /* name */
  ctx.fillStyle = c.muted; ctx.font = `500 28px ${fonts.ui}`;
  ctx.fillText("For", pad, 232);
  let px = 104;
  const nameFont = (p: number) => `500 ${p}px ${fonts.display}`;
  ctx.font = nameFont(px);
  while (ctx.measureText(d.to.t).width > innerW && px > 52) { px -= 4; ctx.font = nameFont(px); }
  ctx.globalAlpha = alpha(d.to.dim); ctx.fillStyle = c.ink;
  ctx.fillText(d.to.t, pad, 232 + px * 0.98);
  ctx.globalAlpha = 1;

  /* four blocks */
  const blocks: [string, string, { t: string; dim: boolean } | null][] = [
    ["M", "MOMENT", d.moment], ["A", "ACTION", d.action], ["I", "IMPACT", d.impact], ["N", "NOW", d.now],
  ];
  const bodyX = pad + 112;
  const bodyW = W - pad - bodyX;
  let y = 440;
  const gap = 36;
  ctx.strokeStyle = c.hair; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(pad, y - 40); ctx.lineTo(W - pad, y - 40); ctx.stroke();

  for (const [letter, label, val] of blocks) {
    if (!val) { continue; }
    ctx.globalAlpha = alpha(val.dim);
    ctx.fillStyle = c.accent; ctx.font = `500 96px ${fonts.display}`;
    ctx.fillText(letter, pad, y + 80);
    ctx.fillStyle = c.muted; ctx.font = `600 20px ${fonts.ui}`;
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "4px";
    ctx.fillText(label, bodyX, y + 22);
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
    const f = fit(ctx, val.t, (p) => `400 ${p}px ${fonts.ui}`, bodyW, [
      { px: 33, lh: 45, max: 3 }, { px: 29, lh: 40, max: 4 }, { px: 26, lh: 36, max: 4 },
    ]);
    ctx.fillStyle = c.ink; ctx.font = `400 ${f.px}px ${fonts.ui}`;
    f.lines.forEach((ln, i) => ctx.fillText(ln, bodyX, y + 22 + 16 + f.px + i * f.lh));
    const h = Math.max(110, 22 + 16 + f.px + (f.lines.length - 1) * f.lh + 8);
    ctx.globalAlpha = 1;
    y += h + gap;
  }

  /* closing line */
  if (d.thanks) {
    const f = fit(ctx, d.thanks.t, (p) => `italic 400 ${p}px ${fonts.display}`, innerW, [
      { px: 38, lh: 52, max: 2 }, { px: 32, lh: 44, max: 2 },
    ]);
    ctx.globalAlpha = alpha(d.thanks.dim); ctx.fillStyle = c.ink;
    ctx.font = `italic 400 ${f.px}px ${fonts.display}`;
    const top = Math.min(y + 6, H - 150 - f.lines.length * f.lh);
    f.lines.forEach((ln, i) => ctx.fillText(ln, pad, top + f.px + i * f.lh));
    ctx.globalAlpha = 1;
  }

  /* footer */
  ctx.fillStyle = c.muted; ctx.font = `500 26px ${fonts.ui}`;
  ctx.globalAlpha = alpha(d.from.dim);
  ctx.fillText(`— ${d.from.t}`, pad, H - 76);
  ctx.globalAlpha = 1;
  ctx.font = `600 18px ${fonts.ui}`; ctx.textAlign = "right";
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "4px";
  ctx.fillText("ATOMBERG  ·  YLP", W - pad, H - 78);
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
  ctx.textAlign = "left";
}

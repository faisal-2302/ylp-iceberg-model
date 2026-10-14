"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CardData, DESIGNS, DesignId, H, Kind, KIND_LABEL, LIMIT, W, check, drawCard, readyToExport, teamsText } from "@/lib/mainCard";

const EMPTY: CardData = {
  kind: "maestro", to: "", from: "", moment: "", action: "", impact: "",
  now: "I’m recognising this today, while it’s still fresh.", thanks: "",
};

type FieldKey = "moment" | "action" | "impact";
const FIELDS: { key: FieldKey; letter: string; label: string; hint: string; ph: string }[] = [
  { key: "moment", letter: "M", label: "Moment", hint: "Which specific moment? Name the situation.", ph: "Last Tuesday, when you noticed the error before it left your desk." },
  { key: "action", letter: "A", label: "Action", hint: "What did they do? A behaviour, not a trait.", ph: "You stayed back and fixed it yourself instead of waiting for someone else to catch it." },
  { key: "impact", letter: "I", label: "Impact", hint: "Why did it matter? The effect on work, team, customer, or you.", ph: "We avoided a problem that could have affected the whole team’s reputation." },
];

export default function MainCardBuilder() {
  const [d, setD] = useState<CardData>(EMPTY);
  const [design, setDesign] = useState<DesignId>("navy");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [note, setNote] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const fonts = useRef({ display: "Georgia, serif", ui: "system-ui, sans-serif" });
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    fonts.current = {
      display: cs.getPropertyValue("--font-fraunces").trim() || fonts.current.display,
      ui: cs.getPropertyValue("--font-inter").trim() || fonts.current.ui,
    };
    const first = (f: string) => f.split(",")[0].trim();
    Promise.all([
      document.fonts.load(`500 80px ${first(fonts.current.display)}`),
      document.fonts.load(`italic 400 38px ${first(fonts.current.display)}`),
      document.fonts.load(`400 30px ${first(fonts.current.ui)}`),
      document.fonts.load(`600 20px ${first(fonts.current.ui)}`),
    ]).catch(() => {}).finally(() => setFontsReady(true));
  }, []);

  const render = useCallback((preview: boolean, target?: HTMLCanvasElement) => {
    const c = target ?? canvas.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) drawCard(ctx, d, design, fonts.current, preview);
  }, [d, design]);

  useEffect(() => { if (fontsReady) render(true); }, [fontsReady, render, tab]);

  const set = <K extends keyof CardData>(k: K, v: CardData[K]) => setD((p) => ({ ...p, [k]: v }));
  const ready = readyToExport(d);
  const checks = useMemo(() => Object.fromEntries(FIELDS.map((f) => [f.key, check(f.key, d[f.key])])), [d]);

  function exportBlob(): Promise<Blob | null> {
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    render(false, off);
    return new Promise((res) => off.toBlob(res, "image/png"));
  }
  const fileName = () => `recognition-${(d.to || "card").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;

  async function download() {
    const blob = await exportBlob(); if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = fileName(); a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  async function share() {
    const blob = await exportBlob(); if (!blob) return;
    const file = new File([blob], fileName(), { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], text: teamsText(d) }); return; } catch { return; }
    }
    await download();
    setNote("Saved. Open WhatsApp or Teams and attach it.");
  }
  async function copyText() {
    try { await navigator.clipboard.writeText(teamsText(d)); setNote("Copied. Paste it into Teams."); }
    catch { setNote("Couldn’t copy. Select the text and copy it manually."); }
  }

  const label: React.CSSProperties = { display: "block", marginBottom: 6, fontWeight: 600, fontSize: 15 };
  const hint: React.CSSProperties = { margin: "0 0 8px", color: "var(--muted)", fontSize: 14 };

  const form = (
    <div style={{ display: "grid", gap: 26 }}>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="eyebrow" style={{ marginBottom: 10 }}>Who is it for</legend>
        <div role="radiogroup" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
            <button key={k} role="radio" aria-checked={d.kind === k} onClick={() => set("kind", k)} className="chip"
              style={{ borderColor: d.kind === k ? "var(--amber)" : undefined, background: d.kind === k ? "var(--hair)" : undefined }}>
              <strong style={{ marginRight: 6 }}>{KIND_LABEL[k].name}</strong><span style={{ color: "var(--muted)" }}>{KIND_LABEL[k].who}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
        <div><label htmlFor="to" style={label}>Their name</label><input id="to" className="field" value={d.to} onChange={(e) => set("to", e.target.value)} placeholder="Ravi" maxLength={28} /></div>
        <div><label htmlFor="from" style={label}>Your name</label><input id="from" className="field" value={d.from} onChange={(e) => set("from", e.target.value)} placeholder="Your name" maxLength={28} /></div>
      </div>

      {FIELDS.map((f) => {
        const c = checks[f.key];
        return (
          <div key={f.key}>
            <label htmlFor={f.key} style={label}><span className="display" style={{ color: "var(--amber-ink)", marginRight: 8, fontSize: "1.2rem" }}>{f.letter}</span>{f.label}</label>
            <p style={hint}>{f.hint}</p>
            <textarea id={f.key} className="field" rows={3} maxLength={LIMIT} value={d[f.key]} placeholder={f.ph}
              onChange={(e) => set(f.key, e.target.value)} aria-describedby={`${f.key}-note`} />
            <div id={`${f.key}-note`} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 6, fontSize: 14 }}>
              <span style={{ color: c ? (c.level === "block" ? "var(--danger)" : "var(--amber-ink)") : "var(--faint)" }} role={c ? "status" : undefined}>{c?.msg ?? ""}</span>
              <span style={{ color: "var(--faint)", flexShrink: 0 }}>{d[f.key].length}/{LIMIT}</span>
            </div>
          </div>
        );
      })}

      <div>
        <label htmlFor="now" style={label}><span className="display" style={{ color: "var(--amber-ink)", marginRight: 8, fontSize: "1.2rem" }}>N</span>Now</label>
        <p style={hint}>Don’t wait. Recognition lands best when it’s timely.</p>
        <textarea id="now" className="field" rows={2} maxLength={LIMIT} value={d.now} onChange={(e) => set("now", e.target.value)} />
      </div>

      <div>
        <label htmlFor="thanks" style={label}>A closing line <span style={{ color: "var(--faint)", fontWeight: 400 }}>(optional)</span></label>
        <input id="thanks" className="field" maxLength={110} value={d.thanks} onChange={(e) => set("thanks", e.target.value)} placeholder="Thank you for taking ownership and protecting the team’s standards." />
      </div>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="eyebrow" style={{ marginBottom: 10 }}>Card design</legend>
        <div role="radiogroup" style={{ display: "flex", gap: 10 }}>
          {(Object.keys(DESIGNS) as DesignId[]).map((id) => (
            <button key={id} role="radio" aria-checked={design === id} onClick={() => setDesign(id)} className="chip" style={{ gap: 8, borderColor: design === id ? "var(--amber)" : undefined }}>
              <span aria-hidden style={{ width: 16, height: 16, borderRadius: 5, background: DESIGNS[id].bg, border: "1px solid var(--hair-strong)", display: "inline-block" }} />
              {DESIGNS[id].label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );

  const actions = (
    <div style={{ display: "grid", gap: 10 }}>
      <button className="btn btn-primary" disabled={!ready} onClick={share}>Share the card</button>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-ghost" disabled={!ready} onClick={download}>Download PNG</button>
        <button className="btn btn-ghost" disabled={!ready} onClick={copyText}>Copy text for Teams</button>
      </div>
      <p role="status" style={{ margin: 0, minHeight: 20, fontSize: 14, color: "var(--muted)" }}>
        {note || (ready ? "1080 × 1350 PNG. Sharp on a phone." : "Fill who, moment, action and impact to enable sharing.")}
      </p>
    </div>
  );

  const preview = (
    <div style={{ display: "grid", gap: 18 }}>
      <canvas ref={canvas} width={W} height={H} aria-label="Recognition card preview" style={{ width: "100%", maxWidth: 440, height: "auto", aspectRatio: `${W}/${H}`, borderRadius: 14, border: "1px solid var(--hair)", justifySelf: "center" }} />
      {actions}
    </div>
  );

  return (
    <div style={{ paddingTop: 12 }}>
      <header style={{ maxWidth: 720, marginBottom: 22 }}>
        <p className="eyebrow amber" style={{ margin: "0 0 10px" }}>Recognition</p>
        <h1 className="display h1" style={{ margin: "0 0 12px" }}>Write the card.</h1>
        <p style={{ margin: 0, color: "var(--muted)", maxWidth: "52ch" }}>Recognition is information, not reward. Be specific enough that they know exactly what to keep doing.</p>
      </header>

      <div className="tabs" role="tablist" aria-label="Card editor">
        {(["write", "preview"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="chip" style={{ flex: 1, justifyContent: "center", borderColor: tab === t ? "var(--amber)" : undefined }}>{t === "write" ? "Write" : "Preview"}</button>
        ))}
      </div>

      <div className="builder">
        <section className={tab === "write" ? "" : "hide-m"} aria-label="Write">{form}</section>
        <section className={`pane-preview ${tab === "preview" ? "" : "hide-m"}`} aria-label="Preview">{preview}</section>
      </div>

      <style>{`
        .tabs { display: flex; gap: 10px; margin-bottom: 22px; }
        .builder { display: grid; gap: 28px; }
        @media (max-width: 899px) { .hide-m { display: none; } }
        @media (min-width: 900px) {
          .tabs { display: none; }
          .builder { grid-template-columns: minmax(0, 1fr) 440px; gap: 64px; align-items: start; }
          .pane-preview { position: sticky; top: 16px; }
        }
      `}</style>
    </div>
  );
}

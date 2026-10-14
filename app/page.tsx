import Link from "next/link";
import Battery from "@/components/Battery";
import { ArcDivider } from "@/components/Arc";
import { SCENARIOS } from "@/content/scenarios";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 40, paddingTop: 12 }}>
      <section style={{ display: "grid", gap: 28 }} className="home-hero">
        <div style={{ alignSelf: "center" }}>
          <p className="eyebrow amber" style={{ margin: "0 0 14px" }}>Tuesday evening</p>
          <h1 className="display h1" style={{ margin: 0 }}>What’s happening<br />with your team?</h1>
          <form action="/scenarios" style={{ marginTop: 24, display: "grid", gap: 12 }}>
            <label htmlFor="q" className="eyebrow" style={{ display: "block" }}>Say it plainly</label>
            <textarea id="q" name="q" rows={3} className="field" placeholder="Two of my BDAs stopped talking after the review…" />
            <button className="btn btn-primary" type="submit" style={{ justifySelf: "start" }}>Find the move</button>
          </form>
          <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 10 }} aria-label="Common situations">
            {SCENARIOS.map((s) => (
              <Link key={s.slug} href={`/scenarios/${s.slug}`} className="chip">{s.title}</Link>
            ))}
            <Link href="/scenarios" className="chip" style={{ color: "var(--amber-ink)", borderColor: "transparent" }}>All situations →</Link>
          </div>
        </div>

        <aside className="card" style={{ background: "var(--navy)", borderColor: "transparent", padding: "28px 24px 24px", color: "var(--on-navy)" }}>
          <p className="eyebrow" style={{ margin: 0, color: "var(--on-navy-muted)" }}>Your trust battery</p>
          <div style={{ maxWidth: 300, margin: "8px auto 0" }}>
            <Battery value={50} tone="onNavy" label="Where every battery starts" />
          </div>
          <p style={{ margin: "4px 0 18px", textAlign: "center", color: "var(--on-navy-muted)", fontSize: 14.5, lineHeight: 1.5 }}>
            It starts at 50% when you first meet someone. Ten situations will show you where yours sits now.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link href="/do" className="btn btn-primary">Check my battery</Link>
          </div>
        </aside>
      </section>

      <ArcDivider />

      <section>
        <p className="eyebrow" style={{ margin: "0 0 12px" }}>Next up</p>
        <div style={{ display: "grid", gap: 12 }} className="next-grid">
          <Link href="/do/main-card" className="card press" style={{ padding: 20, textDecoration: "none", color: "var(--ink)", display: "block" }}>
            <p className="eyebrow amber" style={{ margin: "0 0 8px" }}>Recognition</p>
            <p className="display h2" style={{ margin: "0 0 6px" }}>Write a card for someone you never thanked</p>
            <p style={{ margin: 0, color: "var(--muted)" }}>Moment, Action, Impact, Now. Four lines, one image, ready to send.</p>
          </Link>
          <Link href="/scenarios/team-is-disengaged" className="card press" style={{ padding: 20, textDecoration: "none", color: "var(--ink)", display: "block" }}>
            <p className="eyebrow" style={{ margin: "0 0 8px" }}>Situation</p>
            <p className="display h2" style={{ margin: "0 0 6px" }}>My team is disengaged</p>
            <p style={{ margin: 0, color: "var(--muted)" }}>A two-minute read. Start with the Trust Battery.</p>
          </Link>
        </div>
      </section>

      <style>{`
        @media (min-width: 860px) {
          .home-hero { grid-template-columns: 1.15fr 0.85fr; gap: 56px !important; padding-top: 24px; }
          .next-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

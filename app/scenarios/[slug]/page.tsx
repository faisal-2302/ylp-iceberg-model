import Link from "next/link";
import { notFound } from "next/navigation";
import { ArcDivider } from "@/components/Arc";
import { SCENARIOS, bySlug } from "@/content/scenarios";

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ slug: s.slug }));
}

export default async function ScenarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = bySlug(slug);
  if (!s) notFound();
  const a = s.answer;

  const Block = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
    <section style={{ display: "grid", gap: 10 }}>
      <h2 className="eyebrow" style={{ margin: 0, display: "flex", gap: 10 }}>
        <span style={{ color: "var(--amber-ink)" }}>{n}</span>{title}
      </h2>
      {children}
    </section>
  );

  return (
    <article style={{ maxWidth: 720, paddingTop: 12, display: "grid", gap: 36 }}>
      <header>
        <Link href="/scenarios" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>← Situations</Link>
        <p className="eyebrow amber" style={{ margin: "22px 0 10px" }}>{s.group}</p>
        <h1 className="display h1" style={{ margin: 0 }}>{s.title}</h1>
      </header>

      <Block n="01" title="What’s actually going on">
        <div className="read"><p>{a.going_on}</p></div>
      </Block>

      <Block n="02" title="What not to do first">
        <div className="read"><p>{a.not_first}</p></div>
      </Block>

      <Block n="03" title="The move">
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 14 }} className="read">
          {a.move.map((m, i) => (
            <li key={i} style={{ display: "grid", gridTemplateColumns: "2.2rem 1fr", alignItems: "baseline" }}>
              <span className="display" style={{ color: "var(--amber-ink)", fontSize: "1.5rem" }}>{i + 1}</span>
              <span>{m}</span>
            </li>
          ))}
        </ol>
      </Block>

      <Block n="04" title="Words you can use">
        <div style={{ display: "grid", gap: 16, borderLeft: "2px solid var(--amber)", paddingLeft: 18 }}>
          {a.words.map((w, i) => <p key={i} className="quote" style={{ margin: 0 }}>{w}</p>)}
          {a.words_note && <p className="read" style={{ margin: 0, color: "var(--muted)" }}>{a.words_note}</p>}
        </div>
      </Block>

      <Block n="05" title="How you’ll know it worked">
        <div className="read"><p>{a.worked}</p></div>
      </Block>

      {a.watch_for && (
        <section className="card" style={{ padding: "20px 22px", borderColor: "var(--amber)" }} aria-label="Watch for">
          <h2 className="eyebrow amber" style={{ margin: "0 0 8px" }}>Watch for</h2>
          <p className="read" style={{ margin: 0 }}>{a.watch_for}</p>
        </section>
      )}

      <ArcDivider />

      <Block n="06" title="Go deeper">
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 10 }}>
          {a.deeper.map((d) => {
            const text = `${d.label}${d.workbookPage ? ` · Workbook p.${d.workbookPage}` : ""}`;
            return <li key={d.label}>{d.href ? <Link className="chip" href={d.href}>{text}</Link> : <span className="chip" style={{ cursor: "default", color: "var(--muted)" }}>{text}</span>}</li>;
          })}
        </ul>
      </Block>

      <div style={{ display: "grid", gap: 14, justifyItems: "start" }}>
        <Link href={`/coach?scenario=${s.slug}`} className="btn btn-primary">Talk it through →</Link>
        <p style={{ margin: 0, fontSize: 13, color: "var(--faint)" }}>Source: {s.source}</p>
      </div>
    </article>
  );
}

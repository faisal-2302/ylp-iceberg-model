import Link from "next/link";
import { SCENARIOS } from "@/content/scenarios";

export const metadata = { title: "Situations · YLP Coach" };

export default async function Scenarios({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const groups = [...new Set(SCENARIOS.map((s) => s.group))];
  return (
    <div style={{ display: "grid", gap: 28, paddingTop: 12, maxWidth: 720 }}>
      <header>
        <p className="eyebrow amber" style={{ margin: "0 0 10px" }}>Situations</p>
        <h1 className="display h1" style={{ margin: 0 }}>Pick the one that’s closest.</h1>
        {q && (
          <p style={{ color: "var(--muted)", marginTop: 14 }}>
            You wrote: “{q}”. Free-text matching and the live coach arrive with the coach build; for now, pick the nearest situation.
          </p>
        )}
      </header>
      {groups.map((g) => (
        <section key={g} aria-labelledby={g}>
          <h2 id={g} className="eyebrow" style={{ margin: "0 0 10px" }}>{g}</h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
            {SCENARIOS.filter((s) => s.group === g).map((s) => (
              <li key={s.slug}>
                <Link href={`/scenarios/${s.slug}`} className="card press" style={{ display: "block", padding: "18px 20px", textDecoration: "none", color: "var(--ink)" }}>
                  <span className="display" style={{ fontSize: "1.25rem" }}>{s.title}</span>
                  <span style={{ display: "block", color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{s.concepts.join(" · ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

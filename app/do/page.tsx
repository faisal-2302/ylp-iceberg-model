import Link from "next/link";

export const metadata = { title: "Make · YLP Coach" };

const TASKS = [
  { href: "/do/main-card", title: "Recognition card", line: "Moment, Action, Impact, Now. A card worth sending.", live: true },
  { title: "Development plan (IDP)", line: "Arrives next.", live: false },
  { title: "Career conversation prep", line: "Arrives next.", live: false },
  { title: "Trust Battery check", line: "Ten situations. Arrives with the practice build.", live: false },
];

export default function Do() {
  return (
    <div style={{ maxWidth: 720, paddingTop: 12, display: "grid", gap: 24 }}>
      <header>
        <p className="eyebrow amber" style={{ margin: "0 0 10px" }}>Make</p>
        <h1 className="display h1" style={{ margin: 0 }}>Build something you’ll actually use.</h1>
      </header>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {TASKS.map((t) => (
          <li key={t.title}>
            {t.live ? (
              <Link href={t.href!} className="card press" style={{ display: "block", padding: "18px 20px", textDecoration: "none", color: "var(--ink)" }}>
                <span className="display" style={{ fontSize: "1.25rem" }}>{t.title}</span>
                <span style={{ display: "block", color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{t.line}</span>
              </Link>
            ) : (
              <div className="card" style={{ padding: "18px 20px", opacity: 0.55 }}>
                <span className="display" style={{ fontSize: "1.25rem" }}>{t.title}</span>
                <span style={{ display: "block", color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{t.line}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArcMark } from "./Arc";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/scenarios", label: "Situations" },
  { href: "/coach", label: "Coach" },
  { href: "/learn", label: "Learn" },
  { href: "/do", label: "Make" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <div style={{ minHeight: "100dvh", paddingBottom: 84 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", maxWidth: 1040, margin: "0 auto" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ink)", textDecoration: "none" }}>
          <ArcMark />
          <span style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>YLP Coach</span>
        </Link>
        <ThemeToggle />
      </header>
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "8px 16px 40px" }}>{children}</main>
      <nav aria-label="Primary" style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "color-mix(in srgb, var(--canvas) 94%, transparent)", borderTop: "1px solid var(--hair)", zIndex: 10 }}>
        <ul style={{ display: "flex", justifyContent: "space-around", maxWidth: 560, margin: "0 auto", padding: "0 8px env(safe-area-inset-bottom)", listStyle: "none" }}>
          {NAV.map((n) => (
            <li key={n.href} style={{ flex: 1 }}>
              <Link href={n.href} aria-current={active(n.href) ? "page" : undefined} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 0 14px", minHeight: 56, fontSize: 12.5, fontWeight: active(n.href) ? 600 : 500, color: active(n.href) ? "var(--ink)" : "var(--muted)", textDecoration: "none" }}>
                <span aria-hidden style={{ width: 18, height: 3, borderRadius: 3, background: active(n.href) ? "var(--amber)" : "transparent" }} />
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

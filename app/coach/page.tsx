import { ArcLoader } from "@/components/Arc";

export const metadata = { title: "Coach · YLP Coach" };

export default function Page() {
  return (
    <div style={{ maxWidth: 720, paddingTop: 48, display: "grid", gap: 18, justifyItems: "start" }}>
      <ArcLoader />
      <h1 className="display h1" style={{ margin: 0 }}>The coach is next.</h1>
      <p className="read" style={{ color: "var(--muted)" }}>Not built yet. This screen is a placeholder so the navigation is honest.</p>
    </div>
  );
}

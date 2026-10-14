"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  function flip() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("ylp-theme", next); } catch {}
    setTheme(next);
  }
  return (
    <button onClick={flip} className="chip press" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} style={{ minHeight: 40, padding: "0 0.9rem", fontSize: "0.8rem" }}>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

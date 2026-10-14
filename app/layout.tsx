import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Shell from "@/components/Shell";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz"], style: ["normal", "italic"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "YLP Coach",
  description: "A pocket leadership coach for Atomberg's Young Leaders Programme alumni.",
};
export const viewport: Viewport = { themeColor: "#101014", width: "device-width", initialScale: 1 };

const themeScript = `try{var t=localStorage.getItem('ylp-theme');if(t)document.documentElement.dataset.theme=t;else if(matchMedia('(prefers-color-scheme: light)').matches)document.documentElement.dataset.theme='light'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}

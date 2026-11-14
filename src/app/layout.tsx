import type { Metadata } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { profile, summary } from "@/lib/content";
import "./globals.css";

const sans = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: summary,
  keywords: [
    "FinTech developer",
    "digital lending",
    "loan origination",
    "full-stack developer",
    "Go",
    "Golang",
    "React",
    "TypeScript",
    "MySQL",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}

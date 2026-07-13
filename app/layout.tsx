import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://electroneyto.github.io/CineSentIA/"),
  title: "CineSentIA · Analizador de críticas de cine",
  description: "Analiza el sentimiento, la recomendación y los aspectos de críticas de cine y series en español.",
  authors: [{ name: "Miguel Angel Lozada Torrico" }],
  openGraph: {
    title: "CineSentIA",
    description: "Análisis inteligente de críticas de cine en español.",
    type: "website",
    images: [{ url: "og.png", width: 1200, height: 630, alt: "CineSentIA · Análisis inteligente de críticas de cine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CineSentIA",
    description: "Análisis inteligente de críticas de cine en español.",
    images: ["og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}

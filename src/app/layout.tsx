import type { Metadata } from "next";
import {
  Inter,
  Instrument_Serif,
  Noto_Serif_Devanagari,
  Noto_Serif_Gurmukhi,
  Noto_Serif_JP,
} from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Indic-script support so the cycling greeting renders the same family in
   Devanagari (Hindi) and Gurmukhi (Punjabi). Noto's serif faces pair
   visually well with Instrument Serif. */
const notoDevanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500"],
  display: "swap",
});

const notoGurmukhi = Noto_Serif_Gurmukhi({
  variable: "--font-gurmukhi",
  subsets: ["gurmukhi"],
  weight: ["400", "500"],
  display: "swap",
});

const notoJP = Noto_Serif_JP({
  variable: "--font-jp",
  weight: ["400"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Armaan Sekhon — Software Developer",
  description: "Software developer crafting mobile, web, and AI experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${notoDevanagari.variable} ${notoGurmukhi.variable} ${notoJP.variable}`}
    >
      <body>
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

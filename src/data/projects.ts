/**
 * Project roster — single source of truth for the Work section.
 *
 * Screenshots: drop 2–4 images per project at /public/projects/<slug>-1.jpg …
 * They cross-fade with a Ken Burns drift so stills read as motion.
 * Until they exist, the Phone shows a branded gradient fallback automatically.
 *
 * Image specs: vertical phone screenshots (≈1080×2340 / 9:19.5), .jpg or .webp,
 * < 300 KB each. A single image also works (it'll just Ken Burns, no cross-fade).
 *
 * TODO(Armaan): confirm Bloom + Estate taglines/category/brandColor/year.
 */
export interface Project {
  slug: string;
  number: string;
  name: string;
  category: string;
  year: number;
  brandColor: string;          // fallback screen gradient + mobile strip
  tagline: string;             // one-line shown under the name / in preview
  summary?: string;            // 1–2 sentences shown in the hover "About" panel
  stack?: string[];
  links?: { ios?: string; android?: string; web?: string };
  screens?: string[];          // /projects/<slug>-1.jpg, -2.jpg … (cross-faded)
  comingSoon?: boolean;
}

export const projects: Project[] = [
  {
    slug: "epic",
    number: "01",
    name: "Epic",
    category: "Voice / Social",
    year: 2025,
    brandColor: "#F2B705",
    tagline: "A daily-prompt voice app — record a 15s take, get a Vibe Score, climb the leaderboard.",
    summary:
      "Each day brings a wild prompt. Record a 15-second voice take, the community reacts, and you earn a Vibe Score and a leaderboard spot. Built with reliable audio recording, playback, and one-tap sharing.",
    stack: ["React Native CLI", "Reanimated", "Firebase", "Sentry"],
    links: {
      // TODO: real store links
      ios: "https://apps.apple.com/",
      android: "https://play.google.com/store",
    },
    screens: [
      "/projects/epic-1.jpg",
      "/projects/epic-2.jpg",
      "/projects/epic-3.jpg",
      "/projects/epic-4.jpg",
    ],
  },
  {
    slug: "randavu",
    number: "02",
    name: "Randavu",
    category: "Community / Social",
    year: 2025,
    brandColor: "#E63329",
    tagline: "A car & sneaker community — social feed, events, a live map, and marketplace listings.",
    summary:
      "A community app for car and sneaker culture: an Instagram-style feed, real-world events and meetups, a live map of members, and a marketplace for listings — with real-time interactions and an interactive map.",
    stack: ["React Native", "Redux Toolkit", "Firebase", "Mapbox"],
    screens: [
      "/projects/randavu-1.jpg",
      "/projects/randavu-2.jpg",
      "/projects/randavu-3.jpg",
      "/projects/randavu-4.jpg",
    ],
  },
  {
    slug: "bloom",
    number: "03",
    name: "Bloom",
    category: "Casual Game",
    year: 2025,
    brandColor: "#C7A2FF",
    tagline: "A cozy flower-matching puzzle game — grow your garden across whimsical worlds.",
    summary:
      "A casual match puzzle: clear boards, grow your garden, and progress through whimsical worlds with coins, lives, and star goals — wrapped in smooth animations and a polished casual-game economy.",
    stack: ["React Native", "Expo", "Firebase"],
    screens: [
      "/projects/bloom-1.jpg",
      "/projects/bloom-2.jpg",
      "/projects/bloom-3.jpg",
      "/projects/bloom-4.jpg",
    ],
  },
  {
    slug: "estate",
    number: "04",
    name: "Estate",
    category: "Real Estate CRM",
    year: 2025,
    brandColor: "#3FBF5F",
    tagline: "An all-in-one real-estate CRM — properties, leads, HR, payroll, and maps in one app.",
    summary:
      "A deep, role-based real-estate CRM and ERP shipped end to end: dashboards, lead capture, customer management, attendance, payroll generation, and a property map — the company's whole workflow in one app.",
    stack: ["React Native", "Redux Toolkit", "Maps", "REST APIs"],
    screens: [
      "/projects/estate-1.jpg",
      "/projects/estate-2.jpg",
      "/projects/estate-3.jpg",
      "/projects/estate-4.jpg",
      "/projects/estate-5.jpg",
    ],
  },
  {
    slug: "augerr",
    number: "05",
    name: "Augerr",
    category: "Dev tools",
    year: 2026,
    brandColor: "#C7B6FF",
    tagline: "A debugger for AI agents in React Native.",
    summary:
      "A developer tool to debug AI agents in React Native — inspect agent steps, tool calls, and state in real time. Currently in development.",
    stack: ["React Native", "AI agents"],
    comingSoon: true,
  },
];

/**
 * Résumé content — mirrors Armaan's PDF (public/resume.pdf).
 * Order of `resumeFolds` is the order the folds reveal on scroll.
 */

export interface ExperienceEntry {
  role: string;
  company: string;
  dates: string;
  location?: string;
  bullets: string[];
}

export interface EducationEntry {
  school: string;
  credential: string;
  dates: string;
  detail?: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface ProjectEntry {
  name: string;
  dates: string;
  stack: string[];
  bullets: string[];
}

export type ResumeFold =
  | {
      label: string;
      eyebrow: string;
      title: string;
      kind: "summary";
      summary: string;
      meta?: string[];
    }
  | {
      label: string;
      eyebrow: string;
      title: string;
      kind: "experience";
      experience: ExperienceEntry[];
    }
  | {
      label: string;
      eyebrow: string;
      title: string;
      kind: "projects";
      projects: ProjectEntry[];
    }
  | {
      label: string;
      eyebrow: string;
      title: string;
      kind: "education";
      education: EducationEntry[];
    }
  | {
      label: string;
      eyebrow: string;
      title: string;
      kind: "skills";
      skills: SkillGroup[];
    };

/** Letterhead for the printed-paper résumé. */
export const resumeHeader = {
  name: "Armaan Singh",
  title: "React & React Native Engineer",
  contacts: [
    "Chandigarh, India",
    "+91 88470 98956",
    "armaansekhon6560@gmail.com",
    "linkedin.com/in/armaan02",
  ],
};

/** Short profile facts (kept for reference / future use). */
export const resumeProfile = {
  location: "Chandigarh, India",
  relocation: "Open to relocation",
  current: "Software Engineer @ CodeBrew Labs",
  focus: "React · React Native · Agentic AI",
  experienceYears: "Shipping since 2025",
};

/** Headline technologies (keys map into src/data/techIcons.ts). */
export const resumeTech: string[] = [
  "React",
  "React Native",
  "Next.js",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "Firebase",
  "MongoDB",
  "Redux",
  "Expo",
  "Claude",
  "GitHub Actions",
];

export const resumeFolds: ResumeFold[] = [
  {
    label: "01",
    eyebrow: "Profile",
    title: "Summary",
    kind: "summary",
    summary:
      "React & React Native engineer who builds and ships customer-facing products end to end — from component-based React architectures to mobile apps and backend services. An early, deliberate adopter of agentic engineering: I use AI coding agents (Claude Code, Cursor) as daily thought partners to onboard fast and ship with verification habits built in. Experienced with A/B testing, feature flags, CI/CD, and solid automated testing — owning features from hypothesis to live release in days, not weeks.",
    meta: ["Chandigarh, India", "Open to relocation", "Full-stack mindset"],
  },
  {
    label: "02",
    eyebrow: "Where I've worked",
    title: "Experience",
    kind: "experience",
    experience: [
      {
        role: "Software Engineer",
        company: "CodeBrew Labs",
        dates: "Jan 2026 — Present",
        location: "India",
        bullets: [
          "Build scalable React.js and React Native apps with component-based + server-driven UI patterns and TypeScript across the stack.",
          "Use AI coding agents (Claude Code, Cursor) daily to onboard onto unfamiliar code and accelerate delivery — with disciplined habits for verifying AI output.",
          "Contribute full-stack, integrating frontend with backend services and APIs for seamless end-to-end features.",
        ],
      },
      {
        role: "Software Developer — Mobile & Full-Stack",
        company: "Codobux Pvt. Ltd",
        dates: "Jun 2025 — Dec 2025",
        location: "Mohali, India",
        bullets: [
          "Core and sole frontend developer for multiple production apps from scratch (RN CLI, Expo, TypeScript, Redux Toolkit, Firebase).",
          "Designed, deployed, and maintained EpicVoicemails — owning the full lifecycle from architecture to App Store release.",
          "Ran A/B tests + feature flags (Firebase Remote Config) and set up CI/CD with GitHub Actions and Fastlane / EAS Build.",
        ],
      },
      {
        role: "Software Engineer Intern",
        company: "Pisoft Informatics Pvt. Ltd",
        dates: "Jan 2025 — May 2025",
        location: "Mohali, India",
        bullets: [
          "Built responsive, animated React.js components for the official Pisoft website with TypeScript and Framer Motion, partnering closely with designers in Figma.",
        ],
      },
    ],
  },
  {
    label: "03",
    eyebrow: "Selected builds",
    title: "Projects",
    kind: "projects",
    projects: [
      {
        name: "Vivelon — Shopify AI & WhatsApp Automation",
        dates: "Jan 2026 — Present",
        stack: ["Next.js", "Hono.js", "TypeScript", "OpenAI", "GraphQL"],
        bullets: [
          "Full-stack system: an internal admin dashboard (Next.js + Hono.js) and an AI-powered WhatsApp chatbot (OpenAI + Twilio) for automated support.",
          "Authored GraphQL APIs + Shopify Webhooks for real-time store sync; integrated Mailchimp + WhatsApp for automated workflows.",
        ],
      },
      {
        name: "EpicVoicemails — Voice Gaming App",
        dates: "Aug — Oct 2025",
        stack: ["React Native CLI", "Redux", "Reanimated", "Firebase", "Sentry"],
        bullets: [
          "Engineered a complex audio system: playback, recording, real-time sharing, and one-click audio-to-video export for Instagram, TikTok, and YouTube.",
          "Integrated in-app purchases, subscriptions, and ads; Maestro E2E + unit tests to cut production regressions.",
        ],
      },
      {
        name: "Randavu — Social Networking App",
        dates: "Jul — Sep 2025",
        stack: ["React Native", "Redux Toolkit", "Firebase", "Mapbox"],
        bullets: [
          "Instagram-like interactive feed and real-time chat with Firebase + Redux Toolkit.",
          "Advanced Mapbox map with live waypoints and event-based meetups.",
        ],
      },
    ],
  },
  {
    label: "04",
    eyebrow: "Foundations",
    title: "Education",
    kind: "education",
    education: [
      {
        school: "Punjabi University, Guru Kashi Campus",
        credential: "B.Tech, Computer Science",
        dates: "Aug 2021 — May 2025",
        detail: "Talwandi Sabo, Punjab · GPA 8.5",
      },
    ],
  },
  {
    label: "05",
    eyebrow: "What I bring",
    title: "Skills",
    kind: "skills",
    skills: [
      { group: "Frontend & Mobile", items: ["React.js", "React Native (CLI & Expo)", "Next.js", "Redux Toolkit", "TypeScript"] },
      { group: "Backend & APIs", items: ["Node.js (Express)", "Hono.js", "GraphQL", "REST", "Firebase", "MongoDB", "MySQL"] },
      { group: "Agentic Engineering", items: ["Claude Code", "Cursor", "AI-assisted workflows", "OpenAI"] },
      { group: "Testing & CI/CD", items: ["Jest", "React Testing Library", "Maestro (E2E)", "GitHub Actions", "Fastlane", "EAS Build"] },
      { group: "Experimentation", items: ["A/B Testing", "Feature Flags", "Firebase Remote Config"] },
    ],
  },
];

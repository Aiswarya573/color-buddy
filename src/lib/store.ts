import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "ta" | "hi" | "ml";

export type Settings = {
  lang: Lang;
  voiceSpeed: number;
  kidMode: boolean;
  dark: boolean;
  sound: boolean;
  childName: string;
  onboarded: boolean;
};

export type Stats = {
  learned: Record<string, number>;
  correct: number;
  attempts: number;
  secondsSpent: number;
  lastActive: string;
  streak: number;
  history: { date: string; learned: number; score: number }[];
  scores: { find: number; match: number; memory: number; speed: number };
  badges: string[];
  cameraUses: number;
};

type Store = {
  settings: Settings;
  stats: Stats;
  setSettings: (s: Partial<Settings>) => void;
  learnColor: (name: string) => void;
  recordAttempt: (correct: boolean) => void;
  addTime: (s: number) => void;
  setScore: (game: keyof Stats["scores"], score: number) => void;
  unlockBadge: (b: string) => void;
  bumpCamera: () => void;
  reset: () => void;
  checkBadges: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

const initialStats: Stats = {
  learned: {},
  correct: 0,
  attempts: 0,
  secondsSpent: 0,
  lastActive: today(),
  streak: 1,
  history: [],
  scores: { find: 0, match: 0, memory: 0, speed: 0 },
  badges: [],
  cameraUses: 0,
};

const initialSettings: Settings = {
  lang: "en",
  voiceSpeed: 1,
  kidMode: true,
  dark: false,
  sound: true,
  childName: "Friend",
  onboarded: false,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      settings: initialSettings,
      stats: initialStats,
      setSettings: (s) => set({ settings: { ...get().settings, ...s } }),
      learnColor: (name) => {
        const stats = { ...get().stats };
        stats.learned[name] = (stats.learned[name] || 0) + 1;
        const d = today();
        if (stats.lastActive !== d) {
          const prev = new Date(stats.lastActive);
          const diff = (Date.now() - prev.getTime()) / 86400000;
          stats.streak = diff < 2 ? stats.streak + 1 : 1;
          stats.lastActive = d;
        }
        const todayEntry = stats.history.find((h) => h.date === d);
        if (todayEntry) todayEntry.learned += 1;
        else stats.history.push({ date: d, learned: 1, score: 0 });
        if (stats.history.length > 14) stats.history = stats.history.slice(-14);
        set({ stats });
        get().checkBadges();
      },
      recordAttempt: (correct) => {
        const stats = { ...get().stats };
        stats.attempts += 1;
        if (correct) stats.correct += 1;
        set({ stats });
      },
      addTime: (s) => set({ stats: { ...get().stats, secondsSpent: get().stats.secondsSpent + s } }),
      setScore: (game, score) => {
        const stats = { ...get().stats };
        if (score > stats.scores[game]) stats.scores[game] = score;
        const d = today();
        const e = stats.history.find((h) => h.date === d);
        if (e) e.score += score;
        else stats.history.push({ date: d, learned: 0, score });
        set({ stats });
        get().checkBadges();
      },
      unlockBadge: (b) => {
        const stats = { ...get().stats };
        if (!stats.badges.includes(b)) {
          stats.badges.push(b);
          set({ stats });
        }
      },
      bumpCamera: () => {
        const stats = { ...get().stats, cameraUses: get().stats.cameraUses + 1 };
        set({ stats });
        get().checkBadges();
      },
      checkBadges: () => {
        const s = get().stats;
        const learnedCount = Object.keys(s.learned).length;
        const map: [string, boolean][] = [
          ["Color Explorer", learnedCount >= 10],
          ["Fast Learner", learnedCount >= 25],
          ["Color Master", learnedCount >= 50],
          ["Camera Expert", s.cameraUses >= 10],
          ["Game Winner", s.scores.find + s.scores.match + s.scores.memory + s.scores.speed >= 50],
        ];
        for (const [b, ok] of map) if (ok) get().unlockBadge(b);
      },
      reset: () => set({ stats: initialStats }),
    }),
    { name: "color-buddy-store" }
  )
);

import type { Lang } from "./store";

const langMap: Record<Lang, string> = { en: "en-US", ta: "ta-IN", hi: "hi-IN", ml: "ml-IN" };

export const speak = (text: string, opts: { lang?: Lang; rate?: number; enabled?: boolean } = {}) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (opts.enabled === false) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langMap[opts.lang || "en"];
    u.rate = opts.rate ?? 1;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {}
};

export const beep = (freq = 660, ms = 120, enabled = true) => {
  if (!enabled || typeof window === "undefined") return;
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = freq;
    o.type = "sine";
    g.gain.value = 0.08;
    o.connect(g).connect(ctx.destination);
    o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, ms);
  } catch {}
};

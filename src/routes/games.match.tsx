import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { COLORS } from "@/lib/colors";
import { useStore } from "@/lib/store";
import { speak, beep } from "@/lib/tts";
import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/games/match")({ component: MatchGame });

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function MatchGame() {
  const { settings, setScore, recordAttempt } = useStore();
  const [items, setItems] = useState(() => shuffle(COLORS).slice(0, 5));
  const [labels, setLabels] = useState(() => shuffle(items));
  const [solved, setSolved] = useState<string[]>([]);
  const [drag, setDrag] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [score, setS] = useState(0);

  const reset = () => {
    const next = shuffle(COLORS).slice(0, 5);
    setItems(next); setLabels(shuffle(next)); setSolved([]); setDrag(null); setHover(null);
  };

  useEffect(() => {
    if (solved.length === items.length && items.length > 0) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      speak("All matched! Amazing!", { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound });
      setTimeout(reset, 1500);
    }
  }, [solved.length]);

  const tryDrop = (target: string) => {
    if (!drag) return;
    if (drag === target) {
      const ns = score + 5;
      setS(ns);
      setSolved((s) => [...s, target]);
      recordAttempt(true);
      beep(880, 100, settings.sound);
      speak(target, { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound });
    } else {
      recordAttempt(false);
      beep(220, 160, settings.sound);
    }
    setDrag(null); setHover(null);
  };

  useEffect(() => { setScore("match", score); }, [score, setScore]);

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/games" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Drag & Match</h1>
          <span className="ml-auto rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground">★ {score}</span>
          <button onClick={reset} className="rounded-full bg-card p-2 shadow-soft"><RotateCcw className="h-4 w-4" /></button>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">Drag the name onto the matching color</p>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {items.map((c) => {
            const done = solved.includes(c.name);
            return (
              <div
                key={c.name}
                onDragOver={(e) => { e.preventDefault(); setHover(c.name); }}
                onDragLeave={() => setHover((h) => (h === c.name ? null : h))}
                onDrop={() => tryDrop(c.name)}
                onTouchEnd={() => tryDrop(c.name)}
                className={`aspect-square rounded-2xl shadow-soft transition ${hover === c.name ? "scale-110 ring-4 ring-primary" : ""} ${done ? "opacity-30" : ""}`}
                style={{ background: c.hex }}
              />
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {labels.map((c) => {
            const done = solved.includes(c.name);
            if (done) return null;
            return (
              <button
                key={c.name}
                draggable
                onDragStart={() => setDrag(c.name)}
                onTouchStart={() => setDrag(c.name)}
                className={`cursor-grab select-none rounded-2xl bg-card px-4 py-2.5 text-sm font-bold shadow-pop active:scale-95 ${drag === c.name ? "ring-4 ring-primary" : ""}`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        {drag && (
          <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
            Now tap the matching color box
          </p>
        )}
      </div>
    </AppLayout>
  );
}

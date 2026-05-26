import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { COLORS } from "@/lib/colors";
import { useStore } from "@/lib/store";
import { speak, beep } from "@/lib/tts";
import { useEffect, useState } from "react";
import { ArrowLeft, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/games/find")({ component: FindGame });

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function FindGame() {
  const { settings, setScore, recordAttempt } = useStore();
  const [round, setRound] = useState(0);
  const [score, setS] = useState(0);
  const [choices, setChoices] = useState(() => shuffle(COLORS).slice(0, 6));
  const [target, setTarget] = useState(() => choices[0]);
  const [wrong, setWrong] = useState<string | null>(null);

  useEffect(() => {
    const opts = shuffle(COLORS).slice(0, 6);
    const tgt = opts[Math.floor(Math.random() * 6)];
    setChoices(opts);
    setTarget(tgt);
    setWrong(null);
    setTimeout(() => speak(`Find ${tgt.name}`, { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound }), 250);
  }, [round]);

  const pick = (name: string) => {
    if (name === target.name) {
      const ns = score + 5;
      setS(ns);
      recordAttempt(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      beep(880, 140, settings.sound);
      speak("Correct!", { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound });
      setTimeout(() => setRound((r) => r + 1), 700);
    } else {
      setWrong(name);
      recordAttempt(false);
      beep(220, 180, settings.sound);
      setTimeout(() => setWrong(null), 500);
    }
  };

  useEffect(() => () => { setScore("find", score); }, []);
  useEffect(() => { setScore("find", score); }, [score, setScore]);

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/games" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Find the Color</h1>
          <span className="ml-auto rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground">★ {score}</span>
        </div>

        <div className="mt-6 rounded-3xl bg-gradient-to-br from-fun-pink to-fun-purple p-6 text-center text-white shadow-pop">
          <p className="text-sm opacity-90">Tap the color</p>
          <p className="mt-1 font-display text-4xl font-extrabold">{target.name}</p>
          <button
            onClick={() => speak(`Find ${target.name}`, { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound })}
            className="mx-auto mt-3 flex items-center gap-1 rounded-full bg-white/25 px-3 py-1.5 text-xs font-bold"
          >
            <Volume2 className="h-3 w-3" /> Hear again
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {choices.map((c) => (
            <button
              key={c.name}
              onClick={() => pick(c.name)}
              className={`aspect-square rounded-3xl shadow-pop transition active:scale-95 ${wrong === c.name ? "animate-wiggle ring-4 ring-destructive" : ""}`}
              style={{ background: c.hex }}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

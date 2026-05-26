import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { COLORS } from "@/lib/colors";
import { useStore } from "@/lib/store";
import { speak, beep } from "@/lib/tts";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/games/speed")({ component: SpeedGame });

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function SpeedGame() {
  const { settings, setScore, recordAttempt } = useStore();
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [score, setS] = useState(0);
  const [round, setRound] = useState(0);
  const [choices, setChoices] = useState(() => shuffle(COLORS).slice(0, 4));
  const [target, setTarget] = useState(() => choices[0]);
  const [level, setLevel] = useState(1);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const newRound = () => {
    const opts = shuffle(COLORS).slice(0, 4 + Math.min(2, Math.floor(score / 25)));
    const t = opts[Math.floor(Math.random() * opts.length)];
    setChoices(opts); setTarget(t);
  };

  const start = () => {
    setS(0); setTime(30); setRound(0); setLevel(1);
    setRunning(true);
    newRound();
  };

  useEffect(() => { newRound(); }, [round]);

  useEffect(() => {
    if (!running) return;
    tick.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) { clearInterval(tick.current!); setRunning(false); finish(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [running]);

  const finish = () => {
    setScore("speed", score);
    if (score >= 30) confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    speak(`Time up. You scored ${score}`, { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound });
  };

  const pick = (name: string) => {
    if (!running) return;
    if (name === target.name) {
      setS((s) => { const ns = s + 2; setLevel(Math.floor(ns / 10) + 1); return ns; });
      recordAttempt(true);
      beep(900, 80, settings.sound);
      setRound((r) => r + 1);
    } else {
      setTime((t) => Math.max(0, t - 2));
      recordAttempt(false);
      beep(220, 140, settings.sound);
    }
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/games" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Speed Challenge</h1>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Time" value={`${time}s`} />
          <Stat label="Score" value={`★ ${score}`} />
          <Stat label="Level" value={`L${level}`} />
        </div>

        {running ? (
          <>
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-fun-yellow to-fun-orange p-6 text-center shadow-pop">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary-foreground/70">Tap</p>
              <p className="font-display text-4xl font-extrabold text-secondary-foreground">{target.name}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {choices.map((c) => (
                <button
                  key={c.name}
                  onClick={() => pick(c.name)}
                  className="aspect-square rounded-3xl shadow-pop transition active:scale-95"
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 text-center">
            <div className="mb-4 text-7xl">⚡</div>
            {time === 0 && <p className="mb-4 text-lg font-extrabold">Final Score: ★ {score}</p>}
            <button
              onClick={start}
              className="mx-auto flex items-center gap-2 rounded-3xl bg-gradient-to-r from-fun-pink to-fun-purple px-6 py-4 text-lg font-extrabold text-white shadow-pop active:scale-95"
            >
              <Play className="h-5 w-5" /> {time === 0 ? "Play Again" : "Start"}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-soft">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-extrabold">{value}</p>
    </div>
  );
}

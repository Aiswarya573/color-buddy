import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { COLORS } from "@/lib/colors";
import { useStore } from "@/lib/store";
import { speak, beep } from "@/lib/tts";
import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/games/memory")({ component: MemoryGame });

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

type Card = { id: number; name: string; hex: string };

function MemoryGame() {
  const { settings, setScore } = useStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setS] = useState(0);

  const start = () => {
    const picks = shuffle(COLORS).slice(0, 8);
    const deck: Card[] = shuffle(
      picks.flatMap((c, i) => [
        { id: i * 2, name: c.name, hex: c.hex },
        { id: i * 2 + 1, name: c.name, hex: c.hex },
      ])
    );
    setCards(deck); setFlipped([]); setMatched([]); setMoves(0); setS(0);
  };

  useEffect(() => { start(); }, []);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const ca = cards.find((c) => c.id === a)!;
    const cb = cards.find((c) => c.id === b)!;
    setMoves((m) => m + 1);
    if (ca.name === cb.name) {
      setMatched((m) => [...m, ca.name]);
      setS((s) => s + 5);
      beep(880, 100, settings.sound);
      speak(ca.name, { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound });
      setTimeout(() => setFlipped([]), 500);
    } else {
      beep(220, 160, settings.sound);
      setTimeout(() => setFlipped([]), 800);
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length / 2) {
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
      speak("You won!", { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound });
    }
  }, [matched.length, cards.length]);

  useEffect(() => { setScore("memory", score); }, [score, setScore]);

  const flip = (id: number) => {
    const c = cards.find((c) => c.id === id);
    if (!c || matched.includes(c.name) || flipped.includes(id) || flipped.length === 2) return;
    setFlipped((f) => [...f, id]);
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/games" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Memory Match</h1>
          <span className="ml-auto rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground">★ {score}</span>
          <button onClick={start} className="rounded-full bg-card p-2 shadow-soft"><RotateCcw className="h-4 w-4" /></button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Moves: {moves} · Pairs: {matched.length}/{cards.length / 2}</p>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {cards.map((c) => {
            const open = flipped.includes(c.id) || matched.includes(c.name);
            return (
              <button
                key={c.id}
                onClick={() => flip(c.id)}
                className="aspect-square rounded-2xl shadow-pop transition active:scale-95"
                style={{
                  background: open ? c.hex : "linear-gradient(135deg, oklch(0.7 0.2 320), oklch(0.7 0.2 240))",
                }}
              >
                {!open && <span className="text-3xl">❓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

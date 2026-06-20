import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, Trophy, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/rewards")({ component: Rewards });

const BADGES = [
  { name: "Color Explorer", desc: "Learn 10 colors", emoji: "🎨", grad: "from-fun-pink to-fun-orange" },
  { name: "Fast Learner", desc: "Learn 25 colors", emoji: "⚡", grad: "from-fun-yellow to-fun-orange" },
  { name: "Color Master", desc: "Learn all 50+ colors", emoji: "👑", grad: "from-fun-purple to-fun-pink" },
  { name: "Camera Expert", desc: "Use camera 10 times", emoji: "📸", grad: "from-fun-blue to-fun-green" },
  { name: "Game Winner", desc: "Score 50+ in games", emoji: "🏆", grad: "from-fun-green to-fun-yellow" },
];

function Rewards() {
  const { stats } = useStore();
  const prev = useRef(stats.badges.length);

  useEffect(() => {
    if (stats.badges.length > prev.current) {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.4 } });
    }
    prev.current = stats.badges.length;
  }, [stats.badges.length]);

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Rewards</h1>
        </div>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-fun-yellow via-fun-orange to-fun-pink p-5 text-center text-white shadow-pop">
          <Trophy className="mx-auto h-12 w-12 drop-shadow" />
          <p className="mt-2 text-xs opacity-90">Trophies</p>
          <p className="font-display text-4xl font-extrabold">{stats.badges.length} / {BADGES.length}</p>
        </div>

        <div className="mt-4 grid gap-3">
          {BADGES.map((b) => {
            const got = stats.badges.includes(b.name);
            return (
              <div
                key={b.name}
                className={`flex items-center gap-4 rounded-3xl p-4 shadow-pop transition ${
                  got ? `bg-gradient-to-r ${b.grad} text-white animate-bounce-in` : "bg-card text-muted-foreground opacity-90"
                }`}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${got ? "bg-white/25" : "bg-muted"}`}>
                  {got ? b.emoji : <Lock className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg font-extrabold">{b.name}</p>
                  <p className="text-xs opacity-90">{b.desc}</p>
                </div>
                {got && <span className="text-xs font-extrabold uppercase tracking-widest">Unlocked</span>}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

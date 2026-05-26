import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { ArrowLeft, Search, Shuffle, Brain, Timer } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/games/")({ component: Games });

const games = [
  { to: "/games/find", title: "Find the Color", desc: "Listen and tap", icon: Search, grad: "from-fun-pink to-fun-orange", key: "find" as const },
  { to: "/games/match", title: "Drag & Match", desc: "Drop names onto colors", icon: Shuffle, grad: "from-fun-blue to-fun-green", key: "match" as const },
  { to: "/games/memory", title: "Memory Match", desc: "Find matching pairs", icon: Brain, grad: "from-fun-purple to-fun-pink", key: "memory" as const },
  { to: "/games/speed", title: "Speed Challenge", desc: "Beat the clock!", icon: Timer, grad: "from-fun-yellow to-fun-orange", key: "speed" as const },
];

function Games() {
  const { stats } = useStore();
  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Game Mode</h1>
        </div>
        <div className="mt-4 grid gap-3">
          {games.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className={`flex items-center gap-4 rounded-3xl bg-gradient-to-r ${g.grad} p-5 text-white shadow-pop active:scale-95`}
            >
              <div className="rounded-2xl bg-white/25 p-3"><g.icon className="h-7 w-7" /></div>
              <div className="flex-1">
                <p className="font-display text-lg font-extrabold">{g.title}</p>
                <p className="text-xs opacity-90">{g.desc}</p>
              </div>
              <div className="rounded-xl bg-black/20 px-3 py-1 text-sm font-bold">★ {stats.scores[g.key]}</div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

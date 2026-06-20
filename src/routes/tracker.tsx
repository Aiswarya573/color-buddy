import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/colors";
import { ArrowLeft, Flame, Clock, Target, Palette } from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/tracker")({ component: Tracker });

function Tracker() {
  const { stats, addTime } = useStore();
  const last = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      addTime(Math.round((now - last.current) / 1000));
      last.current = now;
    }, 10000);
    return () => clearInterval(id);
  }, [addTime]);

  const learned = Object.keys(stats.learned).length;
  const pct = Math.round((learned / COLORS.length) * 100);
  const acc = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0;
  const mins = Math.floor(stats.secondsSpent / 60);

  const max = Math.max(1, ...stats.history.map((h) => h.learned + h.score));

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Learning Tracker</h1>
        </div>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-fun-blue to-fun-purple p-5 text-white shadow-pop">
          <p className="text-xs opacity-90">Colors Learned</p>
          <p className="font-display text-4xl font-extrabold">{learned}<span className="text-lg opacity-80">/{COLORS.length}</span></p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard icon={Target} label="Accuracy" value={`${acc}%`} grad="from-fun-pink to-fun-orange" />
          <StatCard icon={Clock} label="Time" value={`${mins}m`} grad="from-fun-green to-fun-blue" />
          <StatCard icon={Flame} label="Streak" value={`${stats.streak}d`} grad="from-fun-orange to-fun-pink" />
          <StatCard icon={Palette} label="Attempts" value={`${stats.attempts}`} grad="from-fun-purple to-fun-blue" />
        </div>

        <div className="mt-4 rounded-3xl bg-card p-5 shadow-soft">
          <h3 className="font-bold">Weekly Activity</h3>
          <div className="mt-4 flex h-32 items-end gap-2">
            {(stats.history.length ? stats.history.slice(-7) : Array.from({ length: 7 }, (_, i) => ({ date: `D${i}`, learned: 0, score: 0 }))).map((h, i) => {
              const v = h.learned + h.score;
              const ratio = v / max;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-fun-pink to-fun-purple transition-all"
                    style={{ height: `${Math.max(4, ratio * 100)}%` }}
                  />
                  <span className="text-[9px] font-bold text-muted-foreground">{h.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-card p-5 shadow-soft">
          <h3 className="font-bold">Top Colors</h3>
          <div className="mt-3 space-y-2">
            {Object.entries(stats.learned)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([name, count]) => {
                const c = COLORS.find((x) => x.name === name);
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg shadow-soft" style={{ background: c?.hex }} />
                    <span className="flex-1 text-sm font-bold">{name}</span>
                    <span className="text-xs font-bold text-muted-foreground">×{count}</span>
                  </div>
                );
              })}
            {Object.keys(stats.learned).length === 0 && (
              <p className="text-center text-sm text-muted-foreground">Start learning to see stats!</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value, grad }: { icon: any; label: string; value: string; grad: string }) {
  return (
    <div className={`rounded-3xl bg-gradient-to-br ${grad} p-4 text-white shadow-pop`}>
      <Icon className="h-6 w-6" />
      <p className="mt-2 text-xs opacity-90">{label}</p>
      <p className="font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}

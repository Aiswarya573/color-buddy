import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { COLORS } from "@/lib/colors";
import { Palette, Camera, Gamepad2, Trophy, Sparkles } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { settings, stats } = useStore();
  const nav = useNavigate();
  const learned = Object.keys(stats.learned).length;
  const pct = Math.min(100, Math.round((learned / COLORS.length) * 100));

  useEffect(() => {
    if (!settings.onboarded) nav({ to: "/onboarding" });
  }, [settings.onboarded, nav]);

  return (
    <AppLayout>
      <div className="px-5 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Hi {settings.childName} 👋
            </p>
            <h1 className="font-display text-3xl font-bold leading-tight">
              {tr("appName", settings.lang)}
            </h1>
          </div>
          <div className="bg-rainbow flex h-14 w-14 items-center justify-center rounded-3xl shadow-pop">
            <Sparkles className="h-7 w-7 text-white drop-shadow" />
          </div>
        </div>

        <div className="mt-5 animate-bounce-in rounded-3xl bg-gradient-to-br from-fun-pink via-fun-purple to-fun-blue p-5 text-white shadow-pop">
          <p className="text-sm/tight opacity-90">{tr("tagline", settings.lang)}</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-4xl font-extrabold">{learned}<span className="text-lg opacity-80">/{COLORS.length}</span></p>
              <p className="text-xs opacity-90">colors learned</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{stats.streak}🔥</p>
              <p className="text-xs opacity-90">day streak</p>
            </div>
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ActionCard to="/learn" icon={Palette} label={tr("start", settings.lang)} from="from-fun-pink" to2="to-fun-orange" />
          <ActionCard to="/camera" icon={Camera} label={tr("camera", settings.lang)} from="from-fun-blue" to2="to-fun-green" />
          <ActionCard to="/games" icon={Gamepad2} label={tr("games", settings.lang)} from="from-fun-purple" to2="to-fun-pink" />
          <ActionCard to="/rewards" icon={Trophy} label={tr("rewards", settings.lang)} from="from-fun-yellow" to2="to-fun-orange" />
        </div>

        <div className="mt-5 rounded-3xl bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Recent Rewards</h3>
            <Link to="/rewards" className="text-xs font-bold text-primary">See all</Link>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {["Color Explorer", "Fast Learner", "Color Master", "Camera Expert", "Game Winner"].map((b) => {
              const got = stats.badges.includes(b);
              return (
                <div key={b} className={`min-w-[110px] rounded-2xl p-3 text-center text-xs font-bold ${got ? "bg-gradient-to-br from-fun-yellow to-fun-orange text-secondary-foreground shadow-soft" : "bg-muted text-muted-foreground"}`}>
                  <div className="text-2xl">{got ? "🏆" : "🔒"}</div>
                  {b}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ActionCard({ to, icon: Icon, label, from, to2 }: { to: string; icon: any; label: string; from: string; to2: string }) {
  return (
    <Link to={to} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${from} ${to2} p-4 text-white shadow-pop transition active:scale-95`}>
      <Icon className="h-8 w-8 drop-shadow" />
      <p className="mt-3 text-sm font-extrabold leading-tight">{label}</p>
      <div className="absolute -right-3 -bottom-3 h-16 w-16 rounded-full bg-white/15 transition group-active:scale-150" />
    </Link>
  );
}

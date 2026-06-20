import { Link, useLocation } from "@tanstack/react-router";
import { Home, Palette, Camera, Gamepad2, Trophy, BarChart3, Settings as SettingsIcon, FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { useEffect } from "react";

const items = [
  { to: "/", icon: Home, key: "home" },
  { to: "/learn", icon: Palette, key: "learn" },
  { to: "/camera", icon: Camera, key: "camera" },
  { to: "/games", icon: Gamepad2, key: "games" },
  { to: "/tracker", icon: BarChart3, key: "tracker" },
  { to: "/rewards", icon: Trophy, key: "rewards" },
  { to: "/report", icon: FileText, key: "report" },
  { to: "/settings", icon: SettingsIcon, key: "settings" },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useStore();
  const loc = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.dark);
  }, [settings.dark]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <main className="flex-1 pb-24">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-3 pb-3">
        <div className="glass shadow-pop flex items-center justify-between rounded-3xl border border-border/40 px-2 py-2">
          {items.slice(0, 5).map(({ to, icon: Icon, key }) => {
            const active = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-bold transition ${
                  active ? "scale-110 bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tr(key, settings.lang)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

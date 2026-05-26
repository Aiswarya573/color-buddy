import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { COLORS } from "@/lib/colors";
import { useStore } from "@/lib/store";
import { speak, beep } from "@/lib/tts";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/learn")({ component: Learn });

function Learn() {
  const { settings, learnColor } = useStore();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const perPage = 12;

  const filtered = useMemo(
    () => COLORS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice(page * perPage, page * perPage + perPage);

  const tap = (name: string, hex: string) => {
    setActive(name);
    learnColor(name);
    speak(name, { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound });
    beep(540, 90, settings.sound);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: [hex, "#fff", "#ffd60a"],
      scalar: 0.7,
    });
    setTimeout(() => setActive((a) => (a === name ? null : a)), 900);
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Colors</h1>
          <span className="ml-auto rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            {filtered.length}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            placeholder="Search colors..."
            className="flex-1 bg-transparent text-sm font-semibold outline-none"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {slice.map((c) => {
            const isActive = active === c.name;
            return (
              <button
                key={c.name}
                onClick={() => tap(c.name, c.hex)}
                className={`group relative aspect-square overflow-hidden rounded-3xl shadow-pop transition active:scale-95 ${isActive ? "animate-pop-tap ring-4 ring-primary" : ""}`}
                style={{ background: c.hex }}
              >
                <div className="absolute inset-x-0 bottom-0 bg-black/35 px-2 py-1.5 text-center text-[11px] font-bold leading-tight text-white">
                  {c.name}
                </div>
                <Volume2 className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-white/80 drop-shadow" />
              </button>
            );
          })}
          {slice.length === 0 && (
            <p className="col-span-3 py-10 text-center text-sm text-muted-foreground">No colors found</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 rounded-2xl bg-card px-4 py-3 text-sm font-bold shadow-soft disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-xs font-bold text-muted-foreground">{page + 1} / {pages}</span>
          <button
            onClick={() => setPage(Math.min(pages - 1, page + 1))}
            disabled={page >= pages - 1}
            className="flex items-center gap-1 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-pop disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {active && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6" onClick={() => setActive(null)}>
            <div className="animate-bounce-in rounded-3xl bg-card p-6 text-center shadow-pop">
              <div
                className="mx-auto h-32 w-32 rounded-3xl shadow-pop"
                style={{ background: COLORS.find((c) => c.name === active)?.hex }}
              />
              <p className="mt-4 font-display text-2xl font-extrabold">{active}</p>
              <p className="mt-1 text-xs text-muted-foreground">Tap anywhere to close</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

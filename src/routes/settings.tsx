import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useStore, type Lang } from "@/lib/store";
import { speak } from "@/lib/tts";
import { ArrowLeft, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
];

function SettingsPage() {
  const { settings, setSettings, reset } = useStore();
  const nav = useNavigate();

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Settings</h1>
        </div>

        <Section title="Profile">
          <label className="block text-xs font-bold text-muted-foreground">Child Name</label>
          <input
            value={settings.childName}
            onChange={(e) => setSettings({ childName: e.target.value })}
            className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 font-bold outline-none focus:border-primary"
            maxLength={20}
          />
        </Section>

        <Section title="Language">
          <div className="grid grid-cols-2 gap-2">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => { setSettings({ lang: l.code }); speak("Hello!", { lang: l.code, rate: settings.voiceSpeed, enabled: settings.sound }); }}
                className={`flex items-center gap-2 rounded-2xl p-3 text-left font-bold transition ${
                  settings.lang === l.code ? "bg-primary text-primary-foreground shadow-pop" : "bg-card shadow-soft"
                }`}
              >
                <span className="text-2xl">{l.flag}</span>
                <span className="text-sm">{l.label}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Voice Speed">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.1}
              value={settings.voiceSpeed}
              onChange={(e) => setSettings({ voiceSpeed: parseFloat(e.target.value) })}
              className="flex-1 accent-primary"
            />
            <span className="w-12 text-right font-bold">{settings.voiceSpeed.toFixed(1)}x</span>
          </div>
          <button
            onClick={() => speak("Hello, I am Color Buddy", { lang: settings.lang, rate: settings.voiceSpeed, enabled: true })}
            className="mt-3 w-full rounded-2xl bg-gradient-to-r from-fun-blue to-fun-purple py-2.5 text-sm font-bold text-white shadow-soft"
          >
            Test Voice
          </button>
        </Section>

        <Section title="Preferences">
          <Toggle label="Kid Mode" value={settings.kidMode} onChange={(v) => setSettings({ kidMode: v })} />
          <Toggle label="Dark Mode" value={settings.dark} onChange={(v) => setSettings({ dark: v })} />
          <Toggle label="Sound Effects" value={settings.sound} onChange={(v) => setSettings({ sound: v })} />
        </Section>

        <Section title="Data">
          <button
            onClick={() => { if (confirm("Reset all progress?")) reset(); }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive py-3 font-bold text-destructive-foreground shadow-soft"
          >
            <RotateCcw className="h-4 w-4" /> Reset Progress
          </button>
          <button
            onClick={() => { setSettings({ onboarded: false }); nav({ to: "/onboarding" }); }}
            className="mt-2 w-full rounded-2xl bg-card py-3 text-sm font-bold shadow-soft"
          >
            Replay Onboarding
          </button>
        </Section>

        <p className="mt-6 pb-4 text-center text-xs text-muted-foreground">Color Buddy · v1.0</p>
      </div>
    </AppLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-3xl bg-card p-5 shadow-soft">
      <h3 className="mb-3 font-bold">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between border-b border-border/40 py-2.5 last:border-0"
    >
      <span className="text-sm font-bold">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${value ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${value ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

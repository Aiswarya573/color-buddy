import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const steps = [
  { emoji: "🎨", title: "Welcome to Color Buddy!", desc: "Learn colors with fun games and your camera." },
  { emoji: "👆", title: "Tap to Hear", desc: "Tap any color card to hear its name out loud." },
  { emoji: "📸", title: "Find Colors Anywhere", desc: "Point the camera at real things to detect colors." },
  { emoji: "🏆", title: "Earn Rewards", desc: "Play games, unlock badges, and grow your streak." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const [name, setName] = useState("");
  const { setSettings } = useStore();
  const nav = useNavigate();
  const last = i === steps.length;

  const next = () => {
    if (i < steps.length) setI(i + 1);
    else {
      setSettings({ onboarded: true, childName: name.trim() || "Friend" });
      nav({ to: "/" });
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pb-10 pt-12">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {!last ? (
          <div key={i} className="animate-bounce-in">
            <div className="mb-6 animate-float-y text-8xl">{steps[i].emoji}</div>
            <h1 className="font-display text-3xl font-extrabold">{steps[i].title}</h1>
            <p className="mt-3 text-balance text-base text-muted-foreground">{steps[i].desc}</p>
          </div>
        ) : (
          <div className="w-full animate-bounce-in">
            <div className="mb-6 text-7xl">✨</div>
            <h1 className="font-display text-3xl font-extrabold">What's your name?</h1>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name"
              maxLength={20}
              className="mt-6 w-full rounded-2xl border-2 border-border bg-card px-5 py-4 text-center text-lg font-bold outline-none focus:border-primary"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        {[...steps, "name"].map((_, idx) => (
          <span key={idx} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-border"}`} />
        ))}
      </div>

      <button
        onClick={next}
        className="mt-6 flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-fun-pink to-fun-purple py-4 text-lg font-extrabold text-white shadow-pop active:scale-95"
      >
        {last ? "Start" : "Next"} <ArrowRight className="h-5 w-5" />
      </button>
      <button
        onClick={() => { setSettings({ onboarded: true }); nav({ to: "/" }); }}
        className="mt-3 text-xs font-bold text-muted-foreground"
      >
        Skip
      </button>
      <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" /> Color Buddy
      </div>
    </div>
  );
}

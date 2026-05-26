import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useEffect, useRef, useState } from "react";
import { nearestColor, type ColorItem } from "@/lib/colors";
import { useStore } from "@/lib/store";
import { speak } from "@/lib/tts";
import { ArrowLeft, Camera as CamIcon, Aperture, Power } from "lucide-react";

export const Route = createFileRoute("/camera")({ component: CameraPage });

function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [detected, setDetected] = useState<ColorItem | null>(null);
  const [snap, setSnap] = useState<string | null>(null);
  const { settings, bumpCamera, learnColor } = useStore();
  const lastSpoken = useRef<string>("");

  const start = async () => {
    setErr(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setOn(true);
    } catch (e: any) {
      setErr(e?.message || "Camera not available");
    }
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setOn(false);
  };

  useEffect(() => () => stop(), []);

  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => {
      const v = videoRef.current;
      const c = canvasRef.current;
      if (!v || !c || v.readyState < 2) return;
      const w = 32, h = 32;
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(v, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
      const avg: [number, number, number] = [r / n, g / n, b / n];
      const c2 = nearestColor(avg);
      setDetected(c2);
      if (c2.name !== lastSpoken.current) {
        lastSpoken.current = c2.name;
        speak(`This object is ${c2.name}`, { lang: settings.lang, rate: settings.voiceSpeed, enabled: settings.sound });
        learnColor(c2.name);
      }
    }, 1400);
    return () => clearInterval(id);
  }, [on, settings.lang, settings.voiceSpeed, settings.sound, learnColor]);

  const capture = () => {
    const v = videoRef.current;
    if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    setSnap(c.toDataURL("image/jpeg", 0.85));
    bumpCamera();
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full bg-card p-2 shadow-soft"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold">Color Camera</h1>
        </div>

        <div className="relative mt-4 aspect-[3/4] overflow-hidden rounded-3xl bg-black shadow-pop">
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {!on && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-fun-purple/80 to-fun-blue/80 p-6 text-center text-white">
              <CamIcon className="h-16 w-16" />
              <p className="text-balance text-sm">Point your camera at a real object to detect its color.</p>
              <button onClick={start} className="rounded-2xl bg-white px-5 py-3 font-extrabold text-fun-purple shadow-pop">
                Start Camera
              </button>
              {err && <p className="text-xs text-white/80">{err}</p>}
            </div>
          )}
          {on && detected && (
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-2xl bg-black/55 px-3 py-2 text-white backdrop-blur">
              <span className="block h-6 w-6 rounded-lg border border-white/60" style={{ background: detected.hex }} />
              <span className="text-sm font-bold">{detected.name}</span>
            </div>
          )}
        </div>

        {on && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button onClick={stop} className="flex items-center gap-1 rounded-2xl bg-card px-4 py-3 text-sm font-bold shadow-soft">
              <Power className="h-4 w-4" /> Stop
            </button>
            <button onClick={capture} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fun-pink to-fun-purple px-6 py-3 text-sm font-extrabold text-white shadow-pop">
              <Aperture className="h-5 w-5" /> Capture
            </button>
          </div>
        )}

        {snap && (
          <div className="mt-4 animate-slide-up rounded-3xl bg-card p-3 shadow-soft">
            <img src={snap} alt="Captured" className="w-full rounded-2xl" />
            {detected && (
              <p className="mt-2 text-center text-sm font-bold">
                This object is <span style={{ color: detected.hex }}>{detected.name}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

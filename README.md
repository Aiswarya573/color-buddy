# Color Buddy

A bright, kid-friendly mobile web app to learn colors with voice, camera detection, mini-games, progress tracking, and downloadable reports. Works offline after first load.

## Features
- Splash + onboarding tutorial
- Learn 60+ colors with voice (English, Tamil, Hindi, Malayalam)
- Live camera color detector
- 4 mini-games: Find the Color, Drag & Match, Memory, Speed Challenge
- Progress tracker with streaks and badges
- Weekly PDF report (jsPDF)
- Local persistence (Zustand + localStorage)
- Confetti rewards, smooth animations, responsive Android-first UI

## Tech Stack
- React 19 + TypeScript
- TanStack Start + TanStack Router + TanStack Query
- Tailwind CSS v4
- Zustand (persisted)
- Web Speech API, Web Audio API, Canvas API
- canvas-confetti, jsPDF
- Vite 7

## Setup

```bash
bun install
bun run dev
```

Open http://localhost:8080/games/speed

## Build

```bash
bun run build
bun run start
```

## Project Structure
- `src/routes/` – pages (home, onboarding, learn, camera, games, tracker, rewards, report, settings)
- `src/lib/` – store, colors data, i18n, tts
- `src/components/` – AppLayout and shared UI
- `src/styles.css` – design tokens + animations

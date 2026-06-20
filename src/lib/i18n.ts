import type { Lang } from "./store";

type Dict = Record<string, Record<Lang, string>>;

export const t: Dict = {
  appName: { en: "Color Buddy", ta: "கலர் பட்டி", hi: "कलर बडी", ml: "കളർ ബഡി" },
  tagline: {
    en: "Let's learn colors together!",
    ta: "வண்ணங்களை ஒன்றாக கற்போம்!",
    hi: "आओ रंग सीखें!",
    ml: "നമുക്ക് നിറങ്ങൾ പഠിക്കാം!",
  },
  start: { en: "Start Learning", ta: "கற்க தொடங்கு", hi: "सीखना शुरू करें", ml: "പഠിക്കാൻ തുടങ്ങുക" },
  camera: { en: "Camera Mode", ta: "கேமரா முறை", hi: "कैमरा मोड", ml: "ക്യാമറ മോഡ്" },
  games: { en: "Game Mode", ta: "விளையாட்டு", hi: "गेम मोड", ml: "ഗെയിം മോഡ്" },
  progress: { en: "Progress", ta: "முன்னேற்றம்", hi: "प्रगति", ml: "പുരോഗതി" },
  rewards: { en: "Rewards", ta: "பரிசுகள்", hi: "इनाम", ml: "സമ്മാനങ്ങൾ" },
  report: { en: "Weekly Report", ta: "வார அறிக்கை", hi: "साप्ताहिक रिपोर्ट", ml: "പ്രതിവാര റിപ്പോർട്ട്" },
  settings: { en: "Settings", ta: "அமைப்புகள்", hi: "सेटिंग्स", ml: "ക്രമീകരണങ്ങൾ" },
  learn: { en: "Learn", ta: "கற்க", hi: "सीखें", ml: "പഠിക്കുക" },
  home: { en: "Home", ta: "முகப்பு", hi: "होम", ml: "ഹോം" },
  tracker: { en: "Tracker", ta: "டிராக்கர்", hi: "ट्रैकर", ml: "ട്രാക്കർ" },
  searchPlaceholder: { en: "Search colors...", ta: "வண்ணங்களை தேடு...", hi: "रंग खोजें...", ml: "നിറങ്ങൾ തിരയുക..." },
  next: { en: "Next", ta: "அடுத்து", hi: "अगला", ml: "അടുത്തത്" },
  prev: { en: "Previous", ta: "முந்தைய", hi: "पिछला", ml: "മുമ്പത്തേത്" },
  capture: { en: "Capture", ta: "எடு", hi: "कैप्चर", ml: "ക്യാപ്ചർ" },
  startCamera: { en: "Start Camera", ta: "கேமராவை தொடங்கு", hi: "कैमरा शुरू करें", ml: "ക്യാമറ ആരംഭിക്കുക" },
  detected: { en: "Detected", ta: "கண்டறிந்தது", hi: "पता चला", ml: "കണ്ടെത്തി" },
  download: { en: "Download PDF", ta: "PDF பதிவிறக்கு", hi: "PDF डाउनलोड", ml: "PDF ഡൗൺലോഡ്" },
};

export const tr = (key: string, lang: Lang) => t[key]?.[lang] || t[key]?.en || key;

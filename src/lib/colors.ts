export type ColorItem = { name: string; hex: string; rgb: [number, number, number] };

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

const raw: [string, string][] = [
  ["Red", "#FF3B30"], ["Crimson", "#DC143C"], ["Scarlet", "#FF2400"], ["Maroon", "#800000"],
  ["Pink", "#FF69B4"], ["Hot Pink", "#FF1493"], ["Salmon", "#FA8072"], ["Coral", "#FF7F50"],
  ["Rose", "#FF66CC"], ["Magenta", "#FF00FF"], ["Fuchsia", "#FF00AA"], ["Orange", "#FF8C00"],
  ["Tangerine", "#F28500"], ["Amber", "#FFBF00"], ["Peach", "#FFCBA4"], ["Apricot", "#FBCEB1"],
  ["Yellow", "#FFD60A"], ["Gold", "#FFD700"], ["Mustard", "#FFDB58"], ["Cream", "#FFFDD0"],
  ["Lemon", "#FFF44F"], ["Lime", "#BFFF00"], ["Olive", "#808000"], ["Chartreuse", "#7FFF00"],
  ["Green", "#34C759"], ["Forest Green", "#228B22"], ["Mint", "#98FF98"], ["Emerald", "#50C878"],
  ["Teal", "#008080"], ["Turquoise", "#40E0D0"], ["Cyan", "#00FFFF"], ["Aqua", "#7FFFD4"],
  ["Sky Blue", "#87CEEB"], ["Blue", "#007AFF"], ["Royal Blue", "#4169E1"], ["Navy", "#001F54"],
  ["Indigo", "#4B0082"], ["Periwinkle", "#CCCCFF"], ["Lavender", "#E6E6FA"], ["Violet", "#8F00FF"],
  ["Purple", "#9B30FF"], ["Plum", "#8E4585"], ["Orchid", "#DA70D6"], ["Brown", "#8B4513"],
  ["Chocolate", "#7B3F00"], ["Coffee", "#6F4E37"], ["Caramel", "#AF6E4D"], ["Tan", "#D2B48C"],
  ["Beige", "#F5F5DC"], ["Ivory", "#FFFFF0"], ["White", "#FFFFFF"], ["Snow", "#FFFAFA"],
  ["Silver", "#C0C0C0"], ["Gray", "#8E8E93"], ["Charcoal", "#36454F"], ["Black", "#000000"],
  ["Bronze", "#CD7F32"], ["Copper", "#B87333"], ["Rust", "#B7410E"], ["Burgundy", "#800020"],
  ["Mauve", "#E0B0FF"], ["Cobalt", "#0047AB"],
];

export const COLORS: ColorItem[] = raw.map(([name, hex]) => ({ name, hex, rgb: hexToRgb(hex) }));

export const nearestColor = (rgb: [number, number, number]): ColorItem => {
  let best = COLORS[0];
  let bestD = Infinity;
  for (const c of COLORS) {
    const d = (c.rgb[0] - rgb[0]) ** 2 + (c.rgb[1] - rgb[1]) ** 2 + (c.rgb[2] - rgb[2]) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
};

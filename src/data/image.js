// Generates self-contained, on-brand SVG product images as data-URIs.
// This keeps the prototype 100% offline-safe and deployable with zero broken
// image links — every "product photo" is drawn deterministically from its
// category + colour.

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 0xff) + amt, b = (n & 0xff) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Garment silhouettes per category (drawn on a 240x300 canvas).
const SHAPES = {
  dress: '<path d="M95 70 L145 70 L160 110 L140 120 L150 250 L90 250 L100 120 L80 110 Z"/>',
  kurta: '<path d="M92 70 L148 70 L165 115 L148 125 L150 255 L90 255 L92 125 L75 115 Z"/>',
  saree: '<path d="M90 70 L150 70 L175 250 L65 250 Z" /><path d="M150 70 L185 150 L172 170 L140 110 Z"/>',
  top: '<path d="M92 78 L148 78 L168 112 L150 124 L150 190 L90 190 L90 124 L72 112 Z"/>',
  shirt: '<path d="M90 72 L120 84 L150 72 L170 110 L150 124 L150 200 L90 200 L90 124 L70 110 Z"/><line x1="120" y1="90" x2="120" y2="200"/>',
  tshirt: '<path d="M92 80 L148 80 L170 110 L152 124 L152 185 L88 185 L88 124 L70 110 Z"/>',
  coord: '<path d="M95 72 L145 72 L162 104 L146 116 L146 162 L94 162 L94 116 L78 104 Z"/><path d="M96 172 L144 172 L150 250 L120 250 L120 172 M120 250 L90 250 L96 172"/>',
  skirt: '<path d="M92 110 L148 110 L172 240 L68 240 Z"/><rect x="92" y="100" width="56" height="14"/>',
  jeans: '<path d="M94 90 L146 90 L150 250 L124 250 L120 150 L116 250 L90 250 Z"/>',
  joggers: '<path d="M96 92 L144 92 L150 245 L126 245 L120 150 L114 245 L90 245 Z"/>',
  hoodie: '<path d="M90 84 Q120 64 150 84 L172 120 L152 132 L152 210 L88 210 L88 132 L68 120 Z"/>',
  blazer: '<path d="M88 72 L120 86 L152 72 L174 116 L154 128 L154 210 L86 210 L86 128 L66 116 Z"/><path d="M120 86 L104 210 M120 86 L136 210"/>',
  footwear: '<path d="M60 180 L150 180 Q200 180 205 205 L60 205 Z"/><path d="M60 150 L60 205 L150 205 L150 180 Q120 175 110 150 Z"/>',
  bag: '<path d="M85 120 L155 120 L168 235 L72 235 Z"/><path d="M100 120 Q100 90 120 90 Q140 90 140 120" fill="none" stroke-width="8"/>',
  accessory: '<circle cx="100" cy="150" r="34"/><circle cx="150" cy="150" r="34"/><rect x="128" y="144" width="22" height="12"/>',
};

const xmlEscape = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function productImage({ category, color, label }) {
  const shape = SHAPES[category] || SHAPES.top;
  const bgTop = shade(color, 70);
  const bgBot = shade(color, 18);
  const safeLabel = xmlEscape((label || "").toUpperCase());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="300" viewBox="0 0 240 300">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bgTop}"/><stop offset="1" stop-color="${bgBot}"/>
    </linearGradient>
  </defs>
  <rect width="240" height="300" fill="#f5f5f6"/>
  <rect width="240" height="300" fill="url(#g)" opacity="0.18"/>
  <g fill="${color}" stroke="${shade(color, -30)}" stroke-width="2" stroke-linejoin="round">${shape}</g>
  <text x="120" y="285" font-family="Arial, sans-serif" font-size="13" font-weight="700"
        fill="#3e3e3e" text-anchor="middle" opacity="0.55">${safeLabel}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

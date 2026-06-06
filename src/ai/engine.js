// ---------------------------------------------------------------------------
// StyleGenie "GenAI" engine (front-end simulation).
//
// In production these functions would call an LLM-orchestration backend:
//   - parseIntent      -> LLM intent classifier (occasion / budget / style / gender)
//   - composeOutfits   -> RAG retrieval over catalog embeddings + LLM stylist
//   - predictFit       -> NLP mining of review corpus + body profile
//   - visualMatch      -> CLIP image embedding -> vector nearest-neighbour
//   - trendDigest      -> LLM trend-narrative generation x style graph
//
// Here they are implemented deterministically so the prototype is fully
// self-contained (no API keys, no network) yet behaves convincingly.
// ---------------------------------------------------------------------------
import { PRODUCTS } from "../data/products.js";

const OCCASIONS = {
  wedding: ["wedding", "shaadi", "reception", "sangeet"],
  festive: ["festive", "diwali", "festival", "puja", "navratri", "eid", "raksha"],
  party: ["party", "night out", "club", "birthday", "new year", "nightout"],
  date: ["date", "dinner", "romantic"],
  casual: ["casual", "everyday", "chill", "daily", "hangout"],
  college: ["college", "fest", "campus", "class", "uni"],
  office: ["office", "work", "formal", "interview", "meeting"],
  vacation: ["vacation", "beach", "trip", "holiday", "goa", "travel"],
  brunch: ["brunch", "lunch", "coffee"],
  gym: ["gym", "workout", "athleisure", "sport", "run"],
};

const STYLES = ["minimal", "boho", "ethnic", "traditional", "glam", "chic", "streetwear",
  "sporty", "elegant", "denim", "linen", "feminine", "smart casual", "statement", "vacation"];

// --- Intent parsing (LLM intent classifier stand-in) ----------------------
export function parseIntent(text) {
  const q = " " + text.toLowerCase() + " ";
  let occasion = null;
  for (const [occ, kws] of Object.entries(OCCASIONS)) {
    if (kws.some((k) => q.includes(k))) { occasion = occ; break; }
  }

  // Budget: "under 2k", "below 3000", "₹5000", "5k", "under 2,000"
  let budget = null;
  const allNums = [...q.matchAll(/(\d+(?:[.,]\d+)?)\s*(k)?/g)];
  for (const m of allNums) {
    let v = parseFloat(m[1].replace(",", ""));
    if (m[2] === "k" || (v <= 50 && /under|below|within|budget|less|max|upto|up to/.test(q))) v *= 1000;
    if (v >= 300) { budget = v; break; }
  }

  const gender = /\b(men|man|him|male|guy|boy|husband|boyfriend)\b/.test(q) ? "men"
    : /\b(women|woman|her|female|girl|wife|girlfriend|she)\b/.test(q) ? "women" : null;

  const style = STYLES.filter((s) => q.includes(s));

  // Celebrity / reference style cues -> map to style tags (LLM "world knowledge")
  if (/alia|deepika|kiara|janhvi/.test(q)) style.push("elegant", "chic");
  if (/ranveer|streetwear|hypebeast/.test(q)) style.push("streetwear", "statement");
  if (/instagram|insta|aesthetic|pinterest/.test(q)) style.push("chic", "boho");

  return { occasion, budget, gender, style: [...new Set(style)], raw: text };
}

// --- Retrieval + scoring (RAG retrieval stand-in) -------------------------
export function searchCatalog(intent, { limit = 8, pool = PRODUCTS } = {}) {
  const scored = pool.map((p) => {
    let s = 0;
    if (intent.occasion && p.occasion.includes(intent.occasion)) s += 5;
    if (intent.gender && p.gender === intent.gender) s += 3;
    if (intent.gender && p.gender !== intent.gender && p.category !== "accessory" && p.category !== "footwear") s -= 4;
    if (intent.budget) s += p.price <= intent.budget ? 2 : -3;
    s += intent.style.reduce((a, st) => a + (p.style.includes(st) ? 2 : 0), 0);
    s += (parseFloat(p.rating) - 4) * 0.5; // light quality prior
    return { p, s };
  });
  return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.p);
}

// --- Outfit composition (LLM stylist stand-in) ----------------------------
// Builds a head-to-toe look around an anchor: top/dress + bottom + footwear + accessory.
const ROLE = {
  top: ["top", "shirt", "tshirt", "kurta", "blazer", "hoodie", "coord"],
  bottom: ["jeans", "skirt", "joggers"],
  feet: ["footwear"],
  extra: ["bag", "accessory"],
};
const roleOf = (cat) =>
  Object.entries(ROLE).find(([, cats]) => cats.includes(cat))?.[0] || "top";

export function composeOutfits(anchor, count = 3) {
  const gender = anchor.gender;
  const pick = (role, occ) =>
    PRODUCTS.filter((p) => p.id !== anchor.id && roleOf(p.category) === role &&
      (p.gender === gender || role === "feet" || role === "extra"))
      .filter((p) => !occ || p.occasion.includes(occ) || roleOf(p.category) === "extra")
      .sort((a, b) => sharedStyle(b, anchor) - sharedStyle(a, anchor));

  const occasions = [...new Set([...anchor.occasion])].slice(0, count);
  while (occasions.length < count) occasions.push(anchor.occasion[0]);

  const anchorIsDress = anchor.category === "dress" || anchor.category === "saree" || anchor.category === "coord";

  return occasions.map((occ, i) => {
    const items = [anchor];
    if (!anchorIsDress) {
      const bottom = pick("bottom", occ)[i % Math.max(1, pick("bottom", occ).length)] || pick("bottom")[0];
      if (bottom) items.push(bottom);
    }
    const feet = pick("feet", occ)[i % Math.max(1, pick("feet", occ).length)] || pick("feet")[0];
    if (feet) items.push(feet);
    const extra = pick("extra", occ)[i] || pick("extra")[0];
    if (extra) items.push(extra);

    const total = items.reduce((a, p) => a + p.price, 0);
    return {
      title: `${cap(occ)} look`,
      note: stylistNote(anchor, occ),
      items,
      total,
    };
  });
}

const sharedStyle = (a, b) => a.style.filter((s) => b.style.includes(s)).length;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function stylistNote(anchor, occ) {
  const notes = {
    wedding: `Pair the ${anchor.name.toLowerCase()} with statement accessories for a celebration ready finish.`,
    festive: `Festive coded styling: rich tones and ethnic accents complement the ${anchor.brand} piece.`,
    party: `A night out edit: keep it sleek and let the ${anchor.name.toLowerCase()} be the hero.`,
    date: `Effortless date night layering, balanced and polished.`,
    casual: `Easy everyday combo: comfortable, put together, low effort.`,
    college: `Campus friendly and budget smart, styled to stand out.`,
    office: `Sharp workwear pairing that reads professional yet current.`,
    vacation: `Breezy vacation styling, made for photos and comfort.`,
    brunch: `Daytime chic, relaxed but intentional.`,
    gym: `Performance first athleisure that still looks good off the mat.`,
  };
  return notes[occ] || `Styled around the ${anchor.name.toLowerCase()} for a cohesive, occasion ready look.`;
}

// --- Fit prediction (review-mining NLP stand-in) --------------------------
const BODY_DEFAULT = { height: 170, weight: 68, usualSize: "M", build: "regular" };

export function predictFit(product, body = BODY_DEFAULT) {
  const sizes = ["XS", "S", "M", "L", "XL"];
  let idx = sizes.indexOf(body.usualSize);
  if (idx < 0) idx = 2;

  const evidence = [];
  let confidence = 0.78;
  const fit = (product.fit || "true to size").toLowerCase();

  if (fit.includes("slim")) {
    idx = Math.min(sizes.length - 1, idx + 1);
    evidence.push(`Reviews say "${product.brand} runs slim", so we sized up.`);
    confidence += 0.1;
  } else if (fit.includes("oversized") || fit.includes("relaxed")) {
    idx = Math.max(0, idx - 1);
    evidence.push(`This style is cut oversized, so most buyers sized down.`);
    confidence += 0.08;
  } else if (fit.includes("true")) {
    evidence.push(`94% of reviewers found this "true to size".`);
    confidence += 0.12;
  } else {
    evidence.push(`Free size piece, designed to fit a wide range.`);
  }

  if (body.build === "athletic") { evidence.push(`Adjusted for an athletic build across the shoulders.`); }
  evidence.push(`Matched against your profile: ${body.height}cm, ${body.weight}kg, usual ${body.usualSize}.`);

  confidence = Math.min(0.97, confidence);
  return {
    size: product.category === "footwear" ? "UK 8" : product.category === "saree" || product.fit === "free size" ? "Free Size" : sizes[idx],
    confidence: Math.round(confidence * 100),
    evidence,
    reviewsMined: 800 + (product.id * 173) % 1600,
  };
}

// --- Visual match (CLIP nearest-neighbour stand-in) -----------------------
// Without a real upload we simulate by seeding from a chosen "vibe".
export function visualMatch(vibe) {
  const intent = parseIntent(vibe);
  const results = searchCatalog({ ...intent, budget: null }, { limit: 6 });
  return results.map((p, i) => ({ product: p, score: Math.max(62, 96 - i * 5 - (p.id % 4)) }));
}

// --- Trend digest (LLM trend narrative stand-in) --------------------------
export function trendDigest() {
  const trends = [
    { tag: "Quiet Luxury", color: "#b7a98b",
      story: "Understated, expensive-looking minimalism is dominating feeds: clean lines, neutral palettes and elevated basics.",
      seed: "minimal elegant" },
    { tag: "Indie Sleaze Revival", color: "#3a3a4a",
      story: "Y2K's grittier cousin is back, with dark party dressing, statement co ords and bold night out energy.",
      seed: "party glam women" },
    { tag: "Festive Heritage", color: "#9e3b4f",
      story: "Wedding season is here, and modern takes on ethnic wear blend tradition with contemporary tailoring.",
      seed: "festive ethnic wedding" },
    { tag: "Coastal Off-Duty", color: "#6c8ea0",
      story: "Linen, breezy silhouettes and vacation core pieces for the travel set chasing the golden hour.",
      seed: "vacation linen beach" },
    { tag: "Athleisure 2.0", color: "#2f6f5e",
      story: "Gym to street is sharper than ever, with technical fabrics styled for real life, not just the treadmill.",
      seed: "athleisure sporty men" },
  ];
  return trends.map((t) => ({
    ...t,
    products: searchCatalog(parseIntent(t.seed), { limit: 4 }),
  }));
}

// --- Capsule Wardrobe builder (generative composition + optimisation) ------
// Out-of-the-box signature feature: given a budget and the occasions a user
// dresses for, StyleGenie assembles a small set of maximally re-combinable
// pieces, then reports how many complete outfits they unlock. In production an
// LLM would optimise versatility x budget x personal style graph.
export function buildCapsule(budget, occasions, gender) {
  const occ = occasions && occasions.length ? occasions : ["casual"];
  const pool = PRODUCTS.filter(
    (p) => p.gender === gender || p.category === "footwear" || p.category === "accessory"
  );
  const versatility = (p) => occ.reduce((a, o) => a + (p.occasion.includes(o) ? 1 : 0), 0);
  const byRole = (cats) =>
    pool
      .filter((p) => cats.includes(p.category))
      .map((p) => ({ p, v: versatility(p) }))
      .sort((a, b) => b.v - a.v || a.p.price - b.p.price)
      .map((x) => x.p);

  const wishlist = [
    { role: "top", cats: ["top", "shirt", "tshirt", "kurta"], n: 2 },
    { role: "bottom", cats: ["jeans", "skirt", "joggers"], n: 2 },
    { role: "dress", cats: ["dress", "saree", "coord"], n: gender === "women" ? 1 : 0 },
    { role: "layer", cats: ["blazer", "hoodie"], n: 1 },
    { role: "feet", cats: ["footwear"], n: 2 },
    { role: "extra", cats: ["bag", "accessory"], n: 1 },
  ];

  const items = [];
  let spent = 0;
  for (const w of wishlist) {
    let added = 0;
    for (const p of byRole(w.cats)) {
      if (added >= w.n) break;
      if (items.some((x) => x.id === p.id)) continue;
      if (spent + p.price <= budget) { items.push({ ...p, role: w.role }); spent += p.price; added++; }
    }
  }

  const count = (r) => items.filter((i) => i.role === r).length;
  const tops = count("top"), bottoms = count("bottom"), dresses = count("dress");
  const layers = count("layer"), feet = Math.max(1, count("feet"));
  const base = tops * bottoms + dresses;
  const layered = layers > 0 ? tops * bottoms : 0;
  const outfits = (base + layered) * feet;

  // a few example combinations
  const topItems = items.filter((i) => i.role === "top");
  const botItems = items.filter((i) => i.role === "bottom");
  const feetItems = items.filter((i) => i.role === "feet");
  const examples = [];
  for (let i = 0; i < topItems.length; i++) {
    for (let j = 0; j < botItems.length && examples.length < 3; j++) {
      const look = [topItems[i], botItems[j]];
      if (feetItems.length) look.push(feetItems[(i + j) % feetItems.length]);
      examples.push({ items: look, total: look.reduce((a, p) => a + p.price, 0) });
    }
  }

  return { items, pieces: items.length, spent, outfits: Math.max(outfits, items.length), examples, occasions: occ, budget };
}

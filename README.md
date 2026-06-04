# Myntra StyleGenie 🧞

**Open Project 2026 — Reimagining Myntra with Generative AI.**

An AI-native styling layer dropped on top of the existing Myntra experience:
conversational discovery, visual search, generative outfits, AI fit prediction, and a
personalised daily trend digest.

> Live UI looks like Myntra; the GenAI is woven in as a floating concierge + inline AI cards.

## ✨ The 5 GenAI features

1. **StyleGenie Chat** — describe what you need in plain language → intent parsed → grounded outfit cards.
2. **Visual Match** — upload an image / pick a vibe → CLIP-style visual search → ranked matches.
3. **Outfit Studio** — pick a product → AI composes complete, colour-coordinated looks → 1-tap add-to-bag.
4. **FitGenius** — body profile × review-text mining → your true size with confidence + evidence.
5. **TrendPulse** — AI-generated daily trend narratives curated to your style graph.

## 🚀 Run locally

```bash
npm install
npm run dev      # open the printed localhost URL
```

Scripts: `npm run build` (static output → `dist/`), `npm run preview`, `npm run lint`.

## ▲ Deploy on Vercel

This repo is a **zero-config Vite app at the root** — just import it on Vercel:

1. Vercel → **Add New → Project** → import this GitHub repo.
2. Framework preset is auto-detected as **Vite** (build `npm run build`, output `dist`).
3. **Environment variables: none required.** The prototype's AI runs deterministically
   client-side, so there are no API keys or secrets to set.
4. Deploy.

(`vercel.json` is included to make the framework + SPA fallback explicit.)

## 🔗 Demo deep links

Append to the URL to jump straight to a state:

| Link | Shows |
|------|-------|
| `#trends` | TrendPulse feed |
| `#p/12` | a product page (FitGenius + Outfit Studio) |
| `#genie` | open StyleGenie Chat |
| `#genie/festive%20look%20under%203k` | auto-run a chat query |
| `#visual` | Visual Match |

## 🧠 How the AI works (prototype vs production)

Every product image is a generated branded SVG, and every "AI" response is produced
deterministically in the browser — so the demo is **offline-safe, has no broken images, and
needs no API keys**. The AI call sites in [`src/ai/engine.js`](src/ai/engine.js)
(`parseIntent`, `searchCatalog`, `composeOutfits`, `predictFit`, `visualMatch`, `trendDigest`)
map 1:1 to where a production backend would orchestrate **LLM + CLIP + a RAG pipeline**.
RAG grounding is the key principle: the LLM provides intelligence, the live catalogue provides
facts — so it can never recommend a product that doesn't exist.

## ✅ Verified

Production build ✓ · ESLint clean ✓ · 23/23 AI-engine unit tests ✓ · headless-render smoke test, 0 runtime errors ✓.

## 📦 Tech

React 19 · Vite · hand-written CSS in Myntra's design language. No backend, no env vars.

---

Full submission docs (6-slide strategy deck + build report) are in [`submission/`](submission/).

import { useState, useMemo, useEffect } from "react";
import Header from "./components/Header.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import StyleGenieChat from "./components/StyleGenieChat.jsx";
import VisualMatch from "./components/VisualMatch.jsx";
import CapsuleStudio from "./components/CapsuleStudio.jsx";
import TrendPulse from "./components/TrendPulse.jsx";
import { PRODUCTS, getById } from "./data/products.js";

function Home({ cat, onOpen, onAskGenie, onCapsule }) {
  const list = useMemo(
    () => (cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.gender === cat || p.category === "footwear" || p.category === "accessory")),
    [cat]
  );
  const studioPicks = list.slice(0, 8);

  return (
    <div className="container">
      <div className="hero">
        <div>
          <span className="ai-pill">✨ Powered by StyleGenie AI</span>
          <h1>Don't shop for clothes.<br />Shop for the moment.</h1>
          <p>Tell StyleGenie the occasion and vibe — get complete looks, your perfect size, and visual matches in seconds. Less scrolling, more styling.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="hero-cta" onClick={onAskGenie}>✨ Ask StyleGenie</button>
            <button className="hero-cta" onClick={onCapsule} style={{ background: "rgba(255,255,255,0.16)", color: "#fff" }}>🧳 Build a Capsule</button>
          </div>
        </div>
        <div style={{ fontSize: 90, opacity: 0.9 }}>🧞</div>
      </div>

      <div className="section-head">
        <h2>{cat === "all" ? "Trending for you" : cat === "men" ? "Men's edit" : "Women's edit"}</h2>
        <span className="sub">✨ Tap any product to try Outfit Studio + FitGenius</span>
      </div>
      <div className="grid">
        {studioPicks.map((p) => <ProductCard key={p.id} product={p} onOpen={onOpen} studio />)}
      </div>

      {list.length > 8 && (
        <>
          <div className="section-head"><h2>More to explore</h2></div>
          <div className="grid">
            {list.slice(8).map((p) => <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
          </div>
        </>
      )}
    </div>
  );
}

// Parse an initial view from the URL so prototype states are deep-linkable,
// e.g. #trends, #p/12, #genie, #visual.
function initialView() {
  const h = (typeof window !== "undefined" ? window.location.hash : "").replace(/^#/, "");
  if (h === "trends") return { route: { page: "trends" } };
  const pm = h.match(/^p\/(\d+)$/);
  if (pm) return { route: { page: "pdp", productId: +pm[1] } };
  if (h === "genie") return { route: { page: "home", cat: "all" }, chat: true };
  const gm = h.match(/^genie\/(.+)$/);
  if (gm) return { route: { page: "home", cat: "all" }, chat: true, query: decodeURIComponent(gm[1]) };
  if (h === "visual") return { route: { page: "home", cat: "all" }, visual: true };
  if (h === "capsule") return { route: { page: "home", cat: "all" }, capsule: true };
  if (h === "capsule-go") return { route: { page: "home", cat: "all" }, capsule: true, capsuleAuto: true };
  return { route: { page: "home", cat: "all" } };
}

export default function App() {
  const init = initialView();
  const [route, setRoute] = useState(init.route);
  const [bag, setBag] = useState([]);
  const [toast, setToast] = useState("");
  const [chatOpen, setChatOpen] = useState(!!init.chat);
  const [visualOpen, setVisualOpen] = useState(!!init.visual);
  const [capsuleOpen, setCapsuleOpen] = useState(!!init.capsule);
  const [pendingQuery, setPendingQuery] = useState(init.query ? { text: init.query, id: 1 } : null);

  useEffect(() => {
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const flash = (msg) => setToast(msg);

  const openProduct = (p) => {
    setRoute({ page: "pdp", productId: p.id });
    window.scrollTo(0, 0);
  };
  const addToBag = (p) => { setBag((b) => [...b, p]); flash(`Added ${p.brand} to bag 🛍️`); };
  const addLook = (look) => {
    setBag((b) => [...b, ...look.items]);
    flash(`Added ${look.items.length}-piece "${look.title}" to bag ✨`);
  };
  const chipSearch = (text) => { setPendingQuery({ text, id: Date.now() }); setChatOpen(true); };

  const current = route.page === "pdp" ? getById(route.productId) : null;

  return (
    <div className="app">
      <Header
        route={route}
        setRoute={(r) => { setRoute(r); window.scrollTo(0, 0); }}
        bagCount={bag.length}
        onVisualMatch={() => setVisualOpen(true)}
        onChipSearch={chipSearch}
        onCapsule={() => setCapsuleOpen(true)}
      />

      {route.page === "home" && <Home cat={route.cat} onOpen={openProduct} onAskGenie={() => setChatOpen(true)} onCapsule={() => setCapsuleOpen(true)} />}
      {route.page === "trends" && <TrendPulse onOpenProduct={openProduct} />}
      {route.page === "pdp" && current && (
        <ProductDetail
          product={current}
          onOpen={openProduct}
          onAddToBag={addToBag}
          onAddLook={addLook}
          onBack={() => setRoute({ page: "home", cat: "all" })}
        />
      )}

      <div className="footer">
        StyleGenie · an AI-native styling layer reimagining Myntra · Open Project 2026 prototype.
        <br />All "AI" responses are simulated client-side for the demo; production wires to an LLM + RAG backend.
      </div>

      <StyleGenieChat open={chatOpen} setOpen={setChatOpen} onOpenProduct={openProduct} pendingQuery={pendingQuery} />
      <VisualMatch open={visualOpen} onClose={() => setVisualOpen(false)} onOpenProduct={openProduct} />
      <CapsuleStudio open={capsuleOpen} onClose={() => setCapsuleOpen(false)} onOpenProduct={openProduct} auto={!!init.capsuleAuto} />

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

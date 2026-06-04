import { useMemo } from "react";
import ProductCard from "./ProductCard.jsx";
import { trendDigest } from "../ai/engine.js";

export default function TrendPulse({ onOpenProduct }) {
  const trends = useMemo(() => trendDigest(), []);
  return (
    <div className="container">
      <div className="hero trend-hero">
        <div>
          <span className="ai-pill">✨ AI-generated · refreshed daily</span>
          <h1>TrendPulse</h1>
          <p>Your personalised fashion digest. StyleGenie reads the runway, social signals and your style graph, then writes a lookbook just for you — new every morning.</p>
        </div>
        <div style={{ fontSize: 64 }}>📈</div>
      </div>

      {trends.map((t) => (
        <div className="trend" key={t.tag}>
          <div className="trend-top" style={{ background: `linear-gradient(120deg, ${t.color}, #1a1730)` }}>
            <span className="ai-tag">✨ AI trend narrative</span>
            <div className="tg">Trending now</div>
            <h3>{t.tag}</h3>
            <p>{t.story}</p>
          </div>
          <div className="trend-products">
            {t.products.map((p) => <ProductCard key={p.id} product={p} onOpen={onOpenProduct} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { inr } from "../utils.js";
import { predictFit, composeOutfits } from "../ai/engine.js";

function FitGenius({ product }) {
  const [body, setBody] = useState({ height: 170, weight: 68, usualSize: "M", build: "regular" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => { setResult(predictFit(product, body)); setLoading(false); }, 900);
  };

  return (
    <div className="ai-module">
      <div className="ai-head">🎯 FitGenius <span className="ai-chip">AI FIT</span></div>
      <div className="ai-sub">We mine 1,000+ review texts and match them to your body — no more guessing your size.</div>

      <div className="body-form">
        <label>Height (cm)
          <input type="number" value={body.height} onChange={(e) => setBody({ ...body, height: +e.target.value })} />
        </label>
        <label>Weight (kg)
          <input type="number" value={body.weight} onChange={(e) => setBody({ ...body, weight: +e.target.value })} />
        </label>
        <label>Usual size
          <select value={body.usualSize} onChange={(e) => setBody({ ...body, usualSize: e.target.value })}>
            {["XS", "S", "M", "L", "XL"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>Build
          <select value={body.build} onChange={(e) => setBody({ ...body, build: e.target.value })}>
            {["regular", "athletic", "petite", "plus"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <button className="btn btn-primary" style={{ flex: "none", padding: "9px 16px" }} onClick={run}>
          {loading ? "Analysing…" : "Find my size"}
        </button>
      </div>

      {loading && <div className="typing"><span /><span /><span /></div>}

      {result && (
        <div className="fit-result" style={{ marginTop: 14 }}>
          <div className="fit-size">
            <div className="sz">{result.size}</div>
            <div className="lbl">best fit</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{result.confidence}% confidence</div>
            <div className="conf-bar"><div style={{ width: result.confidence + "%" }} /></div>
            <ul className="evidence">
              {result.evidence.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
              Based on {result.reviewsMined.toLocaleString("en-IN")} mined reviews · RAG-grounded
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OutfitStudio({ product, onOpen, onAddLook }) {
  const [looks, setLooks] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => { setLooks(composeOutfits(product, 3)); setLoading(false); }, 1000);
  };

  return (
    <div className="ai-module">
      <div className="ai-head">🪄 Outfit Studio <span className="ai-chip">AI STYLIST</span></div>
      <div className="ai-sub">Let StyleGenie build complete, colour-coordinated looks around this piece using real catalogue items.</div>

      {!looks && !loading && (
        <button className="btn btn-outline" onClick={run}>✨ Generate complete looks</button>
      )}
      {loading && (
        <div>
          <div className="typing"><span /><span /><span /></div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Composing colour-coordinated outfits…</div>
        </div>
      )}

      {looks && (
        <div className="looks">
          {looks.map((look, i) => (
            <div className="look" key={i}>
              <div className="look-top">
                <span className="look-title">{look.title}</span>
                <span style={{ fontWeight: 800, color: "var(--pink)" }}>{inr(look.total)}</span>
              </div>
              <div className="look-note">{look.note}</div>
              <div className="look-items">
                {look.items.map((it) => (
                  <div className="li" key={it.id} onClick={() => onOpen(it)}>
                    <img src={it.image} alt={it.name} />
                    <span>{it.brand}</span>
                  </div>
                ))}
              </div>
              <button className="add-look" onClick={() => onAddLook(look)}>🛍️ Add complete look to bag ({look.items.length} items)</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail({ product, onOpen, onAddToBag, onAddLook, onBack }) {
  return (
    <div className="container">
      <div className="back-link" onClick={onBack} style={{ cursor: "pointer" }}>← Back to products</div>
      <div className="pdp">
        <div className="pdp-img">
          <img src={product.image} alt={product.name} />
        </div>
        <div>
          <div className="brand">{product.brand}</div>
          <h1>{product.name}</h1>
          <div className="rating" style={{ position: "static", display: "inline-flex", marginTop: 10 }}>
            <span className="star">★</span><span>{product.rating}</span>
            <span className="cnt">{product.ratingCount.toLocaleString("en-IN")} ratings</span>
          </div>
          <div className="price">
            {inr(product.price)}
            <span className="mrp">{inr(product.mrp)}</span>
            <span className="off">{product.discount}% OFF</span>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => onAddToBag(product)}>🛍️ Add to Bag</button>
            <button className="btn btn-outline">♡ Wishlist</button>
          </div>

          <FitGenius product={product} />
          <OutfitStudio product={product} onOpen={onOpen} onAddLook={onAddLook} />

          <div className="divider" />
          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            <b style={{ color: "var(--ink)" }}>Product details:</b> {product.style.join(", ")} ·
            ideal for {product.occasion.join(", ")}. Fit: {product.fit}.
          </div>
        </div>
      </div>
    </div>
  );
}

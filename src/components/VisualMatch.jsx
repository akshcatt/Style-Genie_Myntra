import { useState } from "react";
import { inr } from "../utils.js";
import { visualMatch } from "../ai/engine.js";

const VIBES = [
  { label: "📌 Pinterest boho dress", seed: "boho floral dress women vacation" },
  { label: "🖤 All-black party fit", seed: "party glam women night out" },
  { label: "👔 Smart office look", seed: "office formal men smart" },
  { label: "🏖️ Beach vacation vibe", seed: "vacation linen beach men" },
  { label: "🪔 Festive ethnic", seed: "festive ethnic wedding women" },
];

export default function VisualMatch({ open, onClose, onOpenProduct }) {
  const [stage, setStage] = useState("upload"); // upload | scanning | results
  const [results, setResults] = useState([]);
  const [vibeLabel, setVibeLabel] = useState("");

  if (!open) return null;

  const analyse = (seed, label) => {
    setVibeLabel(label);
    setStage("scanning");
    setTimeout(() => {
      setResults(visualMatch(seed));
      setStage("results");
    }, 1300);
  };

  const reset = () => { setStage("upload"); setResults([]); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span style={{ fontSize: 22 }}>📷</span>
          <div>
            <h3>Visual Match</h3>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Snap or upload any image — find it on Myntra</div>
          </div>
          <button className="x" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {stage === "upload" && (
            <>
              <label className="dropzone" style={{ display: "block", cursor: "pointer" }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={() => analyse("boho floral dress women vacation", "your uploaded image")}
                />
                <div className="big">🖼️</div>
                <div style={{ fontWeight: 700 }}>Drop an image or click to upload</div>
                <p>A screenshot, a Pinterest save, a photo of something you spotted — CLIP encodes it and finds visual matches.</p>
              </label>
              <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, margin: "14px 0 6px" }}>…or try a sample vibe:</p>
              <div className="vibe-row">
                {VIBES.map((v) => (
                  <button key={v.label} onClick={() => analyse(v.seed, v.label)}>{v.label}</button>
                ))}
              </div>
            </>
          )}

          {stage === "scanning" && (
            <div className="dropzone">
              <div className="big">🔍</div>
              <div style={{ fontWeight: 700 }}>Encoding image with CLIP…</div>
              <div className="typing" style={{ justifyContent: "center" }}><span /><span /><span /></div>
              <p>Matching against pre-computed catalogue embeddings · identifying garment, colour, silhouette</p>
            </div>
          )}

          {stage === "results" && (
            <>
              <div style={{ marginBottom: 12, fontSize: 13 }}>
                Found <b>{results.length}</b> visual matches for <b>{vibeLabel}</b>.
                <button onClick={reset} style={{ color: "var(--ai1)", fontWeight: 700, marginLeft: 8 }}>↺ Try another</button>
              </div>
              <div className="match-grid">
                {results.map(({ product, score }) => (
                  <div className="match-card" key={product.id} onClick={() => { onOpenProduct(product); onClose(); }}>
                    <span className="score">{score}% match</span>
                    <img src={product.image} alt={product.name} />
                    <div className="mb">
                      <b>{product.brand}</b>
                      <span>{product.name}</span>
                      <b style={{ color: "var(--pink)" }}>{inr(product.price)}</b>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

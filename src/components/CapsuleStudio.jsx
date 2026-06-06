import { useState, useEffect } from "react";
import { inr } from "../utils.js";
import { buildCapsule } from "../ai/engine.js";

const OCCASIONS = ["casual", "office", "party", "college", "vacation", "festive", "date", "brunch"];

export default function CapsuleStudio({ open, onClose, onOpenProduct, auto }) {
  const [budget, setBudget] = useState(14000);
  const [gender, setGender] = useState("women");
  const [picked, setPicked] = useState(["casual", "office", "party"]);
  const [stage, setStage] = useState("setup"); // setup | building | result
  const [result, setResult] = useState(null);

  // demo deep-link: auto-build once when opened with ?auto
  useEffect(() => {
    if (!open || !auto) return;
    const t = setTimeout(() => { setResult(buildCapsule(14000, ["casual", "office", "party"], "women")); setStage("result"); }, 0);
    return () => clearTimeout(t);
  }, [open, auto]);

  if (!open) return null;

  const toggle = (o) =>
    setPicked((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));

  const build = () => {
    setStage("building");
    setTimeout(() => {
      setResult(buildCapsule(budget, picked, gender));
      setStage("result");
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span style={{ fontSize: 22 }}>🧳</span>
          <div>
            <h3>Capsule <span className="ai-chip">SIGNATURE AI</span></h3>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              A tiny wardrobe that makes a huge number of outfits, built to your budget
            </div>
          </div>
          <button className="x" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {stage === "setup" && (
            <>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
                Tell StyleGenie your budget and the occasions you actually dress for. It assembles a small set
                of maximally mix and match pieces, then shows how many complete looks they unlock.
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>I dress for…</label>
                <div className="vibe-row" style={{ justifyContent: "flex-start", marginTop: 8 }}>
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => toggle(o)}
                      style={
                        picked.includes(o)
                          ? { background: "var(--ai1)", color: "#fff", borderColor: "var(--ai1)", textTransform: "capitalize" }
                          : { textTransform: "capitalize" }
                      }
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>Wardrobe for</label>
                <div className="vibe-row" style={{ justifyContent: "flex-start", marginTop: 8 }}>
                  {["women", "men"].map((g) => (
                    <button key={g} onClick={() => setGender(g)}
                      style={gender === g ? { background: "var(--ink)", color: "#fff", borderColor: "var(--ink)", textTransform: "capitalize" } : { textTransform: "capitalize" }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
                  Budget: <b style={{ color: "var(--ink)", fontSize: 14 }}>{inr(budget)}</b>
                </label>
                <input
                  type="range" min="8000" max="25000" step="1000" value={budget}
                  onChange={(e) => setBudget(+e.target.value)}
                  style={{ width: "100%", marginTop: 8, accentColor: "var(--ai1)" }}
                />
              </div>

              <button className="btn btn-primary" onClick={build} disabled={!picked.length}>
                🧳 Build my capsule wardrobe
              </button>
            </>
          )}

          {stage === "building" && (
            <div className="dropzone">
              <div className="big">🧳</div>
              <div style={{ fontWeight: 700 }}>Optimising your capsule…</div>
              <div className="typing" style={{ justifyContent: "center" }}><span /><span /><span /></div>
              <p>Maximising outfit combinations across {picked.join(", ")} within {inr(budget)}</p>
            </div>
          )}

          {stage === "result" && result && (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, background: "linear-gradient(135deg,var(--ai1),var(--ai2))", color: "#fff", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{result.pieces} pieces</div>
                  <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>spend {inr(result.spent)} of {inr(result.budget)}</div>
                </div>
                <div style={{ flex: 1, background: "#faf7ff", border: "1px solid #ece4ff", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: "var(--ai1)" }}>≈ {result.outfits} outfits</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>complete looks you can mix</div>
                </div>
              </div>

              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", margin: "4px 0 8px" }}>YOUR CAPSULE</div>
              <div className="match-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 16 }}>
                {result.items.map((p) => (
                  <div className="match-card" key={p.id} onClick={() => { onOpenProduct(p); onClose(); }}>
                    <img src={p.image} alt={p.name} />
                    <div className="mb">
                      <b style={{ fontSize: 11 }}>{p.brand}</b>
                      <span style={{ textTransform: "capitalize" }}>{p.role}</span>
                      <b style={{ color: "var(--pink)", fontSize: 11 }}>{inr(p.price)}</b>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", margin: "4px 0 8px" }}>SAMPLE COMBINATIONS</div>
              <div className="looks">
                {result.examples.map((look, i) => (
                  <div className="look" key={i}>
                    <div className="look-items">
                      {look.items.map((it) => (
                        <div className="li" key={it.id} onClick={() => { onOpenProduct(it); onClose(); }}>
                          <img src={it.image} alt={it.name} />
                          <span>{it.brand}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn btn-outline" style={{ marginTop: 14 }} onClick={() => setStage("setup")}>
                ↺ Adjust budget or occasions
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

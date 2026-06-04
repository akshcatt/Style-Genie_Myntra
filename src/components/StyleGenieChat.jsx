import { useState, useRef, useEffect } from "react";
import { inr } from "../utils.js";
import { parseIntent, searchCatalog } from "../ai/engine.js";

const SUGGESTIONS = [
  "Outfit for a college fest under ₹2K",
  "Something for a beach vacation, Instagram-worthy",
  "Festive ethnic look for Diwali under 3k",
  "Office wear for men, smart but not boring",
];

const GREETING = {
  role: "bot",
  text: "Hi! I'm StyleGenie 👋 Tell me the occasion, your budget and the vibe — I'll pull together looks for you. Try: “something for a friend's wedding, elegant, under 4K”.",
};

function intentSummary(intent) {
  const tags = [];
  if (intent.occasion) tags.push(intent.occasion);
  if (intent.budget) tags.push("≤ " + inr(intent.budget));
  if (intent.gender) tags.push(intent.gender);
  intent.style.forEach((s) => tags.push(s));
  return tags;
}

function botReply(intent, results) {
  if (!results.length) {
    return "Hmm, I couldn't find a strong match for that. Try adding an occasion (party, wedding, casual) or a budget?";
  }
  const bits = [];
  if (intent.occasion) bits.push(`for a ${intent.occasion} occasion`);
  if (intent.budget) bits.push(`under ${inr(intent.budget)}`);
  if (intent.style.length) bits.push(`with a ${intent.style.slice(0, 2).join(" / ")} vibe`);
  const ctx = bits.length ? " " + bits.join(", ") : "";
  return `Got it — here are ${results.length} curated picks${ctx}. Tap any to see fit + full outfit:`;
}

export default function StyleGenieChat({ open, setOpen, onOpenProduct, pendingQuery }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setTyping(true);
    setTimeout(() => {
      const intent = parseIntent(q);
      const results = searchCatalog(intent, { limit: 5 });
      setTyping(false);
      setMessages((m) => [
        ...m,
        { role: "bot", text: botReply(intent, results), tags: intentSummary(intent), cards: results },
      ]);
    }, 1100);
  };

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  // External queries (search bar / category chips) flow into the assistant.
  // Deferred to a task so it isn't a synchronous setState inside the effect body.
  useEffect(() => {
    if (!pendingQuery || !pendingQuery.text) return;
    const t = setTimeout(() => send(pendingQuery.text), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuery]);

  if (!open) {
    return (
      <button className="sg-fab" onClick={() => setOpen(true)}>
        <span className="pulse" /> ✨ Ask StyleGenie
      </button>
    );
  }

  return (
    <div className="sg-panel">
      <div className="sg-header">
        <div className="avatar">✨</div>
        <div>
          <h3>StyleGenie</h3>
          <p>AI Style Concierge · always on</p>
        </div>
        <button className="x" onClick={() => setOpen(false)}>×</button>
      </div>

      <div className="sg-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div className={"msg " + m.role}>{m.text}</div>
            {m.tags && m.tags.length > 0 && (
              <div className="intent-tags">
                {m.tags.map((t, j) => <span className="t" key={j}>{t}</span>)}
              </div>
            )}
            {m.cards && (
              <div className="chat-cards">
                {m.cards.map((p) => (
                  <div className="chat-card" key={p.id} onClick={() => { onOpenProduct(p); setOpen(false); }}>
                    <img src={p.image} alt={p.name} />
                    <div>
                      <div className="cc-brand">{p.brand}</div>
                      <div className="cc-name">{p.name}</div>
                      <div className="cc-price">{inr(p.price)} <span style={{ color: "#ff905a", fontSize: 11 }}>{p.discount}% off</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && <div className="msg bot" style={{ padding: 0 }}><div className="typing"><span /><span /><span /></div></div>}
      </div>

      <div className="sg-suggest">
        {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
      </div>

      <div className="sg-input">
        <input
          value={input}
          placeholder="Describe what you need…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <button className="send" onClick={() => send()}>➤</button>
      </div>
    </div>
  );
}

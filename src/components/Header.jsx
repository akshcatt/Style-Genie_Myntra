import { CATEGORIES } from "../data/products.js";

const CHIPS = [
  "Wedding", "Party", "Casual", "Office", "Vacation", "Festive", "Athleisure", "Date Night",
];

export default function Header({ route, setRoute, bagCount, onVisualMatch, onChipSearch, onCapsule }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="logo" onClick={() => setRoute({ page: "home", cat: "all" })} style={{ cursor: "pointer" }}>
          <span className="logo-mark">M</span>
          <span style={{ color: "var(--pink)" }}>Myntra</span>
        </div>
        <nav className="nav">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={route.page === "home" && route.cat === c.key ? "active" : route.page === "trends" && c.key === "trends" ? "active" : ""}
              onClick={() => setRoute(c.key === "trends" ? { page: "trends" } : { page: "home", cat: c.key })}
            >
              {c.label}
              {c.badge && <span className="ai-badge">{c.badge}</span>}
            </button>
          ))}
          <button onClick={onCapsule}>Capsule<span className="ai-badge">AI</span></button>
        </nav>
        <div className="search">
          <span>🔍</span>
          <input
            placeholder="Try “linen shirt for a beach trip under 2k”"
            onKeyDown={(e) => { if (e.key === "Enter" && e.target.value.trim()) onChipSearch(e.target.value); }}
          />
          <button className="cam" title="Visual Match — search by image" onClick={onVisualMatch}>📷</button>
        </div>
        <div className="header-icons">
          <div className="ic"><span className="big">👤</span>Profile</div>
          <div className="ic"><span className="big">♡</span>Wishlist</div>
          <div className="ic">
            <span className="big">🛍️{bagCount > 0 && <span className="bag-count">{bagCount}</span>}</span>Bag
          </div>
        </div>
      </div>
      <div className="subnav">
        <div className="container subnav-inner">
          {CHIPS.map((c) => (
            <button key={c} className="chip" onClick={() => onChipSearch(c)}>{c}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

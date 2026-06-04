import { inr } from "../utils.js";

export default function ProductCard({ product, onOpen, studio }) {
  return (
    <div className="card" onClick={() => onOpen(product)}>
      {studio && (
        <span className="studio-badge">✨ Style it</span>
      )}
      <img className="pimg" src={product.image} alt={product.name} />
      <div className="rating">
        <span className="star">★</span>
        <span>{product.rating}</span>
        <span className="cnt">{(product.ratingCount / 1000).toFixed(1)}k</span>
      </div>
      <div className="pbody">
        <div className="pbrand">{product.brand}</div>
        <div className="pname">{product.name}</div>
        <div className="pprice">
          {inr(product.price)}
          <span className="mrp">{inr(product.mrp)}</span>
          <span className="off">({product.discount}% OFF)</span>
        </div>
      </div>
    </div>
  );
}

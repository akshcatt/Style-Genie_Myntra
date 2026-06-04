// Mock Myntra-style catalog. Images are generated as self-contained branded SVG
// data-URIs (see image.js) so the prototype renders perfectly offline and when
// deployed — no broken image links, ever.
import { productImage } from "./image.js";

let _id = 0;
const P = (o) => {
  const id = ++_id;
  return {
    id,
    image: productImage({ category: o.category, color: o.color, label: o.brand }),
    rating: o.rating ?? (3.8 + ((id * 7) % 12) / 10).toFixed(1),
    ratingCount: o.ratingCount ?? 200 + ((id * 137) % 4000),
    ...o,
  };
};

export const PRODUCTS = [
  // ---- Women ----
  P({ brand: "Sangria", name: "Floral Print A-Line Dress", category: "dress", gender: "women",
      color: "#d96a8a", price: 1499, mrp: 2999, discount: 50, occasion: ["casual", "brunch", "vacation"],
      style: ["floral", "feminine", "boho"], fit: "true to size" }),
  P({ brand: "Tokyo Talkies", name: "Bodycon Party Dress", category: "dress", gender: "women",
      color: "#2b2b3a", price: 1899, mrp: 3499, discount: 45, occasion: ["party", "date", "night out"],
      style: ["chic", "elegant", "minimal"], fit: "runs slim" }),
  P({ brand: "Libas", name: "Anarkali Ethnic Kurta", category: "kurta", gender: "women",
      color: "#7b3f9e", price: 2199, mrp: 3999, discount: 45, occasion: ["festive", "wedding", "diwali"],
      style: ["ethnic", "traditional", "elegant"], fit: "true to size" }),
  P({ brand: "Anouk", name: "Banarasi Silk Saree", category: "saree", gender: "women",
      color: "#b8860b", price: 3499, mrp: 6999, discount: 50, occasion: ["wedding", "festive"],
      style: ["traditional", "luxe", "ethnic"], fit: "free size" }),
  P({ brand: "Roadster", name: "Relaxed Fit Casual Top", category: "top", gender: "women",
      color: "#e8e0d0", price: 699, mrp: 1299, discount: 46, occasion: ["casual", "college", "everyday"],
      style: ["minimal", "casual"], fit: "true to size" }),
  P({ brand: "DressBerry", name: "Pleated Midi Skirt", category: "skirt", gender: "women",
      color: "#3a6b5a", price: 1299, mrp: 2499, discount: 48, occasion: ["brunch", "work", "date"],
      style: ["chic", "feminine"], fit: "true to size" }),
  P({ brand: "H&M", name: "High-Waist Mom Jeans", category: "jeans", gender: "women",
      color: "#5a7a9a", price: 1799, mrp: 2999, discount: 40, occasion: ["casual", "college", "everyday"],
      style: ["denim", "casual", "minimal"], fit: "runs slim in the waist" }),
  P({ brand: "Vero Moda", name: "Oversized Linen Shirt", category: "shirt", gender: "women",
      color: "#dfe6e9", price: 1599, mrp: 2799, discount: 43, occasion: ["vacation", "brunch", "casual"],
      style: ["minimal", "boho", "linen"], fit: "oversized" }),
  P({ brand: "Nykaa Fashion", name: "Sequinned Party Co-ord Set", category: "coord", gender: "women",
      color: "#1f3a5f", price: 2899, mrp: 5499, discount: 47, occasion: ["party", "night out", "new year"],
      style: ["glam", "chic", "statement"], fit: "true to size" }),
  P({ brand: "Biba", name: "Cotton Printed Palazzo Suit", category: "kurta", gender: "women",
      color: "#c0567a", price: 1999, mrp: 3499, discount: 43, occasion: ["festive", "casual", "office"],
      style: ["ethnic", "comfortable"], fit: "true to size" }),

  // ---- Men ----
  P({ brand: "Roadster", name: "Pure Cotton Casual Shirt", category: "shirt", gender: "men",
      color: "#3d5a80", price: 899, mrp: 1799, discount: 50, occasion: ["casual", "college", "office"],
      style: ["minimal", "smart casual"], fit: "true to size" }),
  P({ brand: "HRX", name: "Slim Fit Joggers", category: "joggers", gender: "men",
      color: "#2d2d2d", price: 1099, mrp: 1999, discount: 45, occasion: ["gym", "athleisure", "casual"],
      style: ["sporty", "athleisure"], fit: "runs slim" }),
  P({ brand: "Levis", name: "511 Slim Fit Jeans", category: "jeans", gender: "men",
      color: "#34495e", price: 2499, mrp: 3999, discount: 38, occasion: ["casual", "everyday", "date"],
      style: ["denim", "smart casual"], fit: "true to size" }),
  P({ brand: "Mast & Harbour", name: "Linen Beach Shirt", category: "shirt", gender: "men",
      color: "#e6d3a3", price: 1299, mrp: 2299, discount: 43, occasion: ["vacation", "beach", "casual"],
      style: ["linen", "vacation", "boho"], fit: "relaxed" }),
  P({ brand: "Manyavar", name: "Silk Blend Festive Kurta", category: "kurta", gender: "men",
      color: "#7d2b3a", price: 2799, mrp: 4999, discount: 44, occasion: ["wedding", "festive", "diwali"],
      style: ["ethnic", "traditional", "elegant"], fit: "true to size" }),
  P({ brand: "Allen Solly", name: "Tailored Blazer", category: "blazer", gender: "men",
      color: "#1c2833", price: 3999, mrp: 6999, discount: 43, occasion: ["office", "wedding", "formal"],
      style: ["formal", "sharp", "elegant"], fit: "true to size" }),
  P({ brand: "Highlander", name: "Printed Oversized T-shirt", category: "tshirt", gender: "men",
      color: "#16a085", price: 599, mrp: 1199, discount: 50, occasion: ["casual", "college", "everyday"],
      style: ["streetwear", "casual"], fit: "oversized" }),
  P({ brand: "Puma", name: "Essentials Hoodie", category: "hoodie", gender: "men",
      color: "#4a4a4a", price: 1799, mrp: 2999, discount: 40, occasion: ["casual", "athleisure", "winter"],
      style: ["sporty", "streetwear"], fit: "true to size" }),

  // ---- Footwear / Accessories (unisex-ish) ----
  P({ brand: "Nike", name: "Air Max Sneakers", category: "footwear", gender: "men",
      color: "#ecf0f1", price: 4999, mrp: 7999, discount: 38, occasion: ["casual", "athleisure", "everyday"],
      style: ["sporty", "streetwear"], fit: "true to size" }),
  P({ brand: "Steve Madden", name: "Block Heel Sandals", category: "footwear", gender: "women",
      color: "#c9a227", price: 2999, mrp: 4999, discount: 40, occasion: ["party", "wedding", "date"],
      style: ["glam", "elegant"], fit: "true to size" }),
  P({ brand: "Bata", name: "Formal Leather Derby", category: "footwear", gender: "men",
      color: "#3e2723", price: 2299, mrp: 3499, discount: 34, occasion: ["office", "formal", "wedding"],
      style: ["formal", "classic"], fit: "true to size" }),
  P({ brand: "Lavie", name: "Quilted Sling Bag", category: "bag", gender: "women",
      color: "#8d6e63", price: 1599, mrp: 2999, discount: 47, occasion: ["party", "brunch", "date"],
      style: ["chic", "elegant"], fit: "free size" }),
  P({ brand: "Fastrack", name: "Aviator Sunglasses", category: "accessory", gender: "men",
      color: "#212121", price: 999, mrp: 1799, discount: 44, occasion: ["vacation", "casual", "beach"],
      style: ["cool", "streetwear"], fit: "free size" }),
  P({ brand: "Carlton London", name: "Statement Earrings", category: "accessory", gender: "women",
      color: "#d4af37", price: 799, mrp: 1499, discount: 47, occasion: ["festive", "party", "wedding"],
      style: ["glam", "ethnic"], fit: "free size" }),
];

export const CATEGORIES = [
  { key: "all", label: "Home" },
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "trends", label: "TrendPulse", badge: "AI" },
];

export const getById = (id) => PRODUCTS.find((p) => p.id === id);

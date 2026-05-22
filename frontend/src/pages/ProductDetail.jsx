import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, Shield, Truck, RefreshCw, Heart } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart, setCartOpen } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="font-display text-2xl font-bold mb-2">Product not found</h2>
        <Link to="/shop" className="text-accent hover:underline text-sm">Back to shop</Link>
      </div>
    </div>
  );

  const related = product
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  const handleAdd = () => {
    if (!user) { navigate('/login'); return; }
    for (let i = 0; i < qty; i++) addToCart(product);
    addToast(`${product.name} added to cart`);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?cat=${product.category}`}
            className="hover:text-charcoal transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-charcoal font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-surface">
              <img src={product.image} alt={product.name}
                className="w-full h-full object-cover" />
            </div>
            {product.badge && (
              <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-sm font-bold"
                style={{ background: '#C9A84C', color: '#1C1C1E' }}>
                {product.badge}
              </span>
            )}
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={`absolute top-5 right-5 p-3 rounded-full border transition-all duration-300 ${wishlisted ? 'bg-red-50 border-red-200' : 'bg-white border-surface hover:border-red-200'
                }`}>
              <Heart size={18} fill={wishlisted ? '#EF4444' : 'none'}
                className={wishlisted ? 'text-red-500' : 'text-charcoal/50'} />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2 capitalize">
              {product.category}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? '#C9A84C' : 'none'}
                    className={i < Math.floor(product.rating) ? 'text-accent' : 'text-surface'} />
                ))}
              </div>
              <span className="font-semibold text-charcoal">{product.rating}</span>
              <span className="text-muted text-sm">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <p className="text-charcoal/70 leading-relaxed mb-8 text-base">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-display text-4xl font-bold text-charcoal">
                ₱{product.price.toLocaleString()}
              </span>
              <span className="text-muted text-sm line-through">
                ₱{Math.round(product.price * 1.15).toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                Save 15%
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-muted">Quantity</span>
              <div className="flex items-center gap-3 bg-surface rounded-full px-4 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-charcoal font-bold shadow-sm hover:bg-cream transition-colors">
                  −
                </button>
                <span className="font-semibold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-charcoal font-bold shadow-sm hover:bg-cream transition-colors">
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button onClick={handleAdd}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-semibold text-base btn-shimmer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-4"
              style={{ background: '#1C1C1E', color: '#FAF8F5' }}>
              <ShoppingBag size={18} />
              Add to Cart — ₱{(product.price * qty).toLocaleString()}
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders over ₱5,500' },
                { icon: Shield, label: '2-Year Warranty', sub: 'Full coverage' },
                { icon: RefreshCw, label: 'Easy Returns', sub: '30-day policy' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-surface">
                  <Icon size={18} className="text-accent" />
                  <span className="text-xs font-semibold text-charcoal">{label}</span>
                  <span className="text-xs text-muted">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">More Like This</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">Related Products</h2>
              </div>
              <Link to={`/shop?cat=${product.category}`}
                className="text-sm font-medium text-muted hover:text-charcoal transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 80} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, delay = 0 }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    addToCart(product);
    addToast(`${product.name} added to cart`);
  };

  return (
    <div
      className="product-card bg-white rounded-3xl overflow-hidden border border-surface group cursor-pointer animate-slide-up h-full"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both', opacity: 0 }}
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        {/* Image */}
        <div className="relative overflow-hidden bg-surface h-52">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: '#C9A84C', color: '#1C1C1E' }}>
              {product.badge}
            </span>
          )}
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
            <Heart size={14} className="text-charcoal/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between ">
          <div>
            <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-semibold text-charcoal text-sm leading-tight line-clamp-2 mb-2">{product.name}</h3>
            <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">{product.description}</p>
          </div>

          <div>
            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill={i < Math.floor(product.rating) ? '#C9A84C' : 'none'}
                    className={i < Math.floor(product.rating) ? 'text-accent' : 'text-surface'} />
                ))}
              </div>
              <span className="text-xs text-muted">{product.rating} ({product.reviews.toLocaleString()})</span>
            </div>

            {/* Price + Add */}
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-charcoal">₱{product.price.toLocaleString()}</span>
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold btn-shimmer transition-all duration-300 active:scale-95"
                style={{ background: '#1C1C1E', color: '#FAF8F5' }}
              >
                <ShoppingBag size={13} />
                Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

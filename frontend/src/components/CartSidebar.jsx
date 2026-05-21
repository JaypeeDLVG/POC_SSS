import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const email = user?.email || 'your email address';
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
    clearCart();
    setCartOpen(false);
    addToast(`Order placed successfully! A summary of your ${itemCount} item order totaling $${total.toLocaleString()} will be sent to ${email}. 🎉`);
  };

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 modal-overlay bg-charcoal/30"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 cart-sidebar flex flex-col shadow-2xl   ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-accent" />
            <h2 className="font-display text-xl font-semibold">Your Cart</h2>
            {cart.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: '#C9A84C', color: '#1C1C1E' }}>
                {cart.length}
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)}
            className="p-2 rounded-full hover:bg-surface transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center">
                <ShoppingBag size={32} className="text-muted" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">Your cart is empty</p>
                <p className="text-sm text-muted mt-1">Add something amazing to get started</p>
              </div>
              <button onClick={() => setCartOpen(false)}
                className="mt-2 px-6 py-2.5 rounded-full text-sm font-semibold btn-shimmer"
                style={{ background: '#1C1C1E', color: '#FAF8F5' }}>
                Browse Products
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-surface animate-fade-in">
                <img src={item.image} alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-charcoal line-clamp-1">{item.name}</p>
                  <p className="text-accent font-bold text-sm mt-0.5">${item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-full bg-surface hover:bg-surface flex items-center justify-center transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-full bg-surface hover:bg-surface flex items-center justify-center transition-colors">
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-1 text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-surface space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm">Subtotal</span>
              <span className="font-bold text-lg font-display">${total.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold btn-shimmer transition-all duration-300"
              style={{ background: '#1C1C1E', color: '#FAF8F5' }}>
              Checkout <ArrowRight size={16} />
            </button>
            <button onClick={clearCart}
              className="w-full py-2 text-sm text-muted hover:text-charcoal transition-colors">
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

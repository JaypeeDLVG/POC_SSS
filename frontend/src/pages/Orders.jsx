import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const loadOrders = () => {
    if (!user || !user.username) { setOrders([]); return; }
    try {
      const key = `shopwave_orders_${user.username}`;
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      setOrders(Array.isArray(stored) ? stored : []);
    } catch (e) {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    const handler = () => loadOrders();
    window.addEventListener('ordersUpdated', handler);
    // also listen to storage in case other tab updated
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('ordersUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, [user?.username]);

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
  };

  return (
    <div className="min-h-screen bg-cream pt-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">Account</p>
          <h1 className="font-display text-4xl font-bold text-charcoal">My Orders</h1>
          <p className="text-muted mt-1">@{user?.username}</p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white rounded-3xl border border-surface">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center">
              <ShoppingBag size={28} className="text-muted" />
            </div>
            <p className="font-semibold text-charcoal">No orders yet</p>
            <p className="text-sm text-muted">Your completed orders will appear here</p>
            <Link to="/shop"
              className="mt-2 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold btn-shimmer"
              style={{ background: '#1C1C1E', color: '#FAF8F5' }}>
              Start Shopping <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-surface p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted">Order #{order.id}</div>
                      <div className="font-semibold">{formatDate(order.date)}</div>
                      {order.paymentMethod === 'instore' && order.instoreRef && (
                        <div className="text-xs text-muted">Ref: {order.instoreRef}</div>
                      )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted">Total</div>
                    <div className="font-bold text-accent">₱{order.total.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="text-sm text-accent font-semibold">
                    {expanded === order.id ? 'Hide details' : 'View details'}
                  </button>
                  {expanded === order.id && (
                    <div className="mt-3 border-t border-surface pt-3 space-y-2">
                      {order.items.map(it => (
                        <div key={it.id} className="flex items-center justify-between">
                          <div className="text-sm">{it.name} × {it.qty}</div>
                          <div className="font-semibold">₱{(it.price * it.qty).toLocaleString()}</div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-surface flex items-center justify-between">
                        <div className="text-sm text-muted">Shipping</div>
                        <div className="text-sm">{order.shipping?.city}, {order.shipping?.country}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted">Payment</div>
                        <div className="text-sm">
                          {order.paymentMethod === 'card' ? 'Card' : order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'In-Store'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

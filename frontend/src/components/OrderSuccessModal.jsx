import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function OrderSuccessModal({ orderData, onClose }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Overlay - No interaction */}
            <div className="absolute inset-0 bg-charcoal/40 pointer-events-none" />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in flex flex-col items-center text-center">
                {/* Checkmark Animation */}
                <div className="mb-6 relative">
                    <div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center animate-scale-in"
                        style={{
                            animation: 'scaleIn 0.6s ease-out',
                        }}
                    >
                        <style>{`
              @keyframes scaleIn {
                0% {
                  transform: scale(0);
                  opacity: 0;
                }
                50% {
                  transform: scale(1.1);
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              @keyframes checkmarkDraw {
                0% {
                  stroke-dashoffset: 50;
                  opacity: 0;
                }
                50% {
                  opacity: 1;
                }
                100% {
                  stroke-dashoffset: 0;
                  opacity: 1;
                }
              }
              .checkmark {
                animation: checkmarkDraw 0.6s ease-out 0.3s forwards;
                stroke-dasharray: 50;
              }
            `}</style>
                        <svg
                            className="checkmark"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
                    Order Placed!
                </h2>
                <p className="text-muted text-sm mb-2">
                    Your order has been confirmed.
                </p>
                <p className="text-muted text-sm mb-6">
                    Order details will be sent to {orderData.email || 'your email'} shortly.
                </p>

                {/* Order Details */}
                <div className="w-full bg-surface/50 rounded-2xl p-4 mb-6 space-y-2 text-left">
                    {(() => {
                        const name = orderData?.name || orderData?.shipping?.name || '';
                        const address = orderData?.address || orderData?.shipping?.address || '';
                        const houseNumber = orderData?.houseNumber || orderData?.shipping?.houseNumber || '';
                        const city = orderData?.city || orderData?.shipping?.city || '';
                        const country = orderData?.country || orderData?.shipping?.country || '';
                        const total = orderData?.total || 0;
                        const pm = orderData?.paymentMethod || orderData?.paymentMethod === '' ? orderData.paymentMethod : (orderData?.paymentMethod || 'card');
                        const paymentLabel = pm === 'card' ? 'Card' : pm === 'cod' ? 'Cash on Delivery' : 'In-Store';

                        return (
                            <>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">Name:</span>
                                    <span className="font-semibold text-charcoal">{name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">Address:</span>
                                    <span className="font-semibold text-charcoal text-right">
                                        {address}{address && houseNumber ? ', ' : ''}{houseNumber}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">Location:</span>
                                    <span className="font-semibold text-charcoal">
                                        {city}{city && country ? ', ' : ''}{country}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">Payment:</span>
                                    <span className="font-semibold text-charcoal">{paymentLabel}</span>
                                </div>
                                {pm === 'instore' && orderData.instoreRef && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted">Reference No.:</span>
                                        <span className="font-semibold text-charcoal">{orderData.instoreRef}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted">Total:</span>
                                    <span className="font-bold text-accent text-lg">
                                        ₱{total.toLocaleString()}
                                    </span>
                                </div>
                            </>
                        );
                    })()}
                </div>

                {/* Close Button */}
                <div className="w-full grid gap-3 sm:grid-cols-2">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-semibold transition-all duration-300"
                        style={{
                            background: '#C9A84C',
                            color: '#1C1C1E',
                        }}
                    >
                        Continue Shopping
                    </button>
                    <Link
                        to="/orders"
                        className="w-full py-3 rounded-xl font-semibold text-center border border-surface transition-all duration-300 hover:bg-surface/70"
                        onClick={onClose}
                    >
                        View My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}

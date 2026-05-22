import React, { useState } from 'react';
import { X, CreditCard, ChevronLeft } from 'lucide-react';

export default function OrderForm({ total, cart, onClose, onBack, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        city: '',
        address: '',
        houseNumber: '',
        // payment
        paymentMethod: 'card', // 'card' | 'cod' | 'instore'
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });
    // additional fields for COD alternate delivery
    // we keep them in state too
    // formData.codUseSameAddress === true means use above address for COD
    // when false, the following fields are used as desired delivery address
    const [codDelivery, setCodDelivery] = useState({
        codUseSameAddress: true,
        deliveryCountry: '',
        deliveryCity: '',
        deliveryAddress: '',
        deliveryHouseNumber: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.address.trim()) newErrors.address = 'Street address is required';
        if (!formData.houseNumber.trim()) newErrors.houseNumber = 'House number is required';
        // Validate card details only when paying by card
        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = 'Card number is required';
            if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Card number must be 16 digits';
            if (!formData.cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
            if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
            if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Use MM/YY format';
            if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
            if (formData.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
        }

        // If COD and customer chose a different delivery address, validate it
        if (formData.paymentMethod === 'cod' && codDelivery.codUseSameAddress === false) {
            if (!codDelivery.deliveryCountry.trim()) newErrors.deliveryCountry = 'Country is required';
            if (!codDelivery.deliveryCity.trim()) newErrors.deliveryCity = 'City is required';
            if (!codDelivery.deliveryAddress.trim()) newErrors.deliveryAddress = 'Street address is required';
            if (!codDelivery.deliveryHouseNumber.trim()) newErrors.deliveryHouseNumber = 'House number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            processedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        }

        // Format expiry date
        if (name === 'expiryDate') {
            processedValue = value.replace(/\D/g, '');
            if (processedValue.length >= 2) {
                processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2, 4);
            }
        }

        // Only allow digits for CVV
        if (name === 'cvv') {
            processedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        // If selecting payment method 'instore', generate an instore reference
        if (name === 'paymentMethod' && value === 'instore') {
            setFormData(prev => ({ ...prev, [name]: processedValue, instoreRef: generateInstoreRef() }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const generateInstoreRef = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let out = '';
        for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
        return `REF-${out}`;
    };

    const handleCodDeliveryChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'radio' && name === 'codUseSameAddress') {
            setCodDelivery(prev => ({ ...prev, codUseSameAddress: value === 'true' }));
            return;
        }
        setCodDelivery(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            onSubmit({
                ...formData,
                ...codDelivery,
                total
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 modal-overlay bg-charcoal/30 pointer-events-none"
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 cart-sidebar flex flex-col shadow-2xl translate-x-0 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-surface">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-1 rounded-full hover:bg-surface transition-colors">
                            <ChevronLeft size={20} className="text-charcoal" />
                        </button>
                        <h2 className="font-display text-xl font-semibold text-charcoal">Complete Order</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-surface transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Order Summary */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-charcoal">Order Summary</h3>
                        <div className="p-4 bg-surface/50 rounded-xl space-y-2 max-h-48 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-charcoal line-clamp-1">{item.name}</p>
                                        <p className="text-muted text-xs">Qty: {item.qty}</p>
                                    </div>
                                    <p className="text-accent font-bold ml-2 flex-shrink-0">₱{(item.price * item.qty).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                            <p className="text-sm text-muted">Total Amount</p>
                            <p className="text-2xl font-bold font-display text-accent">₱{total.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="border-b border-surface/70" />

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-charcoal">Delivery Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                    } focus:outline-none focus:border-accent focus:bg-white`}
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="United States"
                                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${errors.country ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                        } focus:outline-none focus:border-accent focus:bg-white`}
                                />
                                {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-1.5">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="New York"
                                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${errors.city ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                        } focus:outline-none focus:border-accent focus:bg-white`}
                                />
                                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-1.5">Street Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 Main Street"
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${errors.address ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                    } focus:outline-none focus:border-accent focus:bg-white`}
                            />
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-1.5">House Number</label>
                            <input
                                type="text"
                                name="houseNumber"
                                value={formData.houseNumber}
                                onChange={handleChange}
                                placeholder="Apt 4B"
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${errors.houseNumber ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                    } focus:outline-none focus:border-accent focus:bg-white`}
                            />
                            {errors.houseNumber && <p className="text-xs text-red-500 mt-1">{errors.houseNumber}</p>}
                        </div>
                    </div>

                    <div className="border-b border-surface/70" />

                    {/* Credit Card Information */}
                    <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CreditCard size={18} className="text-accent" />
                                <h3 className="font-semibold text-charcoal">Payment Method</h3>
                            </div>

                            <div className="mt-2 flex gap-2 items-center">
                                <label className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 min-w-[110px] justify-center transition-all text-xs ${formData.paymentMethod==='card' ? 'border-accent bg-accent/30 text-accent shadow-sm ring-1 ring-accent/40' : 'border-surface bg-surface/50 hover:scale-105 hover:shadow-sm text-charcoal'} cursor-pointer`}>
                                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod==='card'} onChange={handleChange} className="sr-only" aria-checked={formData.paymentMethod==='card'} />
                                    <span className={`${formData.paymentMethod==='card' ? 'font-semibold' : 'font-medium'}`}>Pay by Card</span>
                                </label>
                                <label className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 min-w-[130px] justify-center transition-all text-xs ${formData.paymentMethod==='cod' ? 'border-accent bg-accent/30 text-accent shadow-sm ring-1 ring-accent/40' : 'border-surface bg-surface/50 hover:scale-105 hover:shadow-sm text-charcoal'} cursor-pointer`}>
                                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod==='cod'} onChange={handleChange} className="sr-only" aria-checked={formData.paymentMethod==='cod'} />
                                    <span className={`${formData.paymentMethod==='cod' ? 'font-semibold' : 'font-medium'}`}>Cash on Delivery</span>
                                </label>
                                <label className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 min-w-[110px] justify-center transition-all text-xs ${formData.paymentMethod==='instore' ? 'border-accent bg-accent/30 text-accent shadow-sm ring-1 ring-accent/40' : 'border-surface bg-surface/50 hover:scale-105 hover:shadow-sm text-charcoal'} cursor-pointer`}>
                                    <input type="radio" name="paymentMethod" value="instore" checked={formData.paymentMethod==='instore'} onChange={handleChange} className="sr-only" aria-checked={formData.paymentMethod==='instore'} />
                                    <span className={`${formData.paymentMethod==='instore' ? 'font-semibold' : 'font-medium'}`}>Pay In-Store</span>
                                </label>
                            </div>

                            {formData.paymentMethod === 'card' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-1.5">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            className={`w-full px-4 py-2.5 rounded-lg border transition-colors font-mono ${errors.cardNumber ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                                } focus:outline-none focus:border-accent focus:bg-white`}
                                        />
                                        {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-1.5">Cardholder Name</label>
                                        <input
                                            type="text"
                                            name="cardHolder"
                                            value={formData.cardHolder}
                                            onChange={handleChange}
                                            placeholder="JOHN DOE"
                                            className={`w-full px-4 py-2.5 rounded-lg border transition-colors uppercase ${errors.cardHolder ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                                } focus:outline-none focus:border-accent focus:bg-white`}
                                        />
                                        {errors.cardHolder && <p className="text-xs text-red-500 mt-1">{errors.cardHolder}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-1.5">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors font-mono ${errors.expiryDate ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                                    } focus:outline-none focus:border-accent focus:bg-white`}
                                            />
                                            {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal mb-1.5">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                placeholder="123"
                                                maxLength="3"
                                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors font-mono ${errors.cvv ? 'border-red-400 bg-red-50' : 'border-surface bg-surface/50'
                                                    } focus:outline-none focus:border-accent focus:bg-white`}
                                            />
                                            {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                                        </div>
                                    </div>
                                </>
                            )}

                            {formData.paymentMethod === 'cod' && (
                                <div className="mt-4 p-3 bg-surface/50 rounded-lg">
                                    <div className="text-sm font-medium mb-2">Delivery Address</div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <label className={`px-2.5 py-1.5 rounded-lg border flex-1 text-center transition-all text-sm ${codDelivery.codUseSameAddress ? 'border-accent bg-accent/30 text-accent shadow-sm ring-1 ring-accent/40' : 'border-surface bg-surface/50 hover:scale-105 hover:shadow-sm text-charcoal'} cursor-pointer`}>
                                            <input type="radio" name="codUseSameAddress" value="true" checked={codDelivery.codUseSameAddress === true} onChange={handleCodDeliveryChange} className="sr-only" />
                                            Use address above
                                        </label>
                                        <label className={`px-2.5 py-1.5 rounded-lg border flex-1 text-center transition-all text-sm ${codDelivery.codUseSameAddress === false ? 'border-accent bg-accent/30 text-accent shadow-sm ring-1 ring-accent/40' : 'border-surface bg-surface/50 hover:scale-105 hover:shadow-sm text-charcoal'} cursor-pointer`}>
                                            <input type="radio" name="codUseSameAddress" value="false" checked={codDelivery.codUseSameAddress === false} onChange={handleCodDeliveryChange} className="sr-only" />
                                            Use Different address
                                        </label>
                                    </div>

                                    {!codDelivery.codUseSameAddress && (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
                                                    <input type="text" name="deliveryCountry" value={codDelivery.deliveryCountry} onChange={handleCodDeliveryChange} placeholder="Country" className="w-full px-4 py-2.5 rounded-lg border bg-surface/50 focus:outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-charcoal mb-1.5">City</label>
                                                    <input type="text" name="deliveryCity" value={codDelivery.deliveryCity} onChange={handleCodDeliveryChange} placeholder="City" className="w-full px-4 py-2.5 rounded-lg border bg-surface/50 focus:outline-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-1.5">Street Address</label>
                                                <input type="text" name="deliveryAddress" value={codDelivery.deliveryAddress} onChange={handleCodDeliveryChange} placeholder="123 Delivery St" className="w-full px-4 py-2.5 rounded-lg border bg-surface/50 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-charcoal mb-1.5">House Number</label>
                                                <input type="text" name="deliveryHouseNumber" value={codDelivery.deliveryHouseNumber} onChange={handleCodDeliveryChange} placeholder="Apt 2" className="w-full px-4 py-2.5 rounded-lg border bg-surface/50 focus:outline-none" />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}

                            {formData.paymentMethod === 'instore' && (
                                <div className="mt-4 p-3 bg-surface/50 rounded-lg">
                                    <div className="text-sm font-medium mb-2">In-Store Payment Reference</div>
                                    <div className="flex items-center gap-2">
                                        <input type="text" readOnly value={formData.instoreRef || ''} className="w-full px-4 py-2 rounded-lg bg-white border" />
                                        <button type="button" onClick={() => {
                                            // regenerate
                                            const ref = generateInstoreRef();
                                            setFormData(prev => ({ ...prev, instoreRef: ref }));
                                        }}
                                            className={`px-3 py-2 rounded-lg border transition-colors ${formData.paymentMethod==='instore' ? 'bg-accent/10 border-accent shadow-md text-charcoal' : 'bg-surface/50 text-muted'}`}>
                                            Regenerate
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted mt-2">Use this reference when you pay in store.</p>
                                </div>
                            )}
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-surface space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-2xl font-semibold btn-shimmer transition-all duration-300 disabled:opacity-50"
                        style={{ background: '#C9A84C', color: '#1C1C1E' }}
                    >
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full py-2 text-sm text-muted hover:text-charcoal transition-colors"
                    >
                        Back to Cart
                    </button>
                </div>
            </div>
        </>
    );
}

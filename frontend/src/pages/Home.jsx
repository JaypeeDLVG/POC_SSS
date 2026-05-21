import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Shield, Truck } from 'lucide-react';
import { carouselSlides, products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';


export default function Home() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => goTo((prev) => (prev + 1) % carouselSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (indexOrFn) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(typeof indexOrFn === 'function' ? indexOrFn(current) : indexOrFn);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const slide = carouselSlides[current];

  const lightenHexColor = (hex, amount = 35) => {
    if (!hex?.startsWith('#') || hex.length !== 7) return hex || '#ffffff';
    const base = parseInt(hex.slice(1), 16);
    const r = Math.round(((base >> 16) & 0xff) + (255 - ((base >> 16) & 0xff)) * (amount / 100));
    const g = Math.round((((base >> 8) & 0xff)) + (255 - (((base >> 8) & 0xff))) * (amount / 100));
    const b = Math.round(((base & 0xff)) + (255 - (base & 0xff)) * (amount / 100));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const accentText = lightenHexColor(slide.accent, 35);
  const featured = products.filter(p => p.badge).slice(0, 4);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Carousel */}
      <section className={`relative h-screen max-h-[700px] min-h-[500px] bg-to-br ${slide.gradient} overflow-hidden transition-all duration-700`}>
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={slide.image}
            alt={slide.subtitle}
            className="object-cover w-full h-full transition-all duration-700 scale-110 opacity-15"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className={`absolute inset-0 bg-to-r ${slide.gradient} opacity-90`} />
        </div>

        {/* Decorative circles */}
        <div className="absolute rounded-full top-1/4 right-1/4 w-96 h-96 opacity-5"
          style={{ background: slide.accent, filter: 'blur(100px)' }} />
        <div className="absolute w-64 h-64 rounded-full bottom-1/4 left-1/4 opacity-10"
          style={{ background: slide.accent, filter: 'blur(60px)' }} />

        {/* Content */}
        <div className="relative z-10 flex items-center h-full">
          <div className="w-full px-6 mx-auto max-w-7xl sm:px-8 lg:px-12">
            <div className="max-w-2xl" key={current}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4 animate-fade-in"
                style={{ color: accentText, animationDelay: '100ms' }}>
                Featured Collection
              </p>
              <h1 className="mb-4 text-5xl font-bold leading-tight text-white font-display sm:text-6xl lg:text-7xl animate-slide-up"
                style={{ animationDelay: '200ms', animationFillMode: 'both', opacity: 0 }}>
                {slide.title}
              </h1>
              <p className="mb-2 text-xl font-semibold animate-slide-up"
                style={{ color: accentText, animationDelay: '300ms', animationFillMode: 'both', opacity: 0 }}>
                {slide.subtitle}
              </p>
              <p className="mb-8 text-base text-white/70 sm:text-lg animate-slide-up"
                style={{ animationDelay: '400ms', animationFillMode: 'both', opacity: 0 }}>
                {slide.desc}
              </p>
              <div className="flex gap-3 animate-slide-up"
                style={{ animationDelay: '500ms', animationFillMode: 'both', opacity: 0 }}>
                <Link
                  to={`/shop?cat=${slide.category}`}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm btn-shimmer transition-all duration-300 hover:scale-105"
                  style={{ background: slide.accent, color: '#1C1C1E' }}
                >
                  {slide.cta} <ArrowRight size={16} />
                </Link>
                <Link to="/shop"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all duration-300">
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute z-20 flex items-center gap-6 -translate-x-1/2 bottom-8 left-1/2">
          <button onClick={() => goTo((current - 1 + carouselSlides.length) % carouselSlides.length)}
            className="p-2 text-white transition-all border rounded-full border-white/30 hover:bg-white/20">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {carouselSlides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                style={i === current ? { background: slide.accent } : {}} />
            ))}
          </div>
          <button onClick={() => goTo((current + 1) % carouselSlides.length)}
            className="p-2 text-white transition-all border rounded-full border-white/30 hover:bg-white/20">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-4 bg-charcoal">
        <div className="flex flex-wrap items-center justify-center gap-8 px-6 mx-auto max-w-7xl sm:gap-16">
          {[
            { icon: Truck, text: 'Free Shipping Over $99' },
            { icon: Shield, text: '2-Year Warranty' },
            { icon: Zap, text: '24/7 Support' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-black/70">
              <Icon size={16} style={{ color: '#C9A84C' }} />
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16 mx-auto max-w-7xl sm:px-8">
        <div className="flex flex-col justify-between gap-4 mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">Browse By</p>
            <h2 className="text-3xl font-bold font-display sm:text-4xl text-charcoal">Categories</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-charcoal transition-colors group">
            View all products <ArrowRight size={14} className="transition-transform group-hover:translate-x-1s" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              id: 'phones', label: 'Phones', count: products.filter(p => p.category === 'phones').length,
              img: '/images/phones.jpg',
              color: '#1C1C1E'
            },
            {
              id: 'laptops', label: 'Laptops', count: products.filter(p => p.category === 'laptops').length,
              img: '/images/laptop.jpg',
              color: '#2D2D30'
            },
            {
              id: 'monitors', label: 'Monitors', count: products.filter(p => p.category === 'monitors').length,
              img: '/images/monitor.png',
              color: '#1A1A2E'
            },
          ].map((cat) => (
            <Link to={`/shop?cat=${cat.id}`} key={cat.id}
              className="relative overflow-hidden rounded-3xl group cursor-pointer h-56 sm:h-64">
              <img src={cat.img} alt={cat.label}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-2xl font-bold text-white font-display">{cat.label}</p>
                <p className="text-sm text-white/60">{cat.count} products</p>
              </div>
              <div className="absolute p-2 transition-all duration-300 rounded-full opacity-0 top-4 right-4 bg-white/10 backdrop-blur-sm group-hover:opacity-100">
                <ArrowRight size={16} className="text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 pb-16 mx-auto max-w-7xl sm:px-8">
        <div className="flex flex-col justify-between gap-4 mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">Handpicked For You</p>
            <h2 className="text-3xl font-bold font-display sm:text-4xl text-charcoal">Featured Products</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-charcoal transition-colors group">
            See all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-4 mb-16 overflow-hidden sm:mx-8 rounded-3xl" style={{ background: '#1C1C1E' }}>
        <div className="relative flex flex-col items-center justify-between gap-6 px-8 overflow-hidden sm:px-16 py-14 sm:flex-row">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
            style={{ background: '#C9A84C', filter: 'blur(60px)', transform: 'translate(30%, -30%)' }} />
          <div>
            <p className="mb-2 text-sm font-bold tracking-wider uppercase text-accent">Limited Time Offer</p>
            <h3 className="mb-2 text-3xl font-bold text-white font-display sm:text-4xl">New Arrivals This Week</h3>
            <p className="text-white/60">Discover the latest tech that's reshaping how we live.</p>
          </div>
          <Link to="/shop"
            className="flex items-center flex-shrink-0 gap-2 px-8 py-4 font-semibold transition-all duration-300 rounded-full btn-shimmer hover:scale-105"
            style={{ background: '#C9A84C', color: '#1C1C1E' }}>
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-black bg-charcoal">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: '#C9A84C' }}>
                <span className="text-xs font-bold text-charcoal">SW</span>
              </div>
              <span className="text-lg font-semibold text-black font-display">ShopWave</span>
            </div>
            <div className="flex gap-6 text-sm">
              {['Home', 'Shop', 'About', 'Contact'].map(l => (
                <Link key={l} to="/" className="transition-colors hover:text-white">{l}</Link>
              ))}
            </div>
            <p className="text-xs">© 2025 ShopWave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

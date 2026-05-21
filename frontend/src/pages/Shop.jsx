import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
];

const ITEMS_PER_PAGE = 7;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
    setCurrentPage(1);
  }, [searchParams]);

  const handleCategory = (id) => {
    setActiveCategory(id);
    setCurrentPage(1);
    if (id === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', id);
    }
    setSearchParams(searchParams);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      case 'reviews': return result.sort((a, b) => b.reviews - a.reviews);
      default: return result;
    }
  }, [activeCategory, search, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pt-20 bg-cream">
      {/* Page Header */}
      <div className="px-6 bg-charcoal py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.25em] mb-2">Browse</p>
          <h1 className="text-4xl font-bold text-black font-display sm:text-5xl">
            {activeCategory === 'all'
              ? 'All Products'
              : categories.find(c => c.id === activeCategory)?.label || 'Products'}
          </h1>
          <p className="mt-2 text-white/50">{filtered.length} products found</p>
        </div>
      </div>

      <div className="px-6 py-10 mx-auto max-w-7xl sm:px-8">
        {/* Filters Bar */}
        <div className="flex flex-col gap-4 mb-8 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute -translate-y-1/2 left-4 top-1/2 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full py-3 pl-10 pr-4 text-sm transition-colors bg-white border rounded-2xl border-surface focus:outline-none focus:border-accent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute -translate-y-1/2 right-3 top-1/2 text-muted hover:text-charcoal">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`category-pill px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeCategory === cat.id
                  ? 'bg-charcoal text-accent border-charcoal'
                  : 'bg-white text-charcoal/70 border-surface hover:border-charcoal/30'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <SlidersHorizontal size={15} className="flex-shrink-0 text-muted" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-sm bg-white border border-surface rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent cursor-pointer"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-surface">
              <Search size={24} className="text-muted" />
            </div>
            <p className="font-semibold text-charcoal">No products found</p>
            <p className="text-sm text-muted">Try adjusting your filters or search term</p>
            <button onClick={() => { setSearch(''); handleCategory('all'); }}
              className="mt-2 px-6 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: '#1C1C1E', color: '#FAF8F5' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 50} />
              ))}
              
              {/* Pagination in 8th slot */}
              {paginatedProducts.length < 8 && (
                <div className="flex items-center justify-center p-6 bg-white rounded-2xl border border-surface">
                  <div className="flex flex-col items-center gap-4 w-full">
                    <p className="text-sm font-semibold text-charcoal">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: currentPage === 1 ? '#E5E7EB' : '#1C1C1E', color: currentPage === 1 ? '#9CA3AF' : '#FAF8F5' }}
                      >
                        <ChevronLeft size={16} /> Prev
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: currentPage === totalPages ? '#E5E7EB' : '#1C1C1E', color: currentPage === totalPages ? '#9CA3AF' : '#FAF8F5' }}
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Page indicator below grid */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <p className="text-sm text-muted">Pages:</p>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg font-medium text-sm transition-all ${
                      currentPage === page
                        ? 'bg-charcoal text-accent'
                        : 'bg-white border border-surface text-charcoal hover:border-charcoal'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useVariant } from '../hooks/useVariant';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ProductCard from '../components/ProductCard';

const ALL_CATS = ['all', 'fashion', 'sneakers', 'tech', 'jewelry', 'sports', 'beauty', 'books', 'home'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'A–Z' },
];

export default function BrowsePage() {
  const { products, config } = useApp();
  const t = useTheme();
  const v = useVariant();
  const gridRef = useScrollReveal(v.animStyle ? `anim-${v.animStyle}` : 'anim-fade');

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  const maxProductPrice = useMemo(() => Math.max(...products.map(p => p.price), 200), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    list = list.filter(p => p.price <= maxPrice);
    list = list.filter(p => parseFloat(p.rating) >= minRating);
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, search, activeCategory, sort, maxPrice, minRating]);

  const inputStyle = {
    width: '100%', padding: '0.625rem 0.875rem',
    backgroundColor: t.bgSurface, border: `1px solid ${t.border}`,
    borderRadius: v.cardRadius === '0px' ? '0' : '6px',
    color: t.textPrimary, fontSize: '0.875rem',
    fontFamily: 'Inter, sans-serif', outline: 'none',
    transition: 'border-color 0.15s', boxSizing: 'border-box',
  };

  return (
    <div style={{ backgroundColor: t.bgPage, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: v.heroBgType === 'gradient' || v.navStyle === 'glass' ? 'transparent' : t.bgCard, 
        background: v.heroBgType === 'gradient' ? `linear-gradient(135deg, ${t.bgCard} 0%, ${t.accent}15 100%)` : undefined,
        borderBottom: v.showCardBorder ? `1px solid ${t.border}` : 'none', 
        padding: '3rem 1.5rem',
        textAlign: v.heroLayout === 'centered' || v.heroLayout === 'stacked' ? 'center' : 'left'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: v.heroTitleWeight || '700', color: t.textPrimary, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            Browse Collection
          </h1>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px', margin: v.heroLayout === 'centered' || v.heroLayout === 'stacked' ? '0 auto' : '0' }}>
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: t.textMuted, fontSize: '0.875rem', pointerEvents: 'none' }}>
              ⌕
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ ...inputStyle, paddingLeft: '2.25rem' }}
              onFocus={e => e.currentTarget.style.borderColor = t.accent}
              onBlur={e => e.currentTarget.style.borderColor = t.border}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Sidebar filters */}
        <aside className="hide-mobile" style={{
          flex: '0 0 220px', position: 'sticky', top: '80px',
          backgroundColor: t.bgCard, borderRadius: v.cardRadius === '0px' ? '0' : '8px',
          border: `1px solid ${t.border}`, padding: '1.5rem',
        }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', fontFamily: 'Inter, sans-serif' }}>
            Filters
          </h3>

          {/* Categories */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: '600', color: t.textPrimary, marginBottom: '0.625rem', fontFamily: 'Inter, sans-serif' }}>Category</p>
            {ALL_CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '0.375rem 0.5rem',
                backgroundColor: activeCategory === cat ? t.accentAlpha10 : 'transparent',
                color: activeCategory === cat ? t.accent : t.textSecondary,
                fontWeight: activeCategory === cat ? '600' : '400',
                border: 'none', cursor: 'pointer', borderRadius: '4px',
                fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif',
                textTransform: 'capitalize', transition: 'all 0.15s',
              }}>
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Price range */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: '600', color: t.textPrimary, marginBottom: '0.625rem', fontFamily: 'Inter, sans-serif' }}>
              Max Price: <span style={{ color: t.accent }}>${maxPrice}</span>
            </p>
            <input type="range" min="10" max={maxProductPrice} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: t.accent }} />
          </div>

          {/* Min rating */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: '600', color: t.textPrimary, marginBottom: '0.625rem', fontFamily: 'Inter, sans-serif' }}>
              Min Rating: <span style={{ color: t.accent }}>{minRating > 0 ? `★ ${minRating}+` : 'Any'}</span>
            </p>
            {[0, 3.5, 4, 4.5].map(r => (
              <button key={r} onClick={() => setMinRating(r)} style={{
                marginRight: '0.375rem', marginBottom: '0.375rem',
                padding: '0.2rem 0.625rem',
                backgroundColor: minRating === r ? t.accent : t.bgSurface,
                color: minRating === r ? '#fff' : t.textSecondary,
                border: `1px solid ${minRating === r ? t.accent : t.border}`,
                borderRadius: '99px', fontSize: '0.72rem', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontWeight: '600',
              }}>
                {r === 0 ? 'Any' : `★${r}+`}
              </button>
            ))}
          </div>

          {/* Reset */}
          <button onClick={() => { setSearch(''); setActiveCategory('all'); setSort('default'); setMaxPrice(maxProductPrice); setMinRating(0); }}
            style={{
              width: '100%', padding: '0.5rem',
              border: `1px solid ${t.border}`, borderRadius: '4px',
              background: 'none', color: t.textMuted, fontSize: '0.8125rem',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
            Reset Filters
          </button>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1 }}>
          {/* Sort bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.875rem', color: t.textMuted, fontFamily: 'Inter, sans-serif' }}>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              padding: '0.5rem 0.875rem',
              backgroundColor: t.bgCard, border: `1px solid ${t.border}`,
              borderRadius: '6px', color: t.textPrimary,
              fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif',
              cursor: 'pointer', outline: 'none',
            }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Category pill filters (mobile-friendly) */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {ALL_CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '0.3rem 0.75rem',
                backgroundColor: activeCategory === cat ? t.accent : t.bgSurface,
                color: activeCategory === cat ? '#fff' : t.textSecondary,
                border: `1px solid ${activeCategory === cat ? t.accent : t.border}`,
                borderRadius: '99px', fontSize: '0.78rem', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontWeight: activeCategory === cat ? '600' : '400',
                textTransform: 'capitalize', transition: 'all 0.15s',
              }}>
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
              <p style={{ color: t.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '1rem', marginBottom: '1rem' }}>No products match your filters.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('all'); }} style={{
                backgroundColor: t.accent, color: '#fff', border: 'none',
                borderRadius: '6px', padding: '0.625rem 1.25rem',
                fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>Clear Filters</button>
            </div>
          ) : (
            <div ref={gridRef} style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(v.gridCols, 3)}, 1fr)`,
              gap: v.gridGap === '0px' ? '1px' : v.gridGap,
            }} className={`grid-${Math.min(v.gridCols, 3)}`}>
              {filtered.map(p => (
                <div key={p.id} data-reveal="true">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

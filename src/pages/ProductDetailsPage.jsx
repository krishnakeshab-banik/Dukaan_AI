import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useVariant } from '../hooks/useVariant';
import ProductCard from '../components/ProductCard';

export default function ProductDetailsPage() {
  const { selectedProduct, products, addToCart, toggleWishlist, isWishlisted, setCurrentPage } = useApp();
  const t = useTheme();
  const v = useVariant();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedProduct]);

  if (!selectedProduct) {
    setCurrentPage('browse');
    return null;
  }

  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id)
    .slice(0, 4);

  const isLiked = isWishlisted(selectedProduct.id);

  return (
    <div style={{ backgroundColor: t.bgPage, minHeight: '100vh', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
          <button onClick={() => setCurrentPage('browse')} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer' }}>Products</button>
          <span style={{ color: t.textMuted }}>/</span>
          <span style={{ color: t.textPrimary, fontWeight: '500' }}>{selectedProduct.name}</span>
        </div>

        {/* Main Product Area */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          {/* Image */}
          <div className="anim-scale" style={{ flex: '1 1 400px' }}>
            <div style={{ 
              position: 'relative', 
              paddingTop: '100%', 
              backgroundColor: t.bgCard,
              borderRadius: v.cardRadius === '0px' ? '0' : '16px',
              border: v.showCardBorder ? `1px solid ${t.border}` : 'none',
              overflow: 'hidden'
            }}>
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </div>

          {/* Details */}
          <div className="anim-slide-r" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: v.heroTitleWeight, 
                color: t.textPrimary, 
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                textTransform: v.heroTitleTransform
              }}>
                {selectedProduct.name}
              </h1>
              <button onClick={() => toggleWishlist(selectedProduct)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem',
                color: isLiked ? '#EF4444' : t.textMuted,
                transition: 'color 0.2s', padding: '0.5rem'
              }}>
                {isLiked ? '♥' : '♡'}
              </button>
            </div>
            
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: t.accent, fontFamily: 'Inter, sans-serif', marginBottom: '2rem' }}>
              ${selectedProduct.price.toFixed(2)}
            </div>

            <p style={{ color: t.textSecondary, fontFamily: 'Inter, sans-serif', lineHeight: 1.6, marginBottom: '2.5rem', fontSize: '1.0625rem' }}>
              {selectedProduct.description || 'Experience premium quality and exceptional design with this featured item from our collection. Carefully crafted to elevate your lifestyle.'}
            </p>

            <button onClick={() => addToCart(selectedProduct)} style={{
              backgroundColor: t.accent,
              color: '#fff',
              border: 'none',
              borderRadius: v.cardRadius === '0px' ? '0' : '8px',
              padding: '1.25rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              width: '100%',
              transition: 'filter 0.2s',
              textTransform: v.heroTaglineCase === 'uppercase' ? 'uppercase' : 'none',
              letterSpacing: v.heroTaglineCase === 'uppercase' ? '0.05em' : 'normal'
            }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >
              Add to Cart
            </button>

            {/* Perks */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', borderTop: `1px solid ${t.border}`, paddingTop: '2rem' }}>
              {['Free Shipping', '30-Day Returns'].map(perk => (
                <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: t.textSecondary, fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ color: t.accent }}>✓</span> {perk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '6rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: v.heroTitleWeight, color: t.textPrimary, fontFamily: 'Inter, sans-serif', marginBottom: '2rem' }}>
              You might also like
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: v.gridGap }}>
              {relatedProducts.map(p => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

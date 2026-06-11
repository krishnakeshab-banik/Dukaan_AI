import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useVariant } from '../hooks/useVariant';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useApp();
  const t = useTheme();
  const v = useVariant();
  const gridRef = useScrollReveal(v.animStyle ? `anim-${v.animStyle}` : 'anim-fade');

  return (
    <div style={{ backgroundColor: v.heroBgType === 'gradient' || v.navStyle === 'glass' ? 'transparent' : t.bgPage, minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: v.heroLayout === 'centered' || v.heroLayout === 'stacked' ? 'center' : 'left' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: v.heroTitleWeight || '700', color: t.textPrimary, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Wishlist
        </h1>
        <p style={{ color: t.textMuted, fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', marginBottom: '2.5rem' }}>
          {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
        </p>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: t.bgCard, borderRadius: v.cardRadius, border: v.showCardBorder ? `1px solid ${t.border}` : 'none' }}>
            <p style={{ color: t.textMuted, fontFamily: 'Inter, sans-serif' }}>Your wishlist is empty.</p>
          </div>
        ) : (
          <div ref={gridRef} style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(v.gridCols, 3)}, 1fr)`,
            gap: v.gridGap === '0px' ? '1px' : v.gridGap,
          }} className={`grid-${Math.min(v.gridCols, 3)}`}>
            {wishlist.map(item => (
              <div key={item.id} data-reveal="true">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

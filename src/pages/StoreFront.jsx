import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useVariant } from '../hooks/useVariant';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ProductCard from '../components/ProductCard';

// Hero component selector
function HeroSection({ config, t, v, onShop, onCart }) {
  const accent = t.accent;
  const heroStyle = {
    position: 'relative',
    minHeight: v.heroMinHeight,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor:
      v.heroBgType === 'dark' ? '#0A0F1E' :
      v.heroBgType === 'tinted' ? accent + '12' :
      v.heroBgType === 'gradient' ? 'transparent' :
      t.bgCard,
    ...(v.heroBgType === 'gradient' 
      ? { background: `linear-gradient(135deg, ${t.bgCard} 0%, ${accent}18 100%)` }
      : {}
    ),
    borderBottom: v.heroBgType === 'none' ? `1px solid ${t.border}` : 'none',
  };

  const isDarkBg = v.heroBgType === 'dark' || (v.heroBgType === 'none' && config.isDark);

  const titleStyle = {
    fontSize: v.heroTitleSize,
    fontWeight: v.heroTitleWeight,
    color: isDarkBg ? '#F0F4FF' : (v.heroBgType === 'none' || v.heroBgType === 'gradient' || v.heroBgType === 'subtle' || v.heroBgType === 'tinted' ? t.textPrimary : '#0D1220'),
    letterSpacing: v.heroTitleSpacing,
    textTransform: v.heroTitleTransform,
    lineHeight: 1.05,
    fontFamily: 'Inter, sans-serif',
    marginBottom: '1.25rem',
  };

  const subtitleStyle = {
    fontSize: '1.0625rem',
    color: isDarkBg ? '#94A3B8' : t.textSecondary,
    lineHeight: 1.65,
    fontFamily: 'Inter, sans-serif',
    fontWeight: t.bodyWeight,
    marginBottom: '2.25rem',
    maxWidth: '480px',
  };

  const CtaRow = () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {(v.heroCtaStyle === 'filled' || v.heroCtaStyle === 'dual') && (
        <button onClick={onShop} style={{
          backgroundColor: accent, color: '#fff', border: 'none',
          borderRadius: v.cardRadius === '0px' ? '0' : '8px',
          padding: '0.875rem 2rem', fontSize: '0.9375rem', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          letterSpacing: v.heroTaglineCase === 'uppercase' ? '0.08em' : '0.01em',
          textTransform: v.heroTaglineCase === 'uppercase' ? 'uppercase' : 'none',
          transition: 'filter 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'none'}
        >
          Shop Now
        </button>
      )}
      {(v.heroCtaStyle === 'outlined' || v.heroCtaStyle === 'dual') && (
        <button onClick={onCart} style={{
          backgroundColor: 'transparent',
          color: v.heroBgType === 'dark' ? '#F0F4FF' : t.textPrimary,
          border: `2px solid ${v.heroBgType === 'dark' ? '#334155' : t.border}`,
          borderRadius: v.cardRadius === '0px' ? '0' : '8px',
          padding: '0.875rem 2rem', fontSize: '0.9375rem', fontWeight: '500',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = accent}
          onMouseLeave={e => e.currentTarget.style.borderColor = v.heroBgType === 'dark' ? '#334155' : t.border}
        >
          View Cart
        </button>
      )}
      {v.heroCtaStyle === 'ghost' && (
        <button onClick={onShop} style={{
          backgroundColor: 'transparent', color: accent,
          border: `1px solid ${accent}`,
          borderRadius: v.cardRadius === '0px' ? '0' : '8px',
          padding: '0.875rem 2rem', fontSize: '0.9375rem', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          transition: 'all 0.2s',
          letterSpacing: v.heroTaglineCase === 'uppercase' ? '0.1em' : '0.02em',
          textTransform: v.heroTaglineCase === 'uppercase' ? 'uppercase' : 'none',
        }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = accent; }}
        >
          Explore Collection
        </button>
      )}
    </div>
  );

  const MetaRow = () => (
    <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
      {[['500+', 'Products'], ['4.9', 'Rating'], ['Free', 'Shipping']].map(([val, lab]) => (
        <div key={lab}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: accent, fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{val}</div>
          <div style={{ fontSize: '0.75rem', color: v.heroBgType === 'dark' ? '#64748B' : t.textMuted, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.25rem' }}>{lab}</div>
        </div>
      ))}
    </div>
  );

  const CATEGORY_IMAGES = {
    fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop',
    sneakers: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop',
    tech: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&auto=format&fit=crop',
    jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop',
    sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&auto=format&fit=crop',
    beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54c28?w=1600&auto=format&fit=crop',
    books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1600&auto=format&fit=crop',
    home: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop',
  };
  const heroImgUrl = config.heroImageUrl || CATEGORY_IMAGES[config.category] || CATEGORY_IMAGES.fashion;

  const HeroImage = ({ style }) => (
    <div style={{ position: 'relative', borderRadius: v.cardRadius === '0px' ? '0' : '12px', overflow: 'hidden', ...style }}>
      <img src={heroImgUrl}
        alt="hero" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${accent}20, transparent)` }} />
    </div>
  );

  // --- SPLIT layout ---
  if (v.heroLayout === 'split') {
    return (
      <section style={heroStyle}>
        <div className="hero-split" style={{ maxWidth: '1320px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', alignItems: 'center', gap: '4rem', width: '100%' }}>
          <div className="anim-slide-l" style={{ flex: 1 }}>
            <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, fontWeight: '700', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>
              {config.category} collection
            </p>
            <h1 style={titleStyle}>{config.storeName}</h1>
            <p style={subtitleStyle}>{config.tagline}</p>
            <CtaRow />
            <MetaRow />
          </div>
          <div className="anim-slide-r hide-mobile" style={{ flex: 1, height: '500px' }}>
            <HeroImage style={{ height: '100%' }} />
          </div>
        </div>
      </section>
    );
  }

  // --- MAGAZINE layout ---
  if (v.heroLayout === 'magazine') {
    return (
      <section style={{ ...heroStyle, backgroundColor: t.bgPage }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '5rem 1.5rem', width: '100%' }}>
          <div style={{ borderTop: `3px solid ${t.textPrimary}`, paddingTop: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span className="anim-fade" style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, fontFamily: 'Inter, sans-serif' }}>
              {config.category} — {new Date().getFullYear()}
            </span>
            <span className="anim-fade delay-1" style={{ fontSize: '0.72rem', color: t.textMuted, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Issue No. 1</span>
          </div>
          <h1 className="anim-reveal" style={{ ...titleStyle, maxWidth: '900px', marginBottom: '2rem' }}>{config.storeName}</h1>
          <div className="hero-split" style={{ display: 'flex', gap: '3rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="anim-fade delay-2" style={{ flex: 1, minWidth: '260px' }}>
              <p style={{ ...subtitleStyle, maxWidth: '400px' }}>{config.tagline}</p>
              <CtaRow />
            </div>
            <div className="anim-fade delay-3 hide-mobile" style={{ flex: 1, height: '340px', minWidth: '260px' }}>
              <HeroImage style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- FULLSCREEN layout ---
  if (v.heroLayout === 'fullscreen') {
    return (
      <section style={{ ...heroStyle, minHeight: '100vh', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img src={heroImgUrl}
            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1320px', margin: '0 auto', padding: '4rem 1.5rem', width: '100%', textAlign: 'center' }}>
          <p className="anim-fade" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: accent, fontWeight: '700', marginBottom: '2rem', fontFamily: 'Inter, sans-serif' }}>
            {config.category} collection
          </p>
          <h1 className="anim-scale" style={{ ...titleStyle, marginBottom: '1.5rem' }}>{config.storeName}</h1>
          <p className="anim-fade delay-2" style={{ ...subtitleStyle, margin: '0 auto 2.5rem', textAlign: 'center' }}>{config.tagline}</p>
          <div className="anim-fade delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <CtaRow />
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="anim-float" style={{ width: '24px', height: '36px', border: `2px solid ${v.heroBgType === 'dark' ? '#334155' : t.border}`, borderRadius: '12px', display: 'flex', justifyContent: 'center', paddingTop: '6px' }}>
            <div style={{ width: '4px', height: '8px', backgroundColor: accent, borderRadius: '2px', animation: 'float 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>
    );
  }

  // --- DIAGONAL layout ---
  if (v.heroLayout === 'diagonal') {
    return (
      <section style={{ ...heroStyle, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)', overflow: 'hidden' }} className="hide-mobile">
          <img src={heroImgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${t.bgCard}, transparent 40%)` }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1320px', margin: '0 auto', padding: '5rem 1.5rem', width: '100%' }}>
          <div className="anim-fade" style={{ maxWidth: '560px' }}>
            <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, fontWeight: '700', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>
              {config.category}
            </p>
            <h1 style={titleStyle}>{config.storeName}</h1>
            <p style={subtitleStyle}>{config.tagline}</p>
            <CtaRow />
            <MetaRow />
          </div>
        </div>
      </section>
    );
  }

  // --- STACKED layout ---
  if (v.heroLayout === 'stacked') {
    return (
      <section style={{ ...heroStyle, flexDirection: 'column', textAlign: 'left', justifyContent: 'flex-end', padding: 0 }}>
        <div style={{ width: '100%', height: '55%', position: 'absolute', top: 0, overflow: 'hidden' }} className="hide-mobile">
          <img src={heroImgUrl}
            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1320px', margin: '0 auto', padding: '3rem 1.5rem 3.5rem', width: '100%' }}>
          <p className="anim-fade" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, fontWeight: '700', marginBottom: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
            {config.category} · {config.designStyle}
          </p>
          <h1 className="anim-bounce" style={titleStyle}>{config.storeName}</h1>
          <p className="anim-fade delay-2" style={subtitleStyle}>{config.tagline}</p>
          <div className="anim-fade delay-3"><CtaRow /></div>
        </div>
      </section>
    );
  }

  // --- CENTERED (default) ---
  return (
    <section style={{ ...heroStyle, justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: `${v.sectionSpacing} 1.5rem`, width: '100%' }}>
        <p className="anim-fade" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, fontWeight: '700', marginBottom: '1.25rem', fontFamily: 'Inter, sans-serif' }}>
          {config.category} collection
        </p>
        <h1 className="anim-scale" style={{ ...titleStyle, margin: '0 auto 1.25rem' }}>{config.storeName}</h1>
        <p className="anim-fade delay-2" style={{ ...subtitleStyle, margin: '0 auto 2.5rem' }}>{config.tagline}</p>
        <div className="anim-fade delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CtaRow />
        </div>
      </div>
    </section>
  );
}

// ---- Main StoreFront page ----
export default function StoreFront() {
  const { config, products, setCurrentPage } = useApp();
  const t = useTheme();
  const v = useVariant();
  const gridRef = useScrollReveal(
    v.animStyle === 'slide' ? 'anim-slide-up' :
    v.animStyle === 'scale' ? 'anim-scale' :
    v.animStyle === 'bounce' ? 'anim-bounce' : 'anim-fade'
  );

  const cols = v.gridCols;
  const gap = v.gridGap;
  const isMagazineGrid = v.cardStyle === 'magazine';

  const scrollToGrid = () => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div style={{ backgroundColor: t.bgPage, minHeight: '100vh' }}>
      <HeroSection config={config} t={t} v={v} onShop={scrollToGrid} onCart={() => setCurrentPage('cart')} />

      {/* Featured / Trust bar */}
      <div style={{ backgroundColor: t.bgSurface, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Free worldwide shipping', '30-day returns', 'Secure checkout', 'Premium quality'].map((item) => (
            <span key={item} style={{ fontSize: '0.8125rem', color: t.textSecondary, fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: t.accent, fontWeight: '700' }}>—</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section id="product-grid" style={{ maxWidth: '1320px', margin: '0 auto', padding: `${v.sectionSpacing} 1.5rem` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: v.heroTitleWeight,
              color: t.textPrimary,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: v.heroTitleTransform === 'uppercase' ? '0.05em' : t.letterSpacing,
              textTransform: v.heroTitleTransform === 'uppercase' ? 'uppercase' : 'none',
            }}>
              All Products
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: t.textMuted, fontFamily: 'Inter, sans-serif' }}>
              {products.length} items
            </span>
            <button onClick={() => setCurrentPage('browse')} style={{
              padding: '0.4rem 0.875rem',
              border: `1px solid ${t.border}`,
              borderRadius: v.cardRadius === '0px' ? '0' : '6px',
              background: 'none',
              color: t.textSecondary,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
            >
              Browse & Filter
            </button>
          </div>
        </div>

        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: isMagazineGrid ? '1fr' : `repeat(${cols}, 1fr)`,
            gap,
          }}
          className={`grid-${cols}`}
        >
          {products.map((p) => (
            <div key={p.id} data-reveal="true">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        backgroundColor: v.heroBgType === 'dark' ? '#0A0F1E' : t.bgSurface,
        borderTop: `1px solid ${t.border}`,
        padding: `${v.sectionSpacing} 1.5rem`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: v.heroTitleWeight,
            color: v.heroBgType === 'dark' ? '#F0F4FF' : t.textPrimary,
            fontFamily: 'Inter, sans-serif',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}>
            See something you like?
          </h3>
          <p style={{ color: v.heroBgType === 'dark' ? '#94A3B8' : t.textSecondary, fontFamily: 'Inter, sans-serif', marginBottom: '1.5rem' }}>
            Add to cart and check out in seconds.
          </p>
          <button onClick={() => setCurrentPage('cart')} style={{
            backgroundColor: t.accent, color: '#fff', border: 'none',
            borderRadius: v.cardRadius === '0px' ? '0' : '8px',
            padding: '0.875rem 2rem', fontSize: '0.9375rem', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
            View Cart
          </button>
        </div>
      </section>
    </div>
  );
}

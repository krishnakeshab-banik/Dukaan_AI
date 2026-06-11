import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useVariant } from '../hooks/useVariant';

// ---- Card style factories ----
const cardStyles = {
  elevated: (t, v, hovered) => ({
    backgroundColor: t.bgCard,
    borderRadius: v.cardRadius,
    overflow: 'hidden',
    border: `1px solid ${hovered ? t.accent + '50' : t.border}`,
    boxShadow: hovered ? t.shadowLg : t.shadowSm,
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
    cursor: 'pointer',
  }),
  bordered: (t, v, hovered) => ({
    backgroundColor: t.bgCard,
    borderRadius: v.cardRadius,
    overflow: 'hidden',
    border: `2px solid ${hovered ? t.accent : t.border}`,
    boxShadow: 'none',
    transform: 'none',
    transition: 'border-color 0.2s',
    cursor: 'pointer',
  }),
  borderless: (t, v, hovered) => ({
    backgroundColor: 'transparent',
    borderRadius: v.cardRadius,
    overflow: 'hidden',
    border: 'none',
    boxShadow: 'none',
    transition: 'opacity 0.2s',
    opacity: hovered ? 0.85 : 1,
    cursor: 'pointer',
  }),
  glass: (t, v, hovered) => ({
    backgroundColor: t.bgCard + 'CC',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: v.cardRadius,
    overflow: 'hidden',
    border: `1px solid ${t.border}`,
    boxShadow: hovered ? t.shadowLg : t.shadowMd,
    transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    cursor: 'pointer',
  }),
  offset: (t, v, hovered) => ({
    backgroundColor: t.bgCard,
    borderRadius: v.cardRadius,
    overflow: 'hidden',
    border: `2px solid ${t.textPrimary}`,
    boxShadow: hovered ? `4px 4px 0 ${t.accent}` : `2px 2px 0 ${t.textPrimary}`,
    transform: hovered ? 'translate(-2px, -2px)' : 'translate(0)',
    transition: 'all 0.18s ease',
    cursor: 'pointer',
  }),
  minimal: (t, v, hovered) => ({
    backgroundColor: 'transparent',
    borderRadius: v.cardRadius,
    overflow: 'hidden',
    border: 'none',
    borderBottom: `1px solid ${hovered ? t.accent : t.border}`,
    boxShadow: 'none',
    transition: 'border-color 0.2s',
    cursor: 'pointer',
  }),
  magazine: (t, v, hovered) => ({
    backgroundColor: 'transparent',
    borderRadius: '0',
    overflow: 'hidden',
    border: 'none',
    borderTop: `1px solid ${t.border}`,
    boxShadow: 'none',
    transition: 'opacity 0.2s',
    opacity: hovered ? 0.8 : 1,
    cursor: 'pointer',
  }),
};

export default function ProductCard({ product }) {
  const { addToCart, config, toggleWishlist, isWishlisted, setCurrentPage, setSelectedProduct } = useApp();
  const t = useTheme();
  const v = useVariant();

  const handleCardClick = () => {
    setSelectedProduct(product);
    setCurrentPage('details');
  };

  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const styleKey = v.cardStyle || 'elevated';
  const getStyle = cardStyles[styleKey] || cardStyles.elevated;
  const wishlisted = isWishlisted(product.id);
  const isMagazine = styleKey === 'magazine';
  const isMinimal = styleKey === 'minimal';

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Magazine layout: horizontal card
  if (isMagazine) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={getStyle(t, v, hovered)}
        onClick={handleCardClick}
      >
        <div style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem 0' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0, overflow: 'hidden', borderRadius: v.cardRadius }}>
            {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
            <img
              src={product.image}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.35s ease',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                opacity: imgLoaded ? 1 : 0,
              }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: t.accent, fontWeight: '600', marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
                {product.category}
              </p>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: t.textPrimary, lineHeight: 1.3, fontFamily: 'Inter, sans-serif', marginBottom: '0.25rem' }}>
                {product.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: t.textMuted, fontFamily: 'Inter, sans-serif' }}>
                {product.rating} rating · {product.reviews} reviews
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '700', color: t.textPrimary, fontFamily: 'Inter, sans-serif' }}>
                ${product.price.toFixed(2)}
              </span>
              <AddBtn added={added} onClick={handleAdd} t={t} v={v} small />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={getStyle(t, v, hovered)}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: v.cardImageRatio, overflow: 'hidden' }}>
        {!imgLoaded && (
          <div
            className={t.bgPage === '#F8F9FC' ? 'skeleton-light' : 'skeleton'}
            style={{ position: 'absolute', inset: 0 }}
          />
        )}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            opacity: imgLoaded ? 1 : 0,
          }}
        />

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute',
            top: '0.625rem',
            right: '0.625rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: t.bgCard + 'DD',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            transition: 'transform 0.15s, background 0.15s',
            transform: hovered ? 'scale(1)' : 'scale(0.8)',
            opacity: hovered || wishlisted ? 1 : 0,
            color: wishlisted ? '#EF4444' : t.textMuted,
          }}
          aria-label="Toggle wishlist"
        >
          {wishlisted ? '♥' : '♡'}
        </button>

        {/* Stock badge */}
        {product.stock <= 5 && (
          <div style={{
            position: 'absolute',
            bottom: '0.625rem',
            left: '0.625rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: '#EF4444',
            color: '#fff',
            fontSize: '0.68rem',
            fontWeight: '700',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.04em',
          }}>
            LOW STOCK
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: isMinimal ? '0.875rem 0' : t.cardPadding }}>
        {v.categoryBadgeStyle !== 'none' && (
          <CategoryBadge category={product.category} style={v.categoryBadgeStyle} t={t} v={v} />
        )}
        <h3 style={{
          fontSize: '0.9375rem',
          fontWeight: v.heroTitleWeight === '300' ? '400' : '600',
          color: t.textPrimary,
          marginBottom: '0.625rem',
          lineHeight: 1.3,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: t.letterSpacing,
        }}>
          {product.name}
        </h3>

        <div style={{ fontSize: '0.72rem', color: t.textMuted, fontFamily: 'Inter, sans-serif', marginBottom: '0.875rem' }}>
          ★ {product.rating} ({product.reviews})
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{
            fontSize: '1.0625rem',
            fontWeight: '700',
            color: t.textPrimary,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.01em',
          }}>
            ${product.price.toFixed(2)}
          </span>
          <AddBtn added={added} onClick={handleAdd} t={t} v={v} />
        </div>
      </div>
    </div>
  );
}

function CategoryBadge({ category, style, t, v }) {
  if (style === 'line') {
    return (
      <div style={{
        fontSize: '0.68rem',
        fontWeight: '600',
        color: t.accent,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '0.375rem',
        fontFamily: 'Inter, sans-serif',
        borderBottom: `2px solid ${t.accent}`,
        display: 'inline-block',
        paddingBottom: '0.125rem',
      }}>
        {category}
      </div>
    );
  }
  if (style === 'box') {
    return (
      <div style={{
        display: 'inline-block',
        fontSize: '0.64rem',
        fontWeight: '700',
        color: t.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        padding: '0.15rem 0.375rem',
        border: `1px solid ${t.border}`,
        marginBottom: '0.5rem',
        fontFamily: 'Inter, sans-serif',
        borderRadius: v.cardRadius,
      }}>
        {category}
      </div>
    );
  }
  // pill (default)
  return (
    <div style={{
      display: 'inline-block',
      fontSize: '0.68rem',
      fontWeight: '600',
      color: t.accent,
      backgroundColor: t.accentAlpha10,
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      padding: '0.2rem 0.625rem',
      borderRadius: '99px',
      marginBottom: '0.5rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      {category}
    </div>
  );
}

function AddBtn({ added, onClick, t, v, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: added ? '#10B981' : t.accent,
        color: '#FFFFFF',
        border: 'none',
        borderRadius: v.cardRadius === '0px' ? '0px' : '6px',
        padding: small ? '0.4rem 0.875rem' : '0.5rem 1rem',
        fontSize: '0.8125rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!added) e.currentTarget.style.filter = 'brightness(1.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
    >
      {added ? '✓ Added' : 'Add to Cart'}
    </button>
  );
}

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useVariant } from '../hooks/useVariant';

export default function Navbar({ isSideNav }) {
  const { config, currentPage, setCurrentPage, cartCount, wishlist, resetStore } = useApp();
  const t = useTheme();
  const v = useVariant();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!config) return null;

  const navStyle = v.navStyle;

  const navBg = {
    'solid':      t.bgNav,
    'glass':      t.bgNav + 'CC',
    'bordered':   t.bgCard,
    'minimal':    'transparent',
    'dark-solid': '#0A0F1E',
  }[navStyle] || t.bgNav;

  const navBorder = {
    'solid':      `1px solid ${t.border}`,
    'glass':      `1px solid ${t.border}50`,
    'bordered':   `2px solid ${t.textPrimary}`,
    'minimal':    'none',
    'dark-solid': `1px solid #1E2D4A`,
  }[navStyle] || `1px solid ${t.border}`;

  const textCol = {
    'dark-solid': '#F0F4FF',
  }[navStyle] || t.textPrimary;

  const isSimulator = new URLSearchParams(window.location.search).get('simulator') === '1';

  let navItems = [
    { id: 'store', label: 'Home' },
    { id: 'browse', label: 'Browse' },
    { id: 'cart', label: `Cart${cartCount > 0 ? ` (${cartCount})` : ''}` },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'mobile', label: 'Mobile App' },
  ];

  if (isSimulator) {
    navItems = navItems.filter(item => item.id !== 'dashboard' && item.id !== 'mobile');
  }

  return (
    <nav style={isSideNav ? {
      backgroundColor: navBg,
      borderRight: navBorder,
      position: 'sticky',
      top: 0,
      width: '240px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    } : {
      backgroundColor: navBg,
      borderBottom: navBorder,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: navStyle === 'glass' ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: navStyle === 'glass' ? 'blur(16px)' : 'none',
    }}>
      <div style={isSideNav ? {
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '2rem',
        height: '100%',
      } : {
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: v.navHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <button
          onClick={() => setCurrentPage('store')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.625rem' }}
        >
          {config?.logoUrl ? (
            <img 
              src={config.logoUrl} 
              alt="Logo" 
              style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: v.cardRadius === '0px' ? '0px' : '6px' }} 
            />
          ) : (
            <div style={{
              width: '26px',
              height: '26px',
              backgroundColor: t.accent,
              borderRadius: v.cardRadius === '0px' ? '0px' : '6px',
            }} />
          )}
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: navStyle === 'bordered' ? '0.9375rem' : '1rem',
            fontWeight: '700',
            color: textCol,
            letterSpacing: v.heroTitleTransform === 'uppercase' ? '0.05em' : '-0.01em',
            textTransform: v.heroTitleTransform === 'uppercase' ? 'uppercase' : 'none',
          }}>
            {config.storeName}
          </span>
        </button>

        {/* Desktop nav */}
        <div className="nav-links" style={{ 
          display: 'flex', 
          flexDirection: isSideNav ? 'column' : 'row',
          alignItems: isSideNav ? 'flex-start' : 'center', 
          gap: isSideNav ? '1rem' : '0.125rem',
          width: isSideNav ? '100%' : 'auto'
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
              style={{
                background: 'none',
                border: navStyle === 'bordered' && currentPage === item.id ? `2px solid ${t.textPrimary}` : 'none',
                cursor: 'pointer',
                padding: isSideNav ? '0.75rem 1rem' : '0.5rem 0.875rem',
                borderRadius: navStyle === 'bordered' ? '0' : '6px',
                width: isSideNav ? '100%' : 'auto',
                textAlign: 'left',
                fontSize: '0.8125rem',
                fontWeight: currentPage === item.id ? '600' : '400',
                color: currentPage === item.id ? (navStyle === 'dark-solid' || navStyle === 'glass' ? t.accent : t.accent) : textCol,
                backgroundColor: currentPage === item.id && navStyle !== 'bordered' ? t.accentAlpha10 : 'transparent',
                transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.color = t.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.color = textCol;
                }
              }}
            >
              {item.label}
            </button>
          ))}

          {/* Wishlist icon */}
          <button
            onClick={() => setCurrentPage('wishlist')}
            title="Wishlist"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem 0.625rem',
              color: wishlist.length > 0 ? '#EF4444' : textCol,
              fontSize: '1rem',
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            ♥
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: '#EF4444',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: '700',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
              }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {!isSimulator && (
            <button
              onClick={resetStore}
              className="hide-mobile"
              style={{
                marginLeft: '0.375rem',
                padding: '0.4rem 0.875rem',
                borderRadius: v.cardRadius === '0px' ? '0' : '6px',
                border: `1px solid ${navStyle === 'dark-solid' ? '#1E2D4A' : t.border}`,
                background: 'none',
                fontSize: '0.78rem',
                color: navStyle === 'dark-solid' ? '#64748B' : t.textMuted,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = navStyle === 'dark-solid' ? '#64748B' : t.textMuted; e.currentTarget.style.borderColor = navStyle === 'dark-solid' ? '#1E2D4A' : t.border; }}
            >
              New Store
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

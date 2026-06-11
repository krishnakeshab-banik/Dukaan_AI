import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useVariant } from '../hooks/useVariant';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { cart, cartTotal, setCurrentPage } = useApp();
  const t = useTheme();
  const v = useVariant();

  return (
    <div style={{ backgroundColor: v.heroBgType === 'gradient' ? 'transparent' : t.bgPage, minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: v.heroLayout === 'centered' ? 'center' : 'left' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: v.heroTitleWeight || t.headingWeight,
          color: t.textPrimary,
          marginBottom: '0.5rem',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.02em',
        }}>
          Your Cart
        </h1>
        <p style={{ color: t.textMuted, fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', marginBottom: '2.5rem' }}>
          {cart.length === 0 ? 'No items added yet.' : `${cart.reduce((s, i) => s + i.quantity, 0)} item(s)`}
        </p>

        {cart.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 1rem',
            backgroundColor: t.bgCard,
            borderRadius: t.borderRadius,
            border: `1px solid ${t.border}`,
          }}>
            <p style={{ color: t.textSecondary, fontFamily: 'Inter, sans-serif', marginBottom: '1.5rem' }}>
              Your cart is empty.
            </p>
            <button
              onClick={() => setCurrentPage('store')}
              style={{
                backgroundColor: t.accent,
                color: '#fff',
                border: 'none',
                borderRadius: t.borderRadius,
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Items */}
            <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map((item) => <CartItem key={item.id} item={item} />)}
            </div>

            {/* Summary */}
            <div style={{ flex: '0 0 240px' }}>
              <div style={{
                backgroundColor: t.bgCard,
                borderRadius: t.borderRadius,
                border: `1px solid ${t.border}`,
                padding: '1.5rem',
                boxShadow: t.shadowSm,
                position: 'sticky',
                top: '80px',
              }}>
                <h3 style={{
                  fontSize: '0.9375rem',
                  fontWeight: '700',
                  color: t.textPrimary,
                  marginBottom: '1.25rem',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                  Order Summary
                </h3>

                {cart.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.625rem',
                  }}>
                    <span style={{ color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>
                      {item.name} x{item.quantity}
                    </span>
                    <span style={{ color: t.textPrimary, fontSize: '0.8125rem', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div style={{
                  borderTop: `1px solid ${t.border}`,
                  paddingTop: '1rem',
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}>
                  <span style={{ color: t.textPrimary, fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>Total</span>
                  <span style={{ color: t.accent, fontWeight: '700', fontSize: '1.125rem', fontFamily: 'Inter, sans-serif' }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentPage('checkout')}
                  style={{
                    width: '100%',
                    backgroundColor: t.accent,
                    color: '#fff',
                    border: 'none',
                    borderRadius: t.borderRadius,
                    padding: '0.875rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'filter 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => setCurrentPage('store')}
                  style={{
                    width: '100%',
                    marginTop: '0.75rem',
                    background: 'none',
                    border: 'none',
                    color: t.textMuted,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

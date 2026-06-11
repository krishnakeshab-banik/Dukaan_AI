import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';

const INPUT_STYLE = (t) => ({
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: t.bgSurface,
  border: `1px solid ${t.border}`,
  borderRadius: t.borderRadius,
  color: t.textPrimary,
  fontSize: '0.9375rem',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
});

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder, setCurrentPage } = useApp();
  const t = useTheme();
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [order, setOrder] = useState(null);

  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', zip: '',
    card: '', expiry: '', cvv: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handlePay = () => {
    // Basic validation
    if (!form.name || !form.email || !form.address) return;
    setStep('processing');
    setTimeout(() => {
      const o = placeOrder();
      setOrder(o);
      setStep('success');
    }, 1800);
  };

  if (step === 'processing') {
    return (
      <FullCenter t={t}>
        <div style={{ textAlign: 'center' }}>
          <Spinner />
          <h2 style={{ color: t.textPrimary, fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem' }}>
            Processing Payment...
          </h2>
          <p style={{ color: t.textSecondary, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Please wait, do not close this window.
          </p>
        </div>
      </FullCenter>
    );
  }

  if (step === 'success') {
    return (
      <FullCenter t={t}>
        <div style={{
          textAlign: 'center',
          backgroundColor: t.bgCard,
          border: `1px solid ${t.border}`,
          borderRadius: t.borderRadius,
          padding: '3rem',
          maxWidth: '480px',
          width: '100%',
          boxShadow: t.shadowLg,
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#10B981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.5rem',
            color: '#fff',
          }}>
            ✓
          </div>
          <h2 style={{
            color: t.textPrimary,
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Order Confirmed
          </h2>
          <p style={{ color: t.textSecondary, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Thank you, {form.name || 'valued customer'}. Your order{' '}
            <strong style={{ color: t.textPrimary }}>{order?.id}</strong> has been placed.
          </p>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: t.accent,
            fontFamily: 'Inter, sans-serif',
            marginBottom: '2rem',
          }}>
            ${order?.total?.toFixed(2)}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
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
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                backgroundColor: 'transparent',
                color: t.textSecondary,
                border: `1px solid ${t.border}`,
                borderRadius: t.borderRadius,
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              View Dashboard
            </button>
          </div>
        </div>
      </FullCenter>
    );
  }

  return (
    <div style={{ backgroundColor: t.bgPage, minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: t.headingWeight,
          color: t.textPrimary,
          marginBottom: '2.5rem',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.02em',
        }}>
          Checkout
        </h1>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

          {/* Form */}
          <div style={{ flex: '1 1 380px' }}>
            <Section title="Shipping Information" t={t}>
              <Field label="Full Name" value={form.name} onChange={set('name')} placeholder="Alex Morgan" t={t} />
              <Field label="Email Address" value={form.email} onChange={set('email')} placeholder="alex@example.com" t={t} type="email" />
              <Field label="Street Address" value={form.address} onChange={set('address')} placeholder="123 Main St" t={t} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label="City" value={form.city} onChange={set('city')} placeholder="New York" t={t} />
                <Field label="ZIP Code" value={form.zip} onChange={set('zip')} placeholder="10001" t={t} />
              </div>
            </Section>

            <Section title="Payment Details" t={t} mt="1.5rem">
              <Field label="Card Number" value={form.card} onChange={set('card')} placeholder="4242 4242 4242 4242" t={t} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label="Expiry" value={form.expiry} onChange={set('expiry')} placeholder="MM / YY" t={t} />
                <Field label="CVV" value={form.cvv} onChange={set('cvv')} placeholder="•••" t={t} />
              </div>
              <p style={{ fontSize: '0.75rem', color: t.textMuted, fontFamily: 'Inter, sans-serif', marginTop: '0.5rem' }}>
                This is a simulation — no real payment is processed.
              </p>
            </Section>
          </div>

          {/* Order summary sidebar */}
          <div style={{ flex: '0 0 240px' }}>
            <div style={{
              backgroundColor: t.bgCard,
              borderRadius: t.borderRadius,
              border: `1px solid ${t.border}`,
              padding: '1.5rem',
              position: 'sticky',
              top: '80px',
              boxShadow: t.shadowSm,
            }}>
              <h3 style={{
                fontSize: '0.9375rem',
                fontWeight: '700',
                color: t.textPrimary,
                marginBottom: '1.25rem',
                fontFamily: 'Inter, sans-serif',
              }}>
                Order Summary
              </h3>

              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif', flex: 1, marginRight: '0.5rem' }}>
                    {item.name} ×{item.quantity}
                  </span>
                  <span style={{ color: t.textPrimary, fontSize: '0.8125rem', fontWeight: '500', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '1rem', marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>Subtotal</span>
                  <span style={{ color: t.textPrimary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>Shipping</span>
                  <span style={{ color: '#10B981', fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${t.border}` }}>
                  <span style={{ color: t.textPrimary, fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>Total</span>
                  <span style={{ color: t.accent, fontWeight: '700', fontSize: '1.125rem', fontFamily: 'Inter, sans-serif' }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={cart.length === 0}
                style={{
                  marginTop: '1.25rem',
                  width: '100%',
                  backgroundColor: cart.length === 0 ? t.textMuted : t.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: t.borderRadius,
                  padding: '0.875rem',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'filter 0.2s',
                }}
                onMouseEnter={(e) => { if (cart.length > 0) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
              >
                Pay Now — ${cartTotal.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function Section({ title, children, t, mt }) {
  return (
    <div style={{
      backgroundColor: t.bgCard,
      borderRadius: t.borderRadius,
      border: `1px solid ${t.border}`,
      padding: '1.5rem',
      marginTop: mt || 0,
      boxShadow: t.shadowSm,
    }}>
      <h3 style={{
        fontSize: '0.875rem',
        fontWeight: '700',
        color: t.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: '1.25rem',
        fontFamily: 'Inter, sans-serif',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, t, type }) {
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: t.textSecondary,
        marginBottom: '0.375rem',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontFamily: 'Inter, sans-serif',
      }}>
        {label}
      </label>
      <input
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={INPUT_STYLE(t)}
        onFocus={(e) => e.currentTarget.style.borderColor = t.accent}
        onBlur={(e) => e.currentTarget.style.borderColor = t.border}
      />
    </div>
  );
}

function FullCenter({ t, children }) {
  return (
    <div style={{
      backgroundColor: t.bgPage,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <>
      <div style={{
        width: '48px',
        height: '48px',
        margin: '0 auto',
        border: '3px solid #E2E8F0',
        borderTopColor: '#6366F1',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

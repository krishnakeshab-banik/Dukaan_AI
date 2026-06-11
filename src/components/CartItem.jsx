import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useVariant } from '../hooks/useVariant';

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useApp();
  const t = useTheme();
  const v = useVariant();

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: t.bgSurface,
      borderRadius: v.cardRadius,
      border: `1px solid ${t.border}`,
      alignItems: 'center',
    }}>
      <img
        src={item.image}
        alt={item.name}
        style={{
          width: '72px',
          height: '72px',
          objectFit: 'cover',
          borderRadius: v.cardRadius === '0px' ? '0px' : '4px',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: '0.9375rem',
          fontWeight: '600',
          color: t.textPrimary,
          marginBottom: '0.25rem',
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.name}
        </h4>
        <p style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: t.accent,
          fontFamily: 'Inter, sans-serif',
        }}>
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <QtyBtn onClick={() => updateQuantity(item.id, item.quantity - 1)} label="−" t={t} />
        <span style={{
          minWidth: '28px',
          textAlign: 'center',
          fontSize: '0.9375rem',
          fontWeight: '600',
          color: t.textPrimary,
          fontFamily: 'Inter, sans-serif',
        }}>
          {item.quantity}
        </span>
        <QtyBtn onClick={() => updateQuantity(item.id, item.quantity + 1)} label="+" t={t} />
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(item.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: t.textMuted,
          fontSize: '1.125rem',
          lineHeight: 1,
          padding: '0.25rem',
          borderRadius: '4px',
          transition: 'color 0.15s',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
        onMouseLeave={(e) => e.currentTarget.style.color = t.textMuted}
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
}

function QtyBtn({ onClick, label, t }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        color: t.textPrimary,
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = t.accent}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = t.border}
    >
      {label}
    </button>
  );
}

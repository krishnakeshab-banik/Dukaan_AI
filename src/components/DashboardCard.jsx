import { useTheme } from '../hooks/useTheme';

export default function DashboardCard({ title, value, subtitle, trend, accentBar }) {
  const t = useTheme();

  return (
    <div style={{
      backgroundColor: t.bgCard,
      borderRadius: t.borderRadius,
      border: `1px solid ${t.border}`,
      boxShadow: t.shadowSm,
      padding: t.cardPadding,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {accentBar && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '3px',
          height: '100%',
          backgroundColor: t.accent,
          borderRadius: `${t.borderRadius} 0 0 ${t.borderRadius}`,
        }} />
      )}

      <p style={{
        fontSize: '0.75rem',
        fontWeight: '500',
        color: t.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: '0.625rem',
        fontFamily: 'Inter, sans-serif',
        paddingLeft: accentBar ? '0.5rem' : 0,
      }}>
        {title}
      </p>

      <p style={{
        fontSize: '2rem',
        fontWeight: '700',
        color: t.textPrimary,
        lineHeight: 1,
        marginBottom: '0.5rem',
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '-0.02em',
        paddingLeft: accentBar ? '0.5rem' : 0,
      }}>
        {value}
      </p>

      {(subtitle || trend) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingLeft: accentBar ? '0.5rem' : 0,
        }}>
          {trend && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: trend > 0 ? '#10B981' : '#EF4444',
              fontFamily: 'Inter, sans-serif',
            }}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {subtitle && (
            <p style={{
              fontSize: '0.75rem',
              color: t.textMuted,
              fontFamily: 'Inter, sans-serif',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

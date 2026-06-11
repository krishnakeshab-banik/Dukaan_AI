// =============================================
// THEME GENERATOR
// Maps store config → CSS design token object
// =============================================

const styleTokens = {
  minimal: {
    borderRadius: '4px',
    cardPadding: '1.25rem',
    heroSpacing: '5rem',
    shadowSm: '0 1px 2px rgba(0,0,0,0.06)',
    shadowMd: '0 4px 12px rgba(0,0,0,0.08)',
    shadowLg: '0 8px 24px rgba(0,0,0,0.08)',
    fontSizeBase: '15px',
    letterSpacing: '0.01em',
    headingWeight: '600',
    bodyWeight: '400',
    sectionGap: '4rem',
  },
  luxury: {
    borderRadius: '2px',
    cardPadding: '2rem',
    heroSpacing: '8rem',
    shadowSm: '0 2px 8px rgba(0,0,0,0.06)',
    shadowMd: '0 8px 32px rgba(0,0,0,0.08)',
    shadowLg: '0 20px 60px rgba(0,0,0,0.1)',
    fontSizeBase: '16px',
    letterSpacing: '0.04em',
    headingWeight: '300',
    bodyWeight: '300',
    sectionGap: '7rem',
  },
  bold: {
    borderRadius: '8px',
    cardPadding: '1.5rem',
    heroSpacing: '5rem',
    shadowSm: '0 2px 6px rgba(0,0,0,0.12)',
    shadowMd: '0 6px 20px rgba(0,0,0,0.14)',
    shadowLg: '0 16px 40px rgba(0,0,0,0.16)',
    fontSizeBase: '16px',
    letterSpacing: '0em',
    headingWeight: '800',
    bodyWeight: '500',
    sectionGap: '4.5rem',
  },
  modern: {
    borderRadius: '8px',
    cardPadding: '1.5rem',
    heroSpacing: '6rem',
    shadowSm: '0 1px 4px rgba(0,0,0,0.07)',
    shadowMd: '0 4px 16px rgba(0,0,0,0.09)',
    shadowLg: '0 12px 36px rgba(0,0,0,0.1)',
    fontSizeBase: '16px',
    letterSpacing: '0.01em',
    headingWeight: '700',
    bodyWeight: '400',
    sectionGap: '5rem',
  },
  vintage: {
    borderRadius: '0px',
    cardPadding: '1.5rem',
    heroSpacing: '5rem',
    shadowSm: '0 1px 4px rgba(0,0,0,0.1)',
    shadowMd: '0 4px 14px rgba(0,0,0,0.12)',
    shadowLg: '0 10px 32px rgba(0,0,0,0.14)',
    fontSizeBase: '15px',
    letterSpacing: '0.03em',
    headingWeight: '700',
    bodyWeight: '400',
    sectionGap: '4rem',
  },
};

export const generateTheme = (config) => {
  const style = styleTokens[config.designStyle] || styleTokens.modern;

  // Surface and text colors
  const isDark = config.isDark;
  const bgPage = isDark ? '#0A0F1E' : '#F8F9FC';
  const bgCard = isDark ? '#131929' : '#FFFFFF';
  const bgSurface = isDark ? '#1C2540' : '#F1F4F9';
  const bgNav = isDark ? '#0D1220' : '#FFFFFF';
  const textPrimary = isDark ? '#F0F4FF' : '#0D1220';
  const textSecondary = isDark ? '#94A3B8' : '#5A6478';
  const textMuted = isDark ? '#64748B' : '#9AA3B2';
  const border = isDark ? '#1E2D4A' : '#E4E8F0';

  // Accent color
  const accent = config.primaryColor || '#2563EB';

  // Compute a lighter tint of accent for backgrounds
  const accentAlpha10 = accent + '1A';
  const accentAlpha20 = accent + '33';

  return {
    // Accent
    accent,
    accentAlpha10,
    accentAlpha20,

    // Surfaces
    bgPage,
    bgCard,
    bgSurface,
    bgNav,

    // Text
    textPrimary,
    textSecondary,
    textMuted,

    // Borders
    border,

    // Style tokens
    ...style,
  };
};

export const extractAverageColor = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 10) { // Not transparent
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (count === 0) return resolve(null);
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        // Convert to hex
        const toHex = (n) => { const hex = n.toString(16); return hex.length === 1 ? '0' + hex : hex; };
        resolve(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
};

// =============================================
// PROMPT PARSER - Config-driven template engine
// =============================================

export const colorMap = {
  red: '#DC2626',
  blue: '#2563EB',
  green: '#059669',
  black: '#0F172A',
  white: '#FFFFFF',
  purple: '#7C3AED',
  pink: '#EC4899',
  orange: '#EA580C',
  yellow: '#EAB308',
  gray: '#64748B',
  grey: '#64748B',
  navy: '#1E3A8A',
  teal: '#0D9488',
  indigo: '#4F46E5',
  gold: '#B8860B',
  silver: '#6B7280',
  rose: '#E11D48',
  amber: '#D97706',
  emerald: '#047857',
  cyan: '#0891B2',
};

export const categoryKeywords = {
  sneakers: ['sneaker', 'shoe', 'footwear', 'kicks', 'trainer'],
  tech: ['tech', 'gadget', 'electronic', 'device', 'computer', 'phone', 'laptop'],
  fashion: ['fashion', 'clothing', 'apparel', 'wear', 'outfit', 'dress', 'style'],
  jewelry: ['jewelry', 'jewellery', 'accessory', 'necklace', 'ring', 'bracelet', 'watch'],
  books: ['book', 'novel', 'reading', 'literature', 'library'],
  sports: ['sport', 'fitness', 'gym', 'athletic', 'workout'],
  beauty: ['beauty', 'cosmetic', 'skincare', 'makeup', 'fragrance', 'perfume'],
  home: ['home', 'furniture', 'decor', 'interior', 'living'],
};

export const themeKeywords = {
  luxury: ['luxury', 'premium', 'elegant', 'exclusive', 'high-end', 'upscale', 'elite'],
  minimal: ['minimal', 'clean', 'simple', 'pure', 'bare', 'stripped'],
  bold: ['bold', 'strong', 'powerful', 'vivid', 'vibrant', 'energetic'],
  modern: ['modern', 'contemporary', 'sleek', 'fresh', 'dynamic'],
  vintage: ['vintage', 'retro', 'classic', 'old', 'antique', 'traditional'],
};

export const variantKeywords = {
  1: ['editorial', 'magazine', 'journal', 'news', 'side', 'sidebar'],
  2: ['tech', 'precision', 'cyber', 'mechanical', 'dark tech'],
  3: ['bold', 'impact', 'loud', 'strong', 'giant', 'huge'],
  4: ['soft', 'organic', 'natural', 'smooth', 'pastel'],
  5: ['neon', 'dark', 'night', 'hacker', 'glow', 'cyberpunk'],
  6: ['glass', 'frost', 'transparent', 'diagonal', 'glassmorphism'],
  7: ['brutalist', 'raw', 'blocky', 'retro', 'brutal', 'grid'],
  8: ['warm', 'minimal', 'elegant', 'clean', 'simple'],
  9: ['noir', 'cinematic', 'black', 'dark premium'],
  0: ['classic', 'premium', 'standard', 'normal']
};

export const parsePrompt = (prompt) => {
  const lower = prompt.toLowerCase();

  // --- Store Name ---
  let storeName = 'Your Store';
  const quotedName = prompt.match(/"([^"]+)"/);
  if (quotedName) {
    storeName = quotedName[1];
  } else {
    const nameMatch = prompt.match(
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:store|shop|boutique|market)/i
    );
    if (nameMatch) storeName = nameMatch[1] + ' Store';
    else {
      // Try to pick the first 2-word noun phrase
      const titleMatch = prompt.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\b/);
      if (titleMatch) storeName = titleMatch[1];
    }
  }

  // --- Colors ---
  let primaryColor = '#1E293B';
  let secondaryColor = null;
  const foundColors = Object.keys(colorMap).filter((c) => lower.includes(c));
  if (foundColors.length > 0) {
    primaryColor = colorMap[foundColors[0]];
    if (foundColors.length > 1) secondaryColor = colorMap[foundColors[1]];
  }

  // --- Dark Mode ---
  const isDark =
    lower.includes('dark') ||
    lower.includes('night') ||
    lower.includes('black') ||
    lower.includes('shadow');

  // --- Category ---
  let category = 'fashion';
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      category = cat;
      break;
    }
  }

  // --- Design Style (Theme) ---
  let designStyle = 'modern';
  for (const [style, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      designStyle = style;
      break;
    }
  }

  // --- Layout ---
  let layoutStyle = 'grid';
  if (
    lower.includes('spacious') ||
    lower.includes('large') ||
    lower.includes('card') ||
    lower.includes('luxury')
  ) {
    layoutStyle = 'spacious';
  }

  // --- Brand Tone ---
  let brandTone = 'modern';
  if (lower.includes('luxury') || lower.includes('premium') || lower.includes('elegant')) {
    brandTone = 'premium';
  } else if (lower.includes('playful') || lower.includes('fun') || lower.includes('vibrant')) {
    brandTone = 'playful';
  }

  // --- Preferred Variant ---
  let preferredVariantId = undefined;
  for (const [vId, keywords] of Object.entries(variantKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      preferredVariantId = parseInt(vId, 10);
      break;
    }
  }

  return {
    storeName,
    primaryColor,
    secondaryColor: secondaryColor || primaryColor,
    isDark,
    category,
    designStyle,
    layoutStyle,
    brandTone,
    preferredVariantId,
  };
};

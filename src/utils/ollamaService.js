// =============================================
// OLLAMA SERVICE
// Lightweight wrapper around local Ollama API
// Falls back gracefully if Ollama is unavailable
// =============================================

const OLLAMA_BASE = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3.2'; // common small model

/**
 * Check if Ollama is running locally.
 */
export const isOllamaAvailable = async () => {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
};

/**
 * Get available models from Ollama.
 */
export const getOllamaModels = async () => {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map((m) => m.name);
  } catch {
    return [];
  }
};

/**
 * Send a prompt to Ollama and get a text response.
 * Returns null if unavailable.
 */
export const ollamaGenerate = async (prompt, model = DEFAULT_MODEL) => {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.response?.trim() || null;
  } catch {
    return null;
  }
};

/**
 * Generate a short store tagline using Ollama.
 * Falls back to a template string.
 */
export const generateTagline = async (storeName, category, designStyle, model) => {
  const prompt = `Write a short, premium, single-sentence tagline for a ${designStyle} ${category} store called "${storeName}". 
  No quotes, no explanation. Just the tagline. Maximum 10 words.`;

  const result = await ollamaGenerate(prompt, model);
  if (result) {
    // Clean up — take first line, strip leading/trailing quotes
    const line = result.split('\n')[0].replace(/^["']|["']$/g, '').trim();
    if (line.length > 0 && line.length < 100) return line;
  }

  // Fallback templates
  const fallbacks = {
    luxury: `Where refinement meets ${category}.`,
    minimal: `Less, but better ${category}.`,
    bold: `Bold ${category} for bold people.`,
    modern: `The modern ${category} experience.`,
    vintage: `Timeless ${category}, curated for you.`,
  };
  return fallbacks[designStyle] || `Your destination for premium ${category}.`;
};

/**
 * Generate 6 product names for a category using Ollama.
 * Returns an array of strings, falls back to templates.
 */
export const generateProductNames = async (category, designStyle, model) => {
  const prompt = `List exactly 6 unique product names for a ${designStyle} ${category} store.
  Format: one name per line, no numbering, no explanations, no extra text. Just the 6 names.`;

  const result = await ollamaGenerate(prompt, model);
  if (result) {
    const lines = result
      .split('\n')
      .map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter((l) => l.length > 2 && l.length < 60);
    if (lines.length >= 6) return lines.slice(0, 6);
  }
  return null; // caller uses template fallback
};

/**
 * Generate design token suggestions (accent phrase) using Ollama.
 * For example: font pairing suggestion or mood descriptor.
 */
export const generateDesignMood = async (storeName, designStyle, model) => {
  const prompt = `In 5 words or fewer, describe the design mood for a ${designStyle} store called "${storeName}". 
  Example answers: "clean geometric precision", "warm editorial elegance". No punctuation.`;

  const result = await ollamaGenerate(prompt, model);
  if (result) {
    const line = result.split('\n')[0].replace(/^["']|["']$/g, '').trim();
    if (line.length > 0 && line.length < 60) return line;
  }
  return null;
};

/**
 * Generate a color palette (primary hex) using Ollama based on the user's prompt.
 */
export const generateColorPalette = async (promptText, isDark, model) => {
  const prompt = `Suggest exactly one primary hex color code for a ${isDark ? 'dark' : 'light'} theme e-commerce store based on this description: "${promptText}". 
  Only output the 7-character hex code starting with #, nothing else. Example: #FF0000`;

  const result = await ollamaGenerate(prompt, model);
  if (result) {
    const hexMatch = result.match(/#[0-9A-Fa-f]{6}/);
    if (hexMatch) return hexMatch[0].toUpperCase();
  }
  return null;
};

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { parsePrompt } from '../utils/promptParser';
import { generateTheme, extractAverageColor } from '../utils/themeGenerator';
import {
  isOllamaAvailable,
  getOllamaModels,
  generateTagline,
  generateProductNames,
  generateDesignMood,
  generateColorPalette,
} from '../utils/ollamaService';
import { generateMockProducts } from '../utils/mockData';

// --------------- constants ---------------
const CATEGORIES = [
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'sneakers', label: 'Sneakers & Footwear' },
  { value: 'tech', label: 'Electronics & Tech' },
  { value: 'jewelry', label: 'Jewelry & Accessories' },
  { value: 'sports', label: 'Sports & Fitness' },
  { value: 'beauty', label: 'Beauty & Skincare' },
  { value: 'books', label: 'Books & Literature' },
  { value: 'home', label: 'Home & Living' },
];

const THEME_STYLES = [
  { value: 'minimal', label: 'Minimal', desc: 'Clean lines, generous whitespace' },
  { value: 'luxury', label: 'Luxury', desc: 'Refined spacing, editorial feel' },
  { value: 'bold', label: 'Bold', desc: 'Strong accents, high contrast' },
  { value: 'modern', label: 'Modern', desc: 'Balanced, contemporary layout' },
];

const LAYOUTS = [
  { value: 'grid', label: 'Grid', desc: 'Compact 4-column product grid' },
  { value: 'spacious', label: 'Spacious', desc: 'Large cards, breathing room' },
];

const TONES = [
  { value: 'modern', label: 'Modern' },
  { value: 'premium', label: 'Premium' },
  { value: 'playful', label: 'Playful' },
];

// --------------- helpers ---------------
const TOTAL_STEPS = 7; // prompt + logo + 5 wizard steps

export default function OnboardingFlow() {
  const { setConfig, setCurrentPage, setOnboardingStep, onboardingStep,
    parsedPrompt, setParsedPrompt, setOllamaModel, setOllamaEnabled,
    addGenerationLog, setProducts, showToast } = useApp();

  // Step 1
  const [prompt, setPrompt] = useState('');
  const [promptError, setPromptError] = useState('');

  // Step 2-7 wizard state
  const [logoUrl, setLogoUrl] = useState('');
  const [matchLogoColor, setMatchLogoColor] = useState(true);

  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState('fashion');
  const [designStyle, setDesignStyle] = useState('modern');
  const [layoutStyle, setLayoutStyle] = useState('grid');
  const [brandTone, setBrandTone] = useState('modern');

  // Ollama
  const [ollamaStatus, setOllamaStatus] = useState('idle'); // idle | checking | ready | unavailable
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [useOllama, setUseOllama] = useState(false);

  // Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStage, setGeneratingStage] = useState('');
  const [generatingDot, setGeneratingDot] = useState(0);

  // Dot animation
  useEffect(() => {
    if (!isGenerating) return;
    const iv = setInterval(() => setGeneratingDot((d) => (d + 1) % 4), 400);
    return () => clearInterval(iv);
  }, [isGenerating]);

  // Check Ollama on load
  useEffect(() => {
    const check = async () => {
      setOllamaStatus('checking');
      const available = await isOllamaAvailable();
      if (available) {
        const models = await getOllamaModels();
        setAvailableModels(models);
        setSelectedModel(models[0] || '');
        setOllamaStatus('ready');
      } else {
        setOllamaStatus('unavailable');
      }
    };
    check();
  }, []);

  // Step 1: parse prompt
  const handlePromptSubmit = () => {
    if (!prompt.trim()) { setPromptError('Please describe your store.'); return; }
    if (prompt.trim().length < 5) { setPromptError('A bit more detail helps us get it right.'); return; }
    setPromptError('');
    const parsed = parsePrompt(prompt);
    setParsedPrompt(parsed);
    setStoreName(parsed.storeName || 'My Store');
    setCategory(parsed.category);
    setDesignStyle(parsed.designStyle);
    setLayoutStyle(parsed.layoutStyle);
    setBrandTone(parsed.brandTone);
    setOnboardingStep(2);
  };

  // Step 6: Generate store
  const handleGenerate = async () => {
    setIsGenerating(true);

    const model = useOllama && selectedModel ? selectedModel : null;
    let tagline = `Your premium ${category} destination.`;
    let productNames = null;
    let designMood = null;

    if (model) {
      setGeneratingStage('Generating tagline with Ollama...');
      tagline = await generateTagline(storeName, category, designStyle, model);
      addGenerationLog({ type: 'tagline', model, result: tagline });

      setGeneratingStage('Generating product names with Ollama...');
      productNames = await generateProductNames(category, designStyle, model);
      addGenerationLog({ type: 'products', model, result: productNames });

      setGeneratingStage('Generating design mood with Ollama...');
      designMood = await generateDesignMood(storeName, designStyle, model);
      addGenerationLog({ type: 'mood', model, result: designMood });
    } else {
      setGeneratingStage('Building store configuration...');
      await new Promise((r) => setTimeout(r, 600));
      setGeneratingStage('Generating product catalogue...');
      await new Promise((r) => setTimeout(r, 600));
      setGeneratingStage('Applying theme tokens...');
      await new Promise((r) => setTimeout(r, 400));
    }

    let variantIndex = parseInt(localStorage.getItem('sg_variant_index') || '0', 10);
    let assignedVariant = variantIndex % 10;
    
    // Always increment so round-robin progresses
    localStorage.setItem('sg_variant_index', (variantIndex + 1).toString());

    let finalPrimaryColor = parsedPrompt.primaryColor;
    if (logoUrl && matchLogoColor) {
      setGeneratingStage('Extracting logo color...');
      const color = await extractAverageColor(logoUrl);
      if (color) {
        finalPrimaryColor = color;
      }
    } else if (model) {
      setGeneratingStage('Generating color palette with Ollama...');
      const aiColor = await generateColorPalette(prompt, parsedPrompt.isDark, model);
      if (aiColor) {
        finalPrimaryColor = aiColor;
        addGenerationLog({ type: 'color', model, result: aiColor });
      }
    }

    const finalConfig = {
      ...parsedPrompt,
      primaryColor: finalPrimaryColor,
      logoUrl: logoUrl || undefined,
      storeName,
      tagline,
      category,
      designStyle,
      layoutStyle,
      brandTone,
      designMood: designMood || '',
      ollamaUsed: !!model,
      variantIndex: assignedVariant,
    };

    // Override products if Ollama gave us names
    if (productNames) {
      const customProducts = generateMockProducts(category, productNames);
      setProducts(customProducts);
    }

    setOllamaModel(model);
    setOllamaEnabled(!!model);
    setConfig(finalConfig);
    setIsGenerating(false);
    setCurrentPage('store');

    // Prove to the user how the design was chosen
    setTimeout(() => {
      if (parsedPrompt.preferredVariantId !== undefined) {
        showToast(`Matched prompt to Design Variant ${assignedVariant}`, 'info');
      } else {
        showToast(`Rotated to Design Variant ${assignedVariant}`, 'info');
      }
    }, 500);
  };

  const step = onboardingStep;

  // --- Loading screen ---
  if (isGenerating) {
    return <GeneratingScreen stage={generatingStage} dot={generatingDot} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0F1E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        {/* Logo mark */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: '8px',
            }} />
            <span style={{ color: '#F0F4FF', fontWeight: '700', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
              StoreGen
            </span>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            AI-powered e-commerce generator
          </p>
        </div>

        {/* Progress bar */}
        {step > 1 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              height: '2px',
              backgroundColor: '#1E2D4A',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%`,
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                borderRadius: '2px',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Step {step - 1} of {TOTAL_STEPS - 1}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100)}%</span>
            </div>
          </div>
        )}

        {/* Card */}
        <div style={{
          backgroundColor: '#131929',
          borderRadius: '12px',
          border: '1px solid #1E2D4A',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>

          {/* ========= STEP 1: Prompt ========= */}
          {step === 1 && (
            <>
              <h1 style={{ color: '#F0F4FF', fontSize: '1.625rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                Describe your store
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Type a prompt and we will parse it into a full store configuration — no AI required.
              </p>

              <textarea
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); setPromptError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePromptSubmit(); } }}
                placeholder='e.g. "Create a luxury sneaker store with a dark black and red theme"'
                rows={3}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#0A0F1E',
                  border: `1px solid ${promptError ? '#EF4444' : '#1E2D4A'}`,
                  borderRadius: '8px',
                  color: '#F0F4FF',
                  fontSize: '0.9375rem',
                  fontFamily: 'Inter, sans-serif',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  lineHeight: 1.5,
                }}
              />
              {promptError && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{promptError}</p>}

              {/* Example chips */}
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  'Luxury sneaker store, dark theme',
                  'Minimal tech gadgets shop',
                  'Modern jewelry boutique',
                  'Bold fashion brand',
                ].map((ex) => (
                  <button key={ex} onClick={() => setPrompt(ex)} style={{
                    background: '#0A0F1E',
                    border: '1px solid #1E2D4A',
                    borderRadius: '6px',
                    padding: '0.3rem 0.75rem',
                    color: '#94A3B8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#F0F4FF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E2D4A'; e.currentTarget.style.color = '#94A3B8'; }}
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Ollama status */}
              <div style={{
                marginTop: '1.5rem',
                padding: '0.875rem 1rem',
                backgroundColor: '#0A0F1E',
                borderRadius: '8px',
                border: '1px solid #1E2D4A',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: availableModels.length ? '0.75rem' : 0 }}>
                  <div>
                    <p style={{ color: '#F0F4FF', fontSize: '0.8125rem', fontWeight: '600', marginBottom: '0.15rem' }}>
                      Ollama Local AI
                    </p>
                    <p style={{ color: ollamaStatus === 'ready' ? '#10B981' : '#64748B', fontSize: '0.75rem' }}>
                      {ollamaStatus === 'checking' ? 'Checking...' :
                        ollamaStatus === 'ready' ? `Connected — ${availableModels.length} model(s)` :
                          'Not running — using templates'}
                    </p>
                  </div>
                  {ollamaStatus === 'ready' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <span style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>Use AI</span>
                      <div
                        onClick={() => setUseOllama((v) => !v)}
                        style={{
                          width: '36px', height: '20px',
                          backgroundColor: useOllama ? '#6366F1' : '#1E2D4A',
                          borderRadius: '10px',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          width: '14px', height: '14px',
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '3px',
                          left: useOllama ? '19px' : '3px',
                          transition: 'left 0.2s',
                        }} />
                      </div>
                    </label>
                  )}
                </div>
                {ollamaStatus === 'ready' && useOllama && availableModels.length > 0 && (
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#131929',
                      border: '1px solid #1E2D4A',
                      borderRadius: '6px',
                      color: '#F0F4FF',
                      fontSize: '0.8125rem',
                      fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                )}
              </div>

              <PrimaryButton onClick={handlePromptSubmit} mt="1.5rem">
                Analyze Prompt
              </PrimaryButton>
            </>
          )}

          {/* ========= STEP 2: Logo ========= */}
          {step === 2 && (
            <>
              <StepTitle step={1} title="Upload your Logo (Optional)" />
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Paste a URL to your brand's logo.
              </p>
              <WizardInput
                label="Logo URL"
                value={logoUrl}
                onChange={setLogoUrl}
                placeholder="https://example.com/logo.png"
              />
              {logoUrl && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={matchLogoColor} onChange={(e) => setMatchLogoColor(e.target.checked)} />
                    <span style={{ color: '#F0F4FF', fontSize: '0.875rem' }}>Match store theme color to this logo</span>
                  </label>
                  {!matchLogoColor && (
                    <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.5rem', fontFamily: 'Inter, sans-serif' }}>AI will suggest the best color based on your prompt.</p>
                  )}
                </div>
              )}
              <NavButtons onBack={() => setOnboardingStep(1)} onNext={() => setOnboardingStep(3)} />
            </>
          )}

          {/* ========= STEP 3: Store Name ========= */}
          {step === 3 && (
            <>
              <StepTitle step={2} title="Confirm your store name" />
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                We detected this from your prompt. Edit as needed.
              </p>
              <WizardInput
                label="Store Name"
                value={storeName}
                onChange={setStoreName}
                placeholder="e.g. Apex Sneakers"
              />
              <NavButtons onBack={() => setOnboardingStep(2)} onNext={() => setOnboardingStep(4)} />
            </>
          )}

          {/* ========= STEP 4: Category ========= */}
          {step === 4 && (
            <>
              <StepTitle step={3} title="Select product category" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {CATEGORIES.map((cat) => (
                  <OptionCard
                    key={cat.value}
                    selected={category === cat.value}
                    onClick={() => setCategory(cat.value)}
                    label={cat.label}
                  />
                ))}
              </div>
              <NavButtons onBack={() => setOnboardingStep(3)} onNext={() => setOnboardingStep(5)} />
            </>
          )}

          {/* ========= STEP 5: Theme ========= */}
          {step === 5 && (
            <>
              <StepTitle step={4} title="Choose theme style" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {THEME_STYLES.map((s) => (
                  <OptionCard
                    key={s.value}
                    selected={designStyle === s.value}
                    onClick={() => setDesignStyle(s.value)}
                    label={s.label}
                    desc={s.desc}
                  />
                ))}
              </div>
              <NavButtons onBack={() => setOnboardingStep(4)} onNext={() => setOnboardingStep(6)} />
            </>
          )}

          {/* ========= STEP 6: Layout ========= */}
          {step === 6 && (
            <>
              <StepTitle step={5} title="Layout preference" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {LAYOUTS.map((l) => (
                  <OptionCard
                    key={l.value}
                    selected={layoutStyle === l.value}
                    onClick={() => setLayoutStyle(l.value)}
                    label={l.label}
                    desc={l.desc}
                  />
                ))}
              </div>
              <NavButtons onBack={() => setOnboardingStep(5)} onNext={() => setOnboardingStep(7)} />
            </>
          )}

          {/* ========= STEP 7: Brand Tone + Generate ========= */}
          {step === 7 && (
            <>
              <StepTitle step={6} title="Brand tone" />
              <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '2rem' }}>
                {TONES.map((tone) => (
                  <OptionCard
                    key={tone.value}
                    selected={brandTone === tone.value}
                    onClick={() => setBrandTone(tone.value)}
                    label={tone.label}
                    flex
                  />
                ))}
              </div>

              {/* Summary */}
              <div style={{
                padding: '1rem',
                backgroundColor: '#0A0F1E',
                borderRadius: '8px',
                border: '1px solid #1E2D4A',
                marginBottom: '1.5rem',
              }}>
                <p style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>
                  Configuration Summary
                </p>
                {[
                  { k: 'Store', v: storeName },
                  { k: 'Category', v: CATEGORIES.find((c) => c.value === category)?.label },
                  { k: 'Theme', v: designStyle },
                  { k: 'Layout', v: layoutStyle },
                  { k: 'Tone', v: brandTone },
                  useOllama && selectedModel ? { k: 'AI Model', v: selectedModel } : null,
                ].filter(Boolean).map(({ k, v }) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>{k}</span>
                    <span style={{ color: '#F0F4FF', fontSize: '0.8125rem', fontWeight: '500' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setOnboardingStep(6)}
                  style={{
                    flex: '0 0 auto',
                    padding: '0.75rem 1.25rem',
                    border: '1px solid #1E2D4A',
                    borderRadius: '8px',
                    background: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Back
                </button>
                <PrimaryButton onClick={handleGenerate} flex="1">
                  {useOllama && selectedModel ? 'Generate with Ollama' : 'Generate Store'}
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// -------- Sub-components --------

function StepTitle({ step, title }) {
  return (
    <h2 style={{
      color: '#F0F4FF',
      fontSize: '1.375rem',
      fontWeight: '700',
      marginBottom: '0.375rem',
      letterSpacing: '-0.02em',
      fontFamily: 'Inter, sans-serif',
    }}>
      {title}
    </h2>
  );
}

function WizardInput({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{
        display: 'block',
        color: '#94A3B8',
        fontSize: '0.8125rem',
        fontWeight: '500',
        marginBottom: '0.5rem',
        fontFamily: 'Inter, sans-serif',
      }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: '#0A0F1E',
          border: '1px solid #1E2D4A',
          borderRadius: '8px',
          color: '#F0F4FF',
          fontSize: '1rem',
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function OptionCard({ selected, onClick, label, desc, flex }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: flex ? 1 : undefined,
        padding: '0.875rem 1rem',
        backgroundColor: selected ? '#6366F11A' : '#0A0F1E',
        border: `1px solid ${selected ? '#6366F1' : '#1E2D4A'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
        fontFamily: 'Inter, sans-serif',
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = '#6366F160'; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = '#1E2D4A'; }}
    >
      <p style={{
        color: selected ? '#A5B4FC' : '#F0F4FF',
        fontSize: '0.875rem',
        fontWeight: selected ? '600' : '500',
        marginBottom: desc ? '0.25rem' : 0,
      }}>
        {label}
      </p>
      {desc && <p style={{ color: '#64748B', fontSize: '0.75rem', lineHeight: 1.4 }}>{desc}</p>}
    </button>
  );
}

function PrimaryButton({ onClick, children, mt, flex }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: flex || undefined,
        width: flex ? undefined : '100%',
        marginTop: mt || 0,
        padding: '0.875rem 1.5rem',
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.9375rem',
        fontWeight: '600',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'filter 0.2s',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
    >
      {children}
    </button>
  );
}

function NavButtons({ onBack, onNext }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button onClick={onBack} style={{
        flex: '0 0 auto',
        padding: '0.75rem 1.25rem',
        border: '1px solid #1E2D4A',
        borderRadius: '8px',
        background: 'none',
        color: '#94A3B8',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontFamily: 'Inter, sans-serif',
      }}>
        Back
      </button>
      <PrimaryButton onClick={onNext} flex="1">Continue</PrimaryButton>
    </div>
  );
}

function GeneratingScreen({ stage, dot }) {
  const dots = '.'.repeat(dot);
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0F1E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
        {/* Spinner */}
        <div style={{
          width: '52px',
          height: '52px',
          margin: '0 auto 2rem',
          border: '3px solid #1E2D4A',
          borderTopColor: '#6366F1',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <h2 style={{ color: '#F0F4FF', fontSize: '1.375rem', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Building your store{dots}
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {stage || 'Initializing configuration...'}
        </p>
      </div>
    </div>
  );
}

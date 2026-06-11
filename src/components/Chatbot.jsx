import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { ollamaGenerate } from '../utils/ollamaService';

export default function Chatbot() {
  const { products, addToCart, setCurrentPage, config, updateConfig } = useApp();
  const t = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shop');
  
  const [shopMessages, setShopMessages] = useState([
    { role: 'bot', text: `Hi! I'm your ${config?.storeName || 'Store'} AI assistant. Ask me for recommendations!` }
  ]);
  const [editMessages, setEditMessages] = useState([
    { role: 'bot', text: 'I am your design assistant. Ask me to change the theme color, switch to a dark mode, or try a new layout!' }
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const messages = activeTab === 'shop' ? shopMessages : editMessages;
  const setMessages = activeTab === 'shop' ? setShopMessages : setEditMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  if (!config) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    
    if (activeTab === 'edit') {
      const prompt = `You are a web design assistant. Current store config: ${JSON.stringify({primaryColor: config.primaryColor, isDark: config.isDark, designStyle: config.designStyle, layoutStyle: config.layoutStyle, brandTone: config.brandTone})}. 
The user requests: "${userText}".
Output ONLY a valid JSON object containing the properties to update. Valid properties: primaryColor (hex string), isDark (boolean), designStyle (minimal, luxury, bold, modern, vintage), layoutStyle (grid, spacious), brandTone (modern, playful, premium). If you don't understand, output {}. Do not include markdown or explanations.`;
      
      const response = await ollamaGenerate(prompt, config.aiModel);
      let botResponse = "I couldn't process that change. Please try again.";
      if (response) {
        try {
          const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
          const updates = JSON.parse(cleaned);
          if (Object.keys(updates).length > 0) {
            updateConfig(updates);
            botResponse = `Store updated successfully! Applied changes: ${Object.keys(updates).join(', ')}.`;
          } else {
            botResponse = "I didn't detect any valid design changes in your request.";
          }
        } catch (e) {
          botResponse = "I encountered an error parsing the design change.";
        }
      }
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      return;
    }

    // Simple AI parsing logic
    let botResponse = '';
    let recommendedProducts = [];
    const lowerInput = userText.toLowerCase();
    
    // Intent: Add to cart
    if (lowerInput.includes('add') && lowerInput.includes('cart')) {
      const matchedProduct = products.find(p => lowerInput.includes(p.name.toLowerCase()) || lowerInput.includes(`id ${p.id}`) || lowerInput.includes(p.id.toString()));
      if (matchedProduct) {
        addToCart(matchedProduct);
        botResponse = `Added **${matchedProduct.name}** to your cart! You can type "checkout" to go to the checkout page.`;
      } else {
        botResponse = `I couldn't find exactly which product you want to add. Please specify the product name.`;
      }
    }
    // Intent: Checkout / Buy
    else if (lowerInput.includes('checkout') || lowerInput.includes('buy')) {
      setCurrentPage('checkout');
      setIsOpen(false);
      botResponse = `Taking you to checkout!`;
    }
    // Intent: Recommendations
    else if (lowerInput.includes('recommend') || lowerInput.includes('best') || lowerInput.includes('show')) {
      recommendedProducts = products.slice(0, 3);
      botResponse = `Here are some of our best products you might like:`;
    }
    // Generic fallback
    else {
      const prompt = `You are a helpful AI shopping assistant for a store called ${config.storeName}. The user says: "${userText}". Keep your response concise, helpful, and friendly. Do not use markdown.`;
      const ollamaResponse = await ollamaGenerate(prompt, config.aiModel || undefined);
      if (ollamaResponse) {
        botResponse = ollamaResponse;
      } else {
        botResponse = `I'm an AI assistant. I can recommend products from our catalogue or help you add items to your cart. Try saying "Recommend me something" or "Add ${products[0]?.name} to cart".`;
      }
    }
    
    setMessages(prev => [
      ...prev, 
      { role: 'bot', text: botResponse, products: recommendedProducts }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: t.accent,
            color: '#fff',
            border: 'none',
            boxShadow: t.shadowLg,
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ✨
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '360px',
          height: '500px',
          backgroundColor: t.bgCard,
          border: `1px solid ${t.border}`,
          borderRadius: '16px',
          boxShadow: t.shadowLg,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif'
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: t.accent,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: '600' }}>✨ Store Assistant</div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
              >×</button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('shop')}
                style={{
                  flex: 1, padding: '4px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                  backgroundColor: activeTab === 'shop' ? '#ffffff33' : 'transparent',
                  color: '#fff', fontWeight: activeTab === 'shop' ? '600' : '400', fontSize: '0.8125rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Shopping
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                style={{
                  flex: 1, padding: '4px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                  backgroundColor: activeTab === 'edit' ? '#ffffff33' : 'transparent',
                  color: '#fff', fontWeight: activeTab === 'edit' ? '600' : '400', fontSize: '0.8125rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Make Changes
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}>
                <div style={{
                  backgroundColor: msg.role === 'user' ? t.accent : t.bgSurface,
                  color: msg.role === 'user' ? '#fff' : t.textPrimary,
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  fontSize: '0.875rem',
                  lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
                {msg.products && msg.products.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {msg.products.map(p => (
                      <div key={p.id} style={{
                        display: 'flex', gap: '8px', backgroundColor: t.bgSurface, 
                        border: `1px solid ${t.border}`, borderRadius: '8px', padding: '8px',
                        alignItems: 'center'
                      }}>
                        <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: t.textPrimary }}>{p.name}</div>
                          <div style={{ fontSize: '0.7rem', color: t.textSecondary }}>ID: {p.id} | ${p.price.toFixed(2)}</div>
                        </div>
                        <button 
                          onClick={() => addToCart(p)}
                          style={{
                            backgroundColor: t.accent, color: '#fff', border: 'none', 
                            borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer'
                          }}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '10px 12px', borderRadius: '24px',
                border: `1px solid ${t.border}`, backgroundColor: t.bgSurface,
                color: t.textPrimary, outline: 'none', fontSize: '0.875rem'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: t.accent, color: '#fff', border: 'none',
                borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

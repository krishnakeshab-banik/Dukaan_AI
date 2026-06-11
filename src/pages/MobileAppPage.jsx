import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';

// Expo Snack deep link for QR code
const EXPO_SNACK_BASE = 'https://snack.expo.dev';

// QR code via QR Server API
const qrUrl = (url) => `https://quickchart.io/qr?text=${encodeURIComponent(url)}&size=200&margin=1`;

// Simulated app.js code (Expo React Native)
const generateAppCode = (config, products) => `
import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';

const PRIMARY = '${config?.primaryColor || '#2563EB'}';
const BG = '${config?.isDark ? '#0A0F1E' : '#F8F9FC'}';
const CARD = '${config?.isDark ? '#131929' : '#FFFFFF'}';
const TEXT = '${config?.isDark ? '#F0F4FF' : '#0D1220'}';

const PRODUCTS = ${JSON.stringify(products?.slice(0, 8).map(p => ({
  id: String(p.id),
  name: p.name,
  price: p.price,
  image: p.image
})) || [], null, 2)};

export default function App() {
  const [cart, setCart] = useState([]);

  const add = (p) => {
    setCart(c => {
      const ex = c.find(i => i.id === p.id);
      return ex ? c.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i) : [...c, {...p, qty:1}];
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="${config?.isDark ? 'light' : 'dark'}-content" />
      <View style={styles.header}>
        <Text style={styles.storeName}>${config?.storeName || 'My Store'}</Text>
        <Text style={styles.cartCount}>Cart: {cart.reduce((s,i)=>s+i.qty,0)}</Text>
      </View>
      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.grid}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={{uri: item.image}} style={styles.img} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>\${item.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.btn} onPress={()=>add(item)}>
              <Text style={styles.btnTxt}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: CARD, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  storeName: { fontSize: 18, fontWeight: '700', color: TEXT },
  cartCount: { fontSize: 13, color: PRIMARY, fontWeight: '600' },
  grid: { padding: 8 },
  card: { flex: 1, margin: 6, backgroundColor: CARD, borderRadius: 8, overflow: 'hidden' },
  img: { width: '100%', height: 140, resizeMode: 'cover' },
  name: { padding: 8, fontSize: 13, fontWeight: '600', color: TEXT },
  price: { paddingHorizontal: 8, fontSize: 15, fontWeight: '700', color: PRIMARY },
  btn: { margin: 8, backgroundColor: PRIMARY, borderRadius: 6, padding: 8, alignItems: 'center' },
  btnTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
`.trim();

export default function MobileAppPage() {
  const { config, products } = useApp();
  const t = useTheme();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // preview | code

  const appCode = generateAppCode(config, products);
  const snackUrl = `${EXPO_SNACK_BASE}/?code=${encodeURIComponent(appCode)}&name=${encodeURIComponent(config?.storeName || 'MyStore')}&platform=ios`;

  const copyCode = () => {
    navigator.clipboard.writeText(appCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'preview', label: 'QR Preview' },
    { id: 'code', label: 'App Code' },
    { id: 'info', label: 'Setup Guide' },
  ];

  return (
    <div style={{ backgroundColor: t.bgPage, minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        <h1 style={{
          fontSize: '1.625rem',
          fontWeight: t.headingWeight,
          color: t.textPrimary,
          marginBottom: '0.25rem',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.02em',
        }}>
          Mobile App Preview
        </h1>
        <p style={{ color: t.textMuted, fontSize: '0.875rem', marginBottom: '2rem', fontFamily: 'Inter, sans-serif' }}>
          Expo React Native app generated from your store configuration.
        </p>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          backgroundColor: t.bgSurface,
          borderRadius: t.borderRadius,
          padding: '4px',
          width: 'fit-content',
          marginBottom: '2rem',
          border: `1px solid ${t.border}`,
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1.125rem',
                borderRadius: t.borderRadius,
                border: 'none',
                backgroundColor: activeTab === tab.id ? t.bgCard : 'transparent',
                color: activeTab === tab.id ? t.textPrimary : t.textMuted,
                fontWeight: activeTab === tab.id ? '600' : '400',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: activeTab === tab.id ? t.shadowSm : 'none',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* -------- QR Preview -------- */}
        {activeTab === 'preview' && (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* QR Card */}
            <div style={{
              backgroundColor: t.bgCard,
              borderRadius: t.borderRadius,
              border: `1px solid ${t.border}`,
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: t.shadowMd,
              flex: '0 0 280px',
            }}>
              <img
                src={qrUrl(window.location.origin + '?simulator=1')}
                alt="Web Simulator QR Code"
                style={{ width: '180px', height: '180px', borderRadius: '8px', marginBottom: '1.25rem' }}
              />
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: t.accent,
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.25rem',
              }}>
                1. Scan to test LIVE Simulator
              </p>
              <p style={{ fontSize: '0.75rem', color: t.textMuted, fontFamily: 'Inter, sans-serif', marginBottom: '2rem' }}>
                Scan with any phone camera to instantly view the interactive simulator below directly on your mobile device!
              </p>

              <div style={{ width: '100%', height: '1px', backgroundColor: t.border, marginBottom: '2rem' }}></div>

              <img
                src={qrUrl(snackUrl)}
                alt="Expo Go QR Code"
                style={{ width: '120px', height: '120px', borderRadius: '8px', marginBottom: '1.25rem', opacity: 0.8 }}
              />
              <p style={{
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: t.textPrimary,
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.25rem',
              }}>
                2. Real Expo Native App
              </p>
              <p style={{ fontSize: '0.75rem', color: t.textMuted, fontFamily: 'Inter, sans-serif', marginBottom: '1.25rem' }}>
                Opens React Native code in Expo Go app
              </p>
              <a
                href={snackUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '0.625rem 1.25rem',
                  backgroundColor: t.accent,
                  color: '#fff',
                  borderRadius: t.borderRadius,
                  textDecoration: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'filter 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
              >
                Open in Expo Snack
              </a>
            </div>

            {/* Phone wireframe mockup */}
            <div style={{ flex: '1 1 300px' }}>
              <PhoneWireframe config={config} t={t} />
            </div>
          </div>
        )}

        {/* -------- Code -------- */}
        {activeTab === 'code' && (
          <div style={{
            backgroundColor: t.bgCard,
            borderRadius: t.borderRadius,
            border: `1px solid ${t.border}`,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '0.875rem 1.25rem',
              borderBottom: `1px solid ${t.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: t.bgSurface,
            }}>
              <span style={{ color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>
                App.js — Expo React Native
              </span>
              <button
                onClick={copyCode}
                style={{
                  padding: '0.375rem 0.875rem',
                  backgroundColor: copied ? '#10B981' : t.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'background 0.2s',
                }}
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre style={{
              margin: 0,
              padding: '1.5rem',
              color: t.textSecondary,
              fontSize: '0.78125rem',
              lineHeight: 1.65,
              fontFamily: 'ui-monospace, "Fira Code", monospace',
              overflow: 'auto',
              maxHeight: '60vh',
              backgroundColor: t.bgPage,
            }}>
              {appCode}
            </pre>
          </div>
        )}

        {/* -------- Setup Guide -------- */}
        {activeTab === 'info' && (
          <div style={{
            backgroundColor: t.bgCard,
            borderRadius: t.borderRadius,
            border: `1px solid ${t.border}`,
            padding: '2rem',
            maxWidth: '600px',
          }}>
            <h3 style={{
              color: t.textPrimary,
              fontWeight: '700',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              Run Locally with Expo
            </h3>
            {[
              { n: '1', title: 'Install Expo CLI', code: 'npm install -g expo-cli' },
              { n: '2', title: 'Create new project', code: 'npx create-expo-app MyStore' },
              { n: '3', title: 'Replace App.js', code: '# Paste the generated code from the Code tab' },
              { n: '4', title: 'Start development server', code: 'npx expo start' },
              { n: '5', title: 'Scan QR code', code: '# Use Expo Go app on your phone' },
            ].map((step) => (
              <div key={step.n} style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.25rem',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: t.accentAlpha10,
                  border: `1px solid ${t.accent}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: t.accent,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {step.n}
                </div>
                <div>
                  <p style={{ color: t.textPrimary, fontSize: '0.875rem', fontWeight: '600', fontFamily: 'Inter, sans-serif', marginBottom: '0.375rem' }}>
                    {step.title}
                  </p>
                  <code style={{
                    display: 'block',
                    padding: '0.5rem 0.875rem',
                    backgroundColor: t.bgSurface,
                    borderRadius: '4px',
                    fontSize: '0.78125rem',
                    color: t.accent,
                    fontFamily: 'ui-monospace, monospace',
                  }}>
                    {step.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Phone mockup wireframe ----
function PhoneWireframe({ config, t }) {
  const isDark = config?.isDark;
  const phoneBg = isDark ? '#0A0F1E' : '#F8F9FC';

  // We use the same URL but we append a query parameter or just use the current path.
  // The iframe will run the entire React app in mobile dimensions.
  const iframeUrl = window.location.origin + '?simulator=1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ color: t.textMuted, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Interactive App Preview
      </p>
      {/* Phone shell */}
      <div style={{
        width: '340px',
        height: '680px',
        backgroundColor: '#1C2540',
        borderRadius: '40px',
        padding: '12px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: phoneBg,
          borderRadius: '28px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <iframe 
            src={iframeUrl} 
            title="Mobile App Simulator"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

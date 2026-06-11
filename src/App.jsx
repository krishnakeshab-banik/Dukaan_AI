import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import OnboardingFlow from './pages/OnboardingFlow';
import StoreFront from './pages/StoreFront';
import BrowsePage from './pages/BrowsePage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import MobileAppPage from './pages/MobileAppPage';
import { useTheme } from './hooks/useTheme';
import { useVariant } from './hooks/useVariant';
import { useState, useEffect } from 'react';

function AppContent() {
  const { config, currentPage } = useApp();
  const t = useTheme();
  const v = useVariant();
  const [isMobileWindow, setIsMobileWindow] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const check = () => setIsMobileWindow(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // No config → show onboarding
  if (!config) {
    return <OnboardingFlow />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'store':     return <StoreFront />;
      case 'browse':    return <BrowsePage />;
      case 'wishlist':  return <WishlistPage />;
      case 'cart':      return <CartPage />;
      case 'details':   return <ProductDetailsPage />;
      case 'checkout':  return <CheckoutPage />;
      case 'dashboard': return <DashboardPage />;
      case 'mobile':    return <MobileAppPage />;
      default:          return <StoreFront />;
    }
  };

  const isSideNav = v.navPosition === 'side' && !isMobileWindow;

  return (
    <div style={{
      backgroundColor: t.bgPage,
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      display: isSideNav ? 'flex' : 'block'
    }}>
      <Navbar isSideNav={isSideNav} />
      <div style={{ flex: 1, width: isSideNav ? 'calc(100% - 240px)' : '100%', position: 'relative' }}>
        {v.name === 'Glass Morphism' && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: t.accent, filter: 'blur(100px)', opacity: 0.15 }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: '#EC4899', filter: 'blur(100px)', opacity: 0.15 }} />
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {renderPage()}
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

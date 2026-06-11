import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateMockProducts } from '../utils/mockData';

const AppContext = createContext(null);

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};
const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
};

export const AppProvider = ({ children }) => {
  const [config, setConfigState] = useState(() => load('sg_config', null));
  const [cart, setCart] = useState(() => load('sg_cart', []));

  // Orders start at [] — only real orders placed via checkout
  const [orders, setOrders] = useState(() => load('sg_orders', []));
  const [products, setProducts] = useState(() => load('sg_products', []));
  const [adminProducts, setAdminProducts] = useState(() => load('sg_adminProducts', []));
  const [wishlist, setWishlist] = useState(() => load('sg_wishlist', []));
  const [toast, setToast] = useState(null); // { message, type }

  // UI state
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [parsedPrompt, setParsedPrompt] = useState(null);
  const [ollamaModel, setOllamaModel] = useState(null);
  const [ollamaEnabled, setOllamaEnabled] = useState(false);
  const [generationLog, setGenerationLog] = useState([]);
  const [browseCategory, setBrowseCategory] = useState('all');

  // Persist
  useEffect(() => { if (config) save('sg_config', config); }, [config]);
  useEffect(() => { save('sg_cart', cart); }, [cart]);
  useEffect(() => { save('sg_orders', orders); }, [orders]);
  useEffect(() => { save('sg_products', products); }, [products]);
  useEffect(() => { save('sg_adminProducts', adminProducts); }, [adminProducts]);
  useEffect(() => { save('sg_wishlist', wishlist); }, [wishlist]);

  // Sync across tabs/iframes
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'sg_cart') setCart(load('sg_cart', []));
      if (e.key === 'sg_orders') setOrders(load('sg_orders', []));
      if (e.key === 'sg_products') setProducts(load('sg_products', []));
      if (e.key === 'sg_adminProducts') setAdminProducts(load('sg_adminProducts', []));
      if (e.key === 'sg_wishlist') setWishlist(load('sg_wishlist', []));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const setConfig = useCallback((cfg) => {
    setConfigState(cfg);
    if (cfg) {
      const generated = generateMockProducts(cfg.category);
      setProducts(generated);
      save('sg_products', generated);
      setAdminProducts(generated);
      save('sg_adminProducts', generated);
      // Orders reset to empty — analytics start from 0
      setOrders([]);
      save('sg_orders', []);
    }
  }, []);

  // ---- Cart ----
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  }, [removeFromCart]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ---- Wishlist ----
  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((i) => i.id !== product.id);
      }
      showToast('Added to wishlist', 'info');
      return [...prev, product];
    });
  }, [showToast]);

  const isWishlisted = useCallback((id) => wishlist.some((i) => i.id === id), [wishlist]);

  // ---- Orders ----
  const placeOrder = useCallback(() => {
    const order = {
      id: `ORD-${Date.now()}`,
      customer: 'Guest User',
      items: [...cart],
      itemCount: cart.reduce((s, i) => s + i.quantity, 0),
      amount: cartTotal,
      total: cartTotal,
      status: 'Processing',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    showToast('Order placed successfully!', 'success');
    return order;
  }, [cart, cartTotal, showToast]);

  // ---- Admin products ----
  const addAdminProduct = useCallback((product) => {
    const newProduct = { ...product, id: Date.now(), stock: 10, rating: '4.5', reviews: 0 };
    setAdminProducts((prev) => [newProduct, ...prev]);
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product added to catalogue');
  }, [showToast]);

  const deleteAdminProduct = useCallback((id) => {
    setAdminProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed', 'info');
  }, [showToast]);

  // ---- Reset ----
  const resetStore = useCallback(() => {
    setConfigState(null);
    setCart([]);
    setOrders([]);
    setProducts([]);
    setAdminProducts([]);
    setWishlist([]);
    setCurrentPage('home');
    setSelectedProduct(null);
    setOnboardingStep(1);
    setParsedPrompt(null);
    setGenerationLog([]);
    ['sg_config','sg_cart','sg_orders','sg_products','sg_adminProducts','sg_wishlist'].forEach((k) =>
      localStorage.removeItem(k)
    );
  }, []);

  const addGenerationLog = useCallback((entry) => setGenerationLog((prev) => [...prev, entry]), []);

  const updateConfig = useCallback((newProps) => {
    setConfigState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...newProps };
      localStorage.setItem('sg_config', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      config, setConfig, updateConfig,
      cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
      orders, placeOrder,
      products, setProducts,
      adminProducts, addAdminProduct, deleteAdminProduct,
      wishlist, toggleWishlist, isWishlisted,
      currentPage, setCurrentPage,
      selectedProduct, setSelectedProduct,
      onboardingStep, setOnboardingStep,
      parsedPrompt, setParsedPrompt,
      ollamaModel, setOllamaModel,
      ollamaEnabled, setOllamaEnabled,
      generationLog, addGenerationLog,
      browseCategory, setBrowseCategory,
      toast, showToast,
      resetStore,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

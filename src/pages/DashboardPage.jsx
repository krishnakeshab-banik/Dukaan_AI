import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import DashboardCard from '../components/DashboardCard';
import { generateRevenueData, generateOrdersData } from '../utils/mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const CATEGORIES = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'tech', label: 'Electronics' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'sports', label: 'Sports' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'books', label: 'Books' },
  { value: 'home', label: 'Home' },
];

const STATUS_COLORS = {
  Delivered: '#10B981',
  Shipped: '#6366F1',
  Processing: '#F59E0B',
  Cancelled: '#EF4444',
};

export default function DashboardPage() {
  const { orders, adminProducts, addAdminProduct, deleteAdminProduct, config } = useApp();
  const t = useTheme();

  const [activeTab, setActiveTab] = useState('overview'); // overview | products | orders | add | settings
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: config?.category || 'fashion', image: '' });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Chart data (memoized so it doesn't change on re-render)
  const revenueData = useMemo(() => generateRevenueData(), []);
  const ordersData = useMemo(() => generateOrdersData(), []);

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = adminProducts.length;
  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

  const chartOptions = (label) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: t.bgCard,
        borderColor: t.border,
        borderWidth: 1,
        titleColor: t.textPrimary,
        bodyColor: t.textSecondary,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: t.border, drawBorder: false },
        ticks: { color: t.textMuted, font: { family: 'Inter, sans-serif', size: 11 } },
      },
      y: {
        grid: { color: t.border, drawBorder: false },
        ticks: { color: t.textMuted, font: { family: 'Inter, sans-serif', size: 11 } },
      },
    },
  });

  const lineChartData = {
    labels: revenueData.labels,
    datasets: [{
      label: 'Revenue',
      data: revenueData.data,
      borderColor: t.accent,
      backgroundColor: t.accentAlpha10,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: t.accent,
      borderWidth: 2,
    }],
  };

  const barChartData = {
    labels: ordersData.labels,
    datasets: [{
      label: 'Orders',
      data: ordersData.data,
      backgroundColor: t.accentAlpha20,
      borderColor: t.accent,
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  };

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price) {
      setAddError('Name and price are required.');
      return;
    }
    addAdminProduct({
      ...newProduct,
      price: parseFloat(newProduct.price),
      image: newProduct.image || `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop`,
    });
    setNewProduct({ name: '', price: '', category: config?.category || 'fashion', image: '' });
    setAddError('');
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'add', label: '+ Add Product' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div style={{ backgroundColor: t.bgPage, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.625rem',
            fontWeight: t.headingWeight,
            color: t.textPrimary,
            marginBottom: '0.25rem',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.02em',
          }}>
            Admin Dashboard
          </h1>
          <p style={{ color: t.textMuted, fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
            {config?.storeName} — ERP Panel
          </p>
        </div>

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

        {/* -------- OVERVIEW -------- */}
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <DashboardCard title="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} subtitle="All time" trend={12} accentBar />
              <DashboardCard title="Total Orders" value={totalOrders} subtitle="All time" trend={8} accentBar />
              <DashboardCard title="Total Products" value={totalProducts} subtitle="In catalogue" accentBar />
              <DashboardCard title="Avg. Order Value" value={`$${avgOrder.toFixed(0)}`} subtitle="Per transaction" trend={3} accentBar />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <ChartCard title="Revenue Over Time" t={t}>
                <div style={{ height: '220px' }}>
                  <Line data={lineChartData} options={chartOptions('Revenue')} />
                </div>
              </ChartCard>
              <ChartCard title="Orders This Week" t={t}>
                <div style={{ height: '220px' }}>
                  <Bar data={barChartData} options={chartOptions('Orders')} />
                </div>
              </ChartCard>
            </div>

            {/* Recent orders mini-table */}
            <ChartCard title="Recent Orders" t={t}>
              <OrderTable orders={orders.slice(0, 5)} t={t} />
            </ChartCard>
          </>
        )}

        {/* -------- PRODUCTS -------- */}
        {activeTab === 'products' && (
          <div style={{
            backgroundColor: t.bgCard,
            borderRadius: t.borderRadius,
            border: `1px solid ${t.border}`,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.border}` }}>
              <h3 style={{ color: t.textPrimary, fontWeight: '700', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif' }}>
                Product Catalogue ({adminProducts.length})
              </h3>
            </div>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: t.bgSurface }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Rating', ''].map((h) => (
                      <th key={h} style={{
                        padding: '0.75rem 1.25rem',
                        textAlign: 'left',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        color: t.textMuted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminProducts.map((p, i) => (
                    <tr key={p.id} style={{ borderTop: `1px solid ${t.border}`, backgroundColor: i % 2 === 0 ? 'transparent' : t.bgSurface + '60' }}>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ color: t.textPrimary, fontSize: '0.875rem', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>{p.category}</td>
                      <td style={{ padding: '0.875rem 1.25rem', color: t.textPrimary, fontSize: '0.875rem', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>${Number(p.price).toFixed(2)}</td>
                      <td style={{ padding: '0.875rem 1.25rem', color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>{p.stock}</td>
                      <td style={{ padding: '0.875rem 1.25rem', color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>{p.rating}</td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <button
                          onClick={() => deleteAdminProduct(p.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: t.textMuted,
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                            fontFamily: 'Inter, sans-serif',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = t.textMuted}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {adminProducts.length === 0 && (
                <p style={{ padding: '2rem', textAlign: 'center', color: t.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
                  No products. Add some via the Add Product tab.
                </p>
              )}
            </div>
          </div>
        )}

        {/* -------- ORDERS -------- */}
        {activeTab === 'orders' && (
          <div style={{
            backgroundColor: t.bgCard,
            borderRadius: t.borderRadius,
            border: `1px solid ${t.border}`,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.border}` }}>
              <h3 style={{ color: t.textPrimary, fontWeight: '700', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif' }}>
                All Orders ({orders.length})
              </h3>
            </div>
            <OrderTable orders={orders} t={t} />
          </div>
        )}

        {/* -------- ADD PRODUCT -------- */}
        {activeTab === 'add' && (
          <div style={{ maxWidth: '560px' }}>
            <div style={{
              backgroundColor: t.bgCard,
              borderRadius: t.borderRadius,
              border: `1px solid ${t.border}`,
              padding: '2rem',
              boxShadow: t.shadowSm,
            }}>
              <h3 style={{
                color: t.textPrimary,
                fontWeight: '700',
                fontSize: '1.125rem',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.01em',
              }}>
                Add New Product
              </h3>

              {addSuccess && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#10B98120',
                  border: '1px solid #10B98140',
                  borderRadius: t.borderRadius,
                  color: '#10B981',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '1rem',
                }}>
                  Product added successfully.
                </div>
              )}

              {addError && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#EF444420',
                  border: '1px solid #EF444440',
                  borderRadius: t.borderRadius,
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '1rem',
                }}>
                  {addError}
                </div>
              )}

              {[
                { label: 'Product Name', key: 'name', placeholder: 'e.g. Classic Leather Jacket', type: 'text' },
                { label: 'Price ($)', key: 'price', placeholder: '149.99', type: 'number' },
                { label: 'Image URL (optional)', key: 'image', placeholder: 'https://...', type: 'url' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: t.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.375rem',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={newProduct[key]}
                    onChange={(e) => setNewProduct((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: t.bgSurface,
                      border: `1px solid ${t.border}`,
                      borderRadius: t.borderRadius,
                      color: t.textPrimary,
                      fontSize: '0.9375rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = t.accent}
                    onBlur={(e) => e.currentTarget.style.borderColor = t.border}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: t.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.375rem',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: t.bgSurface,
                    border: `1px solid ${t.border}`,
                    borderRadius: t.borderRadius,
                    color: t.textPrimary,
                    fontSize: '0.9375rem',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <button
                onClick={handleAddProduct}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: t.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: t.borderRadius,
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'filter 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
              >
                Add Product
              </button>
            </div>
          </div>
        )}

        {/* -------- SETTINGS -------- */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '560px' }}>
            <div style={{
              backgroundColor: t.bgCard,
              borderRadius: t.borderRadius,
              border: `1px solid ${t.border}`,
              padding: '2rem',
              boxShadow: t.shadowSm,
            }}>
              <h3 style={{
                color: t.textPrimary,
                fontWeight: '700',
                fontSize: '1.125rem',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.01em',
              }}>
                Store Customization
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: t.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.375rem',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Logo URL
                </label>
                <input
                  type="url"
                  value={config?.logoUrl || ''}
                  onChange={(e) => useApp().setConfig({ ...config, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: t.bgSurface,
                    border: `1px solid ${t.border}`,
                    borderRadius: t.borderRadius,
                    color: t.textPrimary,
                    fontSize: '0.9375rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: t.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.375rem',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Cover Image URL (Hero)
                </label>
                <input
                  type="url"
                  value={config?.heroImageUrl || ''}
                  onChange={(e) => useApp().setConfig({ ...config, heroImageUrl: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: t.bgSurface,
                    border: `1px solid ${t.border}`,
                    borderRadius: t.borderRadius,
                    color: t.textPrimary,
                    fontSize: '0.9375rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <p style={{ fontSize: '0.8125rem', color: t.textMuted, fontFamily: 'Inter, sans-serif' }}>
                Changes are saved automatically and applied to your store instantly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Order Table ----
function OrderTable({ orders, t }) {
  return (
    <div style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: t.bgSurface }}>
            {['Order ID', 'Customer', 'Amount', 'Items', 'Date', 'Status'].map((h) => (
              <th key={h} style={{
                padding: '0.75rem 1.25rem',
                textAlign: 'left',
                fontSize: '0.72rem',
                fontWeight: '600',
                color: t.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                fontFamily: 'Inter, sans-serif',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} style={{ borderTop: `1px solid ${t.border}`, backgroundColor: i % 2 === 0 ? 'transparent' : t.bgSurface + '60' }}>
              <td style={{ padding: '0.875rem 1.25rem', color: t.textPrimary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>{o.id}</td>
              <td style={{ padding: '0.875rem 1.25rem', color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>{o.customer}</td>
              <td style={{ padding: '0.875rem 1.25rem', color: t.textPrimary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                ${Number(o.amount || o.total || 0).toFixed(2)}
              </td>
              <td style={{ padding: '0.875rem 1.25rem', color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>
                {o.items?.length || o.items || '—'}
              </td>
              <td style={{ padding: '0.875rem 1.25rem', color: t.textSecondary, fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>{o.date}</td>
              <td style={{ padding: '0.875rem 1.25rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.625rem',
                  borderRadius: '99px',
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: (STATUS_COLORS[o.status] || '#94A3B8') + '20',
                  color: STATUS_COLORS[o.status] || '#94A3B8',
                }}>
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p style={{ padding: '2rem', textAlign: 'center', color: t.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
          No orders yet.
        </p>
      )}
    </div>
  );
}

function ChartCard({ title, t, children }) {
  return (
    <div style={{
      backgroundColor: t.bgCard,
      borderRadius: t.borderRadius,
      border: `1px solid ${t.border}`,
      padding: '1.5rem',
      boxShadow: t.shadowSm,
    }}>
      <h3 style={{
        color: t.textPrimary,
        fontSize: '0.875rem',
        fontWeight: '700',
        marginBottom: '1.25rem',
        fontFamily: 'Inter, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

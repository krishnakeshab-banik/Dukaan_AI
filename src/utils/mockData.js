// =============================================
// MOCK DATA — Products & Orders
// =============================================

const productImages = {
  sneakers: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571945192793-7f6d40e2a9fc?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&auto=format&fit=crop',
  ],
  tech: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&auto=format&fit=crop',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop',
  ],
  jewelry: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9519f94f3d77?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565620731573-37e9f3e3a498?w=600&auto=format&fit=crop',
  ],
  sports: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1434596922112-19c563067271?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616279969965-393a3a2b7ac5?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583241475880-083f84372725?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631214524020-3c69b87f6d6b?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop',
  ],
  books: [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&auto=format&fit=crop',
  ],
  home: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&auto=format&fit=crop',
  ],
};

const defaultProductNames = {
  sneakers: [
    'Air Classic Pro', 'Urban Runner Elite', 'Street Edition V2',
    'Velocity Sprint X', 'Metro Comfort Plus', 'Elite Performance GTX',
    'Shadow Court Low', 'Apex Trail Runner',
  ],
  tech: [
    'Wireless Studio Buds', 'Precision Watch S5', 'Studio Headphones Pro',
    'Compact Speaker One', 'Tactile Keyboard MX', 'Silent Mouse Pro',
    'Ultra Tablet Air', 'Drone Vista 4K',
  ],
  fashion: [
    'Milano Leather Jacket', 'Onyx Aviator Frame', 'Heritage Timepiece',
    'Atlas Canvas Backpack', 'Soho Low-Top', 'Slim Bifold Wallet',
    'Navy Wool Overcoat', 'Linen Resort Shirt',
  ],
  jewelry: [
    'Aria Diamond Pendant', 'Orion Gold Cuff', 'Luna Silver Ring Set',
    'Celestia Pearl Drops', 'Opus Tourbillon Watch', 'Vega Gemstone Pendant',
    'Deco Cocktail Ring', 'Lace Chain Bracelet',
  ],
  sports: [
    'Pro Training Shorts', 'Endurance Running Tee', 'Carbon Fiber Racket',
    'Grip Training Gloves', 'Altitude Hiking Boot', 'Pulse Fitness Band',
    'Core Compression Tights', 'Sprint Track Spike',
  ],
  beauty: [
    'Radiance Serum 30ml', 'Velvet Lip Colour', 'Hydra-Boost Moisturizer',
    'Clear Glow Foundation', 'Midnight Eye Palette', 'Rose Facial Mist',
    'Satin Finish Powder', 'Noir Eau de Parfum',
  ],
  books: [
    'The Quiet Design', 'Architecture of Thought', 'Letters to the Future',
    'Maps of the Unknown', 'The Art of Nothing', 'Fragments & Forms',
    'An Ocean of Data', 'The Last Cartographer',
  ],
  home: [
    'Walnut Coffee Table', 'Nordic Floor Lamp', 'Linen Throw Blanket',
    'Marble Serving Board', 'Woven Cotton Rug', 'Ceramic Planter Set',
    'Mesh Storage Cabinet', 'Oak Accent Chair',
  ],
};

const defaultPrices = {
  sneakers: [129, 149, 139, 159, 119, 179, 135, 145],
  tech: [199, 399, 299, 149, 179, 79, 649, 799],
  fashion: [249, 189, 449, 159, 99, 129, 310, 85],
  jewelry: [899, 549, 299, 399, 1299, 649, 420, 280],
  sports: [59, 45, 189, 79, 159, 99, 69, 149],
  beauty: [68, 38, 52, 44, 72, 34, 40, 95],
  books: [24, 32, 19, 28, 22, 35, 26, 30],
  home: [450, 280, 85, 62, 140, 95, 380, 620],
};

export const generateMockProducts = (category, customNames = null) => {
  const images = productImages[category] || productImages.fashion;
  const names = customNames || defaultProductNames[category] || defaultProductNames.fashion;
  const prices = defaultPrices[category] || defaultPrices.fashion;

  return images.map((image, i) => ({
    id: i + 1,
    name: names[i] || `Product ${i + 1}`,
    price: prices[i] || 99,
    image,
    category,
    stock: Math.floor(Math.random() * 50) + 5,
    rating: (3.8 + Math.random() * 1.2).toFixed(1),
    reviews: Math.floor(Math.random() * 200) + 20,
  }));
};

export const generateMockOrders = () => {
  const statuses = ['Delivered', 'Shipped', 'Processing', 'Delivered', 'Delivered'];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    customer: ['Alex Morgan', 'Jamie Lee', 'Sam Rivera', 'Jordan Kim', 'Taylor Brooks',
      'Casey Patel', 'Morgan Wei', 'Avery Chen'][i],
    amount: Math.floor(Math.random() * 400) + 80,
    status: statuses[i % statuses.length],
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 2).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }),
    items: Math.floor(Math.random() * 3) + 1,
  }));
};

export const generateRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const base = 4000;
  return {
    labels: months,
    data: months.map((_, i) =>
      Math.floor(base + Math.sin(i * 0.5) * 1200 + i * 350 + Math.random() * 800)
    ),
  };
};

export const generateOrdersData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    labels: days,
    data: days.map(() => Math.floor(Math.random() * 60) + 20),
  };
};

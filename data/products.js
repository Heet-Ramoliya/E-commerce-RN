// Mock product data
const products = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Experience premium sound quality with our wireless headphones. Features noise cancellation technology, 30-hour battery life, and comfortable over-ear design.',
    rating: 4.8,
    reviewCount: 245,
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Premium sound quality',
      'Comfortable over-ear design',
      'Bluetooth 5.0 connectivity'
    ],
    colors: ['Black', 'White', 'Blue'],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    category: 'Wearables',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Track your fitness goals with our advanced smart watch. Monitors heart rate, steps, sleep quality, and more. Water-resistant and includes a 7-day battery life.',
    rating: 4.6,
    reviewCount: 189,
    features: [
      'Heart rate monitoring',
      'Sleep tracking',
      'Water resistance (50m)',
      '7-day battery life',
      'Smart notifications'
    ],
    colors: ['Black', 'Silver', 'Rose Gold'],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Ultra HD Smart TV - 55"',
    price: 699.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/5552789/pexels-photo-5552789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Transform your living room with our 55" Ultra HD Smart TV. Features vibrant colors, sharp contrast, and seamless streaming capabilities.',
    rating: 4.5,
    reviewCount: 156,
    features: [
      '4K Ultra HD resolution',
      'Smart TV capabilities',
      'Multiple HDMI inputs',
      'Dolby Vision HDR',
      'Voice control compatibility'
    ],
    colors: ['Black'],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: '4',
    name: 'Professional Camera Kit',
    price: 1299.99,
    category: 'Photography',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Capture stunning photos and videos with our professional camera kit. Includes camera body, two lenses, tripod, and carrying case.',
    rating: 4.9,
    reviewCount: 87,
    features: [
      '24.2MP sensor',
      '4K video recording',
      'Dual lens kit included',
      'Weather-sealed body',
      'Advanced autofocus system'
    ],
    colors: ['Black'],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: '5',
    name: 'Ergonomic Office Chair',
    price: 249.99,
    category: 'Furniture',
    image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Stay comfortable during long work sessions with our ergonomic office chair. Features adjustable height, lumbar support, and breathable mesh back.',
    rating: 4.4,
    reviewCount: 112,
    features: [
      'Adjustable height and armrests',
      'Lumbar support',
      'Breathable mesh back',
      '360° swivel',
      'High-quality wheels'
    ],
    colors: ['Black', 'Gray', 'Blue'],
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: '6',
    name: 'Premium Coffee Maker',
    price: 179.99,
    category: 'Kitchen',
    image: 'https://images.pexels.com/photos/9436715/pexels-photo-9436715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Brew perfect coffee every morning with our premium coffee maker. Features customizable brewing strength, timer, and thermal carafe to keep coffee hot for hours.',
    rating: 4.7,
    reviewCount: 133,
    features: [
      'Programmable timer',
      'Adjustable brewing strength',
      'Thermal carafe',
      'Water filtration system',
      'Auto-shutoff feature'
    ],
    colors: ['Silver', 'Black'],
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  {
    id: '7',
    name: 'Designer Leather Backpack',
    price: 149.99,
    category: 'Fashion',
    image: 'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Carry your essentials in style with our designer leather backpack. Features multiple compartments, padded laptop sleeve, and durable construction.',
    rating: 4.6,
    reviewCount: 98,
    features: [
      'Genuine leather construction',
      'Padded laptop sleeve (fits up to 15")',
      'Multiple compartments',
      'Water-resistant finish',
      'Adjustable straps'
    ],
    colors: ['Brown', 'Black', 'Tan'],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: '8',
    name: 'Smart Home Security System',
    price: 399.99,
    category: 'Smart Home',
    image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Protect your home with our comprehensive smart security system. Includes motion sensors, cameras, door/window sensors, and smartphone app control.',
    rating: 4.8,
    reviewCount: 76,
    features: [
      'Motion detection',
      'HD security cameras',
      'Door/window sensors',
      'Smartphone app control',
      '24/7 monitoring option'
    ],
    colors: ['White'],
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  {
    id: '9',
    name: 'Wireless Earbuds',
    price: 129.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Experience freedom with our wireless earbuds. Features crystal-clear sound, comfortable fit, and 24-hour battery life with the charging case.',
    rating: 4.5,
    reviewCount: 211,
    features: [
      'True wireless design',
      'Noise isolation',
      '24-hour battery with case',
      'Water-resistant',
      'Touch controls'
    ],
    colors: ['White', 'Black', 'Blue'],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: '10',
    name: 'Professional Blender',
    price: 199.99,
    category: 'Kitchen',
    image: 'https://images.pexels.com/photos/1395325/pexels-photo-1395325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Create delicious smoothies, soups, and more with our powerful professional-grade blender. Features multiple speed settings, pulse function, and durable construction.',
    rating: 4.7,
    reviewCount: 89,
    features: [
      '1500-watt motor',
      'Multiple speed settings',
      'Pre-programmed settings',
      'Dishwasher-safe components',
      'BPA-free materials'
    ],
    colors: ['Silver', 'Black'],
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: '11',
    name: 'Stylish Sunglasses',
    price: 129.99,
    category: 'Fashion',
    image: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Protect your eyes with our stylish sunglasses. Features UV protection, polarized lenses, and durable frames.',
    rating: 4.4,
    reviewCount: 67,
    features: [
      'UV400 protection',
      'Polarized lenses',
      'Lightweight frames',
      'Scratch-resistant coating',
      'Includes carrying case'
    ],
    colors: ['Black', 'Tortoise', 'Gold'],
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  {
    id: '12',
    name: 'Smart Robot Vacuum',
    price: 349.99,
    category: 'Smart Home',
    image: 'https://images.pexels.com/photos/844874/pexels-photo-844874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'Keep your floors clean effortlessly with our smart robot vacuum. Features mapping technology, scheduled cleaning, and app control.',
    rating: 4.6,
    reviewCount: 142,
    features: [
      'Smart mapping technology',
      'Scheduled cleaning',
      'App control',
      'HEPA filtration',
      'Self-charging'
    ],
    colors: ['Black', 'White'],
    inStock: true,
    isNew: false,
    isFeatured: true
  }
];

export const getProducts = () => products;

export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = () => {
  return products.filter(product => product.isFeatured);
};

export const getNewProducts = () => {
  return products.filter(product => product.isNew);
};

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

export const searchProducts = (query) => {
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(
    product => 
      product.name.toLowerCase().includes(lowerCaseQuery) || 
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
  );
};

export const getCategories = () => {
  const categoriesSet = new Set(products.map(product => product.category));
  return Array.from(categoriesSet);
};
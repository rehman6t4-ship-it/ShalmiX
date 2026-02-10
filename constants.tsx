
import { Category, Product, Order } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: 'cat-1', 
    name: 'Fashion & Textiles', 
    icon: 'Shirt',
    subcategories: [
      { 
        id: 'sub-1-1', name: 'Mens Fashion', 
        microCategories: [
          { id: 'mic-1-1-1', name: 'Kurtas & Shalwar' },
          { id: 'mic-1-1-2', name: 'T-Shirts' },
          { id: 'mic-1-1-3', name: 'Denim Jeans' }
        ] 
      },
      { 
        id: 'sub-1-2', name: 'Womens Fashion', 
        microCategories: [
          { id: 'mic-1-2-1', name: 'Unstitched Lawn' },
          { id: 'mic-1-2-2', name: 'Abayas' }
        ] 
      }
    ]
  },
  { 
    id: 'cat-2', 
    name: 'Electronics', 
    icon: 'Zap',
    subcategories: [
      { 
        id: 'sub-2-1', name: 'Home Appliances', 
        microCategories: [
          { id: 'mic-2-1-1', name: 'Blenders & Grinders' },
          { id: 'mic-2-1-2', name: 'Steam Irons' }
        ] 
      }
    ]
  },
  {
    id: 'cat-3',
    name: 'Mobile & Accessories',
    icon: 'Smartphone',
    subcategories: [
      {
        id: 'sub-3-1', name: 'Charging',
        microCategories: [
          { id: 'mic-3-1-1', name: 'Data Cables' },
          { id: 'mic-3-1-2', name: 'Adapters' }
        ]
      }
    ]
  },
  {
    id: 'cat-4',
    name: 'Home & Kitchen',
    icon: 'Home',
    subcategories: [
      {
        id: 'sub-4-1', name: 'Cookware',
        microCategories: [
          { id: 'mic-4-1-1', name: 'Non-stick Pans' },
          { id: 'mic-4-1-2', name: 'Steel Pots' }
        ]
      }
    ]
  },
  {
    id: 'cat-5',
    name: 'Jewelry & Cosmetics',
    icon: 'Sparkles',
    subcategories: [
      {
        id: 'sub-5-1', name: 'Artificial Jewelry',
        microCategories: [
          { id: 'mic-5-1-1', name: 'Bridal Sets' },
          { id: 'mic-5-1-2', name: 'Bangles' }
        ]
      }
    ]
  },
  {
    id: 'cat-6',
    name: 'Stationery & Toys',
    icon: 'Book',
    subcategories: [
      {
        id: 'sub-6-1', name: 'Office Supplies',
        microCategories: [
          { id: 'mic-6-1-1', name: 'Registers' },
          { id: 'mic-6-1-2', name: 'Bulk Pens' }
        ]
      }
    ]
  },
  {
    id: 'cat-7',
    name: 'Hardware & Tools',
    icon: 'Hammer',
    subcategories: [
      { id: 'sub-7-1', name: 'Hand Tools', microCategories: [{ id: 'mic-7-1-1', name: 'Wrench Sets' }] }
    ]
  },
  {
    id: 'cat-8',
    name: 'Auto Parts',
    icon: 'Car',
    subcategories: [
      { id: 'sub-8-1', name: 'Bike Accessories', microCategories: [{ id: 'mic-8-1-1', name: 'Helmets' }] }
    ]
  },
  {
    id: 'cat-9',
    name: 'Spices & Dry Fruits',
    icon: 'Apple',
    subcategories: [
      { id: 'sub-9-1', name: 'Wholesale Spices', microCategories: [{ id: 'mic-9-1-1', name: 'Red Chilli Powder' }] }
    ]
  },
  {
    id: 'cat-10',
    name: 'Sanitary & Bath',
    icon: 'Droplets',
    subcategories: [
      { id: 'sub-10-1', name: 'Faucets', microCategories: [{ id: 'mic-10-1-1', name: 'Mixer Taps' }] }
    ]
  },
  {
    id: 'cat-11',
    name: 'Lighting & Electrical',
    icon: 'Lightbulb',
    subcategories: [
      { id: 'sub-11-1', name: 'LED Solutions', microCategories: [{ id: 'mic-11-1-1', name: 'SMD Panels' }] }
    ]
  },
  {
    id: 'cat-12',
    name: 'Bags & Luggage',
    icon: 'Briefcase',
    subcategories: [
      { id: 'sub-12-1', name: 'Travel Bags', microCategories: [{ id: 'mic-12-1-1', name: 'Trolley Bags' }] }
    ]
  },
  {
    id: 'cat-13',
    name: 'Footwear',
    icon: 'Footprints',
    subcategories: [
      { id: 'sub-13-1', name: 'Mens Shoes', microCategories: [{ id: 'mic-13-1-1', name: 'Peshawari Chappal' }] }
    ]
  },
  {
    id: 'cat-14',
    name: 'Medical Supplies',
    icon: 'Activity',
    subcategories: [
      { id: 'sub-14-1', name: 'First Aid', microCategories: [{ id: 'mic-14-1-1', name: 'Surgical Masks' }] }
    ]
  },
  {
    id: 'cat-15',
    name: 'Sports & Fitness',
    icon: 'Dumbbell',
    subcategories: [
      { id: 'sub-15-1', name: 'Cricket Gear', microCategories: [{ id: 'mic-15-1-1', name: 'Hardball Bats' }] }
    ]
  }
];

export const THRIFT_PRODUCTS: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `thrift-${i}`,
  name: [
    'Vintage Denim Jacket', 'Retro Polaroid Camera', 'Used Leather Boots', 
    'Second-hand Silk Scarf', 'Antique Brass Lamp', 'Old Records Collection',
    'Used Smart Watch', 'Refurbished Keyboard', 'Vintage Handbag', 'Classic Sun-glasses'
  ][i % 10] || `Pre-loved Item ${i+1}`,
  price: Math.floor(Math.random() * 1500) + 500,
  image: `https://picsum.photos/seed/thrift${i}/400/400`,
  category: 'cat-1',
  seller: `Thrift Corner ${i}`,
  rating: 4.8,
  bulkAvailable: false,
  isVerified: true
}));

export const WHOLESALE_HUB_PRODUCTS: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `wholesale-${i}`,
  name: [
    'Cotton Yarn (Master Case)', 'Bulk USB Cables (Box of 50)', 'Industrial Spices (10kg)', 
    'Wholesale Lawn Suits (Set of 10)', 'Bulk Mobile Chargers', 'LED Bulbs (Carton of 24)',
    'Master Box T-Shirts', 'Steel Utensils (Wholesale Pack)', 'Bulk Grocery Sacks', 'Refined Oil (Tin of 5)'
  ][i % 10] || `Bulk Supply ${i+1}`,
  price: Math.floor(Math.random() * 50000) + 5000,
  wholesalePrice: Math.floor(Math.random() * 45000) + 4000,
  moq: 12,
  image: `https://picsum.photos/seed/bulk${i}/400/400`,
  category: i % 2 === 0 ? 'cat-1' : 'cat-2',
  seller: `Shahalmi Master Trader ${i}`,
  rating: 4.9,
  bulkAvailable: true,
  isVerified: true
}));

const generateMainProducts = () => {
  const products: Product[] = [];
  const names = ['Lawn Suit', 'Charging Cable', 'Kitchen Set', 'Men Kurta', 'Power Bank'];
  for (let i = 1; i <= 15; i++) {
    products.push({
      id: `main-${i}`,
      name: `${names[i % 5]} Standard Edition ${i}`,
      price: Math.floor(Math.random() * 5000) + 1000,
      image: `https://picsum.photos/seed/main${i}/400/400`,
      category: i % 2 === 0 ? 'cat-1' : 'cat-2',
      seller: `Retail Shop ${i}`,
      rating: 4.5,
      isVerified: true,
      bulkAvailable: Math.random() > 0.5
    });
  }
  return products;
};

export const MOCK_PRODUCTS: Product[] = generateMainProducts();
export const MOCK_ORDERS: Order[] = [];


export enum UserRole {
  BUYER = 'BUYER',
  WHOLESALER = 'WHOLESALER',
  RETAIL_SELLER = 'RETAIL_SELLER',
  ADMIN = 'ADMIN'
}

export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  price: number;
  wholesalePrice?: number;
  moq?: number;
  image: string;
  category: string;
  subcategory?: string;
  microcategory?: string;
  seller: string;
  rating: number;
  isVerified?: boolean;
  bulkAvailable?: boolean;
}

export interface SellerProfile {
  name: string;
  logo: string;
  banner: string;
  rating: number;
  followers: number;
  joinedDate: string;
  location: string;
  isVerified: boolean;
  description: string;
  specialization: string;
}

export interface MicroCategory {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
  microCategories: MicroCategory[];
}

export interface Category {
  id: string;
  name: string;
  nameUrdu?: string;
  icon: string;
  subcategories: SubCategory[];
}

export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  type: 'Retail' | 'Wholesale';
}

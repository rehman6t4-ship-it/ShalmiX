
import { Product, Order, UserRole } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from './constants';

const DB_KEYS = {
  PRODUCTS: 'shahalmix_products',
  ORDERS: 'shahalmix_orders',
  CART: 'shahalmix_cart'
};

export const initDB = () => {
  if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem(DB_KEYS.ORDERS)) {
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
  }
};

export const db = {
  products: {
    getAll: (): Product[] => JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]'),
    add: (product: Product) => {
      const products = db.products.getAll();
      products.unshift(product);
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    },
    delete: (id: string) => {
      const products = db.products.getAll().filter(p => p.id !== id);
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    }
  },
  orders: {
    getAll: (): Order[] => JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]'),
    create: (order: Order) => {
      const orders = db.orders.getAll();
      orders.unshift(order);
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    }
  },
  cart: {
    get: (): Product[] => JSON.parse(localStorage.getItem(DB_KEYS.CART) || '[]'),
    set: (cart: Product[]) => localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart)),
    clear: () => localStorage.removeItem(DB_KEYS.CART)
  }
};

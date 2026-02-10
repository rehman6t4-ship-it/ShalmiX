
import React, { useState, useEffect } from 'react';
import { UserRole, Product, Order } from './types';
import RoleSelector from './components/RoleSelector';
import { MobileBottomNav, Sidebar } from './components/Navigation';
import BuyerView from './views/BuyerView';
import WholesalerView from './views/WholesalerView';
import { Bell, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { initDB, db } from './db';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [cart, setCart] = useState<Product[]>([]);
  const [dbVersion, setDbVersion] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    initDB();
    setCart(db.cart.get());
  }, []);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleAddToCart = (product: Product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    db.cart.set(newCart);
    notify(`${product.name} added to cart!`, 'success');
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    db.cart.set(newCart);
    notify('Item removed from cart', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
    db.cart.clear();
    notify('Cart cleared', 'info');
  };

  const handleOrderPlaced = () => {
    if (cart.length === 0) {
      notify('Your cart is empty!', 'error');
      return;
    }

    const total = cart.reduce((acc, p) => acc + p.price, 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: 'Guest User',
      amount: total,
      status: 'Pending',
      date: new Date().toISOString(),
      type: cart.some(p => p.bulkAvailable) ? 'Wholesale' : 'Retail'
    };

    db.orders.create(newOrder);
    handleClearCart();
    setCurrentTab('home');
    setDbVersion(v => v + 1);
    notify('Order placed successfully! Check your profile for status.', 'success');
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setCurrentTab('home');
    notify(`Switched to ${selectedRole.replace('_', ' ')} mode`, 'info');
  };

  if (!role) {
    return <RoleSelector onSelect={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast Notifications */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-sm px-4">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`flex items-center justify-between p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-top-4 fade-in duration-300 ${
              n.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
              n.type === 'error' ? 'bg-rose-600 border-rose-500 text-white' :
              'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {n.type === 'success' && <CheckCircle2 size={20} />}
              {n.type === 'error' && <AlertCircle size={20} />}
              {n.type === 'info' && <Info size={20} />}
              <p className="text-sm font-bold">{n.message}</p>
            </div>
            <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <Sidebar 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        role={role} 
        onSwitchRole={() => setRole(null)} 
      />

      <main className={`md:ml-20 transition-all duration-300 min-h-screen pb-20 md:pb-0`}>
        {role === UserRole.BUYER || role === UserRole.RETAIL_SELLER ? (
          <BuyerView 
            activeTab={currentTab}
            setTab={setCurrentTab}
            onBackToRoles={() => setRole(null)}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onOrderPlaced={handleOrderPlaced}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 pt-10">
            <WholesalerView 
              onDataChanged={() => setDbVersion(v => v + 1)} 
              notify={notify}
            />
          </div>
        )}
      </main>

      <MobileBottomNav 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        role={role}
        onSwitchRole={() => setRole(null)}
      />
    </div>
  );
};

export default App;

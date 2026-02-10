
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Package, TrendingUp, Users, DollarSign, Clock, CheckCircle2, MoreVertical, Plus, Sparkles, X, Loader2, MessageCircle, PieChart, Settings, ShoppingBag } from 'lucide-react';
import { db } from '../db';
// Added missing import for CATEGORIES from constants
import { CATEGORIES } from '../constants';
import { SectionHeader, ApiPlaceholder } from '../components/SharedUI';
import { generateProductDescription, getBusinessAdvice } from '../ai';
import { Product } from '../types';

interface Props {
  onDataChanged: () => void;
  notify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const NavTile: React.FC<{ icon: any; label: string; urdu: string; color: string; onClick: () => void }> = ({ icon: Icon, label, urdu, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group active:scale-95"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
      <Icon size={28} />
    </div>
    <div className="text-center">
      <p className="text-[10px] font-black text-slate-400 uppercase leading-none">{label}</p>
      <p className="urdu text-sm font-bold text-slate-700 mt-1 leading-none">{urdu}</p>
    </div>
  </button>
);

const WholesalerView: React.FC<Props> = ({ onDataChanged, notify }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Electronics' });

  const orders = db.orders.getAll();
  const products = db.products.getAll();
  const totalSales = orders.reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    { label: 'Total Sales', value: `PKR ${totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Active Products', value: products.length.toString(), icon: Package, color: 'text-blue-600' },
    { label: 'Total Orders', value: orders.length.toString(), icon: Clock, color: 'text-amber-600' },
    { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-rose-600' },
  ];

  const handleAiAdvice = async () => {
    setIsAiLoading(true);
    notify('Gemini is analyzing your market data...', 'info');
    const advice = await getBusinessAdvice({ totalSales, orderCount: orders.length });
    setAiAdvice(advice);
    setIsAiLoading(false);
    notify('Strategy report ready!', 'success');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiLoading(true);
    
    const product: Product = {
      id: 'p-' + Date.now(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      image: `https://picsum.photos/seed/${newProduct.name}/400/400`,
      category: newProduct.category,
      seller: 'Zafar Bhai Wholesale',
      rating: 5.0,
      isVerified: true,
      bulkAvailable: true
    };

    db.products.add(product);
    onDataChanged();
    setShowAddModal(false);
    setIsAiLoading(false);
    notify(`${newProduct.name} is now live in the market!`, 'success');
    setNewProduct({ name: '', price: '', category: 'Electronics' });
  };

  const handleTileClick = (label: string) => {
    notify(`${label} module is updating. Feature coming in v1.1`, 'info');
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">Assalam-o-Alaikum, <span className="text-emerald-600">Zafar Bhai!</span></h1>
          <p className="text-slate-500 font-medium">Your store at Shahalmi Market is trending today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAiAdvice} 
            disabled={isAiLoading}
            className="bg-slate-900 text-white px-6 py-4 rounded-3xl font-bold flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="text-amber-400" />} Advisor
          </button>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-emerald-600 text-white px-6 py-4 rounded-3xl font-bold flex items-center gap-2 active:scale-95 shadow-lg shadow-emerald-100"
          >
            <Plus size={24} /> List Product
          </button>
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <NavTile icon={ShoppingBag} label="Inventory" urdu="اسٹاک مینجمنٹ" color="bg-emerald-500" onClick={() => handleTileClick('Inventory')} />
        <NavTile icon={MessageCircle} label="Inquiries" urdu="گاہک کے پیغامات" color="bg-amber-500" onClick={() => handleTileClick('Inquiries')} />
        <NavTile icon={PieChart} label="Analytics" urdu="کاروباری رپورٹس" color="bg-blue-500" onClick={() => handleTileClick('Analytics')} />
        <NavTile icon={Users} label="Bulk Leads" urdu="بڑے آرڈرز" color="bg-purple-500" onClick={() => handleTileClick('Bulk Leads')} />
        <NavTile icon={Settings} label="Settings" urdu="ترتیبات" color="bg-slate-700" onClick={() => handleTileClick('Settings')} />
      </section>

      {aiAdvice && (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-[40px] relative shadow-sm animate-in slide-in-from-top-4">
          <button onClick={() => setAiAdvice(null)} className="absolute top-6 right-6 text-amber-900/40 hover:text-amber-900"><X size={24}/></button>
          <div className="flex items-start gap-4">
             <div className="bg-amber-100 p-3 rounded-2xl text-amber-700 mt-1">
                <Sparkles size={24} />
             </div>
             <p className="text-amber-800 text-lg font-medium leading-relaxed">{aiAdvice}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <stat.icon size={28} className={stat.color} />
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black">Recent Orders Activity</h3>
          <button className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline active:scale-95">View Ledger</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-10 py-5">Order ID</th>
                <th className="px-10 py-5">Buyer Name</th>
                <th className="px-10 py-5">Amount</th>
                <th className="px-10 py-5">Sourcing Type</th>
                <th className="px-10 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold">No recent orders yet. Items you list will appear in the market feed.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-10 py-6 text-xs font-black text-slate-400 group-hover:text-emerald-600">#{o.id}</td>
                    <td className="px-10 py-6 font-black text-slate-700">{o.customerName}</td>
                    <td className="px-10 py-6 font-black text-emerald-700">Rs {o.amount.toLocaleString()}</td>
                    <td className="px-10 py-6 font-bold text-slate-400 text-xs">{o.type}</td>
                    <td className="px-10 py-6">
                      <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black">{o.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] p-10 shadow-2xl space-y-8 relative animate-in zoom-in-95">
             <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl active:scale-90 transition-all"><X size={24}/></button>
             <div>
                <h3 className="text-2xl font-black">List New Product</h3>
                <p className="text-slate-400 text-sm mt-1">This item will be visible to all Buyers in the market.</p>
             </div>
             <form onSubmit={handleAddProduct} className="space-y-6">
               <div className="space-y-4">
                  <input 
                    required 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                    className="w-full p-5 bg-slate-100 border-2 border-transparent focus:border-emerald-500 rounded-3xl font-bold transition-all outline-none" 
                    placeholder="Product Name (e.g. Master Box Cables)" 
                  />
                  <input 
                    required 
                    type="number" 
                    value={newProduct.price} 
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                    className="w-full p-5 bg-slate-100 border-2 border-transparent focus:border-emerald-500 rounded-3xl font-bold transition-all outline-none" 
                    placeholder="Unit Price (PKR)" 
                  />
                  <select 
                    className="w-full p-5 bg-slate-100 border-2 border-transparent focus:border-emerald-500 rounded-3xl font-bold transition-all outline-none"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
               </div>
               <button 
                 disabled={isAiLoading} 
                 type="submit" 
                 className="w-full bg-emerald-600 text-white p-6 rounded-[32px] font-black text-xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 active:scale-95 transition-all disabled:opacity-50"
               >
                 {isAiLoading ? "Syncing..." : "Publish to Feed"}
               </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WholesalerView;

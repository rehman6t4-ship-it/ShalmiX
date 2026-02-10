
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, MapPin, Star, Package, Building2, ShieldCheck, ShoppingCart, 
  CheckCircle2, X, ChevronRight, User, Bell, Trash2, Send, 
  Filter, ChevronDown, ListFilter, LayoutGrid, CreditCard, Truck, Wallet, 
  Store, Settings, Clock, Info, Plus, Minus, TrendingUp, 
  History, Sparkles, Recycle, Home, PhoneCall, ChevronLeft, LocateFixed,
  Shirt, Zap, Smartphone, Book, Hammer, Car, Apple, Droplets, Lightbulb, Briefcase, Footprints, Activity, Dumbbell,
  ArrowUpNarrowWide, ArrowDownWideNarrow, MessageCircle, Share2, Users
} from 'lucide-react';
import { db } from '../db';
import { CATEGORIES, THRIFT_PRODUCTS, WHOLESALE_HUB_PRODUCTS, MOCK_PRODUCTS } from '../constants';
import { Badge } from '../components/SharedUI';
import { Product, SellerProfile } from '../types';

interface Props {
  onOrderPlaced: () => void;
  activeTab?: string;
  setTab?: (tab: string) => void;
  onBackToRoles?: () => void;
  cart: Product[];
  onAddToCart: (p: Product) => void;
  onRemoveFromCart: (i: number) => void;
  onClearCart: () => void;
  // Note: Parent component (App.tsx) handles notifications, but we can call handleActionSuccess locally
}

const iconMap: Record<string, any> = {
  Shirt, Zap, Smartphone, Home, Sparkles, Book, Hammer, Car, Apple, Droplets, Lightbulb, Briefcase, Footprints, Activity, Dumbbell
};

const ProductCard: React.FC<{ product: Product; onClick: (p: Product) => void; onSellerClick: (sellerName: string) => void }> = ({ product, onClick, onSellerClick }) => (
  <div
    className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer h-full flex flex-col active:scale-[0.98]"
  >
    <div onClick={() => onClick(product)} className="relative aspect-square overflow-hidden bg-slate-50">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {product.bulkAvailable && <div className="bg-amber-400 text-amber-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase shadow-sm">Bulk</div>}
        {product.isVerified && <div className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase shadow-sm">Verified</div>}
      </div>
    </div>
    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
      <div onClick={() => onClick(product)}>
        <h3 className="text-xs font-medium text-slate-800 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1 text-amber-500 text-[10px] mt-1 font-bold">
          <Star size={10} fill="currentColor" />
          <span>{product.rating}</span>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1" onClick={() => onClick(product)}>
          <span className="text-[10px] font-bold text-emerald-700">Rs.</span>
          <span className="text-base font-black text-emerald-700">{product.price.toLocaleString()}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onSellerClick(product.seller); }}
          className="text-[9px] text-slate-400 mt-0.5 truncate hover:text-emerald-600 transition-colors flex items-center gap-1 w-full text-left"
        >
          <Store size={10} /> {product.seller}
        </button>
      </div>
    </div>
  </div>
);

const BuyerView: React.FC<Props> = ({ 
  onOrderPlaced, activeTab = 'home', setTab, onBackToRoles, 
  cart, onAddToCart, onRemoveFromCart, onClearCart 
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [marketType, setMarketType] = useState<'all' | 'wholesale' | 'thrift'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<'best' | 'price_low' | 'price_high' | 'newest'>('best');
  const [followedSellers, setFollowedSellers] = useState<Set<string>>(new Set());

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(CATEGORIES[0].id);

  const allAvailableProducts = useMemo(() => {
    const fromDB = db.products.getAll();
    return [...fromDB, ...MOCK_PRODUCTS, ...WHOLESALE_HUB_PRODUCTS, ...THRIFT_PRODUCTS];
  }, []);

  const filteredProducts = useMemo(() => {
    let result = allAvailableProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.seller.toLowerCase().includes(searchQuery.toLowerCase());
      
      const numMin = minPrice === '' ? 0 : parseInt(minPrice);
      const numMax = maxPrice === '' ? Infinity : parseInt(maxPrice);
      const matchesPrice = p.price >= numMin && p.price <= numMax;
      
      const matchesMarket = marketType === 'all' || 
                           (marketType === 'wholesale' && p.bulkAvailable) ||
                           (marketType === 'thrift' && p.id.startsWith('thrift'));
      
      const matchesRating = p.rating >= minRating;
      const matchesVerified = !onlyVerified || p.isVerified;

      return matchesSearch && matchesPrice && matchesMarket && matchesRating && matchesVerified;
    });

    if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') result.sort((a, b) => b.id.localeCompare(a.id));

    return result;
  }, [allAvailableProducts, searchQuery, minPrice, maxPrice, marketType, minRating, onlyVerified, sortBy]);

  const sellerProfile = useMemo((): SellerProfile | null => {
    if (!selectedSeller) return null;
    return {
      name: selectedSeller,
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedSeller)}&background=059669&color=fff&size=128`,
      banner: `https://picsum.photos/seed/${selectedSeller}/1200/400`,
      rating: 4.9,
      followers: 1240,
      joinedDate: 'Jan 2022',
      location: 'Shahalmi Gate, Block B',
      isVerified: true,
      description: 'The largest importer of wholesale electronics and textiles in the historic Shahalmi Market. We pride ourselves on authentic quality and bulk-ready inventory for retailers across Pakistan.',
      specialization: 'Electronics & Textiles'
    };
  }, [selectedSeller]);

  const sellerProducts = useMemo(() => {
    if (!selectedSeller) return [];
    return allAvailableProducts.filter(p => p.seller === selectedSeller);
  }, [selectedSeller, allAvailableProducts]);

  const handleBack = () => {
    if (selectedSeller) {
      setSelectedSeller(null);
    } else if (activeTab !== 'home') {
      if (setTab) setTab('home');
    } else {
      if (onBackToRoles) onBackToRoles();
    }
  };

  const handleFollowSeller = (name: string) => {
    setFollowedSellers(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'ShahalmiX Marketplace',
        text: `Check out ${title} on ShahalmiX - Pakistan's Digital Wholesale Hub!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-emerald-900 rounded-[32px] p-4 md:px-8 md:py-6 relative overflow-hidden desi-pattern shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-white text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              Shahalmi<span className="text-amber-400">X</span> Choice
              <Sparkles className="text-amber-400" size={20} />
            </h2>
            <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest mt-1">Direct from the heart of Lahore</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 bg-black/20 p-1.5 rounded-2xl backdrop-blur-sm">
            {[
              { id: 'all', icon: Home, label: 'All Items' },
              { id: 'wholesale', icon: Building2, label: 'Wholesale' },
              { id: 'thrift', icon: Recycle, label: 'Thrift' }
            ].map((btn) => (
              <button 
                key={btn.id}
                onClick={() => setMarketType(btn.id as any)} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${marketType === btn.id ? 'bg-white text-emerald-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
              >
                <btn.icon size={14} /> {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 p-3 rounded-2xl flex items-center justify-between shadow-sm sticky top-[72px] md:top-[88px] z-40 overflow-x-auto gap-4 scrollbar-hide">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-600 transition-colors border border-slate-200 active:scale-95"
          >
            <ListFilter size={16} /> Filters
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <div className="flex items-center gap-1">
             {[
               { id: 'best', label: 'Best Match' },
               { id: 'price_low', label: 'Price Low' },
               { id: 'price_high', label: 'Price High' }
             ].map(opt => (
               <button 
                key={opt.id}
                onClick={() => setSortBy(opt.id as any)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all active:scale-95 ${sortBy === opt.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {opt.label}
               </button>
             ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-black text-slate-400">
           <span>{filteredProducts.length} items found</span>
        </div>
      </div>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onClick={setSelectedProduct} onSellerClick={setSelectedSeller} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-slate-400 font-bold">Oops! No products match your criteria.</p>
              <button 
                onClick={() => { setMinPrice(''); setMaxPrice(''); setMinRating(0); setOnlyVerified(false); }}
                className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderSellerProfile = () => {
    if (!sellerProfile) return null;
    const isFollowing = followedSellers.has(sellerProfile.name);
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="relative">
          <div className="h-48 md:h-72 w-full rounded-[40px] overflow-hidden bg-emerald-900 desi-pattern shadow-inner border border-emerald-800">
            <img src={sellerProfile.banner} className="w-full h-full object-cover opacity-60" />
          </div>
          <div className="absolute -bottom-12 left-8 md:left-16 flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-24 h-24 md:w-40 md:h-40 bg-white p-2 rounded-[32px] shadow-2xl border border-slate-100">
              <img src={sellerProfile.logo} className="w-full h-full rounded-[24px] object-cover" />
            </div>
            <div className="pb-4 space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{sellerProfile.name}</h2>
                {sellerProfile.isVerified && (
                  <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </div>
              <p className="text-emerald-600 font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} /> {sellerProfile.location} • {sellerProfile.specialization}
              </p>
            </div>
          </div>
          <div className="absolute bottom-4 right-8 flex gap-3">
             <button 
                onClick={() => handleShare(sellerProfile.name)}
                className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-slate-600 hover:bg-white shadow-sm transition-all active:scale-90"
             >
                <Share2 size={20}/>
             </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 pt-12">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Rating</span>
                    <span className="text-amber-500 flex items-center gap-1"><Star size={14} fill="currentColor"/> {sellerProfile.rating}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Followers</span>
                    <span className="text-slate-900 flex items-center gap-1"><Users size={14}/> {(sellerProfile.followers + (isFollowing ? 1 : 0)).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Joined</span>
                    <span className="text-slate-900">{sellerProfile.joinedDate}</span>
                 </div>
              </div>
              
              <div className="space-y-3">
                 <button onClick={() => setTab && setTab('chat')} className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                   <MessageCircle size={20} /> Negotiate
                 </button>
                 <button 
                    onClick={() => handleFollowSeller(sellerProfile.name)}
                    className={`w-full p-5 rounded-2xl font-black transition-all active:scale-95 ${isFollowing ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                 >
                   {isFollowing ? 'Unfollow Shop' : 'Follow Shop'}
                 </button>
              </div>
            </div>

            <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100">
               <h4 className="font-black text-emerald-900 text-sm uppercase tracking-widest mb-4">About Seller</h4>
               <p className="text-emerald-800 text-sm leading-relaxed font-medium">{sellerProfile.description}</p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Catalogue ({sellerProducts.length})</h3>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {sellerProducts.map(product => (
                  <ProductCard key={product.id} product={product} onClick={setSelectedProduct} onSellerClick={setSelectedSeller} />
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategories = () => {
    const activeCat = CATEGORIES.find(c => c.id === selectedCategoryId);
    return (
      <div className="flex bg-white min-h-[calc(100vh-160px)] rounded-3xl border border-slate-100 overflow-hidden shadow-sm mb-10">
        <div className="w-24 md:w-56 bg-slate-50 border-r border-slate-100 overflow-y-auto">
          {CATEGORIES.map(cat => {
            const CatIcon = iconMap[cat.icon] || Package;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`w-full py-6 px-3 flex flex-col items-center md:flex-row md:px-6 md:gap-4 transition-all relative active:bg-white ${
                  selectedCategoryId === cat.id ? 'bg-white text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {selectedCategoryId === cat.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-600 rounded-r-full" />}
                <div className={`p-2 rounded-xl ${selectedCategoryId === cat.id ? 'bg-emerald-50' : 'bg-transparent'}`}>
                  <CatIcon size={20} />
                </div>
                <span className="text-[10px] md:text-sm text-center md:text-left leading-tight mt-2 md:mt-0">{cat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="mb-12">
             <h2 className="text-3xl font-black text-slate-900">{activeCat?.name}</h2>
             <p className="text-slate-400 font-medium mt-1">Direct Wholesale & Retail Segments</p>
          </div>
          <div className="grid gap-12">
            {activeCat?.subcategories.map(sub => (
              <div key={sub.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">{sub.name}</h3>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sub.microCategories.map(mic => (
                    <button 
                      key={mic.id} 
                      onClick={() => {
                        setSearchQuery(mic.name);
                        if(setTab) setTab('home');
                      }}
                      className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-[32px] hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 group active:scale-95"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden border border-slate-50 group-hover:scale-110 transition-transform">
                        <img src={`https://picsum.photos/seed/${mic.id}/100/100`} className="w-full h-full object-cover opacity-60" />
                      </div>
                      <span className="text-xs font-black text-center text-slate-600 group-hover:text-emerald-700 leading-tight">{mic.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCart = () => {
    const total = cart.reduce((acc, p) => acc + p.price, 0);
    return (
      <div className="max-w-4xl mx-auto pb-40 px-4 md:px-0">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900">Cart ({cart.length})</h2>
          {cart.length > 0 && (
            <button onClick={onClearCart} className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 hover:bg-rose-50 p-2 rounded-lg transition-colors active:scale-95">
              <Trash2 size={14} /> Clear Cart
            </button>
          )}
        </div>
        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
            <ShoppingCart size={80} className="mx-auto text-slate-100 mb-6" />
            <p className="text-xl font-bold text-slate-400">Your basket is empty.</p>
            <button onClick={() => setTab && setTab('home')} className="mt-6 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-100 active:scale-95">Browse Shop</button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-6 items-center shadow-sm group">
                <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{item.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Store size={12}/> {item.seller}</p>
                  <p className="text-emerald-700 font-black mt-1">Rs. {item.price.toLocaleString()}</p>
                </div>
                <button onClick={() => onRemoveFromCart(idx)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <div className="fixed bottom-24 left-0 right-0 z-[120] px-4 md:pl-24">
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-[32px] p-6 flex items-center justify-between border-t-2 border-t-emerald-500 animate-in slide-in-from-bottom-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Estimated Total</p>
                <p className="text-2xl font-black text-emerald-700">Rs. {total.toLocaleString()}</p>
              </div>
              <button onClick={onOrderPlaced} className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-xl shadow-emerald-100">
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <header className="fixed top-0 left-0 right-0 z-[110] bg-white shadow-sm border-b border-slate-100 md:pl-20">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center gap-3 md:gap-8">
          <button onClick={handleBack} className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 rounded-xl transition-all border border-slate-200 shadow-sm active:scale-90">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands or sellers..."
              className="w-full pl-14 pr-6 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
            />
          </div>

          <button onClick={() => setTab && setTab('cart')} className="p-3 text-slate-400 hover:text-emerald-600 relative bg-slate-50 rounded-xl border border-slate-200 active:scale-90">
            <ShoppingCart size={22} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">{cart.length}</span>}
          </button>
        </div>
      </header>

      <div className="mt-20 md:mt-24 px-4 max-w-7xl mx-auto">
        {selectedSeller ? (
          renderSellerProfile()
        ) : (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'cart' && renderCart()}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'chat' && (
              <div className="p-20 text-center flex flex-col items-center gap-6">
                <MessageCircle size={64} className="text-emerald-100" /> 
                <p className="font-bold text-slate-400">Select a wholesaler profile to start negotiating.</p>
                <button onClick={() => setTab && setTab('home')} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black active:scale-95">Go to Market</button>
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <User size={64} className="text-slate-200" />
                <p className="font-bold text-slate-400">Sourcing history and settings coming soon.</p>
                <button onClick={onBackToRoles} className="bg-slate-200 text-slate-600 px-8 py-3 rounded-xl font-black active:scale-95">Switch Role</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ALIEXPRESS STYLE FILTER SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[200] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Filter size={20} /> Advanced Filters</h3>
          <button onClick={() => setShowFilters(false)} className="p-3 bg-white rounded-xl hover:bg-slate-100 shadow-sm active:scale-90"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="space-y-4">
            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Price Range (PKR)</p>
            <div className="flex items-center gap-3">
              <input 
                type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <div className="h-0.5 w-6 bg-slate-200" />
              <input 
                type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-4">
             <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Customer Rating</p>
             <div className="space-y-2">
                {[4, 3, 2, 1].map(stars => (
                  <button 
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-95 ${minRating === stars ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < stars ? 'currentColor' : 'none'} className={i < stars ? '' : 'text-slate-200'} />
                      ))}
                      <span className="ml-2 text-slate-600">& Up</span>
                    </div>
                    {minRating === stars && <CheckCircle2 size={16} className="text-emerald-600" />}
                  </button>
                ))}
                <button onClick={() => setMinRating(0)} className="text-xs font-bold text-emerald-600 pl-3 hover:underline">Reset Rating</button>
             </div>
          </div>

          <div className="space-y-4">
             <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Service & Quality</p>
             <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <span className="text-sm font-bold text-slate-700">Verified Sellers Only</span>
                  </div>
                  <input type="checkbox" checked={onlyVerified} onChange={e => setOnlyVerified(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                </label>
             </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
          <button 
            onClick={() => { setMinPrice(''); setMaxPrice(''); setMinRating(0); setOnlyVerified(false); }}
            className="p-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-colors active:scale-95"
          >
            Reset All
          </button>
          <button 
            onClick={() => setShowFilters(false)}
            className="p-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors active:scale-90"><X size={20}/></button>
            <div className="aspect-square rounded-3xl overflow-hidden mb-6 bg-slate-50 border border-slate-100">
               <img src={selectedProduct.image} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2 mb-8">
               <div className="flex items-center gap-2 mb-2">
                 <Badge type={selectedProduct.bulkAvailable ? 'wholesale' : 'verified'} />
                 {selectedProduct.isVerified && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase">Verified</span>}
               </div>
               <h2 className="text-2xl font-black text-slate-900">{selectedProduct.name}</h2>
               <div className="flex items-center gap-4 text-sm font-black">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" /> {selectedProduct.rating} 
                  </div>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={() => { setSelectedSeller(selectedProduct.seller); setSelectedProduct(null); }}
                    className="text-slate-400 font-bold hover:text-emerald-600 transition-colors flex items-center gap-1 active:scale-95"
                  >
                    <Store size={14}/> {selectedProduct.seller}
                  </button>
               </div>
               <div className="mt-4 flex items-baseline gap-2">
                 <span className="text-emerald-700 font-black text-4xl">Rs. {selectedProduct.price.toLocaleString()}</span>
                 <span className="text-slate-400 text-xs font-bold">/ unit</span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { onAddToCart(selectedProduct); setSelectedProduct(null); }} 
                className="bg-emerald-600 text-white p-5 rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button onClick={() => setSelectedProduct(null)} className="bg-slate-100 p-5 rounded-2xl font-black text-slate-600 hover:bg-slate-200 transition-colors active:scale-95">Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerView;


import React from 'react';
import { Home, Grid, ShoppingCart, MessageCircle, User, LayoutDashboard, Package, History, PieChart, Settings } from 'lucide-react';
import { UserRole } from '../types';

interface NavProps {
  currentTab: string;
  setTab: (tab: string) => void;
  role: UserRole;
  onSwitchRole: () => void;
}

export const MobileBottomNav: React.FC<NavProps> = ({ currentTab, setTab, role }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-2 px-1 z-50 md:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentTab === tab.id ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          <tab.icon size={22} strokeWidth={currentTab === tab.id ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export const Sidebar: React.FC<NavProps> = ({ currentTab, setTab, role, onSwitchRole }) => {
  return (
    <aside className="hidden md:flex flex-col w-20 hover:w-64 transition-all duration-300 h-screen bg-emerald-900 text-white fixed left-0 top-0 desi-pattern border-r border-emerald-800 z-[60] overflow-hidden group">
      <div className="p-4 flex flex-col items-center group-hover:items-start transition-all">
        <h1 className="text-3xl font-black tracking-tighter">
          S<span className="text-amber-400">X</span><span className="hidden group-hover:inline">halmi</span>
        </h1>
        <p className="text-[8px] group-hover:text-xs text-emerald-200 opacity-60 uppercase tracking-widest mt-1 font-bold whitespace-nowrap">
          {role.split('_')[0]} PORTAL
        </p>
      </div>

      <div className="flex-1 px-2 py-8 space-y-4">
        {/* Navigation is now handled inside the main dashboard tiles */}
        <div className="flex flex-col items-center space-y-6">
           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
              <LayoutDashboard size={20} />
           </div>
           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-300/40">
              <Package size={20} />
           </div>
           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-300/40">
              <History size={20} />
           </div>
        </div>
      </div>

      <div className="p-4 space-y-4 border-t border-emerald-800 flex flex-col items-center">
        <button
          onClick={onSwitchRole}
          title="Switch Role"
          className="w-12 group-hover:w-full h-12 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-2xl transition-all overflow-hidden"
        >
          <History size={20} />
          <span className="hidden group-hover:inline whitespace-nowrap text-sm">Switch Role</span>
        </button>
        <p className="text-[8px] text-emerald-400 text-center opacity-40 uppercase tracking-tighter">v1.0.4</p>
      </div>
    </aside>
  );
};

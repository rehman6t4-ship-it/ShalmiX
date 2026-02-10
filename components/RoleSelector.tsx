
import React from 'react';
import { UserRole } from '../types';
import { ShoppingBasket, Building2, Store } from 'lucide-react';

interface Props {
  onSelect: (role: UserRole) => void;
}

const RoleSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-6 desi-pattern">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-white tracking-tighter">
            Shahalmi<span className="text-amber-400">X</span>
          </h1>
          <p className="text-emerald-100 urdu text-xl tracking-wide">پاکستان کی ڈیجیٹل شاہ عالمی مارکیٹ</p>
          <p className="text-emerald-200 opacity-80 pt-2">Welcome to Pakistan's biggest wholesale hub. Choose how you want to use ShahalmiX today.</p>
        </div>

        <div className="grid gap-4 mt-10">
          <button
            onClick={() => onSelect(UserRole.BUYER)}
            className="group flex items-center gap-4 bg-white/10 hover:bg-white text-white hover:text-emerald-900 p-6 rounded-3xl border border-white/20 transition-all duration-300 transform hover:-translate-y-1 text-left"
          >
            <div className="bg-amber-400 p-3 rounded-2xl group-hover:bg-emerald-100">
              <ShoppingBasket size={32} />
            </div>
            <div>
              <p className="font-bold text-xl">Retail Customer</p>
              <p className="urdu text-sm opacity-80">گاہک / ریٹیل کسٹمر</p>
            </div>
          </button>

          <button
            onClick={() => onSelect(UserRole.WHOLESALER)}
            className="group flex items-center gap-4 bg-white/10 hover:bg-white text-white hover:text-emerald-900 p-6 rounded-3xl border border-white/20 transition-all duration-300 transform hover:-translate-y-1 text-left"
          >
            <div className="bg-white p-3 rounded-2xl text-emerald-900">
              <Building2 size={32} />
            </div>
            <div>
              <p className="font-bold text-xl">Wholesaler / Manufacturer</p>
              <p className="urdu text-sm opacity-80">تھوک فروش / مینوفیکچرر</p>
            </div>
          </button>

          <button
            onClick={() => onSelect(UserRole.RETAIL_SELLER)}
            className="group flex items-center gap-4 bg-white/10 hover:bg-white text-white hover:text-emerald-900 p-6 rounded-3xl border border-white/20 transition-all duration-300 transform hover:-translate-y-1 text-left"
          >
            <div className="bg-emerald-400 p-3 rounded-2xl text-white group-hover:bg-emerald-100 group-hover:text-emerald-900">
              <Store size={32} />
            </div>
            <div>
              <p className="font-bold text-xl">Retail Shop Owner</p>
              <p className="urdu text-sm opacity-80">دکاندار / ریٹیل سیلر</p>
            </div>
          </button>
        </div>

        <div className="pt-8">
          <p className="text-emerald-300/60 text-xs uppercase tracking-widest font-bold">Powered by Innovation</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;

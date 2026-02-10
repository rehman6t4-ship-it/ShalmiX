
import React from 'react';
import { Info, AlertCircle, ShieldCheck } from 'lucide-react';

export const ApiPlaceholder: React.FC<{ label?: string }> = ({ label = "API connection pending" }) => (
  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 mt-1 italic">
    <Info size={12} />
    <span>{label}</span>
  </div>
);

export const PaymentPlaceholder: React.FC = () => (
  <div className="p-4 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50 text-center space-y-2">
    <ShieldCheck className="mx-auto text-emerald-600" />
    <p className="text-sm font-medium text-emerald-800">Payment Gateway Placeholder</p>
    <p className="text-xs text-emerald-600">Secure integration will be connected later</p>
  </div>
);

export const SectionHeader: React.FC<{ title: string; urdu?: string; action?: string }> = ({ title, urdu, action }) => (
  <div className="flex justify-between items-end mb-6">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {urdu && <p className="urdu text-emerald-700 text-lg">{urdu}</p>}
    </div>
    {action && (
      <button className="text-emerald-600 font-semibold hover:underline text-sm">{action}</button>
    )}
  </div>
);

export const Badge: React.FC<{ type: 'wholesale' | 'verified' | 'urgent' }> = ({ type }) => {
  const styles = {
    wholesale: 'bg-amber-100 text-amber-700 border-amber-200',
    verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    urgent: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const labels = {
    wholesale: 'Bulk Price Available',
    verified: 'Verified Seller',
    urgent: 'Urgent Stock',
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[type]} uppercase tracking-wider`}>
      {labels[type]}
    </span>
  );
};


import React, { useState } from 'react';
import { MOCK_ORGS } from '../constants';

const BillingPanel: React.FC = () => {
  const [showPaystack, setShowPaystack] = useState<{ plan: string, price: string } | null>(null);

  const plans = [
    { name: 'Core Sentinel', price: '₦15,000', period: 'monthly', features: ['5 Active Assets', 'Basic GPS', 'Police Directory'], color: 'slate' },
    { name: 'Elite Tactical', price: '₦45,000', period: 'monthly', features: ['25 Active Assets', 'Ghost Pinging', 'NIN Background Scans', 'SOS Priority'], color: 'indigo', featured: true },
    { name: 'Command Mesh', price: '₦120,000', period: 'monthly', features: ['Unlimited Assets', 'Neural Recon (AI)', 'Forensic PDFs', 'Direct Command Handshake'], color: 'emerald' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h3 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter">Strategic Subscriptions</h3>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Select your deployment tier for Area Guard intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative obsidian-glass rounded-[2.5rem] p-10 flex flex-col border transition-all duration-500 hover:scale-[1.02] ${plan.featured ? 'border-indigo-500/50 ring-2 ring-indigo-500/10' : 'border-white/5'}`}>
            {plan.featured && (
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-indigo-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Recommended Deployment</div>
            )}
            <div className="mb-8">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{plan.name}</p>
               <div className="flex items-baseline gap-2">
                 <h4 className="text-4xl font-black text-white italic tracking-tighter">{plan.price}</h4>
                 <span className="text-[10px] font-bold text-slate-500 uppercase">/ {plan.period}</span>
               </div>
            </div>
            <ul className="flex-1 space-y-4 mb-10">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-[11px] font-bold text-slate-300 uppercase tracking-tight">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${plan.color}-500`}></div>
                  {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setShowPaystack({ plan: plan.name, price: plan.price })}
              className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${plan.featured ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'}`}
            >
              Initialize Plan
            </button>
          </div>
        ))}
      </div>

      {/* Credit Section */}
      <div className="obsidian-glass rounded-[3rem] p-8 lg:p-12 border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
         <div className="space-y-4 text-center lg:text-left">
            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Signal Credits</h4>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest max-w-sm">Purchase extra pings for Ghost Triangulation or Neural Analysis without upgrading your plan.</p>
         </div>
         <div className="flex flex-wrap justify-center gap-4">
            {[
              { amount: '500 Pings', price: '₦10,000' },
              { amount: '2,000 Pings', price: '₦35,000' }
            ].map(pkg => (
              <button 
                key={pkg.amount} 
                onClick={() => setShowPaystack({ plan: pkg.amount, price: pkg.price })}
                className="obsidian-glass px-8 py-5 rounded-3xl border-emerald-500/20 hover:bg-emerald-500/5 transition-all group"
              >
                 <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">{pkg.amount}</p>
                 <p className="text-xl font-black text-white italic tracking-tighter">{pkg.price}</p>
              </button>
            ))}
         </div>
      </div>

      {showPaystack && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 animate-in fade-in">
           {/* Reusing the Mock Paystack UI from PublicDashboard logic for consistency */}
           <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-md w-full relative">
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center text-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-black text-xs italic">P</div>
                  <span className="text-sm font-black uppercase tracking-tighter">Paystack Checkout</span>
                </div>
                <button onClick={() => setShowPaystack(null)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg></button>
              </div>
              <div className="p-12 text-center space-y-8">
                 <div className="space-y-2">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Deploying Tier: {showPaystack.plan}</p>
                    <h3 className="text-5xl font-black text-slate-900 italic tracking-tighter">{showPaystack.price}</h3>
                 </div>
                 <div className="space-y-3">
                    <button onClick={() => { setShowPaystack(null); alert('Billing link verified. Plan active.'); }} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Complete Transaction</button>
                    <button onClick={() => setShowPaystack(null)} className="w-full py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px]">Back to Security Terminal</button>
                 </div>
                 <p className="text-[9px] text-slate-400 font-medium italic">Standard Paystack security protocols applied.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BillingPanel;


import React from 'react';

const BillingPanel: React.FC = () => {
  const plans = [
    { 
      name: 'Sentinel Personal', 
      price: '₦5,000', 
      period: 'monthly', 
      features: [
        'Proactive AI Buddy', 
        'Daily Pattern Monitoring', 
        'Auto-Call Verification', 
        'Geofence Exit Alerts', 
        'Direct SOS Police Burst'
      ], 
      color: 'emerald' 
    },
    { 
      name: 'Family Shield', 
      price: '₦20,000', 
      period: 'monthly', 
      features: [
        'Protection for 5 Members', 
        'Cross-Synced Behavioral AI', 
        'Route Deviation Alerts', 
        'Group Check-in Protocol', 
        'Unified Family Emergency Hub'
      ], 
      color: 'indigo', 
      featured: true 
    },
    { 
      name: 'Musti Business', 
      price: '₦100,000+', 
      period: 'monthly', 
      features: [
        'Unlimited Staff Monitoring', 
        'Stealth Musti Pin Protocol', 
        'Behavioral Integrity Audit', 
        'Custom Geofence Zones', 
        'High-Value Asset Handshake'
      ], 
      color: 'rose' 
    },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-500 max-w-6xl mx-auto py-10">
      <div className="text-center space-y-4">
        <h3 className="text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter">Sentinel Authorization</h3>
        <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em]">Choose the tier of protection required for your ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative obsidian-glass rounded-[3.5rem] p-12 flex flex-col border transition-all duration-500 ${plan.featured ? 'border-indigo-500/50 ring-2 ring-indigo-500/10' : 'border-white/5'}`}>
            <div className="mb-10">
               <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${plan.featured ? 'text-indigo-400' : 'text-slate-500'}`}>{plan.name}</p>
               <div className="flex items-baseline gap-2">
                 <h4 className="text-5xl font-black text-white italic tracking-tighter">{plan.price}</h4>
                 <span className="text-[10px] font-bold text-slate-500 uppercase">/ {plan.period}</span>
               </div>
            </div>
            <ul className="flex-1 space-y-5 mb-12">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-4 text-xs font-bold text-slate-300 uppercase tracking-tight leading-snug">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 bg-${plan.color}-500 shadow-[0_0_10px_rgba(255,255,255,0.2)]`}></div>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${plan.featured ? 'bg-indigo-600 text-white shadow-3xl shadow-indigo-600/30' : 'bg-white/5 text-white hover:bg-white/10'}`}>
              Establish Protocol
            </button>
          </div>
        ))}
      </div>
      
      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div>
            <h4 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">Individual Musti Pin Verification</h4>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Enroll employees or guarantors manually into the sentinel network.</p>
         </div>
         <div className="flex items-center gap-6">
            <span className="text-3xl font-black text-emerald-500 italic">₦2,500</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">/ subject</span>
            <button className="px-10 py-5 bg-emerald-600 text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Enroll Subject</button>
         </div>
      </div>
    </div>
  );
};

export default BillingPanel;

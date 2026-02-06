
import React, { useState } from 'react';
import { MOCK_VEHICLES } from '../constants';
import { AssetStatus, Vehicle, TamperStatus } from '../types';

const PaystackModal: React.FC<{ price: string, type: string, onCancel: () => void, onSuccess: () => void }> = ({ price, type, onCancel, onSuccess }) => {
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 3000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 animate-in fade-in">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h4 className="text-xl font-black text-slate-900 uppercase">Payment Successful</h4>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Intelligence node has been unlocked. Your report is now ready in the dashboard.</p>
          <button onClick={onSuccess} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-md w-full relative">
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-black text-xs italic">P</div>
            <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Paystack Checkout</span>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg></button>
        </div>

        <div className="p-8 space-y-6">
          {step === 'selection' ? (
            <>
              <div className="text-center space-y-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Paying Area Guard</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">{price}</h3>
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{type.replace(/_/g, ' ')}</p>
              </div>

              <div className="space-y-3">
                <button onClick={handlePayment} className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-500 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9h-16zm3 4a1 1 0 11-2 0 1 1 0 012 0zm-9-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
                      </div>
                      <div className="text-left">
                         <p className="text-sm font-bold text-slate-900">Pay with Card</p>
                         <p className="text-[10px] text-slate-400 font-medium tracking-tight">Visa, Mastercard, Verve</p>
                      </div>
                   </div>
                   <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg>
                </button>
                <button onClick={handlePayment} className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-500 transition-all group opacity-60">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M12 7H8v3H5v4h3v3h4v-3h3v-4h-3V7z" clipRule="evenodd" /></svg>
                      </div>
                      <div className="text-left">
                         <p className="text-sm font-bold text-slate-900">Pay with Bank</p>
                      </div>
                   </div>
                </button>
              </div>

              <p className="text-center text-[9px] text-slate-400 font-medium italic">Area Guard utilizes Paystack for secure 256-bit encrypted transactions.</p>
            </>
          ) : (
            <div className="py-20 text-center space-y-6">
               <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Verifying Transaction</h4>
                  <p className="text-xs text-slate-400 font-medium tracking-tight">Communicating with secure bank servers...</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PublicDashboard: React.FC = () => {
  const [selected, setSelected] = useState<Vehicle>(MOCK_VEHICLES[0]);
  const [showPayModal, setShowPayModal] = useState<{type: string, price: string} | null>(null);

  const handleUnlock = (type: string, price: string) => setShowPayModal({ type, price });

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Horizontal Mobile List / Vertical Desktop List */}
        <div className="lg:col-span-3 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto custom-scrollbar pb-2 lg:pb-0">
          {MOCK_VEHICLES.map(v => (
            <button 
              key={v.id}
              onClick={() => setSelected(v)}
              className={`min-w-[200px] lg:min-w-0 w-full p-5 rounded-[1.5rem] lg:rounded-[2rem] border transition-all duration-300 relative shrink-0 ${selected.id === v.id ? 'obsidian-glass border-emerald-500/30 ring-1 ring-emerald-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
            >
               <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs lg:text-sm font-black transition-colors ${selected.id === v.id ? 'text-white' : 'text-slate-500'}`}>{v.plate}</span>
                  <div className={`w-2 h-2 rounded-full ${v.tamperStatus === TamperStatus.SECURE ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
               </div>
               <p className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate text-left">{v.driverName}</p>
            </button>
          ))}
        </div>

        {/* Main Content View */}
        <div className="lg:col-span-9 space-y-6 lg:space-y-8">
           <div className="obsidian-glass rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                 <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#p-grid-lux)" /><defs><pattern id="p-grid-lux" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1"/></pattern></defs></svg>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                 <div>
                    <h2 className="text-3xl lg:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{selected.plate}</h2>
                    <p className="text-[10px] lg:text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mt-2 lg:mt-3">Status: {selected.status} | Last Seen: {selected.lastPing}</p>
                 </div>
                 <div className="px-4 py-2 lg:px-6 lg:py-4 obsidian-glass rounded-2xl lg:rounded-3xl border border-white/10 text-center self-end sm:self-auto">
                    <p className="text-[8px] lg:text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Health</p>
                    <p className="text-xl lg:text-3xl font-black text-emerald-500 italic tracking-tighter">{selected.paymentScore}%</p>
                 </div>
              </div>

              <div className="relative z-10 flex-1 flex items-center justify-center py-6">
                 <div className="w-32 h-32 lg:w-48 lg:h-48 bg-emerald-500/5 border border-emerald-500/20 rounded-full flex items-center justify-center relative group">
                    <svg className="w-12 h-12 lg:w-16 lg:h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth={1.5}/></svg>
                    <div className="absolute inset-[-15px] border-2 border-emerald-500/10 border-dashed rounded-full animate-[spin_20s_linear_infinite]"></div>
                 </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                 <button onClick={() => handleUnlock('PRECISION_GPS_TRACK', '₦2,500')} className="obsidian-glass px-4 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-3xl text-center group hover:bg-emerald-500/10 border-emerald-500/10">
                    <p className="text-[8px] lg:text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest">Precision</p>
                    <p className="text-[10px] lg:text-xs font-black text-white uppercase mt-1">₦2.5k / Ping</p>
                 </button>
                 <button onClick={() => handleUnlock('AUDIBLE_SURVEILLANCE', '₦4,000')} className="obsidian-glass px-4 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-3xl text-center group hover:bg-indigo-500/10 border-indigo-500/10">
                    <p className="text-[8px] lg:text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">Voice Link</p>
                    <p className="text-[10px] lg:text-xs font-black text-white uppercase mt-1">₦4k / Min</p>
                 </button>
                 <button onClick={() => handleUnlock('POLICE_DISPATCH_PROTOCOL', '₦25,000')} className="col-span-2 px-4 py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-xl lg:rounded-[2rem] font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl shadow-rose-600/20">
                    URGENT THEFT ALERT / DISPATCH
                 </button>
              </div>
           </div>

           {/* Mobile-stacked premium sections */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 pb-10 lg:pb-0">
              <div className="obsidian-glass rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 space-y-4 lg:space-y-6">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth={2}/></svg>
                    Social Graph Data
                 </h4>
                 <div className="relative h-32 lg:h-40 rounded-2xl lg:rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase mb-4">Infiltrate and retrieve the target's primary social contact nodes.</p>
                    <button onClick={() => handleUnlock('SOCIAL_RECON_UNLOCK', '₦5,000')} className="px-6 py-2.5 bg-emerald-600 text-slate-950 font-black text-[10px] rounded-xl uppercase tracking-widest shadow-lg">Unlock (₦5,000)</button>
                 </div>
              </div>

              <div className="obsidian-glass rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 space-y-4 lg:space-y-6">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>
                    Credit Risk Audit
                 </h4>
                 <div className="relative h-32 lg:h-40 rounded-2xl lg:rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase mb-4">Perform a deep forensic scan of NIN and credit history registries.</p>
                    <button onClick={() => handleUnlock('CREDIT_INTELLIGENCE_AUDIT', '₦3,500')} className="px-6 py-2.5 bg-indigo-600 text-white font-black text-[10px] rounded-xl uppercase tracking-widest shadow-lg">Unlock (₦3,500)</button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {showPayModal && (
        <PaystackModal 
          price={showPayModal.price} 
          type={showPayModal.type} 
          onCancel={() => setShowPayModal(null)} 
          onSuccess={() => { setShowPayModal(null); alert('Operational clearance granted.'); }} 
        />
      )}
    </div>
  );
};

export default PublicDashboard;

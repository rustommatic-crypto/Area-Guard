
import React, { useState } from 'react';

const HardwareWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isTesting, setIsTesting] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const [provisioningData, setProvisioningData] = useState({ iccid: '', carrier: 'MTN NG (M2M)', isESIM: true });

  const runDiagnostic = () => {
    setIsTesting(true);
    setSignalStrength(0);
    const interval = setInterval(() => {
      setSignalStrength(prev => {
        if (prev >= 98) {
          clearInterval(interval);
          setIsTesting(false);
          return 98;
        }
        return prev + 2;
      });
    }, 30);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-3 mb-10">
        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">Protocol: Hardware_Commissioning</span>
        </div>
        <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Escort Node Enrollment</h3>
        <p className="text-slate-500 text-sm max-w-xl">
          Link M2M SIM cards to stealth hardware. Choose <strong>Machine (Ghost Node)</strong> for soldered eSIM protection that cannot be removed by the driver.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-800'}`}></div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <h4 className="text-xl font-bold text-white mb-2 italic uppercase">1. Select Deployment Topology</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => { setProvisioningData({...provisioningData, isESIM: false}); setStep(2); }} className="p-8 bg-slate-800/30 border-2 border-slate-700 hover:border-indigo-500 rounded-3xl text-left group transition-all">
                   <div className="w-12 h-12 bg-slate-700 rounded-xl mb-6 flex items-center justify-center group-hover:bg-indigo-500/20">
                      <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                   </div>
                   <p className="text-white font-black uppercase text-sm tracking-widest">Phone SIM Link</p>
                   <p className="text-slate-500 text-xs mt-2 leading-relaxed">Driver's mobile device. High accuracy but <strong>high risk of removal/tamper</strong>. Requires Shadow Agent stealth app.</p>
                </button>
                <button onClick={() => { setProvisioningData({...provisioningData, isESIM: true}); setStep(2); }} className="p-8 bg-indigo-500/5 border-2 border-indigo-500/50 rounded-3xl text-left group transition-all ring-1 ring-indigo-500/20">
                   <div className="w-12 h-12 bg-indigo-500/20 rounded-xl mb-6 flex items-center justify-center">
                      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeWidth={2}/></svg>
                   </div>
                   <p className="text-indigo-400 font-black uppercase text-sm tracking-widest">Machine (Ghost Node)</p>
                   <p className="text-slate-500 text-xs mt-2 leading-relaxed">Concealed hardware node. <strong>Zero risk of removal</strong>. Uses soldered eSIM technology that is non-removable.</p>
                </button>
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <h4 className="text-xl font-bold text-white mb-2 italic uppercase">2. M2M Provisioning</h4>
             <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Unique Identifier (ICCID)</label>
                   {provisioningData.isESIM && <span className="text-[8px] bg-indigo-500 text-white px-2 py-0.5 rounded font-black uppercase">eSIM Mode Active</span>}
                </div>
                <input 
                   type="text" 
                   placeholder="89234..." 
                   className="w-full bg-black/40 border border-indigo-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400 font-mono outline-none focus:border-indigo-500/50"
                   value={provisioningData.iccid}
                   onChange={(e) => setProvisioningData({...provisioningData, iccid: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="p-4 bg-slate-900 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Carrier Network</p>
                      <p className="text-xs font-bold text-white">MTN NG (M2M)</p>
                   </div>
                   <div className="p-4 bg-slate-900 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Integrity Policy</p>
                      <p className="text-xs font-bold text-emerald-500">TAMPER_IMMUNE</p>
                   </div>
                </div>
             </div>
             <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="text-slate-500 text-xs font-bold uppercase hover:text-white transition-colors">Back</button>
                <button onClick={() => setStep(3)} disabled={!provisioningData.iccid} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Establish Crypto Link</button>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <h4 className="text-xl font-bold text-white mb-2 italic uppercase">3. RF Diagnostic & Mounting Scan</h4>
             <div className="bg-black/40 rounded-2xl p-10 border border-white/5 flex flex-col items-center">
                <div className="relative w-56 h-56 mb-8">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                      <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={565} strokeDashoffset={565 - (565 * signalStrength) / 100} className="text-indigo-500 transition-all duration-100 shadow-[0_0_20px_rgba(79,70,229,0.4)]" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-white italic tracking-tighter">{signalStrength}%</span>
                      <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Integrity</span>
                   </div>
                </div>
                <div className="text-center space-y-2 mb-8">
                   <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">HLR Handshake: {isTesting ? 'SYNCING...' : 'LOCKED'}</p>
                   <p className="text-[10px] font-mono text-slate-500 uppercase">Static IP Assigned: 10.22.45.101</p>
                </div>
                <button 
                  onClick={runDiagnostic}
                  disabled={isTesting}
                  className="px-16 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/30"
                >
                  {isTesting ? 'Scanning RF Channels...' : 'Execute Diagnostic'}
                </button>
             </div>
             <div className="flex justify-between mt-8">
                <button onClick={() => setStep(2)} className="text-slate-500 text-xs font-bold uppercase">Back</button>
                <button onClick={() => setStep(4)} disabled={signalStrength < 95} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Lock Deployment</button>
             </div>
          </div>
        )}

        {step === 4 && (
           <div className="text-center py-20 animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                 <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-4xl font-black text-white italic mb-2 uppercase tracking-tighter">Ghost Node Secured</h4>
              <p className="text-slate-400 text-sm mb-10 max-w-sm mx-auto">Hardware is mounted and M2M link is encrypted. Physical removal detected will trigger automatic police dispatch.</p>
              <button onClick={() => setStep(1)} className="px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 transition-all">Commence Next Enrollment</button>
           </div>
        )}
      </div>
    </div>
  );
};

export default HardwareWizard;

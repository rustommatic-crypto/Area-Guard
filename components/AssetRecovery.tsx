
import React, { useState } from 'react';
import { MOCK_VEHICLES } from '../constants';
import { AssetStatus, RecoveryPlan, Vehicle } from '../types';
import { generateRecoveryPlan } from '../geminiService';
import { getDemoRecoveryPlan } from '../services';

const AssetRecovery: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchComplete, setDispatchComplete] = useState(false);
  const [plan, setPlan] = useState<RecoveryPlan | null>(null);

  const defaults = MOCK_VEHICLES.filter(v => v.status === AssetStatus.DEFAULT || v.status === AssetStatus.STOLEN);

  const handleDemo = () => {
    if (!selectedVehicle) return;
    setIsGenerating(true);
    setPlan(null);
    setDispatchComplete(false);
    setTimeout(() => {
      setPlan(getDemoRecoveryPlan(selectedVehicle.plate));
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerate = async () => {
    if (!selectedVehicle) return;
    setIsGenerating(true);
    setPlan(null);
    setDispatchComplete(false);
    try {
      const data = await generateRecoveryPlan(selectedVehicle);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDispatch = () => {
    setIsDispatching(true);
    // Simulate secure handshake with Police API
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchComplete(true);
      // In a real app, this would call a backend to log the dispatch
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-80 flex flex-col space-y-4">
        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tighter italic">Targets for Recovery</h3>
        {defaults.map(v => (
          <button
            key={v.id}
            onClick={() => { setSelectedVehicle(v); setPlan(null); setDispatchComplete(false); }}
            className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${
              selectedVehicle?.id === v.id 
                ? 'bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start">
               <p className="text-indigo-400 font-mono text-sm font-black italic">{v.plate}</p>
               <span className="text-[8px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-black uppercase">DEFAULT</span>
            </div>
            <p className="text-white font-bold mt-1 text-xs">{v.driverName}</p>
            <p className="text-[9px] text-slate-500 mt-2 uppercase font-mono">Last Signal: {v.lastPing}</p>
          </button>
        ))}
      </div>

      <div className="flex-1">
        {selectedVehicle ? (
          <div className="bg-slate-900 border border-indigo-900/20 rounded-3xl p-8 min-h-[500px] flex flex-col relative shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Strategic Recovery Planner</h4>
                <div className="flex gap-4 mt-2">
                  <button onClick={handleDemo} className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors">Load Simulated Strategy</button>
                  <span className="text-slate-700">|</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Target_ID: {selectedVehicle.imei}</span>
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || isDispatching}
                className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                  isGenerating ? 'bg-slate-800 text-slate-500 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {isGenerating ? 'Gemini Analyzing...' : 'Generate AI Plan'}
              </button>
            </div>

            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="relative w-16 h-16">
                   <div className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-2 border-2 border-emerald-500/10 border-b-emerald-500 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                </div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Correlating Field Intelligence...</p>
              </div>
            )}

            {plan && !isGenerating && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8 p-4 bg-slate-950/50 border border-indigo-500/10 rounded-2xl">
                   <div className="flex items-center space-x-4">
                      <div className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest ${
                        plan.riskLevel === 'High' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20'
                      }`}>
                        RISK_LEVEL: {plan.riskLevel}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 italic">"Authority handshake ready"</span>
                   </div>
                   {!dispatchComplete ? (
                     <button 
                       onClick={handleDispatch}
                       disabled={isDispatching}
                       className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20 animate-pulse"
                     >
                       {isDispatching ? 'Transmitting Data...' : 'Dispatch to Authorities'}
                     </button>
                   ) : (
                     <div className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Police Engaged: REF_#88921</span>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                  <div className="space-y-6">
                    <h5 className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center">
                       <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                       Operational Steps
                    </h5>
                    <ul className="space-y-4">
                      {plan.steps.map((step, i) => (
                        <li key={i} className="flex items-start space-x-3 group">
                          <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-800 border border-indigo-900/30 text-indigo-400 text-[10px] flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">{i + 1}</span>
                          <p className="text-xs text-slate-300 leading-relaxed pt-1 font-medium">{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h5 className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center">
                       <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></span>
                       Tactical Constraints
                    </h5>
                    <div className="p-6 bg-slate-950/80 border border-indigo-900/10 rounded-3xl italic text-xs text-slate-400 leading-loose relative shadow-inner">
                      <svg className="absolute -top-3 -left-3 w-8 h-8 text-indigo-500/10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21M14.017 21H21.017M14.017 21C12.9124 21 12.017 20.1046 12.017 19V12C12.017 10.8954 12.9124 10 14.017 10H17.017C18.1216 10 19.017 10.8954 19.017 12V15M3 21L3 18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21M3 21H10M3 21C1.89543 21 1 20.1046 1 19V12C1 10.8954 1.89543 10 3 10H6C7.10457 10 8 10.8954 8 12V15" /></svg>
                      "{plan.tacticalAdvice}"
                    </div>
                    
                    {dispatchComplete && (
                       <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in zoom-in-95 duration-500">
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Live Data Streamed to Authorities</p>
                          <div className="space-y-1.5">
                             <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                                <span>Packet: GHOST_NODE_METADATA</span>
                                <span className="text-emerald-400">SENT</span>
                             </div>
                             <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                                <span>Packet: AUDIO_INTERCEPT_V3</span>
                                <span className="text-emerald-400">SENT</span>
                             </div>
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isDispatching && (
               <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 mb-8 relative">
                     <div className="absolute inset-0 border-4 border-rose-500 rounded-full animate-ping opacity-20"></div>
                     <div className="absolute inset-0 border-4 border-rose-500 rounded-full animate-pulse flex items-center justify-center">
                        <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                     </div>
                  </div>
                  <h4 className="text-2xl font-black text-white italic uppercase mb-2">Engaging Authorities</h4>
                  <p className="text-slate-400 text-sm max-w-sm mb-6 uppercase tracking-widest font-bold">Synchronizing Encrypted Data with Regional Police Command Center...</p>
                  <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-rose-500 animate-[loading_3s_ease-in-out_infinite]"></div>
                  </div>
               </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-900/30 border border-indigo-900/10 border-dashed rounded-3xl opacity-40 py-20">
             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-[0.2em] italic text-sm">Target selection required for tactical plotting.</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AssetRecovery;


import React, { useState, useEffect } from 'react';
import { MOCK_BUSES } from '../constants';
import { InterstateBus, Passenger } from '../types';

const PassengerEscort: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState<InterstateBus>(MOCK_BUSES[0]);
  const [activeSOS, setActiveSOS] = useState<Passenger | null>(null);

  useEffect(() => {
    const sos = selectedBus.passengers.find(p => p.status === 'SOS');
    if (sos) setActiveSOS(sos);
  }, [selectedBus]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-[9px] font-black text-rose-400 uppercase tracking-widest animate-pulse">
              Live Escort Active
            </span>
          </div>
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Passenger Escort Core</h3>
          <p className="text-slate-500 text-sm">Anti-Kidnapping protocol for high-risk interstate corridors.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                 <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2}/></svg>
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Monitored Souls</p>
                 <p className="text-xl font-black text-white">1,248</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Route Progress */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h4 className="text-xl font-bold text-white mb-1">{selectedBus.route}</h4>
                    <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{selectedBus.plate} | DRIVER: {selectedBus.driver}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Estimated Arrival</p>
                    <p className="text-xl font-black text-white italic">{selectedBus.eta}</p>
                 </div>
              </div>

              {/* Progress Bar with Markers */}
              <div className="relative h-20 mb-10 flex items-center">
                 <div className="absolute w-full h-1 bg-slate-800 rounded-full"></div>
                 <div className="absolute h-1 bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]" style={{ width: `${selectedBus.progress}%` }}></div>
                 
                 {/* Bus Icon */}
                 <div className="absolute transform -translate-x-1/2 transition-all duration-1000" style={{ left: `${selectedBus.progress}%` }}>
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-2xl">
                       <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h1v2a1 1 0 001 1h1a1 1 0 001-1v-2h6v2a1 1 0 001 1h1a1 1 0 001-1v-2h1a2 2 0 002-2V9zM4 13a1 1 0 112 0 1 1 0 01-2 0zm9 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    </div>
                 </div>

                 {/* Danger Zone Markers */}
                 <div className="absolute left-[30%] top-full mt-2 flex flex-col items-center">
                    <div className="w-1 h-2 bg-rose-500/50"></div>
                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">Otedola Bridge (Danger Zone)</span>
                 </div>
                 <div className="absolute left-[75%] top-full mt-2 flex flex-col items-center">
                    <div className="w-1 h-2 bg-amber-500/50"></div>
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Shagamu Interchange</span>
                 </div>
              </div>

              {/* Passenger Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {selectedBus.passengers.map(p => (
                   <div key={p.id} className={`p-4 rounded-2xl border transition-all ${p.status === 'SOS' ? 'bg-rose-500/10 border-rose-500 animate-pulse' : 'bg-slate-800/40 border-white/5'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black text-slate-500">SEAT {p.seatNumber}</span>
                         <div className={`w-2 h-2 rounded-full ${p.status === 'SOS' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                      </div>
                      <p className="text-xs font-bold text-white truncate">{p.name}</p>
                      <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase">ID: {p.deviceImei}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* SOS Terminal */}
           {activeSOS && (
             <div className="bg-rose-950 border border-rose-500/30 rounded-3xl p-8 animate-in slide-in-from-bottom-8">
                <div className="flex items-start justify-between mb-6">
                   <div className="flex gap-4">
                      <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-500/30">
                         <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div>
                         <h5 className="text-xl font-black text-white uppercase italic">Critical Distress Alert</h5>
                         <p className="text-rose-200 text-xs font-bold uppercase tracking-widest">Target: {activeSOS.name} | Signal Deviation Detected</p>
                      </div>
                   </div>
                   <button className="px-6 py-2 bg-rose-500 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">Intercept Audio</button>
                </div>
                
                <div className="bg-black/40 rounded-2xl p-6 border border-rose-500/10 mb-6">
                   <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3">AI Acoustic Intercept (Live Transcribe)</p>
                   <div className="space-y-2">
                      <p className="text-sm font-bold text-white italic">"STOP THE BUS! WHY ARE WE TURNING OFF THE MAIN ROAD?"</p>
                      <p className="text-xs text-rose-300 opacity-60">Confidence: 98% (Distress Vocabulary Detected)</p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 py-4 bg-white text-rose-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-rose-100 transition-all">Dispatch Rapid Response</button>
                   <button className="flex-1 py-4 bg-rose-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest border border-rose-500/50">Notify Highway Patrol</button>
                </div>
             </div>
           )}
        </div>

        {/* Intelligence Feeds */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Escort Diagnostics</h5>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-400">Mesh Sync:</span>
                    <span className="text-emerald-400 font-mono text-xs">ENCRYPTED</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-400">Signal Jamming Res:</span>
                    <span className="text-indigo-400 font-mono text-xs">HIGH</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-400">Dark Zone Predictor:</span>
                    <span className="text-amber-400 font-mono text-xs">ACTIVE</span>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Recent Kidnapping Hotspots</h5>
              <div className="space-y-3">
                 <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                    <p className="text-[10px] font-bold text-rose-400">Kaduna-Abuja Expressway</p>
                    <p className="text-[9px] text-slate-500 mt-1">High Activity Reported (Last 24h)</p>
                 </div>
                 <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-400">Benin-Ore Highway</p>
                    <p className="text-[9px] text-slate-500 mt-1">Moderate Risk Level</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerEscort;


import React, { useState } from 'react';
import { MOCK_VEHICLES } from '../constants';
import { AssetStatus } from '../types';

const LiveTracking: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(MOCK_VEHICLES[0]);
  const [isPinging, setIsPinging] = useState(false);
  const [activeSignal, setActiveSignal] = useState<'GPS' | 'SIM'>('GPS');

  const handleGhostPing = () => {
    setIsPinging(true);
    setTimeout(() => setIsPinging(false), 3000);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-indigo-900/30 bg-slate-950 shadow-2xl">
        {/* Radar/Grid SVG Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
           <svg width="100%" height="100%">
              <defs>
                 <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="0.5" strokeOpacity="0.2"/>
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tactical-grid)" />
              <circle cx="50%" cy="50%" r="20%" stroke="#4f46e5" strokeWidth="1" strokeDasharray="5 5" fill="none" />
              <circle cx="50%" cy="50%" r="40%" stroke="#4f46e5" strokeWidth="1" strokeDasharray="10 10" fill="none" />
           </svg>
        </div>

        {/* Sonar Scan Line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="w-full h-1 bg-indigo-500/20 absolute animate-[scan_6s_linear_infinite]"></div>
        </div>

        {/* Markers */}
        {MOCK_VEHICLES.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVehicle(v)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              selectedVehicle.id === v.id ? 'z-30' : 'z-20'
            }`}
            style={{ 
              left: `${(v.lng - 36.7) * 2000}%`, 
              top: `${(v.lat + 1.4) * 2000}%` 
            }}
          >
            <div className={`relative flex items-center justify-center`}>
              {v.status === AssetStatus.DEFAULT && <div className="absolute w-12 h-12 bg-rose-500/20 rounded-full animate-ping"></div>}
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-xl ${
                v.status === AssetStatus.ACTIVE ? 'bg-indigo-500 shadow-indigo-500/50' : 
                v.status === AssetStatus.DEFAULT ? 'bg-rose-500 shadow-rose-500/50' : 'bg-slate-500'
              }`}></div>
              {selectedVehicle.id === v.id && (
                <div className="absolute bottom-full mb-3 px-3 py-1 bg-slate-900 border border-indigo-500/50 rounded-lg shadow-2xl animate-in slide-in-from-bottom-2">
                   <span className="text-[10px] font-black text-indigo-400 font-mono italic">{v.plate}</span>
                </div>
              )}
            </div>
          </button>
        ))}

        {/* SIM Triangulation Overlay */}
        {isPinging && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
              <div className="absolute text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Establishing SIM Link...</div>
           </div>
        )}

        {/* HUD: Tactical Telemetry */}
        <div className="absolute top-6 left-6 space-y-4">
           <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-900/30 p-4 rounded-2xl w-56 shadow-2xl">
              <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                 System Telemetry
              </h5>
              <div className="space-y-2 text-[10px] font-mono">
                 <div className="flex justify-between">
                    <span className="text-slate-500">Node Status:</span>
                    <span className="text-emerald-400">ENCRYPTED</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Latency:</span>
                    <span className="text-indigo-400">14ms</span>
                 </div>
              </div>
           </div>
        </div>

        {/* HUD: Focus Target */}
        <div className="absolute bottom-6 right-6 w-80 bg-slate-900/95 backdrop-blur-xl border border-indigo-900/40 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-right-4">
           <div className="flex items-center justify-between mb-6">
              <div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedVehicle.plate}</h3>
                 <p className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">IMEI: {selectedVehicle.imei}</p>
              </div>
              <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                selectedVehicle.status === AssetStatus.ACTIVE ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {selectedVehicle.status}
              </span>
           </div>

           <div className="grid grid-cols-2 gap-4 border-t border-indigo-900/20 pt-6">
              <div className="space-y-1">
                 <span className="text-[9px] font-bold text-slate-500 uppercase">Signal Mode</span>
                 <div className="flex bg-slate-800 rounded-lg p-1">
                    <button onClick={() => setActiveSignal('GPS')} className={`flex-1 py-1 rounded text-[9px] font-black uppercase transition-all ${activeSignal === 'GPS' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>GPS</button>
                    <button onClick={() => setActiveSignal('SIM')} className={`flex-1 py-1 rounded text-[9px] font-black uppercase transition-all ${activeSignal === 'SIM' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>SIM</button>
                 </div>
              </div>
              <div className="space-y-1">
                 <span className="text-[9px] font-bold text-slate-500 uppercase">Power Level</span>
                 <div className="h-6 flex items-center px-3 bg-slate-800 rounded-lg">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: `${selectedVehicle.batteryLevel}%` }}></div>
                    </div>
                    <span className="ml-2 text-[10px] font-mono text-slate-400">{selectedVehicle.batteryLevel}%</span>
                 </div>
              </div>
           </div>

           <div className="mt-6 pt-6 border-t border-indigo-900/20">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Guarantor Protocol</label>
              <div className="space-y-2">
                 {selectedVehicle.guarantors.map((g, i) => (
                   <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-xl border border-indigo-900/10">
                      <div className="flex items-center space-x-3">
                         <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">{g.name[0]}</div>
                         <span className="text-[11px] font-bold text-slate-300">{g.name}</span>
                      </div>
                      <button className="text-[9px] font-black text-indigo-400 hover:text-white transition-colors uppercase">Track SIM</button>
                   </div>
                 ))}
              </div>
           </div>

           <button 
             onClick={handleGhostPing}
             disabled={isPinging}
             className="w-full mt-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20"
           >
             {isPinging ? 'EXECUTING TRIANGULATION...' : 'GHOST PING ASSET'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;


import React, { useState, useEffect, useRef } from 'react';
import { 
  findNearestPoliceStations, performCarrierTriangulation, getNearestStation, detectTheftAnomaly
} from './services';
import { 
  AssetStatus, Vehicle, SignalSource, PoliceStation, TamperStatus
} from './types';
import { MOCK_VEHICLES, MOCK_POLICE_STATIONS } from './services';

export const TacticalMapView = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [selected, setSelected] = useState<Vehicle>(MOCK_VEHICLES[0]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [nearestStation, setNearestStation] = useState<PoliceStation | null>(null);
  const [isTriangulating, setIsTriangulating] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [handshakeLogs, setHandshakeLogs] = useState<{id: string, text: string, time: string}[]>([]);
  
  // Coordinate helper
  const getX = (lng: number) => ((lng - 3.3) / 0.15) * 100;
  const getY = (lat: number) => (1 - (lat - 6.45) / 0.12) * 100;

  // Simulate Real-time Movement & Signal Pings
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        // Only jitter active or infiltrated vehicles
        if (v.status === AssetStatus.LOST_SIGNAL) return v;
        
        const jitterLat = (Math.random() - 0.5) * 0.001;
        const jitterLng = (Math.random() - 0.5) * 0.001;
        
        return {
          ...v,
          lat: v.lat + jitterLat,
          lng: v.lng + jitterLng,
          lastPing: 'Now'
        };
      }));

      // Random handshake log
      const logMsg = `Handshake: ${MOCK_VEHICLES[Math.floor(Math.random() * MOCK_VEHICLES.length)].plate} pinged via ${Math.random() > 0.5 ? 'GHOST_NODE' : 'SHADOW_APP'}`;
      setHandshakeLogs(prev => [{
        id: Math.random().toString(),
        text: logMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }, ...prev].slice(0, 10));

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await findNearestPoliceStations(selected.lat, selected.lng);
        setStations(data);
        setNearestStation(getNearestStation(selected.lat, selected.lng));
      } catch (err) { console.error(err); }
    };
    fetchStations();
  }, [selected.id]);

  const transmitIntelligence = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      alert(`TACTICAL DOSSIER TRANSMITTED.\nStation: ${nearestStation?.name}\nAsset: ${selected.plate}\nStatus: ${selected.status}\nIntegrity: SECURE`);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-[#020408] rounded-[3rem] border border-white/5 overflow-hidden shadow-4xl relative min-h-[700px]">
      
      {/* 1. Tactical Map Canvas */}
      <div className="flex-1 relative overflow-hidden bg-black/40">
        
        {/* Radar Sweep Animation */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(99,102,241,0.05)_50%,transparent_100%)] animate-[spin_8s_linear_infinite]"></div>
          <div className="absolute inset-0 opacity-10">
             <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#tactical-grid-large)" /><defs><pattern id="tactical-grid-large" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="#6366f1" strokeWidth="0.5"/></pattern></defs></svg>
          </div>
        </div>

        {/* SOS Alert Overlay (Flash) */}
        {selected.status === AssetStatus.SOS && (
          <div className="absolute inset-0 bg-rose-600/5 animate-pulse z-0 pointer-events-none"></div>
        )}

        <div className="absolute inset-0 p-12">
          <div className="relative w-full h-full rounded-[4rem] border border-white/5 bg-[#05070a]/60 shadow-inner overflow-hidden">
             
             {/* Map Markers: Vehicles */}
             {vehicles.map(v => (
                <button 
                  key={v.id} 
                  onClick={() => setSelected(v)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 group transition-all duration-1000 ${selected.id === v.id ? 'scale-125' : 'hover:scale-110'}`}
                  style={{ left: `${getX(v.lng)}%`, top: `${getY(v.lat)}%` }}
                >
                   <div className="relative flex items-center justify-center">
                      {/* Outer Pulse */}
                      <div className={`absolute -inset-6 rounded-full animate-ping opacity-20 ${
                        v.status === AssetStatus.SOS ? 'bg-rose-500' : 
                        v.status === AssetStatus.INFILTRATED ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`}></div>
                      
                      {/* Marker Core */}
                      <div className={`w-6 h-6 rounded-full border-4 border-[#020408] shadow-2xl transition-all ${
                        v.status === AssetStatus.SOS ? 'bg-rose-600' :
                        v.status === AssetStatus.INFILTRATED ? 'bg-indigo-600' : 'bg-emerald-500'
                      }`}></div>

                      {/* Plate Label */}
                      <div className={`absolute top-10 whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        selected.id === v.id ? 'bg-white text-slate-950 border-white shadow-xl' : 'bg-slate-900/80 text-slate-400 border-white/10 group-hover:opacity-100 opacity-0'
                      }`}>
                        {v.plate}
                      </div>
                   </div>
                </button>
             ))}

             {/* Map Markers: Police Stations */}
             {MOCK_POLICE_STATIONS.map(ps => (
                <div 
                  key={ps.id} 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ left: `${getX(ps.lng)}%`, top: `${getY(ps.lat)}%` }}
                >
                   <div className="w-12 h-12 flex items-center justify-center bg-rose-600/5 border border-rose-500/20 rounded-2xl shadow-lg backdrop-blur-md group cursor-help">
                      <svg className="w-6 h-6 text-rose-500/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.294 2.712 1.154 5.77a1 1 0 01-1.472 1.065L10 16.12l-3.03 2.507a1 1 0 01-1.472-1.065l1.154-5.77-3.294-2.712a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                      <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-3 py-1 rounded text-[8px] font-black text-rose-400 uppercase tracking-widest border border-rose-500/20">{ps.name}</span>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Floating Controls Overlay */}
        <div className="absolute bottom-10 left-10 z-50 flex gap-4">
           <div className="obsidian-glass rounded-[2rem] px-8 py-5 border border-white/5 flex items-center gap-10 shadow-4xl">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Assets</span>
                 <span className="text-2xl font-black text-white italic">{vehicles.length}</span>
              </div>
              <div className="w-px h-10 bg-white/5"></div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signal Health</span>
                 <span className="text-2xl font-black text-emerald-500 italic">Excellent</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Intelligence Sidebar */}
      <div className="w-full lg:w-[450px] bg-[#05070a] border-l border-white/5 flex flex-col overflow-hidden relative">
         
         {/* Sidebar Header */}
         <div className="p-10 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Command Terminal</h3>
            <div className="flex justify-between items-center">
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">{selected.plate}</h2>
               <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                 selected.status === AssetStatus.ACTIVE ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse'
               }`}>
                  {selected.status}
               </div>
            </div>
         </div>

         {/* Asset Telemetry */}
         <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            
            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Battery Node</p>
                  <div className="flex items-center gap-3">
                     <span className="text-2xl font-black text-white">{selected.batteryLevel}%</span>
                     <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${selected.batteryLevel}%` }}></div>
                     </div>
                  </div>
               </div>
               <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Signal Latency</p>
                  <span className="text-2xl font-black text-indigo-400 italic">14ms</span>
               </div>
            </div>

            {/* Live Handshake Logs */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Signal Handshake Stream
               </h4>
               <div className="space-y-3">
                  {handshakeLogs.map(log => (
                    <div key={log.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center animate-in slide-in-from-right-2">
                       <span className="text-[11px] text-slate-300 font-medium truncate pr-4">{log.text}</span>
                       <span className="text-[9px] font-mono text-slate-600">{log.time}</span>
                    </div>
                  ))}
                  {handshakeLogs.length === 0 && (
                    <p className="text-center py-10 text-[10px] text-slate-700 font-black uppercase italic">Awaiting neural uplink...</p>
                  )}
               </div>
            </div>

            {/* Police Link Handshake */}
            {nearestStation && (
               <div className="p-8 bg-rose-600/5 border border-rose-500/10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-600/30">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.294 2.712 1.154 5.77a1 1 0 01-1.472 1.065L10 16.12l-3.03 2.507a1 1 0 01-1.472-1.065l1.154-5.77-3.294-2.712a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Authority Handshake</p>
                        <h5 className="text-xl font-black text-white italic uppercase tracking-tighter">{nearestStation.name}</h5>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">{nearestStation.address}</p>
                     <p className="text-[10px] font-mono text-rose-400 font-bold uppercase">Proximity: EST_RADIUS_2.4KM</p>
                  </div>
                  <button 
                     onClick={transmitIntelligence}
                     disabled={isTransmitting}
                     className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-600/40"
                  >
                     {isTransmitting ? 'Transmitting Data...' : 'Dispatch Force Assets'}
                  </button>
               </div>
            )}
         </div>

         {/* Selection Sidebar (Mini List) */}
         <div className="p-6 bg-black/80 border-t border-white/5 flex gap-3 overflow-x-auto custom-scrollbar">
            {vehicles.map(v => (
              <button 
                key={v.id}
                onClick={() => setSelected(v)}
                className={`flex-shrink-0 px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                  selected.id === v.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                }`}
              >
                {v.plate}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

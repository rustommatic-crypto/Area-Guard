
import React, { useState, useRef, useEffect } from 'react';
import { 
  analyzeLandmark, generateRecoveryPlan, findNearestPoliceStations, performCarrierTriangulation, getNearestStation, MOCK_POLICE_STATIONS, detectTheftAnomaly
} from './services';
import { 
  AssetStatus, Vehicle, SignalSource, PoliceStation, TamperStatus
} from './types';
import { MOCK_VEHICLES } from './constants';

export { default as DashboardView } from './components/Dashboard';
export { default as EnrollmentView } from './components/LeaseRegistry';
export { default as LandmarkIntelView } from './components/LandmarkIntel';
export { default as AssetRecoveryView } from './components/AssetRecovery';
export { default as ForensicAuditView } from './components/ForensicAudit';
export { default as BillingPanelView } from './components/BillingPanel';
export { default as LandingPageView } from './components/LandingPage';
export { default as AgentDeploymentView } from './components/AgentDeployment';
export { default as PassengerEscortView } from './components/PassengerEscort';
export { default as PublicDashboard } from './components/PublicDashboard';

export const TacticalMapView = () => {
  const [selected, setSelected] = useState<Vehicle>(MOCK_VEHICLES[0]);
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [nearestStation, setNearestStation] = useState<PoliceStation | null>(null);
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [isTriangulating, setIsTriangulating] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [simResult, setSimResult] = useState<{lat: number, lng: number, radius: number} | null>(null);
  const [anomalyReport, setAnomalyReport] = useState<string | null>(null);

  // Coordinate Mapping Logic: Standardized for Lagos Metro area (6.4 - 6.6 N, 3.2 - 3.5 E)
  const getX = (lng: number) => ((lng - 3.3) / 0.15) * 100;
  const getY = (lat: number) => (1 - (lat - 6.45) / 0.12) * 100;

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await findNearestPoliceStations(selected.lat, selected.lng);
        setStations(data);
        setNearestStation(getNearestStation(selected.lat, selected.lng));
      } catch (err) { console.error(err); }
    };
    fetchStations();
  }, [selected]);

  const handleSimProbe = async () => {
    if (!emergencyPhone) return;
    setIsTriangulating(true);
    setAnomalyReport(null);
    try {
      const data = await performCarrierTriangulation(emergencyPhone);
      setSimResult(data as any);
      
      // Integrate real Gemini anomaly detection on the ping
      const report = await detectTheftAnomaly(selected);
      setAnomalyReport(report);
    } catch (err) { console.error(err); }
    finally { setIsTriangulating(false); }
  };

  const transmitIntelligence = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      alert(`TACTICAL DOSSIER TRANSMITTED.\nStation: ${nearestStation?.name}\nAsset: ${selected.plate}\nStatus: ${selected.status}\nIntegrity: SECURE`);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-950 rounded-[2.5rem] border border-emerald-900/20 overflow-hidden shadow-2xl relative min-h-[600px]">
      <div className="flex-1 relative overflow-hidden bg-slate-950/50">
        {/* Tactical Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#tactical-grid)" /><defs><pattern id="tactical-grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#10b981" strokeWidth="0.5"/></pattern></defs></svg>
        </div>

        {isTransmitting && (
           <div className="absolute inset-0 z-[60] bg-rose-950/40 backdrop-blur-md flex items-center justify-center p-12 text-center pointer-events-none animate-in fade-in duration-500">
              <div className="flex flex-col items-center">
                 <div className="w-40 h-40 relative mb-8">
                    <div className="absolute inset-0 border-4 border-rose-500 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-0 border-4 border-rose-500 rounded-full flex items-center justify-center">
                       <svg className="w-20 h-20 text-rose-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                 </div>
                 <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Emergency Signal Burst</h4>
                 <p className="text-rose-400 text-xs font-black uppercase tracking-widest mt-2 animate-pulse">Establishing Command Handshake...</p>
              </div>
           </div>
        )}

        {/* Map Viewport */}
        <div className="absolute inset-0 p-10">
          <div className="relative w-full h-full border border-white/5 rounded-[3rem] bg-black/40 overflow-hidden">
             {simResult && (
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000" style={{ left: `${getX(simResult.lng)}%`, top: `${getY(simResult.lat)}%` }}>
                   <div className="w-48 h-48 bg-amber-500/5 border-2 border-dashed border-amber-500/30 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                   </div>
                </div>
             )}

             {MOCK_VEHICLES.map(v => (
                <button 
                  key={v.id} 
                  onClick={() => { setSelected(v); setSimResult(null); setAnomalyReport(null); }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-500"
                  style={{ left: `${getX(v.lng)}%`, top: `${getY(v.lat)}%` }}
                >
                   <div className="relative">
                      <div className={`w-5 h-5 rounded-full border-2 border-white shadow-2xl transition-all ${
                        v.tamperStatus !== TamperStatus.SECURE ? 'bg-rose-500 animate-pulse scale-150 ring-4 ring-rose-500/20' :
                        v.source === SignalSource.SHADOW_APP ? 'bg-emerald-500 shadow-emerald-500/50 scale-125' : 'bg-indigo-500 shadow-indigo-500/50'
                      }`}></div>
                      {selected.id === v.id && <div className="absolute -inset-4 bg-white/20 rounded-full animate-ping pointer-events-none"></div>}
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-white whitespace-nowrap bg-slate-900/90 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all uppercase tracking-tighter border border-white/10">{v.plate}</span>
                   </div>
                </button>
             ))}

             {MOCK_POLICE_STATIONS.map(ps => (
                <div 
                  key={ps.id} 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
                  style={{ left: `${getX(ps.lng)}%`, top: `${getY(ps.lat)}%` }}
                >
                   <div className="w-10 h-10 flex items-center justify-center bg-rose-600/10 border border-rose-500/30 rounded-2xl shadow-lg backdrop-blur-sm">
                      <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.294 2.712 1.154 5.77a1 1 0 01-1.472 1.065L10 16.12l-3.03 2.507a1 1 0 01-1.472-1.065l1.154-5.77-3.294-2.712a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="absolute top-10 left-10 z-50 w-80 bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/20 p-6 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
           <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Tactical MSISDN Intercept
           </h5>
           <input 
              type="text" 
              placeholder="Target MSISDN / ICCID..." 
              className="w-full bg-black/60 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm font-mono text-emerald-200 outline-none mb-4 focus:border-emerald-500"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
           />
           <button 
             onClick={handleSimProbe}
             disabled={isTriangulating}
             className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-xl shadow-emerald-600/20"
           >
             {isTriangulating ? 'Triangulating Node...' : 'Establish Ghost Ping'}
           </button>

           {anomalyReport && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-in zoom-in-95">
                 <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">Anomaly Detected</p>
                 <p className="text-[10px] text-amber-200/80 leading-relaxed font-medium italic">"{anomalyReport}"</p>
              </div>
           )}
        </div>
      </div>

      <div className="w-full lg:w-[400px] bg-slate-900/80 backdrop-blur-3xl border-l border-white/5 p-8 space-y-8 overflow-y-auto custom-scrollbar flex flex-col">
         <div className="flex justify-between items-start border-b border-white/5 pb-6">
            <div>
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{selected.plate}</h3>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{selected.driverName}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
               <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                 selected.status === AssetStatus.ACTIVE ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white animate-pulse'
               }`}>
                 {selected.status}
               </div>
               <span className="text-[8px] text-slate-600 font-mono tracking-widest uppercase">Sync: {selected.lastPing}</span>
            </div>
         </div>

         <div className="bg-rose-950/20 border border-rose-500/20 p-6 rounded-[2rem] space-y-5 shadow-xl">
            <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center">
               <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.294 2.712 1.154 5.77a1 1 0 01-1.472 1.065L10 16.12l-3.03 2.507a1 1 0 01-1.472-1.065l1.154-5.77-3.294-2.712a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
               Command Handshake
            </h4>
            {nearestStation && (
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-lg font-black text-white italic tracking-tight">{nearestStation.name}</span>
                     <span className="text-[10px] text-rose-400 font-mono font-bold">{stations.find(s => s.id === nearestStation.id)?.distance || '---'}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{nearestStation.address}</p>
                  <button 
                     onClick={transmitIntelligence}
                     disabled={isTransmitting}
                     className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-600/30"
                  >
                     {isTransmitting ? 'Transmitting Intelligence...' : 'Authorize Tactical Handshake'}
                  </button>
               </div>
            )}
         </div>

         <div className="space-y-4 flex-1">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
               <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
               Signal Infiltration Graph
            </h4>
            <div className="space-y-3">
               {selected.agent?.scrapedContacts?.map((contact, i) => (
                 <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all flex justify-between items-center group">
                    <div>
                       <p className="text-sm font-bold text-white tracking-tight">{contact.name}</p>
                       <p className="text-[10px] text-slate-500 font-mono mt-0.5">{contact.phone} | {contact.callFrequency} calls</p>
                    </div>
                    {contact.isTrackable && (
                      <button 
                        onClick={() => { setEmergencyPhone(contact.phone); handleSimProbe(); }}
                        className="px-3 py-1.5 bg-indigo-600 rounded-lg text-[9px] font-black text-white uppercase shadow-lg shadow-indigo-600/20 active:scale-90 transition-all"
                      >
                        Ping
                      </button>
                    )}
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

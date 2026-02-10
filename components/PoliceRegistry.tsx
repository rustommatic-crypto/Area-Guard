
import React, { useState } from 'react';
import { MOCK_POLICE_STATIONS, addPoliceStation } from '../services';
import { searchPoliceStationsOnMap } from '../geminiService';
import { PoliceStation } from '../types';

const PoliceRegistry: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PoliceStation[]>([]);
  const [manualStation, setManualStation] = useState<Partial<PoliceStation>>({
    name: '', address: '', phone: '', lat: 6.5, lng: 3.3, commandLevel: 'Division'
  });

  const handleMapSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      // Uses the Stage 1 & 2 process in geminiService to get clean JSON from Maps Tool
      const results = await searchPoliceStationsOnMap(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      alert("Intelligence Recon failed. Check Maps grounding status.");
    } finally {
      setIsSearching(false);
    }
  };

  const saveStation = (station: PoliceStation) => {
    addPoliceStation({ ...station, id: `ps-${Date.now()}` });
    setShowAddModal(false);
    setSearchResults([]);
    alert(`Command Center ${station.name} synchronized with Area Guard network.`);
  };

  const handleManualSubmit = () => {
    if (manualStation.name && manualStation.phone) {
      saveStation(manualStation as PoliceStation);
    } else {
      alert("Incomplete data. Manual registration requires Name and Emergency Phone.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Force Command Registry</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Manage tactical law enforcement handshake nodes.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-3 bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-[1.8rem] text-[11px] font-black transition-all shadow-xl shadow-rose-500/20 uppercase tracking-widest"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          <span>Enroll New Command</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_POLICE_STATIONS.map((ps) => (
          <div key={ps.id} className="obsidian-glass border border-white/5 p-8 rounded-[2.5rem] hover:border-rose-500/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-100 transition-opacity">
                <svg className="w-10 h-10 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.294 2.712 1.154 5.77a1 1 0 01-1.472 1.065L10 16.12l-3.03 2.507a1 1 0 01-1.472-1.065l1.154-5.77-3.294-2.712a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
             </div>
             <h4 className="text-xl font-black text-white italic tracking-tight mb-1">{ps.name}</h4>
             <span className="text-[9px] font-black bg-rose-500/10 text-rose-400 px-3 py-1 rounded-lg uppercase mb-6 inline-block tracking-widest border border-rose-500/10">{ps.commandLevel}</span>
             
             <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                   <svg className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                   <span>{ps.address}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-emerald-400 font-mono font-bold">
                   <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   <span>{ps.phone}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Digital Link: Active</span>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-white/10 w-full max-w-5xl rounded-[3rem] shadow-4xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
              {/* Left Panel: Gemini Recon */}
              <div className="w-full md:w-1/2 bg-slate-950 p-10 border-r border-white/5 space-y-8 flex flex-col">
                 <div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">AI Command Recon</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mt-3">Execute Google Maps Grounding via Gemini 2.5</p>
                 </div>
                 
                 <div className="flex gap-3">
                    <input 
                       type="text" 
                       placeholder="e.g. Police Stations in Lekki Phase 1"
                       className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-rose-500/50 placeholder:text-slate-600"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
                    />
                    <button 
                      onClick={handleMapSearch}
                      disabled={isSearching || !searchQuery}
                      className="px-8 py-4 bg-indigo-600 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                    >
                      {isSearching ? 'SCRENNING...' : 'INITIATE'}
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                    {searchResults.length === 0 && !isSearching && (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                         <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-dashed border-white/20">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth={1}/></svg>
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">System Awaiting Map Recon Parameters.<br/>Enter target region above.</p>
                      </div>
                    )}
                    {isSearching && (
                      <div className="h-full flex flex-col items-center justify-center space-y-6">
                         <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                         <div className="text-center">
                            <p className="text-[10px] font-mono text-indigo-400 animate-pulse tracking-widest uppercase font-black">Querying_Maps_Grounding_V2</p>
                            <p className="text-[9px] text-slate-500 uppercase mt-2">Authenticating Digital Handshake...</p>
                         </div>
                      </div>
                    )}
                    {searchResults.map((res, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[1.8rem] hover:bg-white/10 transition-all flex justify-between items-center group shadow-lg">
                         <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-black text-white italic truncate">{res.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase truncate mt-1">{res.address}</p>
                            <p className="text-[10px] text-emerald-500 font-mono mt-1">{res.lat.toFixed(4)}, {res.lng.toFixed(4)}</p>
                         </div>
                         <button 
                            onClick={() => saveStation(res)}
                            className="p-3 bg-emerald-600 rounded-xl text-slate-950 transition-all hover:scale-110 active:scale-95 shadow-xl shadow-emerald-500/20"
                         >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Right Panel: Manual Deployment */}
              <div className="w-full md:w-1/2 p-10 space-y-8 overflow-y-auto">
                 <div className="flex justify-between items-start">
                    <div>
                       <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Manual Protocol</h4>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-3">Register verified force assets</p>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="w-12 h-12 rounded-2xl obsidian-glass flex items-center justify-center text-slate-500 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg></button>
                 </div>

                 <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Command Center Name</label>
                       <input type="text" placeholder="e.g. Ajah Division Command" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-rose-500/50 outline-none transition-all" value={manualStation.name} onChange={e => setManualStation({...manualStation, name: e.target.value})}/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Physical Address</label>
                       <input type="text" placeholder="Full street address..." className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-rose-500/50 outline-none transition-all" value={manualStation.address} onChange={e => setManualStation({...manualStation, address: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Emergency Line</label>
                          <input type="text" placeholder="+234 ..." className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm text-emerald-400 font-mono outline-none focus:border-rose-500/50" value={manualStation.phone} onChange={e => setManualStation({...manualStation, phone: e.target.value})}/>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Clearance Level</label>
                          <select className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none focus:border-rose-500/50" value={manualStation.commandLevel} onChange={e => setManualStation({...manualStation, commandLevel: e.target.value as any})}>
                             <option>Division</option>
                             <option>Area</option>
                             <option>State</option>
                             <option>Zonal</option>
                          </select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Liaison Officer</label>
                       <input type="text" placeholder="e.g. CSP Adebayo" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-rose-500/50" value={manualStation.contactPerson} onChange={e => setManualStation({...manualStation, contactPerson: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latitude</label>
                          <input type="number" step="0.0001" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-3 text-xs text-white font-mono outline-none" value={manualStation.lat} onChange={e => setManualStation({...manualStation, lat: parseFloat(e.target.value)})}/>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Longitude</label>
                          <input type="number" step="0.0001" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-3 text-xs text-white font-mono outline-none" value={manualStation.lng} onChange={e => setManualStation({...manualStation, lng: parseFloat(e.target.value)})}/>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handleManualSubmit}
                   className="w-full py-6 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-[1.8rem] text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/30 mt-8 transition-all active:scale-95"
                 >
                   Establish Command Presence
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PoliceRegistry;

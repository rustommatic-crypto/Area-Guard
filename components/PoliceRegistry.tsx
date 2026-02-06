
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
    try {
      const results = await searchPoliceStationsOnMap(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const saveStation = (station: PoliceStation) => {
    addPoliceStation({ ...station, id: `ps-${Date.now()}` });
    setShowAddModal(false);
    setSearchResults([]);
  };

  const handleManualSubmit = () => {
    if (manualStation.name && manualStation.phone) {
      saveStation(manualStation as PoliceStation);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Law Enforcement Network</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage command centers for rapid response coordination.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl text-[10px] font-black transition-all shadow-lg shadow-rose-500/20 uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          <span>Register New Station</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_POLICE_STATIONS.map((ps) => (
          <div key={ps.id} className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl hover:border-rose-500/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.294 2.712 1.154 5.77a1 1 0 01-1.472 1.065L10 16.12l-3.03 2.507a1 1 0 01-1.472-1.065l1.154-5.77-3.294-2.712a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
             </div>
             <h4 className="text-lg font-bold text-white mb-1">{ps.name}</h4>
             <span className="text-[9px] font-black bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded uppercase mb-4 inline-block">{ps.commandLevel}</span>
             <div className="space-y-2 mt-2">
                <div className="flex items-start gap-2 text-xs text-slate-400">
                   <svg className="w-3.5 h-3.5 text-slate-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                   <span>{ps.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                   <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   <span>{ps.phone}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-2">Contact: {ps.contactPerson || 'Duty Officer'}</p>
             </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
              {/* Left Panel: AI Recon */}
              <div className="w-full md:w-1/2 bg-slate-950 p-8 border-r border-white/5 space-y-6 flex flex-col">
                 <div>
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">AI Command Recon</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Search via Google Maps API</p>
                 </div>
                 
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       placeholder="Enter City, State or LG..."
                       className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-rose-500/50"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                      onClick={handleMapSearch}
                      disabled={isSearching || !searchQuery}
                      className="px-6 py-3 bg-indigo-600 rounded-xl text-white text-[10px] font-black uppercase disabled:opacity-30"
                    >
                      {isSearching ? 'SCRENNING...' : 'RECON'}
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {searchResults.length === 0 && !isSearching && (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                         <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                         <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Recon Data</p>
                      </div>
                    )}
                    {isSearching && (
                      <div className="h-full flex flex-col items-center justify-center space-y-4">
                         <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                         <p className="text-[10px] font-mono text-indigo-400 animate-pulse">QUERYING_MAPS_GROUNDING...</p>
                      </div>
                    )}
                    {searchResults.map((res, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
                         <div className="flex-1">
                            <p className="text-sm font-bold text-white">{res.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{res.address}</p>
                         </div>
                         <button 
                            onClick={() => saveStation(res)}
                            className="opacity-0 group-hover:opacity-100 p-2 bg-emerald-600 rounded-lg text-slate-950 transition-all"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Right Panel: Manual Entry */}
              <div className="w-full md:w-1/2 p-8 space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                       <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Manual Protocol</h4>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Register offline assets</p>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                 </div>

                 <div className="space-y-4">
                    <input type="text" placeholder="Station Name" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={manualStation.name} onChange={e => setManualStation({...manualStation, name: e.target.value})}/>
                    <input type="text" placeholder="Command Address" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={manualStation.address} onChange={e => setManualStation({...manualStation, address: e.target.value})}/>
                    <div className="grid grid-cols-2 gap-4">
                       <input type="text" placeholder="Emergency Phone" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono" value={manualStation.phone} onChange={e => setManualStation({...manualStation, phone: e.target.value})}/>
                       <select className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none" value={manualStation.commandLevel} onChange={e => setManualStation({...manualStation, commandLevel: e.target.value as any})}>
                          <option>Division</option>
                          <option>Area</option>
                          <option>State</option>
                          <option>Zonal</option>
                       </select>
                    </div>
                    <input type="text" placeholder="Contact Person (e.g. ACP John Doe)" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" value={manualStation.contactPerson} onChange={e => setManualStation({...manualStation, contactPerson: e.target.value})}/>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-600 uppercase">Latitude</label>
                          <input type="number" step="0.0001" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" value={manualStation.lat} onChange={e => setManualStation({...manualStation, lat: parseFloat(e.target.value)})}/>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-600 uppercase">Longitude</label>
                          <input type="number" step="0.0001" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" value={manualStation.lng} onChange={e => setManualStation({...manualStation, lng: parseFloat(e.target.value)})}/>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handleManualSubmit}
                   className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-rose-500/20 mt-8"
                 >
                   Confirm Command Registration
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PoliceRegistry;

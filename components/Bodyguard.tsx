
import React, { useState } from 'react';
import { analyzeLandmark } from '../geminiService';

const Bodyguard: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [threatLevel, setThreatLevel] = useState('NORMAL');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Guardian Layer</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Intra-city movement protocol active</p>
        </div>
        <div className={`px-6 py-2 rounded-full border flex items-center gap-3 transition-colors ${
          threatLevel === 'NORMAL' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${threatLevel === 'NORMAL' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Environment: {threatLevel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="obsidian-glass rounded-[3rem] p-10 border border-white/5 space-y-8">
          <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Environmental Scan</h4>
          <p className="text-slate-400 text-xs leading-relaxed">Mustapha analyzes your immediate surroundings from uploaded imagery to identify potential risks or tactical advantages.</p>
          
          <div className="aspect-video bg-black/40 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center group cursor-pointer hover:border-indigo-500/30 transition-all">
            <svg className="w-12 h-12 text-slate-600 mb-4 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth={1.5}/></svg>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Environmental Image</p>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Mustapha's Recon Notes</h5>
            <p className="text-[11px] text-slate-400 italic">"Waiting for imagery to identify landmarks and security topology."</p>
          </div>
        </div>

        <div className="space-y-6">
           <div className="obsidian-glass rounded-[3rem] p-10 border border-white/5">
              <h4 className="text-xl font-black text-white italic uppercase tracking-tight mb-6">Active Escort</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Movement Check-in', time: 'Every 15m', status: 'ON' },
                   { label: 'Proactive Dialing', time: 'Suspicious Shift', status: 'ON' },
                   { label: 'Family Notification', time: 'Emergency Only', status: 'ON' },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                         <p className="text-xs font-bold text-white uppercase">{item.label}</p>
                         <p className="text-[9px] text-slate-500 uppercase font-bold">{item.time}</p>
                      </div>
                      <span className="text-[9px] font-black text-emerald-500 tracking-widest">{item.status}</span>
                   </div>
                 ))}
              </div>
           </div>

           <button 
             onClick={() => setThreatLevel('ALERT')}
             className="w-full py-8 bg-rose-600 text-white rounded-[2.5rem] font-black text-xl italic uppercase tracking-tighter shadow-3xl shadow-rose-600/30 active:scale-95 transition-all"
           >
             Trigger Tactical SOS
           </button>
        </div>
      </div>
    </div>
  );
};

export default Bodyguard;

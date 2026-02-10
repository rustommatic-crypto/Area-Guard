
import React, { useState } from 'react';

const FamilyShield: React.FC = () => {
  const members = [
    { name: 'Kemi (Daughter)', status: 'SECURE', battery: '82%', location: 'Lekki Phase 1', musti: 'Chatting about school' },
    { name: 'Tunde (Son)', status: 'WATCHING', battery: '14%', location: 'Surulere', musti: 'Location deviation detected' },
    { name: 'Abiola (Wife)', status: 'SECURE', battery: '95%', location: 'Victoria Island', musti: 'Safe at office' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Family Shield Command</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">₦20,000/mo Unified Protection tier</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Add New Member</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           {members.map((member, i) => (
             <div key={i} className="obsidian-glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-6">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black ${
                     member.status === 'SECURE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500 animate-pulse'
                   }`}>
                      {member.name[0]}
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-white italic uppercase">{member.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{member.location} | Battery: {member.battery}</p>
                   </div>
                </div>
                <div className="text-center md:text-right bg-black/40 p-4 rounded-2xl border border-white/5 min-w-[250px]">
                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Mustapha's Interaction</p>
                   <p className="text-xs text-slate-300 font-medium leading-tight">"{member.musti}"</p>
                </div>
                <button className="px-5 py-2 bg-white/5 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Track SIM</button>
             </div>
           ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="obsidian-glass rounded-[3rem] p-10 border border-white/5 h-full flex flex-col justify-between">
              <div>
                 <h4 className="text-xl font-black text-white italic uppercase tracking-tight mb-6">Shield Summary</h4>
                 <div className="space-y-6">
                    <div className="flex justify-between text-xs">
                       <span className="font-bold text-slate-500 uppercase">Members Protected</span>
                       <span className="text-white font-black">03 / 05</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="font-bold text-slate-500 uppercase">Active Conversations</span>
                       <span className="text-indigo-400 font-black">02</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="font-bold text-slate-500 uppercase">Alerts (24h)</span>
                       <span className="text-rose-500 font-black">01</span>
                    </div>
                 </div>
              </div>
              
              <div className="mt-12 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Family Group Logic</p>
                 <p className="text-[11px] text-slate-400 leading-relaxed italic">"Mustapha is currently syncing school schedules to detect unauthorized route changes."</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyShield;

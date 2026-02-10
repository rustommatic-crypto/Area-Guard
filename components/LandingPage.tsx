
import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onEnter: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden bg-[#020408]">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-indigo-600/5 blur-[250px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-0 w-[900px] h-[900px] bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none"></div>
      
      {/* Decorative HUD Elements */}
      <div className="absolute top-10 left-10 opacity-20 hidden lg:block">
        <div className="w-40 h-1 bg-white/10 mb-2"></div>
        <div className="w-20 h-1 bg-indigo-500/30"></div>
        <p className="text-[8px] font-mono mt-4 tracking-widest text-slate-500">COORD: 6.5244° N / 3.3792° E</p>
      </div>

      <div className="max-w-7xl mx-auto w-full text-center space-y-16 relative z-10">
        
        {/* Version Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2.5 obsidian-glass rounded-full border border-white/10 mb-4 group hover:border-emerald-500/50 transition-all cursor-crosshair">
          <div className="relative">
            <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-40"></span>
          </div>
          <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-[0.5em]">System.Area.Core.v4.8</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <p className="text-indigo-400 font-mono text-sm md:text-2xl font-bold tracking-[1em] uppercase animate-in slide-in-from-top-4 duration-1000">
            [ Area ]
          </p>
          <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase italic leading-[0.75] drop-shadow-2xl flex flex-col items-center select-none">
            <span className="text-white">Security</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-indigo-600 glow-text py-4">Plug</span>
          </h1>
        </div>
        
        <div className="flex flex-col items-center space-y-10 max-w-4xl mx-auto">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          <p className="text-2xl md:text-4xl font-black text-slate-100 tracking-wide italic uppercase">
            Safeguarding Lives & Capital
          </p>
          <p className="text-slate-400 text-base md:text-xl leading-relaxed font-medium max-w-2xl">
            Meet Mustapha—your proactive AI security buddy. From elite travel escorts 
            to employee background infiltration. Musti owns the landscape.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-10 pt-16">
           <button 
             onClick={() => onEnter('PUBLIC')}
             className="group relative px-16 py-9 bg-white text-slate-950 font-black rounded-[3rem] shadow-4xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.4em] flex items-center gap-5 overflow-hidden"
           >
             <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors"></div>
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2.5}/></svg>
             Enter Secure Portal
           </button>

           <button 
             onClick={() => onEnter('OPERATOR')}
             className="group px-16 py-9 obsidian-glass text-white font-black rounded-[3rem] transition-all hover:border-indigo-500/50 hover:shadow-[0_0_60px_rgba(99,102,241,0.25)] active:scale-95 text-xs uppercase tracking-[0.4em] border border-white/10 flex items-center gap-5 shadow-2xl overflow-hidden"
           >
             <svg className="w-7 h-7 text-indigo-400 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2.5}/></svg>
             Initialize Hub Command
           </button>
        </div>

        {/* Tactical Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-60 w-full text-left">
          {[
            { 
              title: 'Musti Escort', 
              desc: 'Intelligent AI voice companion for movement security. Features proactive acoustic pattern recognition and tactical advice.', 
              icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
            },
            { 
              title: 'Trojan Verify', 
              desc: 'Elite employee onboarding. Stealth background agents and behavioral audits ensure 100% mission integrity.', 
              icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            },
            { 
              title: 'Force Burst', 
              desc: 'Direct encrypted handshake with Law Enforcement. High-speed SOS transmission to authorized response units.', 
              icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            }
          ].map((feature, i) => (
            <div key={i} className="obsidian-glass p-12 rounded-[4rem] group hover:border-white/20 transition-all border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <svg className="w-28 h-28" fill="currentColor" viewBox="0 0 24 24"><path d={feature.icon}/></svg>
              </div>
              <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-indigo-500/10 transition-all border border-white/5 group-hover:border-indigo-500/30">
                <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic leading-none">{feature.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onEnter: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden bg-[#020408]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-indigo-600/5 blur-[250px] rounded-full pointer-events-none animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto w-full text-center space-y-16 relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 obsidian-glass rounded-full border border-white/10 mb-4 group hover:border-emerald-500/50 transition-all cursor-crosshair">
          <div className="relative">
            <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-[0.5em]">System.Area.Core.v4.8</span>
        </div>

        <div className="space-y-4">
          <p className="text-indigo-400 font-mono text-sm md:text-2xl font-bold tracking-[1em] uppercase">
            [ Area ]
          </p>
          <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase italic leading-[0.75] flex flex-col items-center select-none">
            <span className="text-white">Security</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-indigo-600 glow-text py-4">Plug</span>
          </h1>
        </div>
        
        <div className="flex flex-col items-center space-y-10 max-w-4xl mx-auto">
          <p className="text-2xl md:text-4xl font-black text-slate-100 tracking-wide italic uppercase">
            Safeguarding Lives & Capital
          </p>
          <p className="text-slate-400 text-base md:text-xl leading-relaxed font-medium max-w-2xl">
            Meet Mustapha—your proactive AI security buddy. From elite travel escorts 
            to Musti Pin employee verification. Musti owns the landscape.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-10 pt-16">
           <button onClick={() => onEnter('PUBLIC')} className="group relative px-16 py-9 bg-white text-slate-950 font-black rounded-[3rem] shadow-4xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.4em] flex items-center gap-5 overflow-hidden">
             Enter Secure Portal
           </button>
           <button onClick={() => onEnter('OPERATOR')} className="group px-16 py-9 obsidian-glass text-white font-black rounded-[3rem] transition-all hover:border-indigo-500/50 hover:shadow-[0_0_60px_rgba(99,102,241,0.25)] active:scale-95 text-xs uppercase tracking-[0.4em] border border-white/10 flex items-center gap-5 shadow-2xl overflow-hidden">
             Initialize Hub Command
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-60 w-full text-left">
          {[
            { title: 'Musti Escort', desc: 'Intelligent AI voice companion for movement security. Features proactive acoustic pattern recognition.' },
            { title: 'Musti Verify', desc: 'Elite employee onboarding via the Musti Pin protocol. Background agents ensure 100% mission integrity.' },
            { title: 'Force Burst', desc: 'Direct encrypted handshake with Law Enforcement. High-speed SOS transmission to response units.' }
          ].map((feature, i) => (
            <div key={i} className="obsidian-glass p-12 rounded-[4rem] group hover:border-white/20 transition-all border border-white/5 shadow-2xl">
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

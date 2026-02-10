
import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onEnter: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden bg-[#020408]">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[180px] rounded-full pointer-events-none"></div>
      
      {/* Digital Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[1px] bg-white/5 absolute top-0 animate-[scan_8s_linear_infinite]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full text-center space-y-12 relative z-10">
        
        {/* Version Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 obsidian-glass rounded-full border border-white/10 mb-2 group hover:border-emerald-500/50 transition-all cursor-crosshair">
          <div className="relative">
            <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-40"></span>
          </div>
          <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-[0.4em]">v4.8 Sentinel Engine Active</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-2">
          <p className="text-indigo-400 font-mono text-sm md:text-xl font-bold tracking-[0.8em] uppercase animate-in slide-in-from-top-4 duration-1000">
            [ Area ]
          </p>
          <h1 className="text-6xl md:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl flex flex-col items-center">
            <span className="text-white">Security</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-500 to-indigo-700 glow-text">Plug</span>
          </h1>
        </div>
        
        <div className="flex flex-col items-center space-y-8 max-w-3xl mx-auto">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          <p className="text-xl md:text-3xl font-black text-slate-100 tracking-wide italic uppercase italic">
            Safeguarding Lives & Capital
          </p>
          <p className="text-slate-400 text-sm md:text-lg leading-relaxed font-medium">
            Meet Mustapha—your proactive AI security buddy. From elite travel escorts to 
            employee background infiltration and real-time distress monitoring. 
            Musti owns the landscape. 24/7.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 pt-12">
           <button 
             onClick={() => onEnter('PUBLIC')}
             className="group relative px-14 py-8 bg-white text-slate-950 font-black rounded-[2.5rem] shadow-4xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.3em] flex items-center gap-4 overflow-hidden"
           >
             <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors"></div>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2.5}/></svg>
             Enter Secure Portal
           </button>

           <button 
             onClick={() => onEnter('OPERATOR')}
             className="group px-14 py-8 obsidian-glass text-white font-black rounded-[2.5rem] transition-all hover:border-indigo-500 hover:shadow-[0_0_50px_rgba(99,102,241,0.25)] active:scale-95 text-xs uppercase tracking-[0.3em] border border-white/10 flex items-center gap-4 shadow-2xl overflow-hidden"
           >
             <svg className="w-6 h-6 text-indigo-400 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2.5}/></svg>
             Initialize Hub Command
           </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48 w-full text-left">
          {[
            { 
              title: 'Musti Escort', 
              desc: 'Intelligent AI voice companion for movement security. Features proactive acoustic pattern recognition and real-time tactical advice.', 
              icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
            },
            { 
              title: 'Trojan Verify', 
              desc: 'Elite employee & guarantor onboarding. Stealth background agents and behavioral audits ensure 100% mission integrity.', 
              icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            },
            { 
              title: 'Force Burst', 
              desc: 'Direct encrypted handshake with Law Enforcement. High-speed SOS transmission to authorized response units and family nodes.', 
              icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            }
          ].map((feature, i) => (
            <div key={i} className="obsidian-glass p-10 rounded-[3.5rem] group hover:border-white/20 transition-all border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d={feature.icon}/></svg>
              </div>
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-500/10 transition-all border border-white/5 group-hover:border-indigo-500/30">
                <svg className={`w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic leading-none">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

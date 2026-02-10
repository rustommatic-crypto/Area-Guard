
import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onEnter: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center py-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 blur-[180px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="text-center space-y-10 relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 obsidian-glass rounded-full border border-white/10 mb-6 group hover:border-emerald-500/50 transition-all cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Mustapha Ecosystem | v4.5 Sentinel</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">
          <span className="text-slate-100">Security</span> <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-indigo-400 to-indigo-600">Plug</span>
        </h1>
        
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl md:text-2xl font-black text-indigo-400 tracking-widest italic uppercase"> Safeguarding Lives & Capital</p>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
            Meet Mustapha—your proactive AI security buddy. From interstate travel escorts to 
            employee background infiltration and real-time distress monitoring. 
            Musti has your back, 24/7.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-12">
           <button 
             onClick={() => onEnter('PUBLIC')}
             className="group relative px-12 py-6 bg-white text-slate-950 font-black rounded-[2.5rem] shadow-4xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest flex items-center gap-3"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2.5}/></svg>
             Access Security Portal
           </button>

           <button 
             onClick={() => onEnter('OPERATOR')}
             className="group px-12 py-6 obsidian-glass text-white font-black rounded-[2.5rem] transition-all hover:border-indigo-500/50 active:scale-95 text-xs uppercase tracking-widest border border-white/10 flex items-center gap-3 shadow-2xl"
           >
             <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2.5}/></svg>
             Initialize Hub Command
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 w-full relative z-10">
        {[
          { title: 'Musti Escort', desc: 'Real-time AI voice buddy for intra-city movements. Proactive acoustic monitoring and tactical advice.', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
          { title: 'Trojan Onboarding', desc: 'Securely verify and monitor employees/guarantors. Stealth background agents ensure total mission integrity.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { title: 'Rapid Dispatch', desc: 'Encrypted direct handshake with Regional Police Commands. High-speed SOS transmission to family & friends.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
        ].map((feature, i) => (
          <div key={i} className="obsidian-glass p-12 rounded-[3.5rem] group hover:border-emerald-500/30 transition-all border border-white/5 shadow-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-500/10 transition-colors">
              <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter italic">{feature.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;

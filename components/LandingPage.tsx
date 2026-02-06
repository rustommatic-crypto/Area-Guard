
import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onEnter: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center py-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Hero Visual Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 obsidian-glass rounded-full border border-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.3em]">System Status: Secure / v4.2.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] drop-shadow-2xl">
          <span className="text-slate-200">Area</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-indigo-400 to-indigo-600">Guard</span>
        </h1>
        
        <div className="flex flex-col items-center space-y-2">
          <p className="text-lg md:text-xl font-medium text-slate-400 tracking-tight italic uppercase">Assets & Persons</p>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            Military-grade Signal Intelligence for commercial fleet recovery. <br className="hidden md:block"/>
            Protect your capital with predictive surveillance and neural-linked tracking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
           {/* Public Entry */}
           <button 
             onClick={() => onEnter('PUBLIC')}
             className="group relative px-10 py-5 bg-white text-black font-extrabold rounded-3xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest flex items-center gap-3"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
             Access Business Portal
             <div className="absolute inset-0 rounded-3xl group-hover:blur-xl group-hover:bg-white/10 -z-10 transition-all opacity-0 group-hover:opacity-100"></div>
           </button>

           {/* Operator Entry */}
           <button 
             onClick={() => onEnter('OPERATOR')}
             className="group px-10 py-5 obsidian-glass text-white font-extrabold rounded-3xl transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 active:scale-95 text-xs uppercase tracking-widest border border-white/10 flex items-center gap-3 shadow-2xl"
           >
             <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
             Initialize Command Layer
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 w-full relative z-10">
        {[
          { title: 'Global Mesh', desc: 'Secure asset tracking via hybrid HLR/SIGINT and GPS satellite telemetry.', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
          { title: 'Neural Recon', desc: 'Deep-background scanning of personnel with automated risk scoring.', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { title: 'Dispatch Core', desc: 'Direct, encrypted handshake protocol with regional Law Enforcement Command.', icon: 'M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.294 2.712 1.154 5.77a1 1 0 01-1.472 1.065L10 16.12l-3.03 2.507a1 1 0 01-1.472-1.065l1.154-5.77-3.294-2.712a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z' }
        ].map((feature, i) => (
          <div key={i} className="obsidian-glass p-10 rounded-[2.5rem] group hover:border-emerald-500/30 transition-all border border-white/5">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500/10 transition-colors">
              <svg className="w-7 h-7 text-slate-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-white mb-3 uppercase tracking-tight">{feature.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;

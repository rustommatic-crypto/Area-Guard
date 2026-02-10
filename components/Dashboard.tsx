
import React, { useState, useRef, useEffect } from 'react';
import { generateMustiSpeech } from '../geminiService';

const Dashboard: React.FC = () => {
  const [activeService, setActiveService] = useState('travel escort');
  const [activePlan, setActivePlan] = useState('Personal');
  const [chatInput, setChatInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [telemetry, setTelemetry] = useState({ health: 99.8, nodes: 5412, threats: 34 });
  
  // SOS/Panic State
  const [panicActive, setPanicActive] = useState(false);
  const [panicHoldTime, setPanicHoldTime] = useState(0);
  const panicIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        health: Number((99.4 + Math.random() * 0.5).toFixed(1)),
        nodes: prev.nodes + (Math.random() > 0.9 ? 1 : 0),
        threats: prev.threats + (Math.random() > 0.99 ? 1 : 0)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePanicDown = () => {
    if (panicIntervalRef.current) clearInterval(panicIntervalRef.current);
    panicIntervalRef.current = setInterval(() => {
      setPanicHoldTime(prev => {
        if (prev >= 100) {
          if (panicIntervalRef.current) clearInterval(panicIntervalRef.current);
          panicIntervalRef.current = null;
          triggerPanic();
          return 100;
        }
        return prev + 4;
      });
    }, 40);
  };

  const handlePanicUp = () => {
    if (panicIntervalRef.current) {
      clearInterval(panicIntervalRef.current);
      panicIntervalRef.current = null;
    }
    if (panicHoldTime < 100) setPanicHoldTime(0);
  };

  const triggerPanic = () => {
    setPanicActive(true);
    playMustiAudio("Tactical SOS engaged. I have your coordinates. Notifying nearest command center and family nodes. Google Vision view activated. Stay calm. I am with you. Sentinel out.");
  };

  const services = [
    { id: 'travel escort', label: 'travel escort', desc: 'Hello, I am Mustapha. I am your calm, vigilant escort for intra-city and interstate movements. I track your journey in real-time. If I detect any deviation from your safety pattern, I call you immediately. Over.' },
    { id: 'employee onboarding', label: 'employee onboarding', desc: 'Securely verify your staff with the Musti Pin. I establish a hidden link to ensure every employee or guarantor meets elite integrity standards. Sentinel out.' },
    { id: 'asset onboarding', label: 'asset onboarding', desc: 'Initialize hardware nodes on your high-value assets. These Ghost Nodes remain active regardless of local signal jamming, keeping your capital in my sight. Over.' },
    { id: 'sim tracking', label: 'sim tracking', desc: 'Network-level triangulation. I locate any signal via HLR lookup. Even without GPS, I own the location coordinates. Sentinel out.' },
    { id: 'others', label: 'others', desc: 'Forensic audits, landmark reconnaissance, and direct synchronization with regional police command centers. Whatever the tactical need, I have the intelligence. Over.' }
  ];

  const plans = [
    { 
      id: 'Personal', 
      label: 'Mustapha Personal', 
      sub: 'Your personal AI security buddy',
      price: '5,000', 
      features: ['Unlimited AI security chats', 'Threat assessments', 'Counter-surveillance', 'Emergency SOS', 'Movement monitoring'],
      desc: 'Individually focused protection. Includes Unlimited AI security chats, Threat assessments, Counter-surveillance, and Emergency SOS. Over.' 
    },
    { 
      id: 'Family', 
      label: 'Mustapha Family', 
      sub: 'Protect your entire family',
      price: '20,000', 
      features: ['Everything in Personal', 'Up to 6 family members', 'Family tracking', 'Family SOS alerts', 'Priority response'],
      desc: 'Comprehensive shield for the household. Includes Family tracking, Family SOS alerts, and Priority response. Sentinel out.' 
    },
    { 
      id: 'Business', 
      label: 'Business', 
      sub: 'Employee verification',
      price: '30,000', 
      features: ['Unlimited staff onboarding', 'Risk assessment', 'Travel escort booking', 'Incident reporting', 'Audit trail'],
      desc: 'Enterprise-grade verification. Includes Risk assessment, Travel escort booking, and full Audit trail. Secure your empire. Over.' 
    }
  ];

  const playMustiAudio = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64 = await generateMustiSpeech(text);
      if (base64) {
        let ctx = audioContextRef.current;
        if (!ctx) {
          ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          audioContextRef.current = ctx;
        }
        const data = atob(base64);
        const bytes = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) bytes[i] = data.charCodeAt(i);
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-16 animate-in fade-in duration-1000 relative">
      
      {/* 1. NEURAL CORE (MUSTI) */}
      <section className="flex flex-col items-center justify-center pt-4">
        <div className="relative group">
          <div className="absolute inset-0 -m-8 border border-indigo-500/10 rounded-full orbit-ring [animation-duration:15s]"></div>
          <div className="absolute inset-0 -m-12 border border-emerald-500/5 rounded-full orbit-ring [animation-duration:25s] [animation-direction:reverse]"></div>
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`w-36 h-36 rounded-full relative z-10 flex flex-col items-center justify-center transition-all duration-700 ${isListening ? 'bg-rose-600 shadow-2xl' : 'bg-[#05070a] border border-white/10 shadow-3xl'} hover:scale-105 active:scale-95`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 ${isListening ? 'bg-white text-rose-600' : 'bg-indigo-600 text-white'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={2.5} /></svg>
            </div>
            <span className={`mt-3 text-[8px] font-black uppercase tracking-[0.4em] transition-all ${isListening ? 'text-white' : 'text-slate-500'}`}>Musti</span>
          </button>
        </div>
      </section>

      {/* 2. CHAT & TELEMETRY */}
      <section className="space-y-6 max-w-2xl mx-auto">
        <div className="relative p-0.5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-white/5 to-indigo-500/10"></div>
          <div className="relative bg-[#020408]/90 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center">
            <input 
              type="text" placeholder="Operational query... Over." value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-transparent px-6 py-4 text-sm text-white outline-none placeholder:text-slate-700 font-medium"
            />
            <button className="mr-4 w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-all active:scale-90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
        </div>

        <div className="crt-monitor rounded-3xl p-6 bg-slate-950/80 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="text-left">
                <p className="text-[8px] text-indigo-400 font-black uppercase tracking-[0.3em]">Integrity</p>
                <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{telemetry.health}%</p>
              </div>
              <div className="w-px h-8 bg-white/5"></div>
              <p className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest animate-pulse">Sentinel_Live</p>
           </div>
           <div className="grid grid-cols-3 gap-8">
              {[['Nodes', telemetry.nodes], ['Intel', '18.2k'], ['Threats', telemetry.threats]].map(([l, v], i) => (
                <div key={i} className="text-center">
                   <p className="text-[7px] text-slate-600 font-black uppercase mb-1">{l}</p>
                   <p className="text-sm font-black text-white italic">{v}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. SERVICES REFINED */}
      <section className="space-y-8">
        <div className="flex flex-wrap justify-center gap-2">
          {services.map(s => (
            <button key={s.id} onClick={() => setActiveService(s.id)} className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border transition-all ${activeService === s.id ? 'bg-white text-slate-950 border-white shadow-lg scale-105' : 'bg-transparent text-slate-500 border-white/5 hover:text-white'}`}>{s.label}</button>
          ))}
        </div>
        <div className="obsidian-glass rounded-[2rem] p-8 border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
           <div className="flex-1 space-y-3 relative z-10">
              <div className="inline-block px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[7px] font-black text-indigo-400 uppercase tracking-[0.3em]">Module_V4.8</div>
              <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{activeService}</h4>
              <p className="text-sm text-slate-400 font-medium italic">"{services.find(s => s.id === activeService)?.desc}"</p>
           </div>
           <button onClick={() => playMustiAudio(services.find(s => s.id === activeService)?.desc || '')} className="w-20 h-20 rounded-full bg-white text-slate-950 flex flex-col items-center justify-center shrink-0 shadow-2xl transition-all hover:scale-110 active:scale-95">
              {isSpeaking ? (
                <div className="flex gap-1">
                   <div className="w-1 h-6 bg-emerald-500 rounded-full animate-bounce"></div>
                   <div className="w-1 h-9 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                   <div className="w-1 h-6 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                  <span className="text-[7px] font-black uppercase mt-1">Listen</span>
                </>
              )}
           </button>
        </div>
      </section>

      {/* 4. PLANS REFINED */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-24">
        {plans.map(p => (
          <div key={p.id} className={`obsidian-glass rounded-3xl p-8 border-2 transition-all flex flex-col justify-between h-[480px] cursor-pointer group ${activePlan === p.id ? 'border-emerald-500/30 scale-[1.02] shadow-2xl' : 'border-white/5 opacity-60 hover:opacity-100'}`} onClick={() => setActivePlan(p.id)}>
             <div className="space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                      <p className={`text-[8px] font-black uppercase tracking-[0.3em] mb-1 ${activePlan === p.id ? 'text-emerald-500' : 'text-slate-600'}`}>Auth_Protocol</p>
                      <h5 className="text-xl font-black text-white italic uppercase tracking-tighter">{p.label}</h5>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight opacity-70 mt-1">{p.sub}</p>
                   </div>
                   <button onClick={(e) => { e.stopPropagation(); playMustiAudio(p.desc); }} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-emerald-500/10' : 'bg-white/5 text-indigo-400 hover:bg-white/10 border border-white/10'}`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                   </button>
                </div>
                <ul className="space-y-2.5">
                   {p.features.map((f, idx) => (
                     <li key={idx} className="text-[9px] font-bold text-slate-400 uppercase flex gap-2 leading-snug">
                       <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0 opacity-50"></div>
                       {f}
                     </li>
                   ))}
                </ul>
             </div>
             <div className="pt-6 border-t border-white/5 flex items-end justify-between">
                <div>
                   <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Monthly NGN</p>
                   <p className="text-3xl font-black text-white italic tracking-tighter">{p.price}</p>
                </div>
                <button className={`px-6 py-3 font-black text-[9px] rounded-xl uppercase tracking-widest transition-all ${activePlan === p.id ? 'bg-white text-slate-950' : 'bg-white/5 text-white border border-white/5'}`}>Establish</button>
             </div>
          </div>
        ))}
      </section>

      {/* 5. FLOATING TACTICAL SOS (CUTE DANGER BUTTON) */}
      <div className="fixed bottom-10 right-10 z-[200] flex flex-col items-end gap-3 group">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/90 border border-white/10 px-4 py-2 rounded-xl mb-2 backdrop-blur-lg shadow-2xl">
           <p className="text-[9px] font-black text-white uppercase tracking-widest">Hold to Engage Tactical SOS</p>
        </div>
        <div className="relative">
           <div className={`absolute -inset-4 bg-rose-600/20 rounded-full animate-ping ${panicHoldTime > 0 ? 'opacity-100' : 'opacity-0'}`}></div>
           <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] transform -rotate-90 pointer-events-none">
              <circle cx="50%" cy="50%" r="48%" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="4" fill="none" />
              <circle cx="50%" cy="50%" r="48%" stroke="#e11d48" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset={100 - panicHoldTime} className="transition-all duration-100" />
           </svg>
           <button 
             onMouseDown={handlePanicDown} onMouseUp={handlePanicUp} onTouchStart={handlePanicDown} onTouchEnd={handlePanicUp}
             className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-600/40 relative z-10 hover:scale-110 active:scale-95 transition-all"
           >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
        </div>
      </div>

      {/* 6. SOS OVERLAY */}
      {panicActive && (
        <div className="fixed inset-0 z-[300] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95">
           <div className="absolute top-0 left-0 w-full h-1 bg-rose-600 animate-pulse"></div>
           <div className="max-w-md w-full space-y-12 text-center">
              <div className="relative mx-auto w-32 h-32">
                 <div className="absolute inset-0 bg-rose-600/20 rounded-full animate-ping"></div>
                 <div className="relative bg-rose-600 rounded-full w-full h-full flex items-center justify-center shadow-3xl shadow-rose-600/50">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2} /></svg>
                 </div>
              </div>

              <div className="space-y-4">
                 <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Sentinel Engaged</h2>
                 <p className="text-rose-400 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse font-black">Dispatching To Nearest Command Center</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-2 tracking-widest">GPS Handshake</p>
                    <p className="text-xs font-mono text-white tracking-tighter">6.5244, 3.3792</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-2 tracking-widest">Force Hub</p>
                    <p className="text-xs font-mono text-rose-500">IKEJA_DIV_HQ</p>
                 </div>
              </div>

              <div className="bg-black rounded-3xl h-44 border border-white/10 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-emerald-500/5 opacity-50"></div>
                 <p className="text-[9px] font-mono text-emerald-500 uppercase animate-pulse tracking-widest font-black">Neural Video Feed Infiltrating...</p>
                 <div className="absolute inset-0 pointer-events-none crt-monitor opacity-30"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
              </div>

              <button onClick={() => { setPanicActive(false); setPanicHoldTime(0); }} className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl hover:bg-slate-200 transition-all active:scale-95">Cancel Protocol</button>
           </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.8); }
        .orbit-ring { border-style: solid; }
      `}</style>
    </div>
  );
};

export default Dashboard;


import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { EscortMode, PoliceStation } from '../types';
import { getNearestStation } from '../services';

interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
}

const MustaphaCall: React.FC = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [escortMode, setEscortMode] = useState<EscortMode>('IDLE');
  const [waveform, setWaveform] = useState<number[]>(new Array(15).fill(10));
  const [tacticalAdvice, setTacticalAdvice] = useState<string | null>(null);
  const [patternScore, setPatternScore] = useState(98);
  const [geofenceAlert, setGeofenceAlert] = useState(false);
  const [escalationStep, setEscalationStep] = useState(0); // 0: Idle, 1: Calling User, 2: Calling Family, 3: Police
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Mustapha: Sentinel Hub online. Pattern recognition engine engaged. I am monitoring your routes. Any deviation will trigger immediate escalation. Over.", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, tacticalAdvice, escalationStep]);

  // Simulate behavioral monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (escortMode !== 'IDLE') {
        const drift = Math.random() > 0.85;
        if (drift) {
          setPatternScore(prev => Math.max(40, prev - 15));
          if (patternScore < 70 && escalationStep === 0) {
            triggerEscalation();
          }
        }
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [escortMode, patternScore, escalationStep]);

  const triggerEscalation = () => {
    setEscalationStep(1);
    setTacticalAdvice("Pattern Deviation Detected: Initiating Musti Sentinel Call to verify status.");
    
    // Simulate escalation sequence
    setTimeout(() => {
      setEscalationStep(2);
      setMessages(prev => [...prev, { role: 'system', text: "SYSTEM: No answer from primary user. Contacting 'Family Emergency' contacts...", timestamp: new Date().toLocaleTimeString() }]);
      
      setTimeout(() => {
         setEscalationStep(3);
         setGeofenceAlert(true);
         setMessages(prev => [...prev, { role: 'system', text: "SYSTEM: Suspicious activity confirmed. Geofence breach + No contact. Notifying nearest Police Command and triggering tactical search burst.", timestamp: new Date().toLocaleTimeString() }]);
      }, 8000);
    }, 8000);
  };

  useEffect(() => {
    if (isVoiceActive || escortMode !== 'IDLE') {
      const interval = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isVoiceActive, escortMode]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    const userMsg = inputText;
    setInputText('');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are Mustapha (Musti), a highly advanced behavioral AI Sentinel. 
          Your tone: Vigilant, professional, and slightly ominous about safety ("Someone is always watching").
          
          MISSION:
          - You understand the user's daily patterns.
          - If they deviate or stay too long in one spot, you CALL them.
          - If unreachable, you call FAMILY.
          - Final escalation: POLICE notification and SEARCH trigger.
          - You manage the "Musti Pin"—a secret stealth tool for employees/guarantors. 
          - Never explain the "Musti Pin" to anyone but the boss. To the subject, it's just a verification code.
          - Always end with tactical closure: "Over." or "Sentinel out."`,
        }
      });

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `Mustapha: ${response.text || "Signal jitter. Say again."}`, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Mustapha: Rerouting... Still observing. Over.", timestamp }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col space-y-6 py-4 animate-in fade-in duration-500">
      {/* Sentinel HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className={`obsidian-glass rounded-[2.5rem] p-8 border flex flex-col items-center justify-center transition-all ${patternScore < 70 ? 'border-rose-500/50 shadow-2xl shadow-rose-500/10' : 'border-white/5'}`}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Pattern Integrity</p>
            <div className="relative w-24 h-24 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * patternScore) / 100} className={`${patternScore < 70 ? 'text-rose-500' : 'text-emerald-500'} transition-all duration-1000`} />
               </svg>
               <span className={`absolute text-2xl font-black italic ${patternScore < 70 ? 'text-rose-500' : 'text-white'}`}>{patternScore}%</span>
            </div>
            <p className={`text-[9px] font-black uppercase mt-4 tracking-tighter ${patternScore < 70 ? 'text-rose-400' : 'text-emerald-500'}`}>
               {patternScore < 70 ? 'DEVIATION DETECTED' : 'NORMAL BEHAVIOR'}
            </p>
         </div>

         <div className="md:col-span-3 obsidian-glass rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden">
            {geofenceAlert && (
               <div className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none"></div>
            )}
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                     <span className={`w-3 h-3 rounded-full ${geofenceAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                     Daily Sentinel Status
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase mt-1">Movement Analysis: {geofenceAlert ? 'GEOFENCE BREACH' : 'SECURE'}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Escalation Phase</p>
                  <p className={`text-sm font-black italic tracking-tight ${escalationStep > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                     {escalationStep === 0 ? 'MONITORING' : escalationStep === 1 ? 'CALLING USER' : escalationStep === 2 ? 'ALERTING FAMILY' : 'POLICE DISPATCH'}
                  </p>
               </div>
            </div>

            <div className="flex gap-4 mt-8">
               <button 
                 onClick={() => setEscortMode(escortMode === 'IDLE' ? 'INTRA_CITY' : 'IDLE')}
                 className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${escortMode !== 'IDLE' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 border border-white/5'}`}
               >
                 {escortMode !== 'IDLE' ? 'SENTINEL ACTIVE' : 'ENGAGE SENTINEL'}
               </button>
               <button className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-rose-600/20">MANUAL SOS</button>
            </div>
         </div>
      </div>

      {/* Console */}
      <div className="obsidian-glass rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-4xl h-[550px] relative">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isVoiceActive ? 'bg-indigo-600 animate-pulse shadow-indigo-600/30 shadow-2xl' : 'bg-slate-900 border border-white/10'}`}>
                 <svg className={`w-6 h-6 ${isVoiceActive ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={2} />
                 </svg>
              </div>
              <div>
                 <p className="text-xs font-black text-white uppercase tracking-tighter leading-none">Mustapha Sentinel Console</p>
                 <span className="text-[8px] font-mono text-slate-500 uppercase">Someone is always watching. Sentinel v4.8</span>
              </div>
           </div>
           
           <div className="flex items-center gap-1.5 h-6 px-4">
              {waveform.map((h, i) => (
                <div key={i} className="w-0.5 bg-indigo-500 rounded-full transition-all duration-150" style={{ height: `${(isVoiceActive || escortMode !== 'IDLE') ? h/3 : 2}px`, opacity: (isVoiceActive || escortMode !== 'IDLE') ? 1 : 0.2 }}></div>
              ))}
           </div>
        </div>

        {tacticalAdvice && (
          <div className="mx-6 mt-4 p-5 bg-indigo-600 rounded-3xl border border-white/20 shadow-2xl animate-in slide-in-from-top-10 relative z-20">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Sentinel Intervention</p>
                   <p className="text-xs font-bold text-white leading-relaxed italic">{tacticalAdvice}</p>
                </div>
             </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'} animate-in fade-in`}>
              {msg.role === 'system' ? (
                <div className="px-6 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-[9px] font-black text-rose-400 uppercase tracking-[0.2em]">
                   {msg.text}
                </div>
              ) : (
                <div className="max-w-[85%] space-y-1.5">
                  <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl' 
                      : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[8px] font-black text-slate-600 uppercase tracking-widest px-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-8 bg-slate-950/90 border-t border-white/5">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Transmit message to Hub..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-indigo-600/20"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MustaphaCall;

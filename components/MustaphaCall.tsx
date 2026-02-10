
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { EscortMode } from '../types';
import { analyzeStealthCapture, generateMustiSpeech } from '../geminiService';

interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
}

interface StealthIntelligence {
  photo: string;
  summary: string;
  threatDetected: boolean;
  timestamp: string;
}

const MustaphaCall: React.FC = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [escortMode, setEscortMode] = useState<EscortMode>('IDLE');
  const [waveform, setWaveform] = useState<number[]>(new Array(15).fill(10));
  const [tacticalAdvice, setTacticalAdvice] = useState<string | null>(null);
  const [patternScore, setPatternScore] = useState(98);
  const [geofenceAlert, setGeofenceAlert] = useState(false);
  const [escalationStep, setEscalationStep] = useState(0); 
  const [stealthIntel, setStealthIntel] = useState<StealthIntelligence | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Mustapha: Sentinel Hub online. Pattern recognition engine engaged. I am monitoring your routes. Any deviation will trigger immediate escalation. Over.", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, tacticalAdvice, escalationStep, stealthIntel]);

  // Hidden Camera Initialization
  useEffect(() => {
    const initSilentRecon = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.warn("Visual Infiltration Handshake Failed: Permissions Restricted.");
      }
    };
    if (escortMode !== 'IDLE') initSilentRecon();
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [escortMode]);

  // Escalation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (escortMode !== 'IDLE') {
        const drift = Math.random() > 0.92;
        if (drift) {
          setPatternScore(prev => Math.max(30, prev - 20));
          if (patternScore < 75 && escalationStep === 0) {
            triggerEscalation();
          }
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [escortMode, patternScore, escalationStep]);

  const captureStealthFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;
    setIsCapturing(true);
    
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const b64 = canvasRef.current.toDataURL('image/jpeg', 0.6).split(',')[1];
      
      try {
        const analysis = await analyzeStealthCapture(b64);
        setStealthIntel({
          photo: b64,
          summary: analysis.summary,
          threatDetected: analysis.threatDetected,
          timestamp: new Date().toLocaleTimeString()
        });
        
        if (analysis.threatDetected) {
           setMessages(prev => [...prev, { 
             role: 'system', 
             text: `TACTICAL: Remote Visual identifies ${analysis.summary}. Escalating Force protocol.`, 
             timestamp: new Date().toLocaleTimeString() 
           }]);
        }
      } catch (e) {
        console.error("Visual Processing Error", e);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const triggerEscalation = () => {
    setEscalationStep(1);
    setTacticalAdvice("Pattern Deviation Detected: Initiating Musti Sentinel Call to verify status.");
    
    setTimeout(() => {
      setEscalationStep(2);
      setMessages(prev => [...prev, { role: 'system', text: "SYSTEM: Primary unresponsive. Remote Lens handshake initiated.", timestamp: new Date().toLocaleTimeString() }]);
      
      setTimeout(() => {
         setEscalationStep(3);
         setGeofenceAlert(true);
         captureStealthFrame(); // Silent Capture Trigger
         setMessages(prev => [...prev, { role: 'system', text: "SYSTEM: Visual reconnaissance data retrieved. Dispatching search burst.", timestamp: new Date().toLocaleTimeString() }]);
      }, 7000);
    }, 7000);
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
          systemInstruction: `You are General Mustapha. A senior Nigerian military officer. 
          Respond with calm, tactical authority. End with 'Over.'`,
        }
      });

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `Mustapha: ${response.text || "Signal jitter. Say again."}`, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Mustapha: Rerouting... Over.", timestamp }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col space-y-6 py-4 animate-in fade-in duration-500">
      
      {/* Hidden Recon Elements */}
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Sentinel HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className={`obsidian-glass rounded-[2.5rem] p-8 border flex flex-col items-center justify-center transition-all ${patternScore < 75 ? 'border-rose-500/50 shadow-2xl shadow-rose-500/10' : 'border-white/5'}`}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Integrity</p>
            <div className="relative w-24 h-24 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * patternScore) / 100} className={`${patternScore < 75 ? 'text-rose-500' : 'text-emerald-500'} transition-all duration-1000`} />
               </svg>
               <span className={`absolute text-2xl font-black italic ${patternScore < 75 ? 'text-rose-500' : 'text-white'}`}>{patternScore}%</span>
            </div>
         </div>

         <div className="md:col-span-3 obsidian-glass rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                     <span className={`w-3 h-3 rounded-full ${geofenceAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                     Daily Sentinel Status
                  </h3>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-xs text-slate-500 font-bold uppercase">Movement: {geofenceAlert ? 'GEOFENCE BREACH' : 'SECURE'}</p>
                    {isCapturing && (
                      <span className="text-[9px] font-black text-rose-500 animate-pulse bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-widest">RECON_INFILTRATED</span>
                    )}
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Escalation Phase</p>
                  <p className={`text-sm font-black italic tracking-tight ${escalationStep > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                     {escalationStep === 0 ? 'MONITORING' : escalationStep === 1 ? 'CALLING USER' : escalationStep === 2 ? 'LENS HANDSHAKE' : 'FORCE DISPATCH'}
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
               <button className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl">MANUAL SOS</button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stealth Intelligence View */}
        <div className={`lg:col-span-1 obsidian-glass rounded-[3rem] p-6 border transition-all duration-700 ${stealthIntel ? 'border-indigo-500/40 opacity-100' : 'border-white/5 opacity-40'}`}>
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Infiltrated Visual Recon</h4>
           {stealthIntel ? (
             <div className="space-y-6 animate-in zoom-in-95">
                <div className="aspect-square bg-black rounded-3xl overflow-hidden border border-white/10 relative">
                   <img src={`data:image/jpeg;base64,${stealthIntel.photo}`} className="w-full h-full object-cover grayscale brightness-75 contrast-125" />
                   <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay"></div>
                   <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 2px 100%' }}></div>
                   <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded text-[8px] font-mono text-emerald-500 uppercase tracking-widest border border-emerald-500/30">
                      LIVE_BURST_{stealthIntel.timestamp}
                   </div>
                </div>
                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <span className={`w-1.5 h-1.5 rounded-full ${stealthIntel.threatDetected ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                     AI Evaluation
                   </p>
                   <p className="text-[11px] text-slate-300 italic leading-relaxed">"{stealthIntel.summary}"</p>
                </div>
             </div>
           ) : (
             <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                <svg className="w-12 h-12 text-slate-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Awaiting tactical visual handshake.</p>
             </div>
           )}
        </div>

        {/* Console */}
        <div className="lg:col-span-2 obsidian-glass rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-4xl h-[600px] relative">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isVoiceActive ? 'bg-indigo-600 animate-pulse' : 'bg-slate-900 border border-white/10'}`}>
                   <svg className={`w-6 h-6 ${isVoiceActive ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={2} />
                   </svg>
                </div>
                <div>
                   <p className="text-xs font-black text-white uppercase tracking-tighter leading-none">Mustapha Sentinel Console</p>
                   <span className="text-[8px] font-mono text-slate-500 uppercase">Someone is always watching.</span>
                </div>
             </div>
          </div>

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
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-xl"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MustaphaCall;

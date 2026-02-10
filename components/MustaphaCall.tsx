
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { EscortMode } from '../types';

interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
}

const MustaphaCall: React.FC = () => {
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [waveform, setWaveform] = useState<number[]>(new Array(20).fill(10));
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Mustapha: Sentinel Hub online. Neural voice link ready for tactical uplink. Over.", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const startVoiceLink = async () => {
    if (isConnecting || isLiveSessionActive) return;
    setIsConnecting(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsLiveSessionActive(true);
            setMessages(prev => [...prev, { role: 'system', text: "ENCRYPTED VOICE LINK ESTABLISHED", timestamp: new Date().toLocaleTimeString() }]);
            
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
              setWaveform(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
            }

            if (message.serverContent?.interrupted) {
              for (const s of sourcesRef.current) s.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'model' && last.text.startsWith('Mustapha:')) {
                  const updated = [...prev];
                  updated[updated.length - 1] = { ...last, text: last.text + text };
                  return updated;
                }
                return [...prev, { role: 'model', text: 'Mustapha: ' + text, timestamp: new Date().toLocaleTimeString() }];
              });
            }
          },
          onerror: (e) => console.error("Voice link error:", e),
          onclose: () => {
            setIsLiveSessionActive(false);
            setMessages(prev => [...prev, { role: 'system', text: "VOICE LINK TERMINATED", timestamp: new Date().toLocaleTimeString() }]);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: `You are General Mustapha (Musti), a senior Nigerian military officer. 
          Your voice is authoritative, calm, and has a Hausa-English accent. 
          Speak as if you are monitoring the user's safety in a high-risk zone. Over.`,
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to establish voice link:", err);
      setIsConnecting(false);
    }
  };

  const stopVoiceLink = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsLiveSessionActive(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col space-y-6 py-4 animate-in fade-in duration-500">
      <div className="obsidian-glass rounded-[3rem] p-12 border border-white/5 flex flex-col items-center space-y-8 relative overflow-hidden">
        <div className="absolute top-10 right-10">
           <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${isLiveSessionActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>
              {isLiveSessionActive ? 'ENCRYPTED_VOICE_ACTIVE' : 'READY_FOR_HANDSHAKE'}
           </div>
        </div>

        <div className="relative group">
          <div className={`absolute inset-0 -m-8 border border-indigo-500/10 rounded-full animate-[spin_20s_linear_infinite] ${!isLiveSessionActive && 'opacity-0'}`}></div>
          <button 
            onClick={isLiveSessionActive ? stopVoiceLink : startVoiceLink}
            disabled={isConnecting}
            className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-4xl ${isLiveSessionActive ? 'bg-indigo-600' : 'bg-[#05070a] border border-white/10'}`}
          >
            {isConnecting ? (
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className={`w-16 h-16 ${isLiveSessionActive ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={2} />
              </svg>
            )}
            <span className={`mt-4 text-[10px] font-black uppercase tracking-[0.3em] ${isLiveSessionActive ? 'text-white animate-pulse' : 'text-slate-500'}`}>
              {isConnecting ? 'Linking...' : isLiveSessionActive ? 'Musti Online' : 'Speak to Musti'}
            </span>
          </button>
        </div>

        {isLiveSessionActive && (
          <div className="flex gap-2 h-12 items-center">
            {waveform.map((h, i) => (
              <div key={i} className="w-1 bg-indigo-400 rounded-full transition-all duration-100" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        )}
      </div>

      <div className="obsidian-glass rounded-[3rem] border border-white/5 flex flex-col overflow-hidden h-[400px]">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tactical Transcript Console</p>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}>
              <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-medium ${
                msg.role === 'system' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] uppercase font-black' :
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
};

export default MustaphaCall;

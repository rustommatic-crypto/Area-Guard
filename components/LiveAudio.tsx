
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const LiveAudio: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    setIsConnecting(true);
    // Directly use process.env.API_KEY for Gemini initialization.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputNode = audioContextRef.current.createGain();
    outputNode.connect(audioContextRef.current.destination);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setTranscription(prev => [...prev, "System: Secure Tactical Line Established."]);
            
            // Audio input logic would go here in a full implementation
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => [...prev, `AI: ${text}`]);
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onerror: (e) => console.error("Live API Error:", e),
          onclose: () => {
            setIsActive(false);
            setTranscription(prev => [...prev, "System: Tactical Line Terminated."]);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are the AssetGuard Tactical AI. Provide rapid, clear, and professional recovery assistance to field agents. Keep responses brief and focused on mission success.',
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center">
        <div className="mb-6 relative">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${
            isActive ? 'bg-emerald-500/20 scale-110 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'bg-slate-800'
          }`}>
            <svg className={`w-12 h-12 ${isActive ? 'text-emerald-500 animate-pulse' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          {isActive && (
             <div className="absolute -inset-4 border-2 border-emerald-500/30 border-dashed rounded-full animate-[spin_10s_linear_infinite]"></div>
          )}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">Tactical Audio Link</h3>
        <p className="text-slate-400 mb-8 max-w-sm">Secure, low-latency voice connection to AssetGuard AI for real-time field navigation and recovery support.</p>

        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`px-10 py-4 rounded-2xl font-bold text-sm tracking-widest transition-all ${
            isActive 
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20' 
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {isConnecting ? 'ESTABLISHING...' : isActive ? 'TERMINATE LINK' : 'INITIATE SECURE LINK'}
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 min-h-[300px] flex flex-col">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Comms Transcript</h4>
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {transcription.length === 0 && (
            <p className="text-slate-600 text-sm italic text-center mt-20">No active transmission logs.</p>
          )}
          {transcription.map((line, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm ${
              line.startsWith('AI:') ? 'bg-emerald-500/5 border border-emerald-500/10 text-emerald-400' : 'text-slate-400'
            }`}>
              <span className="mono mr-2 opacity-50">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveAudio;

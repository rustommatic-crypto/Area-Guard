
import React, { useState, useRef } from 'react';
import { analyzeLandmark } from '../geminiService';
import { getDemoLandmarkResult } from '../services';
import { LandmarkResult } from '../types';

const LandmarkIntel: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<LandmarkResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulate = () => {
    setIsAnalyzing(true);
    setResult(null);
    setImagePreview("https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=800");
    setTimeout(() => {
      setResult(getDemoLandmarkResult());
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const b64 = (event.target?.result as string).split(',')[1];
      setImagePreview(event.target?.result as string);
      
      setIsAnalyzing(true);
      try {
        const data = await analyzeLandmark(b64);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Module: Visual Intel Recon</span>
        </div>
        <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Geographic Analysis</h3>
        <p className="text-slate-500 text-sm max-w-xl font-medium leading-relaxed">
          Cross-reference field imagery against global landmark databases via Gemini 3 Flash. 
          Verify mission-critical location reports through neural visual triangulation.
        </p>
        <button 
          onClick={handleSimulate}
          className="mt-2 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 px-6 py-2 rounded-full bg-indigo-500/5 transition-all active:scale-95"
        >
          Execute Simulated Recon
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Evidence Uplink</h4>
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded">STATUS: READY</span>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[16/10] lg:aspect-square bg-slate-900 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/40 hover:bg-slate-900/50 transition-all group overflow-hidden relative shadow-3xl"
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt="Evidence" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                {isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[2px] bg-emerald-500 absolute animate-[scan_2.5s_linear_infinite] shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                  </div>
                )}
                <div className="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm p-4">
                   <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase">Update Intelligence Target</span>
                </div>
              </>
            ) : (
              <div className="text-center p-12 space-y-6">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto transition-all group-hover:scale-110 border border-white/5 group-hover:border-emerald-500/30">
                  <svg className="w-10 h-10 text-slate-500 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                   <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-xs">Initiate Image Uplink</p>
                   <p className="text-slate-600 text-[9px] font-mono mt-3 uppercase tracking-widest">Supports: RAW_JPG, FIELD_TRANSCRIPT_V2</p>
                </div>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
        </div>

        <div className="obsidian-glass rounded-[3rem] p-8 lg:p-10 flex flex-col border border-white/5 min-h-[450px]">
          {!result && !isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={1}/></svg>
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Awaiting tactical stream input</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-emerald-400 text-[10px] font-mono animate-pulse uppercase tracking-[0.5em] font-black">Decrypting Geodata</p>
              </div>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in zoom-in-95 duration-700 h-full flex flex-col">
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Recon Successful</span>
                    <p className="text-slate-500 text-[9px] font-mono uppercase mt-1">Ref ID: RECON-{Math.floor(Math.random()*10000)}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Certainty Score</p>
                   <span className="text-white font-black text-3xl italic tracking-tighter">{result.locationCertainty}%</span>
                 </div>
              </div>

              <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div>
                  <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Identified Waypoints</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.identified.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] text-emerald-400 font-black uppercase">{item}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">AI Contextual Summary</h5>
                  <p className="text-slate-300 text-xs leading-relaxed italic bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05]">"{result.description}"</p>
                </div>
                <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                  <h5 className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                     Threat Evaluation
                  </h5>
                  <p className="text-rose-200/80 text-[11px] font-bold leading-relaxed">{result.riskAssessment}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandmarkIntel;

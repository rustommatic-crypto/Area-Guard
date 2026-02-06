
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col items-center text-center space-y-3 mb-10">
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Protocol: Visual Intel (VIP)</span>
        </div>
        <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Geographic Reconnaissance</h3>
        <p className="text-slate-500 text-sm max-w-xl">
          Utilize Gemini 3 Flash to cross-reference field imagery against global landmark databases.
          Verify reported location accuracy via visual triangulation.
        </p>
        <button 
          onClick={handleSimulate}
          className="mt-2 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 px-4 py-1.5 rounded-full bg-indigo-500/5"
        >
          Run Demo Scan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Surveillance Feed</h4>
            <span className="text-[10px] font-mono text-emerald-500">READY_FOR_UPLOAD</span>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[4/3] bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all group overflow-hidden relative shadow-2xl"
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} className="w-full h-full object-cover" alt="Surveillance preview" />
                <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay"></div>
                {isAnalyzing && <div className="scanner-line h-1 w-full bg-emerald-500 absolute top-0 animate-[scan_2s_linear_infinite]"></div>}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                   <div className="p-3 bg-white/10 rounded-full mb-3">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                   </div>
                   <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">Update Evidence</span>
                </div>
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all border border-slate-700 group-hover:border-emerald-500/30">
                  <svg className="w-10 h-10 text-slate-600 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-slate-300 font-bold uppercase tracking-widest text-sm">Initiate Recon Feed</p>
                <p className="text-slate-600 text-[10px] font-mono mt-2">ACCEPTING: RAW_JPG, RAW_PNG, FIELD_METADATA</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-inner min-h-[500px]">
          {!result && !isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
              <div className="mb-6 relative">
                 <div className="w-24 h-24 border-2 border-slate-800 rounded-full animate-[spin_20s_linear_infinite] flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <svg className="w-10 h-10 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                 </div>
              </div>
              <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">Awaiting tactical input stream...</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-emerald-400 text-sm font-mono animate-pulse uppercase tracking-[0.4em] font-black">Analyzing Geodata</p>
              </div>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in zoom-in-95 duration-700 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                 <div className="flex flex-col">
                    <span className="text-emerald-500 font-mono text-xs font-black tracking-widest">RECON_COMPLETED</span>
                 </div>
                 <div className="text-right">
                   <span className="text-white font-mono text-2xl font-black">{result.locationCertainty}%</span>
                 </div>
              </div>

              <div className="space-y-8 flex-1">
                <div>
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center">Waypoints</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.identified.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded text-[11px] text-emerald-300 font-mono">{item}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Intelligence Summary</h5>
                  <p className="text-slate-300 text-sm italic bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">"{result.description}"</p>
                </div>
                <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                  <h5 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2 flex items-center">Risk Analysis</h5>
                  <p className="text-rose-200/90 text-xs font-semibold">{result.riskAssessment}</p>
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


import React, { useState, useRef, useEffect } from 'react';
import { AssetStatus } from '../types';
import { extractLocationFromPhoto, runDeepPersonnelScan } from '../geminiService';

const LeaseRegistry: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState<'selection' | 'profile' | 'biometrics' | 'success'>('selection');
  const [onboardType, setOnboardType] = useState<'PERSONNEL' | 'ASSET'>('PERSONNEL');
  const [isRegistered, setIsRegistered] = useState(false);
  const [deepReconResult, setDeepReconResult] = useState<any>(null);

  const [formData, setFormData] = useState({ 
    name: '', phone: '', nin: '', plate: '', photo: '', jobType: '', value: '', serial: '' 
  });
  const [photoLocation, setPhotoLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      // Prioritize front camera for personnel, back for assets
      const mode = onboardType === 'PERSONNEL' ? 'user' : 'environment';
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Play error:", e));
        };
      }
    } catch (err) { 
      console.error("Camera access denied", err); 
      alert("Operational requirement: Camera access is mandatory for secure registration.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Ensure video is actually playing and has dimensions
      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const b64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        setFormData(prev => ({ ...prev, photo: b64 }));
        
        setIsScanning(true);
        try {
          // Visual feedback
          const flash = document.createElement('div');
          flash.className = 'fixed inset-0 bg-white z-[300] pointer-events-none transition-opacity duration-300';
          document.body.appendChild(flash);
          setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
          }, 50);

          // Phase 1: Location Analysis
          const loc = await extractLocationFromPhoto(b64);
          setPhotoLocation(loc);

          // Phase 2: If Personnel, run Background Recon
          if (onboardType === 'PERSONNEL' && formData.nin) {
             const recon = await runDeepPersonnelScan(formData.name, formData.nin);
             setDeepReconResult(recon);
          }
        } catch (err) { 
          console.error("Analysis failed", err); 
        } finally { 
          setIsScanning(false); 
          stopCamera();
        }
      }
    }
  };

  const handleComplete = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep('success');
      setIsRegistered(true);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', nin: '', plate: '', photo: '', jobType: '', value: '', serial: '' });
    setStep('selection');
    setPhotoLocation(null);
    setDeepReconResult(null);
    stopCamera();
  };

  useEffect(() => {
    if (step === 'biometrics') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [step]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Onboarding Command</h3>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-1">Area Guard Unified Registry Engine</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setStep('selection'); }}
          className="px-8 py-4 bg-emerald-600 text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
        >
          INITIATE REGISTRATION
        </button>
      </div>

      <div className="obsidian-glass rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-12 border-white/5 relative overflow-hidden min-h-[400px]">
         {!isRegistered ? (
           <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center opacity-40">
                 <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={1}/></svg>
              </div>
              <div className="space-y-2">
                 <p className="text-2xl font-black text-white uppercase italic tracking-tighter">Unified Secure Registry</p>
                 <p className="text-xs text-slate-500 font-medium max-w-sm uppercase tracking-widest leading-relaxed">System state: Idle. Awaiting field synchronization for personnel or commercial assets.</p>
              </div>
           </div>
         ) : (
           <div className="animate-in slide-in-from-bottom-6 duration-700">
              <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 Active Sentinel Node
              </h4>
              <div className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-white/[0.05] transition-all">
                 <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-emerald-500/30 bg-black shadow-2xl">
                       <img src={`data:image/jpeg;base64,${formData.photo}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{formData.name}</p>
                       <p className="text-xs font-mono text-slate-400 tracking-tight">
                         {onboardType === 'PERSONNEL' 
                           ? `DEPLOYMENT: ${formData.jobType} | NIN: ${formData.nin}` 
                           : `ASSET: ${formData.jobType} | SERIAL: ${formData.serial} | VALUE: ${formData.value}`
                         }
                       </p>
                       {deepReconResult && (
                          <div className="flex gap-4 mt-4">
                             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Score: {deepReconResult.socialMediaScore}%</span>
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded">SIM Age: {deepReconResult.simAgeDays}d</span>
                          </div>
                       )}
                    </div>
                 </div>
                 <div className="text-right flex flex-col items-end gap-3">
                    <span className="px-6 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                      {onboardType === 'PERSONNEL' ? 'BIO-VALIDATED' : 'UNIT-SECURED'}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Added {new Date().toLocaleDateString()}</p>
                 </div>
              </div>
           </div>
         )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                 <div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Onboarding Terminal</h4>
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] mt-2">
                      {step === 'selection' ? 'Protocol Choice' : step === 'profile' ? 'Registration Phase' : step === 'biometrics' ? 'Visual Intelligence' : 'Encryption Locked'}
                    </p>
                 </div>
                 <button onClick={() => { setShowModal(false); stopCamera(); }} className="w-12 h-12 rounded-2xl obsidian-glass flex items-center justify-center text-slate-500 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg></button>
              </div>

              <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                 {step === 'selection' && (
                   <div className="space-y-8 animate-in zoom-in-95">
                      <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Specify the subject category for deep-link integration.</p>
                      <div className="grid grid-cols-2 gap-8">
                         <button 
                           onClick={() => { setOnboardType('PERSONNEL'); setStep('profile'); }}
                           className="flex flex-col items-center gap-6 p-10 obsidian-glass rounded-[2.5rem] border border-white/5 hover:border-emerald-500/50 transition-all group shadow-xl"
                         >
                            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            </div>
                            <span className="text-sm font-black text-white uppercase tracking-widest">Personnel</span>
                         </button>
                         <button 
                           onClick={() => { setOnboardType('ASSET'); setStep('profile'); }}
                           className="flex flex-col items-center gap-6 p-10 obsidian-glass rounded-[2.5rem] border border-white/5 hover:border-indigo-500/50 transition-all group shadow-xl"
                         >
                            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <span className="text-sm font-black text-white uppercase tracking-widest">Fixed Asset</span>
                         </button>
                      </div>
                   </div>
                 )}

                 {step === 'profile' && (
                   <div className="space-y-6 animate-in slide-in-from-right-8">
                      {onboardType === 'PERSONNEL' ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Employee Name" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:border-emerald-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input type="text" placeholder="NIN (Government ID)" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-emerald-400 font-mono focus:border-emerald-500 outline-none" value={formData.nin} onChange={e => setFormData({...formData, nin: e.target.value})} />
                          </div>
                          <select 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:border-emerald-500 outline-none appearance-none"
                            value={formData.jobType}
                            onChange={e => setFormData({...formData, jobType: e.target.value})}
                          >
                            <option value="" disabled className="bg-slate-900 text-slate-500">Job Role Allocation</option>
                            <option value="Executive Driver" className="bg-slate-900">Executive Driver</option>
                            <option value="Logistics Rider" className="bg-slate-900">Logistics Rider</option>
                            <option value="Security Officer" className="bg-slate-900">Security Officer</option>
                            <option value="Field Ops Manager" className="bg-slate-900">Field Ops Manager</option>
                          </select>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Asset Identifier Name" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:border-indigo-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input type="text" placeholder="Serial / SKU / VIN" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-indigo-400 font-mono focus:border-indigo-500 outline-none" value={formData.serial} onChange={e => setFormData({...formData, serial: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <select 
                              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
                              value={formData.jobType}
                              onChange={e => setFormData({...formData, jobType: e.target.value})}
                            >
                              <option value="" disabled className="bg-slate-900 text-slate-500">Asset Category</option>
                              <option value="Commercial Vehicle" className="bg-slate-900">Commercial Vehicle</option>
                              <option value="Heavy Machinery" className="bg-slate-900">Heavy Machinery</option>
                              <option value="Tech Inventory" className="bg-slate-900">Tech Inventory</option>
                              <option value="Facility Equipment" className="bg-slate-900">Facility Equipment</option>
                            </select>
                            <input type="text" placeholder="Valuation (₦)" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:border-indigo-500 outline-none" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                          </div>
                        </>
                      )}
                      <button 
                        onClick={() => setStep('biometrics')}
                        disabled={!formData.name || (onboardType === 'PERSONNEL' ? !formData.nin : !formData.serial)}
                        className={`w-full py-6 font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl transition-all ${onboardType === 'PERSONNEL' ? 'bg-emerald-600 text-slate-950 shadow-emerald-500/20' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
                      >
                        Next: {onboardType === 'PERSONNEL' ? 'Capture Biometrics' : 'Asset Photo Verification'}
                      </button>
                   </div>
                 )}

                 {step === 'biometrics' && (
                   <div className="space-y-8 animate-in slide-in-from-right-8">
                      <div className="aspect-square bg-black rounded-[3rem] overflow-hidden relative border border-white/10 group shadow-2xl">
                         {!formData.photo ? (
                           <>
                             <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${onboardType === 'PERSONNEL' ? 'scale-x-[-1]' : ''}`} />
                             <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-emerald-500/40 rounded-tl-2xl"></div>
                                <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-emerald-500/40 rounded-tr-2xl"></div>
                                <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-emerald-500/40 rounded-bl-2xl"></div>
                                <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-emerald-500/40 rounded-br-2xl"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <div className="w-4/5 h-4/5 border-2 border-emerald-500/20 rounded-full animate-pulse"></div>
                                </div>
                                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-emerald-500/30 animate-[scan_3s_linear_infinite] shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                             </div>
                             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <button 
                                  onClick={capturePhoto} 
                                  className="w-24 h-24 bg-white/5 hover:bg-white/10 border-[6px] border-white rounded-full flex items-center justify-center transition-all group active:scale-90 shadow-2xl"
                                >
                                   <div className="w-8 h-8 bg-emerald-500 rounded-full animate-pulse group-hover:scale-110 transition-transform"></div>
                                </button>
                                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] mt-6 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5">Trigger Neural Lock</p>
                             </div>
                           </>
                         ) : (
                           <div className="h-full relative animate-in fade-in zoom-in-105 duration-700">
                              <img src={`data:image/jpeg;base64,${formData.photo}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
                                 {isScanning ? (
                                   <div className="space-y-6">
                                     <div className="w-20 h-20 border-[6px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                                     <div className="space-y-1">
                                        <p className="text-sm font-black text-emerald-400 uppercase tracking-[0.4em] animate-pulse">Synchronizing Intelligence</p>
                                        <p className="text-[9px] text-slate-500 font-mono">ENCRYPTING_BIO_NODES...</p>
                                     </div>
                                   </div>
                                 ) : (
                                   <div className="animate-in zoom-in-95 space-y-8 w-full max-w-xs">
                                      <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                         <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Protocol Verified</span>
                                      </div>
                                      
                                      {deepReconResult && (
                                         <div className="p-5 obsidian-glass rounded-2xl border border-white/5 text-left space-y-3">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Background Score</p>
                                            <div className="flex justify-between items-end">
                                               <span className="text-3xl font-black text-white italic leading-none">{deepReconResult.socialMediaScore}%</span>
                                               <span className={`text-[10px] font-black uppercase ${deepReconResult.loanDefaulter ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                  {deepReconResult.loanDefaulter ? 'Defaulter Risk' : 'Credit Clear'}
                                               </span>
                                            </div>
                                         </div>
                                      )}

                                      <div className="flex gap-4">
                                        <button onClick={() => { setFormData({...formData, photo: ''}); startCamera(); }} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Retry</button>
                                        <button onClick={handleComplete} className="flex-1 py-4 bg-emerald-600 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30">Confirm</button>
                                      </div>
                                   </div>
                                 )}
                              </div>
                           </div>
                         )}
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                   </div>
                 )}

                 {step === 'success' && (
                    <div className="text-center py-10 space-y-10 animate-in zoom-in-95 duration-1000">
                       <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl rotate-6 ${onboardType === 'PERSONNEL' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-indigo-600 shadow-indigo-500/30'}`}>
                          <svg className={`w-16 h-16 ${onboardType === 'PERSONNEL' ? 'text-slate-950' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter">Sentinel Locked</h4>
                          <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">
                            {onboardType === 'PERSONNEL' ? `${formData.name} is now encrypted in the command network.` : `${formData.name} node #${formData.serial} is active.`}
                          </p>
                       </div>
                       <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 text-left font-mono text-[11px] text-slate-400 space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                             <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.666.945V10c0 5.825-4.139 10.285-8.5 11.5-4.361-1.215-8.5-5.675-8.5-11.5V5.845a1 1 0 01.666-.945zM10 3.3l-5 2.143v4.557c0 4.286 3.12 7.828 5 8.927 1.88-1.099 5-4.641 5-8.927V5.443L10 3.3z" clipRule="evenodd" /></svg>
                          </div>
                          <p className="text-emerald-500">>> HANDSHAKE: ENCRYPTED_SUCCESS</p>
                          <p className="text-indigo-400">>> SUBJECT_TYPE: {onboardType}</p>
                          <p>>> NODE_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                          <p className="text-slate-600">>> GEOLOCATION_TAG: {photoLocation?.lat?.toFixed(4)}, {photoLocation?.lng?.toFixed(4)}</p>
                          <p className="text-emerald-500/50">>> INTEGRITY_PROTOCOL: OPTIMAL</p>
                       </div>
                       <button onClick={() => { setShowModal(false); resetForm(); }} className="w-full py-6 bg-white text-slate-950 font-black rounded-3xl text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Finalize & Exit Terminal</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100px); }
          50% { transform: translateY(100px); }
          100% { transform: translateY(-100px); }
        }
      `}</style>
    </div>
  );
};

export default LeaseRegistry;

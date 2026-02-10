
import React, { useState, useRef, useEffect } from 'react';

const LeaseRegistry: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState<'selection' | 'profile' | 'biometrics' | 'success'>('selection');
  const [onboardType, setOnboardType] = useState<'EMPLOYEE' | 'GUARANTOR'>('EMPLOYEE');
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', phone: '', nin: '', photo: '', jobType: ''
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert("Visual verification required for PIN generation."); }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const b64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
        setFormData(prev => ({ ...prev, photo: b64 }));
      }
    }
  };

  const handleComplete = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep('success');
      setIsRegistered(true);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">Musti Pin Registry</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Identity & Integrity Verification Protocol</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setStep('selection'); }}
          className="px-8 py-5 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 transition-all active:scale-95"
        >
          ENROLL NEW SUBJECT
        </button>
      </div>

      <div className="obsidian-glass rounded-[3rem] p-12 border border-white/5">
         {!isRegistered ? (
           <div className="text-center py-20 opacity-30">
              <p className="text-xl font-black text-white uppercase italic tracking-tighter">Musti Pin Database</p>
              <p className="text-xs text-slate-500 uppercase mt-4">No active personnel monitoring links detected.</p>
           </div>
         ) : (
           <div className="animate-in slide-in-from-bottom-6">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 Personnel Anchor: {formData.name}
              </h4>
              <div className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-emerald-500/30 bg-black">
                       <img src={`data:image/jpeg;base64,${formData.photo}`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <p className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{formData.name}</p>
                       <p className="text-xs font-mono text-slate-500 tracking-tight mt-2 uppercase">{formData.jobType} | NIN: {formData.nin}</p>
                       <div className="flex gap-4 mt-4">
                          <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest">Musti Pin Active</span>
                          <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest">Integrity: VERIFIED</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase hover:bg-white/10 transition-all">Audit Track Logs</button>
                 </div>
              </div>
           </div>
         )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in">
           <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] shadow-4xl relative">
              <div className="p-10 border-b border-white/5 flex justify-between items-center">
                 <div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Musti Enrollment Terminal</h4>
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-2 italic">Phase: {step.toUpperCase()}</p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl obsidian-glass flex items-center justify-center text-slate-500 hover:text-white transition-all">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
                 </button>
              </div>

              <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                 {step === 'selection' && (
                   <div className="space-y-10">
                      <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Select Musti Category</p>
                      <div className="grid grid-cols-2 gap-8">
                         <button onClick={() => { setOnboardType('EMPLOYEE'); setStep('profile'); }} className="flex flex-col items-center gap-6 p-10 obsidian-glass rounded-[3rem] border border-white/5 hover:border-indigo-500/50 transition-all group">
                            <span className="text-sm font-black text-white uppercase tracking-widest">New Staff</span>
                         </button>
                         <button onClick={() => { setOnboardType('GUARANTOR'); setStep('profile'); }} className="flex flex-col items-center gap-6 p-10 obsidian-glass rounded-[3rem] border border-white/5 hover:border-emerald-500/50 transition-all group">
                            <span className="text-sm font-black text-white uppercase tracking-widest">Guarantor</span>
                         </button>
                      </div>
                   </div>
                 )}

                 {step === 'profile' && (
                   <div className="space-y-6">
                      <input type="text" placeholder="Full Legal Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      <button onClick={() => { setStep('biometrics'); startCamera(); }} className="w-full py-6 bg-indigo-600 text-white font-black rounded-3xl text-xs uppercase tracking-widest shadow-2xl transition-all">Proceed to Verification</button>
                   </div>
                 )}

                 {step === 'biometrics' && (
                   <div className="space-y-8">
                      <div className="aspect-square bg-black rounded-[3rem] overflow-hidden relative border border-white/10">
                         {!formData.photo ? (
                           <>
                             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <button onClick={capturePhoto} className="w-20 h-20 bg-white/10 border-4 border-white rounded-full flex items-center justify-center shadow-2xl">
                                   <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
                                </button>
                             </div>
                           </>
                         ) : (
                           <div className="h-full relative">
                              <img src={`data:image/jpeg;base64,${formData.photo}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
                                 {isScanning ? (
                                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Establishing Integrity Link...</p>
                                 ) : (
                                   <button onClick={handleComplete} className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Generate Musti Pin</button>
                                 )}
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                 )}

                 {step === 'success' && (
                    <div className="text-center py-10 space-y-8">
                       <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Musti Pin Secured</h4>
                       <button onClick={() => { setShowModal(false); setStep('selection'); }} className="w-full py-6 bg-white text-slate-900 font-black rounded-3xl text-xs uppercase tracking-widest">Return to Command</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeaseRegistry;

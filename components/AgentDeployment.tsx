
import React, { useState } from 'react';

const AgentDeployment: React.FC = () => {
  const [targetPhone, setTargetPhone] = useState('');
  const [disguise, setDisguise] = useState('system_update');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployed(true);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Protocol: Shadow_Agent_V4</span>
        </div>
        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Covert Infiltration</h3>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">Deploy a non-removable background process to the target device. Uses system-level hooks for zero-latency tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-emerald-900/20 rounded-3xl p-8 shadow-2xl space-y-6">
          <h4 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">Deployment Config</h4>
          
          <div className="space-y-4">
             <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Target Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="+234 ..." 
                  className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400 font-mono outline-none focus:border-emerald-500/50"
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                />
             </div>

             <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Payload Disguise (Icon & Name)</label>
                <div className="grid grid-cols-2 gap-3">
                   {['system_update', 'battery_fix', 'storage_mgr', 'gps_helper'].map(d => (
                     <button 
                       key={d}
                       onClick={() => setDisguise(d)}
                       className={`p-3 rounded-xl border text-[10px] font-black uppercase transition-all ${disguise === d ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-white/5 text-slate-500'}`}
                     >
                       {d.replace('_', ' ')}
                     </button>
                   ))}
                </div>
             </div>

             <div className="pt-4">
                <button 
                  onClick={handleDeploy}
                  disabled={isDeploying || !targetPhone}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20"
                >
                  {isDeploying ? 'TRANSMITTING PAYLOAD...' : 'DEPLOY SHADOW AGENT'}
                </button>
             </div>
          </div>
        </div>

        <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
           {deployed ? (
              <div className="animate-in zoom-in-95 duration-700">
                 <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <h4 className="text-xl font-black text-white uppercase italic mb-2">Agent Active</h4>
                 <p className="text-slate-500 text-xs">The payload has been acknowledged by the cellular network. Infiltration in progress.</p>
                 <div className="mt-8 p-4 bg-black/40 rounded-xl border border-emerald-500/10 font-mono text-[9px] text-emerald-500/70 text-left">
                    <p>{'>'} HANDSHAKE_SUCCESS</p>
                    <p>{'>'} PERMISSIONS_GRANTED: ALL</p>
                    <p>{'>'} STEALTH_MODE: ENABLED</p>
                 </div>
              </div>
           ) : (
              <div className="opacity-30">
                 <svg className="w-20 h-20 text-slate-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                 <p className="text-xs uppercase font-black tracking-widest">Awaiting Command...</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AgentDeployment;

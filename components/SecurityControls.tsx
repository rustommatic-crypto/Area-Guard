
import React from 'react';

const SecurityControls: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-6">Device Pulse Frequency</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-4">
                <span>Active Tracking</span>
                <span className="text-emerald-400">Every 60s</span>
              </div>
              <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-4">
                <span>Default Mode</span>
                <span className="text-rose-400">Every 15s</span>
              </div>
              <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-6">Access Control</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <span className="text-sm text-slate-300">Biometric Verification</span>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <span className="text-sm text-slate-300">Log Geofence Breaches</span>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <span className="text-sm text-slate-300">Auto-Encrypted Dossiers</span>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-rose-200">Terminal Lockdown Protocol</h4>
            <p className="text-slate-400 text-sm">Immediately restrict all data outgoing and incoming to this office terminal.</p>
          </div>
        </div>
        <button className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-sm">
          ENGAGE LOCKDOWN
        </button>
      </div>
    </div>
  );
};

export default SecurityControls;

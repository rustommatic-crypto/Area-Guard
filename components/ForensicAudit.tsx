
import React, { useState } from 'react';
import { MOCK_REPORTS } from '../constants';
import { AuditReport } from '../types';

const ForensicAudit: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Forensic Registry</h3>
          <p className="text-slate-500 text-sm">Legally admissible intelligence logs for police coordination.</p>
        </div>
        <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
          Generate New Dossier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 border border-indigo-900/20 rounded-2xl overflow-hidden backdrop-blur-sm">
           <table className="w-full text-left">
             <thead className="bg-slate-800/50 border-b border-indigo-900/20">
               <tr>
                 <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                 <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target</th>
                 <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol</th>
                 <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-800/50">
               {MOCK_REPORTS.map((report) => (
                 <tr 
                   key={report.id} 
                   onClick={() => setSelectedReport(report)}
                   className={`cursor-pointer transition-colors ${selectedReport?.id === report.id ? 'bg-indigo-500/10' : 'hover:bg-slate-800/30'}`}
                 >
                   <td className="px-6 py-4 text-[11px] font-mono text-slate-400">{report.timestamp}</td>
                   <td className="px-6 py-4 font-bold text-indigo-400 text-sm">{report.assetPlate}</td>
                   <td className="px-6 py-4">
                     <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-black text-slate-400 border border-slate-700">{report.action}</span>
                   </td>
                   <td className="px-6 py-4 text-slate-300 text-xs truncate max-w-[200px]">{report.finding}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        <div className="bg-slate-900 border border-indigo-900/30 rounded-2xl p-6 flex flex-col">
          {selectedReport ? (
            <div className="animate-in fade-in duration-500">
               <div className="border-b border-indigo-900/20 pb-4 mb-6">
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Dossier: {selectedReport.id}</h4>
                  <p className="text-[10px] font-mono text-slate-500">SHA256: {selectedReport.hash}</p>
               </div>
               
               <div className="space-y-6 text-sm">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Subject Details</label>
                    <p className="text-white font-bold">{selectedReport.assetPlate}</p>
                    <p className="text-slate-400 text-xs">Operator: {selectedReport.operator}</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Finding Intelligence</label>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-indigo-900/20">
                       <p className="text-slate-200 leading-relaxed italic">"{selectedReport.finding}"</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-indigo-900/20 space-y-3">
                     <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                        Export Official PDF
                     </button>
                     <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                        Submit to Authorities
                     </button>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
               <svg className="w-12 h-12 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <p className="text-xs uppercase tracking-widest font-bold">Select report for forensic review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForensicAudit;

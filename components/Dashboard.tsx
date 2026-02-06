
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_VEHICLES } from '../constants';
import { AssetStatus } from '../types';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Active Leases', value: '42', trend: '+12%', color: 'emerald' },
    { label: 'In Default', value: '08', trend: '-2%', color: 'rose' },
    { label: 'Signal Link', value: '98%', trend: 'Locked', color: 'indigo' },
    { label: 'Grid Nodes', value: '1.2K', trend: 'Global', color: 'emerald' },
  ];

  const distributionData = [
    { name: 'Active', value: MOCK_VEHICLES.filter(v => v.status === AssetStatus.ACTIVE).length },
    { name: 'Infiltrated', value: MOCK_VEHICLES.filter(v => v.status === AssetStatus.INFILTRATED).length },
    { name: 'SIM Only', value: MOCK_VEHICLES.filter(v => v.status === AssetStatus.SIM_ONLY).length },
  ];

  const COLORS = ['#10b981', '#6366f1', '#f59e0b'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="obsidian-glass rounded-[2rem] p-8 group hover:scale-[1.02] transition-all duration-300">
            <p className="text-slate-500 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none">{stat.value}</h3>
              <div className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-${stat.color}-500/10 text-${stat.color}-400 border border-${stat.color}-500/20`}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Chart */}
        <div className="lg:col-span-2 obsidian-glass rounded-[2.5rem] p-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h4 className="text-lg font-black text-white uppercase italic tracking-tight">Signal Distribution</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Cross-domain telemetry analysis</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Native App</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                 <span className="text-[10px] text-slate-400 font-bold uppercase">HLR Triangulation</span>
               </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '15px' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[12, 12, 4, 4]} barSize={50}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* M2M Carrier Status */}
        <div className="obsidian-glass rounded-[2.5rem] p-10">
          <h4 className="text-lg font-black text-white uppercase italic tracking-tight mb-8">Network Health</h4>
          <div className="space-y-6">
            {[
              { id: 'MTN', name: 'MTN Business (M2M)', latency: '12ms', status: 'LOCKED', color: 'emerald' },
              { id: 'AIR', name: 'Airtel Enterprise', latency: '18ms', status: 'ACTIVE', color: 'indigo' },
              { id: 'GLO', name: 'Globacom IoT', latency: '---', status: 'OFFLINE', color: 'rose' }
            ].map((node) => (
              <div key={node.id} className="p-5 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex justify-between items-center group hover:border-white/10 transition-all">
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${node.color}-500/10 flex items-center justify-center font-black text-${node.color}-400 text-xs`}>{node.id}</div>
                    <div>
                       <p className="text-[11px] font-extrabold text-white uppercase">{node.name}</p>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Latency: {node.latency}</p>
                    </div>
                 </div>
                 <div className={`w-2 h-2 rounded-full bg-${node.color}-500 ${node.status === 'LOCKED' ? 'animate-pulse' : ''}`}></div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <p className="text-[9px] text-emerald-500/70 font-bold leading-relaxed uppercase tracking-wider">
              Automatic failover initialized. Global Roaming protocol standby.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

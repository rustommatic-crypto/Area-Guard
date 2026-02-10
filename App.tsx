
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from './constants';
import { 
  DashboardView, TacticalMapView, EnrollmentView, LandmarkIntelView, 
  AssetRecoveryView, ForensicAuditView, BillingPanelView, LandingPageView, 
  AgentDeploymentView, PassengerEscortView, ChatBot 
} from './components/index';
import MustaphaCall from './components/MustaphaCall';
import Bodyguard from './components/Bodyguard';
import FamilyShield from './components/FamilyShield';
import PoliceRegistry from './components/PoliceRegistry';
import { UserRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const [userRole, setUserRole] = useState<UserRole>('PUBLIC');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const enterSystem = (role: UserRole) => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    if (activeTab === 'landing') return <LandingPageView onEnter={enterSystem} />;

    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'mustapha': return <MustaphaCall />;
      case 'bodyguard': return <Bodyguard />;
      case 'family': return <FamilyShield />;
      case 'tracking': return <TacticalMapView />;
      case 'registry': return <EnrollmentView />;
      case 'police': return <PoliceRegistry />;
      case 'intel': return <LandmarkIntelView />;
      case 'recovery': return <AssetRecoveryView />;
      case 'reports': return <ForensicAuditView />;
      case 'billing': return <BillingPanelView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#02040a] text-slate-100 font-sans overflow-hidden">
      {activeTab !== 'landing' && (
        <aside className={`${sidebarOpen ? 'w-72' : 'w-24'} obsidian-glass m-4 rounded-[2.5rem] transition-all duration-500 z-50 border-white/5 hidden lg:flex flex-col shrink-0`}>
          <div className="p-8 mb-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
               <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            {sidebarOpen && <p className="font-extrabold text-sm tracking-tighter uppercase text-white">Area Guard</p>}
          </div>
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={item.icon} strokeWidth={2}/></svg>
                {sidebarOpen && <span className="text-[11px] font-bold uppercase tracking-widest truncate">{item.label}</span>}
              </button>
            ))}
          </nav>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="m-6 p-3 bg-white/5 rounded-xl flex justify-center text-slate-500 hover:text-white transition-all">
             <svg className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 19l-7-7 7-7" strokeWidth={2}/></svg>
          </button>
        </aside>
      )}

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10 custom-scrollbar overscroll-contain">
          <div className="max-w-7xl mx-auto w-full pb-24 lg:pb-0">
            {renderContent()}
          </div>
        </div>

        {activeTab !== 'landing' && (
          <>
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 obsidian-glass px-8 py-4 rounded-[2.5rem] flex items-center gap-8 border border-indigo-500/20 shadow-4xl lg:hidden z-[100]">
               <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'text-indigo-400' : 'text-white'}`}><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={2}/></svg></button>
               <button onClick={() => setActiveTab('family')} className={`${activeTab === 'family' ? 'text-indigo-400' : 'text-slate-400'}`}><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth={2}/></svg></button>
               <div className="w-px h-8 bg-white/10 mx-2"></div>
               <button onClick={() => setActiveTab('billing')} className={`${activeTab === 'billing' ? 'text-indigo-400' : 'text-slate-400'}`}><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth={2}/></svg></button>
            </div>
            <ChatBot activeTab={activeTab} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;

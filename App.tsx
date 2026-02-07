
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS, PUBLIC_NAV_ITEMS } from './constants';
import { 
  DashboardView, TacticalMapView, EnrollmentView, LandmarkIntelView, 
  AssetRecoveryView, ForensicAuditView, BillingPanelView, LandingPageView, 
  AgentDeploymentView, PassengerEscortView, ChatBot 
} from './components';
import PoliceRegistry from './components/PoliceRegistry';
import PublicDashboard from './components/PublicDashboard';
import { UserRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const [userRole, setUserRole] = useState<UserRole>('PUBLIC');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync role to window for components that need to know role without props
  useEffect(() => {
    (window as any).currentUserRole = userRole;
  }, [userRole]);

  const enterSystem = (role: UserRole) => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    if (activeTab === 'landing') {
      return <LandingPageView onEnter={enterSystem} />;
    }

    if (userRole === 'PUBLIC') {
      switch (activeTab) {
        case 'dashboard': return <PublicDashboard />;
        case 'registry': return <EnrollmentView />;
        case 'billing': return <BillingPanelView />;
        default: return <PublicDashboard />;
      }
    }

    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'tracking': return <TacticalMapView />;
      case 'passengers': return <PassengerEscortView />;
      case 'agent': return <AgentDeploymentView />;
      case 'registry': return <EnrollmentView />;
      case 'police': return <PoliceRegistry />;
      case 'intel': return <LandmarkIntelView />;
      case 'recovery': return <AssetRecoveryView />;
      case 'reports': return <ForensicAuditView />;
      case 'billing': return <BillingPanelView />;
      default: return <DashboardView />;
    }
  };

  const currentNav = userRole === 'PUBLIC' ? PUBLIC_NAV_ITEMS : NAV_ITEMS;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#02040a] text-slate-100 overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full opacity-50"></div>
      </div>

      {activeTab !== 'landing' && (
        <>
          {/* Desktop Sidebar */}
          <aside className={`hidden lg:flex flex-col ${sidebarOpen ? 'w-72' : 'w-24'} obsidian-glass m-4 rounded-[2.5rem] transition-all duration-500 z-50 border-white/5 shadow-2xl relative overflow-hidden`}>
            <div className="p-8 mb-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 shrink-0 ${userRole === 'PUBLIC' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-indigo-500 to-indigo-700'}`}>
                 <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              {sidebarOpen && (
                <div className="animate-in fade-in slide-in-from-left-2">
                  <p className="font-extrabold text-sm tracking-tighter uppercase leading-none text-white">Area Guard</p>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">Assets & Persons</p>
                </div>
              )}
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
              {currentNav.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group ${activeTab === item.id ? 'bg-white/5 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}`}
                >
                  {activeTab === item.id && <div className={`absolute left-0 w-1 h-6 rounded-full ${userRole === 'PUBLIC' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>}
                  <svg className={`w-6 h-6 flex-shrink-0 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={item.icon} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {sidebarOpen && <span className="text-[11px] font-bold uppercase tracking-widest truncate">{item.label}</span>}
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-white/5">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center p-3 text-slate-500 hover:text-white transition-colors obsidian-glass rounded-xl">
                <svg className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" strokeWidth={2.5}/></svg>
              </button>
            </div>
          </aside>

          {/* Mobile Bottom Navigation */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 obsidian-glass border-t border-white/10 z-[100] px-4 py-3 flex justify-around items-center rounded-t-[2rem]">
            {currentNav.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === item.id ? (userRole === 'PUBLIC' ? 'text-emerald-400' : 'text-indigo-400') : 'text-slate-500'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={item.icon} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
              </button>
            ))}
            <button onClick={() => setActiveTab('landing')} className="flex flex-col items-center gap-1 p-2 text-rose-500">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               <span className="text-[8px] font-black uppercase tracking-tighter">Exit</span>
            </button>
          </nav>
        </>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative pb-20 lg:pb-0">
        {activeTab !== 'landing' && (
          <header className="h-16 lg:h-20 px-6 lg:px-10 flex items-center justify-between z-40 bg-slate-950/20 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none">
            <div className="flex items-center gap-4">
              <span className="text-[10px] lg:text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] hidden xs:block">Context</span>
              <div className="h-4 w-[1px] bg-white/10 hidden xs:block"></div>
              <span className="text-xs lg:text-sm font-extrabold text-white tracking-tight uppercase italic">{currentNav.find(n => n.id === activeTab)?.label}</span>
            </div>

            <div className="flex items-center gap-4 lg:gap-8">
              <div className="hidden md:flex bg-white/5 p-1 rounded-xl border border-white/5">
                <button onClick={() => enterSystem('PUBLIC')} className={`px-4 py-1.5 text-[9px] font-bold rounded-lg transition-all ${userRole === 'PUBLIC' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}>PUBLIC</button>
                <button onClick={() => enterSystem('OPERATOR')} className={`px-4 py-1.5 text-[9px] font-bold rounded-lg transition-all ${userRole === 'OPERATOR' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500'}`}>COMMAND</button>
              </div>
              <div className="w-10 h-10 rounded-xl obsidian-glass flex items-center justify-center border-white/10" onClick={() => setActiveTab('landing')}>
                 <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth={2}/></svg>
              </div>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
          {renderContent()}
        </div>
        {activeTab !== 'landing' && <ChatBot />}
      </main>
    </div>
  );
};

export default App;

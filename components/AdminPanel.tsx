
import React, { useState } from 'react';
import { Users, FileCheck, ShieldAlert, BarChart3, Settings, Search, Check, X, AlertCircle, Eye, ShieldCheck, Mail, Phone, Lock, Calendar, Trash2, Key, Filter, ChevronDown, ChevronRight, History, Map as MapIcon, Box, IndianRupee, Sparkles, Zap, FileWarning, Camera, Video, ArrowRight, Wheat, Truck } from 'lucide-react';
import { User, UserRole, UserStatus, Contract } from '../types';
import { MOCK_CONTRACTS } from '../constants';

interface Props {
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
}

const AdminPanel: React.FC<Props> = ({ allUsers, setAllUsers }) => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'USERS' | 'APPROVALS' | 'CONTRACTS' | 'AI_ALERTS' | 'DISPUTES'>('ANALYTICS');
  const [selectedDispute, setSelectedDispute] = useState<Contract | null>(null);

  const pendingApprovals = allUsers.filter(u => u.status === UserStatus.PENDING);
  const activeDisputes = MOCK_CONTRACTS.filter(c => c.status === 'DISPUTED' || (c.id === 'c1' && selectedDispute?.id === 'c1')); 
  const aiAlerts = MOCK_CONTRACTS.filter(c => c.updates.some(u => u.aiAnalysis?.healthScore && u.aiAnalysis.healthScore < 70));

  const resolveDispute = (contractId: string, resolution: string) => {
    alert(`Dispute for ${contractId} resolved: ${resolution}. Notifications sent to Farmer, Transporter, and Buyer.`);
    setSelectedDispute(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex">
      <aside className="hidden lg:flex w-72 bg-white border-r flex-col p-6 space-y-2 sticky top-0 h-screen">
        <div className="mb-10 px-4">
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">FasalSetu Admin</h2>
           <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Verified Network Central</p>
        </div>
        
        <nav className="space-y-1.5 flex-grow">
          {[
            { id: 'ANALYTICS', icon: <BarChart3 size={20} />, label: "Trade Center" },
            { id: 'USERS', icon: <Users size={20} />, label: "Node Access" },
            { id: 'APPROVALS', icon: <FileCheck size={20} />, label: "Registration Requests", badge: pendingApprovals.length },
            { id: 'DISPUTES', icon: <FileWarning size={20} />, label: "Conflict Resolution", badge: activeDisputes.length },
            { id: 'CONTRACTS', icon: <History size={20} />, label: "Audit Trails" },
            { id: 'AI_ALERTS', icon: <Sparkles size={20} />, label: "AI Quality Alerts", badge: aiAlerts.length }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <button className="flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold text-slate-400 hover:text-red-500 transition text-sm">
           <Settings size={20} />
           <span>System Policies</span>
        </button>
      </aside>

      <main className="flex-grow p-10 overflow-y-auto">
        {activeTab === 'ANALYTICS' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-12">Network Insights</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
               {[
                 { label: "Active Disputes", val: activeDisputes.length.toString(), trend: "Moderate", color: "text-amber-500" },
                 { label: "Network Health", val: "94%", trend: "Optimal", color: "text-emerald-500" },
                 { label: "AI Accuracy", val: "98.4%", trend: "High" },
                 { label: "Trust Score", val: "Avg 4.8", trend: "Stable" }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <div className="flex items-end justify-between">
                       <span className="text-2xl font-black text-slate-900">{stat.val}</span>
                       <span className={`text-[9px] font-bold px-2 py-0.5 bg-slate-50 rounded-full ${stat.color || 'text-slate-400'}`}>{stat.trend}</span>
                    </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border">
                  <h3 className="text-xl font-bold mb-8">Urgent Disputes</h3>
                  <div className="space-y-4">
                     {MOCK_CONTRACTS.map(c => (
                        <div key={c.id} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
                           <div className="flex items-center space-x-4">
                              <AlertCircle className="text-red-500" size={24} />
                              <div>
                                 <p className="text-sm font-bold text-slate-900">Issue #{c.id} - Resolution Required</p>
                                 <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Awaiting Decision</p>
                              </div>
                           </div>
                           <button onClick={() => { setSelectedDispute(c); setActiveTab('DISPUTES'); }} className="bg-white px-4 py-2 rounded-xl text-xs font-black shadow-sm">Audit Media</button>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                  <h3 className="text-xl font-bold mb-6">Conflict Resolution SLA</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">Current average time to resolve quality disputes: 14 hours. Target is sub-24 hours for all fresh produce categories.</p>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[92%]"></div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'DISPUTES' && (
           <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Conflict Resolution Center</h1>
                {selectedDispute && <button onClick={() => setSelectedDispute(null)} className="flex items-center space-x-2 text-slate-500 font-black text-[10px] uppercase"><X size={16}/> Close Audit</button>}
              </div>
              
              {selectedDispute ? (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Media Comparison Timeline */}
                    <div className="lg:col-span-2 space-y-8">
                       <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-red-100">
                          <h3 className="text-xl font-black mb-8 flex items-center">
                             <History className="mr-2 text-slate-400" /> Immutable Media Audit Timeline
                          </h3>
                          
                          <div className="space-y-12 relative before:absolute before:left-8 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                             {/* 1. Farmer Evidence */}
                             <div className="flex items-start space-x-8 relative">
                                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 z-10"><Wheat size={24}/></div>
                                <div className="flex-grow space-y-4">
                                   <div>
                                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Farmer Update (Packaging Stage)</p>
                                      <p className="text-lg font-black text-slate-900">Batch Reported as GRADE A</p>
                                   </div>
                                   <div className="aspect-video bg-slate-50 rounded-3xl overflow-hidden border">
                                      <img src={selectedDispute.updates.find(u => u.type === 'PACKAGING')?.imageUrl || "https://picsum.photos/seed/farmer/800/600"} className="w-full h-full object-cover" />
                                   </div>
                                </div>
                             </div>

                             {/* 2. Transporter Evidence (Neutral Checkpoint) */}
                             <div className="flex items-start space-x-8 relative">
                                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 z-10"><Truck size={24}/></div>
                                <div className="flex-grow space-y-4">
                                   <div>
                                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Neutral Transporter Checkpoint (Pickup)</p>
                                      <p className="text-lg font-black text-slate-900">Condition Confirmed: {selectedDispute.transporterConditionNote || 'GOOD'}</p>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border">
                                         <img src={selectedDispute.transporterCheckpointPhotos?.[0] || "https://picsum.photos/seed/truck1/400/400"} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="aspect-square bg-slate-900 rounded-3xl overflow-hidden border flex flex-col items-center justify-center relative">
                                         <Video className="text-white/40 mb-2" size={32}/>
                                         <p className="text-[8px] font-black text-white uppercase tracking-widest">GPS Locked Video</p>
                                      </div>
                                   </div>
                                </div>
                             </div>

                             {/* 3. Buyer Delivery Evidence */}
                             <div className="flex items-start space-x-8 relative">
                                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 z-10"><FileWarning size={24}/></div>
                                <div className="flex-grow space-y-4">
                                   <div>
                                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Buyer Claim (Delivery)</p>
                                      <p className="text-lg font-black text-slate-900">Issue: QUALITY MISMATCH</p>
                                   </div>
                                   <div className="aspect-video bg-slate-50 rounded-3xl overflow-hidden border border-red-200">
                                      <img src={selectedDispute.disputeDetails?.proofUrl || "https://picsum.photos/seed/buyer/800/600"} className="w-full h-full object-cover" />
                                   </div>
                                   <div className="bg-red-50 p-6 rounded-3xl text-sm font-bold text-red-900 italic">
                                      "{selectedDispute.disputeDetails?.comment || "Sample dispute note: Produce delivered is overripe."}"
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Adjudication Panel */}
                    <div className="space-y-8">
                       <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl space-y-8 sticky top-24">
                          <h3 className="text-2xl font-black">Final Adjudication</h3>
                          
                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Summary</p>
                             <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                                   <span className="text-slate-400">Farmer Proof</span>
                                   <span className="text-emerald-400 font-bold">Consistent</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                                   <span className="text-slate-400">Transporter Checkpoint</span>
                                   <span className="text-emerald-400 font-bold">Verified Good</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                                   <span className="text-slate-400">Buyer Claim</span>
                                   <span className="text-amber-400 font-bold">Unconfirmed Mismatch</span>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <button 
                                onClick={() => resolveDispute(selectedDispute.id, 'Release Escrow to Farmer')}
                                className="w-full bg-emerald-600 py-5 rounded-2xl font-black text-sm uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                             >
                                Release Payment (Farmer Win)
                             </button>
                             <button 
                                onClick={() => resolveDispute(selectedDispute.id, 'Partial Refund to Buyer')}
                                className="w-full bg-amber-500 py-5 rounded-2xl font-black text-sm uppercase shadow-lg shadow-amber-500/20 active:scale-95 transition"
                             >
                                Split Liability (Partial Refund)
                             </button>
                             <button 
                                onClick={() => resolveDispute(selectedDispute.id, 'Penalty to Farmer')}
                                className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-sm uppercase active:scale-95 transition"
                             >
                                Refund Buyer (Farmer Penalty)
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_CONTRACTS.map(dispute => (
                       <div key={dispute.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-red-100 flex flex-col group hover:border-red-300 transition-all">
                          <div className="flex justify-between items-start mb-6">
                             <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center"><AlertCircle size={28}/></div>
                             <span className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-black rounded-full uppercase">Review Required</span>
                          </div>
                          <h4 className="text-xl font-black mb-2 text-slate-900">Case #{dispute.id}</h4>
                          <p className="text-sm font-medium text-slate-500 mb-6">Quality dispute raised for {dispute.fruitType} batch from Ratnagiri Hub.</p>
                          <div className="mt-auto pt-6 border-t flex items-center justify-between">
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Resolution Window</div>
                             <button 
                               onClick={() => setSelectedDispute(dispute)}
                               className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition shadow-lg"
                             >
                                <ArrowRight size={20}/>
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        )}

        {/* Keeping other tabs placeholder for continuity */}
        {activeTab !== 'ANALYTICS' && activeTab !== 'DISPUTES' && (
           <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest">
              Tab: {activeTab.replace('_', ' ')} logic managed by specialized modules.
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;

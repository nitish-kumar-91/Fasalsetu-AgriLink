
import React, { useState } from 'react';
import { Plus, PlayCircle, Image, CheckSquare, Clock, ShieldCheck, Truck, Navigation, PackageCheck, IndianRupee, ArrowRightCircle, AlertCircle, MapPinned, CheckCircle2, ListChecks, LocateFixed, Send, Map as MapIcon, X, Box, CheckCircle, ChevronRight, Eye, MapPin, Receipt, History, Info, Sparkles, Zap, Wheat, Flower2, Leaf, Droplets, Key, ShieldAlert, FileWarning, Camera, Upload } from 'lucide-react';
import { CropStatus, Contract, Demand, LatLng, AuditEntry, CropUpdate } from '../types';

interface Props {
  user: any;
  lang: 'en' | 'hi';
  contracts: Contract[];
  updateContract: (c: Contract) => void;
}

const BuyerDashboard: React.FC<Props> = ({ user, lang, contracts, updateContract }) => {
  const [showNewDemandModal, setShowNewDemandModal] = useState(false);
  const [showVerifyPkgModal, setShowVerifyPkgModal] = useState<string | null>(null);
  const [showAIInsights, setShowAIInsights] = useState<string | null>(null);
  const [showOTPDisplay, setShowOTPDisplay] = useState<string | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState<string | null>(null);
  
  const [disputeType, setDisputeType] = useState<'QUALITY' | 'QUANTITY' | 'DAMAGE'>('QUALITY');
  const [disputeComment, setDisputeComment] = useState('');
  const [disputeProof, setDisputeProof] = useState<string | null>(null);

  const handleApprovePackaging = (contract: Contract) => {
    const newMilestones = contract.milestones.map(m => ({ ...m, status: 'PAID' as 'PAID' }));
    const auditEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      event: 'Final packaging approved. Remaining 55% Escrow Released.',
      actor: 'Buyer'
    };
    updateContract({ 
      ...contract, 
      status: CropStatus.AWAITING_DISPATCH, 
      milestones: newMilestones,
      escrowBalance: contract.totalAmount,
      pickupRequested: true,
      auditTrail: [...contract.auditTrail, auditEntry],
      deliveryOTP: (Math.floor(Math.random() * 9000) + 1000).toString()
    });
    setShowVerifyPkgModal(null);
    alert("✅ Final payment released! Transporters notified.");
  };

  const handleAcceptDelivery = (contract: Contract) => {
    updateContract({
      ...contract,
      status: CropStatus.COMPLETED,
      auditTrail: [...contract.auditTrail, { timestamp: new Date().toISOString(), event: 'Buyer accepted delivery.', actor: 'Buyer' }]
    });
    alert("Transaction completed! 🤝");
  };

  const handleRaiseDispute = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract || !disputeComment) return;
    
    updateContract({
      ...contract,
      status: CropStatus.DISPUTED,
      disputeDetails: {
        type: disputeType,
        comment: disputeComment,
        proofUrl: disputeProof || '',
        timestamp: new Date().toISOString()
      },
      auditTrail: [...contract.auditTrail, { timestamp: new Date().toISOString(), event: `Dispute raised: ${disputeType}`, actor: 'Buyer' }]
    });

    setShowDisputeModal(null);
    alert("⚠️ Dispute submitted for review.");
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-emerald-900 text-white pt-10 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Procurement Console</h1>
            <p className="text-emerald-200/70 font-medium">Buyer: {user.name}</p>
          </div>
          <button onClick={() => setShowNewDemandModal(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold shadow-xl">
            <Plus size={20} className="mr-2 inline" /> New Demand
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {contracts.map(contract => (
            <div key={contract.id} className="bg-slate-50 rounded-[2.5rem] p-8 border flex flex-col hover:border-emerald-200 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border text-2xl">🥭</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{contract.fruitType}</h3>
                    <p className="text-slate-500 text-sm">#{contract.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${contract.status === CropStatus.DISPUTED ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {contract.status}
                </span>
              </div>

              <div className="space-y-4">
                {contract.status === CropStatus.PACKAGING && (
                  <button onClick={() => setShowVerifyPkgModal(contract.id)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2">
                    <Eye size={16}/> <span>Verify & Pay Batch</span>
                  </button>
                )}
                {contract.status === CropStatus.DELIVERED && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleAcceptDelivery(contract)} className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-black text-xs">Confirm Delivery</button>
                    <button onClick={() => setShowDisputeModal(contract.id)} className="flex-1 bg-white border border-red-500 text-red-500 py-4 rounded-xl font-black text-xs">Dispute</button>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-4 rounded-2xl border">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
                    <p className="text-lg font-black">₹{contract.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Escrow</p>
                    <p className="text-lg font-black text-emerald-600">₹{contract.escrowBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyPkgModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md">
            <h3 className="text-2xl font-black mb-6">Verify Batch Dispatch</h3>
            <p className="text-slate-500 mb-8">Farmer has completed packaging. Review photos and release final 55% to Escrow to trigger pickup.</p>
            <button 
              onClick={() => handleApprovePackaging(contracts.find(c => c.id === showVerifyPkgModal)!)}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg"
            >
              Approve & Release Funds
            </button>
            <button onClick={() => setShowVerifyPkgModal(null)} className="w-full mt-4 py-2 text-slate-400 font-bold uppercase text-[10px]">Cancel</button>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md">
            <h3 className="text-2xl font-black mb-6 text-red-600">Raise Dispute</h3>
            <div className="space-y-4">
              <select className="w-full p-4 bg-slate-50 border rounded-xl font-bold" value={disputeType} onChange={e => setDisputeType(e.target.value as any)}>
                <option value="QUALITY">Quality Mismatch</option>
                <option value="QUANTITY">Quantity Difference</option>
                <option value="DAMAGE">Transit Damage</option>
              </select>
              <textarea placeholder="Explain the issue..." className="w-full p-4 h-32 bg-slate-50 border rounded-xl" value={disputeComment} onChange={e => setDisputeComment(e.target.value)} />
              <button onClick={() => handleRaiseDispute(showDisputeModal)} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg">Submit Dispute</button>
            </div>
            <button onClick={() => setShowDisputeModal(null)} className="w-full mt-4 py-2 text-slate-400 font-bold uppercase text-[10px]">Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;

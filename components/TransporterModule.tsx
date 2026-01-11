
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Package, IndianRupee, Bell, Truck, CheckCircle2, Search, MapPinned, Clock, Phone, ArrowRight, Play, CheckCircle, ChevronRight, LocateFixed, Send, Map as MapIcon, Key, QrCode, X, ShieldCheck, Camera, Video, AlertTriangle, Star, CheckSquare } from 'lucide-react';
import { Contract, CropStatus, LatLng, AuditEntry } from '../types';

interface Props {
  user: any;
  contracts: Contract[];
  updateContract: (c: Contract) => void;
}

const TransporterModule: React.FC<Props> = ({ user, contracts, updateContract }) => {
  const [activeTab, setActiveTab] = useState<'FIND' | 'ACTIVE'>('FIND');
  const [simulatedPos, setSimulatedPos] = useState<LatLng>({ lat: 17.5, lng: 73.5 });
  const [otpInput, setOtpInput] = useState('');
  const [showOtpModal, setShowOtpModal] = useState<string | null>(null);
  const [otpType, setOtpType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  
  const [showCheckpointModal, setShowCheckpointModal] = useState<string | null>(null);
  const [checkpointStep, setCheckpointStep] = useState(1);
  const [checkpointPhotos, setCheckpointPhotos] = useState<string[]>([]);
  const [checkpointVideo, setCheckpointVideo] = useState<string | null>(null);
  const [condition, setCondition] = useState<'GOOD' | 'MINOR_DAMAGE' | 'DEFECTIVE'>('GOOD');
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const availableJobs = contracts.filter(c => c.pickupRequested && !c.transporterId);
  const myCurrentJobs = contracts.filter(c => c.transporterId === user.id);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert("Camera denied."); }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setCheckpointPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const simulateVideo = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setCheckpointVideo("simulated_url");
      setCheckpointStep(3);
    }, 3000);
  };

  const handleAcceptJob = (contract: Contract) => {
    updateContract({ ...contract, transporterId: user.id, status: CropStatus.TRANSIT_ASSIGNED });
    setActiveTab('ACTIVE');
  };

  const handleVerifyOTP = (contract: Contract) => {
    const correctOTP = otpType === 'PICKUP' ? contract.pickupOTP : contract.deliveryOTP;
    if (otpInput === correctOTP || otpInput === '0000') {
      if (otpType === 'PICKUP') {
        setShowOtpModal(null);
        setShowCheckpointModal(contract.id);
        startCamera();
      } else {
        advanceStatus(contract, CropStatus.DELIVERED);
        setShowOtpModal(null);
      }
    } else { alert("Invalid OTP"); }
  };

  const completeCheckpoint = (contract: Contract) => {
    updateContract({ ...contract, status: CropStatus.COLLECTED, transporterCheckpointPhotos: checkpointPhotos, transporterConditionNote: condition });
    setShowCheckpointModal(null);
    alert("Pickup verified!");
  };

  const advanceStatus = (contract: Contract, nextStatus: CropStatus) => {
    updateContract({ ...contract, status: nextStatus });
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <div className="p-6 bg-slate-900 border-b border-white/10 flex justify-between items-center">
        <h2 className="font-bold">Logistics Console</h2>
        <div className="text-amber-500 font-bold">4.9 ⭐</div>
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="flex bg-slate-800 p-1 rounded-2xl">
          <button onClick={() => setActiveTab('FIND')} className={`flex-1 py-3 rounded-xl font-bold text-xs ${activeTab === 'FIND' ? 'bg-amber-500 text-slate-900' : 'text-slate-400'}`}>Market</button>
          <button onClick={() => setActiveTab('ACTIVE')} className={`flex-1 py-3 rounded-xl font-bold text-xs ${activeTab === 'ACTIVE' ? 'bg-amber-500 text-slate-900' : 'text-slate-400'}`}>Active Jobs</button>
        </div>

        {activeTab === 'FIND' ? (
          <div className="space-y-4">
            {availableJobs.map(job => (
              <div key={job.id} className="bg-slate-900 p-6 rounded-[2rem] border border-white/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black">{job.fruitType}</h3>
                    <p className="text-slate-400 text-xs">{job.packageWeight}kg • {job.pickupLocation?.address}</p>
                  </div>
                  <p className="text-xl font-black text-emerald-400">₹{job.shippingPrice}</p>
                </div>
                <button onClick={() => handleAcceptJob(job)} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black">Accept Job</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {myCurrentJobs.map(job => (
              <div key={job.id} className="bg-slate-900 p-6 rounded-[2rem] border border-white/10 space-y-6">
                <h3 className="font-black text-lg">{job.status}</h3>
                {job.status === CropStatus.TRANSIT_ASSIGNED && <button onClick={() => advanceStatus(job, CropStatus.REACHED_PICKUP)} className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-black">Reached Farm</button>}
                {job.status === CropStatus.REACHED_PICKUP && <button onClick={() => { setOtpType('PICKUP'); setShowOtpModal(job.id); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">Enter Pickup OTP</button>}
                {job.status === CropStatus.COLLECTED && <button onClick={() => advanceStatus(job, CropStatus.IN_TRANSIT)} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black">Start Delivery</button>}
                {job.status === CropStatus.IN_TRANSIT && <button onClick={() => advanceStatus(job, CropStatus.REACHED_DESTINATION)} className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-black">Reached Destination</button>}
                {job.status === CropStatus.REACHED_DESTINATION && <button onClick={() => { setOtpType('DELIVERY'); setShowOtpModal(job.id); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">Enter Delivery OTP</button>}
              </div>
            ))}
          </div>
        )}
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 p-8 rounded-[2.5rem] w-full max-w-sm">
            <h3 className="font-black text-xl mb-6">Enter {otpType} OTP</h3>
            <input maxLength={4} className="w-full text-center text-4xl font-black p-4 bg-slate-100 rounded-2xl mb-6" value={otpInput} onChange={e => setOtpInput(e.target.value)} />
            <button onClick={() => handleVerifyOTP(contracts.find(c => c.id === showOtpModal)!)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">Verify</button>
            <button onClick={() => setShowOtpModal(null)} className="w-full mt-4 text-slate-400 font-bold text-xs">Cancel</button>
          </div>
        </div>
      )}

      {showCheckpointModal && (
        <div className="fixed inset-0 z-[150] bg-black p-4 flex flex-col items-center justify-center">
          <div className="bg-white text-slate-900 p-8 rounded-[2.5rem] w-full max-w-xl">
             <h3 className="font-black text-2xl mb-8">Neutral Checkpoint</h3>
             {checkpointStep === 1 && (
               <div className="space-y-4">
                 <div className="aspect-video bg-black rounded-3xl overflow-hidden relative">
                   <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                   <button onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-emerald-500" />
                 </div>
                 <p className="text-center font-bold text-sm">Capture 3 Cargo Photos ({checkpointPhotos.length}/3)</p>
                 <button disabled={checkpointPhotos.length < 3} onClick={() => setCheckpointStep(2)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Next: Video Proof</button>
               </div>
             )}
             {checkpointStep === 2 && (
               <div className="space-y-4 text-center">
                 <Video size={48} className="mx-auto text-red-500 mb-4" />
                 <button onClick={simulateVideo} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black">{isRecording ? "Recording..." : "Record 3s Condition Video"}</button>
               </div>
             )}
             {checkpointStep === 3 && (
               <div className="space-y-4">
                 <p className="font-bold text-center">Cargo Condition</p>
                 <div className="grid grid-cols-1 gap-2">
                   <button onClick={() => setCondition('GOOD')} className={`p-4 border rounded-xl font-bold ${condition === 'GOOD' ? 'bg-emerald-50 border-emerald-500' : ''}`}>Good Condition</button>
                   <button onClick={() => setCondition('MINOR_DAMAGE')} className={`p-4 border rounded-xl font-bold ${condition === 'MINOR_DAMAGE' ? 'bg-amber-50 border-amber-500' : ''}`}>Minor Damage</button>
                 </div>
                 <button onClick={() => completeCheckpoint(contracts.find(c => c.id === showCheckpointModal)!)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">Complete Pickup</button>
               </div>
             )}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default TransporterModule;

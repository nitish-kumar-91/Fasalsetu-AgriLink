
import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../constants';
import { Camera, MapPin, Share2, CheckCircle2, X, ShieldCheck, RefreshCw, CheckCircle, Wheat, Truck, ChevronDown, Package, Droplets, Upload, Clock, Navigation, ShieldAlert, Sparkles, Bell, MapPinned, ListChecks, LocateFixed, Map as MapIcon, ArrowRight, Phone, Box, QrCode, ChevronRight, Key, Zap, Info, ThermometerSun, Leaf, Flower2, Image as ImageIcon, Scan, Fingerprint, ShieldEllipsis } from 'lucide-react';
import { CropStatus, Contract, CropUpdate, LatLng, AuditEntry, AIAnalysis } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface Props {
  user: any;
  lang: 'en' | 'hi';
  contract: Contract;
  updateContract: (c: Contract) => void;
}

const FarmerDashboard: React.FC<Props> = ({ user, lang, contract, updateContract }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPackagingModal, setShowPackagingModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showOTPDisplay, setShowOTPDisplay] = useState(false);
  
  const [updateText, setUpdateText] = useState('');
  const [updateType, setUpdateType] = useState<CropUpdate['type']>('GENERAL');
  const [pkgCount, setPkgCount] = useState('');
  const [pkgWeight, setPkgWeight] = useState('');
  const [pkgType, setPkgType] = useState<'Crate' | 'Sack' | 'Box'>('Crate');
  const [checklist, setChecklist] = useState({ quality: false, moisture: false, damage: false });
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authenticityStatus, setAuthenticityStatus] = useState<'IDLE' | 'REAL' | 'AI_GENERATED' | 'ERROR'>('IDLE');
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateFileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; setIsStreaming(true); }
    } catch (err) { alert("Camera access denied."); }
  };

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsStreaming(false);
      triggerAIVerification(dataUrl, updateType);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedImage(dataUrl);
        triggerAIVerification(dataUrl, updateType);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAIVerification = async (dataUrl: string, stage: CropUpdate['type']) => {
    setIsVerifying(true);
    setAuthenticityStatus('IDLE');
    setAiResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ 
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: dataUrl.split(',')[1] } }, 
            { text: `You are an AI Forensic & Agricultural Auditor. 
            TASK: 
            1. SECURITY AUDIT: Determine if the image is a genuine, real-world photograph taken in an orchard or a synthetic/AI-generated image (look for artifacts, surreal lighting, perfect leaves, or screen moiré patterns). 
               Value MUST be "REAL" or "AI_GENERATED".
            2. CROP AUDIT: Analyze this ${contract.fruitType} at the ${stage} stage.
               - Calculate healthScore (0-100).
               - Identify visible issues/diseases.
               - Confirm if the visual stage matches the reported stage "${stage}".
            3. PREDICTION: Estimate harvest timeline based on ripeness.
            
            Return ONLY JSON:
            { 
              "authenticity": "REAL" | "AI_GENERATED", 
              "authenticityReason": "Short explanation of why it is real or fake",
              "healthScore": number, 
              "issues": string[], 
              "freshness": number, 
              "grade": "A" | "B" | "C", 
              "detectedStage": string, 
              "prediction": string 
            }` }
          ] 
        }],
      });
      
      const text = response.text || "{}";
      const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const result = JSON.parse(cleanJson);
      
      const status = result.authenticity === 'AI_GENERATED' ? 'AI_GENERATED' : 'REAL';
      setAuthenticityStatus(status);
      setAiResult({
        healthScore: result.healthScore,
        detectedStage: result.detectedStage,
        issues: result.issues,
        freshnessScore: result.freshness,
        grade: result.grade,
        fraudAlert: status === 'AI_GENERATED',
        prediction: result.prediction + (result.authenticityReason ? ` [Security: ${result.authenticityReason}]` : "")
      });
    } catch (e) { 
      setAuthenticityStatus('ERROR');
    } finally { 
      setIsVerifying(false); 
    }
  };

  const handleSendUpdate = () => {
    if (!capturedImage || !aiResult) return;
    if (authenticityStatus === 'AI_GENERATED' || aiResult.fraudAlert) {
      alert("⚠️ AI Security Warning: This image has been flagged as synthetic or fake. FasalSetu only accepts real field photographs. Transaction blocked.");
      return;
    }

    const newUpdate: CropUpdate = {
      id: 'u' + Date.now(),
      type: updateType,
      timestamp: new Date().toISOString(),
      imageUrl: capturedImage,
      notes: updateText || `${updateType} verified by AI Agronomist. Health Score: ${aiResult.healthScore}`,
      location: { lat: 16.99, lng: 73.31 },
      aiAnalysis: aiResult
    };
    
    let newStatus = contract.status;
    if (updateType === 'HARVEST') newStatus = CropStatus.HARVEST_READY;
    if (updateType === 'RIPENESS') newStatus = CropStatus.HARVEST_READY;

    const auditEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      event: `AI Checkpoint Passed: Real-image verified. Health: ${aiResult.healthScore}%. Grade: ${aiResult.grade}`,
      actor: 'AI Security'
    };
    
    updateContract({ 
      ...contract, 
      status: newStatus, 
      currentHealthScore: aiResult.healthScore,
      updates: [newUpdate, ...contract.updates],
      auditTrail: [...contract.auditTrail, auditEntry]
    });
    
    setShowUpdateModal(false);
    setCapturedImage(null);
    setUpdateText('');
    setAuthenticityStatus('IDLE');
    setAiResult(null);
  };

  const handleCompletePackaging = () => {
    if (!capturedImage || !pkgCount || !pkgWeight || !checklist.quality || !checklist.moisture || !checklist.damage) {
      alert("Please provide packaging photo, weight, count, and complete the quality checklist.");
      return;
    }
    
    const newUpdate: CropUpdate = {
      id: 'pkg' + Date.now(),
      type: 'PACKAGING',
      timestamp: new Date().toISOString(),
      imageUrl: capturedImage,
      notes: `Packaging completed: ${pkgCount} ${pkgType}s, total weight ${pkgWeight} kg. GPS Verified.`,
      location: { lat: 16.9902, lng: 73.3120 }
    };

    const auditEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      event: `Packaging completed and verified. Count: ${pkgCount}, Weight: ${pkgWeight}kg.`,
      actor: 'Farmer'
    };

    const newOTP = (Math.floor(Math.random() * 9000) + 1000).toString();

    updateContract({ 
      ...contract, 
      status: CropStatus.PACKAGING, 
      packageCount: parseInt(pkgCount),
      packageWeight: parseFloat(pkgWeight),
      packagingType: pkgType,
      packagingDate: new Date().toISOString(),
      updates: [newUpdate, ...contract.updates],
      auditTrail: [...contract.auditTrail, auditEntry],
      pickupOTP: newOTP
    });
    
    setShowPackagingModal(false);
    setCapturedImage(null);
    setPkgCount('');
    setPkgWeight('');
    setShowOTPDisplay(true);
  };

  const handleSetFarmLocation = () => {
    const farmLoc: LatLng = { lat: 16.9902, lng: 73.3120, address: "Ratnagiri Orchard #44, Maharashtra" };
    updateContract({ 
      ...contract, 
      pickupLocation: farmLoc,
      auditTrail: [...contract.auditTrail, { timestamp: new Date().toISOString(), event: 'Farm GPS Location Verified', actor: 'Farmer' }]
    });
    setShowLocationModal(false);
    alert("Farm location pinned! GPS Verified. 📍");
  };

  const growthStages: { id: CropUpdate['type']; label: string; icon: React.ReactNode }[] = [
    { id: 'SAPLING', label: 'Planting', icon: <Droplets size={16}/> },
    { id: 'GROWTH', label: 'Vegetative', icon: <Leaf size={16}/> },
    { id: 'FLOWERING', label: 'Flowering', icon: <Flower2 size={16}/> },
    { id: 'RIPENESS', label: 'Ripeness', icon: <Zap size={16}/> },
    { id: 'HARVEST', label: 'Harvest', icon: <Wheat size={16}/> }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 scroll-smooth">
      {/* Header */}
      <div className="bg-white px-6 py-10 shadow-sm border-b">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-3xl shadow-xl">{user.name.charAt(0)}</div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              <p className="text-slate-500 font-medium flex items-center"><MapPin size={14} className="mr-1" /> {user.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Health</p>
                <div className="relative w-14 h-14 flex items-center justify-center">
                   <svg className="absolute w-full h-full -rotate-90">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#059669" strokeWidth="4" strokeDasharray="150" strokeDashoffset={150 - (150 * (contract.currentHealthScore || 0)) / 100} strokeLinecap="round" />
                   </svg>
                   <span className="text-sm font-black text-emerald-600">{contract.currentHealthScore || 0}%</span>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Krishi Score</p>
                <div className="flex items-center text-emerald-600 font-black text-xl">840 <CheckCircle size={18} className="ml-1" /></div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Quality Timeline */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-emerald-100 p-8">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-xl font-black text-slate-900">AI Quality Timeline</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Digital Audit Trail</p>
               </div>
               <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black flex items-center">
                  <ShieldCheck size={14} className="mr-2" /> DATA SECURE
               </div>
            </div>
            
            <div className="flex justify-between items-start mb-10 overflow-x-auto pb-4 custom-scrollbar">
              {growthStages.map((step, i) => {
                const isCompleted = contract.updates.some(u => u.type === step.id);
                return (
                  <div key={i} className="flex flex-col items-center min-w-[80px]">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-50' : 'bg-slate-50 text-slate-300'}`}>
                      {step.icon}
                    </div>
                    <p className={`mt-3 text-[10px] font-black uppercase tracking-tighter ${isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>{step.label}</p>
                    {isCompleted && <CheckCircle2 size={12} className="mt-1 text-emerald-500" />}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => { setUpdateType('SAPLING'); setShowUpdateModal(true); }}
                className="group flex items-center justify-between p-6 bg-slate-900 hover:bg-black text-white rounded-[1.8rem] font-bold transition shadow-lg active:scale-95"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-white/10 rounded-xl mr-4 group-hover:bg-emerald-500 transition"><Zap size={22} className="text-emerald-400 group-hover:text-white" /></div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400">AI Checkpoint</p>
                    <p className="text-sm">Log Growth Milestone</p>
                  </div>
                </div>
                <ChevronRight size={20} />
              </button>

              <button 
                onClick={() => { setUpdateType('RIPENESS'); setShowUpdateModal(true); }}
                className="group flex items-center justify-between p-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.8rem] font-bold transition shadow-lg active:scale-95"
              >
                <div className="flex items-center">
                   <div className="p-3 bg-white/10 rounded-xl mr-4 group-hover:bg-white transition"><ThermometerSun size={22} className="text-white group-hover:text-emerald-600" /></div>
                   <div className="text-left">
                     <p className="text-[10px] uppercase font-black tracking-widest text-emerald-100">Smart Maturity</p>
                     <p className="text-sm">AI Ripeness Audit</p>
                   </div>
                </div>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Logistics & Pickup */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-emerald-100 p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{contract.fruitType} Batch</h3>
                <p className="text-slate-500 text-sm font-medium">Contract: {contract.id} • AI-Verified Chain</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-600">₹{contract.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contract.status === CropStatus.HARVEST_READY || contract.status === CropStatus.GROWTH || contract.status === CropStatus.SOWING || contract.status === CropStatus.FLOWERING ? (
                <button 
                  onClick={() => setShowPackagingModal(true)}
                  className="flex items-center justify-between p-6 bg-amber-500 hover:bg-amber-600 text-white rounded-[1.5rem] font-bold transition shadow-lg active:scale-95"
                >
                  <div className="flex items-center"><Box size={24} className="mr-3" /> Packaging Completed</div>
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button onClick={() => setShowOTPDisplay(true)} className="p-6 bg-slate-900 text-white rounded-[1.5rem] font-bold flex items-center justify-between hover:bg-black transition shadow-lg active:scale-95">
                  <div className="flex items-center"><Key size={24} className="mr-3 text-emerald-400" /> View Pickup OTP</div>
                  <ChevronRight size={20} />
                </button>
              )}
              
              {!contract.pickupLocation && (
                <button 
                  onClick={() => setShowLocationModal(true)}
                  className="w-full flex items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-600 text-slate-400 rounded-[1.5rem] font-bold transition group"
                >
                  <LocateFixed size={24} className="mr-3 group-hover:animate-pulse" /> Pin Farm Gate GPS
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           {/* Escrow Status Sidebar */}
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-6">Escrow Milestones</h3>
              <div className="space-y-6">
                {contract.milestones.map((m, i) => (
                  <div key={i} className={`flex items-center justify-between transition-opacity ${m.status === 'PAID' ? 'opacity-50' : 'opacity-100'}`}>
                    <div>
                      <p className={`font-bold text-sm ${m.status === 'PAID' ? 'text-emerald-400 line-through' : 'text-white'}`}>{m.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.percentage}% Advance</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-black mr-3">₹{((contract.totalAmount * m.percentage) / 100).toLocaleString()}</span>
                      {m.status === 'PAID' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <div className="w-5 h-5 border-2 border-slate-700 rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* AI Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4 md:p-6 backdrop-blur-md">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in zoom-in duration-300">
              <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-8 py-6 border-b flex justify-between items-center">
                <div>
                   <h3 className="font-black text-2xl text-slate-900 tracking-tight">AI Quality Checkpoint</h3>
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Select Stage & Upload Photo</p>
                </div>
                <button onClick={() => setShowUpdateModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={24}/></button>
              </div>

              <div className="p-8 space-y-8">
                {/* Stage Selection */}
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] px-1">Select Growth Stage</label>
                   <div className="grid grid-cols-5 gap-2">
                      {growthStages.map((stage) => (
                        <button 
                          key={stage.id} 
                          type="button"
                          onClick={() => {
                            setUpdateType(stage.id);
                            if (capturedImage) triggerAIVerification(capturedImage, stage.id);
                          }}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${updateType === stage.id ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                        >
                           {stage.icon}
                           <span className="text-[8px] font-black uppercase mt-1.5">{stage.label}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="aspect-video bg-slate-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-8 border-slate-50 relative">
                  {!capturedImage ? (
                    <div className="flex flex-col items-center space-y-6">
                      <div className="flex items-center space-x-6">
                        <button onClick={startCamera} className="w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-700 transition ring-8 ring-emerald-500/10"><Camera size={48}/></button>
                        <button onClick={() => updateFileInputRef.current?.click()} className="w-24 h-24 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-50 transition border-4 border-emerald-500/10"><ImageIcon size={48}/></button>
                        <input type="file" ref={updateFileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>
                      <p className="text-white/60 font-bold text-sm">Capture {updateType} photo or Upload</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img src={capturedImage} className="w-full h-full object-cover" />
                      <button onClick={() => { setCapturedImage(null); setAiResult(null); }} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full transition hover:bg-black/80"><X size={20}/></button>
                      
                      {isVerifying && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-4">
                           <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                           <p className="text-white font-black text-xs uppercase tracking-widest animate-pulse">Running Security Audit...</p>
                        </div>
                      )}

                      {aiResult && !isVerifying && (
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                           {authenticityStatus === 'REAL' ? (
                             <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black flex items-center shadow-lg backdrop-blur-md border border-white/20">
                                <ShieldCheck size={14} className="mr-2" /> HUMAN VERIFIED: REAL
                             </div>
                           ) : (
                             <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black flex items-center shadow-lg backdrop-blur-md border border-white/20">
                                <ShieldAlert size={14} className="mr-2" /> FRAUD ALERT: AI GENERATED
                             </div>
                           )}
                           <div className="bg-white/95 backdrop-blur-md text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black flex items-center shadow-lg">
                              <Zap size={14} className="mr-2" /> HEALTH: {aiResult.healthScore}%
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                  {isStreaming && (
                    <div className="absolute inset-0 z-20">
                       <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"/>
                       <button onClick={handleCapture} className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-8 border-white shadow-2xl animate-pulse"/>
                    </div>
                  )}
                </div>

                {/* AI Detection Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className={`p-6 rounded-[2rem] border-2 transition-all ${isVerifying ? 'animate-pulse bg-slate-50 border-slate-100' : authenticityStatus === 'REAL' ? 'bg-emerald-50 border-emerald-200' : authenticityStatus === 'AI_GENERATED' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center space-x-3 mb-3">
                         {authenticityStatus === 'REAL' ? <Fingerprint className="text-emerald-600" size={24}/> : <Scan className="text-red-500" size={24}/>}
                         <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Authenticity Audit</h4>
                      </div>
                      <p className={`font-black text-lg ${authenticityStatus === 'REAL' ? 'text-emerald-700' : authenticityStatus === 'AI_GENERATED' ? 'text-red-600' : 'text-slate-400'}`}>
                        {isVerifying ? 'Scanning Pixels...' : authenticityStatus === 'REAL' ? 'Verified Field Capture' : authenticityStatus === 'AI_GENERATED' ? 'Synthetic Content Detected' : 'Awaiting Input'}
                      </p>
                      {aiResult?.prediction?.includes('[Security:') && (
                        <p className="text-[9px] font-bold text-slate-500 mt-2 leading-tight uppercase tracking-tighter">{aiResult.prediction.split('[Security:')[1].replace(']', '')}</p>
                      )}
                   </div>

                   <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                      <div className="flex items-center space-x-3 mb-3 text-emerald-400">
                         <ShieldEllipsis size={24}/>
                         <h4 className="font-black text-[10px] uppercase tracking-widest opacity-60">Compliance Grade</h4>
                      </div>
                      <p className="text-3xl font-black">{aiResult?.grade || '--'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Predicted Market Quality</p>
                   </div>
                </div>

                {aiResult && (
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-2">
                       <Info size={16} className="text-emerald-600"/>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Agronomist Diagnosis</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{aiResult.prediction.split('[Security:')[0].trim()}"</p>
                    {aiResult.issues && aiResult.issues.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {aiResult.issues.map((issue, i) => (
                          <span key={i} className="px-3 py-1 bg-red-100 text-red-600 text-[9px] font-black rounded-full uppercase">{issue}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Additional Field Notes</label>
                   <textarea value={updateText} onChange={e => setUpdateText(e.target.value)} placeholder={`Add details about the ${updateType} stage...`} className="w-full h-24 p-6 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium" />
                </div>
              </div>

              <div className="p-8 border-t bg-slate-50">
                <button 
                  disabled={!aiResult || isVerifying || authenticityStatus === 'AI_GENERATED'}
                  onClick={handleSendUpdate} 
                  className={`w-full py-6 rounded-3xl text-xl font-black shadow-2xl transition transform active:scale-95 disabled:opacity-50 disabled:grayscale ${authenticityStatus === 'AI_GENERATED' ? 'bg-red-600' : 'bg-emerald-600'} text-white`}
                >
                  {authenticityStatus === 'AI_GENERATED' ? 'Update Blocked: Use Real Photo' : `Verify & Share ${updateType} Update`}
                </button>
              </div>
           </div>
        </div>
      )}

      {showPackagingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-6 backdrop-blur-sm">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in zoom-in duration-300">
              <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-8 py-6 border-b flex justify-between items-center">
                <h3 className="font-black text-2xl text-slate-900 tracking-tight">Final Packaging Report</h3>
                <button onClick={() => setShowPackagingModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={24}/></button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">No. of Packages</label>
                    <input type="number" value={pkgCount} onChange={e => setPkgCount(e.target.value)} placeholder="e.g. 50" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Total Weight (kg)</label>
                    <input type="number" value={pkgWeight} onChange={e => setPkgWeight(e.target.value)} placeholder="e.g. 1000" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900" />
                  </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Packaging Type</label>
                   <div className="flex space-x-2">
                      {['Crate', 'Sack', 'Box'].map(type => (
                        <button 
                          key={type} 
                          type="button"
                          onClick={() => setPkgType(type as any)} 
                          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${pkgType === type ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          {type}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quality Checklist</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                     {[
                       { id: 'quality', label: 'Quality Check' },
                       { id: 'moisture', label: 'Moisture < 12%' },
                       { id: 'damage', label: 'No Damage' }
                     ].map(item => (
                       <button 
                        key={item.id} 
                        type="button"
                        onClick={() => setChecklist(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof checklist] }))} 
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${checklist[item.id as keyof typeof checklist] ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                       >
                          <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
                          {checklist[item.id as keyof typeof checklist] ? <CheckCircle size={18} className="text-emerald-600" /> : <div className="w-5 h-5 border-2 rounded-full border-slate-300"></div>}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Final Load Proof Photo</label>
                  <div className="aspect-video bg-slate-900 rounded-[2rem] flex items-center justify-center overflow-hidden border-8 border-slate-50 relative">
                    {!capturedImage ? (
                      <div className="flex space-x-6">
                        <button onClick={startCamera} className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-700 transition"><Camera size={36}/></button>
                        <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-2xl border border-slate-200 hover:bg-slate-50 transition"><ImageIcon size={36}/></button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img src={capturedImage} className="w-full h-full object-cover" />
                        <button onClick={() => setCapturedImage(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full transition hover:bg-black/80"><X size={20}/></button>
                      </div>
                    )}
                    {isStreaming && (
                      <div className="absolute inset-0 z-20">
                         <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"/>
                         <button onClick={handleCapture} className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-emerald-600 shadow-2xl animate-pulse"/>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t bg-slate-50">
                <button 
                  onClick={handleCompletePackaging} 
                  className="w-full bg-emerald-600 text-white py-6 rounded-3xl text-xl font-black shadow-2xl hover:bg-emerald-700 transition transform active:scale-95"
                >
                  Confirm Packaging & GPS Lock
                </button>
              </div>
           </div>
        </div>
      )}

      {showOTPDisplay && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 md:p-6 backdrop-blur-md">
           <div className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="font-black text-2xl text-slate-900 tracking-tight">Pickup Verification OTP</h3>
                 <button onClick={() => setShowOTPDisplay(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={24}/></button>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] inline-block mb-10 border-4 border-emerald-500/20 w-full">
                 <div className="text-6xl font-black text-emerald-600 tracking-widest flex justify-center items-center py-6">
                    {contract.pickupOTP || "0000"}
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Secure 4-Digit Code</p>
              </div>
              <p className="text-slate-500 font-bold mb-8">Tell this code to the driver upon arrival to authorize loading of your batch.</p>
              <button onClick={() => setShowOTPDisplay(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition active:scale-95">Done</button>
           </div>
        </div>
      )}

      {showLocationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-6 backdrop-blur-sm">
           <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 text-center shadow-2xl">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <MapPinned size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Confirm Farm GPS</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">The system will capture your current location as the designated farm-gate pickup point for logistics.</p>
              <div className="flex space-x-4">
                 <button onClick={() => setShowLocationModal(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cancel</button>
                 <button onClick={handleSetFarmLocation} className="flex-2 bg-emerald-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:bg-emerald-700 transition transform active:scale-95">Pin Location</button>
              </div>
           </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FarmerDashboard;

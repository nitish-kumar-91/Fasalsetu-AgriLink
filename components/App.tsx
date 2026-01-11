
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { UserRole, UserStatus, User, Language, Contract, Demand } from './types';
import { MOCK_CONTRACTS, MOCK_DEMANDS, MOCK_USERS } from './constants';
import LandingPage from './components/LandingPage';
import FarmerDashboard from './components/FarmerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import TransporterModule from './components/TransporterModule';
import AdminPanel from './components/AdminPanel';
import WhatsAppSim from './components/WhatsAppSim';
import { Menu, X, Globe, User as UserIcon, Bell, LogOut, Mail, Phone, Lock, ChevronRight, CheckCircle, ArrowLeft, Camera, Upload, MapPin, Building, Truck, Wheat, ShieldCheck, Zap, Image as ImageIcon, ExternalLink, Key } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [demands, setDemands] = useState<Demand[]>(MOCK_DEMANDS);

  const toggleLang = () => setLang(l => l === 'en' ? 'hi' : 'en');

  const handleLogout = () => {
    setUser(null);
    window.location.hash = '/';
  };

  const updateContract = (updatedContract: Contract) => {
    setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
  };

  const handleUserUpdate = (updatedUser: User) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) setUser(updatedUser);
  };

  const handleRegister = (newUser: User) => {
    setAllUsers(prev => [...prev, newUser]);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-[100] px-4 py-3 sm:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <span className="text-white font-bold text-xl">FS</span>
              </div>
              <div>
                <h1 className="text-emerald-800 font-bold text-lg leading-tight">AgriLink India</h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">FasalSetu (फ़सल सेतु)</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <button onClick={toggleLang} className="flex items-center space-x-1 text-slate-600 hover:text-emerald-600 transition font-bold text-sm">
                <Globe size={16} />
                <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition"><Bell size={20} /></button>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-[9px] uppercase tracking-widest font-black text-emerald-600">{user.role}</p>
                    </div>
                    <button onClick={handleLogout} className="p-2.5 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition">
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-slate-600 font-bold hover:text-emerald-600 transition text-sm px-4">Login</Link>
                  <Link to="/register" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/20 text-sm">Register</Link>
                </div>
              )}
            </div>

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage lang={lang} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} users={allUsers} />} />
            <Route path="/register" element={<RegistrationPage onRegister={handleRegister} />} />
            <Route path="/dashboard" element={
              <DashboardRouter 
                user={user} 
                lang={lang} 
                contracts={contracts} 
                updateContract={updateContract} 
                allUsers={allUsers}
                setAllUsers={setAllUsers}
              />
            } />
          </Routes>
        </main>

        <WhatsAppSim user={user} contract={contracts[0]} />

        <footer className="bg-slate-900 text-slate-400 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-2 grayscale opacity-50">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="text-sm font-bold text-white tracking-tight">FasalSetu Platform</span>
            </div>
            <div className="text-xs font-medium uppercase tracking-widest text-slate-600">
              © 2024 Digital India Agri-Tech Hub. Secure Escrow Enabled.
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

const LoginPage: React.FC<{ setUser: (u: User) => void; users: User[] }> = ({ setUser, users }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const performLogin = (id: string, r: UserRole) => {
    const foundUser = users.find(u => 
      (u.phone === id || u.email === id || u.id === id) && 
      u.role === r
    );

    if (!foundUser) {
      alert('Invalid credentials or role. Please try again.');
      setLoading(false);
      return;
    }

    if (foundUser.status === UserStatus.PENDING) {
      alert('Your account is awaiting Admin approval. You will receive a WhatsApp notification once approved.');
      setLoading(false);
      return;
    }

    if (foundUser.status === UserStatus.DEACTIVATED || foundUser.status === UserStatus.REJECTED) {
      alert(`Account status: ${foundUser.status}. Please contact support.`);
      setLoading(false);
      return;
    }

    setUser(foundUser);
    setLoading(false);
    navigate('/dashboard');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => performLogin(identifier, role), 1000);
  };

  const handleDemoLogin = (r: UserRole, id: string) => {
    setLoading(true);
    setRole(r);
    setIdentifier(id);
    setPassword('demo123');
    setTimeout(() => performLogin(id, r), 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-400 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-400 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 font-bold text-sm mt-2">Login to your FasalSetu account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-2">
            {[UserRole.FARMER, UserRole.BUYER, UserRole.TRANSPORTER, UserRole.ADMIN].map((r) => (
              <button 
                key={r} 
                type="button"
                onClick={() => setRole(r)} 
                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${role === r ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block px-1 group-focus-within:text-emerald-600 transition">User ID / Mobile / Email</label>
              <div className="relative">
                <input 
                  required
                  type="text" 
                  placeholder="Enter details..." 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition font-bold text-slate-900"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                <UserIcon className="absolute right-4 top-4 text-slate-300" size={20} />
              </div>
            </div>

            <div className="relative group">
              <div className="flex justify-between items-center mb-1.5 px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-600 transition">Password</label>
                <button type="button" className="text-[9px] font-black text-emerald-600 uppercase hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <input 
                  required
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition font-bold text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute right-4 top-4 text-slate-300" size={20} />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Secure Login</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-4 flex items-center justify-center">
              <Zap size={10} className="mr-1 text-amber-500" /> Hackathon Demo Access <Zap size={10} className="ml-1 text-amber-500" />
           </p>
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDemoLogin(UserRole.ADMIN, 'admin1')}
                className="flex items-center justify-center space-x-2 p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition group"
              >
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-emerald-700">Demo Admin</span>
              </button>
              <button 
                onClick={() => handleDemoLogin(UserRole.FARMER, 'f1')}
                className="flex items-center justify-center space-x-2 p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition group"
              >
                <Wheat size={16} className="text-emerald-600" />
                <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-emerald-700">Demo Farmer</span>
              </button>
              <button 
                onClick={() => handleDemoLogin(UserRole.BUYER, 'b2')}
                className="flex items-center justify-center space-x-2 p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition group"
              >
                <Building size={16} className="text-emerald-600" />
                <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-emerald-700">Demo Buyer</span>
              </button>
              <button 
                onClick={() => handleDemoLogin(UserRole.TRANSPORTER, 't1')}
                className="flex items-center justify-center space-x-2 p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition group"
              >
                <Truck size={16} className="text-emerald-600" />
                <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-emerald-700">Demo Transporter</span>
              </button>
           </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-bold">New to platform?</p>
          <Link to="/register" className="text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline mt-1 block">Register as {role.toLowerCase()}</Link>
        </div>
      </div>
    </div>
  );
};

const RegistrationPage: React.FC<{ onRegister: (u: User) => void }> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    phone: '',
    email: '',
    location: '',
    password: '',
    status: UserStatus.PENDING,
    kycStatus: 'PENDING',
    registrationDate: new Date().toISOString().split('T')[0],
    metadata: {},
    documents: { idProofUrl: '', selfieUrl: '', profilePhotoUrl: '' }
  });

  const selfieInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'selfie' | 'idProof') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents!,
            [type === 'selfie' ? 'selfieUrl' : 'idProofUrl']: dataUrl,
            [type === 'selfie' ? 'profilePhotoUrl' : '']: type === 'selfie' ? dataUrl : prev.documents!.profilePhotoUrl
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      role: role,
    } as User;
    
    onRegister(newUser);
    alert('Registration Successful! Your application is now in the "Pending" state for Admin review. We will notify you via WhatsApp.');
    navigate('/login');
  };

  const updateMetadata = (key: string, val: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: val }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => step === 1 ? navigate('/login') : prevStep()} className="p-2 text-slate-400 hover:text-slate-600 transition flex items-center space-x-2 font-bold text-sm">
            <ArrowLeft size={20} />
            <span>{step === 1 ? 'Back to Login' : 'Previous Step'}</span>
          </button>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= s ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step} of 4</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select your Account Type</h3>
                  <p className="text-slate-500 font-bold text-sm">You can change this before completing step 4</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { r: UserRole.FARMER, icon: <Wheat size={24}/>, label: 'Farmer', desc: 'Grow & Sell Crops' },
                    { r: UserRole.BUYER, icon: <Building size={24}/>, label: 'Buyer', desc: 'Procure produce' },
                    { r: UserRole.TRANSPORTER, icon: <Truck size={24}/>, label: 'Transporter', desc: 'Logistics Partner' }
                  ].map(item => (
                    <button 
                      key={item.r} 
                      type="button"
                      onClick={() => setRole(item.r)}
                      className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col items-center justify-center space-y-3 ${role === item.r ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-600/10' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-emerald-200'}`}
                    >
                      <div className={`p-4 rounded-2xl ${role === item.r ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400'}`}>{item.icon}</div>
                      <div className="text-center">
                        <p className="font-black text-sm uppercase tracking-widest">{item.label}</p>
                        <p className="text-[10px] font-bold opacity-60 mt-1">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={nextStep} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 transition-all transform active:scale-[0.98]">Continue with Profile Details</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal Information</h3>
                  <p className="text-slate-500 font-bold text-sm">Valid contact details are required for approval</p>
                </div>
                <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="E.g. Rajesh Kumar" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile Number</label>
                        <input required type="tel" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="+91 00000 00000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                      <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="name@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Set Password</label>
                      <input required type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Location / Address</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="E.g. Nashik, MH" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                   </div>
                </div>
                <button type="button" onClick={nextStep} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 transition-all transform active:scale-[0.98]">Next: Documents Upload</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identity Verification</h3>
                  <p className="text-slate-500 font-bold text-sm">Upload original documents for KYC verification</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => selfieInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-3xl bg-slate-50 flex flex-col items-center justify-center space-y-3 group cursor-pointer hover:border-emerald-500 transition overflow-hidden relative ${formData.documents?.selfieUrl ? 'border-emerald-500' : 'border-slate-300'}`}
                  >
                    {formData.documents?.selfieUrl ? (
                      <img src={formData.documents.selfieUrl} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition"><Upload size={24}/></div>
                        <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-900">Upload Selfie</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">Holding ID Proof</p>
                        </div>
                      </>
                    )}
                    <input type="file" className="hidden" ref={selfieInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'selfie')} />
                  </div>
                  <div 
                    onClick={() => idProofInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-3xl bg-slate-50 flex flex-col items-center justify-center space-y-3 group cursor-pointer hover:border-emerald-500 transition overflow-hidden relative ${formData.documents?.idProofUrl ? 'border-emerald-500' : 'border-slate-300'}`}
                  >
                    {formData.documents?.idProofUrl ? (
                      <img src={formData.documents.idProofUrl} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition"><Upload size={24}/></div>
                        <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-900">Upload ID Proof</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">Front and Back (Aadhaar)</p>
                        </div>
                      </>
                    )}
                    <input type="file" className="hidden" ref={idProofInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'idProof')} />
                  </div>
                </div>
                <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start space-x-4">
                  <CheckCircle size={20} className="text-amber-600 mt-1" />
                  <p className="text-[11px] font-bold text-amber-800 leading-relaxed">Safety Note: Your documents are encrypted and only accessible by authorized FasalSetu KYC admins for verification purposes.</p>
                </div>
                <button type="button" onClick={nextStep} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 transition-all transform active:scale-[0.98]">Last Step: Specific Details</button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{role} Details</h3>
                  <p className="text-slate-500 font-bold text-sm">Help us understand your setup better</p>
                </div>
                
                {role === UserRole.FARMER && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Land Size (Acres)</label>
                      <input type="number" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="E.g. 5" onChange={e => updateMetadata('landSize', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Crops Grown (Comma separated)</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="Mango, Rice, Wheat..." onChange={e => updateMetadata('crops', e.target.value.split(','))} />
                    </div>
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-3 text-emerald-700">
                       <MapPin size={20} />
                       <span className="text-xs font-black uppercase tracking-widest">Pin Farm GPS on Next Login</span>
                    </div>
                  </div>
                )}

                {role === UserRole.BUYER && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Registered Name</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="E.g. FreshAgri Exports" onChange={e => updateMetadata('businessName', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GST Number (Optional)</label>
                      <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="12ABCDE1234F1Z5" onChange={e => updateMetadata('gst', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Buyer Type</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" onChange={e => updateMetadata('buyerType', e.target.value)}>
                        <option>Wholesaler</option>
                        <option>Retailer</option>
                        <option>Exporter</option>
                      </select>
                    </div>
                  </div>
                )}

                {role === UserRole.TRANSPORTER && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vehicle Type</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="E.g. 10 Wheeler Truck" onChange={e => updateMetadata('vehicleType', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registration No. (RC)</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="MH 12 AB 1234" onChange={e => updateMetadata('regNumber', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Service Radius (km)</label>
                      <input type="number" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition font-bold" placeholder="E.g. 200" onChange={e => updateMetadata('radius', e.target.value)} />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-2">
                    <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg text-emerald-600 border-slate-200 focus:ring-emerald-500" />
                    <p className="text-[11px] font-bold text-slate-500">I agree to FasalSetu Terms of Service and authorize the platform to verify my identity using the provided documents.</p>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 transition-all transform active:scale-[0.98]">Submit Registration for Review</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const DashboardRouter: React.FC<{ 
  user: User | null; 
  lang: 'en' | 'hi'; 
  contracts: Contract[]; 
  updateContract: (c: Contract) => void;
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
}> = ({ user, lang, contracts, updateContract, allUsers, setAllUsers }) => {
  const navigate = useNavigate();
  useEffect(() => { if (!user) navigate('/login'); }, [user]);
  if (!user) return null;

  const contract = contracts.find(c => c.farmerId === user.id || c.buyerId === user.id) || contracts[0];

  switch (user.role) {
    case UserRole.FARMER: return <FarmerDashboard user={user} lang={lang} contract={contract} updateContract={updateContract} />;
    case UserRole.BUYER: return <BuyerDashboard user={user} lang={lang} contracts={contracts} updateContract={updateContract} />;
    case UserRole.TRANSPORTER: return <TransporterModule user={user} contracts={contracts} updateContract={updateContract} />;
    case UserRole.ADMIN: return <AdminPanel allUsers={allUsers} setAllUsers={setAllUsers} />;
    default: return <div>Role not recognized</div>;
  }
};

export default App;

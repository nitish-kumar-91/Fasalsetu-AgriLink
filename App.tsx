
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
      alert('Your account is awaiting Admin approval.');
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
    setTimeout(() => performLogin(id, r), 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-10">
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
                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${role === r ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input required type="text" placeholder="User ID / Mobile" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:border-emerald-500 outline-none font-bold" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            <input required type="password" placeholder="Password" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:border-emerald-500 outline-none font-bold" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center space-x-2">
            {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Secure Login</span>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-3">
          <button onClick={() => handleDemoLogin(UserRole.ADMIN, 'admin1')} className="p-3 bg-slate-50 hover:bg-emerald-50 border rounded-xl text-[10px] font-black uppercase text-slate-600">Demo Admin</button>
          <button onClick={() => handleDemoLogin(UserRole.FARMER, 'f1')} className="p-3 bg-slate-50 hover:bg-emerald-50 border rounded-xl text-[10px] font-black uppercase text-slate-600">Demo Farmer</button>
          <button onClick={() => handleDemoLogin(UserRole.BUYER, 'b2')} className="p-3 bg-slate-50 hover:bg-emerald-50 border rounded-xl text-[10px] font-black uppercase text-slate-600">Demo Buyer</button>
          <button onClick={() => handleDemoLogin(UserRole.TRANSPORTER, 't1')} className="p-3 bg-slate-50 hover:bg-emerald-50 border rounded-xl text-[10px] font-black uppercase text-slate-600">Demo Transporter</button>
        </div>
      </div>
    </div>
  );
};

const RegistrationPage: React.FC<{ onRegister: (u: User) => void }> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
  const [formData, setFormData] = useState<Partial<User>>({ name: '', phone: '', email: '', location: '', password: '', status: UserStatus.PENDING, kycStatus: 'PENDING', registrationDate: new Date().toISOString().split('T')[0] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ ...formData, id: Math.random().toString(36).substr(2, 9), role: role } as User);
    alert('Registration Successful! Pending Admin review.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Join FasalSetu</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none font-bold" value={role} onChange={e => setRole(e.target.value as UserRole)}>
            <option value={UserRole.FARMER}>Farmer</option>
            <option value={UserRole.BUYER}>Buyer</option>
            <option value={UserRole.TRANSPORTER}>Transporter</option>
          </select>
          <input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none font-bold" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input required type="tel" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none font-bold" placeholder="Mobile Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input required className="w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none font-bold" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl">Register Now</button>
        </form>
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

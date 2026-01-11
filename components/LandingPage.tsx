import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Wheat, 
  Users, 
  Globe, 
  Mic, 
  WifiOff, 
  ShieldAlert, 
  Zap, 
  BarChart3, 
  Package, 
  MapPin, 
  Search, 
  CheckCircle2, 
  PlayCircle,
  AlertTriangle,
  Layers,
  Heart,
  Smartphone,
  ChevronRight,
  QrCode,
  IndianRupee,
  Navigation,
  Sparkles
} from 'lucide-react';

const LandingPage: React.FC<{ lang: 'en' | 'hi' }> = ({ lang }) => {
  const isHi = lang === 'hi';

  const supplyChainSteps = [
    {
      title: isHi ? "मांग निर्माण" : "Demand Creation",
      desc: isHi ? "खरीदार विशिष्ट फसल, ग्रेड और मात्रा पोस्ट करते हैं।" : "Buyers post requirements with volume, grade, and target price.",
      icon: <Search size={28} />,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: isHi ? "एस्क्रो फंडिंग" : "Advance Escrow",
      desc: isHi ? "खरीदार 100% जमा करता है; किसान को 30% अग्रिम मिलता है।" : "Buyer funds escrow; matched Farmer receives 30% advance immediately.",
      icon: <Handshake size={28} />,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: isHi ? "AI निगरानी" : "AI Monitoring",
      desc: isHi ? "AI फसल के स्वास्थ्य और प्रामाणिकता की निगरानी करता है।" : "Farmer logs updates; AI audits crop health and image authenticity.",
      icon: <Sparkles size={28} />,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: isHi ? "तटस्थ पिकअप" : "Neutral Verification",
      desc: isHi ? "ट्रांसपोर्टर खेत पर गुणवत्ता और मात्रा की जांच करता है।" : "Transporter conducts mandatory photo/video audit at farm gate.",
      icon: <Truck size={28} />,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: isHi ? "सुरक्षित ट्रांजिट" : "Secure Transit",
      desc: isHi ? "रियल-टाइम GPS ट्रैकिंग और व्हाट्सएप अपडेट।" : "GPS-locked delivery journey with automated updates for all nodes.",
      icon: <Navigation size={28} />,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: isHi ? "अंतिम निपटान" : "Final Settlement",
      desc: isHi ? "पुष्टि पर शेष 70% भुगतान जारी किया जाता है।" : "Buyer confirms quality; remaining 70% released from escrow.",
      icon: <IndianRupee size={28} />,
      color: "bg-emerald-100 text-emerald-800"
    }
  ];

  return (
    <div className="overflow-x-hidden bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100 rounded-full blur-[120px] opacity-60 -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] opacity-40 -ml-24 -mb-24"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
          <div className="space-y-8 animate-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center space-x-2 bg-emerald-100/80 backdrop-blur-md border border-emerald-200 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-800">
                {isHi ? "22+ भारतीय भाषाओं में उपलब्ध" : "Bharat-First Architecture • 22+ Languages"}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              {isHi ? "ग्रामीण भारत को समझने वाली तकनीक" : "Technology That Understands Rural India"}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {isHi 
                ? "केवल वही उगाएं जिसकी मांग है। सुरक्षित भुगतान पाएं। सीधे डिलीवरी करें।" 
                : "Grow only what is demanded. Get paid securely. Deliver directly."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4">
              {[
                { icon: <Mic size={20}/>, label: isHi ? "वॉयस कंट्रोल" : "Voice AI" },
                { icon: <WifiOff size={20}/>, label: isHi ? "ऑफलाइन मोड" : "Offline" },
                { icon: <ShieldCheck size={20}/>, label: isHi ? "स्मार्ट एस्क्रो" : "Escrow" },
                { icon: <Zap size={20}/>, label: isHi ? "AI ऑडिट" : "AI Audit" }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-emerald-600">{f.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-lg hover:bg-emerald-700 transition shadow-2xl shadow-emerald-600/30 transform active:scale-95 flex items-center justify-center">
                {isHi ? "रजिस्टर करें" : "Join Platform"}
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition shadow-lg transform active:scale-95 flex items-center justify-center">
                <PlayCircle size={20} className="mr-2 text-emerald-600" />
                {isHi ? "डेमो देखें" : "Watch Demo"}
              </button>
            </div>
          </div>

          <div className="relative animate-in zoom-in duration-1000">
            <div className="bg-emerald-600 rounded-[3rem] p-3 shadow-2xl transform rotate-3">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" 
                className="rounded-[2.5rem] w-full aspect-[4/5] object-cover" 
                alt="Open greenery field representing FasalSetu"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 max-w-[240px] hidden md:block">
                <div className="flex items-center space-x-3 mb-3">
                   <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><ShieldCheck size={20}/></div>
                   <div className="text-left leading-tight">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Payment Secured</p>
                      <p className="font-black text-slate-900">₹1,24,000.00</p>
                   </div>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[100%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SUPPLY CHAIN LIFECYCLE SECTION */}
      <section className="py-24 px-6 bg-white border-y">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">The Seed-to-Settle Journey</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How the Supply Chain Works</h2>
            <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto">A transparent, direct-link lifecycle connecting the soil to the shelf.</p>
          </div>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-[64px] left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
              {supplyChainSteps.map((step, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg border border-white relative`}>
                    <div className="absolute -top-3 -right-3 w-7 h-7 bg-slate-900 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      0{i + 1}
                    </div>
                    {step.icon}
                  </div>
                  <div className="space-y-2 px-2">
                    <h4 className="font-black text-slate-900 text-lg">{step.title}</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="text-red-400 font-black uppercase tracking-widest text-xs">The Challenge</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {isHi ? "खेती को जुआ नहीं होना चाहिए।" : "Agriculture should not be a gamble."}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: isHi ? "अंधाधुंध खेती" : "Blind Cultivation", desc: isHi ? "किसान बिना ग्राहक के उगाते हैं।" : "Farmers grow without buyers." },
                { title: isHi ? "बिचौलिए" : "Middlemen", desc: isHi ? "मुनाफा बिचौलिए ले जाते हैं।" : "Middlemen take the profits." },
                { title: isHi ? "बर्बादी" : "Crop Wastage", desc: isHi ? "ग्राहक न मिलने पर फसल सड़ती है।" : "Crops rot without markets." },
                { title: isHi ? "अविश्वास" : "Low Trust", desc: isHi ? "भुगतान और गुणवत्ता में पारदर्शिता नहीं।" : "No transparency in payments." }
              ].map((p, i) => (
                <div key={i} className="flex space-x-4 group">
                  <div className="mt-1"><AlertTriangle size={20} className="text-red-400 group-hover:scale-110 transition-transform"/></div>
                  <div>
                    <h4 className="font-bold text-lg">{p.title}</h4>
                    <p className="text-slate-400 text-sm">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative p-10 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl">
             <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 pointer-events-none">01</div>
             <p className="text-2xl font-black text-emerald-400 mb-4">"India loses 40% of its fresh produce before it reaches consumers."</p>
             <p className="text-slate-400 font-medium">FasalSetu fixes the supply chain by putting the buyer first.</p>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <span className="text-emerald-600 font-black uppercase tracking-widest text-xs mb-4 block">The FasalSetu Way</span>
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Simple, Direct, Transparent</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
             {[
               { icon: <Search size={40}/>, title: isHi ? "खरीददार की मांग" : "Buyer Demand First", desc: isHi ? "खरीददार अपनी मांग पोस्ट करते हैं।" : "Buyers post requirements (Qty, Price, Quality)." },
               { icon: <Handshake size={40}/>, title: isHi ? "किसान का अनुबंध" : "Farmer Contract", desc: isHi ? "किसान एडवांस भुगतान के साथ जुड़ते हैं।" : "Farmers commit and receive 30% advance via escrow." },
               { icon: <Truck size={40}/>, title: isHi ? "गारंटीड लॉजिस्टिक्स" : "Guaranteed Pickup", desc: isHi ? "खेत से सीधे पिकअप और भुगतान।" : "Farm-gate pickup with final payment release." }
             ].map((s, i) => (
               <div key={i} className="group flex flex-col items-center">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                    {s.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{s.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{s.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. AI CROP VERIFICATION */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80" 
                  className="rounded-[2.5rem] w-full" 
                  alt="AI scanning crop"
                />
                <div className="absolute top-10 right-10 flex flex-col space-y-3">
                   <div className="bg-emerald-500/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg">
                      <Zap size={14} className="mr-2" /> AI Scanned: Grade A
                   </div>
                   <div className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg">
                      <CheckCircle2 size={14} className="mr-2 text-emerald-600" /> GPS Verified
                   </div>
                </div>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
             <span className="text-emerald-600 font-black uppercase tracking-widest text-xs">Trust as a Service</span>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">AI That Watches Your Crop Grow</h2>
             <p className="text-lg text-slate-500 leading-relaxed">
               {isHi 
                 ? "बुवाई से लेकर कटाई तक AI इमेज चेक। खरीदार कटाई से पहले फसल की गुणवत्ता देख सकते हैं। बिचौलियों के बिना किसान भरोसा बनाते हैं।"
                 : "AI image checks from planting to harvest. Buyers see crop quality before it leaves the soil. Farmers build trust without physical inspection visits."}
             </p>
             <ul className="space-y-4">
                {[
                  isHi ? "फल का आकार और पकने का पता लगाना" : "Fruit size, ripeness & disease detection",
                  isHi ? "जियो-टैग और टाइम-स्टैम्प्ड इमेज" : "Geo-tagged & time-stamped visual proof",
                  isHi ? "धोखाधड़ी-रोधी सत्यापन" : "Fraud-proof growth verification"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-700 font-bold">
                     <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                     <span>{item}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </section>

      {/* 5. LOGISTICS & PAYMENT */}
      <section className="py-24 px-6 bg-emerald-900 text-white relative">
        <div className="max-w-7xl mx-auto text-center mb-20">
           <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Pack. Get Paid. Truck Arrives.</h2>
           <p className="text-emerald-100/70 text-lg max-w-2xl mx-auto font-medium">Real-time settlement for hard-working farmers.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: isHi ? "पैकेजिंग फोटो" : "Photo Packing", desc: isHi ? "किसान पैकेजिंग फोटो अपलोड करते हैं।" : "Upload proof of crates and units." },
             { title: isHi ? "एस्क्रो भुगतान" : "Final Escrow", desc: isHi ? "खरीददार की मंजूरी → भुगतान रिलीज।" : "Release 55% balance upon approval." },
             { title: isHi ? "स्मार्ट डिस्पैच" : "Smart Dispatch", desc: isHi ? "निकटतम ट्रक ऑटो-असाइन किया गया।" : "Nearest truck automatically assigned." }
           ].map((item, i) => (
             <div key={i} className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                <div className="text-emerald-400 font-black text-4xl mb-6">0{i+1}</div>
                <h4 className="text-xl font-black mb-3">{item.title}</h4>
                <p className="text-emerald-100/60 text-sm leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-8">
           {[
             { icon: <ShieldCheck size={24}/>, label: isHi ? "पिकअप से पहले भुगतान" : "Paid Before Pickup" },
             { icon: <MapPin size={24}/>, label: isHi ? "GPS सत्यापित" : "GPS Verified" },
             { icon: <QrCode size={24}/>, label: isHi ? "OTP और QR सुरक्षित" : "OTP & QR Secured" }
           ].map((b, i) => (
             <div key={i} className="flex items-center space-x-2 text-emerald-200 font-black text-[10px] uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/10">
                {b.icon}
                <span>{b.label}</span>
             </div>
           ))}
        </div>
      </section>

      {/* 6. RURAL ACCESSIBILITY LAYER */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <span className="text-emerald-600 font-black uppercase tracking-widest text-xs mb-4 block">Inclusive Design</span>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Built for Every Indian Village</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm"><Mic size={32}/></div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">भाषिनी Voice AI</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {isHi ? "हिंदी, मराठी, तमिल और 22+ भाषाओं में बोलें। किसी टाइपिंग की आवश्यकता नहीं।" : "Speak in Hindi, Marathi, Tamil & 22+ languages. No typing needed for any action."}
                </p>
             </div>
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm"><WifiOff size={32}/></div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Offline Mode</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                   {isHi ? "बिना इंटरनेट के भी काम करता है। फोटो और वॉयस ऑफलाइन कैप्चर करें।" : "Works without internet. Capture photos & voice offline; auto-syncs when network returns."}
                </p>
             </div>
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm"><Users size={32}/></div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Fasal Sahayaks</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                   {isHi ? "1,000+ जमीनी स्वयंसेवक। किसानों को रजिस्टर और डिजीटल करने में मदद।" : "1,000+ local volunteers help farmers register and digitize fields. Human + AI trust."}
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 7. ROLE CARDS */}
      <section className="py-24 px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { role: isHi ? "किसान" : "Farmer", icon: <Wheat size={32}/>, benefits: isHi ? ["गारंटीड खरीदार", "सुरक्षित भुगतान", "AI वॉयस सपोर्ट"] : ["Guaranteed buyer", "Secure payments", "AI voice support"] },
             { role: isHi ? "खरीददार" : "Buyer", icon: <ShoppingCart size={32}/>, benefits: isHi ? ["सत्यापित फसलें", "पारदर्शी सप्लाई चेन", "लाइव फार्म ट्रैकिंग"] : ["Verified crops", "Transparent supply chain", "Live farm tracking"] },
             { role: isHi ? "लॉजिस्टिक्स" : "Transporter", icon: <Truck size={32}/>, benefits: isHi ? ["खेत से पिकअप", "उचित मूल्य", "रूट और जॉब मैचिंग"] : ["Farm-gate pickups", "Fair pricing", "Route & job matching"] }
           ].map((card, i) => (
             <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl">{card.icon}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{card.role}</h3>
                <ul className="space-y-3 mb-10 w-full">
                   {card.benefits.map((b, j) => (
                     <li key={j} className="text-sm font-bold text-slate-500 flex items-center justify-center space-x-2">
                        <CheckCircle size={14} className="text-emerald-600" />
                        <span>{b}</span>
                     </li>
                   ))}
                </ul>
                <Link to="/register" className="mt-auto w-full py-4 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Join as {card.role}</Link>
             </div>
           ))}
        </div>
      </section>

      {/* 8. TRUST SECTION */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full text-slate-500 font-black text-[10px] uppercase tracking-widest">
             <ShieldCheck size={14} /> <span>Governance & Security</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">“Trust is not promised. It is engineered.”</h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Every user is admin-verified. Every payment is milestone-based. Every crop is computer-vision audited. 
            We are building the backbone of Indian Agri-Tech.
          </p>
        </div>
      </section>

      {/* 9. SOCIAL IMPACT */}
      <section className="py-24 px-6 border-y bg-slate-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
           <div className="max-w-md space-y-4">
              <h3 className="text-3xl font-black text-slate-900">Direct Impact</h3>
              <p className="text-slate-500 font-medium leading-relaxed">We don’t replace farmers with technology. We empower them with it. Join the movement to triple farm-gate income.</p>
           </div>
           <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
              {[
                { label: isHi ? "उच्च किसान आय" : "Income Growth", val: "2.5X" },
                { label: isHi ? "कम बर्बादी" : "Waste Reduction", val: "-40%" }
              ].map((s, i) => (
                <div key={i} className="text-center">
                   <p className="text-4xl md:text-6xl font-black text-emerald-600">{s.val}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[4rem] p-12 md:p-24 text-center text-white shadow-2xl shadow-emerald-600/40 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
           
           <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Join India's Demand-Driven Farming Revolution</h2>
           <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto font-medium relative z-10">Sign up in minutes. Your first demand match is waiting for you.</p>
           
           <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 relative z-10">
              <Link to="/register" className="w-full md:w-auto px-10 py-5 bg-white text-emerald-600 rounded-[2rem] font-black text-xl hover:bg-emerald-50 transition shadow-xl transform active:scale-95">
                {isHi ? "अभी शुरू करें" : "Join Today"}
              </Link>
              <button className="w-full md:w-auto px-10 py-5 bg-emerald-700 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-800 transition transform active:scale-95 flex items-center justify-center">
                <Globe size={24} className="mr-2" /> {isHi ? "हमसे संपर्क करें" : "Talk to Us"}
              </button>
           </div>
        </div>
      </section>
    </div>
  );
};

const ShoppingCart = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.1-5.38a1 1 0 0 0-1-1.21H5.14"/>
  </svg>
);

const Handshake = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m11 17 2 2 6-6"/><path d="m18 10 1-1a2 2 0 0 0 0-2.82L17.82 5a2 2 0 0 0-2.82 0L13 7"/><path d="m15 13 3 3"/><path d="m5 13 4 4"/><path d="m11 11-1-1a2 2 0 0 0-2.82 0L2.18 15a2 2 0 0 0 0 2.82L3.34 19a2 2 0 0 0 2.82 0L11 14"/><path d="m6.7 15.6 1.3-1.3"/>
  </svg>
);

export default LandingPage;
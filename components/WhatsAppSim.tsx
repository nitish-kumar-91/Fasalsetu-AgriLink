
import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Camera, User, CheckCircle, Box, Truck, ShieldCheck, Key } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  user: any;
  contract: any;
}

const WhatsAppSim: React.FC<Props> = ({ user, contract }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { text: "Welcome to FasalSetu Bot! 👋 How can I help you today?", sender: 'bot', time: '10:00' }
  ]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isBotTyping) return;
    
    const userMsg = input;
    const newMsgs = [...messages, { text: userMsg, sender: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
    setMessages(newMsgs);
    setInput('');
    setIsBotTyping(true);

    try {
      // Create new instance to ensure it uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are "FasalSetu Agri-Bot", a helpful, secure, and professional WhatsApp bot for AgriLink India. 
        Context:
        - Current User: ${user?.name || 'Guest'} (${user?.role || 'Prospect'})
        - Location: ${user?.location || 'India'}
        - Active Contract Status: ${contract?.status || 'None'}
        - Product: ${contract?.fruitType || 'General Produce'}
        
        Rules:
        - Be concise (WhatsApp style).
        - Use emojis relevant to agriculture (🚜, 🥭, 🚚, 💰).
        - If asked about OTP, explain that they are found in the web dashboard for security.
        - If asked about payments, remind them funds are held in secure Escrow.
        - User message: "${userMsg}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
      });

      const reply = response.text || "I'm having a little trouble connecting to the field. Please try again in a moment! 🌾";
      
      setMessages(prev => [...prev, { 
        text: reply, 
        sender: 'bot', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }]);
    } catch (e: any) {
      console.error("Gemini Error:", e);
      let errorMsg = "Our servers are busy tending the crops. 🚜 Try again later!";
      
      if (e.message?.includes("Requested entity was not found")) {
        errorMsg = "⚠️ System Error: Project setup required. Please re-select your API key project.";
        // Reset key selection state as per instructions for 404 errors
        if ((window as any).aistudio) (window as any).aistudio.openSelectKey();
      }
      
      setMessages(prev => [...prev, { 
        text: errorMsg, 
        sender: 'bot', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-emerald-600 transition animate-bounce border-4 border-white group"
        >
          <MessageSquare size={32} className="group-hover:scale-110 transition-transform" />
        </button>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-80 md:w-96 overflow-hidden border border-slate-100 flex flex-col h-[550px] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-[#075e54] p-5 flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                <ShieldCheck size={24} className="text-emerald-300" />
              </div>
              <div>
                <h4 className="font-black text-sm tracking-tight leading-none">FasalSetu Bot</h4>
                <div className="flex items-center text-[10px] text-emerald-200 mt-1 uppercase font-bold tracking-widest">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full mr-1.5 animate-pulse"></span>
                  AI Powered Live
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition"><X size={24} /></button>
          </div>

          <div className="flex-grow p-5 overflow-y-auto bg-[#e5ddd5] custom-scrollbar space-y-4">
             <div className="flex justify-center mb-4">
                <span className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm border border-white">AI Dispatch Audit Log</span>
             </div>
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-xs shadow-sm relative leading-relaxed transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${m.sender === 'user' ? 'bg-[#dcf8c6] rounded-tr-none text-slate-800' : 'bg-white rounded-tl-none text-slate-700'}`}>
                     <p className="font-medium">{m.text}</p>
                     <span className="text-[8px] font-bold text-slate-400 block text-right mt-2">{m.time}</span>
                  </div>
               </div>
             ))}
             {isBotTyping && (
                <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   </div>
                </div>
             )}
          </div>

          <div className="p-4 bg-[#f0f2f5] flex items-center space-x-3">
            <button className="text-slate-400 hover:text-[#128c7e] p-2 transition active:scale-90"><Camera size={22} /></button>
            <input 
              className="flex-grow bg-white border border-transparent rounded-2xl px-5 py-3 text-xs outline-none focus:ring-2 focus:ring-[#128c7e] shadow-sm font-medium"
              placeholder="Query status..."
              value={input}
              disabled={isBotTyping}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isBotTyping}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg active:scale-95 ${isBotTyping ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-[#128c7e] text-white hover:bg-[#075e54]'}`}
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSim;

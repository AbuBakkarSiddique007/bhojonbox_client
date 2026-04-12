"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, ChevronDown, Sparkles, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import Link from "next/link";

export default function BhojonConcierge() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (pathname?.includes("dashboard")) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          userContext: user ? { name: user.name, role: user.role } : null
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [...prev, json.data]);
      } else {
        setMessages((prev) => [...prev, "I apologize, but my culinary knowledge is momentarily inaccessible. Please try again."]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, "A technical disturbance has occurred. I shall return shortly."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-card/95 backdrop-blur-2xl border border-primary/20 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          {/* Header */}
          <div className="bg-primary/10 border-b border-primary/10 p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest brand text-foreground">Bhojon Concierge</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Attending Patron Requests</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-muted-foreground hover:text-primary transition-colors p-1 relative z-20"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4 opacity-60">
                <div className="text-4xl">🎩</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-relaxed italic">
                  Greetings. I am your culinary guide. How may I facilitate your experience on the BhojonBox platform today?
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {["How to post meals?", "Register as Provider?", "Order check?"].map(hint => (
                    <button
                      key={hint}
                      onClick={() => { setInput(hint); }}
                      className="bg-muted px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all border border-border"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => {
              const isUser = i % 2 === 0;
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-500`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed shadow-sm ${isUser
                      ? "bg-primary text-primary-foreground font-bold rounded-tr-none"
                      : "bg-muted border border-border italic text-muted-foreground rounded-tl-none font-medium"
                    }`}>
                    {m.split(/(https?:\/\/[^\s]+|\/[^\s]+)/g).map((part, index) => {
                      if (part.startsWith('http') || part.startsWith('/')) {
                        return (
                          <Link 
                            key={index} 
                            href={part} 
                            className="underline decoration-gold font-black hover:text-gold transition-colors inline-flex items-center gap-1"
                          >
                            {part} <ExternalLink size={10} />
                          </Link>
                        );
                      }
                      return part;
                    })}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-muted border border-border px-4 py-2 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-muted/30 border-t border-border">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Direct your inquiry here..."
                className="w-full bg-card border border-border px-5 py-4 rounded-2xl text-[11px] font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all pr-12 placeholder:italic placeholder:opacity-50"
              />
              <button
                disabled={!input.trim() || isLoading}
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[8px] text-center mt-3 text-muted-foreground font-black uppercase tracking-widest italic opacity-40">
              Powered by Bhojon AI • Groq Intelligence
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-card border border-primary/20 rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-[1.1] hover:-translate-y-1 active:scale-95 transition-all group relative p-1"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl z-10"></div>
          <img 
            src="/chatbot.jpg" 
            alt="Bhojon Concierge" 
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 border-2 border-primary rounded-full animate-pulse z-20 shadow-lg"></div>
        </button>
      )}
    </div>
  );
}

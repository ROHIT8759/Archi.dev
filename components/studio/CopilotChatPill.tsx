"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function CopilotChatPill() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your architecture copilot. How can I modify your canvas today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { activeTab, nodes, edges, graphs, applyGraphPatch } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setQuery("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          activeTab,
          currentGraph: { nodes, edges },
          allGraphs: graphs,
        }),
      });

      if (!response.ok) throw new Error("Failed to reach copilot");

      const data = await response.json();
      
      const summary = data.patch?.summary || "I've applied those changes to the canvas.";
      setMessages(prev => [...prev, { role: "assistant", content: summary }]);

      if (data.patch) {
        applyGraphPatch(data.patch);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I ran into an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {!open && (
        <motion.button
          initial={{ y: 50, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-12 left-1/2 z-[900] cyber-glass rounded-full px-5 py-3 flex items-center gap-3 shadow-[0_0_30px_rgba(138,43,226,0.15)] cursor-pointer group"
          style={{ border: "1px solid rgba(138,43,226,0.2)" }}
        >
          <Sparkles size={16} className="text-[#8A2BE2] group-hover:animate-pulse" />
          <span className="text-sm font-medium text-white/80">Ask Copilot...</span>
          <div className="flex items-center gap-1 ml-2 opacity-50">
            <span className="text-[10px] font-mono border border-white/20 rounded px-1.5 py-0.5">Ctrl</span>
            <span className="text-[10px] font-mono border border-white/20 rounded px-1.5 py-0.5">I</span>
          </div>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, x: "-50%" }}
            className="fixed bottom-12 left-1/2 z-[900] cyber-glass rounded-2xl w-[400px] shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(138,43,226,0.15)] overflow-hidden flex flex-col"
            style={{ border: "1px solid rgba(138,43,226,0.3)" }}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#8A2BE2]/20 flex items-center justify-center">
                  <Sparkles size={12} className="text-[#8A2BE2]" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-white/90">Copilot</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white/90 transition-colors p-1">
                <X size={16} />
              </button>
            </div>

            <div className="h-[300px] p-4 flex flex-col gap-3 overflow-y-auto">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`self-${msg.role === "user" ? "end" : "start"} ${
                    msg.role === "user" 
                      ? "bg-[#8A2BE2]/20 border-[#8A2BE2]/30" 
                      : "bg-white/5 border-white/10"
                  } border rounded-2xl px-4 py-2.5 max-w-[85%]`}
                  style={{
                    borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                    borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                  }}
                >
                  <p className="text-sm text-white/80 leading-relaxed">{msg.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="self-start bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2">
                  <Loader2 size={14} className="text-[#8A2BE2] animate-spin" />
                  <span className="text-sm text-white/50">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-black/40 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="E.g. add a Redis cache..."
                  className="w-full bg-transparent border-0 text-sm text-white placeholder:text-white/30 focus:ring-0 focus:outline-none pr-10"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-2 text-[#8A2BE2] hover:text-[#00F0FF] transition-colors p-1 disabled:opacity-50 disabled:hover:text-[#8A2BE2]"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fs = require('fs');
let content = 
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Code2, Database } from "lucide-react";

export function CopilotChatPill() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'How can I assist your architecture today?' }
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSend = (text) => {
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: 'I am analyzing your layout. Generating the requested structural changes now...' }]);
    }, 600);
  };

  const suggestions = [
    { label: "Add Redis Cache", icon: Database },
    { label: "Generate CRUD APIs", icon: Code2 }
  ];

  if (!open) {
    return (
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
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95, x: "-50%" }}
        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
        exit={{ opacity: 0, y: 20, scale: 0.95, x: "-50%" }}
        className="fixed bottom-12 left-1/2 z-[900] cyber-glass rounded-2xl w-[400px] shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(138,43,226,0.15)] overflow-hidden"
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

        <div className="p-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto min-h-[150px]">
          {messages.map((m, i) => (
             <div key={i} className={\lex \\}>
                <div className={\max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed \\}>
                   {m.text}
                </div>
             </div>
          ))}
        </div>

        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={i} onClick={() => handleSend(s.label)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white/90 transition-colors">
                <Icon size={12} className="text-[#8A2BE2]" />
                {s.label}
              </button>
            )
          })}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(query); }} className="p-3 border-t border-white/10">
          <div className="relative">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Add a Redis cache before the DB"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#8A2BE2]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!query}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-[#8A2BE2] disabled:opacity-50 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
\;
fs.writeFileSync('components/studio/CopilotChatPill.tsx', content);

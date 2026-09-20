"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Loader2,
  Bot,
  ShieldCheck,
  Globe,
} from "lucide-react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Props {
  context?: any;
}

export function GeminiAssistant({ context }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Greetings. I am the **Gemini 3.8 Flash Institute Assessor** with real-time web research grounding. I can search online for live competitors, audit code replacement math, or benchmark this asset against market M&A transactions. How may I assist your due diligence?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Apologies, I encountered a communication error with the valuation node." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    "Search online competitors for this app",
    "Explain the replacement cost math",
    "How was marketing equity calculated?",
    "What are the biggest technical risks?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-certificate border border-slate-700 transition-all hover:scale-105 group"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-none flex items-center gap-1">
              <span>Gemini 3.8 Flash</span>
              <Globe className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Live Web Grounding</div>
          </div>
        </button>
      )}

      {/* Slide-out Chat Panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-[380px] sm:w-[420px] h-[520px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Gemini 3.8 Flash Assessor</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-0.5">
                    <Globe className="w-2.5 h-2.5" /> Web Search
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Real-Time Competitor & Code Due Diligence
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-slate-800">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-slate-900 text-white shadow-xs rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 shadow-subtle rounded-bl-none prose prose-xs"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching web & auditing with Gemini 3.8 Flash...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium whitespace-nowrap transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about live competitors, replacement math, or risks..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

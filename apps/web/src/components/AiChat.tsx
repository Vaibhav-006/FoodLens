'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import type { Product } from '@foodlens/core';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = [
  'How much protein in 1 serving?',
  'Is this good for weight loss?',
  'Is this safe for diabetics?',
  'Which ingredients should I watch out for?',
  'Can I eat this daily or only occasionally?',
  'Yeh product Hindi mein samjhao',
];

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://foodlens-qg92.onrender.com').replace(/\/+$/, '');

/**
 * Formats AI responses into clean typography:
 * - Parses **bold text** into <strong> without raw asterisks
 * - Renders bullet points with dot markers
 * - Handles emoji callout headers
 * - Renders disclaimer notes in italic
 */
function FormattedMessage({ content, isUser }: { content: string; isUser?: boolean }) {
  if (isUser) {
    return <p className="text-xs font-medium leading-relaxed text-white">{content}</p>;
  }

  const lines = content.split('\n');

  const renderInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={idx} className="font-extrabold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const clean = part.replace(/\*\*/g, '').replace(/^\*\s*/, '');
      return <span key={idx}>{clean}</span>;
    });
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;
        if (trimmed === '---' || trimmed === '___') {
          return <hr key={idx} className="border-white/10 my-2" />;
        }

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        if (isBullet) {
          const bulletText = trimmed.replace(/^[•\-*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#22c55e' }} />
              <div className="flex-1" style={{ color: '#86efac' }}>{renderInline(bulletText)}</div>
            </div>
          );
        }

        const isNote = trimmed.startsWith('*(') || trimmed.startsWith('(Note');
        if (isNote) {
          return (
            <p key={idx} className="text-[11px] italic" style={{ color: '#4b7a5e' }}>
              {renderInline(trimmed.replace(/^\*|\*$/g, ''))}
            </p>
          );
        }

        return (
          <p key={idx} style={{ color: '#86efac' }}>
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export function AiChat({ product, barcode: barcodeProp, productName: productNameProp }: {
  product?: Product;
  barcode?: string;
  productName?: string;
}) {
  const barcode = product?.barcode ?? barcodeProp ?? '';
  const productName = product?.name ?? productNameProp ?? 'this product';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    const historySnapshot = [...messages];
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productBarcodes: [barcode],
          messages: historySnapshot.map((m) => ({ role: m.role, content: m.content })),
          userMessage: trimmed,
        }),
      });

      const json = await res.json();
      const reply = json.success
        ? json.data.reply
        : (json.error ? `⚠️ ${json.error}` : 'Sorry, I could not process that. Please try again.');

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Failed to connect to PackTruth AI server. Please check your connection or try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[460px] sm:min-h-[520px] p-3.5 sm:p-5 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(34,197,94,0.12)' }}>
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 16px rgba(34,197,94,0.3)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white leading-none">AI Food Assistant</h3>
            <p className="text-[10px] sm:text-[11px] mt-1 truncate" style={{ color: '#4b7a5e' }}>
              Ask anything about <span className="font-semibold" style={{ color: '#86efac' }}>{productName}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>Online</span>
        </div>
      </div>

      {/* Quick Questions (Swipeable row on mobile) */}
      {messages.length === 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider block" style={{ color: '#4b7a5e' }}>Quick Questions</span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap pb-1">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-xl whitespace-nowrap sm:whitespace-normal transition-all text-left font-medium active:scale-95 flex-shrink-0"
                style={{ background: 'rgba(34,197,94,0.07)', color: '#86efac', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 min-h-[220px] max-h-[360px] overflow-y-auto space-y-3 pr-1 py-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <Bot className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
              </div>
            )}

            <div
              className="max-w-[88%] rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3"
              style={
                m.role === 'user'
                  ? { background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderTopRightRadius: 4 }
                  : { background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', borderTopLeftRadius: 4 }
              }
            >
              <FormattedMessage content={m.content} isUser={m.role === 'user'} />
            </div>

            {m.role === 'user' && (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <User className="w-3.5 h-3.5" style={{ color: '#86efac' }} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}
            >
              <Bot className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}>
              <div className="flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#22c55e', animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#22c55e', animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#22c55e', animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Form with iOS auto-zoom prevention */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        className="flex items-center gap-2 pt-3"
        style={{ borderTop: '1px solid rgba(34,197,94,0.1)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about protein, weight loss, or in Hindi..."
          className="flex-1 rounded-xl px-3.5 py-2.5 text-base sm:text-xs placeholder-[#2d5236] focus:outline-none transition-all"
          style={{
            background: 'rgba(34,197,94,0.05)',
            border: '1px solid rgba(34,197,94,0.15)',
            color: '#f0fdf4',
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="btn-primary disabled:opacity-40 text-xs px-3 sm:px-4 py-2.5 flex-shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}

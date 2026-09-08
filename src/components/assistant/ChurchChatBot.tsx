import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Minus, 
  MessageSquareText, 
  Sparkles, 
  Trash2, 
  HelpCircle,
  Church,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'ai' | 'knowledge_base';
}

const QUICK_PROMPTS = [
  '🕒 Horaires des cultes',
  '👤 Pasteur Bequel CHERELUS',
  '🏫 École Nazareth & Examens 9ème AF',
  '🛠️ Inscription EPND Métiers',
  '🤝 Projet CDEJ & Enfants',
  '🕊️ Demande de prière',
  '📍 Adresse & Coordonnées',
  '💛 Soutenir par dîme ou don'
];

export const ChurchChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Béni soit l'Éternel ! Bienvenue auprès de l'assistant officiel de l'Église du Nazaréen de Damé. « Sainteté à l'Éternel ».\n\nJe suis à votre service pour vous renseigner sur nos cultes, nos ministères (JNI, MNI), l'École Nazareth, l'EPND et notre foi. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'knowledge_base'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });

      if (!res.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await res.json();
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Que le Seigneur vous bénisse ! Nous n'avons pas pu traiter votre demande pour l'instant. N'hésitez pas à nous appeler au +509 48596089.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages((prev) => [...prev, botReply]);
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Que la grâce du Seigneur soit avec vous ! Vous pouvez nous joindre directement au secrétariat au +509 48596089 ou par email à eglisedunazareendedame@gmail.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'knowledge_base'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-reset',
        sender: 'assistant',
        text: "La conversation a été réinitialisée. En quoi puis-je vous être utile concernant la vie spirituelle et communautaire de l'Église du Nazaréen de Damé ?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#0F2C59] to-[#1A365D] text-white p-4 rounded-full shadow-2xl hover:shadow-[#D4AF37]/30 border-2 border-[#D4AF37] flex items-center gap-3 cursor-pointer group hover:scale-105 transition-all duration-300"
          aria-label="Ouvrir l'assistant de l'église"
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-[#D4AF37]" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <span className="hidden sm:inline font-bold text-xs tracking-wide text-white pr-1">
            Questions ? Posez au Bot
          </span>
          <span className="bg-[#D4AF37] text-[#0F2C59] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
            Nazaréen
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F2C59] via-[#1A365D] to-[#0A192F] text-white p-4 flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#D4AF37] text-[#0F2C59] flex items-center justify-center font-bold shadow-md">
                <Church className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm font-display text-white">
                    Assistant Paroissial
                  </h3>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[11px] text-[#D4AF37] font-medium tracking-wide">
                  Église du Nazaréen de Damé
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Effacer la conversation"
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Fermer"
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-[#0F2C59] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1 text-[10px] text-[#D4AF37] font-bold mb-1 uppercase tracking-wider">
                        <Sparkles className="h-3 w-3" />
                        <span>Nazaréen Bot</span>
                      </div>
                    )}
                    <div className="whitespace-pre-line">{m.text}</div>
                    <div
                      className={`text-[9px] mt-1.5 text-right font-mono ${
                        isUser ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs text-slate-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                  <span>Recherche de la réponse...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips carousel */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#0F2C59] hover:text-[#D4AF37] text-slate-700 text-[11px] font-medium transition-all cursor-pointer border border-slate-200 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Posez votre question sur l'église ou l'école..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:bg-white transition-all text-slate-900"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                inputText.trim() && !isLoading
                  ? 'bg-[#0F2C59] text-[#D4AF37] hover:bg-[#1A365D] shadow-md'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Envoyer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

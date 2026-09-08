import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  MessageSquare, 
  CheckCircle2,
  BookOpen,
  Calendar,
  Users,
  GraduationCap
} from 'lucide-react';
import { CHURCH_INFO } from '../data/churchData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  suggestions?: string[];
}

interface ChurchAssistantBotProps {
  onNavigate?: (tab: string) => void;
}

export const ChurchAssistantBot: React.FC<ChurchAssistantBotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `La paix et la grâce du Seigneur soient avec vous ! 🕊️\n\nJe suis le **Guide Virtuel de l'Église du Nazaréen de Damé** (« Sainteté à l'Éternel »).\n\nPosez-moi vos questions sur nos cultes, le **Pasteur Bequel CHERELUS**, nos ministères (JNI, CDEJ, chorales), l'**École Nazareth** (jeux éducatifs et examens), ou l'**École Professionnelle EPND**.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '🕒 Horaires des cultes',
        '⛪ Histoire & Pasteur Bequel',
        '🎓 École Nazareth & Examens',
        '🤝 CDEJ & Compassion',
        '🙏 Demande de prière'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: historyPayload })
      });

      const data = await res.json();

      if (data && data.reply) {
        const botMsg: ChatMessage = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: data.suggestions || ['Horaires des cultes', 'École Nazareth', 'Contacter le secrétariat']
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Réponse invalide');
      }
    } catch (err) {
      console.warn('Bot fetch error, using local fallback:', err);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: `Nous nous réjouissons de votre visite ! L'Église du Nazaréen de Damé vous accueille le **dimanche dès 08h00** pour le culte d'adoration, le **mercredi à 18h00** pour l'étude biblique, et le **vendredi à 18h00** pour la prière.\n\nPour toute urgence ou requête officielle, vous pouvez joindre le secrétariat au **${CHURCH_INFO.phone}**. Que Dieu vous bénisse !`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Horaires des cultes', 'Histoire de l’Église', 'École Nazareth']
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: `Conversation réinitialisée. Comment puis-je vous aider au sujet de l'Église du Nazaréen de Damé et de ses ministères ?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '🕒 Horaires des cultes',
          '⛪ Histoire & Pasteur Bequel',
          '🎓 École Nazareth & Examens',
          '🙏 Demande de prière'
        ]
      }
    ]);
  };

  return (
    <aside aria-label="Assistant Paroissial et Ministères" className="fixed bottom-5 right-5 z-40">
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#0F2C59] via-[#163B72] to-[#0F2C59] p-3 sm:px-4 sm:py-3 text-white shadow-2xl hover:shadow-[#D4AF37]/20 border-2 border-[#D4AF37] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Poser une question sur notre ministère"
        >
          <div className="relative">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F2C59] font-bold shadow-inner">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0F2C59]"></span>
            </span>
          </div>
          <div className="hidden sm:block text-left pr-1">
            <div className="text-[10px] uppercase font-extrabold tracking-wider text-[#D4AF37]">
              Guide Paroissial
            </div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>Une question sur le ministère ?</span>
              <Sparkles className="h-3 w-3 text-[#D4AF37]" />
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`w-[92vw] sm:w-[410px] max-w-[430px] rounded-3xl bg-white shadow-2xl border-2 border-[#D4AF37] overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#081B36] via-[#0F2C59] to-[#163B72] p-3.5 sm:p-4 text-white flex items-center justify-between border-b border-[#D4AF37]/40 select-none">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37] text-[#0F2C59] shadow">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                  <span>Guide Paroissial & Ministères</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-[#D4AF37] font-medium leading-none mt-0.5">
                  Église du Nazaréen de Damé • « Sainteté à l’Éternel »
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={handleClearHistory}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Effacer l'historique"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                title={isMinimized ? 'Agrandir' : 'Réduire'}
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors text-slate-300"
                title="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body (Messages & Input) */}
          {!isMinimized && (
            <>
              {/* Scrollable messages container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
                {/* Information banner */}
                <div className="bg-[#0F2C59]/5 border border-[#0F2C59]/10 rounded-2xl p-2.5 flex items-center gap-2 text-[11px] text-[#0F2C59]">
                  <Sparkles className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>
                    Posez toute question sur nos cultes, nos formations, l'école ou nos projets communautaires.
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#0F2C59] text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {msg.text.split('\n').map((line, lIdx) => {
                          // Simple markdown parser for **bold**
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>
                              {parts.map((p, pIdx) => {
                                if (p.startsWith('**') && p.endsWith('**')) {
                                  return <strong key={pIdx} className="font-bold text-[#0F2C59]">{p.slice(2, -2)}</strong>;
                                }
                                return p;
                              })}
                            </p>
                          );
                        })}
                      </div>

                      <div
                        className={`text-[9px] mt-1.5 text-right ${
                          msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>

                    {/* Suggestions chips if provided by bot */}
                    {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="rounded-full bg-white border border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] text-[10px] font-semibold text-[#0F2C59] px-2.5 py-1 transition-all shadow-xs active:scale-95"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-center gap-2 text-slate-500 bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 max-w-[70%]">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-bounce"></span>
                      <span className="h-2 w-2 rounded-full bg-[#0F2C59] animate-bounce delay-100"></span>
                      <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-bounce delay-200"></span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">Recherche de la réponse...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Jump Bar */}
              <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
                <span className="font-semibold text-slate-500">Raccourcis du site :</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onNavigate?.('education');
                      setIsOpen(false);
                    }}
                    className="hover:text-[#0F2C59] hover:underline font-bold flex items-center gap-1"
                  >
                    <GraduationCap className="h-3 w-3 text-[#D4AF37]" />
                    École & Examens
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      onNavigate?.('priere');
                      setIsOpen(false);
                    }}
                    className="hover:text-[#0F2C59] hover:underline font-bold flex items-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3 text-[#D4AF37]" />
                    Prière
                  </button>
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Posez votre question sur le ministère..."
                  disabled={loading}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-slate-50 text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#0F2C59] text-[#D4AF37] hover:bg-[#163B72] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow active:scale-95"
                  title="Envoyer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </aside>
  );
};

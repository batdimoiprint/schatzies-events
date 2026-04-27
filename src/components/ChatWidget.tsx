// src/components/ChatWidget.tsx
import { useEffect, useRef, useState } from 'react';
import supportData from '@/data/chat-support.json';

type SupportExtra =
  | { locations: Record<string, string> }
  | { contact: { mobile: string[]; facebook: string; email: string } }
  | { packages: Array<{ name: string; starting_price: number }> }
  | { inclusions: string[] };

type KnowledgeItem = {
  category: string;
  keywords: string[];
  answer: string;
  extra?: SupportExtra;
};

type SupportJson = {
  company: string;
  greeting: string;
  fallback: string;
  closing: string;
  knowledge_base: KnowledgeItem[];
};

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  extra?: SupportExtra;
  timestamp: Date;
};

const supportContent = supportData as SupportJson;

function formatPrice(value: number) {
  return value.toLocaleString('en-PH');
}

function SupportExtras({ extra }: { extra?: SupportExtra }) {
  if (!extra) return null;

  if ('locations' in extra) {
    return (
      <div className="mt-3 space-y-2 text-xs">
        {Object.entries(extra.locations).map(([name, url]) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg bg-white px-3 py-2 text-[#700F81] border border-pink-100 shadow-sm transition hover:bg-pink-50 hover:border-pink-200"
          >
            📍 {name}
          </a>
        ))}
      </div>
    );
  }

  if ('contact' in extra) {
    return (
      <div className="mt-3 space-y-2 text-xs">
        <div className="rounded-lg bg-white px-3 py-2 border border-pink-100 shadow-sm">
          <p className="font-semibold text-gray-700">Mobile</p>
          <ul className="mt-1 space-y-1">
            {extra.contact.mobile.map((number) => (
              <li key={number} className="flex items-center gap-1 text-gray-600">
                <span>📱</span> {number}
              </li>
            ))}
          </ul>
        </div>
        <a
          href={extra.contact.facebook}
          target="_blank"
          rel="noreferrer"
          className="block rounded-lg bg-white px-3 py-2 text-[#700F81] border border-pink-100 shadow-sm transition hover:bg-pink-50 hover:border-pink-200"
        >
          📘 Facebook Page
        </a>
        <a
          href={`mailto:${extra.contact.email}`}
          className="block rounded-lg bg-white px-3 py-2 text-[#700F81] border border-pink-100 shadow-sm transition hover:bg-pink-50 hover:border-pink-200"
        >
          📧 {extra.contact.email}
        </a>
      </div>
    );
  }

  if ('packages' in extra) {
    return (
      <div className="mt-3 space-y-2 text-xs">
        {extra.packages.map((packageItem) => (
          <div
            key={packageItem.name}
            className="rounded-lg bg-white px-3 py-2 border border-pink-100 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-gray-700">{packageItem.name}</span>
              <span className="font-bold text-[#700F81]">
                ₱{formatPrice(packageItem.starting_price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if ('inclusions' in extra) {
    return (
      <ul className="mt-3 space-y-2 text-xs">
        {extra.inclusions.map((item) => (
          <li
            key={item}
            className="rounded-lg bg-white px-3 py-2 border border-pink-100 shadow-sm text-gray-600"
          >
            ✅ {item}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

function TextWithBold({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-[#700F81]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </div>
  );
}

export function ChatWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          role: 'bot',
          content: supportContent.greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatOpen]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Process keywords
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      // Improved matching: check if any word in the query matches or if the query contains the keyword
      const matchedItems = supportContent.knowledge_base.filter((item) =>
        item.keywords.some((keyword) => {
          const lowerKeyword = keyword.toLowerCase();
          return lowerQuery.includes(lowerKeyword);
        })
      );

      let botResponse: Partial<Message>;

      if (matchedItems.length > 0) {
        // Unique responses only
        const uniqueAnswers = Array.from(new Set(matchedItems.map((item) => item.answer)));
        const combinedAnswer = uniqueAnswers.join('\n\n');

        // Use the first match's extra if it exists
        const firstExtra = matchedItems.find((item) => item.extra)?.extra;

        botResponse = {
          content: `${combinedAnswer}\n\n${supportContent.closing}`,
          extra: firstExtra,
        };
      } else {
        botResponse = {
          content: supportContent.fallback,
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: botResponse.content!,
          extra: botResponse.extra,
          timestamp: new Date(),
        },
      ]);
    }, 600);
  };

  const handleToggleChat = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <>
      {/* ── sCHATzies Chat Window ── */}
      {chatOpen && (
        <div className="fixed bottom-14 left-3 right-3 z-[9999] flex max-h-[72vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:bottom-4 sm:left-auto sm:right-[120px] sm:w-[390px] sm:max-h-[68vh]">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#FF0066] to-[#700F81] px-5 py-4 shrink-0">
            <img
              src="/Pictures/business-logo.png"
              alt={supportContent.company}
              className="h-10 w-10 rounded-full bg-white object-contain p-0.5"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{supportContent.company}</p>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] font-medium text-white/80">Online Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-gray-50/50 p-4 space-y-4 scroll-smooth"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'bot' && (
                    <img
                      src="/Pictures/business-logo.png"
                      alt="Bot"
                      className="h-7 w-7 rounded-full bg-white object-contain p-0.5 ring-1 ring-gray-200 self-end mb-1"
                    />
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#700F81] text-white rounded-tr-none'
                        : 'bg-white text-gray-700 ring-1 ring-gray-100 rounded-tl-none'
                    }`}
                  >
                    <TextWithBold text={msg.content} />
                    {msg.extra && <SupportExtras extra={msg.extra} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input bar */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border-t border-gray-100 bg-white px-4 py-3 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#700F81] text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ── Floating Chat Button ── */}
      <button
        onClick={handleToggleChat}
        aria-label="Chat with our AI assistant"
        className="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066] to-[#700F81] shadow-[0_8px_32px_rgba(112,15,129,0.5)] transition-transform hover:scale-110 active:scale-95 sm:bottom-7 sm:right-7 sm:h-20 sm:w-20"
      >
        {chatOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="h-7 w-7 sm:h-10 sm:w-10"
              aria-hidden="true"
            >
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
              <path d="M17.5 2l.41 1.26L19.17 4l-1.26.74L17.5 6l-.41-1.26L15.83 4l1.26-.74z" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow sm:h-5 sm:w-5 sm:text-[10px]">
              1
            </span>
          </div>
        )}
      </button>
    </>
  );
}

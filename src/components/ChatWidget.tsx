// src/components/ChatWidget.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import supportData from '@/data/chat-support.json';

type SupportExtra =
  | { locations: Record<string, string> }
  | { contact: { mobile: string[]; facebook: string; email: string } }
  | { packages: Array<{ name: string; starting_price: number }> }
  | { inclusions: string[] };

type SupportAnswer = {
  id: number;
  category: string;
  question: string;
  answer: string;
  extra?: SupportExtra;
};

type SupportJson = {
  company: string;
  faq: Array<{
    category: string;
    items: Array<
      | { id: number; type: 'question'; content: string }
      | { id: number; type: 'answer'; content: string; extra?: SupportExtra }
    >;
  }>;
};

const supportContent = supportData as SupportJson;

const faqs: SupportAnswer[] = supportContent.faq.flatMap((section) => {
  const answers = new Map<number, { content: string; extra?: SupportExtra }>();

  section.items.forEach((item) => {
    if (item.type === 'answer') {
      answers.set(item.id, { content: item.content, extra: item.extra });
    }
  });

  return section.items.flatMap((item) => {
    if (item.type !== 'question') {
      return [];
    }

    const answer = answers.get(item.id);

    if (!answer) {
      return [];
    }

    return [
      {
        id: item.id,
        category: section.category,
        question: item.content,
        answer: answer.content,
        extra: answer.extra,
      },
    ];
  });
});

function formatPrice(value: number) {
  return value.toLocaleString('en-PH');
}

function SupportExtras({ extra }: { extra?: SupportExtra }) {
  if (!extra) {
    return null;
  }

  if ('locations' in extra) {
    return (
      <div className="mt-3 space-y-2 text-xs text-gray-600">
        {Object.entries(extra.locations).map(([name, url]) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg bg-white px-3 py-2 text-[#700F81] underline-offset-2 transition hover:bg-pink-50 hover:underline"
          >
            {name}
          </a>
        ))}
      </div>
    );
  }

  if ('contact' in extra) {
    return (
      <div className="mt-3 space-y-2 text-xs text-gray-600">
        <div className="rounded-lg bg-white px-3 py-2">
          <p className="font-semibold text-gray-700">Mobile</p>
          <ul className="mt-1 space-y-1">
            {extra.contact.mobile.map((number) => (
              <li key={number}>{number}</li>
            ))}
          </ul>
        </div>
        <a
          href={extra.contact.facebook}
          target="_blank"
          rel="noreferrer"
          className="block rounded-lg bg-white px-3 py-2 text-[#700F81] underline-offset-2 transition hover:bg-pink-50 hover:underline"
        >
          Facebook Page
        </a>
        <a
          href={`mailto:${extra.contact.email}`}
          className="block rounded-lg bg-white px-3 py-2 text-[#700F81] underline-offset-2 transition hover:bg-pink-50 hover:underline"
        >
          {extra.contact.email}
        </a>
      </div>
    );
  }

  if ('packages' in extra) {
    return (
      <div className="mt-3 space-y-2 text-xs text-gray-600">
        {extra.packages.map((packageItem) => (
          <div key={packageItem.name} className="rounded-lg bg-white px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-gray-700">{packageItem.name}</span>
              <span className="font-semibold text-[#700F81]">
                PHP {formatPrice(packageItem.starting_price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if ('inclusions' in extra) {
    return (
      <ul className="mt-3 space-y-2 text-xs text-gray-600">
        {extra.inclusions.map((item) => (
          <li key={item} className="rounded-lg bg-white px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export function ChatWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);
  const responseRef = useRef<HTMLDivElement | null>(null);

  const activeFaq = useMemo(
    () => (activeFaqId === null ? null : (faqs.find((faq) => faq.id === activeFaqId) ?? null)),
    [activeFaqId]
  );

  useEffect(() => {
    if (!chatOpen || activeFaqId === null) {
      return;
    }

    responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeFaqId, chatOpen]);

  const handleToggleChat = () => {
    setChatOpen((prev) => {
      const nextOpen = !prev;

      if (nextOpen) {
        setActiveFaqId(null);
      }

      return nextOpen;
    });
  };

  return (
    <>
      {/* ── sCHATzies Chat Window ── */}
      {chatOpen && (
        <div className="fixed bottom-14 left-3 right-3 z-[9999] flex max-h-[72vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:bottom-4 sm:left-auto sm:right-[120px] sm:w-[390px] sm:max-h-[68vh]">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#FF0066] to-[#700F81] px-5 py-4">
            <img
              src="/Pictures/business-logo.png"
              alt={supportContent.company}
              className="h-10 w-10 rounded-full bg-white object-contain p-0.5"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{supportContent.company}</p>
              <p className="text-xs text-white/80">Frequently Asked Questions</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-6 sm:py-5">
            {/* Welcome heading */}
            <h3 className="text-center text-xl font-bold text-[#FF0066]">Welcome to sCHATzies!</h3>
            <p className="mt-1 text-center text-sm text-gray-500">
              We&rsquo;re here to help you plan. Ask sCHATzies
              <br />
              anything about your upcoming milestone.
            </p>

            {/* Bot message */}
            {activeFaq && (
              <div
                ref={responseRef}
                className="mt-4 flex w-full items-start gap-2"
                aria-live="polite"
              >
                <img
                  src="/Pictures/business-logo.png"
                  alt={supportContent.company}
                  className="mt-1 h-7 w-7 rounded-full bg-white object-contain p-0.5 ring-1 ring-gray-200"
                />
                <div className="max-w-[calc(100%-2rem)] rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700">
                  <p className="text-[0.78rem] font-semibold uppercase tracking-wide text-[#700F81]">
                    {activeFaq.question}
                  </p>
                  <p className="mt-1">{activeFaq.answer}</p>
                  <SupportExtras extra={activeFaq.extra} />
                </div>
              </div>
            )}

            {/* Quick-reply buttons */}
            <div className="mt-4 flex w-full flex-col gap-2 pr-1">
              {faqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => setActiveFaqId(faq.id)}
                  aria-pressed={faq.id === activeFaqId}
                  className={`w-full rounded-full border px-4 py-2 text-sm font-medium leading-snug transition-colors ${
                    faq.id === activeFaqId
                      ? 'border-[#700F81] bg-[#700F81]/10 text-[#700F81]'
                      : 'border-pink-200 bg-pink-50 text-[#FF0066] hover:bg-pink-100'
                  }`}
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-3 border-t border-gray-200 px-4 py-3">
            <input
              type="text"
              placeholder="Aa"
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-pink-300"
            />
            <button
              aria-label="Send"
              className="text-gray-400 transition-colors hover:text-[#700F81]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Chat Button ── */}
      <button
        onClick={handleToggleChat}
        aria-label="Chat with our AI assistant"
        className="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066] to-[#700F81] shadow-[0_8px_32px_rgba(112,15,129,0.5)] transition-transform hover:scale-110 active:scale-95 sm:bottom-7 sm:right-7 sm:h-20 sm:w-20"
      >
        {/* Crescent moon + star icon */}
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

        {/* Notification badge */}
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[0.6rem] font-bold text-white shadow sm:h-6 sm:w-6 sm:text-[0.7rem]">
          1
        </span>
      </button>
    </>
  );
}

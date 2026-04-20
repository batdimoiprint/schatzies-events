import { useState } from 'react';
import { Send, Mail, Phone } from 'lucide-react';

const ORGANIZER = {
  name: 'John Errol Sebial',
  initial: 'J',
  email: 'sampleemail@gmail.com',
  contact: '489234782365',
};

const SAMPLE_MESSAGES = [
  { id: 1, from: 'organizer', text: 'Hi, Juliana Rox! Please let us know how we can help you.' },
  { id: 2, from: 'client', text: 'May I know the progress of our event?' },
  { id: 3, from: 'organizer', text: '' }, // empty/loading bubble
  { id: 4, from: 'client', text: 'May I know the progress of our event?' },
];

export function MessagePage() {
  const [input, setInput] = useState('');

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2d2834]">Message</h1>
          <p className="mt-1 text-sm font-medium text-[#696373]">
            Directly message your organizer to discuss details and ensure your celebration is
            perfectly managed.
          </p>
        </div>
      </div>

      {/* ── Two-column grid ────────────────────────────────────────────────── */}
      <div className="mt-6 grid min-h-0 flex-1 gap-6 lg:grid-cols-3">
        {/* ── Left: Chat Window (col-span-2) ─────────────────────────────── */}
        <div className="flex min-h-0 flex-col rounded-xl bg-white shadow-md lg:col-span-2">
          {/* Chat Header */}
          <div className="shrink-0 rounded-t-xl bg-pink-400 px-4 py-3 sm:p-4">
            <p className="text-xl font-bold text-white">{ORGANIZER.name}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm text-white">Active</span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
            {SAMPLE_MESSAGES.map((msg) =>
              msg.from === 'organizer' ? (
                /* Incoming */
                <div key={msg.id} className="flex items-end gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-400 text-sm font-bold text-white">
                    {ORGANIZER.initial}
                  </div>
                  <div className="max-w-xs rounded-2xl bg-gray-100 p-4 text-sm text-gray-800">
                    {msg.text || <span className="inline-block h-4 w-32 rounded bg-gray-300" />}
                  </div>
                </div>
              ) : (
                /* Outgoing */
                <div key={msg.id} className="flex items-end justify-end gap-3">
                  <div className="max-w-xs rounded-2xl bg-gray-100 p-4 text-sm text-gray-800">
                    {msg.text}
                  </div>
                  <img
                    src="/Pictures/organizerpics/Profile Picture.png"
                    alt="You"
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                </div>
              )
            )}
          </div>

          {/* Chat Input */}
          <div className="flex shrink-0 items-center gap-4 p-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="w-full rounded-full bg-gray-100 px-6 py-3 text-sm text-gray-700 shadow-inner outline-none placeholder:text-gray-400"
            />
            <button
              aria-label="Send"
              className="shrink-0 text-purple-700 transition hover:text-purple-900"
            >
              <Send className="size-6" />
            </button>
          </div>
        </div>

        {/* ── Right: Profile Card (col-span-1) ───────────────────────────── */}
        <div className="hidden min-h-0 flex-col items-center overflow-y-auto rounded-xl bg-white p-6 shadow-md lg:col-span-1 lg:flex xl:p-8">
          {/* Avatar */}
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-pink-400 text-5xl font-bold text-white shadow-lg">
            {ORGANIZER.initial}
          </div>

          {/* Name + badge */}
          <p className="mt-4 text-2xl font-bold text-[#2d2834]">{ORGANIZER.name}</p>
          <span className="mt-2 rounded-full bg-pink-400 px-4 py-1 text-sm text-white">
            Assigned Organizer
          </span>

          {/* Inquiry Information */}
          <div className="mt-8 w-full">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              Inquiry Information
            </p>
            <div className="mb-4 border-b border-gray-200" />

            {/* Email */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-500 text-white">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">EMAIL</p>
                <p className="text-sm text-gray-700">{ORGANIZER.email}</p>
              </div>
            </div>

            {/* Contact Number */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-500 text-white">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">CONTACT NUMBER</p>
                <p className="text-sm text-gray-700">{ORGANIZER.contact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

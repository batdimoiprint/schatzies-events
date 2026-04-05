import { useState } from 'react';
import {
  PlusCircle,
  CheckCircle,
  ChartBar,
  Download,
  Link as LinkIcon,
} from '@phosphor-icons/react';

type State = 'idle' | 'generated' | 'active';

const qrPattern = [
  1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1,
  0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
  1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1,
  0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1,
  0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
  1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1,
  1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0,
  0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0,
  1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
].flat();

export function QrCodePage() {
  const [state, setState] = useState<State>('idle');
  const [activeTab, setActiveTab] = useState<'overview' | 'guest-list'>('overview');

  return (
    <div className="flex h-full flex-col">
      {/* â”€â”€ Header row: title + Create QR button â”€â”€ */}
      <div className="flex min-h-[6rem] items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2d2834]">RSVP Management</h1>
          <p className="mt-1 text-sm text-[#696373]">
            Oversee your invitations and monitor attendance in real-time.
          </p>
        </div>

        {state === 'active' && (
          <button
            onClick={() => setState('idle')}
            className="flex items-center gap-2 rounded-lg bg-[#E5E5E5] px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-300 active:scale-95"
          >
            <PlusCircle weight="bold" size={18} />
            Create QR Code
          </button>
        )}
      </div>

      {/* â”€â”€ Tabs (aligned with sidebar tagline) â”€â”€ */}
      {state === 'active' && (
        <div className="mb-4 flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-sm font-semibold transition ${
              activeTab === 'overview'
                ? 'border-b-2 border-[#df2b80] text-[#df2b80]'
                : 'text-[#696373] hover:text-[#2d2834]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('guest-list')}
            className={`pb-2 text-sm font-semibold transition ${
              activeTab === 'guest-list'
                ? 'border-b-2 border-[#df2b80] text-[#df2b80]'
                : 'text-[#696373] hover:text-[#2d2834]'
            }`}
          >
            Guest List
          </button>
        </div>
      )}

      {/* â”€â”€ STATE: Idle â”€â”€ */}
      {state === 'idle' && (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-[#E6E6E6] shadow-inner">
          <button
            onClick={() => setState('generated')}
            className="flex items-center gap-2.5 rounded-md bg-white px-6 py-3 text-lg font-semibold text-pink-600 shadow-lg transition hover:shadow-xl active:scale-95"
          >
            <PlusCircle weight="bold" size={22} />
            Create QR Code
          </button>
        </div>
      )}

      {/* â”€â”€ STATE: Generated modal â”€â”€ */}
      {state === 'generated' && (
        <div className="relative mt-6 flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-[#E6E6E6] shadow-inner">
          <div className="absolute inset-0 rounded-lg bg-black/20" />
          <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-white px-10 py-10 text-center shadow-2xl">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500 shadow-md">
              <CheckCircle weight="fill" size={40} color="white" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#2d2834]">QR Generated!</h2>
            <p className="text-sm leading-relaxed text-[#696373]">
              QR Code Secured. Share this link to begin receiving guest responses.
            </p>
            <button
              onClick={() => setState('active')}
              className="mt-2 w-full rounded-full bg-green-500 py-3 text-base font-bold text-white shadow-md transition hover:bg-green-600 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* â”€â”€ STATE: Active â€” Overview â”€â”€ */}
      {state === 'active' && activeTab === 'overview' && (
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr]">
            {/* â”€â”€ QR Code column â”€â”€ */}
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg">
              <p className="text-base font-bold text-[#df2b80]">Schatzies Events</p>

              <div className="mt-4 grid aspect-square w-48 grid-cols-[repeat(21,1fr)] grid-rows-[repeat(21,1fr)] overflow-hidden rounded-sm">
                {qrPattern.map((cell, i) => (
                  <div key={i} className={cell ? 'bg-[#8b1bce]' : 'bg-white'} />
                ))}
              </div>

              <p className="mt-5 text-sm font-extrabold uppercase tracking-wide text-[#2d2834]">
                Share QR to Invite Guest!
              </p>
              <p className="mt-1 text-xs text-[#696373]">
                QR CODE ID: <span className="font-semibold">SEC-2026-001</span>
              </p>
              <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-800">
                Active Invitation Link
              </span>

              <div className="mt-5 flex gap-3">
                <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#df2b80] shadow-md transition hover:bg-gray-50">
                  <Download weight="bold" size={14} />
                  Download QR
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#df2b80] shadow-md transition hover:bg-gray-50">
                  <LinkIcon weight="bold" size={14} />
                  Copy Link
                </button>
              </div>
            </div>

            {/* â”€â”€ Attendance Breakdown column â”€â”€ */}
            <div className="flex flex-col">
              <h3 className="pb-2 text-lg font-extrabold text-[#2d2834] border-b border-black">
                Attendance Breakdown
              </h3>

              <div className="mt-5 rounded-xl border border-gray-100 bg-white p-5 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#2d2834]">Live Response Analytics</p>
                    <p className="text-[11px] text-[#696373]">
                      A visual representation of your current guest status.
                    </p>
                  </div>
                  <ChartBar weight="fill" size={18} className="text-[#696373]" />
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  {[
                    {
                      label: 'Confirmed',
                      pct: '55%',
                      count: 50,
                      bar: 'bg-green-400',
                      text: 'text-green-600',
                    },
                    {
                      label: 'Declined',
                      pct: '12%',
                      count: 10,
                      bar: 'bg-red-500',
                      text: 'text-red-500',
                    },
                    {
                      label: 'Pending',
                      pct: '90%',
                      count: 90,
                      bar: 'bg-yellow-400',
                      text: 'text-yellow-600',
                    },
                  ].map(({ label, pct, count, bar, text }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs font-semibold text-[#696373]">
                        {label}
                      </span>
                      <div className="flex-1 h-6 rounded bg-gray-100">
                        <div className={`h-full rounded ${bar}`} style={{ width: pct }} />
                      </div>
                      <span className={`w-6 shrink-0 text-right text-xs font-bold ${text}`}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-right text-xs text-[#696373]">
                Current Capacity: <span className="font-semibold">150 Pax</span> | Responses:{' '}
                <span className="font-semibold">60/150</span> | Last updated:{' '}
                <span className="italic">2 mins ago</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ STATE: Active â€” Guest List â”€â”€ */}
      {state === 'active' && activeTab === 'guest-list' && (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-[#696373]">Guest list coming soon...</p>
        </div>
      )}
    </div>
  );
}

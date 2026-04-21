import { X, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const MEETINGS = [
  { label: 'Meeting 1 | Zus Coffee', time: '00:00 - 00:00' },
  { label: 'Meeting 2 | Zus Coffee', time: '00:00 - 00:00' },
];

const CHECKED_ITEMS = [
  { label: 'Technicals Manpower', checked: true },
  { label: '(2) lighting', checked: true },
  { label: 'Fresh Flowers Delivered', checked: false },
  { label: 'Dry-run DAY1', checked: false },
  { label: 'Dry-run DAY2', checked: false },
];

export function ChecklistMeetingModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Sticky pink header */}
        <div className="flex shrink-0 items-center justify-between bg-pink-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Checklist &amp; Meeting</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white transition hover:opacity-70"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-4 overflow-y-auto p-6">
          {/* Meetings card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-gray-800">Meetings</h3>
            <div className="flex flex-col gap-3">
              {MEETINGS.map((meeting, i) => (
                <div key={i}>
                  <p className="text-sm text-gray-800">{meeting.label}</p>
                  <p className="text-xs text-gray-400">{meeting.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checked card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-gray-800">Checked</h3>
            <ul className="flex flex-col gap-2">
              {CHECKED_ITEMS.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {item.checked ? (
                    <CheckCircle2 className="size-4 shrink-0 text-pink-500" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-gray-300" />
                  )}
                  <span className={item.checked ? 'text-gray-800' : 'text-gray-400'}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

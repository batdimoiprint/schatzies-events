import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const TECHNICALS = [
  { num: 1, label: 'Audio Cue' },
  { num: 2, label: 'Lighting Cue' },
  { num: 3, label: 'Visual/Screen Cue' },
  { num: 4, label: 'System Tech/Troubleshooter' },
  { num: 5, label: 'Dry-run date' },
];

export function AllocationResourcesModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Sticky pink header */}
        <div className="flex shrink-0 items-center justify-between bg-pink-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Allocation Resources</h2>
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
          {/* Event Coordinator */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
              <h3 className="text-base font-bold text-gray-800">Event Coordinator</h3>
            </div>
            <p className="text-sm text-gray-700">Ken Chan</p>
            <p className="text-xs text-gray-400">00:00 – 00:00</p>
          </div>

          {/* Host */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <h3 className="text-base font-bold text-gray-800">Host</h3>
            </div>
            <p className="text-sm text-gray-700">Angel U. Nicorn</p>
            <p className="text-xs text-gray-400">00:00 – 00:00</p>
          </div>

          {/* Technicals */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <h3 className="text-base font-bold text-gray-800">Technicals</h3>
            </div>
            <div className="flex flex-col gap-3">
              {TECHNICALS.map((item) => (
                <div key={item.num}>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.num}. {item.label}
                  </p>
                  <p className="text-xs leading-relaxed text-gray-500">
                    Add manpower &amp; specific things huhuhu
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

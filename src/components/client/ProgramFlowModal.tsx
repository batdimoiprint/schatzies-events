import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const FLOW_ITEMS = [
  {
    time: '00:00 - 00:00',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum. Curabitur ipsum mi, bibendum ut dictum non, commodo a purus.',
  },
  {
    time: '00:00 - 00:00',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum. Curabitur ipsum mi, bibendum ut dictum non, commodo a purus.',
  },
  {
    time: '00:00 - 00:00',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum. Curabitur ipsum mi, bibendum ut dictum non, commodo a purus.',
  },
  {
    time: '00:00 - 00:00',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum. Curabitur ipsum mi, bibendum ut dictum non, commodo a purus.',
  },
];

export function ProgramFlowModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Sticky pink header */}
        <div className="flex shrink-0 items-center justify-between bg-pink-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Program Flow</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white transition hover:opacity-70"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* Column headers */}
            <div className="mb-4 grid grid-cols-[120px_1fr] gap-4 border-b border-gray-100 pb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Date and Time
              </p>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Details</p>
            </div>
            {/* Rows */}
            <div className="flex flex-col divide-y divide-gray-100">
              {FLOW_ITEMS.map((item, i) => (
                <div key={i} className="grid grid-cols-[120px_1fr] gap-4 py-4 first:pt-0 last:pb-0">
                  <p className="text-sm text-gray-600">{item.time}</p>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Description Here</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

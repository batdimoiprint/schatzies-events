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
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            {/* Rows */}
            {FLOW_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`pb-6 ${i !== FLOW_ITEMS.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <p className="font-bold text-lg text-[#2d2834] leading-tight mb-3">DATE AND TIME</p>
                <div className="flex gap-4 items-start">
                  <p className="text-xs text-[#8a8697] shrink-0">{item.time}</p>
                  <div className="w-px bg-gray-200 self-stretch"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#2d2834] text-sm">Description Here</p>
                    <p className="text-xs leading-relaxed text-[#8a8697] mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

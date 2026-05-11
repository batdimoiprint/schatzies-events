import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  flow?: any[];
}

export function ProgramFlowModal({ onClose, flow = [] }: Props) {
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
            {flow.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-sm italic text-gray-400">No program flow scheduled yet.</p>
              </div>
            ) : (
              flow.map((item, i) => (
                <div
                  key={i}
                  className={`pb-6 ${i !== flow.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <p className="font-bold text-lg text-[#2d2834] leading-tight mb-3">
                    {item.title}
                  </p>
                  <div className="flex gap-4 items-start">
                    <div className="text-xs text-[#8a8697] shrink-0 w-16">
                      <p>{item.from}</p>
                      <p>{item.to}</p>
                    </div>
                    <div className="w-px bg-gray-200 self-stretch"></div>
                    <div className="flex-1">
                      <p className="text-xs leading-relaxed text-[#8a8697]">
                        {item.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

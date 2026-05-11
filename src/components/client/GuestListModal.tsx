import { X } from 'lucide-react';

interface Guest {
  name: string;
  status: string;
}

interface Props {
  onClose: () => void;
  guests?: Guest[];
  isLoading?: boolean;
}

export function GuestListModal({ onClose, guests = [], isLoading = false }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Sticky pink header */}
        <div className="flex shrink-0 items-center justify-between bg-pink-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Guest List</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white transition hover:opacity-70"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-3 overflow-y-auto p-6">
          {/* Header row */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-2">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Guest Name
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Status</span>
          </div>

          {/* Guest rows */}
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-[#696373]">
              Loading guests...
            </div>
          ) : guests.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-[#696373]">
              No guests found
            </div>
          ) : (
            guests.map((guest, i) => (
              <div
                key={`${guest.name}-${i}`}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm font-medium text-[#2d2834]">{guest.name}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ml-2 ${
                    guest.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : guest.status === 'Declined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {guest.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

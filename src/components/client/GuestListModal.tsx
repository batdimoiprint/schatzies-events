import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const GUESTS = [
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Sofia B. Villanueva', status: 'Confirmed' },
  { name: 'Mateo Sebastian', status: 'Confirmed' },
  { name: 'Beatriz "Bea" Lopez', status: 'Declined' },
  { name: 'Dr. Ricardo Gomez', status: 'Confirmed' },
  { name: 'Elena De Guzman', status: 'Confirmed' },
  { name: 'Javier San Pedro', status: 'Declined' },
  { name: 'Clara Isabel Torres', status: 'Confirmed' },
  { name: 'Marcus Aurelio Tan', status: 'Confirmed' },
];

export function GuestListModal({ onClose }: Props) {
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
          {GUESTS.map((guest, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-sm font-medium text-[#2d2834]">{guest.name}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ml-2 ${
                  guest.status === 'Confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {guest.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

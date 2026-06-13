import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  allocation?: any;
}

export function AllocationResourcesModal({ onClose, allocation }: Props) {
  const manpower = allocation?.manpower || [];
  const vendors = allocation?.vendors || [];
  const hasData = manpower.length > 0 || vendors.length > 0;

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
          {!hasData ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm italic text-gray-400">No resources allocated yet.</p>
            </div>
          ) : (
            <>
              {/* Vendors card */}
              {vendors.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                    <h3 className="text-base font-bold text-gray-800">Vendors</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {vendors.map((vendor: any, i: number) => (
                      <div key={i} className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-800">{vendor.name}</p>
                        {vendor.service && (
                          <p className="text-xs text-gray-500">{vendor.service}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manpower card */}
              {manpower.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                    <h3 className="text-base font-bold text-gray-800">Manpower</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {manpower.map((person: any, i: number) => (
                      <div key={i} className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-800">
                          {person.name || person.role}
                        </p>
                        {person.name && person.role && (
                          <p className="text-xs text-gray-500">{person.role}</p>
                        )}
                        {person.time && <p className="text-xs text-gray-400">{person.time}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

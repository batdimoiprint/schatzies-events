import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  allocation?: any;
}

export function ServiceRequirementsModal({ onClose, allocation }: Props) {
  const hasFood = !!allocation?.food_package;
  const hasFlow = !!allocation?.flow_type;
  const hasRequirements =
    hasFood || hasFlow || (allocation?.requirements && allocation.requirements.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Sticky pink header */}
        <div className="flex shrink-0 items-center justify-between bg-pink-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Service Requirements</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white transition hover:opacity-70"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          {!hasRequirements ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm italic text-gray-400">No service requirements specified yet.</p>
            </div>
          ) : (
            <>
              {/* Food card */}
              {hasFood && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-bold text-gray-800">Food</h3>
                  </div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    {allocation.food_package}
                  </p>
                </div>
              )}

              {/* Flow/Theme card */}
              {hasFlow && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <h3 className="text-lg font-bold text-gray-800">Flow Type</h3>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{allocation.flow_type}</p>
                </div>
              )}

              {/* Requirements list */}
              {allocation?.requirements && allocation.requirements.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <h3 className="text-lg font-bold text-gray-800">Other Requirements</h3>
                  </div>
                  <ul className="space-y-2">
                    {allocation.requirements.map((req: any, i: number) => (
                      <li key={i} className="text-sm text-gray-700">
                        {typeof req === 'string' ? req : req.label || req.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

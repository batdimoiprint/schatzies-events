import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function ServiceRequirementsModal({ onClose }: Props) {
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
          {/* Food card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <h3 className="text-lg font-bold text-gray-800">Food</h3>
            </div>
            <p className="mb-3 text-sm font-medium text-gray-700">Classic Buffet</p>
            <div className="pl-2">
              <p className="text-sm font-semibold text-gray-800">1. Appetizer</p>
              <p className="mb-3 text-xs leading-relaxed text-gray-500">
                1 light bite (e.g., finger foods, soup, or a fresh salad)
              </p>
              <p className="text-sm font-semibold text-gray-800">2. Main Course</p>
              <p className="mb-3 text-xs leading-relaxed text-gray-500">
                1 chicken dish (e.g., Cordon Bleu, Baked Chicken, or Garlic Parmesan Chicken)
              </p>
              <p className="text-sm font-semibold text-gray-800">3. Dessert</p>
              <p className="mb-3 text-xs leading-relaxed text-gray-500">
                1 to 2 sweet treats (e.g., Mango Bravo style cakes, panna cotta, or a chocolate
                fountain)
              </p>
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-800">Manpower</p>
            <p className="mb-1 text-xs leading-relaxed text-gray-500">
              (2) head of facilitating
              <br />
              (4) stand-by server of the dishes
              <br />
              (5) servers for the customers
            </p>
            <p className="mt-4 text-sm font-semibold text-gray-800">Resources</p>
            <p className="text-xs leading-relaxed text-gray-500">
              MCuisine for Main Course
              <br />
              KataBanas for Dessert
              <br />
              HomeOfAppetizer for Appetizer
            </p>
          </div>

          {/* Decorations card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <h3 className="text-lg font-bold text-gray-800">Decorations</h3>
            </div>
            <p className="mb-3 text-sm font-medium text-gray-700">Theme: Enchanted Forest</p>
            <p className="text-xs leading-relaxed text-gray-500">
              Heavy greenery, hanging vines, fairy lights, wood accents, and white or pastel
              flowers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

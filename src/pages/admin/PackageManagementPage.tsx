import { Package } from 'lucide-react';

export function PackageManagementPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f347a5] to-[#8f1fd1] text-white shadow-md">
          <Package className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#2d1b3d]">Package Management</h1>
          <p className="text-sm text-[#7f7889]">Create, edit, and manage event packages</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="rounded-2xl border border-[#ece7f2] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#fdf2f8]">
            <Package className="size-8 text-[#df2b80]" />
          </div>
          <h2 className="text-lg font-semibold text-[#2d1b3d]">Package Management</h2>
          <p className="mt-2 max-w-md text-sm text-[#7f7889]">
            Manage your event packages here. Create new packages, update pricing, and configure package details.
          </p>
        </div>
      </div>
    </div>
  );
}

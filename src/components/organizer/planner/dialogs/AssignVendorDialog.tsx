import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { Vendor, EventManagerVendor } from '@/api/vendors';

interface AssignVendorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vendorPool: Vendor[];
  eventVendors: EventManagerVendor[];
  isAssigningVendor: boolean;
  handleAssignVendor: (id: string) => void;
}

export function AssignVendorDialog({
  isOpen,
  onOpenChange,
  vendorPool,
  eventVendors,
  isAssigningVendor,
  handleAssignVendor,
}: AssignVendorDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isAssigningVendor) onOpenChange(open);
        onOpenChange(open);
      }}
    >
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="fixed left-[50%] top-[50%] z-[100000] w-full max-w-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e3dfea] bg-[#fbfafd] p-0 shadow-2xl sm:max-w-[560px] overflow-hidden flex flex-col max-h-[85vh]"
      >
        <DialogTitle className="sr-only">Assign Vendor</DialogTitle>
        <header className="flex items-center justify-between border-b border-[#eee9f2] bg-white px-5 py-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-[#1f1f21]">Assign Vendor</h3>
            <p className="text-[11px] font-semibold text-[#8b84a0]">
              Select a vendor from the active pool
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isAssigningVendor}
            className="inline-flex size-8 items-center justify-center rounded-full text-[#9f97ad] transition hover:bg-[#f3eff8] disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin]">
          <div className="space-y-3">
            {vendorPool.length > 0 ? (
              vendorPool.map((vendor) => {
                const isAssigned =
                  Array.isArray(eventVendors) && eventVendors.some((ev) => ev.id === vendor.id);
                return (
                  <article
                    key={vendor.id}
                    className="flex items-center justify-between rounded-xl border border-[#e3deeb] bg-white p-3 shadow-sm"
                  >
                    <div>
                      <p className="text-[14px] font-black text-[#2f2b39]">{vendor.name}</p>
                      <p className="text-[11px] font-semibold text-[#6f687f]">
                        {vendor.serviceType || 'Service not specified'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAssignVendor(vendor.id)}
                      disabled={isAssigned || isAssigningVendor}
                      className={`inline-flex h-8 items-center justify-center rounded-lg px-3 text-[11px] font-bold transition ${isAssigned ? 'bg-[#f4f1f8] text-[#9f97ad] cursor-not-allowed' : 'bg-[#eef5ff] text-[#2a6fb0] hover:bg-[#e0efff] border border-[#d6e8ff]'}`}
                    >
                      {isAssigned ? 'Assigned' : 'Assign'}
                    </button>
                  </article>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-[#d8d2e2] bg-white/60 p-8 text-center text-sm font-semibold text-[#8b84a0]">
                No active vendors found in the pool.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

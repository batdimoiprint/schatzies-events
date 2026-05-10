import { Plus, Trash2 } from 'lucide-react';
import type { EventManagerVendor } from '@/api/vendors';

interface VendorsTabProps {
  eventVendors: EventManagerVendor[];
  isAssigningVendor: boolean;
  handleOpenAssignVendorModal: () => void;
  handleUnassignVendor: (id: string) => void;
}

export function VendorsTab({ eventVendors, isAssigningVendor, handleOpenAssignVendorModal, handleUnassignVendor }: VendorsTabProps) {
  return (
    <section className="rounded-2xl border border-[#ddd8e8] bg-[#fbfafd] p-4 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h3 className="text-lg font-black tracking-tight text-[#1f1f21]">Event Vendors</h3><p className="text-xs font-semibold text-[#6e687d]">Vendors currently assigned to this event</p></div>
        <button type="button" onClick={handleOpenAssignVendorModal} disabled={isAssigningVendor} className="inline-flex h-9 items-center gap-2 rounded-lg bg-linear-to-r from-[#f1589e] via-[#d735b3] to-[#8a1fd0] px-4 text-[11px] font-black text-white shadow-[0_10px_20px_rgba(125,31,186,0.24)] transition hover:brightness-105 disabled:opacity-50"><Plus className="size-3.5" />Assign from Pool</button>
      </header>
      <div className="space-y-3">
        {Array.isArray(eventVendors) && eventVendors.length > 0 ? eventVendors.map((vendor) => (
          <article key={vendor.id} className="flex items-center justify-between rounded-xl border border-[#e3deeb] bg-white p-3 shadow-sm">
            <div><p className="text-[14px] font-black text-[#2f2b39]">{vendor.name}</p><p className="text-[11px] font-semibold text-[#6f687f]">{vendor.service || 'Service not specified'}</p></div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${vendor.status === 'Active' ? 'bg-[#e6f4e8] text-[#2e6b37]' : 'bg-[#f4e6e6] text-[#b53e3e]'}`}>{vendor.status}</span>
                <div className="mt-1 flex items-center justify-end gap-2 text-[10px] text-[#8c8598]">{vendor.email !== '-' && <span>{vendor.email}</span>}{vendor.phone !== '-' && <span>{vendor.phone}</span>}</div>
              </div>
              <button type="button" onClick={() => handleUnassignVendor(vendor.id)} className="inline-flex size-8 items-center justify-center rounded-md border border-[#e1d8ef] bg-white text-[#7b6f90] transition hover:border-[#f1589e] hover:text-[#f1589e]" aria-label="Unassign vendor"><Trash2 className="size-3.5" /></button>
            </div>
          </article>
        )) : (<div className="rounded-lg border border-dashed border-[#d8d2e2] bg-white/60 p-8 text-center text-sm font-semibold text-[#8b84a0]">No vendors assigned to this event yet.</div>)}
      </div>
    </section>
  );
}
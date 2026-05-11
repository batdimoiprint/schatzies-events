import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getVendors, type EventManagerVendor, type Vendor } from '@/api/vendors';
import { Card, CardContent } from '@/components/ui/card';

/** Consistent color palette for any service type — cycles if more types exist */
const TYPE_PALETTE = [
  '#7a0bc0', '#ec89be', '#5dbac0', '#f39c12', '#e74c3c',
  '#27ae60', '#2980b9', '#8e44ad', '#d35400', '#1abc9c',
];

function getTypeColor(index: number): string {
  return TYPE_PALETTE[index % TYPE_PALETTE.length];
}

const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const peso = (v: number) => `Php ${fmt.format(v)}`;

interface VendorsTabProps {
  eventVendors: EventManagerVendor[];
  isAssigningVendor: boolean;
  handleOpenAssignVendorModal: (serviceType?: string) => void;
  handleUnassignVendor: (id: string) => void;
}

export function VendorsTab({ eventVendors, isAssigningVendor, handleOpenAssignVendorModal, handleUnassignVendor }: VendorsTabProps) {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    getVendors().then((v) => setAllVendors(v)).catch(() => setAllVendors([]));
  }, []);

  // Discover all unique service types from the entire vendor pool
  const allServiceTypes = useMemo(() => {
    const typeSet = new Set<string>();
    for (const v of allVendors) {
      const st = (v.serviceType || '').trim();
      if (st) typeSet.add(st);
    }
    // Also include service types from already-assigned vendors
    for (const v of eventVendors) {
      const st = (v.service || '').trim();
      if (st && st !== '-') typeSet.add(st);
    }
    // Sort alphabetically for consistency
    return Array.from(typeSet).sort((a, b) => a.localeCompare(b));
  }, [allVendors, eventVendors]);

  // Map service type to a stable color based on sorted index
  const typeColorMap = useMemo(() => {
    const m: Record<string, string> = {};
    allServiceTypes.forEach((t, i) => { m[t.toLowerCase()] = getTypeColor(i); });
    return m;
  }, [allServiceTypes]);

  // Group assigned vendors by service type (one per category)
  const assignedByType = useMemo(() => {
    const m: Record<string, EventManagerVendor | null> = {};
    for (const t of allServiceTypes) m[t] = null;
    for (const v of eventVendors) {
      const normalized = allServiceTypes.find((t) => t.toLowerCase() === (v.service || '').toLowerCase());
      if (normalized && !m[normalized]) {
        m[normalized] = v;
      }
    }
    return m;
  }, [eventVendors, allServiceTypes]);

  // Group available vendors by service type (active only, not already assigned)
  const poolByType = useMemo(() => {
    const assignedIds = new Set(eventVendors.map((v) => v.id));
    const m: Record<string, Vendor[]> = {};
    for (const t of allServiceTypes) m[t] = [];
    for (const v of allVendors) {
      if (assignedIds.has(v.id)) continue;
      if (String(v.status || v.availabilityStatus || '').toLowerCase() !== 'active') continue;
      const n = allServiceTypes.find((t) => t.toLowerCase() === (v.serviceType || '').toLowerCase());
      if (n) m[n].push(v);
    }
    return m;
  }, [allVendors, eventVendors, allServiceTypes]);

  return (
    <section className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#eadfec] bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-lg font-black tracking-tight text-[#1f1f21]">Event Vendor Slots</h3>
          <p className="text-xs font-semibold text-[#6e687d]">One vendor per service category — no duplicates on the same event date</p>
        </div>
        <div className="text-xs font-semibold text-[#8b8199]">
          {allServiceTypes.length} service type{allServiceTypes.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Service Category Slots — dynamically generated from vendor pool */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allServiceTypes.map((type) => {
          const assigned = assignedByType[type];
          const color = typeColorMap[type.toLowerCase()] || '#8f23cf';
          const pool = poolByType[type] || [];
          const isExpanded = expandedCategory === type;
          const isFilled = !!assigned;

          return (
            <Card key={type} className="border-[#e7dfef] bg-white py-0 shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#ece6f3]" style={{ borderLeftWidth: 4, borderLeftColor: color }}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-lg text-white text-[11px] font-black" style={{ backgroundColor: color }}>
                    {type.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest" style={{ color }}>{type}</p>
                    <p className="text-[10px] font-semibold text-[#8b8199]">
                      {isFilled ? '1 vendor assigned' : 'No vendor assigned'}
                    </p>
                  </div>
                </div>
                {isFilled && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f4e8] px-3 py-1 text-[10px] font-bold text-[#2e6b37] uppercase">
                    <span className="size-1.5 rounded-full bg-[#2ec24f]" />Active
                  </span>
                )}
              </div>

              <CardContent className="px-0 py-0">
                {/* Assigned Vendor */}
                {assigned ? (
                  <div className="flex items-center justify-between px-5 py-4 bg-[#f8fdf9]">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-black text-[#2f2b39]">{assigned.name}</p>
                      <p className="text-[11px] font-semibold text-[#6f687f] mt-0.5">{assigned.service || 'Service not specified'}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-[#8c8598]">
                        {assigned.email !== '-' && <span>{assigned.email}</span>}
                        {assigned.phone !== '-' && <span>{assigned.phone}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setExpandedCategory(isExpanded ? null : type)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e1d8ef] bg-white px-3 text-[10px] font-bold text-[#6f687f] transition hover:border-[#8f1fd1] hover:text-[#8f1fd1]"
                      >
                        Replace {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnassignVendor(assigned.id)}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-[#e1d8ef] bg-white text-[#7b6f90] transition hover:border-[#f1589e] hover:text-[#f1589e]"
                        aria-label="Unassign vendor"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty Slot */
                  <div className="px-5 py-6 text-center">
                    <div className="inline-flex size-10 items-center justify-center rounded-full border-2 border-dashed border-[#d8d2e2] bg-[#fbfafd] mb-2">
                      <Plus className="size-4 text-[#9f97ad]" />
                    </div>
                    <p className="text-[11px] font-semibold text-[#8b84a0] mb-3">No {type.toLowerCase()} vendor assigned</p>
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedCategory(isExpanded ? null : type);
                      }}
                      disabled={isAssigningVendor}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-linear-to-r from-[#f1589e] via-[#d735b3] to-[#8a1fd0] px-4 text-[11px] font-black text-white shadow-[0_6px_14px_rgba(125,31,186,0.2)] transition hover:brightness-105 disabled:opacity-50"
                    >
                      <Plus className="size-3.5" />Assign {type} Vendor
                    </button>
                  </div>
                )}

                {/* Expandable Available Vendors Pool */}
                {isExpanded && (
                  <div className="border-t border-[#ece6f3] bg-[#fbfafd]">
                    <div className="px-5 py-3 flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#7a7186]">
                        Available {type} Vendors
                        <span className="ml-2 text-[10px] font-semibold normal-case text-[#8b8199]">({pool.length})</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpandedCategory(null)}
                        className="text-[10px] font-bold text-[#8f1fd1] hover:underline"
                      >
                        Collapse
                      </button>
                    </div>
                    <div className="max-h-[240px] overflow-y-auto px-2 pb-3 [scrollbar-width:thin]">
                      {pool.length === 0 ? (
                        <div className="px-3 py-6 text-center text-xs font-semibold text-[#b0a8be]">
                          No available {type.toLowerCase()} vendors in the pool
                        </div>
                      ) : pool.map((vendor, i) => (
                        <div
                          key={vendor.id}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm mb-1.5 transition ${
                            i % 2 === 0 ? 'bg-white' : 'bg-[#f8f5fb]'
                          } border border-[#eee9f3] hover:border-[#d4c9e4] hover:shadow-sm`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#2f2939] truncate">{vendor.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {vendor.contactPerson && (
                                <span className="text-[10px] text-[#8c8598]">{vendor.contactPerson}</span>
                              )}
                              {vendor.price != null && (
                                <span className="text-[10px] font-bold text-[#8f23cf]">{peso(vendor.price)}</span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenAssignVendorModal(vendor.id)}
                            disabled={isAssigningVendor || isFilled}
                            className={`inline-flex h-8 items-center justify-center rounded-lg px-4 text-[11px] font-bold transition ${
                              isFilled
                                ? 'bg-[#f4f1f8] text-[#9f97ad] cursor-not-allowed'
                                : 'bg-[#eef5ff] text-[#2a6fb0] hover:bg-[#e0efff] border border-[#d6e8ff]'
                            }`}
                          >
                            {isFilled ? 'Slot Filled' : 'Assign'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allServiceTypes.length === 0 && (
        <div className="rounded-2xl border border-[#eadfec] bg-white px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#8b8199]">No vendors found in the pool. Add vendors first to assign them to events.</p>
        </div>
      )}
    </section>
  );
}
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Download, RefreshCw } from 'lucide-react';
import { getEvents } from '@/api/events';
import { getVendors, getVendorEntitiesByEventId, type Vendor } from '@/api/vendors';
import {
  getCostBreakdown,
  createCostBreakdown,
  updateCostBreakdown,
  type CostBreakdownResponse,
} from '@/api/cost-breakdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SERVICE_TYPES = ['Catering', 'Styling', 'Media', 'Venue'] as const;
const SERVICE_COLORS: Record<string, string> = {
  Catering: '#7a0bc0', Styling: '#ec89be', Media: '#5dbac0', Venue: '#f39c12',
};

const fmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
const peso = (v: number) => fmt.format(v);

function calcPkgPrice(pkg: string, type: string, pax: number): number {
  const p = pkg.trim().toLowerCase(), t = type.trim().toLowerCase();
  if (t === 'wedding') {
    if (p === 'blooms') return pax <= 50 ? 200000 : pax <= 100 ? 235000 : pax <= 150 ? 277500 : 320000;
    if (p === 'fascinating') return pax <= 100 ? 295000 : pax <= 150 ? 342500 : 390000;
    if (p === 'windy') return pax <= 100 ? 420000 : pax <= 150 ? 480000 : 540000;
    if (p === 'de luxe') return pax <= 100 ? 520000 : pax <= 150 ? 585000 : 650000;
    if (p === 'grandezza') return pax <= 100 ? 780000 : pax <= 150 ? 870000 : 960000;
  } else if (t === 'debut') {
    if (p === 'charming') return pax <= 100 ? 200000 : pax <= 150 ? 242500 : 285000;
    if (p === 'irresistible') return pax <= 100 ? 295000 : pax <= 150 ? 342500 : 390000;
    if (p === 'elegancia') return pax <= 100 ? 495000 : pax <= 150 ? 555000 : 615000;
    if (p === 'flawless') return pax <= 100 ? 395000 : pax <= 150 ? 445000 : 495000;
    if (p === 'grandiosa') return pax <= 100 ? 595000 : pax <= 150 ? 670000 : 745000;
  }
  return 0;
}

interface CostBreakdownTabProps {
  selectedEventId: string;
}

export function CostBreakdownTab({ selectedEventId }: CostBreakdownTabProps) {
  const [apiEvents, setApiEvents] = useState<any[]>([]);
  const [eventVendors, setEventVendors] = useState<Vendor[]>([]);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [breakdown, setBreakdown] = useState<CostBreakdownResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const ev = useMemo(() => apiEvents.find((e) => String(e?.id) === selectedEventId) ?? null, [apiEvents, selectedEventId]);
  const evName = String(ev?.title ?? 'Unknown Event');
  const evPkg = String(ev?.eventPackage ?? 'No package');
  const evType = String(ev?.eventType ?? 'Unknown');
  const evPax = Number(ev?.eventPax ?? 0);
  const pkgInitial = Number(ev?.packageInitialAmount ?? 0);
  const computedPkg = calcPkgPrice(evPkg, evType, evPax);
  const packagePrice = pkgInitial > 0 ? pkgInitial : computedPkg;

  // Use backend breakdown if available, else compute locally
  const organizerShare = breakdown?.organizerShare ?? packagePrice * 0.2;
  const vendorBudget = breakdown?.vendorBudget ?? packagePrice * 0.8;
  const totalVendorCost = breakdown?.totalVendorCost ?? eventVendors.reduce((s, v) => s + (v.price ?? 0), 0);
  const vendorBalance = vendorBudget - totalVendorCost;
  const organizerTotal = organizerShare + Math.max(0, vendorBalance);

  const poolByType = useMemo(() => {
    const m: Record<string, Vendor[]> = {};
    for (const t of SERVICE_TYPES) m[t] = [];
    for (const v of allVendors) {
      const n = SERVICE_TYPES.find((t) => t.toLowerCase() === (v.serviceType || '').toLowerCase());
      if (n) m[n].push(v);
    }
    return m;
  }, [allVendors]);

  const chartSegments = useMemo(() => {
    const total = totalVendorCost || 1;
    const r = 62, c = 2 * Math.PI * r;
    let cum = 0;
    return eventVendors.filter((v) => (v.price ?? 0) > 0).map((v) => {
      const cost = v.price ?? 0, pct = (cost / total) * 100;
      const sl = (pct / 100) * c, da = `${sl} ${Math.max(c - sl, 0)}`, doff = -((cum / 100) * c);
      cum += pct;
      const nt = SERVICE_TYPES.find((t) => t.toLowerCase() === (v.serviceType || '').toLowerCase());
      return { id: v.id, name: v.name, type: nt || v.serviceType, cost, pct, da, doff, color: SERVICE_COLORS[nt || ''] || '#8f23cf' };
    });
  }, [eventVendors, totalVendorCost]);

  const [hovId, setHovId] = useState<string | null>(null);
  const hovSeg = chartSegments.find((s) => s.id === hovId) ?? null;

  useEffect(() => {
    getEvents().then((r) => { const a = Array.isArray(r) ? r : []; setApiEvents(a); }).catch(() => setApiEvents([]));
    getVendors().then((v) => setAllVendors(v)).catch(() => setAllVendors([]));
  }, []);

  useEffect(() => {
    if (!selectedEventId) { setEventVendors([]); setBreakdown(null); return; }
    getVendorEntitiesByEventId(selectedEventId).then(setEventVendors).catch(() => setEventVendors([]));
    getCostBreakdown(selectedEventId).then(setBreakdown).catch(() => setBreakdown(null));
  }, [selectedEventId]);

  const handleSave = async () => {
    if (!selectedEventId || packagePrice <= 0) return;
    setIsSaving(true);
    const payload = { packagePrice, eventPax: evPax, additionalCharges: 0 };
    try {
      if (breakdown) { await updateCostBreakdown(selectedEventId, payload); }
      else { await createCostBreakdown(selectedEventId, payload); }
      const fresh = await getCostBreakdown(selectedEventId);
      setBreakdown(fresh);
    } catch (e: any) {
      if (e.response?.status === 404) { await createCostBreakdown(selectedEventId, payload); const fresh = await getCostBreakdown(selectedEventId); setBreakdown(fresh); }
    } finally { setIsSaving(false); }
  };

  const handleRefresh = async () => {
    if (!selectedEventId) return;
    const [v, b] = await Promise.all([
      getVendorEntitiesByEventId(selectedEventId).catch(() => []),
      getCostBreakdown(selectedEventId).catch(() => null),
    ]);
    setEventVendors(v); setBreakdown(b);
  };

  const handleCsv = () => {
    const rows = [
      ['Cost Breakdown', evName], ['Package Price', String(packagePrice)],
      ['Organizer 20%', String(organizerShare)], ['Vendor Budget 80%', String(vendorBudget)],
      [], ['Assigned Vendors'], ['Service Type', 'Vendor Name', 'Price'],
      ...eventVendors.map((v) => [v.serviceType, v.name, String(v.price ?? 0)]),
      [], ['Total Vendor Cost', String(totalVendorCost)], ['Remaining', String(vendorBalance)],
      ['Organizer Total', String(organizerTotal)],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${evName.toLowerCase().replace(/\s+/g, '-')}-cost-breakdown.csv`;
    a.click(); setExportOpen(false);
  };

  if (!selectedEventId) {
    return (
      <section className="rounded-2xl border border-[#ddd8e8] bg-white px-4 py-10 text-center">
        <p className="text-sm font-semibold text-[#7c748f]">Select an event to view the cost breakdown.</p>
      </section>
    );
  }

  return (
    <section className="max-w-full space-y-6 pb-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl border border-[#eadfec] bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <p className="text-lg font-black text-[#2d2834]">{evName}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-semibold text-[#4d4454]">{evPkg}</p>
              <span className="rounded-full border border-[#eadcf6] bg-[#f8f1fd] px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-[#8f23cf]">{evType}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" className="rounded-full border-[#e4d9ef] px-4 font-bold text-[#8f1fd1] hover:bg-[#faf6fd]">
            <RefreshCw className="size-4 mr-1" /> Refresh
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-full bg-white border border-[#e4d9ef] text-[#8f1fd1] px-5 font-bold shadow-sm hover:bg-[#faf6fd] disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <div className="relative">
            <Button onClick={() => setExportOpen((o) => !o)} className="rounded-full bg-gradient-to-r from-[#f34da7] to-[#8f1fd1] px-5 text-white hover:opacity-95">
              Export <ChevronDown className="size-4" />
            </Button>
            {exportOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-2xl border border-[#eadfec] bg-white shadow-lg">
                <button type="button" onClick={handleCsv} className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-[#4a4157] hover:bg-[#faf6fd]">
                  <Download className="size-4 text-[#8f1fd1]" /> Export CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="overflow-hidden rounded-2xl border border-[#e7dfef] bg-white shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-4 lg:gap-y-0 lg:divide-x divide-[#ece6f3]">
          {[
            { label: 'Package Price', value: packagePrice, color: '#8f23cf', sub: `${evPax} pax` },
            { label: 'Organizer (20%)', value: organizerShare, color: '#5dbac0' },
            { label: 'Vendor Budget (80%)', value: vendorBudget, color: '#f34da7' },
            { label: 'Vendor Costs', value: totalVendorCost, color: '#e2b020' },
            { label: 'Remaining Budget', value: vendorBalance, color: '#29bf4c', highlight: true },
          ].map((c) => (
            <div key={c.label} className="p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#7a7186]">
                <span className="size-2.5 shrink-0 rounded-full ring-2" style={{ backgroundColor: c.color, boxShadow: `0 0 0 2px ${c.color}22` }} />
                {c.label}
              </p>
              <p className={`mt-4 text-3xl lg:text-4xl font-black tracking-tight ${c.highlight && c.value < 0 ? 'text-[#c03560]' : 'text-[#2d2834]'}`}>
                {peso(c.value)}
              </p>
              {c.sub && <p className="mt-1 text-xs font-semibold text-[#898299]">{c.sub}</p>}
              {c.highlight && c.value > 0 && <p className="mt-1 text-[10px] font-semibold text-[#898299]">Goes back to organizer</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Organizer Total Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#8f1fd1] to-[#f34da7] px-6 py-4 text-white shadow-[0_10px_24px_rgba(165,44,180,0.25)]">
        <div>
          <p className="text-sm font-semibold opacity-80">Organizer Total Earnings</p>
          <p className="text-xs opacity-60">20% cut + leftover vendor budget</p>
        </div>
        <p className="text-3xl font-black">{peso(organizerTotal)}</p>
      </div>

      {/* Chart + Assigned Vendors */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-4">
        <Card className="border-[#e7dfef] bg-white py-0 shadow-sm">
          <CardContent className="flex h-full flex-col px-5 py-5">
            <p className="text-sm font-black uppercase tracking-widest text-[#7a7186] mb-4">Cost Distribution</p>
            <div className="flex flex-1 items-start justify-center pt-1">
              <div className="relative size-52">
                <svg viewBox="0 0 160 160" className="size-full -rotate-90">
                  <circle cx="80" cy="80" r="62" fill="none" stroke="#f0e9f7" strokeWidth="32" />
                  {chartSegments.map((s) => (
                    <circle key={s.id} cx="80" cy="80" r="62" fill="none" stroke={s.color} strokeWidth="32"
                      strokeDasharray={s.da} strokeDashoffset={s.doff}
                      className="cursor-pointer transition-opacity duration-150"
                      opacity={hovId && hovId !== s.id ? 0.35 : 1}
                      onMouseEnter={() => setHovId(s.id)} onMouseLeave={() => setHovId(null)} />
                  ))}
                </svg>
                <div className="pointer-events-none absolute inset-[40px] rounded-full bg-white ring-1 ring-[#eee5f6]" />
                {hovSeg && (
                  <div className="pointer-events-none absolute -bottom-1 left-1/2 min-w-[200px] -translate-x-1/2 translate-y-full rounded-2xl border border-[#efe4f8] bg-white px-4 py-3 text-center shadow-lg z-10">
                    <p className="text-sm font-bold text-[#2d2834]">{hovSeg.type}</p>
                    <p className="text-xs text-[#6f6780]">{hovSeg.name}</p>
                    <p className="mt-2 text-sm font-bold text-[#8f1fd1]">{peso(hovSeg.cost)}</p>
                    <p className="text-xs text-[#6f6780]">{hovSeg.pct.toFixed(1)}%</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {chartSegments.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs text-[#70687e]">
                  <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="flex-1 truncate">{s.name}</span>
                  <span className="font-semibold">{peso(s.cost)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#ff5b9f] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,91,159,0.3)]">
              <span>Total Vendor Cost</span><span>{peso(totalVendorCost)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Vendors Table */}
        <Card className="border-[#e7dfef] bg-white py-0 shadow-sm">
          <CardContent className="h-full px-0 py-0">
            <div className="overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-r from-[#ff66a7] to-[#ff4b97] px-6 py-4 text-sm font-semibold text-white">
                <div className="grid grid-cols-3 gap-4"><span>Service Type</span><span>Vendor Name</span><span className="text-right">Price</span></div>
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {eventVendors.length === 0 ? (
                  <div className="px-6 py-12 text-center text-sm font-semibold text-[#8b8199]">No vendors assigned to this event yet.</div>
                ) : eventVendors.map((v, i) => (
                  <div key={v.id} className={`grid grid-cols-3 gap-4 px-6 py-3.5 text-sm border-b border-[#f3edf8] ${i % 2 === 0 ? 'bg-[#fff4f8]' : 'bg-white'} hover:bg-[#fcf9ff]`}>
                    <span className="font-medium text-[#2f2939]">{v.serviceType || '-'}</span>
                    <span className="text-[#2f2939]">{v.name}</span>
                    <span className="text-right font-bold text-[#2f2939]">{v.price != null ? peso(v.price) : '—'}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-[#ece6f3] bg-[#faf7fd] px-6 py-3 space-y-1.5">
                <div className="flex justify-between text-sm"><span className="font-semibold text-[#6f6780]">Vendor Budget (80%)</span><span className="font-bold text-[#2d2834]">{peso(vendorBudget)}</span></div>
                <div className="flex justify-between text-sm"><span className="font-semibold text-[#6f6780]">Total Vendor Cost</span><span className="font-bold text-[#2d2834]">{peso(totalVendorCost)}</span></div>
                <div className="flex justify-between text-sm border-t border-[#ece6f3] pt-1.5">
                  <span className="font-bold text-[#4a4157]">Remaining</span>
                  <span className={`font-black ${vendorBalance >= 0 ? 'text-[#29bf4c]' : 'text-[#c03560]'}`}>{peso(vendorBalance)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Vendors Pool */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-[#4a4157]">
          Available Vendors <span className="text-sm font-semibold text-[#8b8199]">(prices may vary)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_TYPES.map((type) => {
            const vendors = poolByType[type] || [];
            const color = SERVICE_COLORS[type];
            return (
              <Card key={type} className="border-[#e7dfef] bg-white py-0 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ece6f3]" style={{ borderLeftWidth: 4, borderLeftColor: color }}>
                  <p className="text-sm font-black uppercase tracking-widest" style={{ color }}>{type}</p>
                  <p className="text-xs text-[#8b8199]">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''}</p>
                </div>
                <CardContent className="px-0 py-0">
                  <div className="max-h-[280px] overflow-y-auto">
                    {vendors.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs font-semibold text-[#b0a8be]">No vendors in this category</div>
                    ) : vendors.map((v, i) => {
                      const assigned = eventVendors.some((ev) => ev.id === v.id);
                      return (
                        <div key={v.id} className={`flex items-center justify-between px-4 py-2.5 text-sm border-b border-[#f6f2fa] last:border-b-0 ${assigned ? 'bg-[#f0fdf4]' : i % 2 === 0 ? 'bg-white' : 'bg-[#fcf9ff]'}`}>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#2f2939] truncate">{v.name}</p>
                            {assigned && <span className="text-[10px] font-bold text-[#29bf4c] uppercase">Assigned</span>}
                          </div>
                          <span className="shrink-0 font-bold text-[#2f2939]">{v.price != null ? peso(v.price) : '—'}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

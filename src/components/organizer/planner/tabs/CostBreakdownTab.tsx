import { useEffect, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getEvents } from '@/api/events';
import { getVendorEntitiesByEventId, type Vendor } from '@/api/vendors';
import { getCostBreakdown, type CostBreakdownResponse } from '@/api/cost-breakdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBusinessContact } from '@/hooks/useBusinessContact';

/** jsPDF augmented by the autotable plugin (not in the base typings). */
interface AutoTableDoc {
  lastAutoTable: { finalY: number };
  internal: { getNumberOfPages: () => number };
}

/** Consistent color palette for any service type — cycles if more types exist */
const TYPE_PALETTE = [
  '#7a0bc0',
  '#ec89be',
  '#5dbac0',
  '#f39c12',
  '#e74c3c',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
  '#d35400',
  '#1abc9c',
];

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getServiceColor(serviceType: string): string {
  const normalized = serviceType.trim().toLowerCase();
  // Keep standard colors for backward compatibility
  if (normalized === 'catering') return '#7a0bc0';
  if (normalized === 'styling') return '#ec89be';
  if (normalized === 'media') return '#5dbac0';
  if (normalized === 'venue') return '#f39c12';

  const hash = stringToHash(normalized);
  return TYPE_PALETTE[hash % TYPE_PALETTE.length];
}

const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const peso = (v: number) => `Php ${fmt.format(v)}`;

function calcPkgPrice(pkg: string, type: string, pax: number): number {
  const p = pkg.trim().toLowerCase(),
    t = type.trim().toLowerCase();
  if (t === 'wedding') {
    if (p === 'blooms')
      return pax <= 50 ? 200000 : pax <= 100 ? 235000 : pax <= 150 ? 277500 : 320000;
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
  const [apiEvents, setApiEvents] = useState<Awaited<ReturnType<typeof getEvents>>>([]);
  const [eventVendors, setEventVendors] = useState<Vendor[]>([]);
  const [breakdown, setBreakdown] = useState<CostBreakdownResponse | null>(null);
  const { data: bizContact } = useBusinessContact();

  const ev = useMemo(
    () => apiEvents.find((e) => String(e?.id) === selectedEventId) ?? null,
    [apiEvents, selectedEventId]
  );
  const evName = String(ev?.title ?? 'Unknown Event');
  const evPkg = String(ev?.eventPackageKey || ev?.eventPackage || 'Custom Package');
  const evType = String(ev?.eventType ?? 'Unknown');
  const evPax = Number(ev?.eventPax ?? 0);
  const pkgInitial = Number(ev?.packageInitialAmount ?? 0);
  const computedPkg = calcPkgPrice(evPkg, evType, evPax);
  const packagePrice = pkgInitial > 0 ? pkgInitial : computedPkg;

  const organizerShare = breakdown?.organizerShare ?? packagePrice * 0.2;
  const vendorBudget = breakdown?.vendorBudget ?? packagePrice * 0.8;
  const totalVendorCost =
    breakdown?.totalVendorCost ?? eventVendors.reduce((s, v) => s + (v.price ?? 0), 0);
  const vendorBalance = vendorBudget - totalVendorCost;
  const organizerTotal = organizerShare + Math.max(0, vendorBalance);

  const chartSegments = useMemo(() => {
    const total = totalVendorCost || 1;
    const r = 62,
      c = 2 * Math.PI * r;
    let cum = 0;
    return eventVendors
      .filter((v) => (v.price ?? 0) > 0)
      .map((v) => {
        const cost = v.price ?? 0,
          pct = (cost / total) * 100;
        const sl = (pct / 100) * c,
          da = `${sl} ${Math.max(c - sl, 0)}`,
          doff = -((cum / 100) * c);
        // eslint-disable-next-line react-hooks/immutability -- accumulator for donut segment offsets
        cum += pct;
        const st = v.serviceType || 'Unknown';
        return {
          id: v.id,
          name: v.name,
          type: st,
          cost,
          pct,
          da,
          doff,
          color: getServiceColor(st),
        };
      });
  }, [eventVendors, totalVendorCost]);

  const [hovId, setHovId] = useState<string | null>(null);
  const hovSeg = chartSegments.find((s) => s.id === hovId) ?? null;

  useEffect(() => {
    getEvents()
      .then((r) => {
        const a = Array.isArray(r) ? r : [];
        setApiEvents(a);
      })
      .catch(() => setApiEvents([]));
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      setEventVendors([]);
      setBreakdown(null);
      return;
    }
    getVendorEntitiesByEventId(selectedEventId)
      .then(setEventVendors)
      .catch(() => setEventVendors([]));
    getCostBreakdown(selectedEventId)
      .then(setBreakdown)
      .catch(() => setBreakdown(null));
  }, [selectedEventId]);

  const handlePdf = () => {
    if (!selectedEventId) return;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header section
    // Company Name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#8f1fd1');
    doc.text('SCHATZIES EVENTS MANAGEMENT', 14, 24);

    // Company Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#666666');
    const bizAddr = bizContact?.addresses?.[0];
    const addrText = bizAddr
      ? [bizAddr.street, bizAddr.barangay, bizAddr.city, bizAddr.province].filter(Boolean).join(', ')
      : '';
    const phoneText = (bizContact?.phones ?? []).map((p) => p.number).join(' / ');
    const emailText = bizContact?.emails?.[0]?.email ?? '';
    if (addrText) doc.text(addrText, 14, 32);
    const contactLine = [phoneText && `Phone: ${phoneText}`, emailText && `Email: ${emailText}`]
      .filter(Boolean)
      .join(' | ');
    if (contactLine) doc.text(contactLine, 14, 38);

    // Divider line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(14, 44, pageWidth - 14, 44);

    // Document Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#333333');
    doc.text('Cost Breakdown Report', 14, 56);

    // Date of report
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${currentDate}`, pageWidth - 14, 56, { align: 'right' });

    // Event Details box
    doc.setFillColor(255, 240, 245); // Light pink background
    doc.roundedRect(14, 62, pageWidth - 28, 36, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2d2834');
    doc.text('Event Information', 20, 72);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#4a4157');
    doc.text(`Event Name: ${evName}`, 20, 80);
    doc.text(`Event Type: ${evType}`, 20, 86);

    doc.text(`Package: ${evPkg}`, pageWidth / 2, 80);
    doc.text(`Pax: ${evPax}`, pageWidth / 2, 86);

    let currentY = 106;

    // Summary block (AutoTable)
    autoTable(doc, {
      startY: currentY,
      head: [['Budget Summary', 'Amount']],
      body: [
        ['Total Package Price', peso(packagePrice)],
        ['Organizer Share (20%)', peso(organizerShare)],
        ['Vendor Budget Allocation (80%)', peso(vendorBudget)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [143, 31, 209], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [250, 248, 252] },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as unknown as AutoTableDoc).lastAutoTable.finalY + 12;

    // Vendors Breakdown
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#333333');
    doc.text('Vendor Cost Breakdown', 14, currentY);

    currentY += 6;

    const vendorBody =
      eventVendors.length > 0
        ? eventVendors.map((v) => [v.serviceType || '-', v.name, peso(v.price ?? 0)])
        : [['-', 'No vendors assigned', '-']];

    autoTable(doc, {
      startY: currentY,
      head: [['Service Type', 'Vendor Name', 'Assigned Price']],
      body: vendorBody,
      theme: 'grid',
      headStyles: { fillColor: [243, 77, 167], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [255, 244, 248] },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as unknown as AutoTableDoc).lastAutoTable.finalY + 12;

    // Totals & Balances
    autoTable(doc, {
      startY: currentY,
      body: [
        ['Total Assigned Vendor Cost', peso(totalVendorCost)],
        ['Remaining Vendor Budget', peso(vendorBalance)],
        ['Total Organizer Earnings (Share + Remaining Budget)', peso(organizerTotal)],
      ],
      theme: 'plain',
      styles: { fontStyle: 'bold', fontSize: 11, textColor: [45, 40, 52] },
      columnStyles: {
        0: { cellWidth: 120, halign: 'left' },
        1: { halign: 'right' },
      },
      margin: { left: 14, right: 14 },
    });

    // Add footer to every page
    const pageCount = (doc as unknown as AutoTableDoc).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer divider
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(14, pageHeight - 24, pageWidth - 14, pageHeight - 24);

      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor('#888888');
      doc.text(
        'Creating unforgettable moments and turning your dream events into reality with precision, passion, and perfection.',
        pageWidth / 2,
        pageHeight - 16,
        { align: 'center' }
      );

      doc.setFont('helvetica', 'normal');
      doc.text(
        `© ${new Date().getFullYear()} Schatzies Events Management. All rights reserved.`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Page number
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    }

    doc.save(`${evName.toLowerCase().replace(/\s+/g, '-')}-cost-breakdown.pdf`);
  };

  if (!selectedEventId) {
    return (
      <section className="rounded-2xl border border-border bg-white px-4 py-10 text-center">
        <p className="text-sm font-semibold text-[#7c748f]">
          Select an event to view the cost breakdown.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-full space-y-6 pb-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl border border-[#eadfec] bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <p className="text-lg font-black text-foreground">{evName}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded-full border border-[#eadcf6] bg-brand/5 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-deep">
                {evType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePdf}
            className="rounded-full bg-gradient-to-r from-[#f34da7] to-brand-deep px-6 text-white hover:opacity-95 font-bold shadow-[0_4px_14px_rgba(165,44,180,0.2)]"
          >
            <FileText className="size-4 mr-2" /> Export PDF Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
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
                <span
                  className="size-2.5 shrink-0 rounded-full ring-2"
                  style={{ backgroundColor: c.color, boxShadow: `0 0 0 2px ${c.color}22` }}
                />
                {c.label}
              </p>
              <p
                className={`mt-4 text-3xl lg:text-4xl font-black tracking-tight ${c.highlight && c.value < 0 ? 'text-[#c03560]' : 'text-foreground'}`}
              >
                {peso(c.value)}
              </p>
              {c.sub && <p className="mt-1 text-xs font-semibold text-[#898299]">{c.sub}</p>}
              {c.highlight && c.value > 0 && (
                <p className="mt-1 text-[10px] font-semibold text-[#898299]">
                  Goes back to organizer
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Organizer Total Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-deep to-[#f34da7] px-6 py-4 text-white shadow-[0_10px_24px_rgba(165,44,180,0.25)]">
        <div>
          <p className="text-sm font-semibold opacity-80">Organizer Total Earnings</p>
          <p className="text-xs opacity-60">20% cut + leftover vendor budget</p>
        </div>
        <p className="text-3xl font-black">{peso(organizerTotal)}</p>
      </div>

      {/* Chart + Assigned Vendors */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-4">
        <Card className="border-border bg-white py-0 shadow-sm">
          <CardContent className="flex h-full flex-col px-5 py-5">
            <p className="text-sm font-black uppercase tracking-widest text-[#7a7186] mb-4">
              Cost Distribution
            </p>
            <div className="flex flex-1 items-start justify-center pt-1">
              <div className="relative size-52">
                <svg viewBox="0 0 160 160" className="size-full -rotate-90">
                  <circle cx="80" cy="80" r="62" fill="none" stroke="#f0e9f7" strokeWidth="32" />
                  {chartSegments.map((s) => (
                    <circle
                      key={s.id}
                      cx="80"
                      cy="80"
                      r="62"
                      fill="none"
                      stroke={s.color}
                      strokeWidth="32"
                      strokeDasharray={s.da}
                      strokeDashoffset={s.doff}
                      className="cursor-pointer transition-opacity duration-150"
                      opacity={hovId && hovId !== s.id ? 0.35 : 1}
                      onMouseEnter={() => setHovId(s.id)}
                      onMouseLeave={() => setHovId(null)}
                    />
                  ))}
                </svg>
                <div className="pointer-events-none absolute inset-[40px] rounded-full bg-white ring-1 ring-[#eee5f6]" />
                {hovSeg && (
                  <div className="pointer-events-none absolute -bottom-1 left-1/2 min-w-[200px] -translate-x-1/2 translate-y-full rounded-2xl border border-[#efe4f8] bg-white px-4 py-3 text-center shadow-lg z-10">
                    <p className="text-sm font-bold text-foreground">{hovSeg.type}</p>
                    <p className="text-xs text-muted-foreground">{hovSeg.name}</p>
                    <p className="mt-2 text-sm font-bold text-brand-deep">{peso(hovSeg.cost)}</p>
                    <p className="text-xs text-muted-foreground">{hovSeg.pct.toFixed(1)}%</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {chartSegments.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="flex-1 truncate">{s.name}</span>
                  <span className="font-semibold">{peso(s.cost)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#ff5b9f] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,91,159,0.3)]">
              <span>Total Vendor Cost</span>
              <span>{peso(totalVendorCost)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Vendors Table */}
        <Card className="border-border bg-white py-0 shadow-sm">
          <CardContent className="h-full px-0 py-0">
            <div className="overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-r from-[#ff66a7] to-[#ff4b97] px-6 py-4 text-sm font-semibold text-white">
                <div className="grid grid-cols-3 gap-4">
                  <span>Service Type</span>
                  <span>Vendor Name</span>
                  <span className="text-right">Price</span>
                </div>
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {eventVendors.length === 0 ? (
                  <div className="px-6 py-12 text-center text-sm font-semibold text-muted-foreground">
                    No vendors assigned to this event yet.
                  </div>
                ) : (
                  eventVendors.map((v, i) => (
                    <div
                      key={v.id}
                      className={`grid grid-cols-3 gap-4 px-6 py-3.5 text-sm border-b border-[#f3edf8] ${i % 2 === 0 ? 'bg-[#fff4f8]' : 'bg-white'} hover:bg-brand/5`}
                    >
                      <span className="font-medium text-foreground">{v.serviceType || '-'}</span>
                      <span className="text-foreground">{v.name}</span>
                      <span className="text-right font-bold text-foreground">
                        {v.price != null ? peso(v.price) : '—'}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t-2 border-border bg-[#faf7fd] px-6 py-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-muted-foreground">Vendor Budget (80%)</span>
                  <span className="font-bold text-foreground">{peso(vendorBudget)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-muted-foreground">Total Vendor Cost</span>
                  <span className="font-bold text-foreground">{peso(totalVendorCost)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-1.5">
                  <span className="font-bold text-foreground/80">Remaining</span>
                  <span
                    className={`font-black ${vendorBalance >= 0 ? 'text-[#29bf4c]' : 'text-[#c03560]'}`}
                  >
                    {peso(vendorBalance)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

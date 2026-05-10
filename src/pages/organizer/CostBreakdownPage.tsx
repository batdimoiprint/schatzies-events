import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronDown, Download } from 'lucide-react';
import {
  exportCostBreakdown,
  getCostBreakdown,
  updateCostBreakdown,
  createCostBreakdown,
} from '@/api/cost-breakdown';
import { getEvents, getEventVendors } from '@/api/events';
import { calculatePackagePrice } from '@/utils/package-pricing';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

type VendorCharge = {
  id: string;
  category: string;
  name: string;
  cost: number;
  color: string;
};

type AdditionalCharge = {
  id: string;
  description: string;
  amount: number;
};

const VENDOR_FALLBACK_COLORS = [
  '#7a0bc0',
  '#9838e4',
  '#b255f0',
  '#d46ad7',
  '#ec89be',
  '#f6b2d5',
  '#5dbac0',
  '#8f23cf',
];

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

function formatPeso(value: number): string {
  return pesoFormatter.format(value);
}

function toOptionalNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCsvValue(value: string | number): string {
  if (typeof value === 'number') {
    return String(value);
  }
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}



export function CostBreakdownPage() {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [apiEvents, setApiEvents] = useState<any[]>([]);
  const [apiVendors, setApiVendors] = useState<VendorCharge[]>([]);
  const [hoveredVendorId, setHoveredVendorId] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [additionalChargesMap, setAdditionalChargesMap] = useState<
    Record<string, AdditionalCharge[]>
  >({});
  const [newAddDesc, setNewAddDesc] = useState('');
  const [newAddAmount, setNewAddAmount] = useState('');
  const [apiPackagePrice, setApiPackagePrice] = useState<number | null>(null);
  const [apiEventPax, setApiEventPax] = useState<number | null>(null);
  const [apiAdditionalCharges, setApiAdditionalCharges] = useState<number | null>(null);
  const [apiRevenue, setApiRevenue] = useState<number | null>(null);
  const [apiProfit, setApiProfit] = useState<number | null>(null);
  const printRef = useRef<HTMLDivElement | null>(null);

  const selectedEvent = useMemo(() => {
    return apiEvents.find((event) => String(event?.id ?? '') === selectedEventId) ?? null;
  }, [apiEvents, selectedEventId]);

  const selectedEventName = String(
    selectedEvent?.title ?? selectedEvent?.eventName ?? 'Unknown Event'
  );
  const selectedEventPackage = String(
    selectedEvent?.eventPackage ?? selectedEvent?.packageName ?? 'No package assigned'
  );
  const selectedEventType = String(selectedEvent?.eventType ?? selectedEvent?.type ?? 'Unknown');

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const eventsResult = await getEvents();
        const eventRows = Array.isArray(eventsResult)
          ? eventsResult
          : Array.isArray((eventsResult as { events?: unknown[] })?.events)
            ? ((eventsResult as { events: unknown[] }).events as any[])
            : [];

        if (!isMounted) {
          return;
        }

        setApiEvents(eventRows);
        if (eventRows.length > 0) {
          setSelectedEventId(String(eventRows[0]?.id ?? ''));
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load events:', error);
        setApiEvents([]);
      }
    };

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCostBreakdown = async () => {
      if (!selectedEventId) {
        setApiPackagePrice(null);
        setApiEventPax(null);
        setApiAdditionalCharges(null);
        setApiRevenue(null);
        setApiProfit(null);
        setApiVendors([]);
        return;
      }

      setApiPackagePrice(null);
      setApiEventPax(null);
      setApiAdditionalCharges(null);
      setApiRevenue(null);
      setApiProfit(null);
      setApiVendors([]);

      try {
        const [costResult, vendorsResult] = await Promise.all([
          getCostBreakdown(selectedEventId).catch(() => {
            console.warn('Cost breakdown not found for this event.');
            return null;
          }),
          getEventVendors(selectedEventId).catch(() => {
            console.warn('No vendors found or failed to fetch vendors.');
            return [];
          }),
        ]);

        const costPayload =
          (costResult?.data as Record<string, unknown> | undefined) ??
          (costResult?.costBreakdown as Record<string, unknown> | undefined) ??
          (costResult as Record<string, unknown> | undefined) ??
          {};

        const vendorRows = Array.isArray(vendorsResult)
          ? vendorsResult
          : Array.isArray((vendorsResult as { vendors?: unknown[] })?.vendors)
            ? ((vendorsResult as { vendors: unknown[] }).vendors as any[])
            : Array.isArray((vendorsResult as { data?: unknown[] })?.data)
              ? ((vendorsResult as { data: unknown[] }).data as any[])
              : Array.isArray((vendorsResult as { data?: { vendors?: unknown[] } })?.data?.vendors)
                ? ((vendorsResult as { data: { vendors: unknown[] } }).data.vendors as any[])
                : [];

        const mappedVendors: VendorCharge[] = vendorRows.map((vendor: any, index: number) => ({
          id: String(vendor?.id ?? vendor?.vendorId ?? `${selectedEventId}-${index}`),
          category: String(
            vendor?.category ??
              vendor?.vendorType ??
              vendor?.serviceCategory ??
              vendor?.service ??
              'Uncategorized'
          ),
          name: String(
            vendor?.name ?? vendor?.vendorName ?? vendor?.companyName ?? 'Unknown Vendor'
          ),
          cost:
            toOptionalNumber(
              vendor?.cost ?? vendor?.allocatedCost ?? vendor?.amount ?? vendor?.price
            ) ?? 0,
          color: String(
            vendor?.color ??
              vendor?.hexColor ??
              VENDOR_FALLBACK_COLORS[index % VENDOR_FALLBACK_COLORS.length]
          ),
        }));

        if (!isMounted) {
          return;
        }

        setApiPackagePrice(
          toOptionalNumber(
            costPayload.packagePricePerPax ?? costPayload.packagePerPax ?? costPayload.packagePrice
          )
        );
        setApiEventPax(
          toOptionalNumber(costPayload.eventPax ?? costPayload.paxCount ?? costPayload.pax)
        );
        setApiAdditionalCharges(
          toOptionalNumber(costPayload.additionalCharges ?? costPayload.additionalCharge)
        );
        setApiRevenue(toOptionalNumber(costPayload.revenue ?? costPayload.totalRevenue));
        setApiProfit(toOptionalNumber(costPayload.profit ?? costPayload.totalProfit));
        setApiVendors(mappedVendors);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load cost breakdown:', error);
        setApiVendors([]);
      }
    };

    void loadCostBreakdown();

    return () => {
      isMounted = false;
    };
  }, [selectedEventId]);

  const additionalItems = additionalChargesMap[selectedEventId] ?? [];
  const additionalItemsTotal = additionalItems.reduce((total, item) => total + item.amount, 0);
  const fallbackPackagePrice = toOptionalNumber(
    selectedEvent?.packagePricePerPax ?? selectedEvent?.packagePerPax ?? selectedEvent?.packagePrice
  );
  const fallbackEventPax = toOptionalNumber(
    selectedEvent?.eventPax ?? selectedEvent?.paxCount ?? selectedEvent?.pax
  );
  const fallbackAdditionalCharges = toOptionalNumber(
    selectedEvent?.additionalCharges ?? selectedEvent?.additionalCharge
  );

  const resolvedEventPax = apiEventPax ?? fallbackEventPax ?? 0;
  const computedPackagePrice = calculatePackagePrice(
    selectedEventPackage,
    selectedEventType,
    resolvedEventPax
  );

  const rawApiPrice = apiPackagePrice ?? fallbackPackagePrice ?? 0;
  const resolvedPackagePrice =
    computedPackagePrice > 0
      ? computedPackagePrice
      : rawApiPrice > 50000
        ? rawApiPrice
        : rawApiPrice * resolvedEventPax;

  const baseAdditionalCharges = apiAdditionalCharges ?? fallbackAdditionalCharges ?? 0;
  const displayedAdditionalCharges = baseAdditionalCharges + additionalItemsTotal;
  const packagePayment = resolvedPackagePrice;
  const totalVendorCharges = useMemo(() => {
    return apiVendors.reduce((total, charge) => total + charge.cost, 0);
  }, [apiVendors]);
  const totalRevenue = apiRevenue ?? packagePayment + displayedAdditionalCharges;
  const profitOrRemainingBudget = apiProfit ?? totalRevenue - totalVendorCharges;

  const formattedEventDate = useMemo(() => {
    const dateValue = selectedEvent?.startDate ?? selectedEvent?.eventDate ?? selectedEvent?.date;
    if (!dateValue) {
      return 'Date not available';
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date not available';
    }

    return longDateFormatter.format(parsedDate);
  }, [selectedEvent]);

  const formattedEndDate = useMemo(() => {
    const dateValue = selectedEvent?.endDate;
    if (!dateValue) {
      return 'Date not available';
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date not available';
    }

    return longDateFormatter.format(parsedDate);
  }, [selectedEvent]);

  const chartSegments = useMemo(() => {
    const total = totalVendorCharges || 1;
    const radius = 62;
    const circumference = 2 * Math.PI * radius;
    let cumulative = 0;

    return apiVendors.map((charge) => {
      const percentage = (charge.cost / total) * 100;
      const strokeLength = (percentage / 100) * circumference;
      const dashArray = `${strokeLength} ${Math.max(circumference - strokeLength, 0)}`;
      const dashOffset = -((cumulative / 100) * circumference);

      cumulative += percentage;

      return {
        ...charge,
        percentage,
        dashArray,
        dashOffset,
      };
    });
  }, [apiVendors, totalVendorCharges]);

  const hoveredSegment = useMemo(() => {
    return chartSegments.find((segment) => segment.id === hoveredVendorId) ?? null;
  }, [chartSegments, hoveredVendorId]);

  const handleAddAdditional = () => {
    if (!selectedEventId) {
      return;
    }

    const amount = Number(newAddAmount || 0);

    if (!newAddDesc.trim() || amount <= 0) {
      return;
    }

    const item: AdditionalCharge = {
      id: `${Date.now()}`,
      description: newAddDesc.trim(),
      amount,
    };

    setAdditionalChargesMap((prev) => ({
      ...prev,
      [selectedEventId]: [...(prev[selectedEventId] ?? []), item],
    }));
    setNewAddDesc('');
    setNewAddAmount('');
  };

  const handleRemoveAdditional = (id: string) => {
    setAdditionalChargesMap((prev) => ({
      ...prev,
      [selectedEventId]: (prev[selectedEventId] ?? []).filter((item) => item.id !== id),
    }));
  };

  const handleExportCsv = async () => {
    if (!selectedEventId) {
      setExportMenuOpen(false);
      return;
    }

    try {
      // Call the backend just to log the export action if needed
      await exportCostBreakdown(selectedEventId);

      const summaryRows: Array<Array<string | number>> = [
        ['Event', selectedEventName],
        ['Type', selectedEventType],
        ['Date', formattedEventDate],
        [],
        ['Client Package Payment', packagePayment],
        ['Additional Charges', displayedAdditionalCharges],
        ['Total Revenue', totalRevenue],
        ['Total Vendor Charges', totalVendorCharges],
        ['Profit', profitOrRemainingBudget],
        [],
        ['Vendor Charges'],
        ['Category', 'Vendor / Item', 'Cost'],
        ...apiVendors.map((charge) => [charge.category, charge.name, charge.cost]),
      ];

      const csvContent = summaryRows
        .map((row) => row.map((cell) => formatCsvValue(cell)).join(','))
        .join('\n');

      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const csvUrl = URL.createObjectURL(csvBlob);
      const link = document.createElement('a');

      link.href = csvUrl;
      link.download = `${selectedEventName.toLowerCase().replaceAll(' ', '-')}-cost-breakdown.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(csvUrl);
    } catch (error) {
      console.error('Failed to export cost breakdown CSV:', error);
    } finally {
      setExportMenuOpen(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!printRef.current) {
      return;
    }

    const printHTML = printRef.current.outerHTML;
    const newWindow = window.open('', '_blank', 'width=900,height=700');

    if (!newWindow) {
      return;
    }

    const styleNodes = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
    const styles = styleNodes.map((node) => node.outerHTML).join('\n');

    newWindow.document
      .write(`<!doctype html><html><head><meta charset="utf-8"><title>Cost Breakdown</title>${styles}
      <style>@page{size:A4 portrait;margin:12mm;}body{background:#fff;color:#000;margin:0;padding:0;} .print-container{width:180mm;max-width:100%;margin:0 auto;} table{border-collapse:collapse;} th,td{padding:6px 6px;}</style></head><body>${printHTML}</body></html>`);
    newWindow.document.close();
    newWindow.focus();
    newWindow.onload = () => {
      try {
        newWindow.print();
      } catch {
        // ignore print failures
      }
    };
    setExportMenuOpen(false);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCostBreakdown = async () => {
    if (!selectedEventId) return;
    setIsSaving(true);
    try {
      const payload = {
        packagePricePerPax: resolvedPackagePrice,
        eventPax: resolvedEventPax,
        manpowerCost: 0, // Fallback as this isn't currently managed in the UI
        additionalCharges: displayedAdditionalCharges,
      };

      try {
        // Attempt to update first (PUT)
        await updateCostBreakdown(selectedEventId, payload);
      } catch (err: any) {
        // If it fails with a 404 (doesn't exist yet), create it (POST)
        if (err.response?.status === 404) {
          await createCostBreakdown(selectedEventId, payload);
        } else {
          throw err;
        }
      }
      alert('Cost breakdown saved successfully!');
    } catch (error) {
      console.error('Failed to save cost breakdown', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="max-w-full space-y-6 pb-6 overflow-x-hidden">
      <div className="hidden print:block">
        <div
          ref={printRef}
          className="mx-auto bg-white p-4 text-black print-container"
          style={{
            fontFamily: 'Source Sans Pro, Arial, sans-serif',
            width: '180mm',
            maxWidth: '100%',
          }}
        >
          <div className="mb-3 text-center">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="mx-auto mb-2"
              style={{ width: 72 }}
            />
            <div className="text-sm font-bold uppercase tracking-wide">Schatzies Events</div>
            <h1 className="mt-1 text-lg font-bold">{selectedEventName}</h1>
            <div className="text-sm text-gray-700">{selectedEventPackage}</div>
            <div className="mt-1 text-sm">{formattedEventDate}</div>
          </div>

          <div className="mb-3">
            <div className="mb-2 text-sm font-semibold">Additional Charges (Breakdown)</div>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
                  <th className="py-1 text-left text-[11px]">Description</th>
                  <th className="py-1 text-right text-[11px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Base additional charges</td>
                  <td className="py-1 text-right">{formatPeso(baseAdditionalCharges)}</td>
                </tr>
                {additionalItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-1">{item.description}</td>
                    <td className="py-1 text-right">{formatPeso(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-3">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="py-1 text-left text-[12px]">Description</th>
                  <th className="py-1 text-right text-[12px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Client Package ({resolvedEventPax} pax)</td>
                  <td className="py-1 text-right font-semibold">{formatPeso(packagePayment)}</td>
                </tr>
                <tr>
                  <td className="py-1">Additional Charges</td>
                  <td className="py-1 text-right font-semibold">
                    {formatPeso(displayedAdditionalCharges)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1">Total Vendor Charges</td>
                  <td className="py-1 text-right font-semibold">
                    {formatPeso(totalVendorCharges)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-3">
            <div className="mb-2 text-sm font-semibold">Vendor Charges</div>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
                  <th className="py-1 text-left text-[11px]">Category</th>
                  <th className="py-1 text-left text-[11px]">Vendor / Item</th>
                  <th className="py-1 text-right text-[11px]">Cost</th>
                </tr>
              </thead>
              <tbody>
                {apiVendors.map((charge) => (
                  <tr key={charge.id}>
                    <td className="py-1">{charge.category}</td>
                    <td className="py-1">{charge.name}</td>
                    <td className="py-1 text-right">{formatPeso(charge.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 border-t pt-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Total Revenue</span>
              <span>{formatPeso(totalRevenue)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm font-bold">
              <span>Profit</span>
              <span>{formatPeso(profitOrRemainingBudget)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full pb-2">
        <div className="w-full space-y-6 pr-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-y-6 lg:gap-x-12 rounded-3xl border border-[#eadfec] bg-white p-4 shadow-sm print:hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-y-6 lg:gap-x-10 w-full lg:w-auto">
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger className="h-11 w-full md:w-[280px] rounded-2xl border-0 bg-linear-to-r from-[#f34da7] to-[#8f1fd1] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(165,44,180,0.3)] data-[placeholder]:text-white/80">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {apiEvents.map((event) => (
                    <SelectItem key={String(event?.id)} value={String(event?.id)}>
                      {event?.title || event?.eventName || 'Untitled event'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-6">
                <div>
                  <p className="text-sm font-semibold text-[#4d4454]">{selectedEventPackage}</p>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#60586c]">
                    <CalendarDays className="size-4 text-[#8f1fd1]" />
                    {formattedEventDate}
                  </p>
                </div>

                <span className="rounded-full border border-[#eadcf6] bg-[#f8f1fd] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8f23cf]">
                  {selectedEventType}
                </span>

                <div className="flex flex-row items-center gap-8 sm:gap-12 text-sm font-semibold text-[#6f6780]">
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[#8b8199]">
                      Start Date
                    </span>
                    <span className="whitespace-nowrap">{formattedEventDate}</span>
                  </div>
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[#8b8199]">
                      End Date
                    </span>
                    <span className="whitespace-nowrap">{formattedEndDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-wrap items-center gap-3">
              <Button
                onClick={handleSaveCostBreakdown}
                disabled={isSaving}
                className="rounded-full bg-white border border-[#e4d9ef] text-[#8f1fd1] px-5 font-bold shadow-sm hover:bg-[#faf6fd] disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={() => setExportMenuOpen((open) => !open)}
                className="rounded-full bg-linear-to-r from-[#f34da7] to-[#8f1fd1] px-5 text-white shadow-[0_10px_24px_rgba(165,44,180,0.28)] hover:opacity-95"
              >
                Export
                <ChevronDown className="size-4" />
              </Button>

              {exportMenuOpen ? (
                <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-[#eadfec] bg-white shadow-[0_12px_34px_rgba(42,23,60,0.12)]">
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[#4a4157] transition-colors hover:bg-[#faf6fd]"
                  >
                    <Download className="size-4 text-[#8f1fd1]" />
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[#4a4157] transition-colors hover:bg-[#faf6fd]"
                  >
                    <Download className="size-4 text-[#f34da7]" />
                    Download PDF
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e7dfef] bg-white shadow-sm">
            <div className="grid min-h-[168px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0 lg:divide-x divide-[#ece6f3] py-4 lg:py-0">
              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#7a7186] truncate w-full">
                  <span className="size-2.5 shrink-0 rounded-full bg-[#8f23cf] ring-2 ring-[#efe4fb]" />
                  Revenue
                </p>
                <p className="mt-5 font-sans text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-[#2d2834]">
                  {formatPeso(totalRevenue)}
                </p>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#7a7186] truncate w-full">
                  <span className="size-2.5 shrink-0 rounded-full bg-[#5dbac0] ring-2 ring-[#e3f6f7]" />
                  Profit
                </p>
                <p
                  className={`mt-5 font-sans text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight ${profitOrRemainingBudget >= 0 ? 'text-[#2d2834]' : 'text-[#c03560]'}`}
                >
                  {formatPeso(profitOrRemainingBudget)}
                </p>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#7a7186] truncate w-full">
                  <span className="size-2.5 shrink-0 rounded-full bg-[#d7d6db]" />
                  Package Price
                </p>
                <p className="mt-5 font-sans text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-[#2d2834]">
                  {formatPeso(resolvedPackagePrice)}
                </p>
                <p className="mt-2 text-right text-xs font-semibold text-[#898299]">
                  {resolvedEventPax} pax
                </p>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#7a7186] truncate w-full">
                  <span className="size-2.5 shrink-0 rounded-full bg-[#d7d6db]" />
                  Additional Charges
                </p>
                <p className="mt-5 font-sans text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-[#2d2834]">
                  {formatPeso(displayedAdditionalCharges)}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#6e6585] transition-colors hover:text-[#4f4760]">
                      View Details
                      <ArrowRight className="size-3" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogTitle>Additional Charges</DialogTitle>
                    <DialogDescription>
                      Track the base additional charges and any extra adjustments for this event.
                    </DialogDescription>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#eee4f6] bg-[#fcf9fe] p-4">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-[#6e6585]">
                            Base additional charges
                          </span>
                          <span className="font-bold text-[#2d2834]">
                            {formatPeso(baseAdditionalCharges)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-[#6e6585]">Extra items added</span>
                          <span className="font-bold text-[#2d2834]">
                            {formatPeso(additionalItemsTotal)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-[#ece4f5] pt-3 text-sm">
                          <span className="font-bold text-[#4a4157]">Total Additional Charges</span>
                          <span className="font-bold text-[#8f1fd1]">
                            {formatPeso(displayedAdditionalCharges)}
                          </span>
                        </div>
                      </div>

                      <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
                        {additionalItems.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-[#eadcf6] px-4 py-3 text-sm text-[#8b8199]">
                            No extra items added yet.
                          </div>
                        ) : (
                          additionalItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 rounded-xl bg-[#fbfbfd] p-3"
                            >
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-[#2f2939]">
                                  {item.description}
                                </div>
                                <div className="text-xs text-[#8c859d]">Manual additional item</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-bold text-[#2f2939]">
                                  {formatPeso(item.amount)}
                                </div>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleRemoveAdditional(item.id)}
                                  className="text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px] sm:items-end">
                        <div>
                          <Label className="text-sm">Description</Label>
                          <Input
                            value={newAddDesc}
                            onChange={(event) => setNewAddDesc(event.target.value)}
                            placeholder="e.g. Extra chairs"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Amount</Label>
                          <Input
                            value={newAddAmount}
                            onChange={(event) => setNewAddAmount(event.target.value)}
                            placeholder="0"
                            type="number"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddAdditional}
                          className="rounded-full bg-linear-to-r from-[#f34da7] to-[#8f1fd1] px-4 py-1 text-sm text-white hover:opacity-95"
                        >
                          Add
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setNewAddDesc('');
                            setNewAddAmount('');
                          }}
                          className="rounded-full px-4 py-1"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <button className="rounded-full border border-[#e4d9ef] px-3 py-1 text-sm font-semibold text-[#4a4157]">
                          Done
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#4a4157]">
              Cost Distribution (Vendors)
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-4">
              <Card className="h-[500px] border-[#e7dfef] bg-white py-0 shadow-sm">
                <CardContent className="flex h-full flex-col px-5 py-5">
                  <div className="flex flex-1 items-start justify-center pt-1">
                    <div className="relative size-60">
                      <svg viewBox="0 0 160 160" className="size-full -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="62"
                          fill="none"
                          stroke="#f0e9f7"
                          strokeWidth="32"
                        />
                        {chartSegments.map((segment) => (
                          <circle
                            key={segment.id}
                            cx="80"
                            cy="80"
                            r="62"
                            fill="none"
                            stroke={segment.color}
                            strokeWidth="32"
                            strokeDasharray={segment.dashArray}
                            strokeDashoffset={segment.dashOffset}
                            className="cursor-pointer transition-opacity duration-150"
                            opacity={hoveredVendorId && hoveredVendorId !== segment.id ? 0.42 : 1}
                            tabIndex={0}
                            aria-label={`${segment.category}: ${formatPeso(segment.cost)} (${segment.percentage.toFixed(1)}%)`}
                            onMouseEnter={() => setHoveredVendorId(segment.id)}
                            onMouseLeave={() => setHoveredVendorId(null)}
                            onFocus={() => setHoveredVendorId(segment.id)}
                            onBlur={() => setHoveredVendorId(null)}
                          />
                        ))}
                      </svg>

                      <div className="pointer-events-none absolute inset-[48px] rounded-full bg-white ring-1 ring-[#eee5f6]" />

                      {hoveredSegment ? (
                        <div className="pointer-events-none absolute -bottom-1 left-1/2 min-w-[210px] -translate-x-1/2 translate-y-full rounded-2xl border border-[#efe4f8] bg-white px-4 py-3 text-center shadow-[0_16px_36px_rgba(42,23,60,0.16)]">
                          <p className="mt-1 text-sm font-bold text-[#2d2834]">
                            {hoveredSegment.category}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-[#6f6780]">
                            {hoveredSegment.name}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                            <span className="font-semibold text-[#6f6780]">Cost</span>
                            <span className="font-bold text-[#2d2834]">
                              {formatPeso(hoveredSegment.cost)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-3 text-sm">
                            <span className="font-semibold text-[#6f6780]">Share</span>
                            <span className="font-bold text-[#2d2834]">
                              {hoveredSegment.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-1.5 pb-2">
                    {chartSegments.map((segment) => (
                      <div
                        key={segment.id}
                        className="flex items-center gap-2 text-[12px] text-[#70687e]"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="min-w-0 flex-1 truncate">{segment.category}</span>
                        <span className="shrink-0 font-medium">
                          {segment.percentage.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center w-full">
                    <div className="flex w-[92%] items-center justify-between rounded-md bg-[#ff5b9f] px-5 py-3 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(255,91,159,0.3)]">
                      <span>Total Cost =</span>
                      <span>{formatPeso(totalVendorCharges)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-[500px] border-[#e7dfef] bg-white py-0 shadow-sm">
                <CardContent className="h-full px-0 py-0">
                  <div className="overflow-hidden rounded-2xl">
                    <div className="bg-linear-to-r from-[#ff66a7] to-[#ff4b97] px-6 py-4 text-sm font-semibold text-white">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.2fr_1fr_180px] gap-4">
                        <span className="hidden sm:inline">Vendor type</span>
                        <span>Vendor Name</span>
                        <span className="text-right">Allocated Cost</span>
                      </div>
                    </div>

                    <div className="h-[420px] overflow-y-auto overflow-x-auto">
                      <Table className="min-w-[400px] sm:min-w-0">
                        <TableHeader className="sr-only">
                          <TableRow>
                            <TableHead>Vendor type</TableHead>
                            <TableHead>Vendor Name</TableHead>
                            <TableHead>Allocated Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {apiVendors.map((charge) => (
                            <TableRow
                              key={charge.id}
                              className="border-[#f1ecf6] odd:bg-[#fff4f8] even:bg-white hover:bg-[#fcfbfd]"
                            >
                              <TableCell className="hidden sm:table-cell px-6 py-4 text-sm font-medium text-[#2f2939]">
                                {charge.category}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-sm text-[#2f2939]">
                                {charge.name}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right text-sm font-bold text-[#2f2939]">
                                {formatPeso(charge.cost)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

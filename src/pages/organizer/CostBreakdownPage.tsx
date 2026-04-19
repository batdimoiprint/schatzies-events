import { useMemo, useState, useRef } from 'react';
import { ArrowRight, CalendarDays, Download, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type VendorCategory = 'Manpower' | 'Supplies' | 'Vendors';

type VendorCharge = {
  id: string;
  category: VendorCategory;
  name: string;
  cost: number;
};

type SummarySegment = {
  label: string;
  value: number;
  color: string;
};

type SummarySegmentWithPercentage = SummarySegment & {
  percentage: number;
};

type EventCostBreakdown = {
  id: string;
  eventName: string;
  packageName?: string;
  eventType: string;
  eventDate: string;
  packagePerPax: number;
  paxCount: number;
  additionalCharges: number;
  vendorCharges: VendorCharge[];
};

const MOCK_EVENTS: EventCostBreakdown[] = [
  {
    id: 'event-1',
    eventName: "Angela's 18th Birthday",
    packageName: 'Blooms Package',
    eventType: 'Debut',
    eventDate: '2026-01-03',
    packagePerPax: 3200,
    paxCount: 40,
    additionalCharges: 5000,
    vendorCharges: [
      {
        id: 'm1',
        category: 'Manpower',
        name: 'Event Coordinator Team',
        cost: 18000,
      },
      {
        id: 's1',
        category: 'Supplies',
        name: 'Floral & Styling Materials',
        cost: 12000,
      },
      {
        id: 'v1',
        category: 'Vendors',
        name: 'Juan Carlo The Caterer',
        cost: 34000,
      },
      {
        id: 'v2',
        category: 'Vendors',
        name: 'Snapshot Studio',
        cost: 21000,
      },
      {
        id: 's2',
        category: 'Supplies',
        name: 'Souvenir Packaging',
        cost: 5000,
      },
      {
        id: 'm2',
        category: 'Manpower',
        name: 'On-site Setup Crew',
        cost: 10000,
      },
    ],
  },
  {
    id: 'event-2',
    eventName: 'Ray & Sam Wedding Reception',
    packageName: 'Elegance Package',
    eventType: 'Wedding',
    eventDate: '2026-02-14',
    packagePerPax: 4200,
    paxCount: 70,
    additionalCharges: 12000,
    vendorCharges: [
      {
        id: 'm3',
        category: 'Manpower',
        name: 'Host & Program Team',
        cost: 26000,
      },
      {
        id: 's3',
        category: 'Supplies',
        name: 'Lighting & Stage Decor',
        cost: 28000,
      },
      {
        id: 'v3',
        category: 'Vendors',
        name: 'Rosario Catering',
        cost: 96000,
      },
      {
        id: 'v4',
        category: 'Vendors',
        name: 'Forever Films',
        cost: 36000,
      },
    ],
  },
  {
    id: 'event-3',
    eventName: 'Mika Corporate Year-End Gala',
    packageName: 'Corporate Gala Package',
    eventType: 'Corporate',
    eventDate: '2026-03-28',
    packagePerPax: 2900,
    paxCount: 90,
    additionalCharges: 18000,
    vendorCharges: [
      {
        id: 'm4',
        category: 'Manpower',
        name: 'Registration & Usher Team',
        cost: 22000,
      },
      {
        id: 's4',
        category: 'Supplies',
        name: 'Branding Materials',
        cost: 18000,
      },
      {
        id: 'v5',
        category: 'Vendors',
        name: 'Prestige Catering Group',
        cost: 78000,
      },
      {
        id: 'v6',
        category: 'Vendors',
        name: 'Live Audio Visuals',
        cost: 30000,
      },
      {
        id: 'm5',
        category: 'Manpower',
        name: 'Security and Logistics Team',
        cost: 17000,
      },
    ],
  },
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

function formatCsvValue(value: string | number): string {
  if (typeof value === 'number') {
    return String(value);
  }

  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

function getVendorTypeDotColor(category: VendorCategory): string {
  if (category === 'Vendors') {
    return '#6437cf';
  }

  if (category === 'Manpower') {
    return '#73c5ca';
  }

  return '#f07ab2';
}

export function CostBreakdownPage() {
  const [selectedEventId, setSelectedEventId] = useState(MOCK_EVENTS[0].id);
  const [hoveredChartSegmentLabel, setHoveredChartSegmentLabel] = useState<string | null>(null);

  const selectedEvent = useMemo(() => {
    return MOCK_EVENTS.find((event) => event.id === selectedEventId) ?? MOCK_EVENTS[0];
  }, [selectedEventId]);

  const [additionalChargesMap, setAdditionalChargesMap] = useState<
    Record<string, { id: string; description: string; amount: number }[]>
  >({});

  const additionalItems = additionalChargesMap[selectedEvent.id] ?? [];
  const additionalChargesFromItems = additionalItems.reduce((s, it) => s + (it.amount || 0), 0);
  // Start at zero; only reflect items added in the dialog
  const displayedAdditionalCharges = additionalChargesFromItems;

  const [newAddDesc, setNewAddDesc] = useState('');
  const [newAddAmount, setNewAddAmount] = useState<string>('');

  const handleAddAdditional = () => {
    const amt = Number(newAddAmount || 0);
    if (!newAddDesc || !amt) return;
    const item = { id: Date.now().toString(), description: newAddDesc, amount: amt };
    setAdditionalChargesMap((prev) => ({
      ...prev,
      [selectedEvent.id]: [...(prev[selectedEvent.id] ?? []), item],
    }));
    setNewAddDesc('');
    setNewAddAmount('');
  };

  const handleRemoveAdditional = (id: string) => {
    setAdditionalChargesMap((prev) => ({
      ...prev,
      [selectedEvent.id]: (prev[selectedEvent.id] ?? []).filter((it) => it.id !== id),
    }));
  };

  const packagePayment = selectedEvent.packagePerPax * selectedEvent.paxCount;

  const totalVendorCharges = useMemo(() => {
    return selectedEvent.vendorCharges.reduce((runningTotal, charge) => {
      return runningTotal + charge.cost;
    }, 0);
  }, [selectedEvent.vendorCharges]);

  const profitOrRemainingBudget = packagePayment - totalVendorCharges;
  const totalRevenue = packagePayment + displayedAdditionalCharges;
  const totalExpenses = totalVendorCharges + displayedAdditionalCharges;
  const netProfitAfterAllCosts = packagePayment - totalExpenses;

  const netProfitMargin = useMemo(() => {
    if (packagePayment <= 0) {
      return 0;
    }

    return (netProfitAfterAllCosts / packagePayment) * 100;
  }, [netProfitAfterAllCosts, packagePayment]);

  const categoryTotals = useMemo(() => {
    const initialTotals: Record<VendorCategory, number> = {
      Manpower: 0,
      Supplies: 0,
      Vendors: 0,
    };

    return selectedEvent.vendorCharges.reduce((totals, charge) => {
      totals[charge.category] += charge.cost;
      return totals;
    }, initialTotals);
  }, [selectedEvent.vendorCharges]);

  const formattedEventDate = useMemo(() => {
    const date = new Date(selectedEvent.eventDate);
    return longDateFormatter.format(date);
  }, [selectedEvent.eventDate]);

  const summarySegments = useMemo<SummarySegment[]>(() => {
    const segments: SummarySegment[] = [
      {
        label: 'Vendors',
        value: categoryTotals.Vendors,
        color: '#6437cf',
      },
      {
        label: 'Manpower',
        value: categoryTotals.Manpower,
        color: '#73c5ca',
      },
      {
        label: 'Supplies',
        value: categoryTotals.Supplies,
        color: '#f07ab2',
      },
      {
        label: 'Logistics & Extras',
        value: displayedAdditionalCharges,
        color: '#9d8d98',
      },
      {
        label: netProfitAfterAllCosts >= 0 ? 'Net Profit' : 'Deficit',
        value: Math.abs(netProfitAfterAllCosts),
        color: netProfitAfterAllCosts >= 0 ? '#e8d2e3' : '#e64b64',
      },
    ];

    return segments.filter((segment) => segment.value > 0);
  }, [
    categoryTotals.Manpower,
    categoryTotals.Supplies,
    categoryTotals.Vendors,
    netProfitAfterAllCosts,
    displayedAdditionalCharges,
  ]);

  const summarySegmentsWithPercentages = useMemo<SummarySegmentWithPercentage[]>(() => {
    const total = summarySegments.reduce((runningTotal, segment) => {
      return runningTotal + segment.value;
    }, 0);

    return summarySegments.map((segment) => ({
      ...segment,
      percentage: total > 0 ? (segment.value / total) * 100 : 0,
    }));
  }, [summarySegments]);

  const donutSegments = useMemo(() => {
    const radius = 62;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercent = 0;

    return summarySegmentsWithPercentages.map((segment) => {
      const strokeLength = (segment.percentage / 100) * circumference;
      const dashArray = `${strokeLength} ${Math.max(circumference - strokeLength, 0)}`;
      const dashOffset = -((cumulativePercent / 100) * circumference);

      cumulativePercent += segment.percentage;

      return {
        ...segment,
        dashArray,
        dashOffset,
      };
    });
  }, [summarySegmentsWithPercentages]);

  const hoveredChartSegment = useMemo(() => {
    if (!hoveredChartSegmentLabel) {
      return null;
    }

    return (
      summarySegmentsWithPercentages.find(
        (segment) => segment.label === hoveredChartSegmentLabel
      ) ?? null
    );
  }, [hoveredChartSegmentLabel, summarySegmentsWithPercentages]);

  const printRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPdf = () => {
    if (!printRef.current) return;

    const printHTML = printRef.current.outerHTML;
    const newWindow = window.open('', '_blank', 'width=900,height=700');
    if (!newWindow) return;

    const styleNodes = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
    const styles = styleNodes.map((n) => n.outerHTML).join('\n');

    newWindow.document
      .write(`<!doctype html><html><head><meta charset="utf-8"><title>Cost Breakdown</title>${styles}
      <style>@page{size:A4 portrait;margin:12mm;}body{background:#fff;color:#000;margin:0;padding:0;} .print-container{width:180mm;max-width:100%;margin:0 auto;} table{border-collapse:collapse;} th,td{padding:6px 6px;}</style></head><body>${printHTML}</body></html>`);
    newWindow.document.close();
    newWindow.focus();
    newWindow.onload = () => {
      try {
        newWindow.print();
      } catch (e) {
        // ignore
      }
    };
  };

  const handleExportCsv = () => {
    const summaryRows: Array<Array<string | number>> = [
      ['Event', selectedEvent.eventName],
      ['Type', selectedEvent.eventType],
      ['Date', formattedEventDate],
      [],
      ['Client Package Payment', packagePayment],
      ['Additional Charges', displayedAdditionalCharges],
      ['Total Revenue', totalRevenue],
      ['Total Vendor Charges', totalVendorCharges],
      ['Profit or Remaining Budget', profitOrRemainingBudget],
      [],
      ['Outsourced Vendor Charges'],
      ['Category', 'Vendor / Item', 'Cost'],
      ...selectedEvent.vendorCharges.map((charge) => [charge.category, charge.name, charge.cost]),
    ];

    const csvContent = summaryRows
      .map((row) => row.map((cell) => formatCsvValue(cell)).join(','))
      .join('\n');

    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');

    link.href = csvUrl;
    link.download = `${selectedEvent.eventName.toLowerCase().replaceAll(' ', '-')}-cost-breakdown.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(csvUrl);
  };

  return (
    <section className="space-y-6">
      {/* Print-only receipt layout: hidden in screen, visible when printing */}
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
          <div className="text-center mb-3">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="mx-auto mb-2"
              style={{ width: 72 }}
            />
            <div className="text-sm font-bold uppercase tracking-wide">Schatzies Events</div>
            <h1 className="text-lg font-bold mt-1">{selectedEvent.eventName}</h1>
            <div className="text-sm text-gray-700">{selectedEvent.packageName}</div>
            <div className="text-sm mt-1">{formattedEventDate}</div>
          </div>

          <div className="mb-3">
            <div className="text-sm font-semibold mb-2">Additional Charges (Breakdown)</div>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
                  <th className="text-left text-[11px] py-1">Description</th>
                  <th className="text-left text-[11px] py-1">Date</th>
                  <th className="text-right text-[11px] py-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {additionalItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-1 text-xs text-[#6e6585]">
                      No additional items.
                    </td>
                  </tr>
                ) : (
                  additionalItems.map((it) => (
                    <tr key={it.id}>
                      <td className="py-1">{it.description}</td>
                      <td className="py-1">{new Date(Number(it.id)).toLocaleString()}</td>
                      <td className="py-1 text-right">{formatPeso(it.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mb-3">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="text-left text-[12px] py-1">Description</th>
                  <th className="text-right text-[12px] py-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Client Package ({selectedEvent.paxCount} pax)</td>
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
            <div className="text-sm font-semibold mb-2">Vendor Charges</div>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
                  <th className="text-left text-[11px] py-1">Category</th>
                  <th className="text-left text-[11px] py-1">Vendor / Item</th>
                  <th className="text-right text-[11px] py-1">Cost</th>
                </tr>
              </thead>
              <tbody>
                {selectedEvent.vendorCharges.map((c) => (
                  <tr key={c.id}>
                    <td className="py-1">{c.category}</td>
                    <td className="py-1">{c.name}</td>
                    <td className="py-1 text-right">{formatPeso(c.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 border-t pt-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Total Expenses</span>
              <span>{formatPeso(totalExpenses)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold mt-1">
              <span>Net Profit</span>
              <span>{formatPeso(netProfitAfterAllCosts)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[1140px] space-y-6 pr-1">
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-[#e7dfef] bg-white p-4 shadow-sm print:hidden">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Select value={selectedEvent.id} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="h-10 w-[240px] rounded-2xl border-[#d8cae8] bg-linear-to-r from-[#f651a8] to-[#8f23cf] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(165,44,180,0.3)] data-[placeholder]:text-white/80 [&_svg]:hidden">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {MOCK_EVENTS.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.eventName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-white" />
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#4b4152]">
                    {selectedEvent.packageName}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#5f5870]">
                    <CalendarDays className="size-4 text-[#8f23cf]" />
                    {formattedEventDate}
                  </p>
                </div>

                <span className="rounded-full border border-[#eadcf6] bg-[#f8f1fd] px-3 py-1 text-xs font-bold tracking-wide text-[#8f23cf] uppercase">
                  {selectedEvent.eventType}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleExportCsv}
                className="rounded-full border-[#e2d4f2] bg-white px-4 text-[#6a3f9c] hover:bg-[#f8f3fd]"
              >
                <Download className="size-4" />
                Export CSV
              </Button>
              <Button
                size="lg"
                onClick={handleDownloadPdf}
                className="rounded-full bg-linear-to-r from-[#f551a8] to-[#8f23cf] px-4 text-white hover:opacity-95"
              >
                <Download className="size-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e7dfef] bg-white shadow-sm">
            <div className="grid h-[168px] grid-cols-4 divide-x divide-[#ece6f3]">
              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#766f84]">
                  <span className="size-2.5 rounded-full bg-[#9d64df] ring-2 ring-[#efe4fb]" />
                  Revenue
                </p>
                <p className="mt-5 font-sans text-5xl font-black tracking-tight text-[#2d2834]">
                  {formatPeso(packagePayment)}
                </p>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#766f84]">
                  <span className="size-2.5 rounded-full bg-[#7db2f8] ring-2 ring-[#e3efff]" />
                  Profit
                </p>
                <p
                  className={`mt-5 font-sans text-5xl font-black tracking-tight ${
                    profitOrRemainingBudget >= 0 ? 'text-[#2d2834]' : 'text-[#c03560]'
                  }`}
                >
                  {formatPeso(profitOrRemainingBudget)}
                </p>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#766f84]">
                  <span className="size-2.5 rounded-full bg-[#d7d6db]" />
                  Package (Per Pax)
                </p>
                <p className="mt-5 font-sans text-5xl font-black tracking-tight text-[#2d2834]">
                  {formatPeso(selectedEvent.packagePerPax)}
                </p>
                <p className="mt-2 text-right text-xs font-semibold text-[#898299]">
                  x {selectedEvent.paxCount} pax
                </p>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#766f84]">
                  <span className="size-2.5 rounded-full bg-[#d7d6db]" />
                  Additional Charges
                </p>
                <p className="mt-5 font-sans text-5xl font-black tracking-tight text-[#2d2834]">
                  {formatPeso(displayedAdditionalCharges)}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#6e6585] transition-colors hover:text-[#4f4760]">
                      View Details
                      <ArrowRight className="size-3" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Additional Charges</DialogTitle>
                    <DialogDescription>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6e6585]">Total Additional Charges</span>
                            <span className="font-semibold">
                              {formatPeso(displayedAdditionalCharges)}
                            </span>
                          </div>

                          <div className="space-y-3 max-h-40 overflow-y-auto mb-2">
                            {additionalItems.length === 0 ? (
                              <div className="text-xs text-muted-foreground">
                                No additional items yet.
                              </div>
                            ) : (
                              additionalItems.map((it) => (
                                <div
                                  key={it.id}
                                  className="flex items-center justify-between gap-3 rounded-md bg-[#fbfbfd] p-2"
                                >
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium text-[#2f2939] truncate">
                                      {it.description}
                                    </div>
                                    <div className="text-xs text-[#8c859d]">
                                      {new Date(Number(it.id)).toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="font-semibold text-sm">
                                      {formatPeso(it.amount)}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      onClick={() => handleRemoveAdditional(it.id)}
                                      className="text-xs text-red-500"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2 items-end">
                            <div>
                              <Label className="text-sm">Description</Label>
                              <Input
                                value={newAddDesc}
                                onChange={(e) => setNewAddDesc(e.target.value)}
                                placeholder="e.g. Extra chairs"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Amount</Label>
                              <Input
                                value={newAddAmount}
                                onChange={(e) => setNewAddAmount(e.target.value)}
                                placeholder="0"
                                type="number"
                              />
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button
                              onClick={handleAddAdditional}
                              className="rounded-full bg-linear-to-r from-[#f551a8] to-[#8f23cf] px-4 py-1 text-white text-sm"
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
                      </div>
                    </DialogDescription>
                    <DialogFooter>
                      <div />
                      <DialogClose asChild>
                        <button className="rounded-full border px-3 py-1">Done</button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
            <Card className="h-[500px] border-[#e7dfef] bg-white py-0 shadow-sm">
              <CardHeader className="pb-1">
                <CardTitle className="font-sans text-xl font-bold text-[#2f2939]">
                  Cost Distribution (Vendors)
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="overflow-hidden rounded-xl border border-[#ebe5f2]">
                  <div className="h-[390px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#ece5f2] bg-[#faf8fb] hover:bg-[#faf8fb]">
                          <TableHead className="h-11 px-6 text-[12px] font-semibold text-[#767086]">
                            Vendor type
                          </TableHead>
                          <TableHead className="h-11 px-6 text-[12px] font-semibold text-[#767086]">
                            Vendor Name
                          </TableHead>
                          <TableHead className="h-11 px-6 text-right text-[12px] font-semibold text-[#767086]">
                            Allocated Cost
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEvent.vendorCharges.map((charge) => (
                          <TableRow key={charge.id} className="border-[#f1ecf6] hover:bg-[#fcfbfd]">
                            <TableCell className="px-6 py-3.5 text-sm font-semibold text-[#4f4760]">
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className="size-2.5 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: getVendorTypeDotColor(charge.category),
                                  }}
                                />
                                {charge.category}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-3.5 text-sm text-[#2f2939]">
                              {charge.name}
                            </TableCell>
                            <TableCell className="px-6 py-3.5 text-right text-sm font-bold text-[#2f2939]">
                              {formatPeso(charge.cost)} (
                              {Math.round((charge.cost / totalVendorCharges) * 100)}%)
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-center pt-1">
                <div className="relative size-44">
                  <svg viewBox="0 0 160 160" className="size-full -rotate-90">
                    <circle cx="80" cy="80" r="62" fill="none" stroke="#f0e9f7" strokeWidth="32" />
                    {donutSegments.map((segment) => (
                      <circle
                        key={segment.label}
                        cx="80"
                        cy="80"
                        r="62"
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="32"
                        strokeDasharray={segment.dashArray}
                        strokeDashoffset={segment.dashOffset}
                        className="cursor-pointer transition-opacity duration-150"
                        opacity={
                          hoveredChartSegmentLabel && hoveredChartSegmentLabel !== segment.label
                            ? 0.42
                            : 1
                        }
                        tabIndex={0}
                        aria-label={`${segment.label}: ${formatPeso(segment.value)} (${segment.percentage.toFixed(1)}%)`}
                        onMouseEnter={() => setHoveredChartSegmentLabel(segment.label)}
                        onMouseLeave={() => setHoveredChartSegmentLabel(null)}
                        onFocus={() => setHoveredChartSegmentLabel(segment.label)}
                        onBlur={() => setHoveredChartSegmentLabel(null)}
                      />
                    ))}
                  </svg>

                  <div className="pointer-events-none absolute inset-[34px] rounded-full bg-white ring-1 ring-[#eee5f6]" />

                  {hoveredChartSegment ? (
                    <div className="pointer-events-none absolute -top-13 left-1/2 -translate-x-1/2 rounded-md bg-[#2d2834] px-2.5 py-1.5 text-center shadow-lg">
                      <p className="text-[11px] font-bold leading-tight text-white">
                        {hoveredChartSegment.label}
                      </p>
                      <p className="text-[10px] leading-tight text-white/90">
                        {formatPeso(hoveredChartSegment.value)} (
                        {hoveredChartSegment.percentage.toFixed(1)}%)
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <Card id="cost-summary" className="border-[#e7dfef] bg-white py-0 shadow-sm">
                <CardHeader className="pb-1">
                  <CardTitle className="font-sans text-lg font-bold text-[#2f2939]">
                    Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pb-4">
                  <div className="flex items-center justify-between text-[15px]">
                    <span className="text-[#766f88]">Revenue</span>
                    <span className="font-bold text-[#2f2939]">{formatPeso(packagePayment)}</span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[15px] text-[#766f88]">Expenses</p>
                    <div className="flex items-center justify-between pl-5 text-[14px]">
                      <span className="text-[#8c859d]">Vendor Costs</span>
                      <span className="font-semibold text-[#2f2939]">
                        {formatPeso(totalVendorCharges)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pl-5 text-[14px]">
                      <span className="text-[#8c859d]">Logistics & Extras</span>
                      <span className="font-semibold text-[#2f2939]">
                        {formatPeso(displayedAdditionalCharges)}
                      </span>
                    </div>
                  </div>

                  <div className="my-1 h-px bg-[#ece4f5]" />

                  <div className="flex items-center justify-between text-[15px] font-bold">
                    <span className="text-[#4d4560]">Total Expenses</span>
                    <span className="text-[#2f2939]">{formatPeso(totalExpenses)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[15px] font-bold">
                    <span className="text-[#4d4560]">Net Profit</span>
                    <span
                      className={netProfitAfterAllCosts >= 0 ? 'text-[#1f8d49]' : 'text-[#c03560]'}
                    >
                      {formatPeso(netProfitAfterAllCosts)} ({netProfitMargin.toFixed(1)}%)
                    </span>
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

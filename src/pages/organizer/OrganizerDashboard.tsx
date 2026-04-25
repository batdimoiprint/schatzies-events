import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardSummary } from '@/api/organizer-dashboard';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type MonthlyValue = {
  month: string;
  value: number;
};

type StatusSlice = {
  label: string;
  value: number;
  eventCount: number;
  color: string;
};

type ListEntry = {
  rank: number;
  title: string;
  subtitle: string;
  date: string;
  badgeColor: string;
};

type KpiCardData = {
  title: string;
  value: string;
  caption: string;
  gradientClassName: string;
  iconBgClassName: string;
  textClassName?: string;
  iconImage: string;
};

const kpiDataSets: Record<string, KpiCardData[]> = {
  Weekly: [
    {
      title: 'Events Completed',
      value: '1',
      caption: '(This week)',
      gradientClassName: 'from-[#cf6ef6] to-[#a536e4]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/Event completed.png',
    },
    {
      title: 'Total Revenue',
      value: 'PHP 15,000',
      caption: '(This week)',
      gradientClassName: 'from-[#f48db3] to-[#e75691]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/TotalRevenue.png',
    },
    {
      title: 'Active Vendors',
      value: '2',
      caption: '(Currently active)',
      gradientClassName: 'from-[#f0df72] to-[#ddc447]',
      iconBgClassName: 'bg-black/10',
      iconImage: '/Pictures/organizerpics/ActiveVendors.png',
    },
    {
      title: 'Total Profit',
      value: 'PHP 8,000',
      caption: '(This week profit)',
      gradientClassName: 'from-[#8cb2f7] to-[#4c7fe3]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/TotalProfit.png',
    },
  ],
  Monthly: [
    {
      title: 'Events Completed',
      value: '4',
      caption: '(Events)',
      gradientClassName: 'from-[#cf6ef6] to-[#a536e4]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/Event completed.png',
    },
    {
      title: 'Total Revenue',
      value: 'PHP 50,000',
      caption: '(Overall)',
      gradientClassName: 'from-[#f48db3] to-[#e75691]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/TotalRevenue.png',
    },
    {
      title: 'Active Vendors',
      value: '4',
      caption: '(Outsourced vendors)',
      gradientClassName: 'from-[#f0df72] to-[#ddc447]',
      iconBgClassName: 'bg-black/10',
      iconImage: '/Pictures/organizerpics/ActiveVendors.png',
    },
    {
      title: 'Total Profit',
      value: 'PHP 50,000',
      caption: '(Overall profit per month)',
      gradientClassName: 'from-[#8cb2f7] to-[#4c7fe3]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/TotalProfit.png',
    },
  ],
  'Semi-Annually': [
    {
      title: 'Events Completed',
      value: '18',
      caption: '(Past 6 months)',
      gradientClassName: 'from-[#cf6ef6] to-[#a536e4]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/Event completed.png',
    },
    {
      title: 'Total Revenue',
      value: 'PHP 350,000',
      caption: '(Past 6 months)',
      gradientClassName: 'from-[#f48db3] to-[#e75691]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/TotalRevenue.png',
    },
    {
      title: 'Active Vendors',
      value: '12',
      caption: '(Total engaged)',
      gradientClassName: 'from-[#f0df72] to-[#ddc447]',
      iconBgClassName: 'bg-black/10',
      iconImage: '/Pictures/organizerpics/ActiveVendors.png',
    },
    {
      title: 'Total Profit',
      value: 'PHP 180,000',
      caption: '(Past 6 months profit)',
      gradientClassName: 'from-[#8cb2f7] to-[#4c7fe3]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/TotalProfit.png',
    },
  ],
  Annually: [
    {
      title: 'Events Completed',
      value: '42',
      caption: '(This year)',
      gradientClassName: 'from-[#cf6ef6] to-[#a536e4]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/Event completed.png',
    },
    {
      title: 'Total Revenue',
      value: 'PHP 850,000',
      caption: '(This year)',
      gradientClassName: 'from-[#f48db3] to-[#e75691]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/TotalRevenue.png',
    },
    {
      title: 'Active Vendors',
      value: '25',
      caption: '(Total engaged)',
      gradientClassName: 'from-[#f0df72] to-[#ddc447]',
      iconBgClassName: 'bg-black/10',
      iconImage: '/Pictures/organizerpics/ActiveVendors.png',
    },
    {
      title: 'Total Profit',
      value: 'PHP 450,000',
      caption: '(This year profit)',
      gradientClassName: 'from-[#8cb2f7] to-[#4c7fe3]',
      iconBgClassName: 'bg-white/25',
      iconImage: '/Pictures/organizerpics/TotalProfit.png',
    },
  ],
};

const calendarDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const calendarMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const calendarLegend = [
  { label: 'Task', color: 'bg-[#e2c341]' },
  { label: 'Meeting', color: 'bg-[#9740d0]' },
  { label: 'Reminder', color: 'bg-[#e54e9d]' },
  { label: 'Event Day', color: 'bg-[#3b28cc]' },
];

function isSameCalendarDay(left: Date | null, right: Date) {
  if (!left) return false;

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function buildCalendarGrid(date: Date): Array<number | null> {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const leadingPadding = Array.from({ length: firstWeekDay }, () => null);
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const trailingCount = (7 - ((leadingPadding.length + monthDays.length) % 7)) % 7;
  const trailingPadding = Array.from({ length: trailingCount }, () => null);

  return [...leadingPadding, ...monthDays, ...trailingPadding];
}

function DashboardMetricCard({
  title,
  value,
  caption,
  gradientClassName,
  textClassName = 'text-white',
  iconImage,
}: KpiCardData) {
  return (
    <Card
      className={`group border-none bg-linear-to-br py-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:brightness-105 cursor-default ${gradientClassName}`}
    >
      <CardContent className={`space-y-6 p-5 ${textClassName}`}>
        <div className="mb-2">
          <img
            src={iconImage}
            alt={title}
            className="size-11 object-contain brightness-0 invert drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="space-y-1">
          <p
            className="text-[15px] font-bold opacity-100 mb-1"
            style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
          >
            {title}
          </p>
          <div className="flex items-baseline justify-between gap-3 mt-1">
            <p
              className="text-4xl font-extrabold tracking-tight leading-none text-white drop-shadow-sm"
              style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
            >
              {value}
            </p>
            <p className="pb-1 text-[11px] font-medium opacity-90">{caption}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScheduleListCard({
  title,
  entries,
  onViewListClick,
}: {
  title: string;
  entries: ListEntry[];
  onViewListClick?: () => void;
}) {
  const visibleEntries = entries.slice(0, 3);
  const hiddenCount = Math.max(0, entries.length - 3);
  const emptySlots = Math.max(0, 3 - visibleEntries.length);

  return (
    <Card className="border-[#e8e4ed] bg-white py-0 shadow-sm">
      <CardHeader className="pt-6 px-6 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-bold text-[#4a4a4a] font-sans">{title}</CardTitle>
          <Button
            className="h-8 px-4 rounded-full bg-[#ff7eb3] text-white hover:bg-[#ff6aa5] transition-colors"
            size="sm"
            onClick={onViewListClick}
          >
            <span className="text-xs font-bold">View List</span>
            {hiddenCount > 0 ? (
              <span className="ml-2 inline-flex items-center rounded-full bg-[#8f1fd0] px-2 py-0.5 text-[10px] font-black leading-none text-white">
                +{hiddenCount}
              </span>
            ) : null}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#e8e0eb] scrollbar-track-transparent pt-3">
          <div className="divide-y divide-[#f0edf4]">
            {visibleEntries.map((entry) => (
              <div
                key={`${entry.rank}-${entry.title}`}
                className="flex items-center justify-between gap-4 bg-white px-5 py-4 hover:bg-[#fafafa] transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${entry.badgeColor}`}
                  >
                    {entry.rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#36303f] font-sans">
                      {entry.title}
                    </p>
                    <p className="truncate text-xs text-[#a8a0b3]">{entry.subtitle}</p>
                  </div>
                </div>
                <p className="shrink-0 text-[10px] font-semibold text-[#d0c8db] whitespace-nowrap">
                  Date: {entry.date}
                </p>
              </div>
            ))}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`empty-slot-${title}-${index}`}
                className="h-[72px] flex items-center justify-center bg-[#fafaf8]/50 px-5 py-4 transition-colors"
              >
                <p className="text-xs font-semibold text-[#d0c8db] italic">
                  -- No additional entries --
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrganizerDashboard() {
  const navigate = useNavigate();
  const [semiAnnualData, setSemiAnnualData] = useState<MonthlyValue[]>([]);
  const [monthlyStatusData, setMonthlyStatusData] = useState<StatusSlice[]>([]);
  const [upcomingEventsData, setUpcomingEventsData] = useState<ListEntry[]>([]);
  const [activeVendorsData, setActiveVendorsData] = useState<ListEntry[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await fetchDashboardSummary();

      if (data) {
        // 1. Map Semi-Annual Graph
        if (data.semiAnnual && data.semiAnnual.monthlyGraph) {
          const mappedSemiAnnual = Object.entries(data.semiAnnual.monthlyGraph).map(
            ([monthNum, value]) => {
              const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ];
              const monthIndex = parseInt(monthNum, 10) - 1;
              return {
                month: monthNames[monthIndex] || monthNum,
                value: value as number,
              };
            }
          );
          setSemiAnnualData(mappedSemiAnnual);
        }

        // 2. Map Monthly Status Donut Chart
        if (data.status && data.status.month) {
          const monthData = data.status.month;
          const total = monthData.planning + monthData.execution + monthData.completed || 1;
          setMonthlyStatusData([
            {
              label: 'Completed',
              value: Math.round((monthData.completed / total) * 100) || 0,
              eventCount: monthData.completed,
              color: '#b964ef',
            },
            {
              label: 'Execution',
              value: Math.round((monthData.execution / total) * 100) || 0,
              eventCount: monthData.execution,
              color: '#ef79b3',
            },
            {
              label: 'Planning',
              value: Math.round((monthData.planning / total) * 100) || 0,
              eventCount: monthData.planning,
              color: '#f4d03f',
            },
          ]);
        }

        // 3. Map Upcoming Events List
        if (data.upcomingEvents && Array.isArray(data.upcomingEvents)) {
          const badgeColors = ['bg-[#db37b4]', 'bg-[#bb2ec4]', 'bg-[#9b24cd]'];
          const mappedEvents = data.upcomingEvents.map((event: any, index: number) => {
            // Format date to MM/DD
            const dateObj = new Date(event.date);
            const formattedDate = isNaN(dateObj.getTime())
              ? 'TBA'
              : `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

            return {
              rank: index + 1,
              title: event.title,
              subtitle: `Status: ${event.status}`,
              date: formattedDate,
              badgeColor: badgeColors[index % badgeColors.length],
            };
          });
          setUpcomingEventsData(mappedEvents);
        }

        // Map Active Vendors List (if provided by the summary API)
        if (data.activeVendors && Array.isArray(data.activeVendors)) {
          const badgeColors = ['bg-[#29bf4c]', 'bg-[#1aa73a]', 'bg-[#158f31]'];
          const mappedVendors = data.activeVendors.map((vendor: any, index: number) => {
            return {
              rank: index + 1,
              title: vendor.name || 'Unknown Vendor',
              subtitle: `${vendor.contactPerson || 'No Contact'} | ${vendor.service || 'Service'}`,
              date: vendor.status || 'Active',
              badgeColor: badgeColors[index % badgeColors.length],
            };
          });
          setActiveVendorsData(mappedVendors);
        }
      }
    };

    loadDashboardData();
  }, []);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [isChartMounted, setIsChartMounted] = useState(false);
  const [hoveredDonut, setHoveredDonut] = useState<StatusSlice | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => today);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [kpiFilter, setKpiFilter] = useState('Monthly');
  const [isKpiDropdownOpen, setIsKpiDropdownOpen] = useState(false);
  const currentKpiCards = kpiDataSets[kpiFilter] || kpiDataSets['Monthly'];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsChartMounted(true);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  const chartMaxValue = 50;
  const donutRadius = 40;
  const donutCircumference = 2 * Math.PI * donutRadius;

  const calendarGrid = useMemo(() => buildCalendarGrid(viewDate), [viewDate]);
  const totalEvents = useMemo(
    () => monthlyStatusData.reduce((sum, slice) => sum + slice.eventCount, 0),
    [monthlyStatusData]
  );

  const goToPreviousMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <section className="pb-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="border-none bg-transparent py-0 shadow-none">
            <CardContent className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#f051a3] via-[#de3bc5] to-[#8f1fd0] p-8 text-white min-h-[220px] flex flex-col justify-center md:pr-72 lg:pr-80">
              <div className="max-w-md relative z-10">
                <h3
                  className={`font-heading text-4xl md:text-5xl font-bold leading-[1.1] transition-all duration-700 ease-out ${isChartMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  Welcome, Kring!
                </h3>
                <p
                  className={`mt-3 text-base font-semibold text-white/90 transition-all duration-700 delay-150 ease-out ${isChartMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  You have a lot of work today, so keep it up.
                </p>
                <p
                  className={`text-base font-semibold text-white/90 transition-all duration-700 delay-[250ms] ease-out ${isChartMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  Shall we start?
                </p>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/organizer/calendar')}
                  className={`mt-6 rounded-full bg-white px-6 py-2 text-xs font-black uppercase tracking-wide text-[#6b2a87] hover:bg-white/90 hover:scale-105 hover:shadow-lg transition-all duration-700 delay-[350ms] ease-out ${isChartMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  View Calendar
                </Button>
              </div>

              <img //yung computer 3D sa dashboard
                src="/Pictures/organizerpics/dashboard-banner.png.png"
                alt="3D computer analytics"
                className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 hidden h-[85%] w-auto object-contain drop-shadow-[0_16px_22px_rgba(69,21,111,0.35)] md:block"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Card className="border-[#e8e3ef] bg-white py-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-[#d0c8db]">
              <CardHeader className="pt-6 pb-4 px-6">
                <CardTitle className="text-lg font-bold text-[#4a4a4a] font-sans">
                  Semi-Annually Completed Events
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-[#9991a7]">
                  Projection of monthly completed events
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex gap-3">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between text-[11px] font-bold text-[#706980] h-64 mt-4 py-[2px]">
                    <span>50</span>
                    <span>40</span>
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                    <span>0</span>
                  </div>

                  {/* Chart area */}
                  <div className="flex-1">
                    <div
                      className="relative h-64 w-full mt-4 flex items-end bg-[#fdfcff]"
                      data-scale-max={chartMaxValue}
                    >
                      {/* Grid lines background */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-2 py-0">
                        {[0, 1, 2, 3, 4].map((line) => (
                          <div
                            key={`grid-line-${line}`}
                            className="border-b border-[#e8e8e8] flex-1"
                          />
                        ))}
                        {/* Bottom solid line (0 line) */}
                        <div className="border-b-2 border-[#2a2a2a]" />
                      </div>

                      {/* Bars container */}
                      <div className="absolute inset-0 flex items-end justify-between px-2">
                        {semiAnnualData.map((monthData, index) => (
                          <div
                            key={`bar-${monthData.month}`}
                            className="flex-1 h-full flex justify-center items-end px-1 sm:px-2 relative group"
                          >
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-[#3d3745] text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap z-10">
                              {monthData.value} Events
                            </div>
                            <div
                              className="w-full bg-[#b964ef] rounded-t-sm cursor-pointer transition-all duration-1000 ease-out hover:bg-[#a04bd9]"
                              style={{
                                height: isChartMounted
                                  ? `${Math.max(5, Math.min((monthData.value / 50) * 100, 100))}%`
                                  : '0%',
                                transitionDelay: `${index * 150}ms`,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Month labels */}
                    <div className="flex justify-between gap-2 px-2 pt-2 text-center">
                      {semiAnnualData.map((monthData) => (
                        <span
                          key={`label-${monthData.month}`}
                          className="flex-1 text-xs font-bold text-[#706980]"
                        >
                          {monthData.month}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sr-only" aria-hidden="true">
                  {semiAnnualData.map((monthData) => (
                    <span key={`value-${monthData.month}`}>
                      {monthData.month}: {monthData.value}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#e8e3ef] bg-white py-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-[#d0c8db]">
              <CardHeader className="pt-6 pb-4 px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-[#4a4a4a] font-sans">
                      Monthly Event Status Chart
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs font-semibold text-[#9991a7]">
                      Percentage number of event status
                    </CardDescription>
                  </div>
                  <img
                    src="/Pictures/organizerpics/Monthly Event Status Chart.png"
                    alt="Chart icon"
                    className="size-5 shrink-0 object-contain"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pb-6">
                <div
                  className={`relative mx-auto size-64 transition-all duration-[1500ms] ease-out ${isChartMounted
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-75 -rotate-45'
                    }`}
                >
                  <svg viewBox="0 0 100 100" className="size-64 -rotate-90">
                    {totalEvents === 0 ? (
                      <circle
                        cx="50"
                        cy="50"
                        r={donutRadius}
                        fill="transparent"
                        stroke="#ece7f2"
                        strokeWidth="20"
                      />
                    ) : (
                      (() => {
                        let cumulativePercent = 0;

                        return monthlyStatusData.map((slice) => {
                          const sliceLength = (slice.value / 100) * donutCircumference;
                          const strokeDasharray = `${sliceLength} ${donutCircumference - sliceLength}`;
                          const strokeDashoffset =
                            donutCircumference - (cumulativePercent / 100) * donutCircumference;
                          const isSliceHovered = hoveredDonut?.label === slice.label;

                          cumulativePercent += slice.value;

                          return (
                            <circle
                              key={slice.label}
                              cx="50"
                              cy="50"
                              r={donutRadius}
                              fill="transparent"
                              stroke={slice.color}
                              strokeWidth="20"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              onMouseEnter={() => setHoveredDonut(slice)}
                              onMouseLeave={() => setHoveredDonut(null)}
                              className="cursor-pointer transition-[transform,opacity] duration-200"
                              style={{
                                transformOrigin: '50% 50%',
                                transform: isSliceHovered ? 'scale(1.03)' : 'scale(1)',
                                opacity: hoveredDonut && !isSliceHovered ? 0.9 : 1,
                              }}
                            />
                          );
                        });
                      })()
                    )}
                  </svg>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    {totalEvents === 0 ? (
                      <>
                        <p className="text-xs font-semibold text-[#8e8797]">Total Events</p>
                        <p className="mt-1 text-4xl font-black leading-none text-[#8e8797]">
                          0 Events
                        </p>
                      </>
                    ) : hoveredDonut ? (
                      <>
                        <p className="text-xs font-semibold text-[#8e8797]">{hoveredDonut.label}</p>
                        <p
                          className="mt-1 text-4xl font-black leading-none"
                          style={{ color: hoveredDonut.color }}
                        >
                          {hoveredDonut.eventCount} Events
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-[#8e8797]">Total Events</p>
                        <p className="mt-1 text-4xl font-black leading-none text-[#3d3745]">
                          {totalEvents}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  {monthlyStatusData.map((slice) => (
                    <div
                      key={slice.label}
                      className="transition-transform duration-200 hover:scale-105 cursor-default"
                    >
                      <p className="text-2xl font-black text-[#3d3745]">{slice.value}%</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#8e8797]">
                        <span
                          className="inline-block size-2 rounded-full"
                          style={{ backgroundColor: slice.color }}
                        />
                        {slice.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-2">
              <div>
                <h3
                  className="text-xl font-bold leading-none text-[#37313f]"
                  style={{ fontFamily: 'Source Sans Pro, sans-serif' }}
                >
                  Key Performance Index
                </h3>
                <p
                  className="mt-1 text-xs font-semibold text-[#9991a7]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Evaluation of events, vendors, and resources
                </p>
              </div>
              <div className="relative">
                <Button
                  onClick={() => setIsKpiDropdownOpen(!isKpiDropdownOpen)}
                  className="flex w-28 items-center justify-between rounded-[10px] border-0 bg-white px-4 py-1.5 text-xs font-semibold text-[#717171] shadow-[0_4px_4px_rgba(0,0,0,0.05)] transition-colors hover:bg-white/95"
                >
                  {kpiFilter}
                  <img
                    src="/Pictures/organizerpics/dropdown.png"
                    alt="dropdown"
                    className={`h-1.5 w-1.5 transition-transform duration-200 ${isKpiDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </Button>
                {isKpiDropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-lg border border-[#e2deea] bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
                    {['Weekly', 'Monthly', 'Semi-Annually', 'Annually'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setKpiFilter(option);
                          setIsKpiDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-xs font-semibold transition-colors hover:bg-[#f6f5f8] ${kpiFilter === option ? 'text-[#df2b80]' : 'text-[#717171]'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {currentKpiCards.map((item) => (
                <DashboardMetricCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-[#e8e4ed] bg-white py-0 shadow-sm">
            <CardHeader className="py-4 px-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col items-center justify-center w-fit">
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-lg font-black leading-none text-[#393341]">
                      {calendarMonths[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-[#c5bdd1] text-center">
                    {selectedDate
                      ? selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      : 'No Date Selected'}
                  </p>
                </div>

                {/* Navigation arrows wrapper */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full text-[#8f879b]"
                    onClick={goToPreviousMonth}
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full text-[#8f879b]"
                    onClick={goToNextMonth}
                    aria-label="Next month"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="rounded-xl border border-[#f0e0e8] bg-white p-0 overflow-hidden">
                <div className="grid grid-cols-7 gap-y-3 bg-[#fce4ec] px-6 py-3 text-center">
                  {calendarDays.map((dayLabel) => (
                    <p key={dayLabel} className="text-[9px] font-black text-black">
                      {dayLabel}
                    </p>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1 px-6 py-2 text-center">
                  {calendarGrid.map((day, index) => {
                    if (day === null) {
                      return (
                        <div key={`calendar-cell-${index}`} className="flex justify-center">
                          <span className="flex size-8 items-center justify-center rounded-md text-transparent">
                            .
                          </span>
                        </div>
                      );
                    }

                    const dayDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                    const isToday = isSameCalendarDay(today, dayDate);
                    const isSelected = isSameCalendarDay(selectedDate, dayDate);

                    return (
                      <div key={`calendar-cell-${index}`} className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => setSelectedDate(dayDate)}
                          aria-pressed={isSelected}
                          title={isToday ? `Today • Day ${day}` : `Day ${day}`}
                          className={[
                            'flex size-8 items-center justify-center rounded-md border text-xs font-sans transition-all duration-150',
                            isSelected
                              ? 'bg-linear-to-br from-[#f051a3] to-[#8f1fd0] text-white font-bold border-transparent'
                              : isToday
                                ? 'bg-[#fce4ec] text-[#7a667f] font-bold border-[#f1c3d7]'
                                : 'text-[#9b8fa8] font-semibold border-transparent hover:bg-[#f4eff8]',
                          ].join(' ')}
                        >
                          <div className="flex flex-col items-center justify-center gap-[2px]">
                            <span>{day}</span>
                            {/* Calendar mini eto then yung sa may Legend na 4 so may Temporary Simulation: Add a purple 'Meeting' dot every 5th day, and a yellow 'Task' dot on the 12th, then dito nyo alisin y ung logic na day % 5 === 0 || day === 12. for API integration */}
                            {day % 5 === 0 || day === 12 ? (
                              <span
                                className={`size-1.5 rounded-full ${day === 12 ? 'bg-[#e2c341]' : 'bg-[#9740d0]'}`}
                              />
                            ) : (
                              <span className="size-1.5" />
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {calendarLegend.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div
                      className={`flex size-4 items-center justify-center rounded-md ${item.color}`}
                    >
                      <svg
                        className="size-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-[#4f4a56]">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ScheduleListCard
            title="Upcoming Events"
            entries={upcomingEventsData}
            onViewListClick={() =>
              navigate('/organizer/event-manager', {
                state: { activeTab: 'Events' },
              })
            }
          />
          <ScheduleListCard
            title="Active Outsourced Vendors"
            entries={activeVendorsData}
            onViewListClick={() =>
              navigate('/organizer/event-manager', {
                state: { activeTab: 'Vendor' },
              })
            }
          />
        </div>
      </div>
    </section>
  );
}

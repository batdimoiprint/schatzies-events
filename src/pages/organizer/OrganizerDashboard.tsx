import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type MonthlyValue = {
  month: string;
  value: number;
};

type StatusSlice = {
  label: string;
  value: number;
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

const semiAnnualCompletions: MonthlyValue[] = [
  { month: 'Jan', value: 21 },
  { month: 'Feb', value: 27 },
  { month: 'Mar', value: 30 },
  { month: 'Apr', value: 32 },
  { month: 'May', value: 37 },
  { month: 'Jun', value: 39 },
];

const monthlyStatus: StatusSlice[] = [
  { label: 'Completed', value: 75, color: '#b964ef' },
  { label: 'Execution', value: 20, color: '#ef79b3' },
  { label: 'On queue', value: 5, color: '#f4d03f' },
];

const upcomingEvents: ListEntry[] = [
  {
    rank: 1,
    title: "Juliana Rox's 18th Birthday",
    subtitle: 'Package | Client name | Contact',
    date: '11/21',
    badgeColor: 'bg-[#db37b4]',
  },
  {
    rank: 2,
    title: 'AngelaFoundHerRaytone',
    subtitle: 'Package | Client name | Contact',
    date: '11/21',
    badgeColor: 'bg-[#bb2ec4]',
  },
  {
    rank: 3,
    title: 'AngelaFoundHerRaytone',
    subtitle: 'Package | Client name | Contact',
    date: '11/21',
    badgeColor: 'bg-[#9b24cd]',
  },
];

const activeVendors: ListEntry[] = [
  {
    rank: 1,
    title: 'Nice Print Photography',
    subtitle: 'Contact person | Email | Contact number',
    date: '11/21',
    badgeColor: 'bg-[#29bf4c]',
  },
  {
    rank: 2,
    title: "Sam's Catering Services",
    subtitle: 'Contact person | Email | Contact number',
    date: '11/21',
    badgeColor: 'bg-[#1aa73a]',
  },
];

const kpiCards: KpiCardData[] = [
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
];

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

function getDonutGradient(slices: StatusSlice[]) {
  let cursor = 0;

  const colorStops = slices.map((slice) => {
    const start = cursor;
    cursor += slice.value;

    return `${slice.color} ${start}% ${cursor}%`;
  });

  return `conic-gradient(${colorStops.join(', ')})`;
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

function ScheduleListCard({ title, entries }: { title: string; entries: ListEntry[] }) {
  const emptySlots = Math.max(0, 3 - entries.length);

  return (
    <Card className="border-[#e8e4ed] bg-white py-0 shadow-sm">
      <CardHeader className="pt-6 px-6 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-bold text-[#4a4a4a] font-sans">{title}</CardTitle>
          <Button
            className="h-8 px-4 rounded-full bg-[#ff7eb3] text-white hover:bg-[#ff6aa5] transition-colors"
            size="sm"
          >
            <span className="text-xs font-bold">View List</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#e8e0eb] scrollbar-track-transparent pt-3">
          <div className="divide-y divide-[#f0edf4]">
            {entries.map((entry) => (
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
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [isChartMounted, setIsChartMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => today);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsChartMounted(true);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  const chartMaxValue = Math.max(...semiAnnualCompletions.map((item) => item.value));

  const calendarGrid = useMemo(() => buildCalendarGrid(viewDate), [viewDate]);
  const yearOptions = useMemo(() => {
    const centerYear = viewDate.getFullYear();
    return Array.from({ length: 11 }, (_, index) => centerYear - 5 + index);
  }, [viewDate]);

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextMonth = Number(event.target.value);
    setViewDate((prev) => new Date(prev.getFullYear(), nextMonth, 1));
  };

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextYear = Number(event.target.value);
    setViewDate((prev) => new Date(nextYear, prev.getMonth(), 1));
  };

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
                  className={`font-heading text-4xl md:text-5xl font-bold leading-[1.1] transition-all duration-700 ease-out ${
                    isChartMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Welcome, Kring!
                </h3>
                <p
                  className={`mt-3 text-base font-semibold text-white/90 transition-all duration-700 delay-150 ease-out ${
                    isChartMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  You have a lot of work today, so keep it up.
                </p>
                <p
                  className={`text-base font-semibold text-white/90 transition-all duration-700 delay-[250ms] ease-out ${
                    isChartMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Shall we start?
                </p>
                <Button
                  variant="secondary"
                  className={`mt-6 rounded-full bg-white px-6 py-2 text-xs font-black uppercase tracking-wide text-[#6b2a87] hover:bg-white/90 transition-all duration-700 delay-[350ms] ease-out ${
                    isChartMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
                  <div className="flex flex-col justify-between text-[11px] font-bold text-[#706980]">
                    <span>50</span>
                    <span>40</span>
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                    <span>0</span>
                  </div>

                  {/* Chart area */}
                  <div className="flex-1">
                    <div className="relative h-64 w-full mt-4 flex items-end bg-[#fdfcff]">
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
                        {semiAnnualCompletions.map((monthData, index) => (
                          <div
                            key={`bar-${monthData.month}`}
                            className="flex-1 h-full flex justify-center items-end px-1 sm:px-2"
                          >
                            <div
                              className="w-full bg-[#800080] rounded-t-sm cursor-pointer transition-all duration-1000 ease-out hover:bg-[#a61ca6]"
                              style={{
                                height: isChartMounted
                                  ? `${Math.max((monthData.value / chartMaxValue) * 100, 5)}%`
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
                      {semiAnnualCompletions.map((monthData) => (
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
                  {semiAnnualCompletions.map((monthData) => (
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
                  className={`relative mx-auto size-64 rounded-full transition-all duration-[1500ms] ease-out ${
                    isChartMounted
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-75 -rotate-45'
                  }`}
                  style={{ background: getDonutGradient(monthlyStatus) }}
                >
                  <div className="absolute inset-16 rounded-full bg-white" />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  {monthlyStatus.map((slice) => (
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
              <Button className="rounded-[10px] border-0 bg-white px-4 py-1.5 text-xs font-semibold text-[#717171] shadow-[0_4px_4px_rgba(0,0,0,0.05)] hover:bg-white/95 flex items-center gap-1">
                Monthly
                <img
                  src="/Pictures/organizerpics/dropdown.png"
                  alt="dropdown"
                  className="w-1.5 h-1.5"
                />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {kpiCards.map((item) => (
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
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="Select month"
                      value={viewDate.getMonth()}
                      onChange={handleMonthChange}
                      className="rounded-md border border-transparent bg-transparent px-2 py-1 text-lg font-black leading-none text-[#393341] outline-none transition-colors hover:bg-[#f5eff9] focus:border-[#e3d8ed] focus:bg-white"
                    >
                      {calendarMonths.map((monthLabel, monthIndex) => (
                        <option key={monthLabel} value={monthIndex}>
                          {monthLabel}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Select year"
                      value={viewDate.getFullYear()}
                      onChange={handleYearChange}
                      className="rounded-md border border-transparent bg-transparent px-2 py-1 text-lg font-black leading-none text-[#393341] outline-none transition-colors hover:bg-[#f5eff9] focus:border-[#e3d8ed] focus:bg-white"
                    >
                      {yearOptions.map((yearValue) => (
                        <option key={yearValue} value={yearValue}>
                          {yearValue}
                        </option>
                      ))}
                    </select>
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
                          {day}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <ScheduleListCard title="Upcoming Events" entries={upcomingEvents} />
          <ScheduleListCard title="Active Outsourced Vendors" entries={activeVendors} />
        </div>
      </div>
    </section>
  );
}

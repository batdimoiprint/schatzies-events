import {
  BriefcaseBusiness,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CirclePercent,
  HandCoins,
  Rocket,
} from 'lucide-react';

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
  Icon: typeof Rocket;
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
    Icon: Calendar,
  },
  {
    title: 'Total Revenue',
    value: 'PHP 50,000',
    caption: '(Overall)',
    gradientClassName: 'from-[#f48db3] to-[#e75691]',
    iconBgClassName: 'bg-white/25',
    Icon: HandCoins,
  },
  {
    title: 'Active Vendors',
    value: '4',
    caption: '(Outsourced vendors)',
    gradientClassName: 'from-[#f0df72] to-[#ddc447]',
    iconBgClassName: 'bg-black/10',
    textClassName: 'text-[#5f4f00]',
    Icon: BriefcaseBusiness,
  },
  {
    title: 'Total Profit',
    value: 'PHP 50,000',
    caption: '(Overall profit per month)',
    gradientClassName: 'from-[#8cb2f7] to-[#4c7fe3]',
    iconBgClassName: 'bg-white/25',
    Icon: CircleDollarSign,
  },
];

const calendarDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const calendarGrid: Array<number | null> = [
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

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
  iconBgClassName,
  textClassName = 'text-white',
  Icon,
}: KpiCardData) {
  return (
    <Card className={`border-none bg-linear-to-br py-0 shadow-sm ${gradientClassName}`}>
      <CardContent className={`space-y-6 p-5 ${textClassName}`}>
        <div className={`flex size-10 items-center justify-center rounded-xl ${iconBgClassName}`}>
          <Icon className="size-5" />
        </div>

        <div className="space-y-1">
          <p className="max-w-40 text-[11px] font-bold uppercase tracking-wide opacity-95">
            {title}
          </p>
          <div className="flex items-end justify-between gap-3">
            <p className="text-4xl font-black leading-none">{value}</p>
            <p className="pb-1 text-[11px] font-semibold opacity-80">{caption}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScheduleListCard({ title, entries }: { title: string; entries: ListEntry[] }) {
  return (
    <Card className="border-[#e8e4ed] bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-[#efeaf5] pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-[22px] font-black text-[#36303f]">{title}</CardTitle>
          <Button
            className="rounded-full bg-linear-to-r from-[#f25ea6] to-[#cc4cd1] px-3 text-[10px] uppercase tracking-wide text-white hover:opacity-90"
            size="sm"
          >
            View List
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {entries.map((entry) => (
          <div
            key={`${title}-${entry.rank}`}
            className="flex items-start gap-3 rounded-xl border border-[#f0edf4] px-2.5 py-2"
          >
            <div
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${entry.badgeColor}`}
            >
              {entry.rank}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[#3b3544]">{entry.title}</p>
              <p className="truncate text-[11px] text-[#8f889a]">{entry.subtitle}</p>
            </div>
            <p className="pt-1 text-[10px] font-semibold text-[#b0a9b9]">{entry.date}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function OrganizerDashboard() {
  const chartMaxValue = Math.max(...semiAnnualCompletions.map((item) => item.value));

  return (
    <section className="pb-2">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card className="border-none bg-transparent py-0 shadow-none">
            <CardContent className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#f051a3] via-[#de3bc5] to-[#8f1fd0] p-6 text-white md:pr-64">
              <div className="max-w-sm">
                <h3 className="font-heading text-5xl font-bold leading-[1.08]">Welcome Kring!</h3>
                <p className="mt-2 text-sm font-semibold text-white/85">
                  You have a lot of work today, so keep it up.
                </p>
                <p className="text-sm font-semibold text-white/85">Shall we start?</p>
                <Button
                  variant="secondary"
                  className="mt-5 rounded-full bg-white px-5 text-xs font-black uppercase tracking-wide text-[#6b2a87] hover:bg-white/90"
                >
                  View Calendar
                </Button>
              </div>

              <img
                src="/3d-computer.png"
                alt="3D computer analytics"
                className="pointer-events-none absolute -bottom-8 right-2 hidden w-63.75 drop-shadow-[0_16px_22px_rgba(69,21,111,0.35)] md:block"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Card className="border-[#e8e3ef] bg-white py-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[21px] font-black text-[#37313f]">
                  Semi-Annually Completed Events
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold text-[#9991a7]">
                  Projection of monthly completed events
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="relative h-53 rounded-xl border border-[#f0ecf5] bg-[#fdfcff] p-3">
                  <div className="pointer-events-none absolute inset-x-3 top-3 bottom-8 grid grid-rows-5">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div
                        key={`line-${line}`}
                        className="border-b border-dashed border-[#eee8f5] last:border-none"
                      />
                    ))}
                  </div>

                  <div className="relative z-10 pt-2">
                    <div className="grid h-34 grid-cols-6 items-end gap-3">
                      {semiAnnualCompletions.map((monthData) => (
                        <div
                          key={`bar-${monthData.month}`}
                          className="flex h-full items-end rounded-t-md bg-[#efe7f9]"
                        >
                          <div
                            className="w-full rounded-t-md bg-linear-to-t from-[#7418ba] to-[#c238f3]"
                            style={{
                              height: `${Math.max((monthData.value / chartMaxValue) * 100, 16)}%`,
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 grid grid-cols-6 gap-3 text-center">
                      {semiAnnualCompletions.map((monthData) => (
                        <span
                          key={`label-${monthData.month}`}
                          className="text-xs font-bold text-[#706980]"
                        >
                          {monthData.month}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="sr-only" aria-hidden="true">
                    {semiAnnualCompletions.map((monthData) => (
                      <span key={`value-${monthData.month}`}>
                        {monthData.month}: {monthData.value}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#e8e3ef] bg-white py-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[21px] font-black text-[#37313f]">
                  Monthly Event Status Chart
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold text-[#9991a7]">
                  Percentage number of event status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                <div
                  className="relative mx-auto size-43"
                  style={{ background: getDonutGradient(monthlyStatus) }}
                >
                  <div className="absolute inset-0 rounded-full" />
                  <div className="absolute inset-0 rounded-full border-8 border-transparent" />
                  <div className="absolute inset-8.25 rounded-full bg-white shadow-inner" />
                  <div className="absolute inset-0 rounded-full" />
                  <div
                    className="size-full rounded-full"
                    style={{ background: getDonutGradient(monthlyStatus) }}
                  />
                  <div className="absolute inset-8.25 rounded-full bg-white" />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  {monthlyStatus.map((slice) => (
                    <div key={slice.label}>
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
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-[30px] font-black leading-none text-[#2e2837]">
                  Key Performance Index
                </h3>
                <p className="text-[11px] font-semibold text-[#8f879f]">
                  Evaluation of events, vendors, and resources
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-xl border-[#e8e1f0] bg-white px-3 text-xs font-semibold text-[#6b6474]"
              >
                Monthly
                <CirclePercent className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {kpiCards.map((item) => (
                <DashboardMetricCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-[#e8e4ed] bg-white py-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-[30px] font-black leading-none text-[#393341]">
                    January 12, 2026
                  </CardTitle>
                  <p className="mt-1 text-xs font-semibold text-[#a59db0]">(Sunday)</p>
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <Button variant="ghost" size="icon-sm" className="rounded-full text-[#8f879b]">
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="rounded-full text-[#8f879b]">
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="rounded-xl border border-[#ebe5f1] bg-[#fdfdfe] p-3">
                <div className="grid grid-cols-7 gap-y-2 text-center">
                  {calendarDays.map((dayLabel) => (
                    <p key={dayLabel} className="text-[10px] font-black text-[#8f889b]">
                      {dayLabel}
                    </p>
                  ))}

                  {calendarGrid.map((day, index) => {
                    const isSelected = day === 16 || day === 17;

                    return (
                      <div key={`calendar-cell-${index}`} className="flex justify-center py-0.5">
                        <span
                          className={[
                            'flex size-8 items-center justify-center rounded-lg text-xs font-semibold',
                            day === null ? 'text-transparent' : 'text-[#706a7f]',
                            isSelected
                              ? 'bg-linear-to-r from-[#f456a4] to-[#e846b4] text-white shadow-sm'
                              : '',
                          ].join(' ')}
                        >
                          {day ?? '.'}
                        </span>
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

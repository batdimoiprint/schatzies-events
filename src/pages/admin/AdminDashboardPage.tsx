
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type AdminKpiCard = {
  title: string;
  value: string;
  caption: string;
  gradientClassName: string;
  iconBgClassName: string;
  iconImage: string;
  textClassName?: string;
};

type AdminListEntry = {
  rank: number;
  title: string;
  subtitle: string;
  date: string;
  badgeColor: string;
};

// Admin-specific data (can be customized further)
const adminKpiCards = [
  {
    title: 'Total Events Completed',
    value: '284',
    caption: '(All time)',
    gradientClassName: 'from-[#6ef6cf] to-[#36e4a5]',
    iconBgClassName: 'bg-white/25',
    iconImage: '/Pictures/organizerpics/Event completed.png',
  },
  {
    title: 'Total Revenue',
    value: 'PHP 1.2M',
    caption: '(This year)',
    gradientClassName: 'from-[#f48db3] to-[#e75691]',
    iconBgClassName: 'bg-white/25',
    iconImage: '/Pictures/organizerpics/TotalRevenue.png',
  },
  {
    title: 'Total Profit',
    value: 'PHP 450K',
    caption: '(This year)',
    gradientClassName: 'from-[#8cb2f7] to-[#4c7fe3]',
    iconBgClassName: 'bg-white/25',
    iconImage: '/Pictures/organizerpics/TotalProfit.png',
  },
  {
    title: 'Active Outsourced Vendors',
    value: '42',
    caption: '(Current)',
    gradientClassName: 'from-[#f0df72] to-[#ddc447]',
    iconBgClassName: 'bg-black/10',
    iconImage: '/Pictures/organizerpics/ActiveVendors.png',
  },
];

const semiAnnualTrends = [
  { name: 'Jan', events: 30 },
  { name: 'Feb', events: 45 },
  { name: 'Mar', events: 60 },
  { name: 'Apr', events: 50 },
  { name: 'May', events: 75 },
  { name: 'Jun', events: 90 },
];

const statusBreakdown = [
  { name: 'Planning', value: 35, color: '#3b82f6' },
  { name: 'Execution', value: 20, color: '#f59e0b' },
  { name: 'Completed', value: 45, color: '#10b981' },
];

const adminUpcomingEvents = [
  {
    rank: 1,
    title: 'Corporate Gala',
    subtitle: 'Organizer | Client | Contact',
    date: '04/25',
    badgeColor: 'bg-[#db37b4]',
  },
  {
    rank: 2,
    title: 'Wedding Expo',
    subtitle: 'Organizer | Client | Contact',
    date: '05/02',
    badgeColor: 'bg-[#bb2ec4]',
  },
];

const adminActiveOrganizers = [
  {
    rank: 1,
    title: 'Kring Events',
    subtitle: 'Contact | Email | Number',
    date: 'Active',
    badgeColor: 'bg-[#29bf4c]',
  },
  {
    rank: 2,
    title: 'Sam Organizers',
    subtitle: 'Contact | Email | Number',
    date: 'Active',
    badgeColor: 'bg-[#1aa73a]',
  },
];

function DashboardMetricCard({
  title,
  value,
  caption,
  gradientClassName,
  iconBgClassName,
  textClassName = 'text-white',
  iconImage,
}: AdminKpiCard) {
  return (
    <Card className={`border-none bg-linear-to-br py-0 shadow-sm ${gradientClassName}`}>
      <CardContent className={`space-y-6 p-5 ${textClassName}`}>
        <div className={`flex size-10 items-center justify-center rounded-xl ${iconBgClassName}`}>
          <img src={iconImage} alt={title} className="size-5 object-contain" />
        </div>
        <div className="space-y-1">
          <p className="max-w-40 text-[11px] font-bold uppercase tracking-wide opacity-95">{title}</p>
          <div className="flex items-end justify-between gap-3">
            <p className="text-4xl font-black leading-none">{value}</p>
            <p className="pb-1 text-[11px] font-semibold opacity-80">{caption}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScheduleListCard({ title, entries }: { title: string; entries: AdminListEntry[] }) {
  return (
    <Card className="border-[#e8e4ed] bg-white py-0 shadow-sm">
      <CardHeader className="pt-10 px-6 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-bold text-[#4a4a4a] font-sans">{title}</CardTitle>
          <Button className="h-8 px-4 rounded-full bg-[#ff7eb3] text-white hover:bg-[#ff6aa5] transition-colors" size="sm">
            <span className="text-xs font-bold">View List</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-[#e8e0eb] scrollbar-track-transparent pt-3">
          <div className="divide-y divide-[#f0edf4]">
            {entries.map((entry) => (
              <div key={`${entry.rank}-${entry.title}`} className="flex items-center justify-between gap-4 bg-white px-5 py-4 hover:bg-[#fafafa] transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#f456a4] to-[#e846b4] text-sm font-black text-white">{entry.rank}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#36303f] font-sans">{entry.title}</p>
                    <p className="truncate text-xs text-[#a8a0b3]">{entry.subtitle}</p>
                  </div>
                </div>
                <p className="shrink-0 text-[10px] font-semibold text-[#d0c8db] whitespace-nowrap">{entry.date}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPage() {
  return (
    <section className="pb-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="border-none bg-transparent py-0 shadow-none">
            <CardContent className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#51a3f0] via-[#3b7cde] to-[#1f4ad0] p-8 text-white md:pr-72">
              <div className="max-w-md">
                <h3 className="font-heading text-6xl font-bold leading-[1.1]">Welcome Admin!</h3>
                <p className="mt-3 text-base font-semibold text-white/90">Here is an overview of the platform's performance.</p>
                <p className="text-base font-semibold text-white/90">Monitor, manage, and grow.</p>
                <Button variant="secondary" className="mt-6 rounded-full bg-white px-6 py-2 text-xs font-black uppercase tracking-wide text-[#2a4a6b] hover:bg-white/90">View Reports</Button>
              </div>
              <img src="/Pictures/organizerpics/dashboard-banner.png.png" alt="Admin dashboard banner" className="pointer-events-none absolute -bottom-12 right-0 hidden w-80 drop-shadow-[0_16px_22px_rgba(21,69,111,0.35)] md:block" />
            </CardContent>
          </Card>

          <div className="mb-6 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-3xl font-black leading-none text-[#2e2837]" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>Key Performance Index</h3>
              <p className="mt-1 text-xs font-semibold text-[#8f879f]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Evaluation of users, events, and organizers</p>
            </div>
            <Button className="rounded-[10px] border-0 bg-white px-4 py-1.5 text-xs font-semibold text-[#717171] shadow-[0_4px_4px_rgba(0,0,0,0.05)] hover:bg-white/95 flex items-center gap-1">Monthly
              <img src="/Pictures/organizerpics/dropdown.png" alt="dropdown" className="w-1.5 h-1.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {adminKpiCards.map((item) => (
              <DashboardMetricCard key={item.title} {...item} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="shadow-sm border-[#e8e4ed]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#4a4a4a]">Semi-annual Event Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={semiAnnualTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="events" fill="#e846b4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#e8e4ed]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#4a4a4a]">Monthly Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <ScheduleListCard title="Upcoming Events" entries={adminUpcomingEvents} />
          <ScheduleListCard title="Active Organizers" entries={adminActiveOrganizers} />
        </div>
      </div>
    </section>
  );
}

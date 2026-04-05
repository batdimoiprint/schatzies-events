import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type EventStatus = 'Completed' | 'Pending' | 'Cancelled';

const eventTableData: Array<{
  id: number;
  title: string;
  date: string;
  timeSlot: string;
  client: string;
  type: string;
  package: string;
  venue: string;
  rsvp: number;
  status: EventStatus;
}> = [
  {
    id: 1,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
  {
    id: 2,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
  {
    id: 3,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
  {
    id: 4,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
  {
    id: 5,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
];

const tabs = ['Events', 'Vendor'];
const activeTab = 'Events';

function getStatusBadgeClasses(status: EventStatus) {
  if (status === 'Completed') return 'bg-[#e8d5f2] text-[#7c3aed]';
  if (status === 'Pending') return 'bg-[#fff5db] text-[#7a5a11]';
  return 'bg-[#ffe8ef] text-[#8f1f4a]';
}

export function EventManagerPage() {
  return (
    <div className="space-y-4 p-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2e2837]">Table List</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                className={`px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#2e2837] text-[#2e2837]'
                    : 'border-transparent text-[#8f879f] hover:text-[#2e2837]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button className="bg-linear-to-r from-[#f051a3] to-[#8f1fd0] text-white font-semibold px-6 py-2 rounded-full text-sm flex items-center gap-2 hover:shadow-lg transition-shadow">
            <img src="/Pictures/organizerpics/Actions.png" alt="Actions" className="h-3 w-3" />
            Actions
          </Button>
          <Button className="bg-linear-to-r from-[#f051a3] to-[#8f1fd0] text-white font-semibold px-6 py-2 rounded-full text-sm flex items-center gap-2 hover:shadow-lg transition-shadow">
            <img
              src="/Pictures/organizerpics/All Status.png"
              alt="All Status"
              className="h-3 w-3"
            />
            All Status
          </Button>
        </div>
      </div>

      <Card className="border-[#ebe6f1]">
        <CardHeader className="space-y-2"></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8e4ed]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    Package
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    Venue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    RSVP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {eventTableData.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-[#f0edf4] hover:bg-[#fafaf8] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-[#2e2837]">{event.title}</td>
                    <td className="px-4 py-3 text-sm text-[#2e2837]">{event.date}</td>
                    <td className="px-4 py-3 text-sm text-[#2e2837]">{event.timeSlot}</td>
                    <td className="px-4 py-3 text-sm text-[#2e2837]">{event.client}</td>
                    <td className="px-4 py-3 text-sm text-[#2e2837]">{event.type}</td>
                    <td className="px-4 py-3 text-sm text-[#2e2837]">{event.package}</td>
                    <td className="px-4 py-3 text-sm text-[#2e2837]">{event.venue}</td>
                    <td className="px-4 py-3 text-sm text-[#2e2837]">{event.rsvp}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

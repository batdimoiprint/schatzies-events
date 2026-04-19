import { useMemo, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { OrganizerLayoutOutletContext } from '@/components/layouts/OrganizerLayout';

type EventStatus = 'Completed' | 'Pending' | 'Cancelled';
type VendorStatus = 'Active' | 'Inactive';

type Event = {
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
};

type Vendor = {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  service: string;
  status: VendorStatus;
};

const eventTableData: Event[] = [
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

const initialVendorData: Vendor[] = [
  {
    id: 1,
    name: 'Nice Print Photography',
    contactPerson: 'Contact person',
    email: 'niceprint@gmail.com',
    phone: '09123456789',
    service: 'Photo & Video',
    status: 'Active',
  },
  {
    id: 2,
    name: "Sam's Catering Services",
    contactPerson: 'Contact person',
    email: 'sams@gmail.com',
    phone: '09123456789',
    service: 'Catering',
    status: 'Active',
  },
  {
    id: 3,
    name: 'XYZ Lights & Sounds',
    contactPerson: 'Contact person',
    email: 'xyz@gmail.com',
    phone: '09123456789',
    service: 'Technical',
    status: 'Inactive',
  },
];

const tabs: Array<'Events' | 'Vendor'> = ['Events', 'Vendor'];

function getStatusBadgeClasses(status: EventStatus) {
  if (status === 'Completed') return 'bg-[#e8d5f2] text-[#7c3aed]';
  if (status === 'Pending') return 'bg-[#fff5db] text-[#7a5a11]';
  return 'bg-[#ffe8ef] text-[#8f1f4a]';
}

function getVendorStatusBadgeClasses(status: VendorStatus) {
  if (status === 'Active') return 'bg-[#e6f4ea] text-[#1e7e34]';
  return 'bg-[#fce8e6] text-[#c5221f]';
}

export function EventManagerPage() {
    const location = useLocation();
  const { searchTerm } = useOutletContext<OrganizerLayoutOutletContext>();
  const [activeTab, setActiveTab] = useState<'Events' | 'Vendor'>(
    location.state?.activeTab || 'Events'
  );
  const [events, setEvents] = useState(eventTableData);
  const [vendors, setVendors] = useState(initialVendorData);

  //sa API ng backend here, pa check if tama hehe
  /*
  useEffect(() => {
    async function fetchDashboardData() {
      // Replace these with actual API calls once backend endpoints are available.
      // const [eventsResponse, vendorsResponse] = await Promise.all([
      //   fetch('/api/events'),
      //   fetch('/api/vendors'),
      // ]);
      // const [eventsData, vendorsData] = await Promise.all([
      //   eventsResponse.json(),
      //   vendorsResponse.json(),
      // ]);
      // setEvents(eventsData);
      // setVendors(vendorsData);
    }
    fetchDashboardData();
  }, []);
  */


  const filteredData = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (activeTab === 'Events') {
      if (!normalizedSearchTerm) {
        return { activeTab: 'Events' as const, data: events };
      }

      const data = events.filter((event) => {
        const searchableFields = [
          event.title,
          event.date,
          event.timeSlot,
          event.client,
          event.type,
          event.package,
          event.venue,
          event.status,
          String(event.rsvp),
        ];

        return searchableFields.some((field) => field.toLowerCase().includes(normalizedSearchTerm));
      });

      return { activeTab: 'Events' as const, data };
    }

    if (!normalizedSearchTerm) {
      return { activeTab: 'Vendor' as const, data: vendors };
    }

    const data = vendors.filter((vendor) => {
      const searchableFields = [
        vendor.name,
        vendor.contactPerson,
        vendor.email,
        vendor.phone,
        vendor.service,
        vendor.status,
      ];

      return searchableFields.some((field) => field.toLowerCase().includes(normalizedSearchTerm));
    });

    return { activeTab: 'Vendor' as const, data };
  }, [activeTab, events, searchTerm, setEvents, setVendors, vendors]);

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
                onClick={() => setActiveTab(tab)}
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
                {activeTab === 'Events' ? (
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
                ) : (
                  <tr className="border-b border-[#e8e4ed]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Contact Person
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Status
                    </th>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredData.activeTab === 'Events'
                  ? filteredData.data.map((event) => (
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
                    ))
                  : filteredData.data.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="border-b border-[#f0edf4] hover:bg-[#fafaf8] transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.name}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.contactPerson}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.email}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.phone}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.service}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getVendorStatusBadgeClasses(
                              vendor.status
                            )}`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                {filteredData.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeTab === 'Events' ? 9 : 6}
                      className="px-4 py-6 text-center text-sm text-[#8f879f]"
                    >
                      No {activeTab.toLowerCase()} found for "{searchTerm.trim()}".
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

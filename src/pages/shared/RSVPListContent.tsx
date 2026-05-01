import { useState, useEffect } from 'react';
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react';
import { getRSVPList } from '@/api/rsvp';
import type { RSVPResponse } from '@/types/rsvp';

interface RSVPListContentProps {
  eventId: string;
  eventTitle?: string;
}

export function RSVPListContent({ eventId, eventTitle }: RSVPListContentProps) {
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchRSVPs = async (id: string) => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const data = await getRSVPList(id);
      // Map snake_case from backend to camelCase for frontend
      const mappedData = data.map((item: any) => ({
        id: item.id || item.guest_id || item._id,
        firstName: item.first_name || item.firstName || '',
        middleName: item.middle_name || item.middleName || '',
        lastName: item.last_name || item.lastName || '',
        contactNumber: item.contact_number || item.contactNumber || '',
        email: item.email || '',
        status:
          item.status === 'ATTENDING'
            ? 'Attending'
            : item.status === 'NOT_ATTENDING'
              ? 'Not Attending'
              : item.status || 'Attending',
        isScanned: !!item.is_scanned || !!item.isScanned || false,
        isVerified: !!item.is_verified || !!item.isVerified || false,
      }));
      // Filter to only show verified guests
      const verifiedGuests = mappedData.filter((guest) => guest.isVerified);
      setRsvps(verifiedGuests);
    } catch (err: any) {
      console.error('Error fetching RSVPs:', err);
      setFetchError('Failed to load guest list from server.');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchRSVPs(eventId);
    }
  }, [eventId]);

  const filteredRsvps = rsvps.filter((rsvp) => {
    const fullName =
      `${rsvp.firstName} ${rsvp.middleName ? rsvp.middleName + ' ' : ''}${rsvp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) || rsvp.contactNumber.includes(searchQuery);
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Attending' && rsvp.status === 'Attending') ||
      (statusFilter === 'Not Attending' && rsvp.status === 'Not Attending') ||
      (statusFilter === 'Arrived' && rsvp.isScanned);
    return matchesSearch && matchesStatus;
  });

  if (!eventId) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 border border-dashed border-gray-200">
        <p className="text-sm text-gray-500 font-medium">Please select an event to view RSVPs.</p>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out] rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6 gap-4">
        <div>
          <h3 className="text-base font-bold text-[#2d2834]">
            {eventTitle ? `Guests for ${eventTitle}` : 'Guest List Responses'}
          </h3>
          <p className="mt-0.5 text-xs text-[#696373]">
            {isFetching
              ? 'Refreshing attendance data...'
              : `${rsvps.length} total responses received`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-[240px]">
            <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
            <input
              type="text"
              placeholder="Search name or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-[#4f4a56] outline-none focus:border-[#df2b80] focus:bg-white transition-all"
            />
          </div>
          <div className="relative">
            <Funnel className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-xs font-medium text-[#4f4a56] outline-none focus:border-[#df2b80] focus:bg-white cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Attending">Attending</option>
              <option value="Not Attending">Not Attending</option>
              <option value="Arrived">Arrived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto p-4 pt-2">
        {fetchError ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-500 font-medium">{fetchError}</p>
            <button
              onClick={() => fetchRSVPs(eventId)}
              className="mt-2 text-xs text-[#df2b80] font-bold hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-bold uppercase tracking-wider text-[#a49cb3]">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Guest Name</th>
                <th className="px-4 py-3">Contact Details</th>
                <th className="px-4 py-3">Arrival Status</th>
                <th className="px-4 py-3 text-center">RSVP Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRsvps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-gray-500 font-medium">No attendees found.</p>
                      <p className="text-xs text-gray-400 italic">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRsvps.map((rsvp, i) => (
                  <tr
                    key={rsvp.id}
                    className="border-b border-gray-50 bg-white transition-all duration-200 hover:bg-pink-50/50"
                  >
                    <td className="px-4 py-4 text-xs font-medium text-[#696373]">{i + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xs font-bold text-white shadow-sm">
                          {rsvp.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#2d2834] leading-tight">
                            {`${rsvp.firstName} ${rsvp.lastName}`}
                          </p>
                          {rsvp.middleName && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{rsvp.middleName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#696373] font-medium">{rsvp.contactNumber}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tight ${
                          rsvp.isScanned
                            ? 'bg-blue-100 text-blue-700'
                            : rsvp.status === 'Not Attending'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {rsvp.isScanned ? 'Arrived' : rsvp.status === 'Not Attending' ? 'Absent' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${
                          rsvp.status === 'Attending'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${rsvp.status === 'Attending' ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        {rsvp.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

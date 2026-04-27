import { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInquiries } from '@/api/inquiries';
import { getOrganizerUsers } from '@/api/users';

import { InquiryDetailsDialog } from '@/components/admin/InquiryDetailsDialog';
import { ScheduleMeetingDialog } from '@/components/admin/ScheduleMeetingDialog';

export function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const {
    data: inquiries = [],
    isLoading: loading,
  } = useQuery<any[]>({
    queryKey: ['inquiries'],
    queryFn: getInquiries,
    refetchInterval: 10000, // polling every 10 seconds
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'eventType' | 'sender' | 'email'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [organizersLoading, setOrganizersLoading] = useState(true);

  const statusCounts = useMemo(() => {
    const counts = {
      total: inquiries.length,
      pending: 0,
      scheduled: 0,
      approved: 0,
    };

    inquiries.forEach((inquiry) => {
      const status = String(inquiry.status || '').toLowerCase();

      if (!status || status === 'new' || status === 'pending review' || status === 'pending') {
        counts.pending += 1;
      }

      if (status === 'meeting scheduled') {
        counts.scheduled += 1;
      }

      if (status === 'approved' || status === 'resolved') {
        counts.approved += 1;
      }
    });

    return counts;
  }, [inquiries]);

  const getStatusBadgeClass = (statusValue?: string) => {
    const status = String(statusValue || '').toLowerCase();

    if (!status || status === 'new' || status === 'pending review' || status === 'pending') {
      return 'bg-[#ff7eb3] hover:bg-[#ff7eb3] text-white';
    }

    if (status === 'in progress' || status === 'requires clarification') {
      return 'bg-amber-100 hover:bg-amber-100 text-amber-700';
    }

    if (status === 'meeting scheduled') {
      return 'bg-[#f7ebff] hover:bg-[#f7ebff] text-[#6f2ea8]';
    }

    if (status === 'resolved' || status === 'approved') {
      return 'bg-emerald-100 hover:bg-emerald-100 text-emerald-700';
    }

    if (status === 'declined') {
      return 'bg-red-100 hover:bg-red-100 text-red-700';
    }

    return 'bg-slate-100 hover:bg-slate-100 text-slate-700';
  };

  const getStatusRank = (statusValue?: string) => {
    const status = String(statusValue || '').toLowerCase();

    if (!status || status === 'new' || status === 'pending review' || status === 'pending')
      return 1;
    if (status === 'in progress' || status === 'requires clarification') return 2;
    if (status === 'meeting scheduled') return 3;
    if (status === 'approved' || status === 'resolved') return 4;
    if (status === 'declined') return 5;

    return 99;
  };

  const filteredAndSortedInquiries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = inquiries.filter((inquiry) => {
      if (!normalizedQuery) return true;

      const searchBucket = [
        inquiry.firstName,
        inquiry.lastName,
        inquiry.email,
        inquiry.eventType,
        inquiry.subject,
        inquiry.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchBucket.includes(normalizedQuery);
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'status') {
        const statusCompare = getStatusRank(a.status) - getStatusRank(b.status);
        if (statusCompare !== 0) {
          return sortOrder === 'asc' ? statusCompare : -statusCompare;
        }
      } else if (sortBy === 'eventType') {
        const typeA = (a.eventType || a.subject || 'Inquiry').toLowerCase();
        const typeB = (b.eventType || b.subject || 'Inquiry').toLowerCase();
        const typeCompare = typeA.localeCompare(typeB);
        if (typeCompare !== 0) {
          return sortOrder === 'asc' ? typeCompare : -typeCompare;
        }
      } else if (sortBy === 'sender') {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        const nameCompare = nameA.localeCompare(nameB);
        if (nameCompare !== 0) {
          return sortOrder === 'asc' ? nameCompare : -nameCompare;
        }
      } else if (sortBy === 'email') {
        const emailA = (a.email || '').toLowerCase();
        const emailB = (b.email || '').toLowerCase();
        const emailCompare = emailA.localeCompare(emailB);
        if (emailCompare !== 0) {
          return sortOrder === 'asc' ? emailCompare : -emailCompare;
        }
      }

      const aDate = new Date(a.date || a.createdAt || 0).getTime();
      const bDate = new Date(b.date || b.createdAt || 0).getTime();
      const dateCompare = aDate - bDate;
      return sortOrder === 'asc' ? dateCompare : -dateCompare;
    });

    return sorted;
  }, [inquiries, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const users = await getOrganizerUsers();
        setOrganizers(users);
      } catch (error) {
        console.error('Failed to fetch organizer users', error);
      } finally {
        setOrganizersLoading(false);
      }
    };

    fetchOrganizers();
  }, []);

  const handleViewDetails = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setIsDialogOpen(true);
  };

  const getOrganizerLabel = (organizerId: string) => {
    if (!organizerId) return 'Unassigned';
    const organizer = organizers.find((user) => user.user_id === organizerId);
    if (!organizer) return organizerId;

    const fullName = [organizer.firstName, organizer.middleName, organizer.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    if (fullName) {
      return organizer.email ? `${fullName} (${organizer.email})` : fullName;
    }

    return organizer.email || organizerId;
  };

  const handleInquiryUpdated = (updatedInquiry: any) => {
    const id = updatedInquiry.id || updatedInquiry._id;
    setSelectedInquiry(updatedInquiry);
    queryClient.setQueryData(['inquiries'], (old: any[] | undefined) =>
      (old || []).map((inq) => ((inq.id || inq._id) === id ? { ...inq, ...updatedInquiry } : inq))
    );
  };

  const toggleSort = (field: 'date' | 'status' | 'eventType' | 'sender' | 'email') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'date' | 'status' | 'eventType' | 'sender' | 'email' }) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4 text-[#8f1fd1]" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-[#8f1fd1]" />
    );
  };

  return (
    <div className="space-y-6 p-4 ">
      {/* Summary */}
      <section className="relative overflow-hidden rounded-2xl border border-[#efe6f6] bg-linear-to-r from-[#fff8fc] via-[#fef9ff] to-[#f4f7ff] p-5 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#f347a5]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 left-20 h-40 w-40 rounded-full bg-[#8f1fd1]/10 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-3 text-2xl font-black text-[#2e2837] md:text-3xl">
              Client Inquiries
            </h1>
            <p className="mt-1 max-w-2xl text-lg font-semibold text-[#8f879f] md:text-[15px]">
              Review incoming requests, schedule discovery meetings, and move clients through your
              booking pipeline.
            </p>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-[#f1e8f7] bg-white/80 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a7ca3]">Total</p>
            <p className="mt-1 text-2xl font-black text-[#2e2837]">{statusCounts.total}</p>
          </div>
          <div className="rounded-xl border border-[#f1e8f7] bg-white/80 p-3">
            <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#8a7ca3]">
              <Clock3 className="h-3.5 w-3.5" /> Pending
            </p>
            <p className="mt-1 text-2xl font-black text-[#2e2837]">{statusCounts.pending}</p>
          </div>
          <div className="rounded-xl border border-[#f1e8f7] bg-white/80 p-3">
            <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#8a7ca3]">
              <CalendarIcon className="h-3.5 w-3.5" /> Scheduled
            </p>
            <p className="mt-1 text-2xl font-black text-[#2e2837]">{statusCounts.scheduled}</p>
          </div>
          <div className="rounded-xl border border-[#f1e8f7] bg-white/80 p-3">
            <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#8a7ca3]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Approved
            </p>
            <p className="mt-1 text-2xl font-black text-[#2e2837]">{statusCounts.approved}</p>
          </div>
        </div>
      </section>
      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#eee7f4] bg-white shadow-[0_8px_30px_rgba(53,36,71,0.06)]">
        <div className="flex flex-col gap-3 border-b border-[#f1eaf7] bg-[#fcf9ff] p-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full">
            <Label
              htmlFor="inquiry-search"
              className="mb-1 block text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]"
            >
              Search
            </Label>
            <Input
              id="inquiry-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, event type, status"
              className="h-9 border-[#e5ddee] bg-white w-full md:max-w-md"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8">
            <p className="text-lg font-semibold text-[#80788f]">Loading inquiries...</p>
          </div>
        ) : filteredAndSortedInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
            <MessageSquareText className="h-10 w-10 text-[#d5c9e4]" />
            <p className="text-base font-bold text-[#5a5368]">No inquiries found.</p>
            <p className="text-lg font-medium text-[#91889f]">
              {inquiries.length > 0
                ? 'Try adjusting your search or sort settings.'
                : 'New client requests will appear here once submitted.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#faf7fd]">
              <TableRow className="border-b border-[#efe7f6]">
                <TableHead 
                  className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390] cursor-pointer hover:text-[#8f1fd1] transition-colors"
                  onClick={() => toggleSort('sender')}
                >
                  <div className="flex items-center">
                    Sender
                    <SortIcon field="sender" />
                  </div>
                </TableHead>
                <TableHead 
                  className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390] cursor-pointer hover:text-[#8f1fd1] transition-colors"
                  onClick={() => toggleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    <SortIcon field="email" />
                  </div>
                </TableHead>
                <TableHead 
                  className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390] cursor-pointer hover:text-[#8f1fd1] transition-colors"
                  onClick={() => toggleSort('eventType')}
                >
                  <div className="flex items-center">
                    Event Type
                    <SortIcon field="eventType" />
                  </div>
                </TableHead>
                <TableHead 
                  className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390] cursor-pointer hover:text-[#8f1fd1] transition-colors"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    <SortIcon field="date" />
                  </div>
                </TableHead>
                <TableHead 
                  className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390] cursor-pointer hover:text-[#8f1fd1] transition-colors"
                  onClick={() => toggleSort('status')}
                >
                  <div className="flex items-center">
                    Event Status
                    <SortIcon field="status" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedInquiries.map((inquiry: any) => (
                <TableRow
                  key={inquiry.id || inquiry._id}
                  className="border-b border-[#f3edf8] hover:bg-[#fcf9ff]"
                >
                  <TableCell className="py-3.5 font-semibold text-lg text-[#2e2837]">
                    {inquiry.firstName} {inquiry.lastName}
                  </TableCell>
                  <TableCell className="text-lg text-[#635a73]">{inquiry.email}</TableCell>
                  <TableCell className="font-semibold text-lg text-[#4e4560]">
                    {inquiry.eventType || inquiry.subject || 'Inquiry'}
                  </TableCell>
                  <TableCell className="font-semibold text-lg text-[#4e4560]">
                    {new Date(inquiry.date || inquiry.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(inquiry.status)}>
                      {inquiry.status || 'New'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-[#e7dff0] bg-white font-bold text-[#5f5472] hover:bg-[#f8f2fd] hover:text-[#4d4360]"
                      onClick={() => handleViewDetails(inquiry)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <InquiryDetailsDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedInquiry={selectedInquiry}
        getOrganizerLabel={getOrganizerLabel}
        organizers={organizers}
        organizersLoading={organizersLoading}
        setIsScheduleModalOpen={setIsScheduleModalOpen}
        onInquiryUpdated={handleInquiryUpdated}
      />

      <ScheduleMeetingDialog
        isScheduleModalOpen={isScheduleModalOpen}
        setIsScheduleModalOpen={setIsScheduleModalOpen}
        organizersLoading={organizersLoading}
        organizers={organizers}
        selectedInquiry={selectedInquiry}
        onInquiryUpdated={handleInquiryUpdated}
      />
    </div>
  );
}

import { formatDisplayTime } from '@/utils/planner-time';

interface OverviewTabProps {
  selectedProject: any;
  selectedEventDetails: any;
  eventAllocation: any;
  eventMeetings: any[];
  overviewFlows: any[];
}

export function OverviewTab({
  selectedProject,
  selectedEventDetails,
  eventAllocation,
  eventMeetings,
  overviewFlows,
}: OverviewTabProps) {
  const dynamicOverviewCards = [
    {
      id: 'overview-package',
      label: 'Event Package',
      value:
        selectedEventDetails?.package?.name ||
        selectedEventDetails?.eventPackage ||
        selectedEventDetails?.eventPackageKey ||
        selectedProject.eventPackage ||
        'N/A',
      imageSrc: '/Pictures/organizerpics/event-package-illustration.png',
      accent: 'text-[#6b2aa5] bg-[#fbf6ff] border-[#eee3fb]',
      valueClassName: 'text-[14px] font-semibold leading-[1.15] text-[#6d677b]',
    },
    {
      id: 'overview-pax',
      label: 'Event Pax',
      value: String(
        selectedEventDetails?.package?.pax ||
          selectedEventDetails?.eventPax ||
          selectedProject.eventPax ||
          '0'
      ),
      imageSrc: '/Pictures/organizerpics/event-pax-illustration.png',
      accent: 'text-[#88511a] bg-[#fff8ef] border-[#f3e2cc]',
      valueClassName: 'text-[32px] font-semibold leading-none tracking-tight text-[#4f4a58]',
    },
    {
      id: 'overview-type',
      label: 'Event Type',
      value: selectedProject.eventType || 'N/A',
      imageSrc: '/Pictures/organizerpics/event-type-illustration.png',
      accent: 'text-[#1f6ea6] bg-[#f3f8ff] border-[#d7e7f7]',
      valueClassName: 'text-[12px] font-semibold leading-[1.15] text-[#6d677b]',
    },
    {
      id: 'overview-cost',
      label: 'Event Cost',
      value: selectedEventDetails?.packageInitialAmount
        ? `₱${Number(selectedEventDetails.packageInitialAmount).toLocaleString('en-PH')}`
        : selectedProject.eventCost
          ? `₱${Number(selectedProject.eventCost).toLocaleString('en-PH')}`
          : '₱0',
      imageSrc: '/Pictures/organizerpics/event-cost-illustration.png',
      accent: 'text-[#a6541d] bg-[#fff4ec] border-[#f3dccb]',
      valueClassName: 'text-[32px] font-semibold leading-none tracking-tight text-[#4f4a58]',
    },
  ];

  return (
    <section className="rounded-[16px] border border-[#d8d3df] bg-[#f7f5f9] p-2.5 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        {dynamicOverviewCards.map((card) => (
          <article
            key={card.id}
            className={`min-h-[74px] rounded-lg border px-3 py-2 shadow-[0_2px_5px_rgba(31,18,54,0.06)] ${card.accent}`}
          >
            <p className="truncate text-[11px] font-semibold text-[#6f687f]">{card.label}</p>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <p
                className={[
                  'min-w-0 flex-1 whitespace-pre-line',
                  card.valueClassName ??
                    'text-[24px] font-black leading-none tracking-tight text-[#2f2b39]',
                ].join(' ')}
              >
                {card.value}
              </p>
              <img
                src={card.imageSrc}
                alt=""
                className="h-9 w-10 shrink-0 object-contain"
                loading="lazy"
              />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="min-h-[400px] flex flex-col rounded-lg border border-[#ded9e7] bg-white p-4 shadow-[0_2px_6px_rgba(31,18,54,0.05)]">
          <p className="text-[14px] font-bold text-[#5e586d] border-b border-[#f0ecf4] pb-2 mb-3">
            Assigned Vendors
          </p>
          <div className="flex-1 overflow-y-auto pr-2 [scrollbar-width:thin] space-y-2">
            {Array.isArray(eventAllocation?.vendors) && eventAllocation.vendors.length > 0 ? (
              eventAllocation.vendors.map((v: any, index: number) => {
                const vendorName = String(v?.name || v?.['name'] || '');
                if (!vendorName) return null;
                return (
                  <div
                    key={index}
                    className="rounded-md border border-[#ece8f0] bg-[#fbf9fe] p-3 text-[12px] leading-snug text-[#6f687f] flex items-center gap-3"
                  >
                    <span className="size-2 shrink-0 rounded-full bg-[#8f1fd1]"></span>
                    <span className="font-bold text-[#3a3442]">{vendorName}</span>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="italic text-[#8b84a0] text-[12px]">No vendors assigned yet.</span>
              </div>
            )}
          </div>
        </article>
        <article className="min-h-[400px] flex flex-col rounded-lg border border-[#ded9e7] bg-white p-4 shadow-[0_2px_6px_rgba(31,18,54,0.05)]">
          <p className="text-[14px] font-bold text-[#5e586d] border-b border-[#f0ecf4] pb-2 mb-3">
            Meetings
          </p>
          <div className="flex-1 space-y-3 text-[12px] leading-snug text-[#6f687f] overflow-y-auto pr-1 [scrollbar-width:thin]">
            <div className="min-h-[120px] rounded-md border border-[#ece8f0] bg-[#fbf9fe] p-3">
              {eventMeetings.length > 0 ? (
                <div className="space-y-2">
                  {eventMeetings.map((meeting, index) => (
                    <div
                      key={meeting.id || meeting._id || `meeting-${index}`}
                      className="flex justify-between items-start border-b border-[#f0ecf4] pb-2 last:border-0 last:pb-0"
                    >
                      <p className="font-semibold text-[#5a546a]">{meeting.title}</p>
                      <p className="text-[11px] font-bold text-[#8c8498] bg-white px-2 py-0.5 rounded border border-[#ece8f0]">
                        {meeting.startTime || meeting.time || ''}{' '}
                        {meeting.endTime ? `- ${meeting.endTime}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-[#8b84a0]">No scheduled meetings yet.</p>
              )}
            </div>
          </div>
        </article>
        <article className="min-h-[400px] flex flex-col rounded-lg border border-[#ded9e7] bg-white p-4 shadow-[0_2px_6px_rgba(31,18,54,0.05)]">
          <p className="text-[14px] font-bold text-[#5e586d] border-b border-[#f0ecf4] pb-2 mb-3">
            Program Flow
          </p>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 [scrollbar-width:thin]">
            {overviewFlows.length > 0 ? (
              overviewFlows.map((flow) => (
                <div
                  key={flow.id}
                  className="grid grid-cols-[90px_1fr] gap-3 text-[11px] leading-snug text-[#6f687f] bg-[#fbf9fe] p-3 rounded-md border border-[#ece8f0]"
                >
                  <p className="font-bold text-[#8a8495] pt-0.5">
                    {formatDisplayTime(flow.from, flow.startHour)}
                    <br />
                    <span className="text-[9px] opacity-70">
                      to {formatDisplayTime(flow.to, flow.endHour)}
                    </span>
                  </p>
                  <div className="border-l-2 border-[#e4dcea] pl-3">
                    <p className="text-[13px] font-black text-[#3a3442]">{flow.title}</p>
                    <p className="mt-1 text-[11.5px] italic text-[#70687e] leading-relaxed">
                      {flow.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[12px] italic text-[#8b84a0]">No program flow scheduled yet.</p>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

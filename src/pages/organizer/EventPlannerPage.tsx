import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  CheckCircle2,
  ClipboardList,
  Download,
  ImagePlus,
  ListChecks,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PlannerTab = 'overview' | 'task' | 'notes' | 'flow' | 'checklist';

type ProjectSlot = {
  id: number;
  title: string;
};

type TaskCard = {
  id: string;
  title: string;
  badge: string;
  accentClassName: string;
  frameClassName: string;
  due: string;
  owner: string;
  items: Array<{
    id: string;
    label: string;
    done: boolean;
  }>;
};

type PlannerQuickNote = {
  id: string;
  title: string;
  body: string;
  imageDataUrl?: string;
};

const projectSlots: ProjectSlot[] = [
  { id: 1, title: "Angela's 18 Birthday" },
  { id: 2, title: '' },
  { id: 3, title: '' },
  { id: 4, title: '' },
  { id: 5, title: '' },
  { id: 6, title: '' },
  { id: 7, title: '' },
];

const tabs: Array<{ id: PlannerTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'task', label: 'Task' },
  { id: 'notes', label: 'Notes' },
  { id: 'flow', label: 'Flow' },
  { id: 'checklist', label: 'Checklist' },
];

const taskCards: TaskCard[] = [
  {
    id: 'task-event-manager',
    title: 'Event Manager',
    badge: 'Operations',
    accentClassName: 'from-[#f6d6e8] to-[#fceef6] text-[#7b2a5c]',
    frameClassName: 'border-[#edd3e4] bg-white',
    due: 'Due: Jan 2, 2026',
    owner: 'Owner: Coordinator Team',
    items: [
      { id: 'em-1', label: 'Confirm program timeline with host', done: true },
      { id: 'em-2', label: 'Finalize entrance and cue sequence', done: false },
      { id: 'em-3', label: 'Assign backstage task leads', done: false },
      { id: 'em-4', label: 'Lock floor plan and guest flow', done: true },
    ],
  },
  {
    id: 'task-rsvp',
    title: 'RSVP Monitoring',
    badge: 'Guest Handling',
    accentClassName: 'from-[#dfe7ff] to-[#eff3ff] text-[#2a4f7b]',
    frameClassName: 'border-[#d7def1] bg-white',
    due: 'Due: Jan 1, 2026',
    owner: 'Owner: RSVP Team',
    items: [
      { id: 'rsvp-1', label: 'Send final RSVP reminder blast', done: true },
      { id: 'rsvp-2', label: 'Follow up VIP non-responders', done: false },
      { id: 'rsvp-3', label: 'Update confirmed headcount sheet', done: false },
      { id: 'rsvp-4', label: 'Sync seat map with latest responses', done: false },
    ],
  },
  {
    id: 'task-vendors',
    title: 'Vendor Coordination',
    badge: 'Suppliers',
    accentClassName: 'from-[#efe3d4] to-[#faf4ea] text-[#7a654d]',
    frameClassName: 'border-[#e6dccf] bg-white',
    due: 'Due: Jan 2, 2026',
    owner: 'Owner: Vendor Lead',
    items: [
      { id: 'ven-1', label: 'Confirm catering arrival time', done: true },
      { id: 'ven-2', label: 'Approve styling mockup revisions', done: false },
      { id: 'ven-3', label: 'Validate AV equipment checklist', done: false },
      { id: 'ven-4', label: 'Receive final supplier permits', done: true },
    ],
  },
  {
    id: 'task-budget',
    title: 'Cost Breakdown',
    badge: 'Finance',
    accentClassName: 'from-[#dff0db] to-[#eef8ea] text-[#5a7335]',
    frameClassName: 'border-[#d5ebce] bg-white',
    due: 'Due: Jan 1, 2026',
    owner: 'Owner: Finance Team',
    items: [
      { id: 'cost-1', label: 'Technicals Manpower', done: true },
      { id: 'cost-2', label: '(2) lighting', done: true },
      { id: 'cost-3', label: 'Fresh Flowers Delivered', done: true },
      { id: 'cost-4', label: 'Dry Run Day 1', done: true },
      { id: 'cost-5', label: 'Dry Run Day 2', done: true },
      { id: 'cost-6', label: 'Approve program outline', done: false },
      { id: 'cost-7', label: 'Guest pass validation', done: false },
    ],
  },
];

const overviewCards = [
  {
    id: 'overview-package',
    label: 'Event Package',
    value: 'Blooms Package',
    imageSrc: '/Pictures/organizerpics/event-package-illustration.png',
    accent: 'text-[#6b2aa5] bg-[#fbf6ff] border-[#eee3fb]',
  },
  {
    id: 'overview-pax',
    label: 'Event Pax',
    value: '40',
    imageSrc: '/Pictures/organizerpics/event-pax-illustration.png',
    accent: 'text-[#88511a] bg-[#fff8ef] border-[#f3e2cc]',
  },
  {
    id: 'overview-type',
    label: 'Event Type',
    value: 'Debut',
    imageSrc: '/Pictures/organizerpics/event-type-illustration.png',
    accent: 'text-[#1f6ea6] bg-[#f3f8ff] border-[#d7e7f7]',
  },
  {
    id: 'overview-cost',
    label: 'Event Cost',
    value: '50,000',
    imageSrc: '/Pictures/organizerpics/event-cost-illustration.png',
    accent: 'text-[#a6541d] bg-[#fff4ec] border-[#f3dccb]',
  },
];

const overviewServiceRequirements = [
  'Classic Buffet',
  '1. Appetizer',
  'Light finger foods and canapes',
  '2. Main Course',
  'Chicken inasal, cordon bleu, and seafood',
  '3. Dessert',
  'Seasonal fruits, mousse cups, and custom cake',
];

const overviewAllocationResources = [
  {
    title: 'Event Coordinator',
    detail: 'Ken Chan',
    time: '08:00 - 08:00',
  },
  {
    title: 'Host',
    detail: 'Angel U. Nicorn',
    time: '08:00 - 08:00',
  },
  {
    title: 'Technicals',
    detail:
      '1. Audio Cue\n2. Lighting Cue\n3. Visual/Screen Cue\n4. System Tech/Troubleshooter\n5. Dry Run Team',
    time: '',
  },
];

const overviewMeetings = ['Meeting 1 | 2hrs Coffee', 'Meeting 2 | 2hrs Coffee', 'Meeting 3 | 2hrs'];

const overviewChecklist = [
  'Technical manpower',
  'Lights and trussing',
  'Fresh flowers delivered',
  'Dry run DAY1',
  'Dry run DAY2',
];

function FlowNotesBoard() {
  const timelineStartHour = 5;
  const timelineEndHour = 11;
  const hourRowHeight = 58;
  const minAllowedTime = '05:00';
  const maxAllowedTime = '11:00';

  const [timelineBlocks, setTimelineBlocks] = useState([
    {
      id: 'timeline-primary',
      title: 'Guests Welcoming & Opening Ceremony',
      from: '05:00',
      to: '06:00',
      description:
        'Lorem ipsum sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum.',
      startHour: 5,
      endHour: 6,
      left: '2%',
      width: '27%',
      tone: 'bg-[#d7d7d7]',
    },
    {
      id: 'timeline-secondary',
      title: 'Example',
      from: '08:00',
      to: '09:00',
      description: 'Description',
      startHour: 8,
      endHour: 9,
      left: '31%',
      width: '26%',
      tone: 'bg-[#cfcfcf]',
    },
    {
      id: 'timeline-third',
      title: 'Example',
      from: '10:00',
      to: '11:00',
      description: 'Description',
      startHour: 10,
      endHour: 11,
      left: '2%',
      width: '27%',
      tone: 'bg-[#d7d7d7]',
    },
  ]);

  const [isActivityInfoOpen, setIsActivityInfoOpen] = useState(false);
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [hideEmptySlots, setHideEmptySlots] = useState(false);
  const [hideScheduleSummary, setHideScheduleSummary] = useState(false);
  const [activityDraft, setActivityDraft] = useState({
    title: '',
    from: '',
    to: '',
    description: '',
    startHour: 5,
    endHour: 6,
    left: '2%',
    width: '27%',
    tone: 'bg-[#d7d7d7]',
  });

  const timelineHours = Array.from(
    { length: timelineEndHour - timelineStartHour + 1 },
    (_, index) => timelineStartHour + index
  );

  const visibleHours = useMemo(() => {
    if (!hideEmptySlots) {
      return timelineHours;
    }

    return timelineHours.filter((hour) =>
      timelineBlocks.some((block) => hour >= block.startHour && hour < block.endHour)
    );
  }, [hideEmptySlots, timelineHours, timelineBlocks]);

  const hourIndexMap = useMemo(() => {
    return new Map(visibleHours.map((hour, index) => [hour, index]));
  }, [visibleHours]);

  const selectedActivity = selectedActivityId
    ? (timelineBlocks.find((block) => block.id === selectedActivityId) ?? null)
    : null;

  const formatTimeInput = (hour: number, minute = 0) => {
    const normalizedHour = String(Math.min(Math.max(hour, 0), 23)).padStart(2, '0');
    const normalizedMinute = String(Math.min(Math.max(minute, 0), 59)).padStart(2, '0');
    return `${normalizedHour}:${normalizedMinute}`;
  };

  const toTimeInputValue = (value: string, fallbackHour: number) => {
    const directMatch = value.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
    if (directMatch) {
      return value.trim();
    }

    const ampmMatch = value.trim().match(/^(\d{1,2})(?::([0-5]\d))?\s*(AM)$/i);
    if (ampmMatch) {
      const rawHour = Number(ampmMatch[1]);
      const minute = Number(ampmMatch[2] ?? '0');
      const convertedHour = rawHour % 12 === 0 ? 12 : rawHour % 12;
      return formatTimeInput(convertedHour, minute);
    }

    return formatTimeInput(fallbackHour, 0);
  };

  const parseHourFromTimeInput = (value: string, fallback: number) => {
    const normalized = toTimeInputValue(value, fallback);
    const match = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
    if (!match) {
      return fallback;
    }

    return Number(match[1]);
  };

  const clampTimeInputRange = (value: string, minValue: string, maxValue: string) => {
    if (value < minValue) {
      return minValue;
    }
    if (value > maxValue) {
      return maxValue;
    }
    return value;
  };

  const formatDisplayTime = (value: string, fallbackHour: number) => {
    const normalized = toTimeInputValue(value, fallbackHour);
    const match = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
    if (!match) {
      return normalized;
    }

    const hour24 = Number(match[1]);
    const minute = match[2];
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12}:${minute} AM`;
  };

  const openActivityInfo = (activityId: string) => {
    const activity = timelineBlocks.find((block) => block.id === activityId);
    if (!activity) {
      return;
    }

    setSelectedActivityId(activity.id);
    setActivityDraft({
      title: activity.title,
      from: clampTimeInputRange(
        toTimeInputValue(activity.from, activity.startHour),
        minAllowedTime,
        maxAllowedTime
      ),
      to: clampTimeInputRange(
        toTimeInputValue(activity.to, activity.endHour),
        minAllowedTime,
        maxAllowedTime
      ),
      description: activity.description,
      startHour: activity.startHour,
      endHour: activity.endHour,
      left: activity.left,
      width: activity.width,
      tone: activity.tone,
    });
    setIsEditingActivity(false);
    setIsActivityInfoOpen(true);
  };

  const openCreateActivity = () => {
    setSelectedActivityId(null);
    setActivityDraft({
      title: '',
      from: '05:00',
      to: '06:00',
      description: '',
      startHour: 5,
      endHour: 6,
      left: '2%',
      width: '27%',
      tone: 'bg-[#d7d7d7]',
    });
    setIsEditingActivity(true);
    setIsActivityInfoOpen(true);
  };

  const handleDeleteActivity = (activityId: string) => {
    setTimelineBlocks((previous) => previous.filter((block) => block.id !== activityId));
    if (selectedActivityId === activityId) {
      setSelectedActivityId(null);
      setIsActivityInfoOpen(false);
      setIsEditingActivity(false);
    }
  };

  const handleSaveActivity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedFromInput = clampTimeInputRange(
      toTimeInputValue(activityDraft.from, activityDraft.startHour),
      minAllowedTime,
      maxAllowedTime
    );
    const normalizedToInput = clampTimeInputRange(
      toTimeInputValue(activityDraft.to, activityDraft.endHour),
      minAllowedTime,
      maxAllowedTime
    );

    const parsedStartHour = parseHourFromTimeInput(normalizedFromInput, activityDraft.startHour);
    const parsedEndHour = parseHourFromTimeInput(normalizedToInput, activityDraft.endHour);
    const normalizedStartHour = Math.min(
      Math.max(parsedStartHour, timelineStartHour),
      timelineEndHour
    );
    const normalizedEndHour = Math.min(
      Math.max(parsedEndHour, normalizedStartHour + 1),
      timelineEndHour
    );

    const nextId = selectedActivityId ?? `timeline-${Date.now()}`;
    const nextActivity = {
      id: nextId,
      title: activityDraft.title.trim() || 'Example',
      from: normalizedFromInput || formatTimeInput(normalizedStartHour),
      to: normalizedToInput || formatTimeInput(normalizedEndHour),
      description: activityDraft.description.trim() || 'Description',
      startHour: normalizedStartHour,
      endHour: normalizedEndHour,
      left: activityDraft.left,
      width: activityDraft.width,
      tone: activityDraft.tone,
    };

    setTimelineBlocks((previous) => {
      if (selectedActivityId) {
        return previous.map((block) => (block.id === selectedActivityId ? nextActivity : block));
      }

      return [...previous, nextActivity];
    });

    setSelectedActivityId(nextId);
    setIsEditingActivity(false);
    setIsActivityInfoOpen(false);
  };

  const handleAddSummary = () => {
    const nextId = `timeline-${Date.now()}`;
    const nextActivity = {
      id: nextId,
      title: 'Description Here',
      from: '07:00',
      to: '08:00',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum.',
      startHour: 7,
      endHour: 8,
      left: '2%',
      width: '27%',
      tone: 'bg-[#d7d7d7]',
    };

    setTimelineBlocks((previous) => [...previous, nextActivity]);
  };

  const scheduleSummaries = useMemo(() => {
    return [...timelineBlocks]
      .sort((a, b) => a.startHour - b.startHour)
      .map((block) => ({
        id: block.id,
        timeRange: `${formatDisplayTime(block.from, block.startHour)} - ${formatDisplayTime(
          block.to,
          block.endHour
        )}`,
        title: block.title,
        body: block.description,
      }));
  }, [timelineBlocks]);

  const handleExportSummary = () => {
    const header = ['Time Range', 'Title', 'Description'];
    const rows = scheduleSummaries.map((summary) => [
      summary.timeRange,
      summary.title,
      summary.body,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedule-summary.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="rounded-2xl border border-[#ddd8e8] bg-white p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b94a7]">
            Flow
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHideScheduleSummary((prev) => !prev)}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#d6d1dc] bg-white px-3 text-[11px] font-bold text-[#5a5470]"
            >
              {hideScheduleSummary ? 'Show Summary' : 'Hide Summary'}
            </button>
            <button
              type="button"
              onClick={openCreateActivity}
              className="inline-flex h-7 items-center gap-1.5 rounded-md bg-[#8f1fd1] px-3 text-[11px] font-bold text-white shadow-[0_4px_10px_rgba(143,31,209,0.3)]"
            >
              <Plus className="size-3.5" />
              Add
            </button>
            <button
              type="button"
              onClick={handleExportSummary}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#d6d1dc] bg-white px-3 text-[11px] font-bold text-[#5a5470]"
            >
              <Download className="size-3.5" />
              Export
            </button>
          </div>
        </div>

        <div
          className={[
            'grid gap-4',
            hideScheduleSummary ? 'grid-cols-1' : 'xl:grid-cols-[minmax(0,1fr)_280px]',
          ].join(' ')}
        >
          <article className="overflow-hidden rounded-xl border border-[#e2dee9] bg-white">
            <div className="flex flex-wrap items-start justify-between gap-2 px-5 py-3">
              <div>
                <h4 className="text-[13px] font-black leading-tight text-[#2f2b39]">
                  JANUARY 3, 2025
                </h4>
                <p className="text-[10px] font-semibold text-[#6d6679]">Event Flow</p>
              </div>

              <label className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#9b94a7]">
                <span>Hide empty time slots</span>
                <input
                  type="checkbox"
                  checked={hideEmptySlots}
                  onChange={(event) => setHideEmptySlots(event.target.checked)}
                  className="size-3 cursor-pointer rounded border-[#c9c2d2]"
                />
              </label>
            </div>

            <div className="grid grid-cols-[56px_minmax(0,1fr)] border-t border-[#ece8f0]">
              <div className="bg-white">
                {visibleHours.map((hour) => {
                  const labelHour = hour === 12 ? 12 : ((hour + 11) % 12) + 1;
                  return (
                    <div
                      key={hour}
                      className="flex items-start justify-end border-b border-[#ece8f0] pr-2 pt-2 text-[10px] font-semibold text-[#8e8796]"
                      style={{ height: `${hourRowHeight}px` }}
                    >
                      {labelHour}AM
                    </div>
                  );
                })}
              </div>

              <div className="relative overflow-x-auto overflow-y-auto">
                <div
                  className="relative min-w-[720px]"
                  style={{ height: `${visibleHours.length * hourRowHeight}px` }}
                >
                  {visibleHours.map((hour, index) => (
                    <div
                      key={`${hour}-line`}
                      className="absolute left-0 right-0 border-t border-[#ece8f0]"
                      style={{ top: `${index * hourRowHeight}px` }}
                    />
                  ))}

                  {timelineBlocks.map((block) => {
                    const visibleDuration = visibleHours.filter(
                      (hour) => hour >= block.startHour && hour < block.endHour
                    ).length;
                    const startIndex =
                      hourIndexMap.get(block.startHour) ??
                      visibleHours.findIndex((hour) => hour >= block.startHour);

                    if (startIndex < 0 || visibleDuration === 0) {
                      return null;
                    }

                    const duration = Math.max(1, visibleDuration);

                    return (
                      <article
                        key={block.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openActivityInfo(block.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openActivityInfo(block.id);
                          }
                        }}
                        className="absolute overflow-hidden rounded-sm border border-[#cfcfcf] bg-[#dedede] px-2.5 py-1.5 text-[#5f596b]"
                        style={{
                          top: `${startIndex * hourRowHeight + 2}px`,
                          height: `${duration * hourRowHeight - 4}px`,
                          left: block.left,
                          width: block.width,
                          zIndex: block.id === selectedActivityId ? 30 : 10,
                        }}
                      >
                        <p className="truncate text-[10px] font-black uppercase leading-tight text-[#4e4858]">
                          {block.title}
                        </p>
                        <p className="mt-1 truncate text-[10px] font-semibold leading-tight text-[#6d667a]">
                          Time: {formatDisplayTime(block.from, block.startHour)} -{' '}
                          {formatDisplayTime(block.to, block.endHour)}
                        </p>
                        <p className="mt-1 truncate text-[10px] leading-tight text-[#6c6678]">
                          {block.description}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>

          {!hideScheduleSummary ? (
            <aside className="rounded-xl border border-[#e2dee9] bg-white px-4 py-3">
              <p className="text-[12px] font-black uppercase tracking-[0.12em] text-[#6b6476]">
                Schedule Summary
              </p>

              <div className="mt-4 space-y-5 border-l border-[#ebe6f0] pl-4">
                {scheduleSummaries.map((summary) => (
                  <div key={summary.id} className="grid grid-cols-[92px_1fr] gap-4">
                    <p className="text-[10px] font-semibold text-[#6b6476]">{summary.timeRange}</p>
                    <div>
                      <p className="text-[12px] font-black text-[#2f2b39]">{summary.title}</p>
                      <p className="mt-1 text-[11px] italic leading-relaxed text-[#8a8495]">
                        {summary.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddSummary}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#d6d1dc] bg-white py-2 text-[11px] font-bold text-[#5a5470]"
              >
                <Plus className="size-3.5" />
                Add summary
              </button>
            </aside>
          ) : null}
        </div>
      </section>

      <Dialog
        open={isActivityInfoOpen}
        onOpenChange={(open) => {
          setIsActivityInfoOpen(open);
          if (!open) {
            setIsEditingActivity(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-1rem)] rounded-2xl border border-[#e3dfea] bg-white p-0 sm:max-w-[560px]"
        >
          <form className="px-6 py-5" onSubmit={handleSaveActivity}>
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#eee9f2] pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingActivity && selectedActivity) {
                      setIsEditingActivity(false);
                      return;
                    }
                    setIsActivityInfoOpen(false);
                  }}
                  className="inline-flex size-8 items-center justify-center rounded-full text-[#aba3b9] transition hover:bg-[#f2eff6]"
                  aria-label="Back"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <div>
                  <h3 className="text-[30px] font-black leading-none tracking-tight text-[#1f1f21]">
                    {isEditingActivity
                      ? selectedActivity
                        ? 'Edit Activity'
                        : 'New Activity'
                      : 'Activity Info'}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#b0a9bc]">
                    Event Flow
                  </p>
                </div>
              </div>

              {isEditingActivity ? (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedActivity) {
                        setActivityDraft({
                          title: selectedActivity.title,
                          from: selectedActivity.from,
                          to: selectedActivity.to,
                          description: selectedActivity.description,
                          startHour: selectedActivity.startHour,
                          endHour: selectedActivity.endHour,
                          left: selectedActivity.left,
                          width: selectedActivity.width,
                          tone: selectedActivity.tone,
                        });
                        setIsEditingActivity(false);
                      } else {
                        setIsActivityInfoOpen(false);
                      }
                    }}
                    className="inline-flex h-8 items-center rounded-full border border-[#e5deec] px-3 text-xs font-black text-[#7f7791] transition hover:bg-[#f7f3fb]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex h-8 items-center rounded-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] px-4 text-xs font-black text-white"
                  >
                    Save
                  </button>
                </div>
              ) : selectedActivity ? (
                <div className="flex items-center gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingActivity(true)}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-[#f5d9e7] text-[#f33d93] transition hover:bg-[#fdf0f6]"
                    aria-label="Edit activity"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectedActivity && handleDeleteActivity(selectedActivity.id)}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-[#f5d9e7] text-[#f33d93] transition hover:bg-[#fdf0f6]"
                    aria-label="Delete activity"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ) : null}
            </div>

            {isEditingActivity ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-black text-[#8c8599]">Title</Label>
                  <Input
                    value={activityDraft.title}
                    onChange={(event) =>
                      setActivityDraft((previous) => ({ ...previous, title: event.target.value }))
                    }
                    placeholder="Enter activity title"
                    className="mt-2 h-10 rounded-lg border border-[#e5deec] bg-[#f7f5fa] text-sm text-[#4d4a54] shadow-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-black text-[#8c8599]">From</Label>
                    <Input
                      type="time"
                      value={activityDraft.from}
                      onChange={(event) =>
                        setActivityDraft((previous) => ({
                          ...previous,
                          from: clampTimeInputRange(
                            toTimeInputValue(event.target.value, previous.startHour),
                            minAllowedTime,
                            maxAllowedTime
                          ),
                        }))
                      }
                      min={minAllowedTime}
                      max={maxAllowedTime}
                      step={1800}
                      className="mt-2 h-10 rounded-lg border border-[#e5deec] bg-[#f7f5fa] text-sm text-[#4d4a54] shadow-none"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-black text-[#8c8599]">To</Label>
                    <Input
                      type="time"
                      value={activityDraft.to}
                      onChange={(event) =>
                        setActivityDraft((previous) => ({
                          ...previous,
                          to: clampTimeInputRange(
                            toTimeInputValue(event.target.value, previous.endHour),
                            minAllowedTime,
                            maxAllowedTime
                          ),
                        }))
                      }
                      min={minAllowedTime}
                      max={maxAllowedTime}
                      step={1800}
                      className="mt-2 h-10 rounded-lg border border-[#e5deec] bg-[#f7f5fa] text-sm text-[#4d4a54] shadow-none"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-black text-[#8c8599]">Description</Label>
                  <textarea
                    value={activityDraft.description}
                    onChange={(event) =>
                      setActivityDraft((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Add activity details"
                    className="mt-2 h-24 w-full resize-none rounded-lg border border-[#e5deec] bg-[#f7f5fa] px-3 py-2 text-sm text-[#4d4a54] outline-none"
                  />
                </div>
              </div>
            ) : selectedActivity ? (
              <div className="space-y-4">
                <div className="rounded-md bg-[#f1dce8] px-3 py-2 text-base font-black leading-tight text-[#2f2b39]">
                  {selectedActivity.title}
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#ebe5f1] bg-[#faf8fc] px-3 py-2.5 text-sm">
                  <p>
                    <span className="font-bold text-[#9d97a8]">From</span>
                    <span className="ml-2 font-black text-[#2f2b39]">
                      {formatDisplayTime(selectedActivity.from, selectedActivity.startHour)}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold text-[#9d97a8]">To</span>
                    <span className="ml-2 font-black text-[#2f2b39]">
                      {formatDisplayTime(selectedActivity.to, selectedActivity.endHour)}
                    </span>
                  </p>
                </div>

                <div className="rounded-lg border border-[#ebe5f1] bg-[#faf8fc] px-3 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#9d97a8]">
                    Description
                  </p>
                  <p className="mt-2 text-[14px] italic leading-snug text-[#8e8994]">
                    {selectedActivity.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#e5deec] bg-[#faf8fc] px-3 py-6 text-center">
                <p className="text-sm font-semibold text-[#7f7a89]">
                  Select an activity card to view details.
                </p>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const initialPlannerNotes: PlannerQuickNote[] = [
  {
    id: 'note-requests',
    title: 'Requests',
    body: 'Strict timeline\nrequested by parents',
  },
  {
    id: 'note-catering',
    title: 'Catering',
    body: 'Avoid serving nuts\n(guest allergy concern)',
  },
];

const overviewScheduleSummary = [
  {
    id: 'overview-summary-1',
    timeRange: '7:00AM - 9:00AM',
    title: 'Description Here',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum.',
  },
  {
    id: 'overview-summary-2',
    timeRange: '00:00 - 00:00',
    title: 'Description Here',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum.',
  },
  {
    id: 'overview-summary-3',
    timeRange: '00:00 - 00:00',
    title: 'Description Here',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum.',
  },
  {
    id: 'overview-summary-4',
    timeRange: '00:00 - 00:00',
    title: 'Description Here',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis viverra bibendum.',
  },
];

export function EventPlannerPage() {
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [activeTab, setActiveTab] = useState<PlannerTab>('task');
  const [plannerTaskCards, setPlannerTaskCards] = useState<TaskCard[]>(taskCards);
  const [checklistDeleteTarget, setChecklistDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [checklistDeleteValidation, setChecklistDeleteValidation] = useState('');
  const [checklistDeleteError, setChecklistDeleteError] = useState('');
  const [plannerNotes, setPlannerNotes] = useState<PlannerQuickNote[]>(initialPlannerNotes);
  const [noteDraftTitle, setNoteDraftTitle] = useState('');
  const [noteDraftBody, setNoteDraftBody] = useState('');
  const [noteDraftImageDataUrl, setNoteDraftImageDataUrl] = useState<string | undefined>(undefined);
  const [noteDraftError, setNoteDraftError] = useState('');
  const [editingPlannerNoteId, setEditingPlannerNoteId] = useState<string | null>(null);

  const selectedProject = useMemo(() => {
    return projectSlots.find((project) => project.id === selectedProjectId) ?? projectSlots[0];
  }, [selectedProjectId]);

  const resetNoteDraft = () => {
    setNoteDraftTitle('');
    setNoteDraftBody('');
    setNoteDraftImageDataUrl(undefined);
    setNoteDraftError('');
    setEditingPlannerNoteId(null);
  };

  const handlePlannerNoteImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setNoteDraftError('Please select an image file only.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNoteDraftError('Image is too large. Please use a file under 5MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNoteDraftImageDataUrl(reader.result);
        setNoteDraftError('');
      }
    };
    reader.readAsDataURL(file);

    // Allow selecting the same file again after removal.
    event.target.value = '';
  };

  const handleSavePlannerNote = () => {
    const normalizedTitle = noteDraftTitle.trim();
    const normalizedBody = noteDraftBody.trim();

    if (!normalizedTitle && !normalizedBody && !noteDraftImageDataUrl) {
      return;
    }

    const nextNote: PlannerQuickNote = {
      id: editingPlannerNoteId ?? `note-${Date.now()}`,
      title: normalizedTitle || 'Untitled',
      body: normalizedBody || 'No details provided.',
      imageDataUrl: noteDraftImageDataUrl ?? undefined,
    };

    setPlannerNotes((previousNotes) => {
      if (editingPlannerNoteId) {
        return previousNotes.map((note) => (note.id === editingPlannerNoteId ? nextNote : note));
      }

      return [nextNote, ...previousNotes];
    });

    resetNoteDraft();
  };

  const handleEditPlannerNote = (note: PlannerQuickNote) => {
    setEditingPlannerNoteId(note.id);
    setNoteDraftTitle(note.title);
    setNoteDraftBody(note.body);
    setNoteDraftImageDataUrl(note.imageDataUrl ?? undefined);
    setNoteDraftError('');
  };

  const handleDeletePlannerNote = (noteId: string) => {
    setPlannerNotes((previousNotes) => previousNotes.filter((note) => note.id !== noteId));

    if (editingPlannerNoteId === noteId) {
      resetNoteDraft();
    }
  };

  const handleToggleTaskItem = (cardId: string, itemId: string) => {
    setPlannerTaskCards((previousCards) =>
      previousCards.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        return {
          ...card,
          items: card.items.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          ),
        };
      })
    );
  };

  const handleCompleteTaskCard = (cardId: string) => {
    setPlannerTaskCards((previousCards) =>
      previousCards.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        return {
          ...card,
          items: card.items.map((item) => ({ ...item, done: true })),
        };
      })
    );
  };

  const checklistTaskCard = useMemo(() => {
    return plannerTaskCards.find((card) => card.id === 'task-budget') ?? null;
  }, [plannerTaskCards]);

  const checklistItems = checklistTaskCard?.items ?? [];

  const handleAddChecklistItem = () => {
    if (!checklistTaskCard) {
      return;
    }

    setPlannerTaskCards((previousCards) =>
      previousCards.map((card) => {
        if (card.id !== checklistTaskCard.id) {
          return card;
        }

        const nextItemId = `cost-${Date.now()}`;
        const nextLabel = `New checklist item ${card.items.length + 1}`;
        return {
          ...card,
          items: [...card.items, { id: nextItemId, label: nextLabel, done: false }],
        };
      })
    );
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    if (!checklistTaskCard) {
      return;
    }

    setPlannerTaskCards((previousCards) =>
      previousCards.map((card) => {
        if (card.id !== checklistTaskCard.id) {
          return card;
        }

        return {
          ...card,
          items: card.items.filter((item) => item.id !== itemId),
        };
      })
    );
  };

  const openChecklistDeleteValidation = (item: { id: string; label: string }) => {
    setChecklistDeleteTarget(item);
    setChecklistDeleteValidation('');
    setChecklistDeleteError('');
  };

  const closeChecklistDeleteValidation = () => {
    setChecklistDeleteTarget(null);
    setChecklistDeleteValidation('');
    setChecklistDeleteError('');
  };

  const handleConfirmChecklistDelete = () => {
    if (!checklistDeleteTarget) {
      return;
    }

    const normalizedExpectedLabel = checklistDeleteTarget.label.trim().toLowerCase();
    const normalizedProvidedLabel = checklistDeleteValidation.trim().toLowerCase();

    if (!normalizedProvidedLabel || normalizedProvidedLabel !== normalizedExpectedLabel) {
      setChecklistDeleteError(`Type "${checklistDeleteTarget.label}" to confirm deletion.`);
      return;
    }

    handleRemoveChecklistItem(checklistDeleteTarget.id);
    closeChecklistDeleteValidation();
  };

  return (
    <div className="flex w-full flex-col gap-4 pb-2 text-[#302c39]">
      <div className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#ddd8e8] bg-white p-3 shadow-[0_6px_14px_rgba(31,18,54,0.06)]">
            <header className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#383341]">
                <ClipboardList className="size-3.5 text-[#5a5469]" />
                Projects List
              </h2>
              <button
                type="button"
                className="rounded-md p-1 text-[#898399] transition-colors hover:bg-[#f2eff8] hover:text-[#4b4558]"
                aria-label="Projects list options"
              >
                <span className="text-lg leading-none">⋮</span>
              </button>
            </header>

            <div className="space-y-1.5">
              {projectSlots.map((project) => {
                const isSelected = project.id === selectedProjectId;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className={[
                      'flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-all',
                      isSelected
                        ? 'border-transparent bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_8px_18px_rgba(171,39,185,0.35)]'
                        : 'border-[#e3deeb] bg-[#fbfaff] text-[#5e586f] hover:border-[#d4cce2] hover:bg-[#f4effb]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex size-4.5 shrink-0 items-center justify-center rounded text-[10px] font-bold',
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#ebe6f2] text-[#6e6680]',
                      ].join(' ')}
                    >
                      {project.id}
                    </span>
                    <span className="truncate text-xs font-semibold">
                      {project.title || 'Pending project slot'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[#ddd8e8] bg-white p-3 shadow-[0_6px_14px_rgba(31,18,54,0.06)]">
            <header className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#383341]">
                <ListChecks className="size-3.5 text-[#5a5469]" />
                Confirmed Events
              </h2>
              <button
                type="button"
                className="rounded-md p-1 text-[#898399] transition-colors hover:bg-[#f2eff8] hover:text-[#4b4558]"
                aria-label="Confirmed events options"
              >
                <span className="text-lg leading-none">⋮</span>
              </button>
            </header>

            <article className="rounded-xl border border-[#e5dfef] bg-[#fcfbfe] p-3">
              <div className="border-l-[3px] border-[#ed3da5] pl-2.5">
                <h3 className="text-[13px] font-bold text-[#524d60]">WeddingniSeb&amp;Rox</h3>
                <p className="mt-1 text-[11px] font-semibold text-[#7f788f]">January 3, 2026</p>
                <p className="text-[11px] text-[#9a93a8]">Start Date - End Date</p>

                <div className="mt-3 space-y-1 text-[11px] text-[#857f94]">
                  <p>Event Specification</p>
                  <p>Event Package</p>
                  <p>Event Pax</p>
                  <p>Event Type</p>
                </div>

                <p className="mt-3 text-[10px] font-semibold text-[#9b94a7]">Description</p>
                <p className="text-[10px] text-[#9b94a7]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis
                  viverra bibendum.
                </p>

                <button
                  type="button"
                  className="mt-3 inline-flex h-7 items-center justify-center rounded-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] px-4 text-[10px] font-bold text-white"
                >
                  Plan
                </button>
              </div>
            </article>

            <div className="mt-2 h-12 rounded-xl border border-[#e9e4f1] bg-[#fdfcfe]" />
          </section>
        </aside>

        <section className="min-w-0 space-y-3">
          <article className="rounded-xl bg-linear-to-r from-[#f23fa3] to-[#7d1fd0] p-4 text-white shadow-[0_12px_24px_rgba(146,31,186,0.34)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                  Event Planner
                </p>
                <h2 className="text-lg font-black">{selectedProject.title || 'Pending Project'}</h2>
                <p className="text-[11px] text-white/80">January 3, 2026 • Start Date - End Date</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold text-white/90">
                <span className="rounded-full bg-white/20 px-3 py-1">Client: Example Name</span>
                <span className="rounded-full bg-white/20 px-3 py-1">Contact: 0912-345-6789</span>
              </div>
            </div>
          </article>

          <div className="rounded-xl border border-[#ddd8e8] bg-white p-1 shadow-[0_4px_12px_rgba(33,19,57,0.05)]">
            <nav className="flex flex-wrap gap-1" aria-label="Event planning sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'rounded-lg px-4 py-2 text-[11px] font-bold transition',
                    activeTab === tab.id
                      ? 'bg-[#f3eefb] text-[#7c1cc9]'
                      : 'text-[#7b748f] hover:bg-[#f7f3fb]',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' ? (
            <section className="rounded-2xl border border-[#ddd8e8] bg-white p-4 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card) => (
                  <article
                    key={card.id}
                    className={`rounded-xl border px-3 py-2.5 shadow-[0_4px_10px_rgba(31,18,54,0.06)] ${card.accent}`}
                  >
                    <p className="text-[11px] font-semibold text-[#6f687f]">{card.label}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-[18px] font-black leading-tight text-[#2f2b39]">
                        {card.value}
                      </p>
                      <img
                        src={card.imageSrc}
                        alt=""
                        className="h-10 w-12 object-contain"
                        loading="lazy"
                      />
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4 grid gap-3 xl:grid-cols-[1.4fr_1fr_0.9fr_0.9fr]">
                <article className="rounded-xl border border-[#e4dfee] bg-white p-3 shadow-[0_4px_10px_rgba(31,18,54,0.06)]">
                  <p className="text-[11px] font-semibold text-[#6f687f]">Service Requirements</p>
                  <div className="mt-2 space-y-1 text-[11px] text-[#6f687f]">
                    {overviewServiceRequirements.map((item, index) => (
                      <p key={`${item}-${index}`}>{item}</p>
                    ))}
                  </div>
                </article>

                <article className="rounded-xl border border-[#e4dfee] bg-white p-3 shadow-[0_4px_10px_rgba(31,18,54,0.06)]">
                  <p className="text-[11px] font-semibold text-[#6f687f]">Allocation Resources</p>
                  <div className="mt-2 space-y-2">
                    {overviewAllocationResources.map((resource) => (
                      <div
                        key={resource.title}
                        className="rounded-lg border border-[#ece8f0] bg-[#fbf9fe] p-2 text-[10px] text-[#6f687f]"
                      >
                        <p className="text-[11px] font-semibold text-[#3a3442]">{resource.title}</p>
                        <p className="text-[10px]">{resource.detail}</p>
                        {resource.time ? <p className="text-[10px]">{resource.time}</p> : null}
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-xl border border-[#e4dfee] bg-white p-3 shadow-[0_4px_10px_rgba(31,18,54,0.06)]">
                  <p className="text-[11px] font-semibold text-[#6f687f]">
                    Checklist &amp; Meeting
                  </p>
                  <div className="mt-2 space-y-2 text-[10px] text-[#6f687f]">
                    <div>
                      <p className="text-[11px] font-semibold text-[#3a3442]">Meetings</p>
                      {overviewMeetings.map((meeting) => (
                        <p key={meeting}>{meeting}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#3a3442]">Checked</p>
                      {overviewChecklist.map((item) => (
                        <p key={item}>• {item}</p>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="rounded-xl border border-[#e4dfee] bg-white p-3 shadow-[0_4px_10px_rgba(31,18,54,0.06)]">
                  <p className="text-[11px] font-semibold text-[#6f687f]">Program Flow</p>
                  <div className="mt-2 space-y-3">
                    {overviewScheduleSummary.map((summary) => (
                      <div
                        key={summary.id}
                        className="grid grid-cols-[90px_1fr] gap-3 text-[10px] text-[#6f687f]"
                      >
                        <p>{summary.timeRange}</p>
                        <div className="border-l border-[#ebe6f0] pl-3">
                          <p className="text-[11px] font-semibold text-[#3a3442]">
                            {summary.title}
                          </p>
                          <p className="mt-1 text-[10px] italic leading-relaxed text-[#8a8495]">
                            {summary.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          ) : activeTab === 'task' ? (
            <section className="rounded-2xl border border-[#ddd8e8] bg-[#fbfafd] p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e7e2f0] bg-white px-3 py-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8f879f]">
                    Task Board
                  </p>
                  <p className="text-sm font-semibold text-[#5e586f]">
                    Connected to Event Manager, RSVP, Vendors, and Cost Breakdown
                  </p>
                </div>
                <span className="inline-flex rounded-full border border-[#e2dbee] bg-[#f8f4fd] px-3 py-1 text-xs font-black text-[#7c1cc9]">
                  {plannerTaskCards.reduce(
                    (count, card) => count + card.items.filter((item) => item.done).length,
                    0
                  )}
                  /{plannerTaskCards.reduce((count, card) => count + card.items.length, 0)} tasks
                  done
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                {plannerTaskCards.map((taskCard) => {
                  const completedCount = taskCard.items.filter((item) => item.done).length;
                  const totalItems = taskCard.items.length;
                  const progress =
                    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

                  return (
                    <article
                      key={taskCard.id}
                      className={`overflow-hidden rounded-2xl border p-3 shadow-[0_2px_8px_rgba(32,20,52,0.04)] ${taskCard.frameClassName}`}
                    >
                      <div
                        className={`flex h-full min-h-[260px] flex-col rounded-xl bg-linear-to-br p-4 ${taskCard.accentClassName}`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-[15px] font-black tracking-tight">
                            {taskCard.title}
                          </h3>
                          <span className="rounded-full bg-white/65 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                            {taskCard.badge}
                          </span>
                        </div>

                        <div className="mt-4 flex-1 rounded-2xl border border-white/70 bg-white/95 p-4 text-[#352f40] shadow-[0_10px_24px_rgba(32,20,52,0.08)]">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#7f7891]">
                            <span>{taskCard.due}</span>
                            <span>{taskCard.owner}</span>
                          </div>

                          <div className="mt-3 h-2 rounded-full bg-[#ebe6f3] p-[2px]">
                            <div
                              className="h-full rounded-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#8e869e]">
                            {completedCount}/{totalItems} completed
                          </p>

                          <ul className="mt-3 space-y-2">
                            {taskCard.items.map((item) => (
                              <li key={item.id} className="flex items-start gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleTaskItem(taskCard.id, item.id)}
                                  className={[
                                    'mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded border text-[10px] font-black transition-all',
                                    item.done
                                      ? 'border-[#7c1cc9] bg-[#f4eefb] text-[#7c1cc9]'
                                      : 'border-[#cfc7dc] bg-white text-transparent hover:border-[#7c1cc9] hover:text-[#7c1cc9]',
                                  ].join(' ')}
                                  aria-label={`${item.done ? 'Uncheck' : 'Check'} ${item.label}`}
                                >
                                  ✓
                                </button>
                                <span
                                  className={[
                                    'text-[12px] leading-relaxed',
                                    item.done ? 'text-[#8a8397] line-through' : 'text-[#4f4960]',
                                  ].join(' ')}
                                >
                                  {item.label}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <button
                            type="button"
                            onClick={() => handleCompleteTaskCard(taskCard.id)}
                            className="mt-3 inline-flex rounded-full border border-[#d9d0e7] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#6b637e] transition hover:bg-[#f7f3fb]"
                          >
                            Complete all
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : activeTab === 'notes' ? (
            <section className="rounded-2xl border border-[#ddd8e8] bg-[#f6f4f7] p-4 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="mx-auto max-w-[460px] rounded-md border border-[#c9c3d3] bg-white p-3 shadow-[0_4px_10px_rgba(27,16,45,0.08)]">
                <div className="rounded-md border border-[#c9c3d3] bg-white px-3 py-2">
                  <input
                    type="text"
                    value={noteDraftTitle}
                    onChange={(event) => setNoteDraftTitle(event.target.value)}
                    placeholder="Title"
                    className="w-full border-0 bg-transparent text-[13px] font-semibold text-[#4f4a58] outline-none placeholder:text-[#8a8495]"
                  />

                  <textarea
                    value={noteDraftBody}
                    onChange={(event) => setNoteDraftBody(event.target.value)}
                    placeholder="Take note"
                    className="mt-2 h-12 w-full resize-none border-0 bg-transparent text-[11px] text-[#5f596b] outline-none placeholder:text-[#8a8495]"
                  />

                  {noteDraftImageDataUrl ? (
                    <div className="mt-2 overflow-hidden rounded border border-[#e0dbe6] bg-white">
                      <img
                        src={noteDraftImageDataUrl}
                        alt="Uploaded note evidence"
                        className="h-28 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  {noteDraftError ? (
                    <p className="mt-2 text-[10px] font-semibold text-[#c13a74]">
                      {noteDraftError}
                    </p>
                  ) : null}

                  <div className="mt-2 flex items-center justify-between border-t border-[#e1dce8] pt-2">
                    <div className="flex items-center gap-2 text-[#6f697c]">
                      <button
                        type="button"
                        onClick={handleSavePlannerNote}
                        className="inline-flex size-6 items-center justify-center rounded-sm border border-[#d9d3e2] text-[#4a4654] transition hover:border-[#b7b0c4]"
                        aria-label="Save note"
                      >
                        <CheckCircle2 className="size-3.5" />
                      </button>
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-[#d9d3e2] p-1 text-[#4a4654] transition hover:border-[#b7b0c4]">
                        <ImagePlus className="size-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePlannerNoteImageChange}
                        />
                      </label>
                      {noteDraftImageDataUrl ? (
                        <button
                          type="button"
                          onClick={() => setNoteDraftImageDataUrl(undefined)}
                          className="inline-flex size-6 items-center justify-center rounded-sm border border-[#d9d3e2] text-[#6f697c] transition hover:border-[#b7b0c4]"
                          aria-label="Remove image"
                        >
                          <X className="size-3.5" />
                        </button>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={resetNoteDraft}
                      className="text-[10px] font-semibold text-[#6f697c] transition hover:text-[#393443]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                {plannerNotes.map((note) => (
                  <article
                    key={note.id}
                    className="w-full max-w-[190px] rounded-md border border-[#b9b3c2] bg-white p-3 shadow-[0_2px_6px_rgba(27,16,45,0.08)]"
                  >
                    <p className="text-[13px] font-black text-[#2f2a38]">{note.title}</p>

                    {note.imageDataUrl ? (
                      <div className="mt-2 overflow-hidden rounded border border-[#d6d1dc] bg-white">
                        <img
                          src={note.imageDataUrl}
                          alt={`${note.title} evidence`}
                          className="h-24 w-full object-cover"
                        />
                      </div>
                    ) : null}

                    <p className="mt-2 whitespace-pre-line text-[11px] font-semibold leading-snug text-[#4d4858]">
                      {note.body}
                    </p>

                    <div className="mt-4 flex items-center justify-end gap-2 text-[#6b6578]">
                      <button
                        type="button"
                        onClick={() => handleEditPlannerNote(note)}
                        className="inline-flex size-6 items-center justify-center rounded-md border border-[#d6d1dc] transition hover:border-[#a9a3b5]"
                        aria-label={`Edit ${note.title}`}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlannerNote(note.id)}
                        className="inline-flex size-6 items-center justify-center rounded-md border border-[#d6d1dc] transition hover:border-[#a9a3b5]"
                        aria-label={`Delete ${note.title}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : activeTab === 'checklist' ? (
            <section className="rounded-xl border border-[#ddd8e8] bg-white p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <h3 className="mb-3 text-[18px] font-bold tracking-tight text-[#18151f]">
                Checklist ({checklistItems.length} Items)
              </h3>

              <div className="overflow-hidden rounded-sm border border-[#e7e3ea] bg-white">
                <ul className="divide-y divide-[#dcd7df]">
                  {checklistItems.map((item) => (
                    <li key={item.id} className="flex min-h-[46px] items-center justify-between px-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTaskItem(checklistTaskCard?.id ?? '', item.id)}
                          className={[
                            'inline-flex size-5 shrink-0 items-center justify-center rounded-[3px] border-2 text-[10px] font-black transition-all',
                            item.done
                              ? 'border-[#ff1f7a] bg-[#ff1f7a] text-white'
                              : 'border-[#ff1f7a] bg-white text-transparent hover:text-[#ff1f7a]',
                          ].join(' ')}
                          aria-label={`${item.done ? 'Uncheck' : 'Check'} ${item.label}`}
                        >
                          ✓
                        </button>

                        <span className="truncate text-[15px] font-medium text-[#302c39]">
                          {item.label}
                        </span>
                      </div>

                      <div className="ml-3 flex shrink-0 items-center gap-2">
                        {item.id === 'cost-2' ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#d8d3de] bg-[#f6f5f8] px-2 py-1 text-[9px] font-semibold text-[#6f697e]">
                            <CalendarDays className="size-3" />
                            Due Jan 2
                          </span>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => openChecklistDeleteValidation({ id: item.id, label: item.label })}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-[#d7d0e2] bg-white text-[#7a728d] transition hover:border-[#f1589e] hover:text-[#f1589e]"
                          aria-label={`Delete ${item.label}`}
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {checklistItems.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm font-semibold text-[#777184]">
                    No checklist items yet. Add one to start tracking tasks.
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-[#f1589e] via-[#d735b3] to-[#8a1fd0] px-4 text-[15px] font-semibold tracking-tight text-white shadow-[0_10px_22px_rgba(125,31,186,0.34)]"
              >
                <Plus className="size-5 text-[#1f1b2b]" />
                <span>Add Checklist Item</span>
              </button>
            </section>
          ) : activeTab === 'flow' ? (
            <FlowNotesBoard />
          ) : (
            <section className="rounded-2xl border border-[#ddd8e8] bg-white px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#7c748f]">
                {tabs.find((tab) => tab.id === activeTab)?.label} view is ready for the next data
                integration.
              </p>
            </section>
          )}
        </section>
      </div>

      <Dialog
        open={Boolean(checklistDeleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            closeChecklistDeleteValidation();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-1rem)] rounded-2xl border border-[#e3dfea] bg-white p-0 sm:max-w-[520px]"
        >
          <form
            className="px-6 py-5"
            onSubmit={(event) => {
              event.preventDefault();
              handleConfirmChecklistDelete();
            }}
          >
            <h3 className="text-[24px] font-black tracking-tight text-[#1f1f21]">
              Delete checklist item?
            </h3>
            <p className="mt-2 text-sm text-[#686176]">
              This action will permanently remove the selected checklist row.
            </p>

            <div className="mt-4 rounded-lg border border-[#ece7f2] bg-[#faf8fc] px-3 py-2 text-sm font-semibold text-[#4f4a58]">
              {checklistDeleteTarget?.label}
            </div>

            <Label
              htmlFor="delete-checklist-validation"
              className="mt-4 block text-xs font-semibold uppercase tracking-[0.1em] text-[#7d778d]"
            >
              Type the item name to confirm
            </Label>
            <Input
              id="delete-checklist-validation"
              type="text"
              value={checklistDeleteValidation}
              onChange={(event) => {
                setChecklistDeleteValidation(event.target.value);
                setChecklistDeleteError('');
              }}
              className="mt-2 h-10 border-[#d5cede] text-sm font-semibold text-[#3f3a4e]"
              placeholder={checklistDeleteTarget?.label ?? ''}
            />

            {checklistDeleteError ? (
              <p className="mt-2 text-xs font-semibold text-[#d22067]">{checklistDeleteError}</p>
            ) : null}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeChecklistDeleteValidation}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#d7d0e2] px-3 text-xs font-bold text-[#5d5670] transition hover:bg-[#f4f1f8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#cf1f65] px-4 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(172,31,90,0.34)]"
              >
                Delete item
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

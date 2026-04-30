import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react';
import {
  CalendarDays,
  ChevronLeft,
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
import { getBoardTasks } from '@/api/planner-tasks';

type PlannerTab = 'overview' | 'task' | 'notes' | 'flow' | 'checklist';

type ProjectSlot = {
  id: string;
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

type TaskLane = 'todo' | 'in-progress' | 'completed';

type PlannerBoardTask = {
  id: string;
  title: string;
  details: string;
  editorType: TaskEditorType;
  lane: TaskLane;
  checklist?: Array<{
    id: string;
    label: string;
    done: boolean;
    doneAt?: string;
  }>;
};

type TaskEditorType = 'Text' | 'Toggle List' | 'Bulleted List' | 'Numbered List' | 'Divider';

type PlannerQuickNote = {
  id: string;
  title: string;
  body: string;
  imageDataUrl?: string;
};

const projectSlots: ProjectSlot[] = [
  { id: '1', title: "Angela's 18 Birthday" },
  { id: '2', title: '' },
  { id: '3', title: '' },
  { id: '4', title: '' },
  { id: '5', title: '' },
  { id: '6', title: '' },
  { id: '7', title: '' },
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

const taskLaneConfig: Array<{
  id: TaskLane;
  label: string;
  dotClassName: string;
  panelClassName: string;
  cardOuterClassName: string;
  cardTitleClassName: string;
}> = [
  {
    id: 'todo',
    label: 'To Do',
    dotClassName: 'bg-[#e6d81d]',
    panelClassName: 'border-[#e4e4d0] bg-[#fafaf4]',
    cardOuterClassName: 'border-[#cae4cb] bg-[#dff0e0]',
    cardTitleClassName: 'text-[#4f8759]',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    dotClassName: 'bg-[#2ea4ff]',
    panelClassName: 'border-[#d3e7f7] bg-[#f4f9ff]',
    cardOuterClassName: 'border-[#ead4e9] bg-[#f0ddf0]',
    cardTitleClassName: 'text-[#712466]',
  },
  {
    id: 'completed',
    label: 'Completed',
    dotClassName: 'bg-[#2ec24f]',
    panelClassName: 'border-[#d8eddc] bg-[#f5fcf7]',
    cardOuterClassName: 'border-[#d4dfec] bg-[#deebf8]',
    cardTitleClassName: 'text-[#1f4c82]',
  },
];

const overviewCards = [
  {
    id: 'overview-package',
    label: 'Event Package',
    value: 'Blooms\nPackage',
    imageSrc: '/Pictures/organizerpics/event-package-illustration.png',
    accent: 'text-[#6b2aa5] bg-[#fbf6ff] border-[#eee3fb]',
    valueClassName: 'text-[14px] font-semibold leading-[1.15] text-[#6d677b]',
  },
  {
    id: 'overview-pax',
    label: 'Event Pax',
    value: '40',
    imageSrc: '/Pictures/organizerpics/event-pax-illustration.png',
    accent: 'text-[#88511a] bg-[#fff8ef] border-[#f3e2cc]',
    valueClassName: 'text-[32px] font-semibold leading-none tracking-tight text-[#4f4a58]',
  },
  {
    id: 'overview-type',
    label: 'Event Type',
    value: 'Debut\nEvent Type',
    imageSrc: '/Pictures/organizerpics/event-type-illustration.png',
    accent: 'text-[#1f6ea6] bg-[#f3f8ff] border-[#d7e7f7]',
    valueClassName: 'text-[12px] font-semibold leading-[1.15] text-[#6d677b]',
  },
  {
    id: 'overview-cost',
    label: 'Event Cost',
    value: '50,000',
    imageSrc: '/Pictures/organizerpics/event-cost-illustration.png',
    accent: 'text-[#a6541d] bg-[#fff4ec] border-[#f3dccb]',
    valueClassName: 'text-[32px] font-semibold leading-none tracking-tight text-[#4f4a58]',
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

// Utility functions moved outside component to avoid recreating on every render
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

const parseTimeParts = (value: string, fallbackHour: number) => {
  const normalized = toTimeInputValue(value, fallbackHour);
  const match = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    return {
      hour: fallbackHour,
      minute: 0,
      totalMinutes: fallbackHour * 60,
    };
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  return {
    hour,
    minute,
    totalMinutes: hour * 60 + minute,
  };
};

const mapBackendStatusToLane = (status: string): TaskLane => {
  if (status === 'IN_PROGRESS') return 'in-progress';
  if (status === 'COMPLETED') return 'completed';
  return 'todo';
};

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
      tone: 'border-[#f0bfd8] bg-[#fdeaf3] text-[#7b295f]',
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
      tone: 'border-[#cfe0f3] bg-[#eef6ff] text-[#2a5f91]',
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
      tone: 'border-[#dbe8dc] bg-[#f1fbf3] text-[#2d6640]',
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
    tone: 'border-[#f0bfd8] bg-[#fdeaf3] text-[#7b295f]',
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

  const selectedActivity = selectedActivityId
    ? (timelineBlocks.find((block) => block.id === selectedActivityId) ?? null)
    : null;

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
      tone: 'border-[#f0bfd8] bg-[#fdeaf3] text-[#7b295f]',
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

  const positionedTimelineBlocks = useMemo(() => {
    const sortedSameHourBlocks = new Map<number, typeof timelineBlocks>();

    timelineBlocks.forEach((block) => {
      const sameHourBlocks = sortedSameHourBlocks.get(block.startHour) ?? [];
      sameHourBlocks.push(block);
      sortedSameHourBlocks.set(block.startHour, sameHourBlocks);
    });

    sortedSameHourBlocks.forEach((blocks, startHour) => {
      blocks.sort((first, second) => {
        const firstParts = parseTimeParts(first.from, first.startHour);
        const secondParts = parseTimeParts(second.from, second.startHour);

        if (firstParts.minute !== secondParts.minute) return firstParts.minute - secondParts.minute;
        if (firstParts.totalMinutes !== secondParts.totalMinutes)
          return firstParts.totalMinutes - secondParts.totalMinutes;
        return first.id.localeCompare(second.id);
      });
      sortedSameHourBlocks.set(startHour, blocks);
    });

    const slotWidth = 25;
    const slotGap = 2.5;

    return timelineBlocks.map((block) => {
      const startParts = parseTimeParts(block.from, block.startHour);
      const endParts = parseTimeParts(block.to, block.endHour);
      const sameHourBlocks = sortedSameHourBlocks.get(block.startHour) ?? [];
      const slotIndex = sameHourBlocks.findIndex((item) => item.id === block.id);

      // 1. Calculate absolute minutes elapsed since the very top of the visible board
      const boardStartHour = visibleHours.length > 0 ? visibleHours[0] : timelineStartHour;
      const boardStartMinutes = boardStartHour * 60;
      const absoluteStartMinutes = startParts.totalMinutes - boardStartMinutes;
      const absoluteEndMinutes = endParts.totalMinutes - boardStartMinutes;

      // 2. Exact duration
      const durationMinutes = Math.max(30, absoluteEndMinutes - absoluteStartMinutes);

      // 3. Convert minutes directly to pixels (58px per 60 mins)
      const topPixels = (absoluteStartMinutes / 60) * hourRowHeight;
      const heightPixels = (durationMinutes / 60) * hourRowHeight;

      // 4. Visual gaps to avoid covering grid lines
      const verticalGap = 4;
      const finalTop = topPixels + verticalGap;
      const finalHeight = heightPixels - verticalGap * 2;

      const left = 2 + slotIndex * (slotWidth + slotGap);
      const width = Math.max(20, slotWidth - Math.min(slotIndex, 2) * 2);

      return {
        ...block,
        left: `${left}%`,
        width: `${width}%`,
        calculatedTop: finalTop,
        calculatedHeight: finalHeight,
      };
    });
  }, [timelineBlocks, hourRowHeight, timelineStartHour, visibleHours]);

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
      <section className="rounded-2xl border border-[#ddd8e8] bg-linear-to-b from-white to-[#fbf8fd] p-4 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e3ddea] bg-white px-4 py-3 shadow-[0_4px_10px_rgba(27,16,45,0.06)]">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#8a8399]">Flow</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHideScheduleSummary((prev) => !prev)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d7d0e2] bg-white px-3.5 text-[11px] font-bold text-[#5a5670] transition hover:bg-[#f6f2fb]"
            >
              {hideScheduleSummary ? 'Show Summary' : 'Hide Summary'}
            </button>
            <button
              type="button"
              onClick={openCreateActivity}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-linear-to-r from-[#f1589e] via-[#d735b3] to-[#8a1fd0] px-4 text-[11px] font-black text-white shadow-[0_10px_20px_rgba(125,31,186,0.24)] transition hover:brightness-105"
            >
              <Plus className="size-3.5" />
              Add
            </button>
            <button
              type="button"
              onClick={handleExportSummary}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d7d0e2] bg-white px-3.5 text-[11px] font-bold text-[#5a5670] transition hover:bg-[#f6f2fb]"
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
          <article className="overflow-hidden rounded-2xl border border-[#e2dee9] bg-white shadow-[0_8px_18px_rgba(31,18,54,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eee9f2] bg-[#fcfbfe] px-5 py-4">
              <div>
                <h4 className="text-[16px] font-black leading-tight text-[#2f2b39]">
                  JANUARY 3, 2025
                </h4>
                <p className="text-[11px] font-semibold text-[#6d6679]">Event Flow</p>
              </div>

              <label className="inline-flex items-center gap-2 rounded-full border border-[#e4ddea] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#7a728d] shadow-[0_2px_5px_rgba(31,18,54,0.04)]">
                <span>Hide empty time slots</span>
                <input
                  type="checkbox"
                  checked={hideEmptySlots}
                  onChange={(event) => setHideEmptySlots(event.target.checked)}
                  className="size-3 cursor-pointer rounded border-[#c9c2d2]"
                />
              </label>
            </div>

            <div className="grid grid-cols-[72px_minmax(0,1fr)] border-t border-[#ece8f0]">
              <div className="bg-[#fcfbfe]">
                {visibleHours.map((hour) => {
                  const labelHour = hour === 12 ? 12 : ((hour + 11) % 12) + 1;
                  return (
                    <div
                      key={hour}
                      className="flex items-start justify-end border-b border-[#ece8f0] pr-3 pt-2 text-[10px] font-semibold text-[#8e8796]"
                      style={{ height: `${hourRowHeight}px` }}
                    >
                      {labelHour}AM
                    </div>
                  );
                })}
              </div>

              <div className="relative overflow-x-auto overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#faf7fc_100%)]">
                <div
                  className="relative min-w-[760px]"
                  style={{ height: `${visibleHours.length * hourRowHeight}px` }}
                >
                  {visibleHours.map((hour, index) => (
                    <div
                      key={`${hour}-line`}
                      className="absolute left-0 right-0 border-t border-[#eee6f3]"
                      style={{ top: `${index * hourRowHeight}px` }}
                    />
                  ))}

                  {positionedTimelineBlocks.map((block) => {
                    if (!block) return null;

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
                        className={`absolute overflow-hidden rounded-xl border px-3 py-2 text-[#5f596b] shadow-[0_6px_12px_rgba(31,18,54,0.08)] ${block.tone} flex flex-col`}
                        style={{
                          top: `${block.calculatedTop}px`,
                          height: `${block.calculatedHeight}px`,
                          left: block.left,
                          width: block.width,
                          zIndex: block.id === selectedActivityId ? 30 : 10,
                        }}
                      >
                        <p className="text-[11px] font-black uppercase leading-tight text-inherit break-words whitespace-normal line-clamp-2 shrink-0">
                          {block.title}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold leading-tight text-inherit/80 shrink-0">
                          Time: {formatDisplayTime(block.from, block.startHour)} -{' '}
                          {formatDisplayTime(block.to, block.endHour)}
                        </p>
                        <div className="mt-1 flex-1 min-h-0">
                          <p className="text-[10px] leading-tight text-inherit/80 break-words whitespace-normal line-clamp-4">
                            {block.description}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>

          <aside
            className={[
              'rounded-2xl border border-[#e2dee9] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(31,18,54,0.05)] transition-all duration-300 ease-in-out origin-right',
              hideScheduleSummary
                ? 'opacity-0 translate-x-8 invisible hidden'
                : 'opacity-100 translate-x-0 visible block',
            ].join(' ')}
          >
            <p className="text-[12px] font-black uppercase tracking-[0.12em] text-[#6b6476]">
              Schedule Summary
            </p>

            <div className="mt-4 space-y-5 border-l border-[#ebe6f0] pl-4">
              {scheduleSummaries.map((summary) => (
                <div key={summary.id} className="grid grid-cols-[92px_1fr] gap-4">
                  <p className="text-[10px] font-semibold text-[#6b6476]">{summary.timeRange}</p>
                  <div>
                    <p className="text-[13px] font-black text-[#2f2b39] break-all whitespace-normal">
                      {summary.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#8a8495] break-all whitespace-normal">
                      {summary.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSummary}
              className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#d7d0e2] bg-white text-[11px] font-black text-[#5a5670] transition hover:bg-[#f6f2fb]"
            >
              <Plus className="size-3.5" />
              Add summary
            </button>
          </aside>
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
          className="max-w-[calc(100%-1rem)] rounded-2xl border border-[#e3dfea] bg-white p-0 sm:max-w-[640px]"
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
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[#f5d9e7] text-[#f33d93] transition hover:bg-[#fdf0f6]"
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
                    className="mt-2 h-11 rounded-lg border border-[#e5deec] bg-[#f7f5fa] text-sm text-[#4d4a54] shadow-none"
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
                      className="mt-2 h-11 rounded-lg border border-[#e5deec] bg-[#f7f5fa] text-sm text-[#4d4a54] shadow-none"
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
                    className="mt-2 h-28 w-full resize-none rounded-lg border border-[#e5deec] bg-[#f7f5fa] px-3 py-2 text-sm text-[#4d4a54] outline-none"
                  />
                </div>
              </div>
            ) : selectedActivity ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-linear-to-r from-[#f1589e] via-[#d735b3] to-[#8a1fd0] px-4 py-3 text-base font-black leading-tight text-white shadow-[0_10px_20px_rgba(125,31,186,0.18)] break-all whitespace-normal">
                  {selectedActivity.title}
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#ebe5f1] bg-[#faf8fc] px-4 py-3 text-sm">
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

                <div className="rounded-2xl border border-[#ebe5f1] bg-[#faf8fc] px-4 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#9d97a8]">
                    Description
                  </p>
                  <p className="mt-2 text-[14px] italic leading-snug text-[#8e8994] break-all whitespace-normal">
                    {selectedActivity.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#e5deec] bg-[#faf8fc] px-4 py-8 text-center">
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

const noteTileThemes = [
  {
    shellClassName: 'border-[#edd9e6] bg-[#fff7fb] text-[#6f295a]',
    headerClassName: 'from-[#ffdaea] via-[#ffeef5] to-[#fff7fb]',
    badgeClassName: 'bg-[#ffd7e7] text-[#a83f73]',
    accentClassName: 'bg-[#f1589e]',
    bodyClassName: 'text-[#5d5364]',
    footerClassName: 'border-[#ead8e6] bg-[#fffafd]',
  },
  {
    shellClassName: 'border-[#d8e3f0] bg-[#f7fbff] text-[#24476b]',
    headerClassName: 'from-[#d9ecff] via-[#eef7ff] to-[#f7fbff]',
    badgeClassName: 'bg-[#d8ebff] text-[#2c6aa5]',
    accentClassName: 'bg-[#2ea4ff]',
    bodyClassName: 'text-[#546273]',
    footerClassName: 'border-[#dbe6f2] bg-[#fbfdff]',
  },
  {
    shellClassName: 'border-[#dce9dd] bg-[#f7fcf8] text-[#2b5c37]',
    headerClassName: 'from-[#dff2e1] via-[#effaf1] to-[#f7fcf8]',
    badgeClassName: 'bg-[#d9f0dc] text-[#2e6b37]',
    accentClassName: 'bg-[#2ec24f]',
    bodyClassName: 'text-[#55645a]',
    footerClassName: 'border-[#dbe8de] bg-[#fbfdfb]',
  },
  {
    shellClassName: 'border-[#eadfcb] bg-[#fffaf1] text-[#70511f]',
    headerClassName: 'from-[#ffe8c7] via-[#fff4e0] to-[#fffaf1]',
    badgeClassName: 'bg-[#ffe0b8] text-[#9a6426]',
    accentClassName: 'bg-[#f0a12b]',
    bodyClassName: 'text-[#6a5b46]',
    footerClassName: 'border-[#eadfcb] bg-[#fffdf8]',
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
  const [selectedEventId, setSelectedEventId] = useState('1');
  const [activeTab, setActiveTab] = useState<PlannerTab>('overview');
  const [plannerTaskCards, setPlannerTaskCards] = useState<TaskCard[]>(taskCards);
  const [boardTasks, setBoardTasks] = useState<PlannerBoardTask[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      if (!selectedEventId) {
        setBoardTasks([]);
        return;
      }

      try {
        const response = await getBoardTasks(selectedEventId);

        if (!isMounted) return;

        const backendTasks: Record<string, any[]> = response?.tasks || {};
        const formattedTasks: PlannerBoardTask[] = [];

        ['TODO', 'IN_PROGRESS', 'COMPLETED'].forEach((status) => {
          const group = backendTasks[status] || [];
          group.forEach((task: any) => {
            formattedTasks.push({
              id: task.id,
              title: task.title,
              details: task.description,
              editorType: 'Text',
              lane: mapBackendStatusToLane(task.status || status),
              checklist: [],
            });
          });
        });

        setBoardTasks(formattedTasks);
      } catch (error) {
        console.error('Failed to load board tasks:', error);
        if (isMounted) setBoardTasks([]);
      }
    };

    loadTasks();
    return () => {
      isMounted = false;
    };
  }, [selectedEventId]);
  const [isTaskPreviewOpen, setIsTaskPreviewOpen] = useState(false);
  const [selectedBoardTaskId, setSelectedBoardTaskId] = useState<string | null>(null);
  const [taskPreviewTitle, setTaskPreviewTitle] = useState('');
  const [taskPreviewDetails, setTaskPreviewDetails] = useState('');
  const [taskPreviewChecklist, setTaskPreviewChecklist] = useState<
    Array<{ id: string; label: string; done: boolean; doneAt?: string }>
  >([]);
  const [taskActionMessage, setTaskActionMessage] = useState('');
  const [taskActionTone, setTaskActionTone] = useState<'success' | 'info' | 'error'>('info');
  const [taskCardMenuOpenFor, setTaskCardMenuOpenFor] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
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
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isInlineNoteOpen, setIsInlineNoteOpen] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);

  const handleNoteDragStart = (e: DragEvent<HTMLElement>, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);

    // CRITICAL: Delay the state update so the browser captures the fully rendered card as the drag ghost FIRST.
    setTimeout(() => {
      setDraggedNoteId(id);
    }, 0);
  };

  const handleNoteDragEnd = () => {
    setDraggedNoteId(null);
  };

  const handleNoteDrop = (e: DragEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData('text/plain');
    if (!droppedId || droppedId === targetId) return;

    const draggedIdx = plannerNotes.findIndex((n) => n.id === droppedId);
    const targetIdx = plannerNotes.findIndex((n) => n.id === targetId);

    const newNotes = [...plannerNotes];
    const [draggedNote] = newNotes.splice(draggedIdx, 1);
    newNotes.splice(targetIdx, 0, draggedNote);

    setPlannerNotes(newNotes);
    setDraggedNoteId(null);
  };

  const selectedProject = useMemo(() => {
    return projectSlots.find((project) => project.id === selectedEventId) ?? projectSlots[0];
  }, [selectedEventId]);

  const selectedBoardTask = useMemo(() => {
    if (!selectedBoardTaskId) {
      return null;
    }

    return boardTasks.find((task) => task.id === selectedBoardTaskId) ?? null;
  }, [boardTasks, selectedBoardTaskId]);

  const resetNoteDraft = () => {
    setNoteDraftTitle('');
    setNoteDraftBody('');
    setNoteDraftImageDataUrl(undefined);
    setNoteDraftError('');
    setEditingPlannerNoteId(null);
  };

  const closePlannerNoteModal = () => {
    setIsNoteModalOpen(false);
    resetNoteDraft();
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
      if (isNoteModalOpen)
        setNoteDraftError('Enter a title, note detail, or add an image before saving.');
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

    closePlannerNoteModal();
  };

  const handleCloseInlineNote = () => {
    if (noteDraftTitle.trim() || noteDraftBody.trim() || noteDraftImageDataUrl) {
      handleSavePlannerNote();
    } else {
      resetNoteDraft();
    }
    setIsInlineNoteOpen(false);
  };

  const handleEditPlannerNote = (note: PlannerQuickNote) => {
    setEditingPlannerNoteId(note.id);
    setNoteDraftTitle(note.title);
    setNoteDraftBody(note.body);
    setNoteDraftImageDataUrl(note.imageDataUrl ?? undefined);
    setNoteDraftError('');
    setIsNoteModalOpen(true);
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

  const handleAddEmptyTask = () => {
    const nextTask: PlannerBoardTask = {
      id: `board-task-${Date.now()}`,
      title: '',
      details: '',
      editorType: 'Text',
      lane: 'todo',
    };

    setBoardTasks((previous) => [nextTask, ...previous]);
  };

  const handleDragTaskStart = (event: DragEvent<HTMLElement>, taskId: string) => {
    const task = boardTasks.find((t) => t.id === taskId);
    if (!task || task.lane === 'completed') {
      event.preventDefault();
      return;
    }

    event.dataTransfer.setData('text/plain', taskId);
    event.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragTaskEnd = () => {
    setDraggedTaskId(null);
  };

  const handleLaneDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDropTaskToLane = (event: DragEvent<HTMLElement>, lane: TaskLane) => {
    event.preventDefault();
    const droppedId = event.dataTransfer.getData('text/plain') || draggedTaskId;

    if (!droppedId) {
      return;
    }

    // find current task to inspect its lane
    const current = boardTasks.find((t) => t.id === droppedId);
    if (!current) return;

    // disallow dragging back to To Do once it has been moved to In Progress
    if (current.lane === 'in-progress' && lane === 'todo') {
      return;
    }

    // disallow moving completed tasks back to other lanes
    if (current.lane === 'completed' && lane !== 'completed') {
      return;
    }

    // only allow In Progress -> Completed when every checklist item is checked
    if (current.lane === 'in-progress' && lane === 'completed') {
      const checklist = Array.isArray(current.checklist) ? current.checklist : [];
      if (checklist.length === 0 || checklist.some((item) => !item.done)) {
        return;
      }
    }

    setBoardTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== droppedId) return task;

        // when moving from To Do -> In Progress, auto-convert to a checklist if none exists
        if (task.lane === 'todo' && lane === 'in-progress') {
          const hasChecklist = Array.isArray(task.checklist) && task.checklist.length > 0;
          if (!hasChecklist) {
            const items = task.details
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((line, idx) => ({ id: `${task.id}-chk-${idx}`, label: line, done: false }));

            if (items.length === 0) {
              items.push({ id: `${task.id}-chk-0`, label: 'New checklist item', done: false });
            }

            return { ...task, lane, checklist: items };
          }
        }

        if (lane === 'completed') {
          const timestamp = new Date().toISOString();
          const checklistSource: Array<{
            id: string;
            label: string;
            done: boolean;
            doneAt?: string;
          }> =
            Array.isArray(task.checklist) && task.checklist.length > 0
              ? task.checklist
              : task.details
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((line, idx) => ({ id: `${task.id}-chk-${idx}`, label: line, done: false }));

          const checklist =
            checklistSource.length > 0
              ? checklistSource.map((item) => ({
                  ...item,
                  done: true,
                  doneAt: item.doneAt ?? timestamp,
                }))
              : [
                  {
                    id: `${task.id}-chk-0`,
                    label: 'Task completed',
                    done: true,
                    doneAt: timestamp,
                  },
                ];

          return { ...task, lane, checklist };
        }

        return { ...task, lane };
      })
    );

    setDraggedTaskId(null);
  };

  const openTaskPreview = (taskId: string) => {
    const selectedTask = boardTasks.find((task) => task.id === taskId);
    setSelectedBoardTaskId(taskId);
    setTaskPreviewTitle(selectedTask?.title ?? '');
    setTaskPreviewDetails(selectedTask?.details ?? '');
    setTaskPreviewChecklist(
      selectedTask?.lane === 'todo'
        ? selectedTask?.checklist?.length
          ? selectedTask.checklist
          : (selectedTask?.details ?? '')
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line, index) => ({
                id: `${selectedTask?.id ?? taskId}-chk-${index}`,
                label: line,
                done: false,
              }))
        : (selectedTask?.checklist ?? []).map((item) => ({
            ...item,
            doneAt: item.doneAt,
          }))
    );
    setTaskActionMessage(`Editing ${selectedTask?.title || 'task'}.`);
    setTaskActionTone('info');
    setIsTaskPreviewOpen(true);
  };

  const handleSaveTaskPreview = () => {
    if (!selectedBoardTaskId || selectedBoardTask?.lane !== 'todo') {
      return;
    }

    const normalizedChecklist = taskPreviewChecklist
      .map((item) => ({
        ...item,
        label: item.label.trim(),
      }))
      .filter((item) => item.label.length > 0)
      .map((item) => ({
        id: item.id,
        label: item.label,
        done: false,
      }));

    const normalizedDetails = taskPreviewDetails.trim();

    setBoardTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === selectedBoardTaskId
          ? {
              ...task,
              title: taskPreviewTitle,
              details:
                normalizedDetails || normalizedChecklist.map((item) => item.label).join('\n'),
              checklist: normalizedChecklist,
            }
          : task
      )
    );

    setTaskActionMessage(`Saved ${taskPreviewTitle || 'task'} successfully.`);
    setTaskActionTone('success');

    setIsTaskPreviewOpen(false);
    setSelectedBoardTaskId(null);
  };

  const handleDeleteBoardTask = (taskId: string) => {
    const targetTask = boardTasks.find((task) => task.id === taskId);
    setBoardTasks((previousTasks) => previousTasks.filter((task) => task.id !== taskId));
    setTaskCardMenuOpenFor(null);
    setTaskActionMessage(`Deleted ${targetTask?.title || 'task'} successfully.`);
    setTaskActionTone('error');
  };

  const handleToggleBoardTaskChecklistItem = (taskId: string, itemId: string) => {
    const timestamp = new Date().toISOString();

    setBoardTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== taskId || !Array.isArray(task.checklist)) {
          return task;
        }

        return {
          ...task,
          checklist: task.checklist.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  done: !item.done,
                  doneAt: !item.done ? timestamp : undefined,
                }
              : item
          ),
        };
      })
    );
  };

  const formatChecklistTimestamp = (value?: string) => {
    if (!value) {
      return 'Pending';
    }

    return new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handleAddTodoChecklistItem = () => {
    setTaskPreviewChecklist((previous) => [
      ...previous,
      { id: `todo-item-${Date.now()}`, label: '', done: false },
    ]);
  };

  const handleUpdateTodoChecklistItem = (itemId: string, label: string) => {
    setTaskPreviewChecklist((previous) =>
      previous.map((item) => (item.id === itemId ? { ...item, label } : item))
    );
  };

  const handleRemoveTodoChecklistItem = (itemId: string) => {
    setTaskPreviewChecklist((previous) => previous.filter((item) => item.id !== itemId));
  };

  const checklistTaskCard = useMemo(() => {
    return plannerTaskCards.find((card) => card.id === 'task-budget') ?? null;
  }, [plannerTaskCards]);

  const checklistItems = checklistTaskCard?.items ?? [];

  const checklistDoneCount = checklistItems.filter((it) => it.done).length;
  const checklistProgress = checklistItems.length
    ? Math.round((checklistDoneCount / checklistItems.length) * 100)
    : 0;

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
                const isSelected = project.id === selectedEventId;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedEventId(project.id)}
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
            <section className="rounded-[16px] border border-[#d8d3df] bg-[#f7f5f9] p-2.5 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card) => (
                  <article
                    key={card.id}
                    className={`min-h-[74px] rounded-lg border px-3 py-2 shadow-[0_2px_5px_rgba(31,18,54,0.06)] ${card.accent}`}
                  >
                    <p className="truncate text-[11px] font-semibold text-[#6f687f]">
                      {card.label}
                    </p>
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

              <div className="mt-2 grid gap-2 xl:grid-cols-[0.95fr_1fr_0.92fr_0.98fr]">
                <div className="space-y-2">
                  <article className="min-h-[166px] rounded-lg border border-[#ded9e7] bg-white p-3 shadow-[0_2px_6px_rgba(31,18,54,0.05)]">
                    <p className="text-[12px] font-bold text-[#5e586d]">Service Requirements</p>
                    <div className="mt-2 space-y-1 text-[11px] leading-snug text-[#6f687f]">
                      {overviewServiceRequirements.map((item, index) => (
                        <p key={`${item}-${index}`}>{item}</p>
                      ))}
                    </div>
                  </article>

                  <article className="min-h-[112px] rounded-lg border border-[#ded9e7] bg-white p-3 shadow-[0_2px_6px_rgba(31,18,54,0.05)]">
                    <p className="text-[12px] font-bold text-[#5e586d]">Decorations</p>
                    <div className="mt-2 text-[10px] leading-snug text-[#6f687f]">
                      <p>Theme: Enchanted Forest</p>
                      <p>Fairy greens, hanging vines, twinkle lights, wood accents.</p>
                      <p className="mt-1 font-semibold text-[#5a546a]">Materials</p>
                      <p>1. Recycled crate centerpieces</p>
                      <p>2. Rustic lantern lighting</p>
                      <p>3. Willow arch and floral drapes</p>
                      <p>4. Moss runner tablescape</p>
                    </div>
                  </article>
                </div>

                <article className="min-h-[286px] rounded-lg border border-[#ded9e7] bg-white p-3 shadow-[0_2px_6px_rgba(31,18,54,0.05)]">
                  <p className="text-[12px] font-bold text-[#5e586d]">Allocation Resources</p>
                  <div className="mt-2 space-y-2">
                    {overviewAllocationResources.map((resource) => (
                      <div
                        key={resource.title}
                        className="rounded-md border border-[#ece8f0] bg-[#fbf9fe] p-2.5 text-[10px] leading-snug text-[#6f687f]"
                      >
                        <p className="text-[11px] font-black text-[#3a3442]">{resource.title}</p>
                        <p className="mt-0.5 whitespace-pre-line break-words">{resource.detail}</p>
                        {resource.time ? (
                          <p className="mt-1 text-[10px] text-[#8c8498]">{resource.time}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>

                <article className="min-h-[286px] rounded-lg border border-[#ded9e7] bg-white p-3 shadow-[0_2px_6px_rgba(31,18,54,0.05)]">
                  <p className="text-[12px] font-bold text-[#5e586d]">Checklist &amp; Meeting</p>
                  <div className="mt-2 space-y-2 text-[11px] leading-snug text-[#6f687f]">
                    <div className="min-h-[82px] rounded-md border border-[#ece8f0] bg-[#fbf9fe] p-2">
                      <p className="text-[11px] font-black text-[#3a3442]">Meetings</p>
                      {overviewMeetings.map((meeting) => (
                        <p key={meeting}>{meeting}</p>
                      ))}
                    </div>
                    <div className="min-h-[162px] rounded-md border border-[#ece8f0] bg-[#fbf9fe] p-2">
                      <p className="text-[11px] font-black text-[#3a3442]">Checked</p>
                      {overviewChecklist.map((item) => (
                        <p key={item}>• {item}</p>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="min-h-[286px] rounded-lg border border-[#ded9e7] bg-white p-3 shadow-[0_2px_6px_rgba(31,18,54,0.05)]">
                  <p className="text-[12px] font-bold text-[#5e586d]">Program Flow</p>
                  <div className="mt-2 space-y-2">
                    {overviewScheduleSummary.map((summary) => (
                      <div
                        key={summary.id}
                        className="grid grid-cols-[76px_1fr] gap-2 text-[10px] leading-snug text-[#6f687f]"
                      >
                        <p>{summary.timeRange}</p>
                        <div className="border-l border-[#ebe6f0] pl-2">
                          <p className="text-[11px] font-black text-[#3a3442]">{summary.title}</p>
                          <p className="mt-0.5 line-clamp-3 text-[10px] italic text-[#8a8495]">
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
                    Drag tasks across To Do, In Progress, and Completed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddEmptyTask}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e1d8ef] bg-white px-4 text-xs font-black text-[#7c1cc9] transition hover:bg-[#f8f3ff]"
                >
                  <Plus className="size-4" />
                  Add Task
                </button>
              </div>

              {taskActionMessage ? (
                <div
                  className={[
                    'mb-3 rounded-lg border px-3 py-2 text-[12px] font-semibold',
                    taskActionTone === 'success'
                      ? 'border-[#c9e9cb] bg-[#edf9ee] text-[#2e6b37]'
                      : taskActionTone === 'error'
                        ? 'border-[#f4c8d4] bg-[#fff0f5] text-[#b53e66]'
                        : 'border-[#d9e3f4] bg-[#f4f8ff] text-[#3f5f9a]',
                  ].join(' ')}
                >
                  {taskActionMessage}
                </div>
              ) : null}

              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                {taskLaneConfig.map((lane) => {
                  const laneTasks = boardTasks.filter((task) => task.lane === lane.id);

                  return (
                    <article
                      key={lane.id}
                      className={[
                        'flex min-w-[320px] max-w-[400px] flex-1 flex-col rounded-xl border p-2.5 shadow-[0_2px_8px_rgba(32,20,52,0.04)] snap-center',
                        lane.panelClassName,
                      ].join(' ')}
                    >
                      <div className="mb-2 flex items-center gap-2 px-1">
                        <span
                          className={`inline-flex size-2.5 rounded-full ${lane.dotClassName}`}
                        />
                        <h3 className="text-[20px] font-black tracking-tight text-[#2f2b39]">
                          {lane.label} ({laneTasks.length})
                        </h3>
                      </div>

                      <div
                        className="flex-1 min-h-[400px] space-y-3 rounded-lg border border-dashed border-[#d8d2e2] bg-white/60 p-2"
                        onDragOver={handleLaneDragOver}
                        onDrop={(event) => handleDropTaskToLane(event, lane.id)}
                      >
                        {laneTasks.map((task) => (
                          <article
                            key={task.id}
                            draggable={task.lane !== 'completed'}
                            onDragStart={(event) => handleDragTaskStart(event, task.id)}
                            onDragEnd={handleDragTaskEnd}
                            onClick={() => openTaskPreview(task.id)}
                            className={[
                              'group relative flex flex-col w-full min-h-[200px] cursor-grab rounded-xl border p-3 shadow-[0_2px_6px_rgba(31,18,54,0.06)] active:cursor-grabbing',
                              lane.cardOuterClassName,
                            ].join(' ')}
                          >
                            <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#e4dfeb] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                              <div
                                className="mb-3 flex items-start justify-between gap-3 rounded-2xl px-4 py-3"
                                style={{
                                  background:
                                    'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.1))',
                                }}
                              >
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={[
                                      'truncate text-[24px] font-black leading-none',
                                      lane.cardTitleClassName,
                                    ].join(' ')}
                                  >
                                    {task.title || 'Note Title Here'}
                                  </p>
                                </div>

                                <div
                                  className="relative shrink-0"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setTaskCardMenuOpenFor((previous) =>
                                        previous === task.id ? null : task.id
                                      )
                                    }
                                    className="inline-flex size-7 items-center justify-center rounded-md text-[18px] leading-none text-[#3e384b] transition hover:bg-white/70"
                                    aria-label="Task options"
                                  >
                                    ⋯
                                  </button>

                                  {taskCardMenuOpenFor === task.id ? (
                                    <div className="absolute right-0 top-8 z-20 w-28 rounded-md border border-[#ddd7e8] bg-white py-1 shadow-[0_10px_20px_rgba(35,20,57,0.14)]">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTaskCardMenuOpenFor(null);
                                          openTaskPreview(task.id);
                                        }}
                                        className="flex w-full items-center px-3 py-1.5 text-left text-[12px] font-semibold text-[#4d465a] transition hover:bg-[#f7f3fb]"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteBoardTask(task.id)}
                                        className="flex w-full items-center px-3 py-1.5 text-left text-[12px] font-semibold text-[#4d465a] transition hover:bg-[#f7f3fb]"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>

                              <div className="min-h-0 flex-1 overflow-y-auto pr-2 text-[12px] leading-snug text-[#6f687f] [scrollbar-width:thin]">
                                <div className="space-y-1">
                                  {(task.details ?? '')
                                    .split('\n')
                                    .map((line) => line.trim())
                                    .filter(Boolean).length > 0 ? (
                                    (task.details ?? '')
                                      .split('\n')
                                      .map((line) => line.trim())
                                      .filter(Boolean)
                                      .map((line, index) => (
                                        <p
                                          key={`${task.id}-detail-${index}`}
                                          className="break-words"
                                        >
                                          {line}
                                        </p>
                                      ))
                                  ) : (
                                    <p>No details yet.</p>
                                  )}
                                </div>
                              </div>

                              {task.lane === 'in-progress' && (task.checklist ?? []).length > 0 ? (
                                <div className="mt-3 max-h-32 space-y-1 overflow-y-auto rounded-lg border border-[#ede9f4] bg-[#faf8fc] p-2 [scrollbar-width:thin]">
                                  {(task.checklist ?? []).map((item) => {
                                    const palette = [
                                      '#f347a5',
                                      '#8f1fd1',
                                      '#f1589e',
                                      '#2ea4ff',
                                      '#2ec24f',
                                      '#ffb86b',
                                      '#6f26b4',
                                    ];
                                    const colorIndex = (task.checklist ?? []).findIndex(
                                      (x) => x.id === item.id
                                    );
                                    const color = palette[colorIndex % palette.length];

                                    return (
                                      <div
                                        key={item.id}
                                        className="flex items-center gap-2 rounded-md p-1.5"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={!!item.done}
                                          disabled
                                          className="size-4 cursor-not-allowed"
                                          style={{
                                            accentColor: color,
                                          }}
                                        />
                                        <span
                                          className={`min-w-0 flex-1 truncate text-[11px] font-medium ${
                                            item.done
                                              ? 'text-[#a29faf] line-through'
                                              : 'text-[#5a546a]'
                                          }`}
                                        >
                                          {item.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : null}

                              {task.lane === 'completed' ? (
                                <div className="mt-4 rounded-xl border border-[#dde8eb] bg-[#f5fbfc] px-3 py-2">
                                  <div className="text-[13px] font-black text-[#1f1f21]">
                                    Completed
                                  </div>
                                  <div className="text-[12px] font-semibold text-[#6f687f]">
                                    This task is completed
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </article>
                        ))}

                        {laneTasks.length === 0 ? (
                          <p className="px-1 py-4 text-center text-[12px] font-semibold text-[#8e869e]">
                            Drop task here
                          </p>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : activeTab === 'notes' ? (
            <section className="rounded-2xl border border-[#ddd8e8] bg-[#f6f4f7] p-4 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              {/* Inline Note Creator - Fixed Width */}
              <div className="mb-8 mx-auto w-full max-w-2xl">
                {!isInlineNoteOpen ? (
                  <div
                    onClick={() => {
                      resetNoteDraft();
                      setEditingPlannerNoteId(null);
                      setIsInlineNoteOpen(true);
                    }}
                    className="flex cursor-text items-center justify-between rounded-xl border border-[#e3ddea] bg-white px-5 py-3.5 shadow-[0_2px_8px_rgba(27,16,45,0.04)] transition hover:shadow-md"
                  >
                    <span className="text-[14px] font-semibold text-[#8a8399]">Take a note...</span>
                    <div className="flex gap-4 text-[#aba3b9]">
                      <ListChecks className="size-5" />
                      <Pencil className="size-5" />
                      <ImagePlus className="size-5" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 rounded-xl border border-[#e3ddea] bg-white p-4 shadow-lg">
                    {noteDraftError && (
                      <p className="px-1 mb-2 text-xs font-bold text-[#d22067]">{noteDraftError}</p>
                    )}
                    <Input
                      value={noteDraftTitle}
                      onChange={(e) => setNoteDraftTitle(e.target.value)}
                      placeholder="Title"
                      className="h-auto border-none bg-transparent px-1 text-[16px] font-bold text-[#1f1f21] shadow-none focus-visible:ring-0 placeholder:text-[#8a8399]"
                    />
                    <textarea
                      autoFocus
                      value={noteDraftBody}
                      onChange={(e) => {
                        setNoteDraftBody(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      placeholder="Take a note..."
                      className="min-h-[60px] max-h-[50vh] w-full resize-none overflow-y-auto break-words whitespace-pre-wrap px-1 bg-transparent text-[14px] leading-relaxed text-[#4d4858] outline-none placeholder:text-[#aba3b9]"
                    />

                    {noteDraftImageDataUrl && (
                      <div className="relative mt-2 overflow-hidden rounded-lg border border-[#e0dbe6]">
                        <img
                          src={noteDraftImageDataUrl}
                          alt="Attached"
                          className="max-h-48 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNoteDraftImageDataUrl(undefined)}
                          className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between pt-1">
                      <div className="flex gap-1">
                        <label className="cursor-pointer rounded-full p-2 text-[#8a8399] transition hover:bg-[#f3eff8] hover:text-[#5d5670]">
                          <ImagePlus className="size-5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePlannerNoteImageChange}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseInlineNote}
                        className="rounded-md px-4 py-2 text-[13px] font-bold text-[#302c39] transition hover:bg-[#f3eff8]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Masonry Grid (Dynamic Height & Unclamped Text) */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {plannerNotes.map((note, index) => {
                  const noteTheme = noteTileThemes[index % noteTileThemes.length];
                  const isDragging = draggedNoteId === note.id;

                  return (
                    <article
                      key={note.id}
                      draggable
                      onDragStart={(e) => handleNoteDragStart(e, note.id)}
                      onDragEnd={handleNoteDragEnd}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => handleNoteDrop(e, note.id)}
                      onClick={() => handleEditPlannerNote(note)}
                      className={`break-inside-avoid relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#e3ddea] bg-white transition-all hover:shadow-md ${noteTheme.shellClassName} ${isDragging ? 'opacity-30 border-dashed scale-95' : 'opacity-100'}`}
                    >
                      {note.imageDataUrl && (
                        <img
                          src={note.imageDataUrl}
                          alt={`${note.title} attachment`}
                          className="w-full h-auto object-contain border-b border-[#e3ddea]"
                        />
                      )}
                      <div className="p-4 flex flex-col gap-2">
                        {note.title && (
                          <p className="text-[15px] font-bold text-inherit">{note.title}</p>
                        )}
                        <p
                          className={`break-words whitespace-pre-wrap text-[13px] leading-relaxed text-inherit/90`}
                        >
                          {note.body}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : activeTab === 'checklist' ? (
            <section className="rounded-2xl border border-[#ddd8e8] bg-[#fbfafd] p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-bold tracking-tight text-[#18151f]">
                  Checklist ({checklistItems.length} Items)
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-[#6f687f]">Overall Progress</span>
                  <span className="text-[14px] font-bold text-[#2f2b39]">{checklistProgress}%</span>
                </div>
              </div>

              <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-[#f0eaf6]">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${checklistProgress}%`,
                    background: 'linear-gradient(90deg, #f1589e, #8a1fd0)',
                  }}
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#ece8f0] bg-white">
                <ul className="divide-y divide-[#f0ecf6]">
                  {checklistItems.map((item, index) => {
                    const palette = [
                      '#f347a5',
                      '#8f1fd1',
                      '#f1589e',
                      '#2ea4ff',
                      '#2ec24f',
                      '#ffb86b',
                      '#6f26b4',
                    ];
                    const color = palette[index % palette.length];

                    return (
                      <li
                        key={item.id}
                        className="flex min-h-[56px] items-center justify-between px-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleTaskItem(checklistTaskCard?.id ?? '', item.id)
                            }
                            aria-label={`${item.done ? 'Uncheck' : 'Check'} ${item.label}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border-2 transition-all"
                            style={{
                              borderColor: color,
                              background: item.done ? color : 'white',
                              color: item.done ? 'white' : color,
                            }}
                          >
                            {item.done ? '✓' : ''}
                          </button>

                          <span
                            className="inline-flex h-2 w-2 shrink-0 rounded-full"
                            style={{ background: color }}
                          />

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
                            onClick={() =>
                              openChecklistDeleteValidation({ id: item.id, label: item.label })
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e8e0ea] bg-white text-[#7a728d] transition hover:border-[#f1589e] hover:text-[#f1589e]"
                            aria-label={`Delete ${item.label}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
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
        open={isNoteModalOpen}
        onOpenChange={(open) => {
          setIsNoteModalOpen(open);
          if (!open) handleCloseInlineNote();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-1rem)] rounded-xl border border-[#e3dfea] bg-white p-0 sm:max-w-[600px] overflow-hidden shadow-2xl"
        >
          <div className="flex max-h-[85vh] flex-col bg-white">
            <div className="overflow-y-auto [scrollbar-width:none]">
              {/* Image Header */}
              {noteDraftImageDataUrl ? (
                <div className="relative group bg-[#1f1f21]">
                  <img
                    src={noteDraftImageDataUrl}
                    alt="Attachment"
                    className="w-full h-auto max-h-[50vh] object-contain"
                  />
                </div>
              ) : null}

              {/* Note Content */}
              <div className="flex flex-col gap-4 p-6">
                {noteDraftError && (
                  <p className="text-xs font-bold text-[#d22067]">{noteDraftError}</p>
                )}
                <Input
                  value={noteDraftTitle}
                  onChange={(e) => setNoteDraftTitle(e.target.value)}
                  placeholder="Title"
                  className="h-auto border-none bg-transparent px-0 text-[22px] font-semibold text-[#202124] shadow-none focus-visible:ring-0 placeholder:text-[#8a8399]"
                />
                <textarea
                  value={noteDraftBody}
                  onChange={(e) => {
                    setNoteDraftBody(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="Take a note..."
                  className="min-h-[150px] w-full resize-none break-words whitespace-pre-wrap bg-transparent text-[15px] leading-relaxed text-[#3c4043] outline-none placeholder:text-[#5f6368]"
                />
              </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="flex items-center justify-between border-t border-[#f1f3f4] px-4 py-3 bg-white">
              <div className="flex items-center gap-2 text-[#5f6368]">
                <label className="cursor-pointer rounded-full p-2 hover:bg-[#f1f3f4] transition">
                  <ImagePlus className="size-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePlannerNoteImageChange}
                  />
                </label>
                {editingPlannerNoteId && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeletePlannerNote(editingPlannerNoteId);
                      setIsNoteModalOpen(false);
                    }}
                    className="cursor-pointer rounded-full p-2 hover:bg-[#ffeef5] hover:text-[#d22067] transition"
                    aria-label="Delete note"
                  >
                    <Trash2 className="size-5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleCloseInlineNote}
                className="rounded-md px-6 py-2 text-[14px] font-semibold text-[#3c4043] hover:bg-[#f1f3f4] transition"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTaskPreviewOpen}
        onOpenChange={(open) => {
          setIsTaskPreviewOpen(open);
          if (!open) {
            setSelectedBoardTaskId(null);
            setTaskPreviewTitle('');
            setTaskPreviewDetails('');
            setTaskPreviewChecklist([]);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-1rem)] rounded-xl border border-[#e3dfea] bg-white p-0 sm:max-w-[760px]"
        >
          {selectedBoardTask ? (
            <article>
              <header className="flex items-center justify-between border-b border-[#eee9f2] px-4 py-2">
                <p className="text-[12px] font-semibold text-[#6f687f]">
                  {selectedBoardTask.title || 'Untitled Task'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsTaskPreviewOpen(false);
                    setSelectedBoardTaskId(null);
                    setTaskPreviewTitle('');
                    setTaskPreviewDetails('');
                    setTaskPreviewChecklist([]);
                  }}
                  className="inline-flex size-7 items-center justify-center rounded-full text-[#9f97ad] transition hover:bg-[#f3eff8]"
                  aria-label="Close task preview"
                >
                  <X className="size-4" />
                </button>
              </header>

              <div className="h-16 border-b border-[#e4efe6] bg-[#dff0e0]" />

              {taskActionMessage ? (
                <div className="px-6 pt-4">
                  <div
                    className={[
                      'rounded-lg border px-3 py-2 text-[12px] font-semibold',
                      taskActionTone === 'success'
                        ? 'border-[#c9e9cb] bg-[#edf9ee] text-[#2e6b37]'
                        : taskActionTone === 'error'
                          ? 'border-[#f4c8d4] bg-[#fff0f5] text-[#b53e66]'
                          : 'border-[#d9e3f4] bg-[#f4f8ff] text-[#3f5f9a]',
                    ].join(' ')}
                  >
                    {taskActionMessage}
                  </div>
                </div>
              ) : null}

              {selectedBoardTask?.lane === 'todo' ? (
                <div className="grid gap-4 px-6 py-5 sm:grid-cols-[220px_minmax(0,1fr)]">
                  <aside className="rounded-lg border border-[#ece8f0] bg-white p-3">
                    <img
                      src="/Pictures/organizerpics/event-package-illustration.png"
                      alt="Task preview art"
                      className="h-20 w-full object-contain"
                    />
                    <p className="mt-2 text-[28px] font-black leading-none text-[#2f2b39]">
                      {(taskPreviewTitle || 'Untitled').split(' ')[0]}
                    </p>
                    <span className="mt-2 inline-flex rounded-sm bg-[#ffe7ef] px-2 py-0.5 text-[9px] font-bold text-[#cf3a79]">
                      1 Service
                    </span>
                  </aside>

                  <div className="space-y-3 rounded-lg border border-[#ece8f0] bg-white p-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b84a0]">
                        Editing To Do
                      </p>
                      <h4 className="mt-1 text-[22px] font-black leading-tight text-[#2f2b39]">
                        {taskPreviewTitle || 'Untitled Task'}
                      </h4>
                    </div>

                    <div>
                      <Label
                        htmlFor="task-preview-title"
                        className="text-[11px] font-semibold text-[#746e85]"
                      >
                        Title
                      </Label>
                      <Input
                        id="task-preview-title"
                        value={taskPreviewTitle}
                        onChange={(event) => setTaskPreviewTitle(event.target.value)}
                        placeholder="Enter task title"
                        className="mt-1 h-10 border-[#ddd7e8] text-[13px] font-semibold text-[#302c39]"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="task-preview-description"
                        className="mt-3 text-[11px] font-semibold text-[#746e85]"
                      >
                        Description
                      </Label>
                      <textarea
                        id="task-preview-description"
                        value={taskPreviewDetails}
                        onChange={(e) => setTaskPreviewDetails(e.target.value)}
                        placeholder="Enter a short description"
                        className="mt-1 h-24 w-full rounded-lg border border-[#ddd7e8] bg-white px-3 py-2 text-[13px] text-[#302c39] outline-none placeholder:text-[#8a8495] focus:border-[#b29ace]"
                      />
                    </div>

                    <div className="rounded-md border border-[#ece8f0] bg-[#faf8fd] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-[11px] font-semibold text-[#746e85]">
                          To Do Lists
                        </Label>
                        <button
                          type="button"
                          onClick={handleAddTodoChecklistItem}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-[#e1d8ef] bg-white px-2 text-[11px] font-semibold text-[#6f26b4] transition hover:bg-[#f8f3ff]"
                        >
                          <Plus className="size-3.5" />
                          Add item
                        </button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {taskPreviewChecklist.length > 0 ? (
                          taskPreviewChecklist.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-start gap-2 rounded-md border border-[#e9e3f1] bg-white px-2.5 py-2"
                            >
                              <span className="mt-2 inline-flex w-4 shrink-0 justify-center text-[14px] font-black leading-none text-[#8b84a0]">
                                -
                              </span>
                              <div className="min-w-0 flex-1">
                                <Label className="sr-only">Checklist item {index + 1}</Label>
                                <Input
                                  value={item.label}
                                  onChange={(event) =>
                                    handleUpdateTodoChecklistItem(item.id, event.target.value)
                                  }
                                  placeholder="Enter list item"
                                  className="h-9 border-[#ddd7e8] text-[12px] text-[#302c39]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveTodoChecklistItem(item.id)}
                                className="inline-flex size-8 items-center justify-center rounded-md border border-[#e1d8ef] bg-white text-[#7b6f90] transition hover:border-[#f1589e] hover:text-[#f1589e]"
                                aria-label="Remove list item"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-md border border-dashed border-[#d8d2e2] bg-white px-3 py-4 text-[12px] italic text-[#8b84a0]">
                            Add list items to build this task.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveTaskPreview}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-[#8f1fd1] px-4 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(143,31,209,0.3)]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-5">
                  <div className="rounded-lg border border-[#ece8f0] bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b84a0]">
                          {selectedBoardTask?.lane === 'completed'
                            ? 'Completed task'
                            : 'In progress task'}
                        </p>
                        <h4 className="mt-1 text-[24px] font-black leading-tight text-[#2f2b39]">
                          {taskPreviewTitle || 'Untitled Task'}
                        </h4>
                      </div>

                      {selectedBoardTask?.lane === 'completed' ? (
                        <span className="inline-flex rounded-full bg-[#deebf8] px-2 py-1 text-[10px] font-bold text-[#1f4c82]">
                          This task is completed
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-[#e8f3ff] px-2 py-1 text-[10px] font-bold text-[#2a6fb0]">
                          In progress
                        </span>
                      )}
                    </div>

                    <div className="mt-4 rounded-md border border-[#ece8f0] bg-[#faf8fd] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b84a0]">
                        Details
                      </p>
                      <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-[#5f596c]">
                        {taskPreviewDetails || 'No details provided.'}
                      </p>
                    </div>

                    <div className="mt-4 rounded-md border border-[#ece8f0] bg-white p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b84a0]">
                        {selectedBoardTask?.lane === 'completed'
                          ? 'Checklist breakdown'
                          : 'Checklist'}
                      </p>

                      <div className="mt-3 max-h-[280px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
                        {(selectedBoardTask?.checklist ?? []).length > 0 ? (
                          (selectedBoardTask?.checklist ?? []).map((item) => (
                            <div
                              key={item.id}
                              className="rounded-md border border-[#ece8f0] bg-[#faf8fd] px-3 py-2"
                            >
                              <div className="flex items-start gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleBoardTaskChecklistItem(
                                      selectedBoardTask.id,
                                      item.id
                                    )
                                  }
                                  aria-label={`${item.done ? 'Uncheck' : 'Check'} ${item.label}`}
                                  className={[
                                    'mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-black transition',
                                    item.done
                                      ? 'border-[#2ec24f] bg-[#2ec24f] text-white'
                                      : 'border-[#d8d2e2] bg-white text-[#8b84a0] hover:border-[#b8b0c3]',
                                  ].join(' ')}
                                >
                                  {item.done ? '✓' : ''}
                                </button>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[13px] font-semibold text-[#302c39]">
                                    {item.label}
                                  </p>
                                  <p className="mt-1 text-[11px] text-[#7a728d]">
                                    {item.done
                                      ? `Done ${formatChecklistTimestamp(item.doneAt)}`
                                      : 'Pending'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[12px] italic text-[#8b84a0]">
                            No checklist items available.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ) : null}
        </DialogContent>
      </Dialog>

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

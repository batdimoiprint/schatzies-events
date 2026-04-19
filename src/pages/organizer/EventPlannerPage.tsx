import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactElement } from 'react';
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  ListChecks,
  Pencil,
  PartyPopper,
  MoreHorizontal,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PlannerTab = 'overview' | 'task' | 'notes' | 'flow' | 'checklist';

type ProjectSlot = {
  id: number;
  title: string;
};

type SummaryCard = {
  label: string;
  value: string;
  valueClassName?: string;
  icon?: typeof PartyPopper;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  gradient: string;
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

type FlowPaletteKey = 'rose' | 'blue' | 'amber' | 'green';

type FlowPalette = {
  label: string;
  titleClassName: string;
  cardClassName: string;
  chipClassName: string;
  panelClassName: string;
};

type FlowNoteCard = {
  id: string;
  title: string;
  tag: string;
  headline: string;
  summary: string;
  bodyLines: string[];
  palette: FlowPaletteKey;
};

type FlowNoteDraft = {
  title: string;
  tag: string;
  headline: string;
  summary: string;
  bodyText: string;
  palette: FlowPaletteKey;
  startTime?: string;
  endTime?: string;
  description?: string;
  theme?: 'arrival' | 'ceremony' | 'reception' | 'closing';
};

type FlowNoteValidationItem = {
  label: string;
  helper: string;
  valid: boolean;
};

type FlowSidebarGroup = {
  label: string;
  items: Array<{ label: string; active?: boolean }>;
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

const summaryCards: SummaryCard[] = [
  {
    label: 'Event Package',
    value: 'Blooms Package',
    valueClassName: 'text-lg leading-tight',
    imageSrc: '/Pictures/organizerpics/event-package-illustration.png',
    imageAlt: 'Event package illustration',
    imageClassName: '-mt-1 object-right',
    gradient: 'from-[#fde6f6] to-[#f5ebff] text-[#8724b7]',
  },
  {
    label: 'Event Pax',
    value: '40',
    imageSrc: '/Pictures/organizerpics/event-pax-illustration.png',
    imageAlt: 'Event pax illustration',
    gradient: 'from-[#fff2de] to-[#fff9ea] text-[#9d5f11]',
  },
  {
    label: 'Event Type',
    value: 'Debut',
    imageSrc: '/Pictures/organizerpics/event-type-illustration.png',
    imageAlt: 'Event type illustration',
    gradient: 'from-[#eaf7ff] to-[#f2f8ff] text-[#1f6ea6]',
  },
  {
    label: 'Event Cost',
    value: '50,000',
    imageSrc: '/Pictures/organizerpics/event-cost-illustration.png',
    imageAlt: 'Event cost illustration',
    gradient: 'from-[#fff0e6] to-[#fff8f0] text-[#a6541d]',
  },
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

const flowPalettes: Record<FlowPaletteKey, FlowPalette> = {
  rose: {
    label: 'Rose',
    titleClassName: 'text-[#7a2d5f]',
    cardClassName: 'border-[#edd3e4] bg-[#f7dbe8]',
    chipClassName: 'bg-[#f6d6e8] text-[#7b2a5c]',
    panelClassName: 'border-[#edd3e4] bg-white',
  },
  blue: {
    label: 'Blue',
    titleClassName: 'text-[#284c7d]',
    cardClassName: 'border-[#d4dcf2] bg-[#e0e8ff]',
    chipClassName: 'bg-[#dfe7ff] text-[#2a4f7b]',
    panelClassName: 'border-[#d7def1] bg-white',
  },
  amber: {
    label: 'Amber',
    titleClassName: 'text-[#7c6440]',
    cardClassName: 'border-[#e6dccf] bg-[#efe0ca]',
    chipClassName: 'bg-[#efe3d4] text-[#7a654d]',
    panelClassName: 'border-[#e6dccf] bg-white',
  },
  green: {
    label: 'Green',
    titleClassName: 'text-[#557334]',
    cardClassName: 'border-[#d5ebce] bg-[#def0d6]',
    chipClassName: 'bg-[#dff0db] text-[#5a7335]',
    panelClassName: 'border-[#d5ebce] bg-white',
  },
};

const flowSidebarGroups: FlowSidebarGroup[] = [
  {
    label: 'MAIN',
    items: [
      { label: 'All notes', active: true },
      { label: 'Favorites' },
      { label: 'Recent notes' },
      { label: 'Tags' },
    ],
  },
  {
    label: 'ORDER',
    items: [{ label: 'Notebooks' }, { label: 'Projects' }, { label: 'Shared' }],
  },
  {
    label: 'SETTINGS',
    items: [{ label: 'Settings' }, { label: 'Sync Status' }],
  },
];

const initialFlowNotes: FlowNoteCard[] = [
  {
    id: 'psychology',
    title: 'Psychology',
    tag: 'Studies | University',
    headline: 'Introduction to Psychology',
    summary: 'Week 1, lecture notes',
    bodyLines: [
      'What is Psychology?',
      'Psychology is the scientific study of behavior and mental processes.',
      'Divided into several schools and perspectives.',
    ],
    palette: 'rose',
  },
  {
    id: 'groceries',
    title: 'Groceries',
    tag: 'Food',
    headline: 'Grocery list',
    summary: 'Weekly restock',
    bodyLines: ['Milk', 'Chicken breast', 'Apple Juice', 'Cherry tomatoes', 'Blueberries'],
    palette: 'blue',
  },
  {
    id: 'thai-chicken',
    title: 'Thai Chicken',
    tag: 'Food',
    headline: 'Recipe',
    summary: 'Protein prep',
    bodyLines: ['500g chicken breast', 'Sauce mix', 'Aromatics and seasoning', 'Serve warm'],
    palette: 'amber',
  },
  {
    id: 'autumn',
    title: 'Autumn is coming',
    tag: 'Diary | Thoughts',
    headline: "I'm exhausted all over again",
    summary: 'A quiet end-of-day note',
    bodyLines: [
      'Today feels heavy. My body moves slow, my thoughts even slower.',
      'I want to curl up, close my eyes, and let the world fade for a while.',
      'I do not want to go to uni tomorrow.',
    ],
    palette: 'green',
  },
];

function createDefaultFlowDraft(card?: FlowNoteCard): FlowNoteDraft {
  return {
    title: card?.title ?? '',
    tag: card?.tag ?? '',
    headline: card?.headline ?? '',
    summary: card?.summary ?? '',
    bodyText: card?.bodyLines.join('\n') ?? '',
    palette: card?.palette ?? 'rose',
    startTime: '05:00',
    endTime: '06:00',
    description: card?.summary ?? '',
    theme: paletteToLegacyTheme(card?.palette ?? 'rose'),
  };
}

function createFlowNoteId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function splitFlowBodyText(bodyText: string): string[] {
  return bodyText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function paletteToLegacyTheme(palette: FlowPaletteKey): 'arrival' | 'ceremony' | 'reception' | 'closing' {
  switch (palette) {
    case 'rose':
      return 'arrival';
    case 'blue':
      return 'ceremony';
    case 'amber':
      return 'reception';
    case 'green':
      return 'closing';
  }
}

type FlowNotesBoardProps = {
  selectedProjectTitle: string;
  flowSidebarGroups: FlowSidebarGroup[];
  flowSearch: string;
  onFlowSearchChange: (value: string) => void;
  flowLayoutMode: 'grid' | 'list';
  onFlowLayoutModeChange: (value: 'grid' | 'list') => void;
  flowSelectedOnly: boolean;
  onToggleFlowSelectedOnly: () => void;
  flowNotice: string;
  filteredFlowNotes: FlowNoteCard[];
  selectedFlowNote: FlowNoteCard | null;
  selectedFlowPalette: FlowPalette | null;
  flowValidationItems: FlowNoteValidationItem[];
  onEditSelected: () => void;
  onReviewSelection: () => void;
  renderFlowNoteCard: (note: FlowNoteCard) => ReactElement;
};

function FlowNotesBoard({ selectedProjectTitle }: FlowNotesBoardProps) {
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

  const selectedActivity = selectedActivityId
    ? timelineBlocks.find((block) => block.id === selectedActivityId) ?? null
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

  return (
    <>
      <section className="rounded-2xl border border-[#ddd8e8] bg-white p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#363042]">Flow Timeline</h3>
            <p className="text-xs font-semibold text-[#7e7690]">{selectedProjectTitle}</p>
          </div>

          <button
            type="button"
            onClick={openCreateActivity}
            className="inline-flex h-7 items-center gap-1.5 rounded-md bg-linear-to-r from-[#f347a5] to-[#8f1fd1] px-3 text-[11px] font-bold text-white shadow-[0_8px_16px_rgba(146,31,186,0.24)]"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        </div>

        <article className="overflow-hidden rounded-xl border border-[#ded8e8] bg-[#f7f7f8]">
          <div className="flex flex-wrap items-start justify-between gap-2 px-5 py-4">
            <div>
              <h4 className="text-[20px] font-black leading-tight text-[#2f2b39]">JANUARY 3, 2025</h4>
              <p className="text-xs font-semibold text-[#6d6679]">Event Flow</p>
            </div>

            <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#a29aac]">
              <span>Hide empty time slots</span>
              <input type="checkbox" className="size-3.5 cursor-pointer rounded border-[#c9c2d2]" />
            </label>
          </div>

          <div className="grid grid-cols-[72px_minmax(0,1fr)] border-t border-[#dfd9e8]">
            <div className="bg-[#f7f7f8]">
              {timelineHours.map((hour) => {
                const labelHour = hour === 12 ? 12 : ((hour + 11) % 12) + 1;
                return (
                  <div
                    key={hour}
                    className="flex items-start justify-end border-b border-[#d5d1da] pr-2 pt-2 text-[14px] font-semibold text-[#9690a2]"
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
                style={{ height: `${timelineHours.length * hourRowHeight}px` }}
              >
                {timelineHours.map((hour, index) => (
                  <div
                    key={`${hour}-line`}
                    className="absolute left-0 right-0 border-t border-[#d5d1da]"
                    style={{ top: `${index * hourRowHeight}px` }}
                  />
                ))}

                {timelineBlocks.map((block) => {
                  const duration = Math.max(1, block.endHour - block.startHour);

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
                      className={`absolute overflow-hidden rounded-sm border border-[#d2ced8] px-2.5 py-1.5 text-[#5f596b] shadow-[0_2px_8px_rgba(24,14,44,0.08)] ${block.tone}`}
                      style={{
                        top: `${(block.startHour - timelineStartHour) * hourRowHeight + 2}px`,
                        height: `${duration * hourRowHeight - 4}px`,
                        left: block.left,
                        width: block.width,
                        zIndex: block.id === selectedActivityId ? 30 : 10,
                      }}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="truncate text-[12px] font-black leading-tight text-[#4e4858]">
                          {block.title}
                        </p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteActivity(block.id);
                          }}
                          className="mt-0.5 text-[#57515f] transition-colors hover:text-[#2f2b39]"
                          aria-label={`Remove ${block.title}`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 truncate text-[10px] font-semibold leading-tight text-[#6d667a]">
                        Time: {formatDisplayTime(block.from, block.startHour)} - {formatDisplayTime(block.to, block.endHour)}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] leading-tight text-[#6c6678]">
                        {block.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
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
                    {isEditingActivity ? (selectedActivity ? 'Edit Activity' : 'New Activity') : 'Activity Info'}
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
                      setActivityDraft((previous) => ({ ...previous, description: event.target.value }))
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
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#9d97a8]">Description</p>
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

const serviceRequirements = [
  'Classic Buffet',
  '1. Appetizer',
  'Light finger foods and canapes',
  '2. Main Course',
  'Chicken inasal, cordon bleu, and seafood',
  '3. Dessert',
  'Seasonal fruits, mousse cups, and custom cake',
];

const allocationResources = [
  {
    title: 'Event Coordinator',
    detail: ['Ken Chan', '08:00 - 08:00'],
  },
  {
    title: 'Host',
    detail: ['Angel U. Nicorn', '08:00 - 08:00'],
  },
  {
    title: 'Technicals',
    detail: [
      '1. Audio Cue',
      '2. Lighting Cue',
      '3. Visual/Screen Cue',
      '4. System Tech/Troubleshooter',
      '5. Dry Run Team',
    ],
  },
];

const meetings = ['Meeting 1 | 2hrs Coffee', 'Meeting 2 | 2hrs Coffee', 'Meeting 3 | 2hrs'];

const checkedItems = [
  'Technical manpower',
  'Lights and trussing',
  'Fresh flowers delivered',
  'Dry run DAY1',
  'Dry run DAY2',
];

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

export function EventPlannerPage() {
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [activeTab, setActiveTab] = useState<PlannerTab>('task');
  const [plannerTaskCards, setPlannerTaskCards] = useState<TaskCard[]>(taskCards);
  const [checklistDraftItem, setChecklistDraftItem] = useState('');
  const [plannerNotes, setPlannerNotes] = useState<PlannerQuickNote[]>(initialPlannerNotes);
  const [noteDraftTitle, setNoteDraftTitle] = useState('');
  const [noteDraftBody, setNoteDraftBody] = useState('');
  const [noteDraftImageDataUrl, setNoteDraftImageDataUrl] = useState<string | null>(null);
  const [noteDraftError, setNoteDraftError] = useState('');
  const [editingPlannerNoteId, setEditingPlannerNoteId] = useState<string | null>(null);
  const [flowNotes, setFlowNotes] = useState<FlowNoteCard[]>(() => initialFlowNotes);
  const [selectedFlowNoteId, setSelectedFlowNoteId] = useState(initialFlowNotes[0]?.id ?? '');
  const [flowSearch, setFlowSearch] = useState('');
  const [flowLayoutMode, setFlowLayoutMode] = useState<'grid' | 'list'>('grid');
  const [flowSelectedOnly, setFlowSelectedOnly] = useState(false);
  const [flowDraft, setFlowDraft] = useState<FlowNoteDraft>(() =>
    createDefaultFlowDraft(initialFlowNotes[0])
  );
  const [editingFlowNoteId, setEditingFlowNoteId] = useState<string | null>(null);
  const [isFlowEditorOpen, setIsFlowEditorOpen] = useState(false);
  const [isFlowConfirmOpen, setIsFlowConfirmOpen] = useState(false);
  const [flowEditorError, setFlowEditorError] = useState('');
  const [pendingFlowNote, setPendingFlowNote] = useState<FlowNoteCard | null>(null);
  const [flowNotice, setFlowNotice] = useState('');
  const [taskReminderNotice, setTaskReminderNotice] = useState('');
  const [remindedTaskIds, setRemindedTaskIds] = useState<string[]>([]);

  const selectedProject = useMemo(() => {
    return projectSlots.find((project) => project.id === selectedProjectId) ?? projectSlots[0];
  }, [selectedProjectId]);

  const selectedProjectTitle = selectedProject.title || 'Pending project slot';

  const flowThemes = {
    arrival: {
      label: 'Arrival',
      description: 'Guest arrival, registration, and welcome touchpoints.',
      chipClassName: flowPalettes.rose.chipClassName,
      panelClassName: flowPalettes.rose.panelClassName,
    },
    ceremony: {
      label: 'Ceremony',
      description: 'Formal program cues, speeches, and stage transitions.',
      chipClassName: flowPalettes.blue.chipClassName,
      panelClassName: flowPalettes.blue.panelClassName,
    },
    reception: {
      label: 'Reception',
      description: 'Food service, games, photos, and mingling.',
      chipClassName: flowPalettes.amber.chipClassName,
      panelClassName: flowPalettes.amber.panelClassName,
    },
    closing: {
      label: 'Closing',
      description: 'Final remarks, send-off, and cleanup transitions.',
      chipClassName: flowPalettes.green.chipClassName,
      panelClassName: flowPalettes.green.panelClassName,
    },
  };

  const flowThemeOrder: Array<keyof typeof flowThemes> = [
    'arrival',
    'ceremony',
    'reception',
    'closing',
  ];

  const flowEditorMode: 'create' | 'edit' = editingFlowNoteId ? 'edit' : 'create';

  const selectedFlowNote = useMemo(() => {
    if (!flowNotes.length) {
      return null;
    }

    return (
      flowNotes.find((note) => note.id === selectedFlowNoteId) ?? flowNotes[0]
    );
  }, [flowNotes, selectedFlowNoteId]);

  const selectedFlowPalette = selectedFlowNote ? flowPalettes[selectedFlowNote.palette] : null;

  const filteredFlowNotes = useMemo(() => {
    const query = flowSearch.trim().toLowerCase();

    return flowNotes.filter((note) => {
      if (flowSelectedOnly && selectedFlowNote && note.id !== selectedFlowNote.id) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [note.title, note.tag, note.headline, note.summary, note.bodyLines.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [flowNotes, flowSearch, flowSelectedOnly, selectedFlowNote]);

  const flowValidationItems = useMemo(() => {
    if (!selectedFlowNote) {
      return [];
    }

    return [
      {
        label: 'Title',
        helper: selectedFlowNote.title,
        valid: selectedFlowNote.title.trim().length > 0,
      },
      {
        label: 'Headline',
        helper: selectedFlowNote.headline,
        valid: selectedFlowNote.headline.trim().length > 0,
      },
      {
        label: 'Preview lines',
        helper: `${selectedFlowNote.bodyLines.length} lines ready`,
        valid: selectedFlowNote.bodyLines.length >= 2,
      },
      {
        label: 'Confirmation',
        helper: 'This note stays locked after the review step.',
        valid: selectedFlowNote.bodyLines.length >= 2,
      },
    ];
  }, [selectedFlowNote]);

  const openFlowEditor = (modeOrNote: 'create' | 'edit' | FlowNoteCard, activity?: unknown) => {
    void activity;

    setFlowEditorError('');
    setFlowNotice('');
    setPendingFlowNote(null);
    setIsFlowConfirmOpen(false);

    const nextNote =
      typeof modeOrNote === 'string'
        ? selectedFlowNote ?? flowNotes[0] ?? initialFlowNotes[0]
        : modeOrNote;

    if (!nextNote) {
      return;
    }

    setEditingFlowNoteId(nextNote.id);
    setSelectedFlowNoteId(nextNote.id);
    setFlowDraft(createDefaultFlowDraft(nextNote));

    setIsFlowEditorOpen(true);
  };

  const handleFlowEditorSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = flowDraft.title.trim();
    const normalizedTag = flowDraft.tag.trim();
    const normalizedHeadline = flowDraft.headline.trim();
    const normalizedSummary = flowDraft.summary.trim();
    const normalizedBodyLines = splitFlowBodyText(flowDraft.bodyText);

    if (!normalizedTitle) {
      setFlowEditorError('Add a title before confirming the note.');
      return;
    }

    if (!normalizedTag) {
      setFlowEditorError('Add a label before confirming the note.');
      return;
    }

    if (!normalizedHeadline) {
      setFlowEditorError('Add the preview headline before confirming.');
      return;
    }

    if (normalizedBodyLines.length < 2) {
      setFlowEditorError('Add at least two preview lines.');
      return;
    }

    const nextNote: FlowNoteCard = {
      id: editingFlowNoteId ?? createFlowNoteId(),
      title: normalizedTitle,
      tag: normalizedTag,
      headline: normalizedHeadline,
      summary: normalizedSummary,
      bodyLines: normalizedBodyLines,
      palette: flowDraft.palette,
    };

    setFlowEditorError('');
    setPendingFlowNote(nextNote);
    setIsFlowEditorOpen(false);
    setIsFlowConfirmOpen(true);
  };

  const handleConfirmPendingFlowNote = () => {
    if (!pendingFlowNote) {
      return;
    }

    setFlowNotes((previousNotes) => {
      const nextNotes = editingFlowNoteId
        ? previousNotes.map((note) =>
            note.id === editingFlowNoteId ? pendingFlowNote : note
          )
        : [...previousNotes, pendingFlowNote];

      return nextNotes;
    });

    setSelectedFlowNoteId(pendingFlowNote.id);
    setFlowNotice(
      `${pendingFlowNote.title} has been updated, validated, and confirmed.`
    );
    setPendingFlowNote(null);
    setEditingFlowNoteId(null);
    setIsFlowConfirmOpen(false);
  };

  const handleReviewSelection = () => {
    if (!selectedFlowNote) {
      return;
    }

    setFlowNotice(`${selectedFlowNote.title} is ready for confirmation.`);
  };

  const resetNoteDraft = () => {
    setNoteDraftTitle('');
    setNoteDraftBody('');
    setNoteDraftImageDataUrl(null);
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
        return previousNotes.map((note) =>
          note.id === editingPlannerNoteId ? nextNote : note
        );
      }

      return [nextNote, ...previousNotes];
    });

    resetNoteDraft();
  };

  const handleEditPlannerNote = (note: PlannerQuickNote) => {
    setEditingPlannerNoteId(note.id);
    setNoteDraftTitle(note.title);
    setNoteDraftBody(note.body);
    setNoteDraftImageDataUrl(note.imageDataUrl ?? null);
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

  const handleSendTaskReminder = (taskCard: TaskCard) => {
    const facilitatorName = taskCard.owner.replace(/^Owner:\s*/i, '');
    const pendingCount = taskCard.items.filter((item) => !item.done).length;

    setTaskReminderNotice(
      `Reminder sent to ${facilitatorName} for ${taskCard.title}. ` +
        `Pending items: ${pendingCount}. Channel: in-app alert + facilitator briefing note.`
    );

    setRemindedTaskIds((previousIds) => [
      taskCard.id,
      ...previousIds.filter((taskId) => taskId !== taskCard.id),
    ]);
  };

  const totalTaskItems = useMemo(() => {
    return plannerTaskCards.reduce((count, card) => count + card.items.length, 0);
  }, [plannerTaskCards]);

  const completedTaskItems = useMemo(() => {
    return plannerTaskCards.reduce(
      (count, card) => count + card.items.filter((item) => item.done).length,
      0
    );
  }, [plannerTaskCards]);

  const overviewTaskProgress = totalTaskItems > 0
    ? Math.round((completedTaskItems / totalTaskItems) * 100)
    : 0;

  const checklistTaskCard = useMemo(() => {
    return plannerTaskCards.find((card) => card.id === 'task-budget') ?? null;
  }, [plannerTaskCards]);

  const checklistItems = checklistTaskCard?.items ?? [];

  const handleAddChecklistItem = () => {
    const normalizedLabel = checklistDraftItem.trim();

    if (!normalizedLabel || !checklistTaskCard) {
      return;
    }

    setPlannerTaskCards((previousCards) =>
      previousCards.map((card) => {
        if (card.id !== checklistTaskCard.id) {
          return card;
        }

        const nextItemId = `cost-${Date.now()}`;
        return {
          ...card,
          items: [...card.items, { id: nextItemId, label: normalizedLabel, done: false }],
        };
      })
    );

    setChecklistDraftItem('');
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

  const renderFlowNoteCard = (note: FlowNoteCard) => {
    const palette = flowPalettes[note.palette];
    const isSelected = selectedFlowNoteId === note.id;

    return (
      <article
        key={note.id}
        className={[
          'overflow-hidden rounded-[30px] border p-3 shadow-[0_2px_8px_rgba(32,20,52,0.04)]',
          palette.cardClassName,
          isSelected ? 'ring-2 ring-[#f347a5]/20 shadow-[0_16px_28px_rgba(171,39,185,0.12)]' : '',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-2 px-1">
          <h4 className={`text-lg font-semibold tracking-tight ${palette.titleClassName}`}>
            {note.title}
          </h4>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => openFlowEditor(note)}
              className="inline-flex size-7 items-center justify-center rounded-full text-[#4b3c63] transition hover:bg-white/70"
              aria-label={`Edit ${note.title}`}
            >
              <Plus className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedFlowNoteId(note.id)}
              className="inline-flex size-7 items-center justify-center rounded-full text-[#4b3c63] transition hover:bg-white/70"
              aria-label={`Select ${note.title}`}
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSelectedFlowNoteId(note.id)}
          className="mt-3 block w-full rounded-[26px] border border-white/80 bg-white px-4 py-4 text-left shadow-[0_12px_24px_rgba(32,20,52,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(32,20,52,0.12)]"
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[#90879d]">
            <span className="rounded-full bg-[#f7f2fb] px-2 py-1 text-[10px] font-bold text-[#796a87]">
              {note.tag}
            </span>
          </div>
          <h5 className="mt-3 text-[24px] font-black leading-[1.05] text-[#1f2430]">
            {note.headline}
          </h5>
          <p className="mt-2 text-[11px] font-semibold text-[#71697e]">{note.summary}</p>

          <div className="mt-4 space-y-1.5 text-[12px] leading-relaxed text-[#5b6270]">
            {note.bodyLines.slice(0, 3).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </button>
      </article>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[1260px] flex-col gap-4 pb-2 text-[#302c39]">
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

                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-[#6b647b]">Description</p>
                  <p className="mt-1 line-clamp-2 text-[11px] italic text-[#9891a6]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis
                    bibendum.
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-3 inline-flex h-5 w-13 items-center justify-center rounded-full bg-linear-to-r from-[#f44aa3] to-[#861fd1] text-[10px] font-bold tracking-wide text-white"
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-7 items-center justify-center rounded-md bg-white/20 text-sm font-bold">
                  {selectedProject.id}
                </span>
                <div>
                  <h2 className="text-xl font-extrabold leading-none">{selectedProjectTitle}</h2>
                  <div className="mt-2 space-y-1 text-xs text-white/90">
                    <p className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      January 3, 2026
                    </p>
                    <p>Start Date - End Date</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[420px]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>89% complete</span>
                  <span className="text-[11px] text-white/85">Current progress</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-white/35 p-[2px]">
                  <div className="h-full w-[89%] rounded-full bg-white" />
                </div>
                <div className="mt-2 text-right text-[11px] font-semibold text-white/90">
                  <p>Client Name: Example Name</p>
                  <p>Email | Contact Number</p>
                </div>
              </div>
            </div>
          </article>

          <div className="rounded-xl border border-[#ddd8e8] bg-white p-1 shadow-[0_4px_12px_rgba(33,19,57,0.05)]">
            <nav className="flex flex-wrap gap-1" aria-label="Event planning sections">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      'rounded-md px-4 py-1.5 text-xs font-bold transition-all',
                      active
                        ? 'bg-[#f4eefb] text-[#7c1cc9] shadow-[inset_0_0_0_1px_rgba(127,36,185,0.16)]'
                        : 'text-[#6b647d] hover:bg-[#f6f2fb] hover:text-[#4f4960]',
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {activeTab === 'overview' ? (
            <section className="relative overflow-hidden rounded-3xl border border-[#ddd8e8] bg-[#faf8ff] p-3 shadow-[0_14px_28px_rgba(37,18,67,0.08)]">
              <div className="pointer-events-none absolute -top-14 -right-8 h-44 w-44 rounded-full bg-[#f1589e]/12 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-[#7c1cc9]/12 blur-2xl" />

              <div className="relative rounded-2xl border border-[#e5dff0] bg-linear-to-r from-[#ffffff] via-[#fff6fb] to-[#f7f1ff] p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#8d819f]">
                      Overview Command Center
                    </p>
                    <h2 className="mt-1 text-[22px] font-black tracking-tight text-[#342d44]">
                      {selectedProjectTitle}
                    </h2>
                    <p className="mt-1 max-w-[620px] text-[12px] font-semibold text-[#6d6680]">
                      Centralized view for tasks, resources, flow, and facilitator reminders.
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-[#e2dbee] bg-white px-3 py-1 text-[11px] font-black text-[#7c1cc9]">
                        {completedTaskItems}/{totalTaskItems} tasks completed
                      </span>
                      <span className="inline-flex rounded-full border border-[#f0d5e4] bg-[#fff4fa] px-3 py-1 text-[11px] font-black text-[#d73586]">
                        {totalTaskItems - completedTaskItems} pending actions
                      </span>
                      <span className="inline-flex rounded-full border border-[#d8ddef] bg-[#f2f5ff] px-3 py-1 text-[11px] font-black text-[#385b98]">
                        {flowNotes.length} flow segments
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#e8e1f4] bg-white/85 px-3 py-2 shadow-[0_8px_18px_rgba(50,26,80,0.08)]">
                    <div
                      className="grid size-[72px] place-items-center rounded-full"
                      style={{
                        background: `conic-gradient(#7c1cc9 ${overviewTaskProgress}%, #ece6f6 ${overviewTaskProgress}% 100%)`,
                      }}
                    >
                      <div className="grid size-[56px] place-items-center rounded-full bg-white">
                        <p className="text-[14px] font-black text-[#3c3550]">{overviewTaskProgress}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-[#8b84a0]">
                        Completion Health
                      </p>
                      <p className="text-[12px] font-semibold text-[#5b5470]">
                        Updated from the live task board.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-3 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                  <article className="rounded-2xl border border-[#e3deed] bg-white p-3">
                    <h3 className="text-sm font-black text-[#4f4860]">Event Snapshot</h3>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {summaryCards.map((card) => (
                        <article
                          key={card.label}
                          className={`rounded-xl border border-white/70 bg-linear-to-br p-3 shadow-[0_6px_16px_rgba(37,18,67,0.06)] ${card.gradient}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">
                                {card.label}
                              </p>
                              <p
                                className={[
                                  'mt-1 font-black tracking-tight text-[#2f2940]',
                                  card.valueClassName ?? 'text-[24px]',
                                ].join(' ')}
                              >
                                {card.value}
                              </p>
                            </div>
                            {card.imageSrc ? (
                              <img
                                src={card.imageSrc}
                                alt={card.imageAlt ?? card.label}
                                className={[
                                  'h-[46px] w-[72px] shrink-0 object-contain',
                                  card.imageClassName ?? '',
                                ].join(' ')}
                                loading="lazy"
                              />
                            ) : (
                              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/80">
                                {card.icon ? <card.icon className="size-5" /> : null}
                              </span>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </article>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <article className="rounded-2xl border border-[#e3deed] bg-white p-3">
                      <h3 className="text-sm font-black text-[#4f4860]">Service Requirements</h3>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#7f7891]">Food & dietary notes</p>
                      <div className="mt-2 space-y-2">
                        {serviceRequirements.map((item) => (
                          <div
                            key={item}
                            className="rounded-lg border border-[#efe8f7] bg-[#fcfbff] px-2.5 py-2 text-[11px] font-semibold text-[#645d76]"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-2xl border border-[#e3deed] bg-white p-3">
                      <h3 className="text-sm font-black text-[#4f4860]">Allocation Resources</h3>
                      <div className="mt-2 space-y-2">
                        {allocationResources.map((resource) => (
                          <div
                            key={resource.title}
                            className="rounded-lg border border-[#e8e3f0] bg-[#fcfbfe] p-2"
                          >
                            <p className="text-[11px] font-black text-[#5f3ed0]">{resource.title}</p>
                            <div className="mt-1.5 space-y-1 text-[11px] font-semibold text-[#6f687f]">
                              {resource.detail.map((line) => (
                                <p key={line}>{line}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>
                </div>

                <div className="space-y-3">
                  <article className="rounded-2xl border border-[#e3deed] bg-white p-3">
                    <h3 className="text-sm font-black text-[#4f4860]">Checklist &amp; Meeting Notes</h3>
                    <div className="mt-2 space-y-1.5 text-[11px] font-semibold text-[#6f687f]">
                      {meetings.map((meeting) => (
                        <p key={meeting}>{meeting}</p>
                      ))}
                    </div>
                    <ul className="mt-3 space-y-1.5 text-[11px] font-semibold text-[#6f687f]">
                      {checkedItems.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-0.5 text-[10px] text-[#a8a1b8]">□</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className="rounded-2xl border border-[#e3deed] bg-white p-3">
                    <h3 className="text-sm font-black text-[#4f4860]">Program Flow Highlights</h3>
                    <div className="mt-2 space-y-2">
                      {flowNotes.slice(0, 4).map((note) => {
                        const palette = flowPalettes[note.palette];

                        return (
                          <div key={note.id} className={`rounded-lg border p-2 ${palette.panelClassName}`}>
                            <p
                              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${palette.chipClassName}`}
                            >
                              {palette.label}
                            </p>
                            <p className="mt-2 text-[11px] font-black text-[#4a425e]">{note.headline}</p>
                            <p className="mt-1 text-[11px] leading-tight text-[#6f687f]">{note.summary}</p>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                </div>
              </div>

              <article className="relative mt-3 rounded-2xl border border-[#ddd8e8] bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-[#50495f]">Task Pulse &amp; Reminders</h3>
                    <p className="text-[11px] font-semibold text-[#6f687f]">
                      Remind owners/facilitators instantly from overview.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('task')}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-[#ddd5ea] px-3 text-[11px] font-bold text-[#5d5572] transition hover:bg-[#f5f1fb]"
                  >
                    Open Task Board
                  </button>
                </div>

                {taskReminderNotice ? (
                  <div className="mt-2 rounded-lg border border-[#e7d9fa] bg-[#f8f2ff] px-3 py-2 text-[11px] font-semibold text-[#643c9f]">
                    {taskReminderNotice}
                  </div>
                ) : null}

                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {plannerTaskCards.map((taskCard) => {
                    const completedCount = taskCard.items.filter((item) => item.done).length;
                    const pendingCount = taskCard.items.length - completedCount;
                    const facilitatorName = taskCard.owner.replace(/^Owner:\s*/i, '');
                    const progress = taskCard.items.length
                      ? Math.round((completedCount / taskCard.items.length) * 100)
                      : 0;
                    const reminded = remindedTaskIds.includes(taskCard.id);

                    return (
                      <article
                        key={`overview-${taskCard.id}`}
                        className="rounded-xl border border-[#e8e3f1] bg-[#fcfbff] p-2.5 shadow-[0_6px_14px_rgba(30,15,50,0.06)]"
                      >
                        <p className="text-[12px] font-black text-[#463f58]">{taskCard.title}</p>
                        <p className="mt-1 text-[10px] font-semibold text-[#7b748f]">{taskCard.due}</p>
                        <p className="text-[10px] font-semibold text-[#6e6881]">
                          Owner/Facilitator: {facilitatorName}
                        </p>

                        <div className="mt-2 h-1.5 rounded-full bg-[#eee8f7]">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <p className="mt-1 text-[10px] font-bold text-[#6f687f]">
                          {completedCount}/{taskCard.items.length} complete • {pendingCount} pending
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleSendTaskReminder(taskCard)}
                            className="inline-flex h-7 items-center justify-center rounded-md bg-[#7c1cc9] px-2.5 text-[10px] font-black text-white transition hover:bg-[#6e17b5]"
                          >
                            Remind
                          </button>

                          {reminded ? (
                            <span className="text-[10px] font-black text-[#6e2aa5]">Reminder sent</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-[#a19ab0]">No reminder yet</span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </article>
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
                  /
                  {plannerTaskCards.reduce((count, card) => count + card.items.length, 0)} tasks done
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                {plannerTaskCards.map((taskCard) => {
                  const completedCount = taskCard.items.filter((item) => item.done).length;
                  const totalItems = taskCard.items.length;
                  const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

                  return (
                  <article
                    key={taskCard.id}
                    className={`overflow-hidden rounded-2xl border p-3 shadow-[0_2px_8px_rgba(32,20,52,0.04)] ${taskCard.frameClassName}`}
                  >
                    <div
                      className={`flex h-full min-h-[260px] flex-col rounded-xl bg-linear-to-br p-4 ${taskCard.accentClassName}`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-black tracking-tight">{taskCard.title}</h3>
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
            <section className="rounded-2xl border border-[#ddd8e8] bg-[#efeff1] p-4 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="mx-auto max-w-[420px] rounded-md border border-[#9f9aa9] bg-[#ececee] p-2.5 shadow-[0_2px_8px_rgba(27,16,45,0.08)]">
                <div className="rounded-sm border border-[#a7a2b0] bg-[#f2f2f3] px-2 py-1">
                  <input
                    type="text"
                    value={noteDraftTitle}
                    onChange={(event) => setNoteDraftTitle(event.target.value)}
                    placeholder="Title"
                    className="w-full border-0 bg-transparent text-sm font-semibold text-[#4f4a58] outline-none placeholder:text-[#7f7a88]"
                  />

                  <textarea
                    value={noteDraftBody}
                    onChange={(event) => setNoteDraftBody(event.target.value)}
                    placeholder="Take note"
                    className="mt-2 h-10 w-full resize-none border-0 bg-transparent text-[11px] text-[#5f596b] outline-none placeholder:text-[#8a8495]"
                  />

                  {noteDraftImageDataUrl ? (
                    <div className="mt-2 overflow-hidden rounded border border-[#b6b1bf] bg-white">
                      <img
                        src={noteDraftImageDataUrl}
                        alt="Uploaded note evidence"
                        className="h-28 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  {noteDraftError ? (
                    <p className="mt-2 text-[10px] font-semibold text-[#c13a74]">{noteDraftError}</p>
                  ) : null}

                  <div className="mt-1 flex items-center justify-between border-t border-[#cbc7d3] pt-1 text-[10px] text-[#575266]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSavePlannerNote}
                        className="font-bold text-[#4a4654] transition hover:text-[#1f1f22]"
                      >
                        Save
                      </button>
                      <label className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#4a4654] transition hover:text-[#1f1f22]">
                        <ImagePlus className="size-3.5" />
                        <span>Insert Image</span>
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
                          onClick={() => setNoteDraftImageDataUrl(null)}
                          className="font-semibold text-[#6f697c] transition hover:text-[#393443]"
                        >
                          Remove Image
                        </button>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={resetNoteDraft}
                      className="font-semibold text-[#6f697c] transition hover:text-[#393443]"
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
                    className="w-full max-w-[190px] rounded-md border border-[#8f8999] bg-[#e6e6e8] p-3 shadow-[0_2px_6px_rgba(27,16,45,0.08)]"
                  >
                    <p className="text-[13px] font-black text-[#2f2a38]">{note.title}</p>

                    {note.imageDataUrl ? (
                      <div className="mt-2 overflow-hidden rounded border border-[#b5b0bc] bg-[#f5f5f7]">
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

                    <div className="mt-4 flex items-center justify-end gap-2 text-[#5f596b]">
                      <button
                        type="button"
                        onClick={() => handleEditPlannerNote(note)}
                        className="transition hover:text-[#292531]"
                        aria-label={`Edit ${note.title}`}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlannerNote(note.id)}
                        className="transition hover:text-[#292531]"
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
            <section className="rounded-2xl border border-[#ddd8e8] bg-[#fbfafd] p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e7e2f0] bg-white px-3 py-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8f879f]">
                    Checklist
                  </p>
                  <h3 className="text-[22px] font-black tracking-tight text-[#272331]">
                    {checklistItems.length} Items
                  </h3>
                </div>
                <span className="inline-flex rounded-full border border-[#e2dbee] bg-[#f8f4fd] px-3 py-1 text-xs font-black text-[#7c1cc9]">
                  {checklistItems.filter((item) => item.done).length}/{checklistItems.length} done
                </span>
              </div>

              <div className="rounded-md border border-[#d7d2dd] bg-[#efeff1] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]">
                <ul>
                  {checklistItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex min-h-[44px] items-center justify-between border-b border-[#cfc9d8] px-2 transition-colors hover:bg-white/35"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleToggleTaskItem(checklistTaskCard?.id ?? '', item.id)}
                          className={[
                            'inline-flex size-6 items-center justify-center rounded-sm border-2 text-[11px] font-black transition-all',
                            item.done
                              ? 'border-[#ff1f7a] bg-[#ff1f7a] text-white'
                              : 'border-[#ff1f7a] bg-white text-transparent hover:text-[#ff1f7a]',
                          ].join(' ')}
                          aria-label={`${item.done ? 'Uncheck' : 'Check'} ${item.label}`}
                        >
                          ✓
                        </button>
                        <span className="text-[14px] font-semibold tracking-tight text-[#3b3744]">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.id === 'cost-2' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#e3e3e6] px-2 py-1 text-[10px] font-bold text-[#6f697e]">
                            <CalendarDays className="size-3" />
                            Due Jan 2
                          </span>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(item.id)}
                          className="inline-flex size-7 items-center justify-center rounded-md border border-[#d7d0e2] bg-white text-[#7a728d] transition hover:border-[#f1589e] hover:text-[#f1589e]"
                          aria-label={`Remove ${item.label}`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mx-auto mt-4 w-full max-w-[520px] rounded-xl border border-[#ddd6e7] bg-white p-3 shadow-[0_8px_18px_rgba(46,28,80,0.08)]">
                  <p className="text-[12px] font-black uppercase tracking-[0.08em] text-[#7b7390]">
                    Add Checklist Item
                  </p>

                  <form
                    className="mt-2 space-y-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleAddChecklistItem();
                    }}
                  >
                    <Label htmlFor="checklist-item-input" className="text-xs font-semibold text-[#5a5468]">
                      Item name
                    </Label>
                    <Input
                      id="checklist-item-input"
                      type="text"
                      value={checklistDraftItem}
                      onChange={(event) => setChecklistDraftItem(event.target.value)}
                      className="h-10 border-[#d5cede] text-sm font-semibold text-[#3f3a4e]"
                    />

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setChecklistDraftItem('')}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-[#d7d0e2] px-3 text-xs font-bold text-[#5d5670] transition hover:bg-[#f4f1f8]"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-linear-to-r from-[#f1589e] via-[#d735b3] to-[#8a1fd0] px-4 text-xs font-black text-white shadow-[0_10px_22px_rgba(125,31,186,0.34)]"
                      >
                        <Plus className="size-3.5" />
                        Add Item
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          ) : activeTab === 'flow' ? (
            <FlowNotesBoard
              selectedProjectTitle={selectedProjectTitle}
              flowSidebarGroups={flowSidebarGroups}
              flowSearch={flowSearch}
              onFlowSearchChange={setFlowSearch}
              flowLayoutMode={flowLayoutMode}
              onFlowLayoutModeChange={setFlowLayoutMode}
              flowSelectedOnly={flowSelectedOnly}
              onToggleFlowSelectedOnly={() => setFlowSelectedOnly((previous) => !previous)}
              flowNotice={flowNotice}
              filteredFlowNotes={filteredFlowNotes}
              selectedFlowNote={selectedFlowNote}
              selectedFlowPalette={selectedFlowPalette}
              flowValidationItems={flowValidationItems}
              onEditSelected={() => {
                if (selectedFlowNote) {
                  openFlowEditor(selectedFlowNote);
                }
              }}
              onReviewSelection={handleReviewSelection}
              renderFlowNoteCard={renderFlowNoteCard}
            />
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
        open={isFlowEditorOpen}
        onOpenChange={(open) => {
          setIsFlowEditorOpen(open);

          if (!open) {
            setFlowEditorError('');
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-1rem)] overflow-hidden rounded-3xl border border-[#e6deef] bg-white p-0 sm:max-w-[640px]"
        >
          <div className="relative bg-linear-to-r from-[#f347a5] to-[#8f1fd1] px-5 py-4 text-white">
            <button
              type="button"
              onClick={() => setIsFlowEditorOpen(false)}
              className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              aria-label="Close flow editor"
            >
              <X className="size-4" />
            </button>

            <DialogHeader className="max-w-[90%] gap-1">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/80">
                Flow Editor
              </p>
              <DialogTitle className="text-xl font-black">
                {flowEditorMode === 'edit' ? 'Edit Activity' : 'New Activity'}
              </DialogTitle>
              <p className="text-xs text-white/85">
                Validate the title, time range, and review gate before saving the activity.
              </p>
            </DialogHeader>
          </div>

          <form onSubmit={handleFlowEditorSubmit} className="space-y-4 px-5 py-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="flow-title" className="text-[11px] font-bold text-[#6a627c]">
                  Title *
                </Label>
                <Input
                  id="flow-title"
                  value={flowDraft.title}
                  onChange={(event) => {
                    setFlowDraft((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }));
                  }}
                  placeholder="Enter activity title"
                  className="h-10 rounded-lg border-[#ddd8e8] bg-white px-3 text-sm text-[#4c455e]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-[#6a627c]">Time range *</Label>

                <div className="flex flex-col overflow-hidden rounded-lg border border-[#ddd8e8] bg-white sm:flex-row">
                  <Input
                    type="time"
                    value={flowDraft.startTime}
                    onChange={(event) => {
                      setFlowDraft((previous) => ({
                        ...previous,
                        startTime: event.target.value,
                      }));
                    }}
                    aria-label="Start time"
                    className="h-10 rounded-none border-0 bg-transparent px-2 text-xs text-[#4c455e] focus-visible:ring-0"
                  />
                  <div className="h-px bg-[#ddd8e8] sm:h-auto sm:w-px" />
                  <Input
                    type="time"
                    value={flowDraft.endTime}
                    onChange={(event) => {
                      setFlowDraft((previous) => ({
                        ...previous,
                        endTime: event.target.value,
                      }));
                    }}
                    aria-label="End time"
                    className="h-10 rounded-none border-0 bg-transparent px-2 text-xs text-[#4c455e] focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-[#6a627c]">Section *</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {flowThemeOrder.map((themeKey) => {
                  const theme = flowThemes[themeKey];
                  const isSelected = flowDraft.theme === themeKey;

                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => {
                        setFlowDraft((previous) => ({
                          ...previous,
                          theme: themeKey,
                        }));
                      }}
                      className={[
                        'rounded-2xl border p-3 text-left transition-all',
                        theme.panelClassName,
                        isSelected
                          ? 'ring-2 ring-[#8f1fd1]/20 shadow-[0_10px_18px_rgba(171,39,185,0.12)]'
                          : 'opacity-85 hover:-translate-y-0.5',
                      ].join(' ')}
                    >
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${theme.chipClassName}`}
                      >
                        {theme.label}
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-[#5f576d]">
                        {theme.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="flow-description" className="text-[11px] font-bold text-[#6a627c]">
                Description
              </Label>
              <textarea
                id="flow-description"
                value={flowDraft.description}
                onChange={(event) => {
                  setFlowDraft((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }));
                }}
                placeholder="Optional notes for the schedule block"
                className="h-24 w-full resize-none rounded-lg border border-[#ddd8e8] bg-white px-3 py-2 text-sm text-[#4c455e] outline-none placeholder:text-[#a49cb3] focus:border-[#be8de4]"
              />
            </div>

            {flowEditorError ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl border border-[#f4c3da] bg-[#fff1f7] px-4 py-3 text-xs font-semibold text-[#c33274]"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{flowEditorError}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-2xl border border-[#dfeedd] bg-[#f3fbf2] px-4 py-3 text-xs font-semibold text-[#2f6f3b]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <span>
                  Title, time range, and confirmation step will be validated before saving.
                </span>
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFlowEditorOpen(false)}
                className="h-9 rounded-full border-[#d8d0ea] px-4 text-xs font-black text-[#7c1cc9] hover:bg-[#f6f0ff]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 rounded-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] px-4 text-xs font-black text-white hover:brightness-105"
              >
                <Sparkles className="size-3.5" />
                {flowEditorMode === 'edit' ? 'Review Changes' : 'Review Activity'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isFlowConfirmOpen}
        onOpenChange={(open) => {
          setIsFlowConfirmOpen(open);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-1rem)] overflow-hidden rounded-3xl border border-[#e6deef] bg-white p-0 sm:max-w-[520px]"
        >
          <div className="relative bg-linear-to-r from-[#7d1fd0] to-[#f23fa3] px-5 py-4 text-white">
            <button
              type="button"
              onClick={() => setIsFlowConfirmOpen(false)}
              className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              aria-label="Close confirmation dialog"
            >
              <X className="size-4" />
            </button>

            <DialogHeader className="max-w-[90%] gap-1">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/80">
                Confirmation
              </p>
              <DialogTitle className="text-xl font-black">Review Note</DialogTitle>
              <p className="text-xs text-white/85">
                Confirm the validated note before it is added to the board.
              </p>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-5 py-5">
            {pendingFlowNote ? (
              <div
                className={`rounded-2xl border p-4 ${flowPalettes[pendingFlowNote.palette].panelClassName}`}
              >
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${flowPalettes[pendingFlowNote.palette].chipClassName}`}
                >
                  {flowPalettes[pendingFlowNote.palette].label}
                </span>
                <h4 className="mt-2 text-lg font-black text-[#1f2430]">
                  {pendingFlowNote.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#625a70]">
                  {pendingFlowNote.headline}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#625a70]">
                  {pendingFlowNote.summary || 'No summary provided.'}
                </p>
                <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-[#5b6270]">
                  {pendingFlowNote.bodyLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="mt-3 text-[11px] font-semibold text-[#8b8596]">
                  Label: {pendingFlowNote.tag}
                </p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-[#e7e1ef] bg-[#fbf9fe] p-4 text-xs leading-relaxed text-[#6f687f]">
              This review step is the final confirmation gate. After approval, the flow board is
              updated with the validated time range.
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFlowConfirmOpen(false);
                  setIsFlowEditorOpen(true);
                }}
                className="h-9 rounded-full border-[#d8d0ea] px-4 text-xs font-black text-[#7c1cc9] hover:bg-[#f6f0ff]"
              >
                Back to Editor
              </Button>
              <Button
                type="button"
                onClick={handleConfirmPendingFlowNote}
                className="h-9 rounded-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] px-4 text-xs font-black text-white hover:brightness-105"
              >
                <CheckCircle2 className="size-3.5" />
                Confirm and Save
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

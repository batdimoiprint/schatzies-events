import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  MoreVertical,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';
import {
  getCalendarEntries,
  createCalendarEntry,
  updateCalendarEntry,
  deleteCalendarEntry,
  markDoneCalendarEntry,
} from '@/api/calendar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CalendarViewMode = 'monthly' | 'weekly';

type BaseCalendarLabel = 'Task' | 'Meeting' | 'Reminder';

type CalendarLabel = BaseCalendarLabel | string;

type CalendarEntry = {
  id: string;
  title: string;
  startDateKey: string;
  startTime: string;
  endDateKey: string;
  endTime: string;
  label: CalendarLabel;
  location: string;
  description: string;
  eventType: string;
  isDone?: boolean;
};

type DraftEntry = {
  title: string;
  startDateKey: string;
  startTime: string;
  endDateKey: string;
  endTime: string;
  label: CalendarLabel;
  location: string;
  description: string;
  eventType: string;
};

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calendarLabels: BaseCalendarLabel[] = ['Task', 'Meeting', 'Reminder'];

const labelStyles: Record<
  BaseCalendarLabel,
  { chip: string; dot: string; badge: string; solid: string }
> = {
  Task: {
    chip: 'border-[#f3da7c] bg-[#fff8de] text-[#7c6819]',
    dot: 'bg-[#e2c341]',
    badge: 'bg-[#fff3c4] text-[#7c6819]',
    solid: '#e2c341',
  },
  Meeting: {
    chip: 'border-[#d3a5ef] bg-[#f7ebff] text-[#6f2ea8]',
    dot: 'bg-[#9740d0]',
    badge: 'bg-[#edd8fb] text-[#6f2ea8]',
    solid: '#9740d0',
  },
  Reminder: {
    chip: 'border-[#f4b3d8] bg-[#ffeaf5] text-[#b92e79]',
    dot: 'bg-[#e54e9d]',
    badge: 'bg-[#ffd7ea] text-[#b92e79]',
    solid: '#e54e9d',
  },
};

const labelPickerStyles: Record<BaseCalendarLabel, string> = {
  Task: 'bg-[#f6efc8] text-[#9e8514]',
  Meeting: 'bg-[#d7b9f2] text-[#8f43d3]',
  Reminder: 'bg-[#f5c6df] text-[#cf2f7f]',
};

const customLabelStyle = {
  chip: 'border-[#e2deea] bg-[#f6f5f8] text-[#4f4a56]',
  dot: 'bg-[#8f879f]',
  badge: 'bg-[#f0edf4] text-[#4f4a56]',
  solid: '#8f879f',
};

const sidebarSectionTitleClass = 'text-sm font-black uppercase tracking-[0.12em] text-[#8f879f]';

function isBaseCalendarLabel(value: string): value is BaseCalendarLabel {
  return value === 'Task' || value === 'Meeting' || value === 'Reminder';
}

function getLabelStyle(label: CalendarLabel) {
  if (isBaseCalendarLabel(label)) {
    return labelStyles[label];
  }
  return customLabelStyle;
}

function getLabelPickerStyle(label: CalendarLabel): string {
  if (isBaseCalendarLabel(label)) {
    return labelPickerStyles[label];
  }
  return 'bg-[#f0edf4] text-[#4f4a56]';
}

const monthTitleFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey?: string): Date {
  if (!dateKey) return new Date();
  const parts = dateKey.split('-');
  if (parts.length !== 3) return new Date();

  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return new Date();

  return new Date(year, month - 1, day);
}

function addDays(date: Date, offset: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + offset);
  return nextDate;
}

function startOfWeek(date: Date): Date {
  return addDays(date, -date.getDay());
}

function buildMonthlyViewDays(monthDate: Date): Date[] {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const leadingDays = firstDay.getDay();
  const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    return new Date(monthDate.getFullYear(), monthDate.getMonth(), index - leadingDays + 1);
  });
}

function buildWeeklyViewDays(anchorDate: Date): Date[] {
  const weekStart = startOfWeek(anchorDate);
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

function compareEntriesByTime(a: CalendarEntry, b: CalendarEntry): number {
  const timeA = a.startTime || '';
  const timeB = b.startTime || '';
  return timeA.localeCompare(timeB);
}

function toDateTimeValue(dateKey: string, time: string): number {
  const [hours, minutes] = time.split(':').map((value) => Number(value));
  const date = parseDateKey(dateKey);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes).getTime();
}

function getDateKeysInRange(startDateKey?: string, endDateKey?: string): string[] {
  if (!startDateKey) return [];
  const start = parseDateKey(startDateKey);
  const end = parseDateKey(endDateKey || startDateKey);

  if (end < start) {
    return [startDateKey];
  }

  const keys: string[] = [];
  let cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cursor <= endDate) {
    keys.push(toDateKey(cursor));
    cursor = addDays(cursor, 1);
  }

  return keys;
}

function formatDateKeyShort(dateKey: string): string {
  return shortDateFormatter.format(parseDateKey(dateKey));
}

function formatTime12Hour(time24?: string): string {
  if (!time24) return '12:00 AM';
  const [h, m] = time24.split(':');
  let hours = parseInt(h, 10);
  if (isNaN(hours)) return time24;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12;
  return `${String(hours).padStart(2, '0')}:${m || '00'} ${ampm}`;
}

function createEntryId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CalendarPage() {
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const [viewMode, setViewMode] = useState<CalendarViewMode>('monthly');
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [labelFilters, setLabelFilters] = useState<Record<BaseCalendarLabel, boolean>>({
    Task: true,
    Meeting: true,
    Reminder: true,
  });
  const [showOnlyMarkedDates, setShowOnlyMarkedDates] = useState(false);
  const [customLabels, setCustomLabels] = useState<string[]>([]);
  const [isAddingCustomLabel, setIsAddingCustomLabel] = useState(false);
  const [customLabelDraft, setCustomLabelDraft] = useState('');
  const [customLabelError, setCustomLabelError] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [isForcingAdd, setIsForcingAdd] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [draftEntry, setDraftEntry] = useState<DraftEntry>(() => ({
    title: '',
    startDateKey: todayKey,
    startTime: '09:00',
    endDateKey: todayKey,
    endTime: '10:00',
    label: 'Task',
    location: '',
    description: '',
    eventType: 'General',
  }));

  useEffect(() => {
    if (!isFilterMenuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isFilterMenuOpen]);

  useEffect(() => {
    setDraftEntry((previous) => ({
      ...previous,
      startDateKey: selectedDateKey,
      endDateKey: selectedDateKey,
    }));
  }, [selectedDateKey]);

  useEffect(() => {
    setIsForcingAdd(false);
  }, [selectedDateKey]);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const rawData: any = await getCalendarEntries();

        let dataArray: any[] = [];
        if (Array.isArray(rawData)) {
          dataArray = rawData;
        } else if (rawData?.entries && Array.isArray(rawData.entries)) {
          dataArray = rawData.entries;
        } else if (rawData?.data && Array.isArray(rawData.data)) {
          dataArray = rawData.data;
        }

        if (dataArray.length > 0) {
          const formattedEntries: CalendarEntry[] = dataArray.map((item: any) => {
            const rawLabel = String(item.label || item.type || 'Task');
            const formattedLabel =
              rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1).toLowerCase();

            const actualId =
              item._id || item.id || item.entryId || item.eventId || item.uuid || createEntryId();

            let startKey = item.startDateKey || item.date || item.createdAt || '';
            if (startKey && startKey.includes('T')) startKey = startKey.split('T')[0];

            let endKey = item.endDateKey || item.endDate || startKey;
            if (endKey && endKey.includes('T')) endKey = endKey.split('T')[0];

            // ROBUST TIME EXTRACTION - Prevents the 12:00 AM bug!
            let extractedStartTime = item.startTime || item.time || '';
            if (!extractedStartTime && item.date && item.date.includes('T')) {
              extractedStartTime = item.date.split('T')[1].substring(0, 5);
            }

            let extractedEndTime = item.endTime || '';
            if (!extractedEndTime && item.endDate && item.endDate.includes('T')) {
              extractedEndTime = item.endDate.split('T')[1].substring(0, 5);
            }

            return {
              id: String(actualId),
              title: item.title || 'Untitled',
              startDateKey: startKey,
              startTime: extractedStartTime || '00:00',
              endDateKey: endKey,
              endTime: extractedEndTime || '00:00',
              label: formattedLabel as CalendarLabel,
              location: item.location || '',
              description: item.description || '',
              eventType: item.eventType || 'General',
              isDone: Boolean(item.isDone || item.status === 'Completed' || item.status === true),
            };
          });
          setEntries(formattedEntries);
        } else {
          setEntries([]);
        }
      } catch (error) {
        console.error('Failed to load calendar entries:', error);
      }
    };

    loadEntries();
  }, []);

  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);

  const visibleDays = useMemo(() => {
    if (viewMode === 'weekly') {
      return buildWeeklyViewDays(selectedDate);
    }
    return buildMonthlyViewDays(displayMonth);
  }, [displayMonth, selectedDate, viewMode]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (isBaseCalendarLabel(entry.label)) {
          return labelFilters[entry.label];
        }
        return true;
      })
      .sort((a, b) => {
        if (a.startDateKey === b.startDateKey) {
          return compareEntriesByTime(a, b);
        }
        return a.startDateKey.localeCompare(b.startDateKey);
      });
  }, [entries, labelFilters]);

  const entriesByDate = useMemo(() => {
    const map: Record<string, CalendarEntry[]> = {};
    filteredEntries.forEach((entry) => {
      getDateKeysInRange(entry.startDateKey, entry.endDateKey).forEach((dateKey) => {
        if (!map[dateKey]) {
          map[dateKey] = [];
        }
        map[dateKey].push(entry);
      });
    });
    return map;
  }, [filteredEntries]);

  const visibleDaysToRender = useMemo(() => {
    if (!showOnlyMarkedDates) return visibleDays;
    return visibleDays.filter((d) => {
      const key = toDateKey(d);
      const list = entriesByDate[key];
      return Array.isArray(list) && list.length > 0;
    });
  }, [visibleDays, showOnlyMarkedDates, entriesByDate]);

  const selectedDateEntries = entriesByDate[selectedDateKey] ?? [];
  const shouldShowAddForm = isForcingAdd || selectedDateEntries.length === 0;
  const shouldShowMarkersSection = selectedDateEntries.length > 0 && !isForcingAdd;

  const markedDateCount = useMemo(() => {
    return Object.keys(entriesByDate).length;
  }, [entriesByDate]);

  const enabledFilterCount = useMemo(() => {
    return calendarLabels.filter((label) => labelFilters[label]).length;
  }, [labelFilters]);

  const selectableLabels = useMemo(() => {
    return [...calendarLabels, ...customLabels];
  }, [customLabels]);

  const periodLabel = useMemo(() => {
    if (viewMode === 'monthly') {
      return monthTitleFormatter.format(displayMonth);
    }
    const weekStart = visibleDays[0];
    const weekEnd = visibleDays[visibleDays.length - 1];
    if (!weekStart || !weekEnd) {
      return '';
    }
    return `${shortDateFormatter.format(weekStart)} - ${shortDateFormatter.format(weekEnd)}`;
  }, [displayMonth, viewMode, visibleDays]);

  const handleSelectDate = (date: Date) => {
    const nextKey = toDateKey(date);
    setSelectedDateKey(nextKey);
    setDisplayMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleNavigatePrevious = () => {
    if (viewMode === 'monthly') {
      setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
      return;
    }
    handleSelectDate(addDays(selectedDate, -7));
  };

  const handleNavigateNext = () => {
    if (viewMode === 'monthly') {
      setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
      return;
    }
    handleSelectDate(addDays(selectedDate, 7));
  };

  const handleGoToToday = () => {
    handleSelectDate(parseDateKey(todayKey));
  };

  const handleToggleLabelFilter = (label: BaseCalendarLabel) => {
    setLabelFilters((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  };

  const handleResetFilters = () => {
    setLabelFilters({ Task: true, Meeting: true, Reminder: true });
  };

  const handleCreateCustomLabel = () => {
    const nextLabel = customLabelDraft.trim();
    if (!nextLabel) {
      setCustomLabelError('Enter a label name first.');
      return;
    }
    const alreadyExists = selectableLabels.some(
      (existingLabel) => existingLabel.toLowerCase() === nextLabel.toLowerCase()
    );
    if (alreadyExists) {
      setCustomLabelError('Label already exists.');
      return;
    }
    setCustomLabels((previous) => [...previous, nextLabel]);
    setDraftEntry((previous) => ({
      ...previous,
      label: nextLabel,
    }));
    setCustomLabelDraft('');
    setCustomLabelError('');
    setIsAddingCustomLabel(false);
  };

  const handleAddMarker = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draftEntry.title.trim()) {
      setFormError('Please add a title for this date marker.');
      return;
    }

    if (!draftEntry.startDateKey || !draftEntry.endDateKey) {
      setFormError('Please provide both start and end dates.');
      return;
    }

    const normalizedStartDateKey = draftEntry.startDateKey || selectedDateKey;
    const normalizedStartTime = draftEntry.startTime || '09:00';
    const normalizedEndDateKey = draftEntry.endDateKey || normalizedStartDateKey;
    const normalizedEndTime = draftEntry.endTime || normalizedStartTime;

    const startDateTime = toDateTimeValue(normalizedStartDateKey, normalizedStartTime);
    const endDateTime = toDateTimeValue(normalizedEndDateKey, normalizedEndTime);

    if (endDateTime < startDateTime) {
      setFormError('End date and time must be after start date and time.');
      return;
    }

    setFormError('');

    const payload = {
      title: draftEntry.title.trim(),
      startDateKey: normalizedStartDateKey,
      startTime: normalizedStartTime,
      endDateKey: normalizedEndDateKey,
      endTime: normalizedEndTime,
      label: draftEntry.label.toUpperCase(),
      type: draftEntry.label.toUpperCase(),
      location: draftEntry.location.trim(),
      description: draftEntry.description.trim(),
      eventType: draftEntry.eventType,
      // JUST USE EXACT DATES AS SHOWN IN YOUR SWAGGER
      date: normalizedStartDateKey,
      endDate: normalizedEndDateKey,
    };

    try {
      if (editingId) {
        await updateCalendarEntry(editingId, payload);
        setEntries((prev) =>
          prev.map((e) =>
            e.id === editingId ? { ...e, ...payload, label: draftEntry.label as CalendarLabel } : e
          )
        );
        setEditingId(null);
      } else {
        const createdItem = await createCalendarEntry(payload);
        const newId =
          createdItem?.entryId ||
          createdItem?._id ||
          createdItem?.id ||
          createdItem?.eventId ||
          createEntryId();

        const newEntry: CalendarEntry = {
          id: String(newId),
          ...payload,
          label: draftEntry.label as CalendarLabel,
          isDone: false,
        };
        setEntries((previous) => [...previous, newEntry]);
      }

      setSelectedDateKey(normalizedStartDateKey);
      setDisplayMonth(
        new Date(
          parseDateKey(normalizedStartDateKey).getFullYear(),
          parseDateKey(normalizedStartDateKey).getMonth(),
          1
        )
      );
      setIsForcingAdd(false);
      setDraftEntry((prev) => ({
        ...prev,
        title: '',
        location: '',
        description: '',
        startDateKey: normalizedStartDateKey,
        startTime: normalizedStartTime,
        endDateKey: normalizedStartDateKey,
        endTime: normalizedStartTime,
      }));
    } catch (error) {
      console.error('Failed to save entry:', error);
      setFormError('Failed to save to database. Please try again.');
    }
  };

  return (
    <section className="w-full min-h-[calc(100vh-150px)] pb-2">
      <div className="flex w-full min-w-0 flex-col gap-4 text-[#302c39]">
        <div className="grid items-start grid-cols-[minmax(0,1fr)_320px] gap-4">
          <div className="self-start rounded-2xl border border-[#ddd8e8] bg-white p-5 shadow-[0_8px_20px_rgba(46,22,76,0.07)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#ece7f2] pb-4">
              <div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black text-[#2f2b39]">{periodLabel}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleNavigatePrevious}
                        className="rounded-full bg-linear-to-r from-[#8f1fd1] to-[#be8de4] text-white shadow-[0_8px_18px_rgba(143,31,209,0.18)] hover:opacity-95"
                        aria-label="Previous period"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleNavigateNext}
                        className="rounded-full bg-linear-to-r from-[#8f1fd1] to-[#be8de4] text-white shadow-[0_8px_18px_rgba(143,31,209,0.18)] hover:opacity-95"
                        aria-label="Next period"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoToToday}
                      className="h-8 rounded-full border-2 border-[#f347a5] bg-white px-3 text-xs font-bold text-[#8f2bd2] hover:bg-[#fff8fb]"
                    >
                      Today
                    </Button>
                  </div>
                </div>
                <p className="text-xs font-semibold text-[#8f879f]">
                  {markedDateCount} marked dates
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="inline-flex items-center rounded-xl border border-[#ddd8e8] bg-[#faf9fd] p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('monthly')}
                    className={[
                      'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                      viewMode === 'monthly'
                        ? 'bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_8px_14px_rgba(169,42,188,0.3)]'
                        : 'text-[#655d75] hover:text-[#3c3650]',
                    ].join(' ')}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('weekly')}
                    className={[
                      'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                      viewMode === 'weekly'
                        ? 'bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_8px_14px_rgba(169,42,188,0.3)]'
                        : 'text-[#655d75] hover:text-[#3c3650]',
                    ].join(' ')}
                  >
                    Weekly
                  </button>
                </div>

                <div className="relative" ref={filterMenuRef}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFilterMenuOpen((open) => !open)}
                    className="h-8 rounded-full border-[#ddd8e8] px-3 text-xs font-bold text-[#655d75] hover:bg-[#f4effa]"
                  >
                    <Filter className="size-3.5" />
                    Filter
                  </Button>

                  {isFilterMenuOpen ? (
                    <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-[#e3deec] bg-white p-3 shadow-[0_14px_24px_rgba(49,25,77,0.16)]">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#958ea3]">
                          View
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setViewMode('monthly')}
                            className={[
                              'rounded-lg border px-2 py-1.5 text-xs font-bold transition-colors',
                              viewMode === 'monthly'
                                ? 'border-[#be8de4] bg-[#f7eeff] text-[#712ca9]'
                                : 'border-[#e5e0ed] text-[#6c6580] hover:bg-[#f8f5fd]',
                            ].join(' ')}
                          >
                            Monthly
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewMode('weekly')}
                            className={[
                              'rounded-lg border px-2 py-1.5 text-xs font-bold transition-colors',
                              viewMode === 'weekly'
                                ? 'border-[#be8de4] bg-[#f7eeff] text-[#712ca9]'
                                : 'border-[#e5e0ed] text-[#6c6580] hover:bg-[#f8f5fd]',
                            ].join(' ')}
                          >
                            Weekly
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-[#ede8f4] pt-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#958ea3]">
                          Labels
                        </p>
                        <div className="mt-2 space-y-2">
                          {calendarLabels.map((label) => (
                            <label
                              key={label}
                              className="flex cursor-pointer items-center justify-between rounded-lg border border-[#ece7f2] px-2 py-1.5 text-xs font-semibold text-[#5c556f] hover:bg-[#f9f6fd]"
                            >
                              <span className="flex items-center gap-2">
                                <span className={`size-2 rounded-full ${labelStyles[label].dot}`} />
                                {label}
                              </span>
                              <input
                                type="checkbox"
                                checked={labelFilters[label]}
                                onChange={() => handleToggleLabelFilter(label)}
                                className="size-3.5 rounded border border-[#cbc3d9] accent-[#8f1fd1]"
                              />
                            </label>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-[#7d7690]">
                          <span>{enabledFilterCount} active</span>
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="text-[#8b22ca] hover:text-[#6d1e9d]"
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-[#ede8f4] pt-3">
                        <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold text-[#5c556f] hover:bg-[#f9f6fd]">
                          <span className="truncate">Show only dates with events</span>
                          <input
                            type="checkbox"
                            checked={showOnlyMarkedDates}
                            onChange={() => setShowOnlyMarkedDates((prev) => !prev)}
                            className="size-3.5 rounded border border-[#cbc3d9] accent-[#8f1fd1]"
                          />
                        </label>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="min-w-0">
                <div className="grid grid-cols-7 gap-2">
                  {weekdayLabels.map((weekday) => (
                    <div
                      key={weekday}
                      className="rounded-lg border border-[#ece7f2] bg-[#f9f7fc] py-2 text-center text-xs font-bold uppercase tracking-wide text-[#8f879f]"
                    >
                      <span>{weekday}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-7 gap-2">
                  {visibleDaysToRender.map((date) => {
                    const dateKey = toDateKey(date);
                    const dayEntries = entriesByDate[dateKey] ?? [];
                    const isToday = dateKey === todayKey;
                    const isSelected = dateKey === selectedDateKey;
                    const isCurrentMonth =
                      date.getMonth() === displayMonth.getMonth() &&
                      date.getFullYear() === displayMonth.getFullYear();

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => handleSelectDate(date)}
                        className={[
                          'flex flex-col rounded-xl border p-2 text-left transition-all overflow-hidden relative',
                          viewMode === 'monthly' ? 'h-28' : 'h-36',
                          isSelected
                            ? 'border-[#be8de4] bg-[#fbf5ff] shadow-[0_8px_18px_rgba(165,62,191,0.18)]'
                            : 'border-[#ece7f2] bg-white hover:border-[#d7cbe7] hover:bg-[#fcf9ff]',
                          viewMode === 'monthly' && !isCurrentMonth ? 'opacity-55' : '',
                        ].join(' ')}
                      >
                        <div className="flex items-center justify-between shrink-0 mb-1">
                          <span
                            className={[
                              'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-black',
                              isToday
                                ? 'bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white'
                                : 'text-[#4a445a]',
                            ].join(' ')}
                          >
                            {String(date.getDate()).padStart(2, '0')}
                          </span>

                          {dayEntries.length > 0 ? (
                            <span className="text-[10px] font-bold text-[#8f879f]">
                              {dayEntries.length}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-1 w-full flex-1 space-y-1 overflow-hidden">
                          {dayEntries.slice(0, 3).map((entry) => (
                            <span
                              key={entry.id}
                              className={`block truncate rounded-md border px-1.5 py-1 text-[10px] font-semibold ${getLabelStyle(entry.label).chip}`}
                              title={`${formatTime12Hour(entry.startTime)} - ${formatTime12Hour(entry.endTime)} ${entry.title}`}
                            >
                              {formatTime12Hour(entry.startTime)} -{' '}
                              {formatTime12Hour(entry.endTime)} {entry.title}
                            </span>
                          ))}
                          {dayEntries.length > 3 ? (
                            <span className="block text-[10px] font-semibold text-[#8f879f]">
                              +{dayEntries.length - 3} more
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {selectableLabels.map((label) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${getLabelStyle(label).badge}`}
                >
                  <span className={`size-2 rounded-full ${getLabelStyle(label).dot}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <aside className="w-[320px] self-start">
            {shouldShowAddForm ? (
              <section className="rounded-2xl border border-[#ddd8e8] bg-white p-4 shadow-[0_8px_20px_rgba(46,22,76,0.07)] animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className={sidebarSectionTitleClass}>
                    {editingId ? 'Edit Marker' : 'Add Marker'}
                  </h3>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setIsForcingAdd(false);
                      }}
                      className="text-[10px] font-bold text-[#c33274] hover:underline"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs font-semibold text-[#7e768f]">
                  {editingId
                    ? 'Update the details for this calendar entry.'
                    : 'Plot tasks, meetings, and reminders in your calendar.'}
                </p>

                <form className="mt-4 space-y-3" onSubmit={handleAddMarker}>
                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-bold text-[#6a627c]">For *</Label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {selectableLabels.map((label) => {
                        const isSelected = draftEntry.label === label;

                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              setDraftEntry((previous) => ({
                                ...previous,
                                label,
                              }));
                            }}
                            className={[
                              'rounded-2xl border px-5 py-2 text-[13px] font-black transition-all',
                              getLabelPickerStyle(label),
                              isSelected
                                ? 'border-[#9d4bd6] shadow-[0_6px_12px_rgba(127,34,185,0.15)] ring-2 ring-[#e6d5f2] ring-offset-1 scale-105'
                                : 'border-transparent opacity-85 hover:opacity-100 hover:-translate-y-0.5',
                            ].join(' ')}
                            aria-pressed={isSelected}
                          >
                            {label}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCustomLabel((previous) => !previous);
                          setCustomLabelError('');
                        }}
                        className="inline-flex h-[36px] w-12 items-center justify-center rounded-[14px] border-2 border-dashed border-[#d2cddb] text-[#8f879f] transition-all hover:bg-[#f6f5f8] hover:text-[#6a627c] hover:-translate-y-0.5"
                        aria-label="Add custom label"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>

                    {isAddingCustomLabel ? (
                      <div className="flex items-center gap-2 pt-1">
                        <Input
                          value={customLabelDraft}
                          onChange={(event) => {
                            setCustomLabelDraft(event.target.value);
                            if (customLabelError) {
                              setCustomLabelError('');
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              handleCreateCustomLabel();
                            }
                          }}
                          placeholder="Add label"
                          className="h-9 rounded-lg border-[#ddd8e8] bg-white px-3 text-sm text-[#4c455e]"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCreateCustomLabel}
                          className="h-9 rounded-lg border-[#d7c9e7] px-3 text-xs font-black text-[#7b2bb8] hover:bg-[#f5ecff]"
                        >
                          Add
                        </Button>
                      </div>
                    ) : null}

                    {customLabelError ? (
                      <p className="text-xs font-semibold text-[#c33274]" role="alert">
                        {customLabelError}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="calendar-title"
                      className="text-[11px] font-bold text-[#6a627c]"
                    >
                      Title
                    </Label>
                    <Input
                      id="calendar-title"
                      value={draftEntry.title}
                      onChange={(event) => {
                        setDraftEntry((previous) => ({
                          ...previous,
                          title: event.target.value,
                        }));
                      }}
                      placeholder="Enter title"
                      className="h-9 rounded-lg border-[#ddd8e8] bg-white px-3 text-sm text-[#4c455e]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-[#6a627c]">Date and Time *</Label>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="calendar-start-date"
                        className="text-[11px] font-bold text-[#6a627c]"
                      >
                        Start Date *
                      </Label>
                      <div className="flex overflow-hidden rounded-lg border border-[#ddd8e8] bg-white">
                        <Input
                          id="calendar-start-date"
                          type="date"
                          value={draftEntry.startDateKey}
                          onChange={(event) => {
                            const nextDate = event.target.value;

                            setDraftEntry((previous) => ({
                              ...previous,
                              startDateKey: nextDate,
                            }));

                            if (nextDate) {
                              const parsedDate = parseDateKey(nextDate);
                              setSelectedDateKey(nextDate);
                              setDisplayMonth(
                                new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1)
                              );
                            }
                          }}
                          className="h-9 rounded-none border-0 bg-transparent px-2 text-xs text-[#4c455e] focus-visible:ring-0"
                        />
                        <div className="h-auto w-px bg-[#ddd8e8]" />
                        <Input
                          type="time"
                          value={draftEntry.startTime}
                          onChange={(event) => {
                            setDraftEntry((previous) => ({
                              ...previous,
                              startTime: event.target.value,
                            }));
                          }}
                          aria-label="Start time"
                          className="h-9 rounded-none border-0 bg-transparent px-2 text-xs text-[#4c455e] focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="calendar-end-date"
                        className="text-[11px] font-bold text-[#6a627c]"
                      >
                        End Date *
                      </Label>
                      <div className="flex overflow-hidden rounded-lg border border-[#ddd8e8] bg-white">
                        <Input
                          id="calendar-end-date"
                          type="date"
                          value={draftEntry.endDateKey}
                          onChange={(event) => {
                            setDraftEntry((previous) => ({
                              ...previous,
                              endDateKey: event.target.value,
                            }));
                          }}
                          className="h-9 rounded-none border-0 bg-transparent px-2 text-xs text-[#4c455e] focus-visible:ring-0"
                        />
                        <div className="h-auto w-px bg-[#ddd8e8]" />
                        <Input
                          type="time"
                          value={draftEntry.endTime}
                          onChange={(event) => {
                            setDraftEntry((previous) => ({
                              ...previous,
                              endTime: event.target.value,
                            }));
                          }}
                          aria-label="End time"
                          className="h-9 rounded-none border-0 bg-transparent px-2 text-xs text-[#4c455e] focus-visible:ring-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="calendar-type" className="text-[11px] font-bold text-[#6a627c]">
                      Event
                    </Label>
                    <select
                      id="calendar-type"
                      value={draftEntry.eventType}
                      onChange={(event) => {
                        setDraftEntry((previous) => ({
                          ...previous,
                          eventType: event.target.value,
                        }));
                      }}
                      className="h-9 w-full rounded-lg border border-[#ddd8e8] bg-white px-2 text-xs font-semibold text-[#4c455e] outline-none focus:border-[#be8de4]"
                    >
                      <option value="General">General</option>
                      <option value="Booking">Booking</option>
                      <option value="Client">Client</option>
                      <option value="Supplier">Supplier</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="calendar-location"
                      className="text-[11px] font-bold text-[#6a627c]"
                    >
                      Location
                    </Label>
                    <Input
                      id="calendar-location"
                      value={draftEntry.location}
                      onChange={(event) => {
                        setDraftEntry((previous) => ({
                          ...previous,
                          location: event.target.value,
                        }));
                      }}
                      placeholder="Optional location"
                      className="h-9 rounded-lg border-[#ddd8e8] bg-white px-3 text-sm text-[#4c455e]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="calendar-description"
                      className="text-[11px] font-bold text-[#6a627c]"
                    >
                      Description
                    </Label>
                    <textarea
                      id="calendar-description"
                      value={draftEntry.description}
                      onChange={(event) => {
                        setDraftEntry((previous) => ({
                          ...previous,
                          description: event.target.value,
                        }));
                      }}
                      placeholder="Optional notes"
                      className="h-20 w-full resize-none rounded-lg border border-[#ddd8e8] bg-white px-3 py-2 text-sm text-[#4c455e] outline-none placeholder:text-[#a49cb3] focus:border-[#be8de4]"
                    />
                  </div>

                  {formError ? (
                    <p className="text-xs font-semibold text-[#c33274]" role="alert">
                      {formError}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    className="h-9 w-full rounded-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-sm font-black text-white hover:brightness-105"
                  >
                    <Plus className="size-3.5" />
                    {editingId ? 'Save Changes' : 'Add Marker'}
                  </Button>
                </form>
              </section>
            ) : null}

            {shouldShowMarkersSection ? (
              <section className="rounded-2xl border border-[#ddd8e8] bg-white p-4 shadow-[0_8px_20px_rgba(46,22,76,0.07)] animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={sidebarSectionTitleClass}>Markers for this Date</h3>
                    <p className="mt-1 text-xs font-semibold text-[#7e768f]">
                      {longDateFormatter.format(selectedDate)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#8f879f]">
                      {selectedDateEntries.length} markers for this date
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsForcingAdd(true)}
                    className="h-8 rounded-full border-[#d7c9e7] px-3 text-xs font-black text-[#7b2bb8] hover:bg-[#f5ecff]"
                  >
                    Add New
                  </Button>
                </div>

                <div className="mt-4 space-y-4">
                  {selectedDateEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="relative flex flex-col rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden border border-[#f0edf4]"
                    >
                      {/* Left Color Bar */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-2"
                        style={{ backgroundColor: getLabelStyle(entry.label).solid }}
                      />

                      <div className="p-4 pl-6">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`font-bold text-[15px] leading-tight ${entry.isDone ? 'text-[#a49cb3] line-through' : 'text-[#2d2834]'}`}
                          >
                            {entry.title}
                          </h4>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenuId(openMenuId === entry.id ? null : entry.id)
                              }
                              className="text-[#a49cb3] hover:text-[#4f4a56] transition-colors"
                            >
                              <MoreVertical className="size-4.5" />
                            </button>
                            {openMenuId === entry.id ? (
                              <div className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-white border border-[#e2deea] shadow-[0_8px_16px_rgba(0,0,0,0.1)] py-1 z-10 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-[#4f4a56] hover:bg-[#f6f5f8] transition-colors"
                                  onClick={async () => {
                                    setOpenMenuId(null);
                                    const newStatus = !entry.isDone;
                                    setEntries((prev) =>
                                      prev.map((e) =>
                                        e.id === entry.id ? { ...e, isDone: newStatus } : e
                                      )
                                    );
                                    try {
                                      await markDoneCalendarEntry(entry.id, newStatus);
                                    } catch (e) {
                                      console.error(e);
                                    }
                                  }}
                                >
                                  {entry.isDone ? 'Undo Mark as done' : 'Mark as done'}
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-[#4f4a56] hover:bg-[#f6f5f8] transition-colors"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setEditingId(entry.id);
                                    setIsForcingAdd(true);
                                    setDraftEntry({
                                      title: entry.title,
                                      startDateKey: entry.startDateKey,
                                      startTime: entry.startTime,
                                      endDateKey: entry.endDateKey,
                                      endTime: entry.endTime,
                                      label: entry.label,
                                      location: entry.location,
                                      description: entry.description,
                                      eventType: entry.eventType,
                                    });
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-[#c33274] hover:bg-[#fff0f5] transition-colors"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setEntryToDelete(entry.id);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-3 space-y-2 text-[11px] font-semibold text-[#8f879f]">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="size-3.5 shrink-0 text-[#c5bdd1]" />
                            <span>
                              {entry.startDateKey === entry.endDateKey
                                ? formatDateKeyShort(entry.startDateKey)
                                : `${formatDateKeyShort(entry.startDateKey)} - ${formatDateKeyShort(entry.endDateKey)}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock className="size-3.5 shrink-0 text-[#c5bdd1]" />
                            <span>
                              {formatTime12Hour(entry.startTime)} -{' '}
                              {formatTime12Hour(entry.endTime)}
                            </span>
                          </div>
                          {entry.location ? (
                            <div className="flex items-center gap-2.5">
                              <MapPin className="size-3.5 shrink-0 text-[#c5bdd1]" />
                              <span className="truncate">{entry.location}</span>
                            </div>
                          ) : null}
                        </div>

                        {entry.description ? (
                          <div className="mt-3 text-[11px]">
                            <span className="font-semibold text-[#6a627c]">Description:</span>
                            <p className="mt-0.5 text-[#8f879f] font-medium italic line-clamp-4 leading-snug">
                              {entry.description}
                            </p>
                          </div>
                        ) : null}

                        <div className="mt-4">
                          <span
                            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[10px] font-black ${getLabelStyle(entry.label).badge}`}
                          >
                            {entry.label}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <Dialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 text-center border-0 shadow-[0_20px_60px_rgba(195,50,116,0.15)]">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#fff0f5] mb-4 shadow-inner">
            <svg
              className="size-8 text-[#c33274]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <DialogTitle className="text-2xl font-black text-[#2d2834] mb-2">
            Delete Marker
          </DialogTitle>
          <p className="text-sm font-semibold text-[#696373] mb-8 leading-relaxed">
            Are you sure you want to delete this marker? This action cannot be undone.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="w-full rounded-full border-[#e2deea] font-bold text-[#4f4a56] hover:bg-[#f6f5f8] hover:text-[#2d2834] sm:w-auto px-8 h-10 transition-colors"
              onClick={() => setEntryToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full bg-[#c33274] font-bold text-white shadow-md hover:bg-[#a62a63] hover:-translate-y-0.5 transition-all duration-200 sm:w-auto px-8 h-10"
              onClick={async () => {
                if (entryToDelete) {
                  setEntries((prev) => prev.filter((e) => e.id !== entryToDelete));
                  try {
                    await deleteCalendarEntry(entryToDelete);
                  } catch (e) {
                    console.error(e);
                  }
                  setEntryToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

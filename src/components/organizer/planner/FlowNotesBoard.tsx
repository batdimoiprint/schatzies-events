import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { ChevronLeft, Download, Plus, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getEventFlow, saveEventFlow, deleteEventActivity } from '@/api/events';
import { mapBackendFlowToUI } from '@/utils/planner-flow';
import {
  formatTimeInput, toTimeInputValue, clampTimeInputRange, parseHourFromTimeInput,
  formatDisplayTime, parseTimeParts
} from '@/utils/planner-time';

interface FlowNotesBoardProps {
  selectedEventId: string;
  eventDate: string;
  eventTime?: string;
}

export function FlowNotesBoard({ selectedEventId, eventDate, eventTime }: FlowNotesBoardProps) {
  const timelineStartHour = 5;
  const timelineEndHour = 11;
  const hourRowHeight = 58;
  const minAllowedTime = '05:00';
  const maxAllowedTime = '11:00';

  const [timelineBlocks, setTimelineBlocks] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchFlow = async () => {
      if (!selectedEventId) {
        setTimelineBlocks([]);
        return;
      }
      try {
        const flowData = await getEventFlow(selectedEventId);
        if (isMounted) {
          const mapped = Array.isArray(flowData)
            ? flowData.map((item: any, index: number) => mapBackendFlowToUI(item, index))
            : [];
          setTimelineBlocks(mapped);
        }
      } catch (error) {
        console.error('Failed to load event flow:', error);
      }
    };
    fetchFlow();
    return () => { isMounted = false; };
  }, [selectedEventId]);

  const [isActivityInfoOpen, setIsActivityInfoOpen] = useState(false);
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [hideEmptySlots, setHideEmptySlots] = useState(false);
  const [hideScheduleSummary, setHideScheduleSummary] = useState(false);
  const [activityDraft, setActivityDraft] = useState({
    title: '', from: '', to: '', description: '', startHour: 5, endHour: 6, left: '2%', width: '27%', tone: 'border-[#f0bfd8] bg-[#fdeaf3] text-[#7b295f]',
  });

  const timelineHours = Array.from({ length: timelineEndHour - timelineStartHour + 1 }, (_, index) => timelineStartHour + index);
  const visibleHours = useMemo(() => {
    if (!hideEmptySlots) return timelineHours;
    return timelineHours.filter((hour) => timelineBlocks.some((block) => hour >= block.startHour && hour < block.endHour));
  }, [hideEmptySlots, timelineHours, timelineBlocks]);

  const selectedActivity = selectedActivityId ? (timelineBlocks.find((block) => block.id === selectedActivityId) ?? null) : null;

  const openActivityInfo = (activityId: string) => {
    const activity = timelineBlocks.find((block) => block.id === activityId);
    if (!activity) return;
    setSelectedActivityId(activity.id);
    setActivityDraft({
      title: activity.title,
      from: clampTimeInputRange(toTimeInputValue(activity.from, activity.startHour), minAllowedTime, maxAllowedTime),
      to: clampTimeInputRange(toTimeInputValue(activity.to, activity.endHour), minAllowedTime, maxAllowedTime),
      description: activity.description, startHour: activity.startHour, endHour: activity.endHour,
      left: activity.left, width: activity.width, tone: activity.tone,
    });
    setIsEditingActivity(false);
    setIsActivityInfoOpen(true);
  };

  const openCreateActivity = () => {
    setSelectedActivityId(null);
    setActivityDraft({ title: '', from: '05:00', to: '06:00', description: '', startHour: 5, endHour: 6, left: '2%', width: '27%', tone: 'border-[#f0bfd8] bg-[#fdeaf3] text-[#7b295f]' });
    setIsEditingActivity(true);
    setIsActivityInfoOpen(true);
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteEventActivity(selectedEventId, activityId);
      setTimelineBlocks((previous) => previous.filter((block) => block.id !== activityId));
      if (selectedActivityId === activityId) {
        setSelectedActivityId(null);
        setIsActivityInfoOpen(false);
        setIsEditingActivity(false);
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const handleSaveActivity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedFromInput = clampTimeInputRange(toTimeInputValue(activityDraft.from, activityDraft.startHour), minAllowedTime, maxAllowedTime);
    const normalizedToInput = clampTimeInputRange(toTimeInputValue(activityDraft.to, activityDraft.endHour), minAllowedTime, maxAllowedTime);
    const parsedStartHour = parseHourFromTimeInput(normalizedFromInput, activityDraft.startHour);
    const parsedEndHour = parseHourFromTimeInput(normalizedToInput, activityDraft.endHour);
    const normalizedStartHour = Math.min(Math.max(parsedStartHour, timelineStartHour), timelineEndHour);
    const normalizedEndHour = Math.min(Math.max(parsedEndHour, normalizedStartHour + 1), timelineEndHour);

    const baseDateStr = eventDate || new Date().toISOString();
    const baseDate = new Date(baseDateStr);
    const datePrefix = isNaN(baseDate.getTime()) ? new Date().toISOString().split('T')[0] : baseDate.toISOString().split('T')[0];
    const fromTimeStr = normalizedFromInput || formatTimeInput(normalizedStartHour);
    const toTimeStr = normalizedToInput || formatTimeInput(normalizedEndHour);
    const startTimeISO = new Date(`${datePrefix}T${fromTimeStr}:00`).toISOString();
    const endTimeISO = new Date(`${datePrefix}T${toTimeStr}:00`).toISOString();

    const nextId = selectedActivityId ?? `timeline-${Date.now()}`;
    const apiPayload = { id: nextId, title: activityDraft.title.trim() || 'Example', description: activityDraft.description.trim() || 'Description', start_time: startTimeISO, end_time: endTimeISO };

    try {
      const savedData = await saveEventFlow(selectedEventId, apiPayload);
      const uiBlock = mapBackendFlowToUI(savedData ?? apiPayload, timelineBlocks.length);
      setTimelineBlocks((previous) => {
        if (selectedActivityId) return previous.map((block) => (block.id === selectedActivityId ? uiBlock : block));
        return [...previous, uiBlock];
      });
      setSelectedActivityId(uiBlock.id);
      setIsEditingActivity(false);
      setIsActivityInfoOpen(false);
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  };

  const handleAddSummary = () => {
    const nextId = `timeline-${Date.now()}`;
    const nextActivity = { id: nextId, title: 'Description Here', from: '07:00', to: '08:00', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', startHour: 7, endHour: 8, left: '2%', width: '27%', tone: 'bg-[#d7d7d7]' };
    setTimelineBlocks((previous) => [...previous, nextActivity]);
  };

  const scheduleSummaries = useMemo(() => {
    return [...timelineBlocks].sort((a, b) => a.startHour - b.startHour).map((block) => ({
      id: block.id, timeRange: `${formatDisplayTime(block.from, block.startHour)} - ${formatDisplayTime(block.to, block.endHour)}`, title: block.title, body: block.description,
    }));
  }, [timelineBlocks]);

  const positionedTimelineBlocks = useMemo(() => {
    const sortedBlocks = [...timelineBlocks].sort((a, b) => {
      const aStart = parseTimeParts(a.from, a.startHour).totalMinutes;
      const bStart = parseTimeParts(b.from, b.startHour).totalMinutes;
      if (aStart !== bStart) return aStart - bStart;
      const aEnd = parseTimeParts(a.to, a.endHour).totalMinutes;
      const bEnd = parseTimeParts(b.to, b.endHour).totalMinutes;
      return bEnd - bStart - (aEnd - aStart);
    });
    const slotWidth = 25; const slotGap = 2.5; const columns: (typeof sortedBlocks)[] = [];
    return sortedBlocks.map((block) => {
      const startParts = parseTimeParts(block.from, block.startHour);
      const endParts = parseTimeParts(block.to, block.endHour);
      const startMinutes = startParts.totalMinutes;
      const endMinutes = endParts.totalMinutes;
      let columnIndex = 0; let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const lastBlockInColumn = column[column.length - 1];
        const lastBlockEndMinutes = parseTimeParts(lastBlockInColumn.to, lastBlockInColumn.endHour).totalMinutes;
        if (startMinutes >= lastBlockEndMinutes) { column.push(block); columnIndex = i; placed = true; break; }
      }
      if (!placed) { columns.push([block]); columnIndex = columns.length - 1; }
      const boardStartHour = visibleHours.length > 0 ? visibleHours[0] : timelineStartHour;
      const boardStartMinutes = boardStartHour * 60;
      const absoluteStartMinutes = startMinutes - boardStartMinutes;
      const absoluteEndMinutes = endMinutes - boardStartMinutes;
      const durationMinutes = Math.max(30, absoluteEndMinutes - absoluteStartMinutes);
      const topPixels = (absoluteStartMinutes / 60) * hourRowHeight;
      const heightPixels = (durationMinutes / 60) * hourRowHeight;
      const verticalGap = 4;
      const finalTop = topPixels + verticalGap;
      const finalHeight = heightPixels - verticalGap * 2;
      const displayColumnIndex = Math.min(columnIndex, 3);
      const left = 2 + displayColumnIndex * (slotWidth + slotGap);
      const width = Math.max(20, slotWidth - Math.min(displayColumnIndex, 2) * 2);
      return { ...block, left: `${left}%`, width: `${width}%`, calculatedTop: finalTop, calculatedHeight: finalHeight };
    });
  }, [timelineBlocks, hourRowHeight, timelineStartHour, visibleHours]);

  const handleExportSummary = () => {
    const header = ['Time Range', 'Title', 'Description'];
    const rows = scheduleSummaries.map((summary) => [summary.timeRange, summary.title, summary.body]);
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'schedule-summary.csv'; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="rounded-2xl border border-[#ddd8e8] bg-linear-to-b from-white to-[#fbf8fd] p-4 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e3ddea] bg-white px-4 py-3 shadow-[0_4px_10px_rgba(27,16,45,0.06)]">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#8a8399]">Flow</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setHideScheduleSummary((prev) => !prev)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d7d0e2] bg-white px-3.5 text-[11px] font-bold text-[#5a5670] transition hover:bg-[#f6f2fb]">{hideScheduleSummary ? 'Show Summary' : 'Hide Summary'}</button>
            <button type="button" onClick={openCreateActivity} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-linear-to-r from-[#f1589e] via-[#d735b3] to-[#8a1fd0] px-4 text-[11px] font-black text-white shadow-[0_10px_20px_rgba(125,31,186,0.24)] transition hover:brightness-105"><Plus className="size-3.5" />Add</button>
            <button type="button" onClick={handleExportSummary} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d7d0e2] bg-white px-3.5 text-[11px] font-bold text-[#5a5670] transition hover:bg-[#f6f2fb]"><Download className="size-3.5" />Export</button>
          </div>
        </div>
        <div className={["grid gap-4", hideScheduleSummary ? 'grid-cols-1' : 'xl:grid-cols-[minmax(0,1fr)_280px]'].join(' ')}>
          <article className="overflow-hidden rounded-2xl border border-[#e2dee9] bg-white shadow-[0_8px_18px_rgba(31,18,54,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eee9f2] bg-[#fcfbfe] px-5 py-4">
              <div>
                <h4 className="text-[16px] font-black leading-tight text-[#2f2b39] uppercase">{eventDate ? new Date(eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Date Set'}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] font-semibold text-[#6d6679]">Event Flow</p>
                  {eventTime && <span className="rounded bg-[#f3eefb] px-2 py-0.5 text-[10px] font-bold text-[#7c1cc9]">Assigned Time: {eventTime}</span>}
                </div>
              </div>
              <label className="inline-flex items-center gap-2 rounded-full border border-[#e4ddea] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#7a728d] shadow-[0_2px_5px_rgba(31,18,54,0.04)]">
                <span>Hide empty time slots</span>
                <input type="checkbox" checked={hideEmptySlots} onChange={(event) => setHideEmptySlots(event.target.checked)} className="size-3 cursor-pointer rounded border-[#c9c2d2]" />
              </label>
            </div>
            <div className="grid grid-cols-[72px_minmax(0,1fr)] border-t border-[#ece8f0]">
              <div className="bg-[#fcfbfe]">
                {visibleHours.map((hour) => {
                  const labelHour = hour === 12 ? 12 : ((hour + 11) % 12) + 1;
                  return (<div key={hour} className="flex items-start justify-end border-b border-[#ece8f0] pr-3 pt-2 text-[10px] font-semibold text-[#8e8796]" style={{ height: `${hourRowHeight}px` }}>{labelHour}AM</div>);
                })}
              </div>
              <div className="relative overflow-x-auto overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#faf7fc_100%)]">
                <div className="relative min-w-[760px]" style={{ height: `${visibleHours.length * hourRowHeight}px` }}>
                  {visibleHours.map((hour, index) => (<div key={`${hour}-line`} className="absolute left-0 right-0 border-t border-[#eee6f3]" style={{ top: `${index * hourRowHeight}px` }} />))}
                  {positionedTimelineBlocks.map((block) => {
                    if (!block) return null;
                    return (
                      <article key={block.id} role="button" tabIndex={0} onClick={() => openActivityInfo(block.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openActivityInfo(block.id); } }} className={`absolute overflow-hidden rounded-xl border px-3 py-2 text-[#5f596b] shadow-[0_6px_12px_rgba(31,18,54,0.08)] ${block.tone} flex flex-col`} style={{ top: `${block.calculatedTop}px`, height: `${block.calculatedHeight}px`, left: block.left, width: block.width, zIndex: block.id === selectedActivityId ? 30 : 10 }}>
                        <p className="text-[11px] font-black uppercase leading-tight text-inherit break-words whitespace-normal line-clamp-2 shrink-0">{block.title}</p>
                        <p className="mt-1 text-[10px] font-semibold leading-tight text-inherit/80 shrink-0">Time: {formatDisplayTime(block.from, block.startHour)} - {formatDisplayTime(block.to, block.endHour)}</p>
                        {block.calculatedHeight > 60 && (<div className="mt-1 flex-1 min-h-0"><p className="text-[10px] leading-tight text-inherit/80 break-words whitespace-normal line-clamp-4">{block.description}</p></div>)}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
          <aside className={["rounded-2xl border border-[#e2dee9] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(31,18,54,0.05)] transition-all duration-300 ease-in-out origin-right", hideScheduleSummary ? 'opacity-0 translate-x-8 invisible hidden' : 'opacity-100 translate-x-0 visible block'].join(' ')}>
            <p className="text-[12px] font-black uppercase tracking-[0.12em] text-[#6b6476]">Schedule Summary</p>
            <div className="mt-4 space-y-5 border-l border-[#ebe6f0] pl-4">
              {scheduleSummaries.map((summary) => (
                <div key={summary.id} className="grid grid-cols-[92px_1fr] gap-4">
                  <p className="text-[10px] font-semibold text-[#6b6476]">{summary.timeRange}</p>
                  <div><p className="text-[13px] font-black text-[#2f2b39] break-all whitespace-normal">{summary.title}</p><p className="mt-1 text-[11px] leading-relaxed text-[#8a8495] break-all whitespace-normal">{summary.body}</p></div>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddSummary} className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#d7d0e2] bg-white text-[11px] font-black text-[#5a5670] transition hover:bg-[#f6f2fb]"><Plus className="size-3.5" />Add summary</button>
          </aside>
        </div>
      </section>
      <Dialog open={isActivityInfoOpen} onOpenChange={(open) => { setIsActivityInfoOpen(open); if (!open) { setIsEditingActivity(false); } }}>
        <DialogContent showCloseButton={false} aria-describedby={undefined} className="fixed left-[50%] top-[50%] z-[100000] w-full max-w-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e3dfea] bg-white p-0 shadow-2xl sm:max-w-[640px] overflow-hidden">
          <DialogTitle className="sr-only">Activity Details</DialogTitle>
          <form className="px-6 py-5" onSubmit={handleSaveActivity}>
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#eee9f2] pb-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { if (isEditingActivity && selectedActivity) { setIsEditingActivity(false); return; } setIsActivityInfoOpen(false); }} className="inline-flex size-8 items-center justify-center rounded-full text-[#aba3b9] transition hover:bg-[#f2eff6]" aria-label="Back"><ChevronLeft className="size-5" /></button>
                <div><h3 className="text-[30px] font-black leading-none tracking-tight text-[#1f1f21]">{isEditingActivity ? selectedActivity ? 'Edit Activity' : 'New Activity' : 'Activity Info'}</h3><p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#b0a9bc]">Event Flow</p></div>
              </div>
              {isEditingActivity ? (<div className="flex items-center gap-2 pt-1">
                <button type="button" onClick={() => { if (selectedActivity) { setActivityDraft({ title: selectedActivity.title, from: selectedActivity.from, to: selectedActivity.to, description: selectedActivity.description, startHour: selectedActivity.startHour, endHour: selectedActivity.endHour, left: selectedActivity.left, width: selectedActivity.width, tone: selectedActivity.tone }); setIsEditingActivity(false); } else { setIsActivityInfoOpen(false); } }} className="inline-flex h-8 items-center rounded-full border border-[#e5deec] px-3 text-xs font-black text-[#7f7791] transition hover:bg-[#f7f3fb]">Cancel</button>
                <button type="submit" className="inline-flex h-8 items-center rounded-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] px-4 text-xs font-black text-white">Save</button>
              </div>) : selectedActivity ? (<div className="flex items-center gap-1 pt-1">
                <button type="button" onClick={() => setIsEditingActivity(true)} className="inline-flex size-8 items-center justify-center rounded-full border border-[#f5d9e7] text-[#f33d93] transition hover:bg-[#fdf0f6]" aria-label="Edit activity"><Pencil className="size-4" /></button>
                <button type="button" onClick={() => selectedActivity && handleDeleteActivity(selectedActivity.id)} className="inline-flex size-9 items-center justify-center rounded-full border border-[#f5d9e7] text-[#f33d93] transition hover:bg-[#fdf0f6]" aria-label="Delete activity"><Trash2 className="size-4" /></button>
              </div>) : null}
            </div>
            {isEditingActivity ? (
              <div className="space-y-4">
                <div><Label className="text-sm font-black text-[#8c8599]">Title</Label><Input value={activityDraft.title} onChange={(event) => setActivityDraft((previous) => ({ ...previous, title: event.target.value }))} placeholder="Enter activity title" className="mt-2 h-11 rounded-lg border border-[#e5deec] bg-[#f7f5fa] text-sm text-[#4d4a54] shadow-none" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-sm font-black text-[#8c8599]">From</Label><Input type="time" value={activityDraft.from} onChange={(event) => setActivityDraft((previous) => ({ ...previous, from: clampTimeInputRange(toTimeInputValue(event.target.value, previous.startHour), minAllowedTime, maxAllowedTime) }))} min={minAllowedTime} max={maxAllowedTime} step={1800} className="mt-2 h-11 rounded-lg border border-[#e5deec] bg-[#f7f5fa] text-sm text-[#4d4a54] shadow-none" /></div>
                  <div><Label className="text-sm font-black text-[#8c8599]">To</Label><Input type="time" value={activityDraft.to} onChange={(event) => setActivityDraft((previous) => ({ ...previous, to: clampTimeInputRange(toTimeInputValue(event.target.value, previous.endHour), minAllowedTime, maxAllowedTime) }))} min={minAllowedTime} max={maxAllowedTime} step={1800} className="mt-2 h-10 rounded-lg border border-[#e5deec] bg-[#f7f5fa] text-sm text-[#4d4a54] shadow-none" /></div>
                </div>
                <div><Label className="text-sm font-black text-[#8c8599]">Description</Label><textarea value={activityDraft.description} onChange={(event) => setActivityDraft((previous) => ({ ...previous, description: event.target.value }))} placeholder="Add activity details" className="mt-2 h-28 w-full resize-none rounded-lg border border-[#e5deec] bg-[#f7f5fa] px-3 py-2 text-sm text-[#4d4a54] outline-none" /></div>
              </div>
            ) : selectedActivity ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-linear-to-r from-[#f1589e] via-[#d735b3] to-[#8a1fd0] px-4 py-3 text-base font-black leading-tight text-white shadow-[0_10px_20px_rgba(125,31,186,0.18)] break-all whitespace-normal">{selectedActivity.title}</div>
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#ebe5f1] bg-[#faf8fc] px-4 py-3 text-sm">
                  <p><span className="font-bold text-[#9d97a8]">From</span><span className="ml-2 font-black text-[#2f2b39]">{formatDisplayTime(selectedActivity.from, selectedActivity.startHour)}</span></p>
                  <p><span className="font-bold text-[#9d97a8]">To</span><span className="ml-2 font-black text-[#2f2b39]">{formatDisplayTime(selectedActivity.to, selectedActivity.endHour)}</span></p>
                </div>
                <div className="rounded-2xl border border-[#ebe5f1] bg-[#faf8fc] px-4 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#9d97a8]">Description</p>
                  <p className="mt-2 text-[14px] italic leading-snug text-[#8e8994] break-all whitespace-normal">{selectedActivity.description}</p>
                </div>
              </div>
            ) : (<div className="rounded-2xl border border-dashed border-[#e5deec] bg-[#faf8fc] px-4 py-8 text-center"><p className="text-sm font-semibold text-[#7f7a89]">Select an activity card to view details.</p></div>)}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
import type { TaskLane } from '@/types/planner';
import { flowBlockTones } from '@/constants/planner';

export const mapLaneToBackendStatus = (lane: TaskLane): string => {
  if (lane === 'in-progress') return 'IN_PROGRESS';
  if (lane === 'completed') return 'COMPLETED';
  return 'TODO';
};

export function mapBackendFlowToUI(item: any, index: number) {
  const startDate = item.start_time ? new Date(item.start_time) : null;
  const endDate = item.end_time ? new Date(item.end_time) : null;
  const startHour = startDate && !isNaN(startDate.getTime()) ? startDate.getHours() : 5;
  const startMinute = startDate && !isNaN(startDate.getTime()) ? startDate.getMinutes() : 0;
  const endHour = endDate && !isNaN(endDate.getTime()) ? endDate.getHours() : startHour + 1;
  const endMinute = endDate && !isNaN(endDate.getTime()) ? endDate.getMinutes() : 0;
  const fromTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
  const toTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  return {
    id: item.id || `flow-${Date.now()}-${index}`,
    title: item.title || 'Untitled Activity',
    from: fromTime,
    to: toTime,
    description: item.description || '',
    startHour,
    endHour: endHour === startHour ? endHour + 1 : endHour,
    left: '2%',
    width: '27%',
    tone: flowBlockTones[index % flowBlockTones.length],
  };
}
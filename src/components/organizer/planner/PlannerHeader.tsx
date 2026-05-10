import { formatTo12Hour } from '@/utils/planner-time';
import type { ProjectSlot } from '@/types/planner';

interface PlannerHeaderProps {
  selectedProject: ProjectSlot;
  currentClientName: string;
}

export function PlannerHeader({ selectedProject, currentClientName }: PlannerHeaderProps) {
  return (
    <article className="w-full overflow-hidden rounded-xl bg-linear-to-r from-[#f23fa3] to-[#7d1fd0] p-4 text-white shadow-[0_12px_24px_rgba(146,31,186,0.34)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">Event Planner</p>
          <h2 className="text-lg font-black">{selectedProject.title || 'Pending Project'}</h2>
          <p className="text-[11px] text-white/80 flex items-center gap-1.5 flex-wrap">
            <span>{selectedProject.startDate || 'No Date Set'}{selectedProject.endDate && selectedProject.endDate !== 'TBD' && selectedProject.endDate !== selectedProject.startDate ? ` - ${selectedProject.endDate}` : ''}</span>
            {(selectedProject.eventTime || (selectedProject.rawStartDate && selectedProject.rawStartDate.includes('T'))) && (
              <><span className="opacity-50">•</span><span className="font-medium text-white">{selectedProject.eventTime ? formatTo12Hour(selectedProject.eventTime) : formatTo12Hour(selectedProject.rawStartDate?.split('T')[1]?.substring(0, 5))}{selectedProject.rawEndDate && selectedProject.rawEndDate.includes('T') && ` - ${formatTo12Hour(selectedProject.rawEndDate.split('T')[1]?.substring(0, 5))}`}</span></>
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[10px] font-semibold text-white/90">
          <span className="rounded-full bg-white/20 px-3 py-1">Client: {currentClientName || (selectedProject.clientName && !selectedProject.clientName.includes('-') ? selectedProject.clientName : 'Valued Client')}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">Contact: 0912-345-6789</span>
        </div>
      </div>
    </article>
  );
}
import { useMemo, useState, useEffect } from 'react';
import { useEventData } from '@/hooks/event-planner/useEventData';
import { useSelectedEvent } from '@/hooks/event-planner/useSelectedEvent';
import { useBoardTasks } from '@/hooks/event-planner/useBoardTasks';
import { usePlannerNotes } from '@/hooks/event-planner/usePlannerNotes';
import { useVendors } from '@/hooks/event-planner/useVendors';
import { PlannerHeader } from '@/components/organizer/planner/PlannerHeader';
import { PlannerTabs } from '@/components/organizer/planner/PlannerTabs';
import { FlowNotesBoard } from '@/components/organizer/planner/FlowNotesBoard';
import { OverviewTab } from '@/components/organizer/planner/tabs/OverviewTab';
import { TaskTab } from '@/components/organizer/planner/tabs/TaskTab';
import { NotesTab } from '@/components/organizer/planner/tabs/NotesTab';
import { VendorsTab } from '@/components/organizer/planner/tabs/VendorsTab';
import { CostBreakdownTab } from '@/components/organizer/planner/tabs/CostBreakdownTab';
import { NoteDialog } from '@/components/organizer/planner/dialogs/NoteDialog';
import { TaskPreviewDialog } from '@/components/organizer/planner/dialogs/TaskPreviewDialog';
import { AssignVendorDialog } from '@/components/organizer/planner/dialogs/AssignVendorDialog';
import type { PlannerTab } from '@/types/planner';

export function AdminEventPlannerPage() {
  const { projectSlots, selectedEventId } = useEventData();
  const { selectedEventDetails, eventAllocation, eventMeetings, overviewFlows } = useSelectedEvent(selectedEventId, projectSlots);
  const boardTasks = useBoardTasks(selectedEventId);
  const notes = usePlannerNotes(selectedEventId);
  const vendors = useVendors(selectedEventId);

  const [activeTab, setActiveTab] = useState<PlannerTab>('overview');

  const selectedProject = useMemo(() => {
    return projectSlots.find((p) => p.id === selectedEventId) ?? projectSlots[0] ?? { id: '', title: '' };
  }, [selectedEventId, projectSlots]);

  // Load initial data when event changes
  useEffect(() => {
    boardTasks.loadTasks();
    vendors.loadVendors();
  }, [selectedEventId]);

  return (
    <div className="flex h-[calc(100vh-100px)] w-full max-w-full flex-col gap-4 overflow-hidden p-2 sm:p-4 lg:p-6 text-[#302c39]">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <section className="flex min-h-0 flex-1 flex-col space-y-3">
          <PlannerHeader selectedProject={selectedProject} />
          <PlannerTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-y-auto rounded-xl pb-6 pr-1 [scrollbar-width:thin] scrollbar-thumb-[#ddd8e8] scrollbar-track-transparent">
            {activeTab === 'overview' && (
              <OverviewTab
                selectedProject={selectedProject}
                selectedEventDetails={selectedEventDetails}
                eventAllocation={eventAllocation}
                eventMeetings={eventMeetings}
                overviewFlows={overviewFlows}
              />
            )}
            {activeTab === 'task' && (
              <TaskTab
                boardTasks={boardTasks.boardTasks}
                taskActionMessage={boardTasks.taskActionMessage}
                taskActionTone={boardTasks.taskActionTone}
                taskCardMenuOpenFor={boardTasks.taskCardMenuOpenFor}
                handleAddEmptyTask={boardTasks.handleAddEmptyTask}
                handleDragTaskStart={boardTasks.handleDragTaskStart}
                handleDragTaskEnd={boardTasks.handleDragTaskEnd}
                handleLaneDragOver={boardTasks.handleLaneDragOver}
                handleDropTaskToLane={boardTasks.handleDropTaskToLane}
                openTaskPreview={boardTasks.openTaskPreview}
                handleDeleteBoardTask={boardTasks.handleDeleteBoardTask}
                setTaskCardMenuOpenFor={boardTasks.setTaskCardMenuOpenFor}
              />
            )}
            {activeTab === 'notes' && (
              <NotesTab
                isInlineNoteOpen={notes.isInlineNoteOpen}
                setIsInlineNoteOpen={notes.setIsInlineNoteOpen}
                noteDraftError={notes.noteDraftError}
                noteDraftTitle={notes.noteDraftTitle}
                setNoteDraftTitle={notes.setNoteDraftTitle}
                noteDraftBody={notes.noteDraftBody}
                setNoteDraftBody={notes.setNoteDraftBody}
                noteDraftImageDataUrl={notes.noteDraftImageDataUrl}
                setNoteDraftImageDataUrl={notes.setNoteDraftImageDataUrl}
                handleCloseInlineNote={notes.handleCloseInlineNote}
                handlePlannerNoteImageChange={notes.handlePlannerNoteImageChange}
                plannerNotes={notes.plannerNotes}
                draggedNoteId={notes.draggedNoteId}
                handleNoteDragStart={notes.handleNoteDragStart}
                handleNoteDragEnd={notes.handleNoteDragEnd}
                handleNoteDrop={notes.handleNoteDrop}
                handleEditPlannerNote={notes.handleEditPlannerNote}
              />
            )}
            {activeTab === 'vendors' && (
              <VendorsTab
                eventVendors={vendors.eventVendors}
                isAssigningVendor={vendors.isAssigningVendor}
                handleOpenAssignVendorModal={vendors.handleOpenAssignVendorModal}
                handleUnassignVendor={vendors.handleUnassignVendor}
              />
            )}
            {activeTab === 'flow' && (
              <FlowNotesBoard
                selectedEventId={selectedEventId}
                eventDate={selectedProject.rawStartDate || ''}
                eventTime={selectedProject.eventTime || (selectedProject.rawStartDate?.includes('T') ? selectedProject.rawStartDate.split('T')[1].substring(0, 5) : undefined)}
              />
            )}
            {activeTab === 'costs' && (
              <CostBreakdownTab selectedEventId={selectedEventId} />
            )}
          </div>
        </section>
      </div>

      <NoteDialog
        isOpen={notes.isNoteModalOpen}
        onOpenChange={notes.setIsNoteModalOpen}
        noteDraftError={notes.noteDraftError}
        noteDraftTitle={notes.noteDraftTitle}
        setNoteDraftTitle={notes.setNoteDraftTitle}
        noteDraftBody={notes.noteDraftBody}
        setNoteDraftBody={notes.setNoteDraftBody}
        noteDraftImageDataUrl={notes.noteDraftImageDataUrl}
        handleCloseInlineNote={notes.handleCloseInlineNote}
        handlePlannerNoteImageChange={notes.handlePlannerNoteImageChange}
        editingPlannerNoteId={notes.editingPlannerNoteId}
        handleDeletePlannerNote={notes.handleDeletePlannerNote}
      />
      <TaskPreviewDialog
        isOpen={boardTasks.isTaskPreviewOpen}
        onOpenChange={boardTasks.setIsTaskPreviewOpen}
        selectedBoardTask={boardTasks.selectedBoardTask}
        taskActionMessage={boardTasks.taskActionMessage}
        taskActionTone={boardTasks.taskActionTone}
        taskPreviewTitle={boardTasks.taskPreviewTitle}
        setTaskPreviewTitle={boardTasks.setTaskPreviewTitle}
        taskPreviewDetails={boardTasks.taskPreviewDetails}
        setTaskPreviewDetails={boardTasks.setTaskPreviewDetails}
        taskPreviewChecklist={boardTasks.taskPreviewChecklist}
        handleAddTodoChecklistItem={boardTasks.handleAddTodoChecklistItem}
        handleUpdateTodoChecklistItem={boardTasks.handleUpdateTodoChecklistItem}
        handleRemoveTodoChecklistItem={boardTasks.handleRemoveTodoChecklistItem}
        handleSaveTaskPreview={boardTasks.handleSaveTaskPreview}
        handleToggleBoardTaskChecklistItem={boardTasks.handleToggleBoardTaskChecklistItem}
        formatChecklistTimestamp={boardTasks.formatChecklistTimestamp}
      />
      <AssignVendorDialog
        isOpen={vendors.isAssignVendorModalOpen}
        onOpenChange={vendors.setIsAssignVendorModalOpen}
        vendorPool={vendors.vendorPool}
        eventVendors={vendors.eventVendors}
        isAssigningVendor={vendors.isAssigningVendor}
        handleAssignVendor={vendors.handleAssignVendor}
      />
    </div>
  );
}
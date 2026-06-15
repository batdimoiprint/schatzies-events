import { X, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PlannerBoardTask } from '@/types/planner';

interface TaskPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBoardTask: PlannerBoardTask | null;
  taskActionMessage: string;
  taskActionTone: 'success' | 'info' | 'error';
  taskPreviewTitle: string;
  setTaskPreviewTitle: (v: string) => void;
  taskPreviewDetails: string;
  setTaskPreviewDetails: (v: string) => void;
  taskPreviewChecklist: { id: string; label: string; done: boolean; doneAt?: string }[];
  handleAddTodoChecklistItem: () => void;
  handleUpdateTodoChecklistItem: (id: string, label: string) => void;
  handleRemoveTodoChecklistItem: (id: string) => void;
  handleSaveTaskPreview: () => void;
  handleToggleBoardTaskChecklistItem: (taskId: string, itemId: string) => void;
  formatChecklistTimestamp: (v?: string) => string;
}

export function TaskPreviewDialog({
  isOpen,
  onOpenChange,
  selectedBoardTask,
  taskActionMessage,
  taskActionTone,
  taskPreviewTitle,
  setTaskPreviewTitle,
  taskPreviewDetails,
  setTaskPreviewDetails,
  taskPreviewChecklist,
  handleAddTodoChecklistItem,
  handleUpdateTodoChecklistItem,
  handleRemoveTodoChecklistItem,
  handleSaveTaskPreview,
  handleToggleBoardTaskChecklistItem,
  formatChecklistTimestamp,
}: TaskPreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="fixed left-[50%] top-[50%] z-[100000] w-full max-w-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#e3dfea] bg-white p-0 shadow-2xl sm:max-w-[760px] overflow-hidden"
      >
        <DialogTitle className="sr-only">Task Preview</DialogTitle>
        {selectedBoardTask ? (
          <article>
            <header className="flex items-center justify-between border-b border-[#eee9f2] px-4 py-2">
              <p className="text-[12px] font-semibold text-muted-foreground">
                {selectedBoardTask.title || 'Untitled Task'}
              </p>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex size-7 items-center justify-center rounded-full text-[#9f97ad] transition hover:bg-[#f3eff8]"
                aria-label="Close task preview"
              >
                <X className="size-4" />
              </button>
            </header>
            <div className="h-16 border-b border-[#e4efe6] bg-[#dff0e0]" />
            {taskActionMessage && (
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
            )}
            {selectedBoardTask?.lane === 'todo' ? (
              <div className="grid gap-4 px-6 py-5 sm:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="rounded-lg border border-border bg-white p-3">
                  <img
                    src="/Pictures/organizerpics/event-package-illustration.png"
                    alt="Task preview art"
                    className="h-20 w-full object-contain"
                  />
                  <p className="mt-2 text-[28px] font-black leading-none text-foreground">
                    {(taskPreviewTitle || 'Untitled').split(' ')[0]}
                  </p>
                  <span className="mt-2 inline-flex rounded-sm bg-[#ffe7ef] px-2 py-0.5 text-[9px] font-bold text-[#cf3a79]">
                    1 Service
                  </span>
                </aside>
                <div className="space-y-3 rounded-lg border border-border bg-white p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Editing To Do
                    </p>
                    <h4 className="mt-1 text-[22px] font-black leading-tight text-foreground">
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
                      onChange={(e) => setTaskPreviewTitle(e.target.value)}
                      placeholder="Enter task title"
                      className="mt-1 h-10 border-[#ddd7e8] text-[13px] font-semibold text-foreground"
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
                      className="mt-1 h-24 w-full rounded-lg border border-[#ddd7e8] bg-white px-3 py-2 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-[#b29ace]"
                    />
                  </div>
                  <div className="rounded-md border border-border bg-[#faf8fd] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-[11px] font-semibold text-[#746e85]">
                        To Do Lists
                      </Label>
                      <button
                        type="button"
                        onClick={handleAddTodoChecklistItem}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-white px-2 text-[11px] font-semibold text-[#6f26b4] transition hover:bg-[#f8f3ff]"
                      >
                        <Plus className="size-3.5" />
                        Add item
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {taskPreviewChecklist.length > 0 ? (
                        taskPreviewChecklist.map((item, index) => (
                          <div
                            key={item.id || `preview-chk-${index}`}
                            className="flex items-start gap-2 rounded-md border border-[#e9e3f1] bg-white px-2.5 py-2"
                          >
                            <span className="mt-2 inline-flex w-4 shrink-0 justify-center text-[14px] font-black leading-none text-muted-foreground">
                              -
                            </span>
                            <div className="min-w-0 flex-1">
                              <Label className="sr-only">Checklist item {index + 1}</Label>
                              <Input
                                value={item.label}
                                onChange={(e) =>
                                  handleUpdateTodoChecklistItem(item.id, e.target.value)
                                }
                                placeholder="Enter list item"
                                className="h-9 border-[#ddd7e8] text-[12px] text-foreground"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTodoChecklistItem(item.id)}
                              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-white text-[#7b6f90] transition hover:border-brand hover:text-brand"
                              aria-label="Remove list item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-md border border-dashed border-[#d8d2e2] bg-white px-3 py-4 text-[12px] italic text-muted-foreground">
                          Add list items to build this task.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveTaskPreview}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-brand-deep px-4 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(143,31,209,0.3)]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-5">
                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {selectedBoardTask?.lane === 'completed'
                          ? 'Completed task'
                          : 'In progress task'}
                      </p>
                      <h4 className="mt-1 text-[24px] font-black leading-tight text-foreground">
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
                  <div className="mt-4 rounded-md border border-border bg-[#faf8fd] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Details
                    </p>
                    <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-[#5f596c]">
                      {taskPreviewDetails || 'No details provided.'}
                    </p>
                  </div>
                  <div className="mt-4 rounded-md border border-border bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {selectedBoardTask?.lane === 'completed'
                        ? 'Checklist breakdown'
                        : 'Checklist'}
                    </p>
                    <div className="mt-3 max-h-[280px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
                      {(selectedBoardTask?.checklist ?? []).length > 0 ? (
                        (selectedBoardTask?.checklist ?? []).map((item, index) => (
                          <div
                            key={item.id || `view-chk-${index}`}
                            className="rounded-md border border-border bg-[#faf8fd] px-3 py-2"
                          >
                            <div className="flex items-start gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleBoardTaskChecklistItem(selectedBoardTask.id, item.id)
                                }
                                aria-label={`${item.done ? 'Uncheck' : 'Check'} ${item.label}`}
                                className={[
                                  'mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-black transition',
                                  item.done
                                    ? 'border-[#2ec24f] bg-[#2ec24f] text-white'
                                    : 'border-[#d8d2e2] bg-white text-muted-foreground hover:border-[#b8b0c3]',
                                ].join(' ')}
                              >
                                {item.done ? '✓' : ''}
                              </button>
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold text-foreground">
                                  {item.label}
                                </p>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {item.done
                                    ? `Done ${formatChecklistTimestamp(item.doneAt)}`
                                    : 'Pending'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[12px] italic text-muted-foreground">
                          No checklist items available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        ) : (
          <div className="flex items-center justify-center p-20 text-sm font-semibold text-gray-400">
            No task selected.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

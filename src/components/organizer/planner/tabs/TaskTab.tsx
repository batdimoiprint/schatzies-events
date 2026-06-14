import { Plus } from 'lucide-react';
import { taskLaneConfig } from '@/constants/planner';
import type { TaskLane, PlannerBoardTask } from '@/types/planner';

interface TaskTabProps {
  boardTasks: PlannerBoardTask[];
  taskActionMessage: string;
  taskActionTone: 'success' | 'info' | 'error';
  taskCardMenuOpenFor: string | null;
  handleAddEmptyTask: () => void;
  handleDragTaskStart: (e: React.DragEvent<HTMLElement>, id: string) => void;
  handleDragTaskEnd: () => void;
  handleLaneDragOver: (e: React.DragEvent<HTMLElement>) => void;
  handleDropTaskToLane: (e: React.DragEvent<HTMLElement>, lane: TaskLane) => void;
  openTaskPreview: (id: string) => void;
  handleDeleteBoardTask: (id: string | number) => void;
  setTaskCardMenuOpenFor: React.Dispatch<React.SetStateAction<string | null>>;
}

export function TaskTab({
  boardTasks,
  taskActionMessage,
  taskActionTone,
  taskCardMenuOpenFor,
  handleAddEmptyTask,
  handleDragTaskStart,
  handleDragTaskEnd,
  handleLaneDragOver,
  handleDropTaskToLane,
  openTaskPreview,
  handleDeleteBoardTask,
  setTaskCardMenuOpenFor,
}: TaskTabProps) {
  return (
    <section className="rounded-2xl border border-border bg-[#fbfafd] p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e7e2f0] bg-white px-3 py-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
            Task Board
          </p>
          <p className="text-sm font-semibold text-[#5e586f]">
            Drag tasks across To Do, In Progress, and Completed.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddEmptyTask}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-4 text-xs font-black text-[#7c1cc9] transition hover:bg-[#f8f3ff]"
        >
          <Plus className="size-4" />
          Add Task
        </button>
      </div>
      {taskActionMessage && (
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
      )}
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
                <span className={`inline-flex size-2.5 rounded-full ${lane.dotClassName}`} />
                <h3 className="text-[20px] font-black tracking-tight text-foreground">
                  {lane.label} ({laneTasks.length})
                </h3>
              </div>
              <div
                className="flex-1 min-h-[400px] space-y-3 rounded-lg border border-dashed border-[#d8d2e2] bg-white/60 p-2"
                onDragOver={handleLaneDragOver}
                onDrop={(e) => handleDropTaskToLane(e, lane.id)}
              >
                {laneTasks.map((task, index) => (
                  <article
                    key={String(task.id || `fallback-task-${lane.id}-${index}`)}
                    draggable={task.lane !== 'completed'}
                    onDragStart={(e) => handleDragTaskStart(e, task.id)}
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
                        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() =>
                              setTaskCardMenuOpenFor((prev) => (prev === task.id ? null : task.id))
                            }
                            className="inline-flex size-7 items-center justify-center rounded-md text-[18px] leading-none text-[#3e384b] transition hover:bg-white/70"
                            aria-label="Task options"
                          >
                            ⋯
                          </button>
                          {taskCardMenuOpenFor === task.id && (
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
                          )}
                        </div>
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto pr-2 text-[12px] leading-snug text-muted-foreground [scrollbar-width:thin]">
                        <div className="space-y-1">
                          {(task.details ?? '')
                            .split('\n')
                            .map((line) => line.trim())
                            .filter(Boolean).length > 0 ? (
                            (task.details ?? '')
                              .split('\n')
                              .map((line) => line.trim())
                              .filter(Boolean)
                              .map((line, idx) => (
                                <p key={`${task.id}-detail-${idx}`} className="break-words">
                                  {line}
                                </p>
                              ))
                          ) : (
                            <p>No details yet.</p>
                          )}
                        </div>
                      </div>
                      {task.lane === 'in-progress' && (task.checklist ?? []).length > 0 && (
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
                                  style={{ accentColor: color }}
                                />
                                <span
                                  className={`min-w-0 flex-1 truncate text-[11px] font-medium ${item.done ? 'text-muted-foreground/70 line-through' : 'text-foreground/80'}`}
                                >
                                  {item.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {task.lane === 'completed' && (
                        <div className="mt-4 rounded-xl border border-[#dde8eb] bg-[#f5fbfc] px-3 py-2">
                          <div className="text-[13px] font-black text-foreground">Completed</div>
                          <div className="text-[12px] font-semibold text-muted-foreground">
                            This task is completed
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
                {laneTasks.length === 0 && (
                  <p className="px-1 py-4 text-center text-[12px] font-semibold text-[#8e869e]">
                    Drop task here
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

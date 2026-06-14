import { useState } from 'react';
import {
  getBoardTasks,
  createBoardTask,
  updateBoardTask,
  deleteBoardTask,
  moveBoardTask,
} from '@/api/planner-tasks';
import { mapLaneToBackendStatus } from '@/utils/planner-flow';
import type { PlannerBoardTask, TaskLane } from '@/types/planner';
import type { DragEvent } from 'react';

type ChecklistEntry = NonNullable<PlannerBoardTask['checklist']>[number];

interface RawBoardTaskItem {
  id?: string | number;
  _id?: string;
  status?: string;
  title?: string;
  description?: string;
  checklist?: ChecklistEntry[];
}

export function useBoardTasks(selectedEventId: string) {
  const [boardTasks, setBoardTasks] = useState<PlannerBoardTask[]>([]);
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

  const loadTasks = async () => {
    if (!selectedEventId) {
      setBoardTasks([]);
      return;
    }
    try {
      const response = await getBoardTasks(selectedEventId);
      const taskGroups = response?.tasks || {};
      const formattedTasks: PlannerBoardTask[] = [];
      if (typeof taskGroups === 'object' && !Array.isArray(taskGroups)) {
        Object.entries(taskGroups).forEach(([groupName, tasksInGroup]) => {
          if (Array.isArray(tasksInGroup)) {
            tasksInGroup.forEach((task: RawBoardTaskItem) => {
              const taskId = String(task.id || task._id || `task-${Date.now()}-${Math.random()}`);
              const rawStatus = String(task.status || groupName)
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '');
              let lane: TaskLane = 'todo';
              if (rawStatus.includes('progress')) lane = 'in-progress';
              else if (rawStatus.includes('complete')) lane = 'completed';
              formattedTasks.push({
                id: taskId,
                title: task.title || 'Untitled',
                details: task.description || '',
                editorType: 'Text',
                lane: lane,
                checklist: task.checklist || [],
              });
            });
          }
        });
      } else if (Array.isArray(response)) {
        response.forEach((task: RawBoardTaskItem) => {
          const taskId = String(task.id || task._id || `task-${Date.now()}-${Math.random()}`);
          const rawStatus = String(task.status || 'todo')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
          let lane: TaskLane = 'todo';
          if (rawStatus.includes('progress')) lane = 'in-progress';
          else if (rawStatus.includes('complete')) lane = 'completed';
          formattedTasks.push({
            id: taskId,
            title: task.title || 'Untitled',
            details: task.description || '',
            editorType: 'Text',
            lane: lane,
            checklist: task.checklist || [],
          });
        });
      }
      setBoardTasks(formattedTasks);
    } catch (error) {
      console.error('Failed to load board tasks:', error);
      setBoardTasks([]);
    }
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

  const handleDragTaskEnd = () => setDraggedTaskId(null);

  const handleLaneDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDropTaskToLane = async (event: DragEvent<HTMLElement>, lane: TaskLane) => {
    event.preventDefault();
    const droppedId = event.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!droppedId) return;
    const taskStrId = String(droppedId);
    const current = boardTasks.find((t) => String(t.id) === taskStrId);
    if (!current) return;
    if (current.lane === 'in-progress' && lane === 'todo') return;
    if (current.lane === 'completed' && lane !== 'completed') return;
    if (current.lane === 'in-progress' && lane === 'completed') {
      const checklist = Array.isArray(current.checklist) ? current.checklist : [];
      if (checklist.length === 0 || checklist.some((item) => !item.done)) return;
    }

    const previousTasksState = [...boardTasks];
    setBoardTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (String(task.id) !== taskStrId) return task;
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
          const checklistSource: ChecklistEntry[] =
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

    try {
      if (taskStrId.startsWith('board-task-')) {
        throw new Error('Please edit and save this new task first before moving it.');
      }
      await moveBoardTask(selectedEventId, taskStrId, {
        newStatus: mapLaneToBackendStatus(lane),
        newOrder: 1,
      });
    } catch (error) {
      setBoardTasks(previousTasksState);
      alert(error instanceof Error ? error.message : 'Failed to move task. Please try again.');
    }
  };

  const openTaskPreview = (taskId: string) => {
    const selectedTask = boardTasks.find((task) => String(task.id) === String(taskId));
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
        : (selectedTask?.checklist ?? []).map((item) => ({ ...item, doneAt: item.doneAt }))
    );
    setTaskActionMessage(`Editing ${selectedTask?.title || 'task'}.`);
    setTaskActionTone('info');
    setIsTaskPreviewOpen(true);
  };

  const handleSaveTaskPreview = async () => {
    if (!selectedBoardTaskId || selectedBoardTask?.lane !== 'todo') return;
    const normalizedChecklist = taskPreviewChecklist
      .map((item) => ({ ...item, label: item.label.trim() }))
      .filter((item) => item.label.length > 0)
      .map((item) => ({ id: item.id, label: item.label, done: false }));
    const normalizedDetails = taskPreviewDetails.trim();
    const finalDetails =
      normalizedDetails || normalizedChecklist.map((item) => item.label).join('\n');
    const payload = { title: taskPreviewTitle.trim(), description: finalDetails };
    try {
      let savedTask;
      if (selectedBoardTaskId.startsWith('board-task-')) {
        savedTask = await createBoardTask(selectedEventId, payload);
      } else {
        savedTask = await updateBoardTask(selectedEventId, selectedBoardTaskId, payload);
      }
      const wrapper = savedTask as {
        task?: RawBoardTaskItem;
        data?: RawBoardTaskItem;
      } | null;
      const actualTask: RawBoardTaskItem =
        wrapper?.task || wrapper?.data || (savedTask as RawBoardTaskItem) || {};
      const newId = actualTask?.id || actualTask?._id || selectedBoardTaskId;
      setBoardTasks((previousTasks) =>
        previousTasks.map((task) =>
          String(task.id) === String(selectedBoardTaskId)
            ? {
                ...task,
                id: String(newId),
                title: payload.title,
                details: finalDetails,
                checklist: normalizedChecklist,
              }
            : task
        )
      );
      setTaskActionMessage(`Saved ${payload.title} successfully.`);
      setTaskActionTone('success');
      setIsTaskPreviewOpen(false);
      setSelectedBoardTaskId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred while saving the task.');
    }
  };

  const handleDeleteBoardTask = async (taskId: string | number) => {
    const taskStrId = String(taskId);
    const targetTask = boardTasks.find((task) => String(task.id) === taskStrId);
    if (!targetTask) return;
    try {
      if (!taskStrId.startsWith('board-task-')) {
        await deleteBoardTask(selectedEventId, taskStrId);
      }
      setBoardTasks((previousTasks) =>
        previousTasks.filter((task) => String(task.id) !== taskStrId)
      );
      setTaskCardMenuOpenFor(null);
      setTaskActionMessage(`Deleted ${targetTask?.title || 'task'} successfully.`);
      setTaskActionTone('error');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete task. Please try again.');
    }
  };

  const handleToggleBoardTaskChecklistItem = async (taskId: string, itemId: string) => {
    if (!selectedEventId) return;
    const timestamp = new Date().toISOString();
    const targetTask = boardTasks.find((t) => String(t.id) === String(taskId));
    if (!targetTask || !Array.isArray(targetTask.checklist)) return;
    const updatedChecklist = targetTask.checklist.map((item) =>
      item.id === itemId
        ? { ...item, done: !item.done, doneAt: !item.done ? timestamp : undefined }
        : item
    );
    const previousTasksState = [...boardTasks];
    setBoardTasks((previousTasks) =>
      previousTasks.map((task) =>
        String(task.id) === String(taskId) ? { ...task, checklist: updatedChecklist } : task
      )
    );
    try {
      if (String(taskId).startsWith('board-task-')) {
        throw new Error('Please edit and save this new task first before modifying its checklist.');
      }
      await updateBoardTask(selectedEventId, String(taskId), {
        title: targetTask.title,
        description: targetTask.details,
        checklist: updatedChecklist,
      });
    } catch (error) {
      setBoardTasks(previousTasksState);
      alert(error instanceof Error ? error.message : 'Failed to update checklist item.');
    }
  };

  const selectedBoardTask =
    boardTasks.find((task) => String(task.id) === String(selectedBoardTaskId)) ?? null;

  return {
    boardTasks,
    setBoardTasks,
    isTaskPreviewOpen,
    setIsTaskPreviewOpen,
    selectedBoardTaskId,
    setSelectedBoardTaskId,
    selectedBoardTask,
    taskPreviewTitle,
    setTaskPreviewTitle,
    taskPreviewDetails,
    setTaskPreviewDetails,
    taskPreviewChecklist,
    setTaskPreviewChecklist,
    taskActionMessage,
    setTaskActionMessage,
    taskActionTone,
    setTaskActionTone,
    taskCardMenuOpenFor,
    setTaskCardMenuOpenFor,
    draggedTaskId,
    setDraggedTaskId,
    handleDragTaskStart,
    handleDragTaskEnd,
    handleLaneDragOver,
    handleDropTaskToLane,
    openTaskPreview,
    handleSaveTaskPreview,
    handleDeleteBoardTask,
    handleToggleBoardTaskChecklistItem,
    loadTasks,
    handleAddEmptyTask: () =>
      setBoardTasks((prev) => [
        {
          id: `board-task-${Date.now()}`,
          title: '',
          details: '',
          editorType: 'Text',
          lane: 'todo',
        },
        ...prev,
      ]),
    handleAddTodoChecklistItem: () =>
      setTaskPreviewChecklist((prev) => [
        ...prev,
        { id: `todo-item-${Date.now()}`, label: '', done: false },
      ]),
    handleUpdateTodoChecklistItem: (itemId: string, label: string) =>
      setTaskPreviewChecklist((prev) => prev.map((i) => (i.id === itemId ? { ...i, label } : i))),
    handleRemoveTodoChecklistItem: (itemId: string) =>
      setTaskPreviewChecklist((prev) => prev.filter((i) => i.id !== itemId)),
    formatChecklistTimestamp: (value?: string) => {
      if (!value) return 'Pending';
      return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    },
  };
}

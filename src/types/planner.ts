export type PlannerTab = 'overview' | 'task' | 'notes' | 'flow' | 'vendors' | 'costs';

export type ProjectSlot = {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  rawStartDate?: string;
  rawEndDate?: string;
  eventTime?: string;
  eventEndTime?: string;
  eventType?: string;
  eventPackage?: string;
  eventPax?: number;
  clientName?: string;
  clientId?: string;
  clientRealName?: string;
  eventCost?: string | number;
  venue?: string;
};

export type TaskLane = 'todo' | 'in-progress' | 'completed';
export type TaskEditorType = 'Text' | 'Toggle List' | 'Bulleted List' | 'Numbered List' | 'Divider';

export type PlannerBoardTask = {
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

export type PlannerQuickNote = {
  id: string;
  title: string;
  body: string;
  imageDataUrl?: string;
};

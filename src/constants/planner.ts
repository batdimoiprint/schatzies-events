import type { PlannerTab, TaskLane } from '@/types/planner';

export const tabs: Array<{ id: PlannerTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'task', label: 'Task' },
  { id: 'notes', label: 'Notes' },
  { id: 'flow', label: 'Flow' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'costs', label: 'Cost Breakdown' },
];

export const taskLaneConfig: Array<{
  id: TaskLane;
  label: string;
  dotClassName: string;
  panelClassName: string;
  cardOuterClassName: string;
  cardTitleClassName: string;
}> = [
  {
    id: 'todo',
    label: 'To Do',
    dotClassName: 'bg-[#e6d81d]',
    panelClassName: 'border-[#e4e4d0] bg-[#fafaf4]',
    cardOuterClassName: 'border-[#cae4cb] bg-[#dff0e0]',
    cardTitleClassName: 'text-[#4f8759]',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    dotClassName: 'bg-[#2ea4ff]',
    panelClassName: 'border-[#d3e7f7] bg-[#f4f9ff]',
    cardOuterClassName: 'border-[#ead4e9] bg-[#f0ddf0]',
    cardTitleClassName: 'text-[#712466]',
  },
  {
    id: 'completed',
    label: 'Completed',
    dotClassName: 'bg-[#2ec24f]',
    panelClassName: 'border-[#d8eddc] bg-[#f5fcf7]',
    cardOuterClassName: 'border-[#d4dfec] bg-[#deebf8]',
    cardTitleClassName: 'text-[#1f4c82]',
  },
];

export const flowBlockTones = [
  'border-[#f0bfd8] bg-[#fdeaf3] text-[#7b295f]',
  'border-[#cfe0f3] bg-[#eef6ff] text-[#2a5f91]',
  'border-[#dbe8dc] bg-[#f1fbf3] text-[#2d6640]',
  'border-[#e8dcc8] bg-[#fdf6ec] text-[#7a5c2e]',
  'border-[#d8cef3] bg-[#f3eeff] text-[#5a3d91]',
  'border-[#f0d8c8] bg-[#fdf1ec] text-[#7a4a2e]',
];

export const noteTileThemes = [
  {
    shellClassName: 'border-[#edd9e6] bg-[#fff7fb] text-[#6f295a]',
    headerClassName: 'from-[#ffdaea] via-[#ffeef5] to-[#fff7fb]',
    badgeClassName: 'bg-[#ffd7e7] text-[#a83f73]',
    accentClassName: 'bg-[#f1589e]',
    bodyClassName: 'text-[#5d5364]',
    footerClassName: 'border-[#ead8e6] bg-[#fffafd]',
  },
  {
    shellClassName: 'border-[#d8e3f0] bg-[#f7fbff] text-[#24476b]',
    headerClassName: 'from-[#d9ecff] via-[#eef7ff] to-[#f7fbff]',
    badgeClassName: 'bg-[#d8ebff] text-[#2c6aa5]',
    accentClassName: 'bg-[#2ea4ff]',
    bodyClassName: 'text-[#546273]',
    footerClassName: 'border-[#dbe6f2] bg-[#fbfdff]',
  },
  {
    shellClassName: 'border-[#dce9dd] bg-[#f7fcf8] text-[#2b5c37]',
    headerClassName: 'from-[#dff2e1] via-[#effaf1] to-[#f7fcf8]',
    badgeClassName: 'bg-[#d9f0dc] text-[#2e6b37]',
    accentClassName: 'bg-[#2ec24f]',
    bodyClassName: 'text-[#55645a]',
    footerClassName: 'border-[#dbe8de] bg-[#fbfdfb]',
  },
  {
    shellClassName: 'border-[#eadfcb] bg-[#fffaf1] text-[#70511f]',
    headerClassName: 'from-[#ffe8c7] via-[#fff4e0] to-[#fffaf1]',
    badgeClassName: 'bg-[#ffe0b8] text-[#9a6426]',
    accentClassName: 'bg-[#f0a12b]',
    bodyClassName: 'text-[#6a5b46]',
    footerClassName: 'border-[#eadfcb] bg-[#fffdf8]',
  },
];
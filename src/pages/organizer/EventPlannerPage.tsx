import { useMemo, useState } from 'react';
import { CalendarDays, ClipboardList, ListChecks, PartyPopper, Plus } from 'lucide-react';

type PlannerTab = 'overview' | 'task' | 'notes' | 'flow' | 'checklist';

type TaskLaneId = 'todo' | 'inProgress' | 'completed';

type TaskLane = {
  id: TaskLaneId;
  label: string;
  dotClassName: string;
};

type ProjectSlot = {
  id: number;
  title: string;
};

type SummaryCard = {
  label: string;
  value: string;
  valueClassName?: string;
  icon?: typeof PartyPopper;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  gradient: string;
};

const projectSlots: ProjectSlot[] = [
  { id: 1, title: "Angela's 18 Birthday" },
  { id: 2, title: '' },
  { id: 3, title: '' },
  { id: 4, title: '' },
  { id: 5, title: '' },
  { id: 6, title: '' },
  { id: 7, title: '' },
];

const tabs: Array<{ id: PlannerTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'task', label: 'Task' },
  { id: 'notes', label: 'Notes' },
  { id: 'flow', label: 'Flow' },
  { id: 'checklist', label: 'Checklist' },
];

const taskLanes: TaskLane[] = [
  { id: 'todo', label: 'To do', dotClassName: 'bg-[#e8d922]' },
  { id: 'inProgress', label: 'In Progress', dotClassName: 'bg-[#29a9f0]' },
  { id: 'completed', label: 'Completed', dotClassName: 'bg-[#3fc433]' },
];

const initialTaskSlotsByLane: Record<TaskLaneId, number> = {
  todo: 3,
  inProgress: 3,
  completed: 3,
};

const summaryCards: SummaryCard[] = [
  {
    label: 'Event Package',
    value: 'Blooms Package',
    valueClassName: 'text-lg leading-tight',
    imageSrc: '/Pictures/organizerpics/event-package-illustration.png',
    imageAlt: 'Event package illustration',
    imageClassName: '-mt-1 object-right',
    gradient: 'from-[#fde6f6] to-[#f5ebff] text-[#8724b7]',
  },
  {
    label: 'Event Pax',
    value: '40',
    imageSrc: '/Pictures/organizerpics/event-pax-illustration.png',
    imageAlt: 'Event pax illustration',
    gradient: 'from-[#fff2de] to-[#fff9ea] text-[#9d5f11]',
  },
  {
    label: 'Event Type',
    value: 'Debut',
    imageSrc: '/Pictures/organizerpics/event-type-illustration.png',
    imageAlt: 'Event type illustration',
    gradient: 'from-[#eaf7ff] to-[#f2f8ff] text-[#1f6ea6]',
  },
  {
    label: 'Event Cost',
    value: '50,000',
    imageSrc: '/Pictures/organizerpics/event-cost-illustration.png',
    imageAlt: 'Event cost illustration',
    gradient: 'from-[#fff0e6] to-[#fff8f0] text-[#a6541d]',
  },
];

const serviceRequirements = [
  'Classic Buffet',
  '1. Appetizer',
  'Light finger foods and canapes',
  '2. Main Course',
  'Chicken inasal, cordon bleu, and seafood',
  '3. Dessert',
  'Seasonal fruits, mousse cups, and custom cake',
];

const allocationResources = [
  {
    title: 'Event Coordinator',
    detail: ['Ken Chan', '08:00 - 08:00'],
  },
  {
    title: 'Host',
    detail: ['Angel U. Nicorn', '08:00 - 08:00'],
  },
  {
    title: 'Technicals',
    detail: [
      '1. Audio Cue',
      '2. Lighting Cue',
      '3. Visual/Screen Cue',
      '4. System Tech/Troubleshooter',
      '5. Dry Run Team',
    ],
  },
];

const meetings = ['Meeting 1 | 2hrs Coffee', 'Meeting 2 | 2hrs Coffee', 'Meeting 3 | 2hrs'];

const checkedItems = [
  'Technical manpower',
  'Lights and trussing',
  'Fresh flowers delivered',
  'Dry run DAY1',
  'Dry run DAY2',
];

const flowItems = [
  {
    time: '08:00 - 09:00',
    description: 'Guest registration and reception photos',
  },
  {
    time: '09:00 - 12:00',
    description: 'Opening program and formal ceremony',
  },
  {
    time: '12:00 - 15:00',
    description: 'Lunch, games, and family photo segments',
  },
  {
    time: '15:00 - 18:00',
    description: 'Main celebration flow and closing remarks',
  },
];

export function EventPlannerPage() {
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [activeTab, setActiveTab] = useState<PlannerTab>('task');
  const [taskSlotsByLane, setTaskSlotsByLane] =
    useState<Record<TaskLaneId, number>>(initialTaskSlotsByLane);

  const selectedProject = useMemo(() => {
    return projectSlots.find((project) => project.id === selectedProjectId) ?? projectSlots[0];
  }, [selectedProjectId]);

  const handleAddTaskSlot = (laneId: TaskLaneId) => {
    setTaskSlotsByLane((previousSlots) => ({
      ...previousSlots,
      [laneId]: previousSlots[laneId] + 1,
    }));
  };

  return (
    <div className="mx-auto flex w-full max-w-[1260px] flex-col gap-4 pb-2 text-[#302c39]">
      <div className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#ddd8e8] bg-white p-3 shadow-[0_6px_14px_rgba(31,18,54,0.06)]">
            <header className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#383341]">
                <ClipboardList className="size-3.5 text-[#5a5469]" />
                Projects List
              </h2>
              <button
                type="button"
                className="rounded-md p-1 text-[#898399] transition-colors hover:bg-[#f2eff8] hover:text-[#4b4558]"
                aria-label="Projects list options"
              >
                <span className="text-lg leading-none">⋮</span>
              </button>
            </header>

            <div className="space-y-1.5">
              {projectSlots.map((project) => {
                const isSelected = project.id === selectedProjectId;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className={[
                      'flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-all',
                      isSelected
                        ? 'border-transparent bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_8px_18px_rgba(171,39,185,0.35)]'
                        : 'border-[#e3deeb] bg-[#fbfaff] text-[#5e586f] hover:border-[#d4cce2] hover:bg-[#f4effb]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex size-4.5 shrink-0 items-center justify-center rounded text-[10px] font-bold',
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#ebe6f2] text-[#6e6680]',
                      ].join(' ')}
                    >
                      {project.id}
                    </span>
                    <span className="truncate text-xs font-semibold">
                      {project.title || 'Pending project slot'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[#ddd8e8] bg-white p-3 shadow-[0_6px_14px_rgba(31,18,54,0.06)]">
            <header className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#383341]">
                <ListChecks className="size-3.5 text-[#5a5469]" />
                Confirmed Events
              </h2>
              <button
                type="button"
                className="rounded-md p-1 text-[#898399] transition-colors hover:bg-[#f2eff8] hover:text-[#4b4558]"
                aria-label="Confirmed events options"
              >
                <span className="text-lg leading-none">⋮</span>
              </button>
            </header>

            <article className="rounded-xl border border-[#e5dfef] bg-[#fcfbfe] p-3">
              <div className="border-l-[3px] border-[#ed3da5] pl-2.5">
                <h3 className="text-[13px] font-bold text-[#524d60]">WeddingniSeb&amp;Rox</h3>
                <p className="mt-1 text-[11px] font-semibold text-[#7f788f]">January 3, 2026</p>
                <p className="text-[11px] text-[#9a93a8]">Start Date - End Date</p>

                <div className="mt-3 space-y-1 text-[11px] text-[#857f94]">
                  <p>Event Specification</p>
                  <p>Event Package</p>
                  <p>Event Pax</p>
                  <p>Event Type</p>
                </div>

                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-[#6b647b]">Description</p>
                  <p className="mt-1 line-clamp-2 text-[11px] italic text-[#9891a6]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis
                    bibendum.
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-3 inline-flex h-5 w-13 items-center justify-center rounded-full bg-linear-to-r from-[#f44aa3] to-[#861fd1] text-[10px] font-bold tracking-wide text-white"
                >
                  Plan
                </button>
              </div>
            </article>

            <div className="mt-2 h-12 rounded-xl border border-[#e9e4f1] bg-[#fdfcfe]" />
          </section>
        </aside>

        <section className="min-w-0 space-y-3">
          <article className="rounded-xl bg-linear-to-r from-[#f23fa3] to-[#7d1fd0] p-4 text-white shadow-[0_12px_24px_rgba(146,31,186,0.34)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-7 items-center justify-center rounded-md bg-white/20 text-sm font-bold">
                  {selectedProject.id}
                </span>
                <div>
                  <h2 className="text-xl font-extrabold leading-none">{selectedProject.title}</h2>
                  <div className="mt-2 space-y-1 text-xs text-white/90">
                    <p className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      January 3, 2026
                    </p>
                    <p>Start Date - End Date</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[420px]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>89% complete</span>
                  <span className="text-[11px] text-white/85">Current progress</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-white/35 p-[2px]">
                  <div className="h-full w-[89%] rounded-full bg-white" />
                </div>
                <div className="mt-2 text-right text-[11px] font-semibold text-white/90">
                  <p>Client Name: Example Name</p>
                  <p>Email | Contact Number</p>
                </div>
              </div>
            </div>
          </article>

          <div className="rounded-xl border border-[#ddd8e8] bg-white p-1 shadow-[0_4px_12px_rgba(33,19,57,0.05)]">
            <nav className="flex flex-wrap gap-1" aria-label="Event planning sections">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      'rounded-md px-4 py-1.5 text-xs font-bold transition-all',
                      active
                        ? 'bg-[#f4eefb] text-[#7c1cc9] shadow-[inset_0_0_0_1px_rgba(127,36,185,0.16)]'
                        : 'text-[#6b647d] hover:bg-[#f6f2fb] hover:text-[#4f4960]',
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {activeTab === 'overview' ? (
            <section className="rounded-2xl border border-[#ddd8e8] bg-[#fbfafd] p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                  return (
                    <article
                      key={card.label}
                      className="rounded-xl border border-[#e7e2f0] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(32,20,52,0.04)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-semibold text-[#7f7891]">{card.label}</p>
                          <p
                            className={[
                              'mt-1 font-black tracking-tight text-[#463f58]',
                              card.valueClassName ?? 'text-2xl',
                            ].join(' ')}
                          >
                            {card.value}
                          </p>
                        </div>
                        {card.imageSrc ? (
                          <img
                            src={card.imageSrc}
                            alt={card.imageAlt ?? card.label}
                            className={[
                              'h-[46px] w-[72px] shrink-0 object-contain',
                              card.imageClassName ?? '',
                            ].join(' ')}
                            loading="lazy"
                          />
                        ) : (
                          <span
                            className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${card.gradient}`}
                          >
                            {card.icon ? <card.icon className="size-5" /> : null}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-2 grid gap-2 xl:grid-cols-[1.35fr_1fr_1fr_1fr]">
                <article className="rounded-xl border border-[#ddd8e8] bg-white p-3">
                  <h3 className="text-sm font-black text-[#50495f]">Service Requirements</h3>
                  <div className="mt-2 space-y-1.5 text-[11px] leading-tight text-[#6f687f]">
                    <p className="font-bold text-[#5f3ed0]">Food</p>
                    {serviceRequirements.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </article>

                <article className="rounded-xl border border-[#ddd8e8] bg-white p-3">
                  <h3 className="text-sm font-black text-[#50495f]">Allocation Resources</h3>
                  <div className="mt-2 space-y-2">
                    {allocationResources.map((resource) => (
                      <div
                        key={resource.title}
                        className="rounded-lg border border-[#e8e3f0] bg-[#fcfbfe] p-2"
                      >
                        <p className="text-[11px] font-bold text-[#5f3ed0]">{resource.title}</p>
                        <div className="mt-1.5 space-y-1 text-[11px] text-[#6f687f]">
                          {resource.detail.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <div className="space-y-2">
                  <article className="rounded-xl border border-[#ddd8e8] bg-white p-3">
                    <h3 className="text-sm font-black text-[#50495f]">Checklist &amp; Meeting</h3>
                    <div className="mt-2 space-y-1 text-[11px] text-[#6f687f]">
                      {meetings.map((meeting) => (
                        <p key={meeting}>{meeting}</p>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-xl border border-[#ddd8e8] bg-white p-3">
                    <h3 className="text-sm font-black text-[#50495f]">Checked</h3>
                    <ul className="mt-2 space-y-1 text-[11px] text-[#6f687f]">
                      {checkedItems.map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="mt-0.5 text-[10px] text-[#9f99ad]">□</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>

                <article className="rounded-xl border border-[#ddd8e8] bg-white p-3">
                  <h3 className="text-sm font-black text-[#50495f]">Program Flow</h3>
                  <div className="mt-2 space-y-2">
                    {flowItems.map((item) => (
                      <div
                        key={item.time}
                        className="rounded-lg border border-[#e8e3f0] bg-[#fcfbfe] p-2"
                      >
                        <p className="text-[11px] font-bold text-[#5f3ed0]">{item.time}</p>
                        <p className="mt-1 text-[11px] leading-tight text-[#6f687f]">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          ) : activeTab === 'task' ? (
            <section className="rounded-2xl border border-[#ddd8e8] bg-[#fbfafd] p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
              <div className="grid gap-3 xl:grid-cols-3">
                {taskLanes.map((lane) => {
                  const slotCount = taskSlotsByLane[lane.id];

                  return (
                    <article
                      key={lane.id}
                      className="rounded-xl border border-[#ddd8e8] bg-white p-2.5 shadow-[0_2px_8px_rgba(32,20,52,0.04)]"
                    >
                      <header className="mb-2.5 flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-[13px] font-black text-[#3d3750]">
                          <span
                            className={`inline-flex size-2 rounded-full ${lane.dotClassName}`}
                          />
                          {lane.label} ({slotCount})
                        </h3>

                        <button
                          type="button"
                          onClick={() => handleAddTaskSlot(lane.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-bold text-[#4153df] transition-colors hover:bg-[#f2f4ff]"
                        >
                          <Plus className="size-3.5" />
                          Add New Task
                        </button>
                      </header>

                      <div className="space-y-2.5">
                        {Array.from({ length: slotCount }).map((_, index) => (
                          <div
                            key={`${lane.id}-${index}`}
                            className="h-[166px] rounded-xl border border-[#e0dcea] bg-[#f8f6fc] p-2"
                          >
                            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#dad4e8] bg-[#fbf9fe] text-xs font-semibold text-[#a59fb7]">
                              Task Slot {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-[#ddd8e8] bg-white px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#7c748f]">
                {tabs.find((tab) => tab.id === activeTab)?.label} view is ready for the next data
                integration.
              </p>
            </section>
          )}
        </section>
      </div>
    </div>
  );
}

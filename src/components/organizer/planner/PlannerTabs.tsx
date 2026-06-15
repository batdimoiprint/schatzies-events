import { tabs } from '@/constants/planner';
import type { PlannerTab } from '@/types/planner';

interface PlannerTabsProps {
  activeTab: PlannerTab;
  onTabChange: (tab: PlannerTab) => void;
}

export function PlannerTabs({ activeTab, onTabChange }: PlannerTabsProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-[0_4px_12px_rgba(33,19,57,0.05)]">
      <nav
        className="flex items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Event planning sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={[
              'rounded-lg px-4 py-2 text-[11px] font-bold transition',
              activeTab === tab.id
                ? 'bg-[#f3eefb] text-[#7c1cc9]'
                : 'text-[#7b748f] hover:bg-[#f7f3fb]',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

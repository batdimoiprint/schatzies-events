import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChecklistTabItem {
  id: string;
  label?: string;
  done?: boolean;
}

interface ChecklistTabProps {
  checklistItems: ChecklistTabItem[];
  checklistProgress: number;
  handleToggleChecklistItem: (id: string, done: boolean) => void;
  handleUpdateChecklistLabel: (id: string, label: string) => void;
  openChecklistDeleteValidation: (item: { id: string; label: string }) => void;
  handleAddChecklistItem: () => void;
}

export function ChecklistTab({
  checklistItems,
  checklistProgress,
  handleToggleChecklistItem,
  handleUpdateChecklistLabel,
  openChecklistDeleteValidation,
  handleAddChecklistItem,
}: ChecklistTabProps) {
  return (
    <section className="rounded-2xl border border-border bg-[#fbfafd] p-3 shadow-[0_6px_14px_rgba(31,18,54,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[18px] font-bold tracking-tight text-foreground">
          Checklist ({checklistItems.length} Items)
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-muted-foreground">Overall Progress</span>
          <span className="text-[14px] font-bold text-foreground">{checklistProgress}%</span>
        </div>
      </div>
      <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-[#f0eaf6]">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${checklistProgress}%`,
            background: 'linear-gradient(90deg, #f1589e, #8a1fd0)',
          }}
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <ul className="divide-y divide-[#f0ecf6]">
          {checklistItems.map((item, index) => {
            const palette = [
              '#f347a5',
              '#ff0066',
              '#f1589e',
              '#2ea4ff',
              '#2ec24f',
              '#ffb86b',
              '#e6005c',
            ];
            const color = palette[index % palette.length];
            return (
              <li key={item.id} className="flex min-h-[56px] items-center justify-between px-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleChecklistItem(item.id, item.done ?? false)}
                    aria-label={`${item.done ? 'Uncheck' : 'Check'} ${item.label}`}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 transition-all"
                    style={{
                      borderColor: color,
                      background: item.done ? color : 'white',
                      color: item.done ? 'white' : color,
                    }}
                  >
                    {item.done ? '✓' : ''}
                  </button>
                  <span
                    className="inline-flex h-2 w-2 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <Input
                    value={item.label ?? ''}
                    onChange={(e) => handleUpdateChecklistLabel(item.id, e.target.value)}
                    onBlur={(e) => handleUpdateChecklistLabel(item.id, e.target.value)}
                    className={`h-9 border-transparent bg-transparent px-1 text-[15px] font-medium shadow-none focus-visible:ring-1 focus-visible:ring-[#e3ddea] w-full ${item.done ? 'text-muted-foreground/70 line-through' : 'text-foreground'}`}
                  />
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openChecklistDeleteValidation({ id: item.id, label: item.label ?? '' })
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-muted-foreground transition hover:border-brand hover:text-brand"
                    aria-label={`Delete ${item.label}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {checklistItems.length === 0 && (
          <div className="px-3 py-8 text-center text-sm font-semibold text-muted-foreground">
            No checklist items yet. Add one to start tracking tasks.
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleAddChecklistItem}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-brand via-[#d735b3] to-brand-deep px-4 text-[15px] font-semibold tracking-tight text-white shadow-[0_10px_22px_rgba(125,31,186,0.34)]"
      >
        <Plus className="size-5 text-foreground" />
        <span>Add Checklist Item</span>
      </button>
    </section>
  );
}

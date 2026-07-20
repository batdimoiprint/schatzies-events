import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PlusCircle,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  ChevronUp,
  ChevronDown,
  LayoutList,
  Sparkles,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  INCLUSION_TYPE_SUGGESTIONS,
  addPackageInclusion,
  updatePackageInclusion,
  deletePackageInclusion,
  reorderPackageInclusions,
  type PackageInclusion,
} from '@/api/packages';
import { CopyInclusionsDialog } from './CopyInclusionsDialog';

interface ReorderableInclusionsManagerProps {
  packageId: string;
  packageName: string;
  inclusions: PackageInclusion[];
  refetch: () => void;
  typeSuggestions?: string[];
}

interface GroupedCategory {
  category: string;
  items: PackageInclusion[];
}

export function ReorderableInclusionsManager({
  packageId,
  packageName,
  inclusions: initialInclusions,
  refetch,
  typeSuggestions = [],
}: ReorderableInclusionsManagerProps) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<PackageInclusion[]>(initialInclusions);
  const [showInclusionForm, setShowInclusionForm] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [inclusionType, setInclusionType] = useState('');
  const [inclusionText, setInclusionText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Category Title Editing state
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>('');

  // Individual Item Detail Editing state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItemText, setEditedItemText] = useState<string>('');

  // Sync initialInclusions when props change
  useEffect(() => {
    setItems(initialInclusions);
  }, [initialInclusions]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['packages'] });
    refetch();
  };

  // Group items by category while preserving exact first-seen category order
  const groupedCategories: GroupedCategory[] = (() => {
    const map = new Map<string, PackageInclusion[]>();
    for (const item of items) {
      const cat = item.inclusionType?.trim() || 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  })();

  // Add Inclusion Mutation
  const addInclusionMutation = useMutation({
    mutationFn: () =>
      addPackageInclusion(packageId, {
        inclusionType: inclusionType.trim(),
        inclusion: inclusionText.trim(),
      }),
    onSuccess: () => {
      invalidate();
      setInclusionText('');
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to add inclusion'),
  });

  // Delete Inclusion Mutation
  const deleteInclusionMutation = useMutation({
    mutationFn: (inclusionId: string) => deletePackageInclusion(packageId, inclusionId),
    onSuccess: invalidate,
  });

  // Update Single Inclusion Mutation
  const updateInclusionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Omit<PackageInclusion, 'id'>> }) =>
      updatePackageInclusion(packageId, id, payload),
    onSuccess: () => {
      invalidate();
      setEditingItemId(null);
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to update inclusion'),
  });

  // Update Category Title Mutation (updates inclusionType for all items in category)
  const updateCategoryTitleMutation = useMutation({
    mutationFn: async ({ oldCategory, newCategory }: { oldCategory: string; newCategory: string }) => {
      const targetItems = items.filter((i) => i.inclusionType.trim() === oldCategory.trim());
      await Promise.all(
        targetItems.map((item) =>
          updatePackageInclusion(packageId, item.id, { inclusionType: newCategory.trim() })
        )
      );
    },
    onSuccess: () => {
      invalidate();
      setEditingCategory(null);
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to update section title'),
  });

  // Reorder Mutation
  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => reorderPackageInclusions(packageId, orderedIds),
    onSuccess: invalidate,
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to save order'),
  });

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveOrder = (newItems: PackageInclusion[]) => {
    setItems(newItems);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const orderedIds = newItems.map((item) => item.id);
    debounceTimerRef.current = setTimeout(() => {
      reorderMutation.mutate(orderedIds);
    }, 300);
  };

  const moveCategory = (catIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? catIndex - 1 : catIndex + 1;
    if (targetIndex < 0 || targetIndex >= groupedCategories.length) return;

    const newCategories = [...groupedCategories];
    const [movedCat] = newCategories.splice(catIndex, 1);
    newCategories.splice(targetIndex, 0, movedCat);

    const flattened = newCategories.flatMap((c) => c.items);
    saveOrder(flattened);
  };

  const moveItemInList = (fromId: string, toId: string) => {
    const fromIndex = items.findIndex((i) => i.id === fromId);
    const toIndex = items.findIndex((i) => i.id === toId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    saveOrder(updated);
  };

  const moveSingleItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    saveOrder(updated);
  };

  const handleQuickAddForCategory = (catName: string) => {
    setInclusionType(catName);
    setShowInclusionForm(true);
  };

  const startCategoryEditing = (catName: string) => {
    setEditingCategory(catName);
    setEditedCategoryName(catName);
  };

  const startItemEditing = (item: PackageInclusion) => {
    setEditingItemId(item.id);
    setEditedItemText(item.inclusion);
  };

  const suggestions = [
    ...new Set([
      ...INCLUSION_TYPE_SUGGESTIONS,
      ...typeSuggestions,
      ...items.map((i) => i.inclusionType),
    ]),
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_4px_20px_rgba(61,32,82,0.04)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <LayoutList className="size-5 text-brand" />
            <h3 className="text-base font-bold text-foreground">Package Inclusions</h3>
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
              {items.length} total ({groupedCategories.length} sections)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCopyDialog(true)}
              className="h-8 gap-1.5 rounded-full border-[#d9d3e0] px-3.5 text-xs font-bold text-[#3d3546] hover:bg-[#f7f4f9]"
            >
              <Copy className="size-3.5 text-brand" />
              Copy Inclusions
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowInclusionForm((v) => !v);
                if (!inclusionType && groupedCategories.length > 0) {
                  setInclusionType(groupedCategories[0].category);
                }
              }}
              className="h-8 gap-1.5 rounded-full border-[#d9d3e0] px-3.5 text-xs font-bold text-[#3d3546] hover:bg-[#f7f4f9]"
            >
              <PlusCircle className="size-3.5 text-brand" />
              Add Inclusion
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {/* Add Inclusion Form */}
        {showInclusionForm && (
          <div className="space-y-3 rounded-xl bg-[#f7f4f9] p-4 border border-dashed border-[#d9d3e0]">
            <div className="flex items-center gap-2 text-xs font-bold text-brand pb-1">
              <Sparkles className="size-4" />
              <span>Add Inclusion under Category</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="reorder-inclusion-type" className="text-[10px] text-muted-foreground">
                  Category Section Title
                </Label>
                <Input
                  id="reorder-inclusion-type"
                  list="reorder-type-suggestions"
                  value={inclusionType}
                  onChange={(e) => setInclusionType(e.target.value)}
                  placeholder="e.g. CEREMONY STYLING"
                  className="bg-white h-9 text-xs"
                />
                <datalist id="reorder-type-suggestions">
                  {suggestions.map((type) => (
                    <option key={type} value={type} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-1">
                <Label htmlFor="reorder-inclusion-detail" className="text-[10px] text-muted-foreground">
                  Bullet Item Detail
                </Label>
                <Input
                  id="reorder-inclusion-detail"
                  value={inclusionText}
                  onChange={(e) => setInclusionText(e.target.value)}
                  placeholder="e.g. 6 Pairs of aisle flowers"
                  className="bg-white h-9 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowInclusionForm(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => addInclusionMutation.mutate()}
                disabled={
                  !inclusionType.trim() || !inclusionText.trim() || addInclusionMutation.isPending
                }
                className="gap-1 rounded-xl bg-brand px-4 text-xs font-bold text-white hover:bg-brand"
              >
                <Plus className="size-3.5" />
                {addInclusionMutation.isPending ? 'Adding...' : 'Save Inclusion'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Hierarchical Category Cards List */}
      {groupedCategories.length === 0 && !showInclusionForm ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-center space-y-3">
          <p className="text-xs text-muted-foreground italic">No inclusions configured yet.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCopyDialog(true)}
            className="text-xs text-brand font-bold rounded-full"
          >
            Copy inclusions from another package
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedCategories.map((group, catIndex) => (
            <div
              key={group.category}
              className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden transition-all hover:border-brand/30"
            >
              {/* Category Card Header (with Title Editing) */}
              <div className="flex items-center justify-between gap-3 bg-[#f8f6fa] px-4 py-3 border-b border-border/80">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {editingCategory === group.category ? (
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                      <Input
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        className="bg-white h-8 text-xs font-bold uppercase text-brand"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editedCategoryName.trim()) {
                            updateCategoryTitleMutation.mutate({
                              oldCategory: group.category,
                              newCategory: editedCategoryName.trim(),
                            });
                          }
                          if (e.key === 'Escape') setEditingCategory(null);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editedCategoryName.trim()) {
                            updateCategoryTitleMutation.mutate({
                              oldCategory: group.category,
                              newCategory: editedCategoryName.trim(),
                            });
                          }
                        }}
                        disabled={!editedCategoryName.trim() || updateCategoryTitleMutation.isPending}
                        className="p-1 text-green-600 hover:text-green-700 disabled:opacity-30"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-brand truncate">
                        {group.category}
                      </span>
                      <button
                        type="button"
                        aria-label="Edit category title"
                        title="Edit section title"
                        onClick={() => startCategoryEditing(group.category)}
                        className="p-1 text-gray-400 hover:text-brand transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-muted-foreground border border-border shrink-0">
                        {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </>
                  )}
                </div>

                {/* Category Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAddForCategory(group.category)}
                    className="h-7 gap-1 rounded-lg px-2 text-[11px] font-bold text-brand hover:bg-brand/10"
                  >
                    <Plus className="size-3" />
                    Add Bullet
                  </Button>
                  <div className="h-4 w-px bg-border mx-0.5" />
                  <button
                    type="button"
                    aria-label="Move category up"
                    disabled={catIndex === 0}
                    onClick={() => moveCategory(catIndex, 'up')}
                    className="p-1 text-muted-foreground hover:text-brand disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move category down"
                    disabled={catIndex === groupedCategories.length - 1}
                    onClick={() => moveCategory(catIndex, 'down')}
                    className="p-1 text-muted-foreground hover:text-brand disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
              </div>

              {/* Bullet Items under Category Card (with Item Detail Editing) */}
              <ul className="divide-y divide-gray-100 p-2">
                {group.items.map((item) => {
                  const globalIndex = items.findIndex((i) => i.id === item.id);
                  const isEditingItem = editingItemId === item.id;

                  return (
                    <li
                      key={item.id}
                      draggable={!isEditingItem}
                      onDragStart={() => setDraggedItemId(item.id)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedItemId && draggedItemId !== item.id) {
                          moveItemInList(draggedItemId, item.id);
                          setDraggedItemId(item.id);
                        }
                      }}
                      onDragEnd={() => setDraggedItemId(null)}
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl text-xs transition-all ${
                        draggedItemId === item.id
                          ? 'opacity-40 bg-brand/5 border border-brand'
                          : 'hover:bg-[#fbf9fc]'
                      }`}
                    >
                      {/* Bullet point & text or inline edit field */}
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-brand transition-colors shrink-0">
                          <GripVertical className="size-4" />
                        </span>
                        <span className="size-1.5 rounded-full bg-brand/60 shrink-0" />

                        {isEditingItem ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editedItemText}
                              onChange={(e) => setEditedItemText(e.target.value)}
                              className="bg-white h-8 text-xs font-medium text-[#2d2433]"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && editedItemText.trim()) {
                                  updateInclusionMutation.mutate({
                                    id: item.id,
                                    payload: { inclusion: editedItemText.trim() },
                                  });
                                }
                                if (e.key === 'Escape') setEditingItemId(null);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (editedItemText.trim()) {
                                  updateInclusionMutation.mutate({
                                    id: item.id,
                                    payload: { inclusion: editedItemText.trim() },
                                  });
                                }
                              }}
                              disabled={!editedItemText.trim() || updateInclusionMutation.isPending}
                              className="p-1 text-green-600 hover:text-green-700 disabled:opacity-30"
                            >
                              <Check className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItemId(null)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#2d2433] leading-relaxed font-medium truncate">
                            {item.inclusion}
                          </span>
                        )}
                      </div>

                      {/* Item controls (Edit, Move, Delete) */}
                      {!isEditingItem && (
                        <div className="flex items-center gap-1 shrink-0 opacity-80 hover:opacity-100">
                          <button
                            type="button"
                            aria-label="Edit inclusion text"
                            title="Edit inclusion detail"
                            onClick={() => startItemEditing(item)}
                            className="p-1 text-gray-400 hover:text-brand transition-colors"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Move bullet up"
                            disabled={globalIndex === 0}
                            onClick={() => moveSingleItem(globalIndex, 'up')}
                            className="p-1 text-gray-400 hover:text-brand disabled:opacity-30 transition-colors"
                          >
                            <ChevronUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Move bullet down"
                            disabled={globalIndex === items.length - 1}
                            onClick={() => moveSingleItem(globalIndex, 'down')}
                            className="p-1 text-gray-400 hover:text-brand disabled:opacity-30 transition-colors"
                          >
                            <ChevronDown className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Remove bullet inclusion"
                            onClick={() => deleteInclusionMutation.mutate(item.id)}
                            disabled={deleteInclusionMutation.isPending}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-1"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Copy Inclusions Dialog */}
      <CopyInclusionsDialog
        open={showCopyDialog}
        targetPackageId={packageId}
        targetPackageName={packageName}
        onClose={() => setShowCopyDialog(false)}
        onCopied={invalidate}
      />
    </div>
  );
}

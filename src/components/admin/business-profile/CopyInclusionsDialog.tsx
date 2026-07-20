import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Layers, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  copyPackageInclusions,
  getPackageById,
  getPackages,
  type EventPackage,
} from '@/api/packages';

interface CopyInclusionsDialogProps {
  open: boolean;
  targetPackageId: string;
  targetPackageName: string;
  onClose: () => void;
  onCopied?: () => void;
}

export function CopyInclusionsDialog({
  open,
  targetPackageId,
  targetPackageName,
  onClose,
  onCopied,
}: CopyInclusionsDialogProps) {
  const queryClient = useQueryClient();
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [selectedInclusionIds, setSelectedInclusionIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Fetch all packages for source selection
  const { data: packages = [], isLoading: packagesLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', 'all-for-copy'],
    queryFn: async () => {
      const [weddingPkgs, debutPkgs] = await Promise.all([
        getPackages('Wedding'),
        getPackages('Debut'),
      ]);
      const combined = [...weddingPkgs, ...debutPkgs];
      const uniqueMap = new Map<string, EventPackage>();
      combined.forEach((p) => uniqueMap.set(p.id, p));
      return Array.from(uniqueMap.values());
    },
    enabled: open,
  });

  const availableSources = packages.filter((p) => p.id !== targetPackageId);

  const { data: sourcePackage, isLoading: sourceLoading } = useQuery<EventPackage | null>({
    queryKey: ['packages', 'detail', selectedSourceId],
    queryFn: () => (selectedSourceId ? getPackageById(selectedSourceId) : Promise.resolve(null)),
    enabled: !!selectedSourceId,
  });

  // When source package changes, select all of its inclusions by default
  useEffect(() => {
    if (sourcePackage?.inclusions) {
      setSelectedInclusionIds(new Set(sourcePackage.inclusions.map((item) => item.id)));
    } else {
      setSelectedInclusionIds(new Set());
    }
  }, [sourcePackage]);

  const toggleInclusion = (id: string) => {
    setSelectedInclusionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allInclusions = sourcePackage?.inclusions ?? [];
    if (selectedInclusionIds.size === allInclusions.length) {
      setSelectedInclusionIds(new Set());
    } else {
      setSelectedInclusionIds(new Set(allInclusions.map((item) => item.id)));
    }
  };

  const copyMutation = useMutation({
    mutationFn: () =>
      copyPackageInclusions(
        targetPackageId,
        selectedSourceId,
        Array.from(selectedInclusionIds)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      if (onCopied) onCopied();
      onClose();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to copy inclusions'),
  });

  const sourceInclusions = sourcePackage?.inclusions ?? [];
  const allSelected = sourceInclusions.length > 0 && selectedInclusionIds.size === sourceInclusions.length;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="rounded-3xl p-6 sm:max-w-lg sm:p-8">
        <div className="space-y-5">
          <div>
            <DialogTitle className="font-heading text-2xl font-bold text-foreground">
              Copy Inclusions
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Select a source package and choose specific inclusions to copy into{' '}
              <span className="font-semibold text-foreground">{targetPackageName}</span>.
            </DialogDescription>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Select Source Package */}
          <div className="space-y-1.5">
            <label htmlFor="source-package-select" className="text-xs font-semibold text-muted-foreground">
              Select Source Package or Event
            </label>
            {packagesLoading ? (
              <p className="text-xs text-muted-foreground animate-pulse">Loading packages...</p>
            ) : availableSources.length === 0 ? (
              <p className="text-xs text-muted-foreground">No other packages available to copy from.</p>
            ) : (
              <select
                id="source-package-select"
                value={selectedSourceId}
                onChange={(e) => {
                  setSelectedSourceId(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-xl border border-border bg-[#efedf0] p-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="">-- Choose a package --</option>
                {availableSources.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.eventType} — {pkg.packageName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selective Inclusions Checklist */}
          {selectedSourceId && (
            <div className="space-y-2 rounded-xl bg-[#f7f4f9] p-3 border border-border">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Layers className="size-4 text-brand" />
                  <span>
                    Select Inclusions ({selectedInclusionIds.size}/{sourceInclusions.length})
                  </span>
                </div>
                {sourceInclusions.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center gap-1 text-[11px] font-bold text-brand hover:underline"
                  >
                    {allSelected ? (
                      <>
                        <CheckSquare className="size-3.5" /> Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="size-3.5" /> Select All
                      </>
                    )}
                  </button>
                )}
              </div>

              {sourceLoading ? (
                <p className="text-xs text-muted-foreground py-3 text-center animate-pulse">Loading inclusions preview...</p>
              ) : sourceInclusions.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center italic">Selected package has no inclusions.</p>
              ) : (
                <ul className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {sourceInclusions.map((inc) => {
                    const isChecked = selectedInclusionIds.has(inc.id);
                    return (
                      <li
                        key={inc.id}
                        onClick={() => toggleInclusion(inc.id)}
                        className={`flex items-center gap-2.5 text-xs p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'bg-white border-brand/40 shadow-sm text-foreground'
                            : 'bg-white/60 border-border text-muted-foreground opacity-60 hover:opacity-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleInclusion(inc.id)}
                          className="size-4 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
                        />
                        <span className="font-bold text-brand text-[10px] bg-brand/10 px-1.5 py-0.5 rounded shrink-0">
                          {inc.inclusionType}
                        </span>
                        <span className="truncate">{inc.inclusion}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full px-5 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => copyMutation.mutate()}
              disabled={
                !selectedSourceId ||
                selectedInclusionIds.size === 0 ||
                copyMutation.isPending
              }
              className="gap-1.5 rounded-full bg-brand px-5 text-xs font-bold text-white shadow-md hover:bg-brand"
            >
              <Copy className="size-3.5" />
              {copyMutation.isPending
                ? 'Copying...'
                : `Copy Selected (${selectedInclusionIds.size})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

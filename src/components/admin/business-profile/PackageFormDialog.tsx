import { useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  INCLUSION_TYPE_SUGGESTIONS,
  addPackageInclusion,
  addPackagePax,
  createPackage,
  deletePackageInclusion,
  deletePackagePax,
  updatePackage,
  type EventPackage,
  type EventType,
  type PackageInclusion,
} from '@/api/packages';

interface PackageFormDialogProps {
  open: boolean;
  eventType: EventType;
  /** Package being edited; null means create mode */
  pkg: EventPackage | null;
  onClose: () => void;
  /** Called after a new package is created so the parent can switch to edit mode */
  onCreated?: (id: string) => void;
}

export function PackageFormDialog({
  open,
  eventType,
  pkg,
  onClose,
  onCreated,
}: PackageFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {/* DialogContent unmounts on close, so keying the body by package id
          gives each open a fresh form without effect-driven resets */}
      <PackageFormBody
        key={pkg?.id ?? 'new'}
        eventType={eventType}
        pkg={pkg}
        onClose={onClose}
        onCreated={onCreated}
      />
    </Dialog>
  );
}

function PackageFormBody({
  eventType,
  pkg,
  onClose,
  onCreated,
}: Omit<PackageFormDialogProps, 'open'>) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [packageName, setPackageName] = useState(pkg?.packageName ?? '');
  const [description, setDescription] = useState(pkg?.description ?? '');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Inclusion draft row
  const [showInclusionForm, setShowInclusionForm] = useState(false);
  const [inclusionType, setInclusionType] = useState('');
  const [inclusionText, setInclusionText] = useState('');

  // Pax tier draft row
  const [showPaxForm, setShowPaxForm] = useState(false);
  const [paxCount, setPaxCount] = useState('');
  const [paxPrice, setPaxPrice] = useState('');
  const [paxNote, setPaxNote] = useState('');

  const coverPreview = useMemo(
    () => (newImages.length > 0 ? URL.createObjectURL(newImages[0]) : null),
    [newImages]
  );
  const coverUrl = coverPreview ?? pkg?.images[0]?.url ?? null;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['packages'] });

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        eventType,
        packageName: packageName.trim(),
        description: description.trim(),
        images: newImages.length > 0 ? newImages : undefined,
      };
      return pkg ? updatePackage(pkg.id, payload) : createPackage(payload);
    },
    onSuccess: (saved) => {
      invalidate();
      if (pkg) {
        onClose();
      } else if (saved?.id && onCreated) {
        // Stay open in edit mode so inclusions and pax tiers can be added
        onCreated(saved.id);
      } else {
        onClose();
      }
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to save package'),
  });

  const addInclusionMutation = useMutation({
    mutationFn: () =>
      addPackageInclusion(pkg!.id, {
        inclusionType: inclusionType.trim(),
        inclusion: inclusionText.trim(),
      }),
    onSuccess: () => {
      invalidate();
      setInclusionText('');
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to add inclusion'),
  });

  const deleteInclusionMutation = useMutation({
    mutationFn: (inclusionId: string) => deletePackageInclusion(pkg!.id, inclusionId),
    onSuccess: invalidate,
  });

  const addPaxMutation = useMutation({
    mutationFn: () =>
      addPackagePax(pkg!.id, {
        pax: Number(paxCount),
        paxPrice: Number(paxPrice),
        note: paxNote.trim() || undefined,
      }),
    onSuccess: () => {
      invalidate();
      setPaxCount('');
      setPaxPrice('');
      setPaxNote('');
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to add pax tier'),
  });

  const deletePaxMutation = useMutation({
    mutationFn: (paxId: string) => deletePackagePax(pkg!.id, paxId),
    onSuccess: invalidate,
  });

  // Group inclusions by their free-form type, preserving first-seen order
  const inclusionGroups: Array<{ type: string; items: PackageInclusion[] }> = [];
  for (const item of pkg?.inclusions ?? []) {
    const group = inclusionGroups.find((g) => g.type === item.inclusionType);
    if (group) {
      group.items.push(item);
    } else {
      inclusionGroups.push({ type: item.inclusionType, items: [item] });
    }
  }

  // Datalist suggestions: defaults plus types already used in this package
  const typeSuggestions = [
    ...new Set([...INCLUSION_TYPE_SUGGESTIONS, ...inclusionGroups.map((g) => g.type)]),
  ];

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:max-w-3xl sm:p-8">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        {/* Header: serif title + Save & Close */}
        <div className="flex items-start justify-between gap-3 pr-8">
          <div>
            <DialogTitle className="font-heading text-2xl font-bold text-foreground">
              {pkg ? 'Edit Package' : `Add ${eventType} Package`}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {pkg
                ? 'Update package details, cover, inclusions, and pax tiers.'
                : `Create a new ${eventType.toLowerCase()} package.`}
            </DialogDescription>
          </div>
          <Button
            type="submit"
            disabled={!packageName.trim() || saveMutation.isPending}
            className="rounded-full bg-brand px-5 text-xs font-bold text-white shadow-md hover:bg-brand"
          >
            {saveMutation.isPending ? 'Saving...' : pkg ? 'Save & Close' : 'Save & Continue'}
          </Button>
        </div>

        {/* Details + cover */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pkg-name" className="text-sm text-muted-foreground">
                Package Name
              </Label>
              <Input
                id="pkg-name"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Fascinating"
                required
                className="rounded-lg border-0 bg-[#efedf0] focus-visible:ring-brand"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pkg-description" className="text-sm text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="pkg-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A cinematic experience featuring high-end storytelling..."
                rows={5}
                className="rounded-lg border-0 bg-[#efedf0] focus-visible:ring-brand"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#d9d6dc]">
              {coverUrl ? (
                <img src={coverUrl} alt="Package cover" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="size-10 text-white" />
                </div>
              )}
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-brand/30 bg-white px-4 text-xs font-bold text-brand shadow-md hover:bg-brand/5"
              >
                {coverUrl ? 'Change Cover' : 'Upload Photos'}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setNewImages(Array.from(e.target.files ?? []))}
            />
            {newImages.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {newImages.length} new photo(s) selected
                {pkg && pkg.images.length > 0 && ' — will replace existing photos on save'}
              </p>
            ) : (
              pkg &&
              pkg.images.length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {pkg.images.slice(1).map((image) => (
                    <img
                      key={image.key}
                      src={image.url}
                      alt={pkg.packageName}
                      className="size-12 rounded-md border border-border object-cover"
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {pkg ? (
          <>
            <hr className="border-[#e8e2ee]" />

            {/* Inclusions */}
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-muted-foreground">Inclusions</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInclusionForm((v) => !v)}
                  className="gap-1.5 rounded-full border-[#d9d3e0] px-4 text-xs font-bold text-[#3d3546] hover:bg-[#f7f4f9]"
                >
                  <PlusCircle className="size-4" />
                  Add Inclusion
                </Button>
              </div>

              {showInclusionForm && (
                <div className="flex flex-wrap items-end gap-2 rounded-xl bg-[#f7f4f9] p-3">
                  <div className="w-56 space-y-1">
                    <Label htmlFor="pkg-inclusion-type" className="text-xs text-muted-foreground">
                      Type
                    </Label>
                    <Input
                      id="pkg-inclusion-type"
                      list="inclusion-type-suggestions"
                      value={inclusionType}
                      onChange={(e) => setInclusionType(e.target.value)}
                      placeholder="Reception Styling"
                      className="bg-white"
                    />
                    <datalist id="inclusion-type-suggestions">
                      {typeSuggestions.map((type) => (
                        <option key={type} value={type} />
                      ))}
                    </datalist>
                  </div>
                  <div className="min-w-40 flex-1 space-y-1">
                    <Label htmlFor="pkg-inclusion" className="text-xs text-muted-foreground">
                      Inclusion
                    </Label>
                    <Input
                      id="pkg-inclusion"
                      value={inclusionText}
                      onChange={(e) => setInclusionText(e.target.value)}
                      placeholder="Entrance Tunnel, Elegant Backdrop..."
                      className="bg-white"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addInclusionMutation.mutate()}
                    disabled={
                      !inclusionType.trim() ||
                      !inclusionText.trim() ||
                      addInclusionMutation.isPending
                    }
                    className="gap-1 rounded-full bg-brand px-4 text-xs font-bold text-white hover:bg-brand"
                  >
                    <Plus className="size-4" />
                    Add
                  </Button>
                </div>
              )}

              {inclusionGroups.length === 0 && !showInclusionForm && (
                <p className="text-sm text-muted-foreground">No inclusions yet.</p>
              )}

              {inclusionGroups.map((group) => (
                <div key={group.type} className="overflow-hidden rounded-lg">
                  <div className="bg-[#171117] px-4 py-2.5 text-sm font-bold text-white">
                    {group.type}
                  </div>
                  <ul className="space-y-1 bg-[#f3f0f5] px-4 py-3">
                    {group.items.map((item) => (
                      <li key={item.id} className="flex items-start justify-between gap-2 text-sm">
                        <span className="text-[#2d2433]">• {item.inclusion}</span>
                        <button
                          type="button"
                          aria-label="Remove inclusion"
                          onClick={() => deleteInclusionMutation.mutate(item.id)}
                          disabled={deleteInclusionMutation.isPending}
                          className="shrink-0 text-[#9b93a5] transition-colors hover:text-brand"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Pax tiers */}
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-muted-foreground">Pax Tiers</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPaxForm((v) => !v)}
                  className="gap-1.5 rounded-full border-[#d9d3e0] px-4 text-xs font-bold text-[#3d3546] hover:bg-[#f7f4f9]"
                >
                  <PlusCircle className="size-4" />
                  Add Tier
                </Button>
              </div>

              {showPaxForm && (
                <div className="flex flex-wrap items-end gap-2 rounded-xl bg-[#f7f4f9] p-3">
                  <div className="w-24 space-y-1">
                    <Label htmlFor="pkg-pax" className="text-xs text-muted-foreground">
                      Pax
                    </Label>
                    <Input
                      id="pkg-pax"
                      type="number"
                      min="1"
                      value={paxCount}
                      onChange={(e) => setPaxCount(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="w-32 space-y-1">
                    <Label htmlFor="pkg-pax-price" className="text-xs text-muted-foreground">
                      Price (₱)
                    </Label>
                    <Input
                      id="pkg-pax-price"
                      type="number"
                      min="0"
                      value={paxPrice}
                      onChange={(e) => setPaxPrice(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="min-w-32 flex-1 space-y-1">
                    <Label htmlFor="pkg-pax-note" className="text-xs text-muted-foreground">
                      Note
                    </Label>
                    <Input
                      id="pkg-pax-note"
                      value={paxNote}
                      onChange={(e) => setPaxNote(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addPaxMutation.mutate()}
                    disabled={!paxCount || !paxPrice || addPaxMutation.isPending}
                    className="gap-1 rounded-full bg-brand px-4 text-xs font-bold text-white hover:bg-brand"
                  >
                    <Plus className="size-4" />
                    Add
                  </Button>
                </div>
              )}

              {(pkg.pax ?? []).length === 0 && !showPaxForm ? (
                <p className="text-sm text-muted-foreground">No pax tiers yet.</p>
              ) : (
                <ul className="space-y-1.5">
                  {(pkg.pax ?? []).map((tier) => (
                    <li
                      key={tier.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-[#f3f0f5] px-4 py-2.5 text-sm"
                    >
                      <span className="text-[#2d2433]">
                        <span className="font-bold">{tier.pax} pax</span> — ₱
                        {tier.paxPrice.toLocaleString()}
                        {tier.note ? ` (${tier.note})` : ''}
                      </span>
                      <button
                        type="button"
                        aria-label="Remove pax tier"
                        onClick={() => deletePaxMutation.mutate(tier.id)}
                        disabled={deletePaxMutation.isPending}
                        className="shrink-0 text-[#9b93a5] transition-colors hover:text-brand"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Save the package to start adding inclusions and pax tiers.
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </DialogContent>
  );
}

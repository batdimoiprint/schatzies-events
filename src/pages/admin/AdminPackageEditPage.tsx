import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, PlusCircle, Trash2, Plus, Sparkles, LayoutList, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { compressImage } from '@/utils/image-compression';
import {
  INCLUSION_TYPE_SUGGESTIONS,
  addPackageInclusion,
  addPackagePax,
  deletePackageInclusion,
  deletePackagePax,
  getPackageById,
  getPackages,
  updatePackage,
  type EventPackage,
  type EventType,
  type PackageInclusion,
  type PackageImage,
} from '@/api/packages';
import { toSlug } from '@/utils/package-display';

export function AdminPackageEditPage() {
  const { eventType, packageSlug } = useParams();
  const apiEventType: EventType = eventType === 'debut' ? 'Debut' : 'Wedding';

  // 1. Resolve package by matching slug from package list
  const { data: allPackages = [], isLoading: listLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', apiEventType],
    queryFn: () => getPackages(apiEventType),
  });

  const matched = allPackages.find((p) => toSlug(p.packageName) === packageSlug) ?? null;

  // 2. Fetch full package details
  const { data: pkg, isLoading: detailLoading, refetch } = useQuery<EventPackage | null>({
    queryKey: ['packages', 'detail', matched?.id],
    queryFn: () => getPackageById(matched!.id),
    enabled: !!matched?.id,
  });

  if (listLoading || (matched && detailLoading)) {
    return <LoadingScreen />;
  }

  if (!matched || !pkg) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Package not found.</p>
      </div>
    );
  }

  return (
    <PackageEditForm
      key={pkg.id}
      pkg={pkg}
      eventType={eventType ?? ''}
      packageSlug={packageSlug ?? ''}
      apiEventType={apiEventType}
      refetch={refetch}
    />
  );
}

interface PackageEditFormProps {
  pkg: EventPackage;
  eventType: string;
  packageSlug: string;
  apiEventType: EventType;
  refetch: () => void;
}

function PackageEditForm({ pkg, eventType, packageSlug, apiEventType, refetch }: PackageEditFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Local state initialized directly from props
  const [packageName, setPackageName] = useState(pkg.packageName);
  const [description, setDescription] = useState(pkg.description ?? '');
  const [existingImages, setExistingImages] = useState<PackageImage[]>(pkg.images ?? []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Inclusion drafting
  const [showInclusionForm, setShowInclusionForm] = useState(false);
  const [inclusionType, setInclusionType] = useState('');
  const [inclusionText, setInclusionText] = useState('');

  // Pax tier drafting
  const [showPaxForm, setShowPaxForm] = useState(false);
  const [paxCount, setPaxCount] = useState('');
  const [paxPrice, setPaxPrice] = useState('');
  const [paxNote, setPaxNote] = useState('');

  const handleAddFiles = async (files: File[]) => {
    const totalCount = existingImages.length + newImages.length + files.length;
    if (totalCount > 25) {
      setError('A package can have at most 25 pictures.');
      const availableSlots = 25 - (existingImages.length + newImages.length);
      if (availableSlots > 0) {
        const compressed = await Promise.all(files.slice(0, availableSlots).map((f) => compressImage(f)));
        setNewImages((prev) => [...prev, ...compressed]);
      }
      return;
    }
    setError(null);
    const compressed = await Promise.all(files.map((f) => compressImage(f)));
    setNewImages((prev) => [...prev, ...compressed]);
  };

  const makeNewCover = (index: number) => {
    setNewImages((prev) => {
      const next = [...prev];
      const [target] = next.splice(index, 1);
      return [target, ...next];
    });
  };

  const makeExistingCover = (index: number) => {
    setExistingImages((prev) => {
      const next = [...prev];
      const [target] = next.splice(index, 1);
      return [target, ...next];
    });
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['packages'] });
    refetch();
  };

  // MUTATIONS
  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        eventType: apiEventType,
        packageName: packageName.trim(),
        description: description.trim(),
        existingImages, // Passed to S3 manager to save remaining images
        images: newImages.length > 0 ? newImages : undefined, // New files to append
      };
      return updatePackage(pkg.id, payload);
    },
    onSuccess: () => {
      invalidate();
      setNewImages([]);
      // Redirect if package name changed (which changes slug)
      const nextSlug = toSlug(packageName);
      if (nextSlug !== packageSlug) {
        navigate(`/admin/event-packages/${eventType}/${nextSlug}`, { replace: true });
      }
      setError(null);
      alert('Package saved successfully!');
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to save package'),
  });

  const addInclusionMutation = useMutation({
    mutationFn: () =>
      addPackageInclusion(pkg.id, {
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
    mutationFn: (inclusionId: string) => deletePackageInclusion(pkg.id, inclusionId),
    onSuccess: invalidate,
  });

  const addPaxMutation = useMutation({
    mutationFn: () =>
      addPackagePax(pkg.id, {
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
    mutationFn: (paxId: string) => deletePackagePax(pkg.id, paxId),
    onSuccess: invalidate,
  });

  // Inclusions grouping
  const inclusionGroups: Array<{ type: string; items: PackageInclusion[] }> = [];
  for (const item of pkg.inclusions ?? []) {
    const group = inclusionGroups.find((g) => g.type === item.inclusionType);
    if (group) {
      group.items.push(item);
    } else {
      inclusionGroups.push({ type: item.inclusionType, items: [item] });
    }
  }

  const typeSuggestions = [
    ...new Set([...INCLUSION_TYPE_SUGGESTIONS, ...inclusionGroups.map((g) => g.type)]),
  ];

  const paxTiers = [...(pkg.pax ?? [])].sort((a, b) => a.pax - b.pax);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin?type=${eventType}`)}
            className="rounded-full text-brand-deep hover:bg-brand/5"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Edit {pkg.packageName}
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure details, inclusions, pricing, and photo gallery for this {apiEventType.toLowerCase()} package.
            </p>
          </div>
        </div>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={!packageName.trim() || saveMutation.isPending}
          className="rounded-xl bg-brand px-6 text-xs font-bold text-white shadow-md hover:bg-brand"
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* COLUMN 1: Basic Info & Pax Tiers */}
        <div className="space-y-6">
          {/* Card 1: Basic Info */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_4px_20px_rgba(61,32,82,0.04)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="size-5 text-brand" />
              <h3 className="text-base font-bold text-foreground">Basic Information</h3>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="pkg-name" className="text-xs text-muted-foreground">
                Package Name
              </Label>
              <Input
                id="pkg-name"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Package Name"
                className="rounded-lg border-0 bg-[#efedf0] focus-visible:ring-brand text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pkg-description" className="text-xs text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="pkg-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Package Description..."
                rows={5}
                className="rounded-lg border-0 bg-[#efedf0] focus-visible:ring-brand text-sm"
              />
            </div>
          </div>

          {/* Card 2: Pax Tiers */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_4px_20px_rgba(61,32,82,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <LayoutList className="size-5 text-brand" />
                <h3 className="text-base font-bold text-foreground">Pax Tiers</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPaxForm((v) => !v)}
                className="h-8 gap-1 rounded-full border-[#d9d3e0] px-3 text-xs font-bold text-[#3d3546] hover:bg-[#f7f4f9]"
              >
                <PlusCircle className="size-3.5" />
                Add Tier
              </Button>
            </div>

            {showPaxForm && (
              <div className="space-y-3 rounded-xl bg-[#f7f4f9] p-3 border border-dashed border-[#d9d3e0]">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="pkg-pax" className="text-[10px] text-muted-foreground">
                      Pax Count
                    </Label>
                    <Input
                      id="pkg-pax"
                      type="number"
                      min="1"
                      placeholder="100"
                      value={paxCount}
                      onChange={(e) => setPaxCount(e.target.value)}
                      className="bg-white h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pkg-pax-price" className="text-[10px] text-muted-foreground">
                      Price (₱)
                    </Label>
                    <Input
                      id="pkg-pax-price"
                      type="number"
                      min="0"
                      placeholder="150000"
                      value={paxPrice}
                      onChange={(e) => setPaxPrice(e.target.value)}
                      className="bg-white h-9 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pkg-pax-note" className="text-[10px] text-muted-foreground">
                    Note (Optional)
                  </Label>
                  <Input
                    id="pkg-pax-note"
                    placeholder="e.g. Excess ₱800/pax"
                    value={paxNote}
                    onChange={(e) => setPaxNote(e.target.value)}
                    className="bg-white h-9 text-xs"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addPaxMutation.mutate()}
                  disabled={!paxCount || !paxPrice || addPaxMutation.isPending}
                  className="w-full gap-1 rounded-lg bg-brand text-xs font-bold text-white hover:bg-brand"
                >
                  <Plus className="size-3.5" />
                  Add Pax Tier
                </Button>
              </div>
            )}

            {paxTiers.length === 0 && !showPaxForm ? (
              <p className="text-xs text-muted-foreground text-center py-4">No pax tiers configured yet.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {paxTiers.map((tier) => (
                  <li
                    key={tier.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-[#f8f6fa] p-3 text-xs border border-border"
                  >
                    <div>
                      <p className="font-bold text-[#2d2433]">{tier.pax} Guests</p>
                      <p className="font-medium text-brand mt-0.5">₱{tier.paxPrice.toLocaleString()}</p>
                      {tier.note && <p className="text-[10px] text-muted-foreground mt-0.5 italic">{tier.note}</p>}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove pax tier"
                      onClick={() => deletePaxMutation.mutate(tier.id)}
                      disabled={deletePaxMutation.isPending}
                      className="h-7 w-7 text-muted-foreground hover:text-brand hover:bg-brand/5"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* COLUMN 2: Inclusions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_4px_20px_rgba(61,32,82,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <LayoutList className="size-5 text-brand" />
                <h3 className="text-base font-bold text-foreground">Inclusions</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowInclusionForm((v) => !v)}
                className="h-8 gap-1 rounded-full border-[#d9d3e0] px-3 text-xs font-bold text-[#3d3546] hover:bg-[#f7f4f9]"
              >
                <PlusCircle className="size-3.5" />
                Add Inclusion
              </Button>
            </div>

            {showInclusionForm && (
              <div className="space-y-3 rounded-xl bg-[#f7f4f9] p-3 border border-dashed border-[#d9d3e0]">
                <div className="space-y-1">
                  <Label htmlFor="pkg-inclusion-type" className="text-[10px] text-muted-foreground">
                    Category Type
                  </Label>
                  <Input
                    id="pkg-inclusion-type"
                    list="inclusion-type-suggestions"
                    value={inclusionType}
                    onChange={(e) => setInclusionType(e.target.value)}
                    placeholder="e.g. Media & Glamour"
                    className="bg-white h-9 text-xs"
                  />
                  <datalist id="inclusion-type-suggestions">
                    {typeSuggestions.map((type) => (
                      <option key={type} value={type} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pkg-inclusion" className="text-[10px] text-muted-foreground">
                    Inclusion Detail
                  </Label>
                  <Input
                    id="pkg-inclusion"
                    value={inclusionText}
                    onChange={(e) => setInclusionText(e.target.value)}
                    placeholder="e.g. 1 Photographer & 2 Videographers"
                    className="bg-white h-9 text-xs"
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
                  className="w-full gap-1 rounded-lg bg-brand text-xs font-bold text-white hover:bg-brand"
                >
                  <Plus className="size-3.5" />
                  Add Inclusion
                </Button>
              </div>
            )}

            {inclusionGroups.length === 0 && !showInclusionForm ? (
              <p className="text-xs text-muted-foreground text-center py-4">No inclusions configured yet.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {inclusionGroups.map((group) => (
                  <div key={group.type} className="overflow-hidden rounded-xl border border-border">
                    <div className="bg-[#171117] px-3.5 py-2 text-xs font-bold text-white">
                      {group.type}
                    </div>
                    <ul className="divide-y divide-[#e8e2ee] bg-[#f8f6fa] px-3.5 py-1">
                      {group.items.map((item) => (
                        <li key={item.id} className="flex items-start justify-between gap-2 py-2 text-xs">
                          <span className="text-[#2d2433] leading-relaxed">• {item.inclusion}</span>
                          <button
                            type="button"
                            aria-label="Remove inclusion"
                            onClick={() => deleteInclusionMutation.mutate(item.id)}
                            disabled={deleteInclusionMutation.isPending}
                            className="shrink-0 text-[#9b93a5] hover:text-brand transition-colors p-1"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: Pictures / Gallery */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_4px_20px_rgba(61,32,82,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-5 text-brand" />
                <h3 className="text-base font-bold text-foreground">Pictures Gallery</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => galleryInputRef.current?.click()}
                className="h-8 gap-1 rounded-full border-[#d9d3e0] px-3 text-xs font-bold text-[#3d3546] hover:bg-[#f7f4f9]"
              >
                <PlusCircle className="size-3.5" />
                Upload ({existingImages.length + newImages.length}/25)
              </Button>
            </div>

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                handleAddFiles(files);
              }}
            />

            {/* Gallery images preview list */}
            {existingImages.length === 0 && newImages.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No photos uploaded. Click upload above to add pictures.</p>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] text-muted-foreground">
                  The first image in the grid acts as the package cover. Click <strong>Set Cover</strong> to select another.
                </p>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                  {/* Render existing S3 images first */}
                  {existingImages.map((image, i) => (
                    <div key={image.key} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-[#f8f6fa]">
                      <img
                        src={image.url}
                        alt={`S3 Image ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {i === 0 ? (
                        <span className="absolute bottom-0 inset-x-0 bg-gold/90 py-0.5 text-center font-sans text-[9px] font-bold text-ink uppercase">
                          Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => makeExistingCover(i)}
                          className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center font-sans text-[8px] font-bold text-white/90 uppercase opacity-0 transition-opacity hover:bg-gold hover:text-ink group-hover:opacity-100 cursor-pointer"
                        >
                          Set Cover
                        </button>
                      )}
                      {/* Delete button for S3 image */}
                      <button
                        type="button"
                        aria-label="Delete existing picture"
                        onClick={() => {
                          if (confirm('Delete this picture? You will need to save the page to apply the deletion.')) {
                            setExistingImages((prev) => prev.filter((img) => img.key !== image.key));
                          }
                        }}
                        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow transition-colors hover:text-brand"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}

                  {/* Render newly added local images */}
                  {newImages.map((file, i) => {
                    const src = URL.createObjectURL(file);
                    // Absolute index including existingImages
                    const idx = existingImages.length + i;
                    return (
                      <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-[#d9d6dc]">
                        <img
                          src={src}
                          alt={`Local Image ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {idx === 0 ? (
                          <span className="absolute bottom-0 inset-x-0 bg-brand/90 py-0.5 text-center font-sans text-[9px] font-bold text-white uppercase">
                            Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => makeNewCover(i)}
                            className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center font-sans text-[8px] font-bold text-white/90 uppercase opacity-0 transition-opacity hover:bg-brand/90 group-hover:opacity-100 cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label="Remove local picture"
                          onClick={() => setNewImages((prev) => prev.filter((_, index) => index !== i))}
                          className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:text-brand"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

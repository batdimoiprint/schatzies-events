import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  Plus,
  Sparkles,
  LayoutList,
  Image as ImageIcon,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { compressImage } from '@/utils/image-compression';
import {
  addPackagePax,
  deletePackagePax,
  getPackageById,
  getPackages,
  updatePackage,
  type EventPackage,
  type EventType,
  type PackageImage,
} from '@/api/packages';
import { toSlug } from '@/utils/package-display';
import { ReorderableInclusionsManager } from '@/components/admin/business-profile/ReorderableInclusionsManager';

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

function PackageEditForm({
  pkg,
  eventType,
  packageSlug,
  apiEventType,
  refetch,
}: PackageEditFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const replaceExistingInputRef = useRef<HTMLInputElement>(null);
  const replaceNewInputRef = useRef<HTMLInputElement>(null);

  const [replaceExistingTargetIndex, setReplaceExistingTargetIndex] = useState<number | null>(null);
  const [replaceNewTargetIndex, setReplaceNewTargetIndex] = useState<number | null>(null);
  const [draggedExistingIndex, setDraggedExistingIndex] = useState<number | null>(null);
  const [draggedNewIndex, setDraggedNewIndex] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'basic' | 'inclusions' | 'gallery'>('basic');

  // Local state initialized directly from props
  const [packageName, setPackageName] = useState(pkg.packageName);
  const [description, setDescription] = useState(pkg.description ?? '');
  const [existingImages, setExistingImages] = useState<PackageImage[]>(pkg.images ?? []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Lightbox Preview state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openAdminLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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
        const compressed = await Promise.all(
          files.slice(0, availableSlots).map((f) => compressImage(f))
        );
        setNewImages((prev) => [...prev, ...compressed]);
      }
      return;
    }
    setError(null);
    const compressed = await Promise.all(files.map((f) => compressImage(f)));
    setNewImages((prev) => [...prev, ...compressed]);
  };

  const handleReplaceExistingFile = async (file: File) => {
    if (replaceExistingTargetIndex === null) return;
    try {
      const compressed = await compressImage(file);
      const targetIndex = replaceExistingTargetIndex;
      setExistingImages((prev) => prev.filter((_, idx) => idx !== targetIndex));
      setNewImages((prev) => [compressed, ...prev]);
      setError(null);
    } catch {
      setError('Failed to compress replacement photo');
    } finally {
      setReplaceExistingTargetIndex(null);
    }
  };

  const handleReplaceNewFile = async (file: File) => {
    if (replaceNewTargetIndex === null) return;
    try {
      const compressed = await compressImage(file);
      const targetIndex = replaceNewTargetIndex;
      setNewImages((prev) => {
        const updated = [...prev];
        updated[targetIndex] = compressed;
        return updated;
      });
      setError(null);
    } catch {
      setError('Failed to compress replacement photo');
    } finally {
      setReplaceNewTargetIndex(null);
    }
  };

  const moveExistingImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= existingImages.length) return;
    setExistingImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const moveNewImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= newImages.length) return;
    setNewImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const makeNewCover = (index: number) => moveNewImage(index, 0);
  const makeExistingCover = (index: number) => moveExistingImage(index, 0);

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
        existingImages, // Passed to backend in reordered sequence
        images: newImages.length > 0 ? newImages : undefined,
      };
      return updatePackage(pkg.id, payload);
    },
    onSuccess: () => {
      invalidate();
      setNewImages([]);
      const nextSlug = toSlug(packageName);
      if (nextSlug !== packageSlug) {
        navigate(`/admin/event-packages/${eventType}/${nextSlug}`, { replace: true });
      }
      setError(null);
      alert('Package saved successfully!');
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to save package'),
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

  const paxTiers = [...(pkg.pax ?? [])].sort((a, b) => a.pax - b.pax);

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 px-2 py-4 sm:px-3 lg:px-4">
      {/* Full-screen Image Preview Lightbox */}
      <ImageLightbox
        images={[
          ...existingImages.map((img) => ({ url: img.url, title: `${packageName} (Saved S3 Photo)` })),
          ...newImages.map((img) => ({ url: URL.createObjectURL(img), title: `${packageName} (Pending Upload)` })),
        ]}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Hidden inputs for replacing photo files */}
      <input
        ref={replaceExistingInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReplaceExistingFile(file);
          e.target.value = '';
        }}
      />
      <input
        ref={replaceNewInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReplaceNewFile(file);
          e.target.value = '';
        }}
      />

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
              Configure details, inclusions, pricing, and photo gallery for this{' '}
              {apiEventType.toLowerCase()} package.
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

      {/* Headbar Tab Navigation */}
      <div className="flex border border-border bg-white rounded-2xl p-1.5 shadow-sm gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'basic'
              ? 'bg-brand text-white shadow-md'
              : 'text-muted-foreground hover:bg-brand/5 hover:text-brand'
          }`}
        >
          <Sparkles className="size-4 shrink-0" />
          <span>Basic Info & Pax Tiers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inclusions')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inclusions'
              ? 'bg-brand text-white shadow-md'
              : 'text-muted-foreground hover:bg-brand/5 hover:text-brand'
          }`}
        >
          <LayoutList className="size-4 shrink-0" />
          <span>Inclusions ({(pkg.inclusions ?? []).length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-brand text-white shadow-md'
              : 'text-muted-foreground hover:bg-brand/5 hover:text-brand'
          }`}
        >
          <ImageIcon className="size-4 shrink-0" />
          <span>Pictures Gallery ({existingImages.length + newImages.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: BASIC INFO & PAX TIERS */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                rows={6}
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
              <p className="text-xs text-muted-foreground text-center py-4">
                No pax tiers configured yet.
              </p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {paxTiers.map((tier) => (
                  <li
                    key={tier.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-[#f8f6fa] p-3 text-xs border border-border"
                  >
                    <div>
                      <p className="font-bold text-[#2d2433]">{tier.pax} Guests</p>
                      <p className="font-medium text-brand mt-0.5">
                        ₱{tier.paxPrice.toLocaleString()}
                      </p>
                      {tier.note && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 italic">
                          {tier.note}
                        </p>
                      )}
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
      )}

      {/* TAB CONTENT 2: INCLUSIONS */}
      {activeTab === 'inclusions' && (
        <div className="max-w-4xl mx-auto">
          <ReorderableInclusionsManager
            packageId={pkg.id}
            packageName={pkg.packageName}
            inclusions={pkg.inclusions ?? []}
            refetch={refetch}
          />
        </div>
      )}

      {/* TAB CONTENT 3: PICTURES GALLERY */}
      {activeTab === 'gallery' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_4px_20px_rgba(61,32,82,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-5 text-brand" />
                <div>
                  <h3 className="text-base font-bold text-foreground">Pictures Gallery</h3>
                  <p className="text-xs text-muted-foreground">
                    First photo acts as cover photo. Drag thumbnails or use arrows to reorder.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => galleryInputRef.current?.click()}
                className="h-9 gap-1.5 rounded-full border-[#d9d3e0] px-4 text-xs font-bold text-[#3d3546] hover:bg-[#f7f4f9]"
              >
                <PlusCircle className="size-4 text-brand" />
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
                e.target.value = '';
              }}
            />

            {/* Gallery images preview list with drag & drop + arrow reordering */}
            {existingImages.length === 0 && newImages.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-12">
                No photos uploaded. Click upload above to add pictures.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {/* Existing S3 images (Sortable) */}
                {existingImages.map((image, i) => (
                  <div
                    key={image.key}
                    draggable
                    onDragStart={() => setDraggedExistingIndex(i)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedExistingIndex !== null && draggedExistingIndex !== i) {
                        moveExistingImage(draggedExistingIndex, i);
                        setDraggedExistingIndex(i);
                      }
                    }}
                    onDragEnd={() => setDraggedExistingIndex(null)}
                    className={`group relative aspect-square overflow-hidden rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                      draggedExistingIndex === i
                        ? 'border-brand bg-brand/10 scale-95 opacity-50'
                        : 'border-border bg-[#f8f6fa] hover:border-brand/40'
                    }`}
                  >
                    <div
                      className="relative h-full w-full cursor-pointer group"
                      onClick={() => openAdminLightbox(i)}
                    >
                      <img
                        src={image.url}
                        alt={`S3 Image ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <span className="rounded-full bg-black/60 p-2 backdrop-blur-sm">
                          <ImageIcon className="size-4" />
                        </span>
                      </div>
                    </div>

                    {/* Reorder Arrows (Left / Right) */}
                    <div className="absolute left-1 top-1 flex gap-0.5 opacity-90 transition-opacity">
                      <button
                        type="button"
                        aria-label="Move left"
                        disabled={i === 0}
                        onClick={() => moveExistingImage(i, i - 1)}
                        className="flex size-5 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:text-brand disabled:opacity-30"
                      >
                        <ChevronLeft className="size-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move right"
                        disabled={i === existingImages.length - 1}
                        onClick={() => moveExistingImage(i, i + 1)}
                        className="flex size-5 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:text-brand disabled:opacity-30"
                      >
                        <ChevronRight className="size-3" />
                      </button>
                    </div>

                    {/* Cover Badge / Cover Button */}
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

                    {/* Action buttons (Replace & Delete) */}
                    <div className="absolute right-1 top-1 flex gap-1">
                      <button
                        type="button"
                        aria-label="Replace photo"
                        title="Replace photo"
                        onClick={() => {
                          setReplaceExistingTargetIndex(i);
                          replaceExistingInputRef.current?.click();
                        }}
                        className="flex size-5 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:text-brand"
                      >
                        <RefreshCw className="size-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete existing picture"
                        title="Delete picture"
                        onClick={() => {
                          if (
                            confirm('Delete this picture? Save changes to apply.')
                          ) {
                            setExistingImages((prev) =>
                              prev.filter((img) => img.key !== image.key)
                            );
                          }
                        }}
                        className="flex size-5 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow transition-colors hover:text-brand"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Newly added local images (Sortable) */}
                {newImages.map((file, i) => {
                  const src = URL.createObjectURL(file);
                  const idx = existingImages.length + i;
                  return (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => setDraggedNewIndex(i)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedNewIndex !== null && draggedNewIndex !== i) {
                          moveNewImage(draggedNewIndex, i);
                          setDraggedNewIndex(i);
                        }
                      }}
                      onDragEnd={() => setDraggedNewIndex(null)}
                      className={`group relative aspect-square overflow-hidden rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                        draggedNewIndex === i
                          ? 'border-brand bg-brand/10 scale-95 opacity-50'
                          : 'border-border bg-[#d9d6dc] hover:border-brand/40'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Local Image ${i + 1}`}
                        className="h-full w-full object-cover pointer-events-none"
                      />

                      {/* Reorder Arrows (Left / Right) */}
                      <div className="absolute left-1 top-1 flex gap-0.5 opacity-90 transition-opacity">
                        <button
                          type="button"
                          aria-label="Move left"
                          disabled={i === 0}
                          onClick={() => moveNewImage(i, i - 1)}
                          className="flex size-5 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:text-brand disabled:opacity-30"
                        >
                          <ChevronLeft className="size-3" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move right"
                          disabled={i === newImages.length - 1}
                          onClick={() => moveNewImage(i, i + 1)}
                          className="flex size-5 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:text-brand disabled:opacity-30"
                        >
                          <ChevronRight className="size-3" />
                        </button>
                      </div>

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
                      <div className="absolute right-1 top-1 flex gap-1">
                        <button
                          type="button"
                          aria-label="Replace photo"
                          title="Replace photo"
                          onClick={() => {
                            setReplaceNewTargetIndex(i);
                            replaceNewInputRef.current?.click();
                          }}
                          className="flex size-5 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:text-brand"
                        >
                          <RefreshCw className="size-3" />
                        </button>
                        <button
                          type="button"
                          aria-label="Remove local picture"
                          title="Delete picture"
                          onClick={() =>
                            setNewImages((prev) => prev.filter((_, index) => index !== i))
                          }
                          className="flex size-5 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:text-brand"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

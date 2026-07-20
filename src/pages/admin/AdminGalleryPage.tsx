import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  EVENT_TYPES,
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
  type EventPackage,
  type EventType,
} from '@/api/packages';
import { formatPackageDate } from '@/components/admin/business-profile/format';
import { ImageLightbox } from '@/components/ui/ImageLightbox';

export function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [activeType, setActiveType] = useState<EventType>('Wedding');
  const [albumDialog, setAlbumDialog] = useState<{ pkg: EventPackage | null } | null>(null);
  const [viewingAlbum, setViewingAlbum] = useState<EventPackage | null>(null);

  // Lightbox state for Admin Gallery
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: packages = [], isLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', activeType],
    queryFn: () => getPackages(activeType),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
  });

  // Group albums (packages) by year added, newest year first
  const yearGroups = useMemo(() => {
    const byYear = new Map<string, EventPackage[]>();
    for (const pkg of packages) {
      const date = new Date(pkg.createdAt ?? '');
      const year = Number.isNaN(date.getTime()) ? 'Undated' : String(date.getFullYear());
      byYear.set(year, [...(byYear.get(year) ?? []), pkg]);
    }
    return [...byYear.entries()].sort(([a], [b]) => {
      if (a === 'Undated') return 1;
      if (b === 'Undated') return -1;
      return b.localeCompare(a);
    });
  }, [packages]);

  const openAdminGalleryLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Lightbox for Admin Album Photos */}
      {viewingAlbum && (
        <ImageLightbox
          images={viewingAlbum.images.map((img) => ({
            url: img.url,
            title: viewingAlbum.packageName,
          }))}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
        <p className="text-sm text-muted-foreground">Photo albums for each event package</p>
      </div>

      {/* Tabs + Add Album */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-8 px-2">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`pb-1 text-base font-bold transition-colors ${
                activeType === type
                  ? 'border-b-2 border-brand text-brand'
                  : 'text-muted-foreground hover:text-[#3d3546]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <Button
          onClick={() => setAlbumDialog({ pkg: null })}
          className="gap-1.5 rounded-full bg-brand px-5 text-xs font-bold text-white shadow-md hover:bg-brand"
        >
          <PlusCircle className="size-4" />
          Add Album
        </Button>
      </div>

      {/* Albums grouped by year */}
      <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(61,32,82,0.08)] sm:p-6 lg:p-6">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading gallery...</p>
        ) : yearGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand/5">
              <ImageIcon className="size-8 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              No {activeType.toLowerCase()} albums yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Click "Add Album" to create a package album with photos.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {yearGroups.map(([year, albums]) => (
              <section key={year}>
                <h2 className="font-heading mb-5 text-2xl font-bold text-foreground">{year}</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {albums.map((album) => (
                    <div
                      key={album.id}
                      className="flex flex-col rounded-2xl border border-border bg-white p-3 shadow-[0_4px_14px_rgba(61,32,82,0.08)]"
                    >
                      <button
                        type="button"
                        onClick={() => setViewingAlbum(album)}
                        aria-label={`View ${album.packageName} photos`}
                        className="block overflow-hidden rounded-xl"
                      >
                        {album.images.length > 0 ? (
                          <img
                            src={album.images[0].url}
                            alt={album.packageName}
                            loading="lazy"
                            className="aspect-[4/3] w-full object-cover transition-transform duration-200 hover:scale-105"
                          />
                        ) : (
                          <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#f3f0f5]">
                            <ImageIcon className="size-8 text-[#cfc6d8]" />
                          </div>
                        )}
                      </button>
                      <p className="mt-2.5 truncate text-center text-sm font-semibold text-[#3d3546]">
                        {album.packageName}
                      </p>
                      <p className="text-center text-xs text-muted-foreground">
                        {formatPackageDate(album.createdAt)}
                      </p>
                      <div className="mt-1.5 flex justify-end gap-1.5">
                        <button
                          type="button"
                          aria-label={`Edit ${album.packageName} album`}
                          onClick={() => setAlbumDialog({ pkg: album })}
                          className="flex size-7 items-center justify-center rounded-full bg-brand text-white shadow transition-colors hover:bg-brand"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${album.packageName} album`}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete album "${album.packageName}"? This deletes the package and its photos.`
                              )
                            ) {
                              deleteMutation.mutate(album.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="flex size-7 items-center justify-center rounded-full bg-brand text-white shadow transition-colors hover:bg-brand"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit album */}
      {albumDialog && (
        <AlbumDialog
          eventType={activeType}
          pkg={albumDialog.pkg}
          onClose={() => setAlbumDialog(null)}
        />
      )}

      {/* Photo viewer */}
      <Dialog open={viewingAlbum !== null} onOpenChange={(open) => !open && setViewingAlbum(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:max-w-3xl sm:p-8">
          {viewingAlbum && (
            <>
              <DialogTitle className="font-heading text-2xl font-bold text-foreground">
                {viewingAlbum.packageName}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {viewingAlbum.eventType} · {formatPackageDate(viewingAlbum.createdAt)} ·{' '}
                {viewingAlbum.images.length} photo(s)
              </DialogDescription>
              {viewingAlbum.images.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No photos in this album yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {viewingAlbum.images.map((image, i) => (
                    <div
                      key={image.key}
                      onClick={() => openAdminGalleryLightbox(i)}
                      className="block overflow-hidden rounded-xl border border-border cursor-pointer group relative"
                    >
                      <img
                        src={image.url}
                        alt={viewingAlbum.packageName}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Expand
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Add / Edit album dialog (design: Add Album modal) ── */

interface AlbumDialogProps {
  eventType: EventType;
  /** Album (package) being edited; null means create mode */
  pkg: EventPackage | null;
  onClose: () => void;
}

function AlbumDialog({ eventType, pkg, onClose }: AlbumDialogProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [albumName, setAlbumName] = useState(pkg?.packageName ?? '');
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const coverPreview = useMemo(
    () => (photos.length > 0 ? URL.createObjectURL(photos[0]) : null),
    [photos]
  );
  const coverUrl = coverPreview ?? pkg?.images[0]?.url ?? null;

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        packageName: albumName.trim(),
        images: photos.length > 0 ? photos : undefined,
        existingImages: photos.length > 0 ? [] : undefined, // Clears old images so new ones replace them
      };
      return pkg ? updatePackage(pkg.id, payload) : createPackage({ ...payload, eventType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      onClose();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Unable to save album'),
  });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl p-6 sm:max-w-lg sm:p-8">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <DialogTitle className="font-heading text-2xl font-bold text-foreground">
                {pkg ? 'Edit Album' : 'Add Album'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {pkg
                  ? 'Update album name and photos.'
                  : `Create a new ${eventType.toLowerCase()} album with photos.`}
              </DialogDescription>
            </div>
            <Button
              type="submit"
              disabled={!albumName.trim() || saveMutation.isPending}
              className="rounded-full bg-brand px-5 text-xs font-bold text-white shadow-md hover:bg-brand"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save & Close'}
            </Button>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#d9d6dc]">
            {coverUrl ? (
              <img src={coverUrl} alt="Album cover" className="h-full w-full object-cover" />
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
              Upload Photo
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
          />
          {photos.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {photos.length} photo(s) selected
              {pkg && pkg.images.length > 0 && ' — will replace existing photos on save'}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="album-name" className="text-sm text-muted-foreground">
              Album Name
            </Label>
            <Input
              id="album-name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Josephine & Juanito"
              required
              className="rounded-lg border-0 bg-[#efedf0] focus-visible:ring-brand"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

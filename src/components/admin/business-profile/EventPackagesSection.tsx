import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, PlusCircle, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  EVENT_TYPES,
  deletePackage,
  getPackageById,
  getPackages,
  type EventPackage,
  type EventType,
} from '@/api/packages';
import { PackageFormDialog } from './PackageFormDialog';
import { formatPackageDate } from './format';

const EVENT_TYPE_BANNERS: Record<EventType, string> = {
  Wedding: '/Pictures/service-wedding.jpg',
  Debut: '/Pictures/service-debut.jpg',
};

export function EventPackagesSection() {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: packages = [], isLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', selectedType],
    queryFn: () => getPackages(selectedType ?? undefined),
    enabled: selectedType !== null,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
  });

  // The list endpoint returns metadata only; fetch the full package (with pax
  // tiers and inclusions) for the edit dialog. Refetches on cache invalidation.
  const { data: editingPackage = null } = useQuery<EventPackage | null>({
    queryKey: ['packages', 'detail', editingId],
    queryFn: () => getPackageById(editingId!),
    enabled: editingId !== null,
  });

  const openCreate = () => {
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (pkg: EventPackage) => {
    setEditingId(pkg.id);
    setDialogOpen(true);
  };

  /* ── Event type banners (Wedding / Debut) ── */
  if (selectedType === null) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(61,32,82,0.08)] sm:p-8 lg:p-10">
        <div className="space-y-6">
          {EVENT_TYPES.map((type) => (
            <div
              key={type}
              className="group relative h-44 overflow-hidden rounded-2xl shadow-md sm:h-52"
            >
              <img
                src={EVENT_TYPE_BANNERS[type]}
                alt={`${type} events`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
              <h2 className="font-heading absolute left-6 top-5 text-3xl font-bold text-white drop-shadow-md sm:left-8 sm:text-4xl">
                {type}
              </h2>
              <Button
                onClick={() => setSelectedType(type)}
                className="absolute bottom-4 right-4 rounded-lg bg-white px-5 text-xs font-bold text-brand shadow-md hover:bg-brand/5 sm:bottom-5 sm:right-6"
              >
                View Event
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Package list table ── */
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(61,32,82,0.08)] sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to event types"
            onClick={() => setSelectedType(null)}
            className="mt-1 size-9 rounded-full text-brand-deep hover:bg-brand/5"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {selectedType} Packages
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your {selectedType.toLowerCase()} event packages
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="gap-1.5 rounded-full bg-brand px-5 text-xs font-bold text-white shadow-md hover:bg-brand"
        >
          <PlusCircle className="size-4" />
          Add Package
        </Button>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading packages...</p>
      ) : packages.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No {selectedType.toLowerCase()} packages yet. Click "Add Package" to create the first one.
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#d9d3e0] text-left text-sm font-medium text-muted-foreground">
              <th className="py-2.5 pl-3 font-medium">Package Name</th>
              <th className="hidden py-2.5 text-center font-medium sm:table-cell">Date Added</th>
              <th className="py-2.5 pr-3 text-right font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr
                key={pkg.id}
                className="border-b border-[#e8e2ee] transition-colors hover:bg-[#fdeef6]"
              >
                <td className="py-3.5 pl-3">
                  <p className="text-lg font-bold text-brand">{pkg.packageName}</p>
                  {pkg.description && (
                    <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-[#5d5566]">
                      {pkg.description}
                    </p>
                  )}
                </td>
                <td className="hidden py-3.5 text-center text-sm text-[#3d3546] sm:table-cell">
                  {formatPackageDate(pkg.createdAt)}
                </td>
                <td className="py-3.5 pr-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${pkg.packageName}`}
                      onClick={() => openEdit(pkg)}
                      className="size-9 rounded-full text-foreground/80 hover:bg-[#f0e8f5] hover:text-brand-deep"
                    >
                      <SquarePen className="size-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${pkg.packageName}`}
                      onClick={() => {
                        if (window.confirm(`Delete package "${pkg.packageName}"?`)) {
                          deleteMutation.mutate(pkg.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="size-9 rounded-full text-foreground/80 hover:bg-brand/5 hover:text-brand"
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <PackageFormDialog
        open={dialogOpen && (editingId === null || editingPackage !== null)}
        eventType={selectedType}
        pkg={editingPackage}
        onClose={() => {
          setDialogOpen(false);
          setEditingId(null);
        }}
        onCreated={(id) => setEditingId(id)}
      />
    </div>
  );
}

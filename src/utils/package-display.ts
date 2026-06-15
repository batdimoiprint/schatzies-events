import type { EventPackage, PackageInclusion } from '@/api/packages';
import type { IconName, InclusionCategory } from '@/components/PackageModal';
import type { PackageItem } from '@/components/PackageCard';

/** Fallback image when a package has no uploaded images. */
export const PLACEHOLDER_PACKAGE_IMAGE = '/Pictures/packages-hero.jpg';

/** Resolve the nth package image, falling back to the first image then a placeholder. */
export function packageImage(pkg: EventPackage, index = 0): string {
  const images = pkg.images ?? [];
  return images[index]?.url ?? images[0]?.url ?? PLACEHOLDER_PACKAGE_IMAGE;
}

const ICON_ORDER: IconName[] = ['user', 'utensils', 'scissors', 'video'];

/** Map a free-form inclusion category to one of the four design icons. */
function iconForType(type: string, index: number): IconName {
  const t = type.toLowerCase();
  if (/(coordinat|planner|staff|team|emcee|host|service)/.test(t)) return 'user';
  if (/(cater|dining|food|buffet|bar|drink|beverage|menu)/.test(t)) return 'utensils';
  if (/(styl|production|setup|decor|design|backdrop|light|stage|floral)/.test(t))
    return 'scissors';
  if (/(media|photo|video|glam|makeup|film|album|coverage)/.test(t)) return 'video';
  return ICON_ORDER[index % ICON_ORDER.length];
}

/**
 * Group the API's flat inclusion list into the category shape the design renders,
 * keyed by inclusionType and preserving first-seen order.
 */
export function groupInclusions(inclusions: PackageInclusion[] = []): InclusionCategory[] {
  const groups = new Map<string, string[]>();
  for (const inc of inclusions) {
    const key = inc.inclusionType?.trim() || 'Inclusions';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(inc.inclusion);
  }
  return Array.from(groups.entries()).map(([title, items], i) => ({
    iconName: iconForType(title, i),
    title,
    items,
  }));
}

function formatPHP(value: number): string {
  return `₱${value.toLocaleString()}`;
}

/** Build the NOTE line from pax pricing tiers, with a sensible fallback. */
export function buildPackageNote(pkg: EventPackage): string {
  const pax = (pkg.pax ?? []).filter((tier) => typeof tier.paxPrice === 'number');
  if (pax.length) {
    const sorted = [...pax].sort((a, b) => (a.pax || 0) - (b.pax || 0));
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range =
      min.pax === max.pax ? `${min.pax} guests` : `${min.pax}–${max.pax} guests`;
    return `Available for ${range}, starting at ${formatPHP(min.paxPrice)}. Contact us to tailor this package to your celebration.`;
  }
  return 'Contact us for full pricing and to tailor this package to your celebration.';
}

/** Convert a package name to a URL-safe slug. */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Deterministic display order (oldest first) shared by the list and detail navigation. */
export function sortPackages(pkgs: EventPackage[]): EventPackage[] {
  return [...pkgs].sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
}

export interface GalleryItem {
  key: string;
  url: string;
  title: string;
}

/**
 * Flatten the images of every package into gallery cards, titled by their album
 * (package) name. Packages are shown oldest-first; images keep their order.
 */
export function toGalleryItems(pkgs: EventPackage[]): GalleryItem[] {
  return sortPackages(pkgs).flatMap((pkg) =>
    (pkg.images ?? []).map((image) => ({
      key: image.key,
      url: image.url,
      title: pkg.packageName,
    }))
  );
}

/** Map an API package to the lightweight card shape used by the carousels. */
export function toCardItem(pkg: EventPackage): PackageItem {
  return {
    id: pkg.id,
    name: pkg.packageName,
    description: pkg.description ?? '',
    image: packageImage(pkg, 0),
  };
}

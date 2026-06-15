import { EventPackagesSection } from '@/components/admin/business-profile/EventPackagesSection';

export function PackageManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Event Packages</h1>
        <p className="text-sm text-muted-foreground">
          Manage wedding and debut packages, inclusions, and pricing
        </p>
      </div>

      <EventPackagesSection />
    </div>
  );
}

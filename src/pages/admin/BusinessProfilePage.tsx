import { BusinessInfoSection } from '@/components/admin/business-profile/BusinessInfoSection';

export function BusinessProfilePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Business Profile</h1>
        <p className="text-sm text-muted-foreground">Manage business information</p>
      </div>

      <BusinessInfoSection />
    </div>
  );
}

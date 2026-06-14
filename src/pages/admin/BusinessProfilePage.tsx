import { useState } from 'react';
import { BusinessInfoSection } from '@/components/admin/business-profile/BusinessInfoSection';
import { EventPackagesSection } from '@/components/admin/business-profile/EventPackagesSection';

type TabKey = 'info' | 'packages';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'info', label: 'Business Information' },
  { key: 'packages', label: 'Event Packages' },
];

export function BusinessProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('info');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Business Profile</h1>
        <p className="text-sm text-muted-foreground">Manage business information and event packages</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 px-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`pb-1 text-base font-bold transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-brand text-brand'
                : 'text-muted-foreground hover:text-[#3d3546]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'info' ? <BusinessInfoSection /> : <EventPackagesSection />}
    </div>
  );
}

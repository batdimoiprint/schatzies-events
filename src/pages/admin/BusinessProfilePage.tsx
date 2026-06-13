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
        <h1 className="text-2xl font-bold text-[#1d1320]">Business Profile</h1>
        <p className="text-sm text-[#7f7889]">Manage business information and event packages</p>
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
                ? 'border-b-2 border-[#df2b80] text-[#df2b80]'
                : 'text-[#7f7889] hover:text-[#3d3546]'
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

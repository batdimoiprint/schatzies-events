import { Lock, Mail, Share2, Shield, Users, HelpCircle, Clock } from 'lucide-react';

export function PrivacyPolicyContent() {
  const iconClass = "h-5 w-5 text-[#FF0066]";

  return (
    <div className="space-y-4">
      <section className="flex gap-3">
        <Lock className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Introduction</h3>
          <p className="text-sm">
            At Schatzies Events Management, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Users className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Information We Collect</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Personal information such as name, email address, phone number, and contact details</li>
            <li>Event-related information including event type, date, venue, and guest details</li>
            <li>Payment information for processing transactions</li>
            <li>Communication records and preferences</li>
          </ul>
        </div>
      </section>

      <section className="flex gap-3">
        <HelpCircle className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">How We Use Your Information</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>To provide and manage event planning services</li>
            <li>To communicate with you about your events and our services</li>
            <li>To process payments and maintain financial records</li>
            <li>To improve our services and customer experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </div>
      </section>

      <section className="flex gap-3">
        <Share2 className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Information Sharing</h3>
          <p className="text-sm">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or required by law. We may share information with trusted service providers who assist us in operating our business.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Shield className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Data Security</h3>
          <p className="text-sm">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Lock className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Your Rights</h3>
          <p className="text-sm">
            You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us using the information provided in our Contact page.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Mail className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Contact Us</h3>
          <p className="text-sm">
            If you have any questions about this Privacy Policy, please contact us at schatziesevents@gmail.com or through our Contact page.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Clock className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Updates to This Policy</h3>
          <p className="text-sm">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>
    </div>
  );
}

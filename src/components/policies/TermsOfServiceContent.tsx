import { CheckCircle, CreditCard, Trash2, AlertCircle, Zap, BookOpen, Gavel, Mail, RefreshCw } from 'lucide-react';

export function TermsOfServiceContent() {
  const iconClass = "h-5 w-5 text-[#FF0066]";

  return (
    <div className="space-y-4">
      <section className="flex gap-3">
        <CheckCircle className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Acceptance of Terms</h3>
          <p className="text-sm">
            By accessing and using Schatzies Events Management services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Zap className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Services</h3>
          <p className="text-sm">
            Schatzies Events Management provides event planning and management services including but not limited to wedding planning, debut events, corporate events, and other special occasions. Our services include consultation, planning, coordination, and execution of events.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <BookOpen className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Client Responsibilities</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Provide accurate and complete information for event planning</li>
            <li>Communicate changes or updates promptly</li>
            <li>Respect venue policies and local regulations</li>
            <li>Ensure timely payments as per agreed schedule</li>
            <li>Cooperate with our team for successful event execution</li>
          </ul>
        </div>
      </section>

      <section className="flex gap-3">
        <CreditCard className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Payment Terms</h3>
          <p className="text-sm">
            Clients agree to pay all fees as outlined in the service agreement. Payments are due according to the schedule specified. Late payments may result in service suspension or additional fees. All payments are non-refundable unless otherwise specified in writing.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Trash2 className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Cancellation Policy</h3>
          <p className="text-sm">
            Cancellation requests must be submitted in writing. Cancellation fees apply based on the timing of the cancellation relative to the event date. Deposits may be non-refundable depending on the circumstances and timing.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <AlertCircle className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Liability</h3>
          <p className="text-sm">
            Schatzies Events Management will exercise due diligence in planning and executing events. However, we are not liable for unforeseen circumstances, force majeure events, or issues caused by third parties. Our liability is limited to the amount paid for our services.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Zap className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Intellectual Property</h3>
          <p className="text-sm">
            All materials, concepts, and designs provided by Schatzies Events Management remain our intellectual property unless otherwise agreed upon in writing. Clients may not reproduce or distribute our proprietary materials without permission.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Gavel className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Governing Law</h3>
          <p className="text-sm">
            These terms are governed by the laws of the Philippines. Any disputes will be resolved through negotiation or legal proceedings in appropriate courts.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Mail className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Contact Information</h3>
          <p className="text-sm">
            For questions about these Terms of Service, please contact us at schatziesevents@gmail.com or through our Contact page.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <RefreshCw className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-[#3d2052] mb-2">Updates to Terms</h3>
          <p className="text-sm">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of the updated terms.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>
    </div>
  );
}

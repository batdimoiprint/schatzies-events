const TermsOfServicePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8d0e3] to-[#f5c3d9] py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-[#1a1225] mb-8 text-center">Terms of Service</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Acceptance of Terms</h2>
              <p className="text-[#3d2052] leading-relaxed">
                By accessing and using Schatzies Events Management services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Services</h2>
              <p className="text-[#3d2052] leading-relaxed">
                Schatzies Events Management provides event planning and management services including but not limited to wedding planning, debut events, corporate events, and other special occasions. Our services include consultation, planning, coordination, and execution of events.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Client Responsibilities</h2>
              <ul className="list-disc list-inside text-[#3d2052] leading-relaxed space-y-2">
                <li>Provide accurate and complete information for event planning</li>
                <li>Communicate changes or updates promptly</li>
                <li>Respect venue policies and local regulations</li>
                <li>Ensure timely payments as per agreed schedule</li>
                <li>Cooperate with our team for successful event execution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Payment Terms</h2>
              <p className="text-[#3d2052] leading-relaxed">
                Clients agree to pay all fees as outlined in the service agreement. Payments are due according to the schedule specified. Late payments may result in service suspension or additional fees. All payments are non-refundable unless otherwise specified in writing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Cancellation Policy</h2>
              <p className="text-[#3d2052] leading-relaxed">
                Cancellation requests must be submitted in writing. Cancellation fees apply based on the timing of the cancellation relative to the event date. Deposits may be non-refundable depending on the circumstances and timing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Liability</h2>
              <p className="text-[#3d2052] leading-relaxed">
                Schatzies Events Management will exercise due diligence in planning and executing events. However, we are not liable for unforeseen circumstances, force majeure events, or issues caused by third parties. Our liability is limited to the amount paid for our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Intellectual Property</h2>
              <p className="text-[#3d2052] leading-relaxed">
                All materials, concepts, and designs provided by Schatzies Events Management remain our intellectual property unless otherwise agreed upon in writing. Clients may not reproduce or distribute our proprietary materials without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Governing Law</h2>
              <p className="text-[#3d2052] leading-relaxed">
                These terms are governed by the laws of the Philippines. Any disputes will be resolved through negotiation or legal proceedings in appropriate courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Contact Information</h2>
              <p className="text-[#3d2052] leading-relaxed">
                For questions about these Terms of Service, please contact us at schatziesevents@gmail.com or through our Contact page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Updates to Terms</h2>
              <p className="text-[#3d2052] leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of the updated terms.
              </p>
              <p className="text-[#3d2052] text-sm mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </main>
  );
};

export default TermsOfServicePage;
const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8d0e3] to-[#f5c3d9] py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-[#1a1225] mb-8 text-center">Privacy Policy</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Introduction</h2>
              <p className="text-[#3d2052] leading-relaxed">
                At Schatzies Events Management, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Information We Collect</h2>
              <ul className="list-disc list-inside text-[#3d2052] leading-relaxed space-y-2">
                <li>Personal information such as name, email address, phone number, and contact details</li>
                <li>Event-related information including event type, date, venue, and guest details</li>
                <li>Payment information for processing transactions</li>
                <li>Communication records and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-[#3d2052] leading-relaxed space-y-2">
                <li>To provide and manage event planning services</li>
                <li>To communicate with you about your events and our services</li>
                <li>To process payments and maintain financial records</li>
                <li>To improve our services and customer experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Information Sharing</h2>
              <p className="text-[#3d2052] leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or required by law. We may share information with trusted service providers who assist us in operating our business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Data Security</h2>
              <p className="text-[#3d2052] leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Your Rights</h2>
              <p className="text-[#3d2052] leading-relaxed">
                You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us using the information provided in our Contact page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Contact Us</h2>
              <p className="text-[#3d2052] leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at schatziesevents@gmail.com or through our Contact page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Updates to This Policy</h2>
              <p className="text-[#3d2052] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
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

export default PrivacyPolicyPage;
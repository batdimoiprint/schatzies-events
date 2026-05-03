const CookiePolicyPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8d0e3] to-[#f5c3d9] py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-[#1a1225] mb-8 text-center">Cookie Policy</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">What Are Cookies</h2>
              <p className="text-[#3d2052] leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They allow us to remember your preferences and improve your browsing experience. Cookies also help us understand how our website is used so we can make improvements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">How We Use Cookies</h2>
              <p className="text-[#3d2052] leading-relaxed">
                We use cookies for several purposes:
              </p>
              <ul className="list-disc list-inside text-[#3d2052] leading-relaxed space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly, including user authentication and security</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings to enhance your experience</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-[#3d2052]">Session Cookies</h3>
                  <p className="text-[#3d2052] leading-relaxed">
                    Temporary cookies that expire when you close your browser. They help us maintain your session while you navigate our website.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#3d2052]">Persistent Cookies</h3>
                  <p className="text-[#3d2052] leading-relaxed">
                    Cookies that remain on your device for a set period or until you delete them. They help us remember your preferences for future visits.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#3d2052]">Third-Party Cookies</h3>
                  <p className="text-[#3d2052] leading-relaxed">
                    Cookies set by third-party services we use, such as analytics providers or social media platforms.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Managing Cookies</h2>
              <p className="text-[#3d2052] leading-relaxed">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside text-[#3d2052] leading-relaxed space-y-2">
                <li>Most web browsers allow you to control cookies through their settings</li>
                <li>You can delete all cookies that are already on your computer</li>
                <li>You can set most browsers to prevent cookies from being placed</li>
                <li>Note that disabling cookies may affect the functionality of our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Third-Party Services</h2>
              <p className="text-[#3d2052] leading-relaxed">
                We may use third-party services that have their own cookie policies. These include:
              </p>
              <ul className="list-disc list-inside text-[#3d2052] leading-relaxed space-y-2">
                <li>Google Analytics for website analytics</li>
                <li>Social media platforms for sharing functionality</li>
                <li>Payment processors for secure transactions</li>
              </ul>
              <p className="text-[#3d2052] leading-relaxed">
                Please review the cookie policies of these third parties for more information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Updates to This Policy</h2>
              <p className="text-[#3d2052] leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#3d2052] mb-4">Contact Us</h2>
              <p className="text-[#3d2052] leading-relaxed">
                If you have any questions about our use of cookies, please contact us at schatziesevents@gmail.com or through our Contact page.
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

export default CookiePolicyPage;
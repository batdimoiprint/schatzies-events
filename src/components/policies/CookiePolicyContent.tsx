import { Cookie, Eye, Settings, Zap, BarChart3, Info, AlertCircle, Clock } from 'lucide-react';

export function CookiePolicyContent() {
  const iconClass = 'h-5 w-5 text-brand';

  return (
    <div className="space-y-4">
      <section className="flex gap-3">
        <Cookie className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-brand-deep mb-2">What Are Cookies</h3>
          <p className="text-sm">
            Cookies are small text files that are placed on your computer or mobile device when you
            visit our website. They allow us to remember your preferences and improve your browsing
            experience. Cookies also help us understand how our website is used so we can make
            improvements.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Zap className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-brand-deep mb-2">How We Use Cookies</h3>
          <p className="text-sm mb-2">We use cookies for several purposes:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <strong>Essential Cookies:</strong> Required for the website to function properly,
              including user authentication and security
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our
              website by collecting anonymous information
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your preferences and settings to enhance
              your experience
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track
              campaign effectiveness
            </li>
          </ul>
        </div>
      </section>

      <section className="flex gap-3">
        <BarChart3 className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-brand-deep mb-2">Types of Cookies We Use</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-brand-deep flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Session Cookies
              </h4>
              <p className="text-sm">
                Temporary cookies that expire when you close your browser. They help us maintain
                your session while you navigate our website.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-brand-deep flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Persistent Cookies
              </h4>
              <p className="text-sm">
                Cookies that remain on your device for a set period or until you delete them. They
                help us remember your preferences for future visits.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-brand-deep flex items-center gap-2">
                <Info className="h-4 w-4" />
                Third-Party Cookies
              </h4>
              <p className="text-sm">
                Cookies set by third-party services we use, such as analytics providers or social
                media platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex gap-3">
        <Settings className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-brand-deep mb-2">Managing Cookies</h3>
          <p className="text-sm mb-2">You can control and manage cookies in various ways:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Most web browsers allow you to control cookies through their settings</li>
            <li>You can delete all cookies that are already on your computer</li>
            <li>You can set most browsers to prevent cookies from being placed</li>
            <li>Note that disabling cookies may affect the functionality of our website</li>
          </ul>
        </div>
      </section>

      <section className="flex gap-3">
        <AlertCircle className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-brand-deep mb-2">Third-Party Services</h3>
          <p className="text-sm mb-2">
            We may use third-party services that have their own cookie policies. These include:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Google Analytics for website analytics</li>
            <li>Social media platforms for sharing functionality</li>
            <li>Payment processors for secure transactions</li>
          </ul>
          <p className="text-sm mt-2">
            Please review the cookie policies of these third parties for more information.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Clock className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-brand-deep mb-2">Updates to This Policy</h3>
          <p className="text-sm">
            We may update this Cookie Policy from time to time to reflect changes in our practices
            or for other operational, legal, or regulatory reasons. We will notify you of any
            material changes by posting the updated policy on this page.
          </p>
        </div>
      </section>

      <section className="flex gap-3">
        <Info className={`${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className="font-semibold text-brand-deep mb-2">Contact Us</h3>
          <p className="text-sm">
            If you have any questions about our use of cookies, please contact us at
            schatziesevents@gmail.com or through our Contact page.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>
    </div>
  );
}

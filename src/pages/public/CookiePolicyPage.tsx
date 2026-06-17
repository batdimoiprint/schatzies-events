import { Cookie, Settings, Layers, Wrench, Globe, Mail, RefreshCw } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';

const textureImage = '/Pictures/texture.jpg';

export default function CookiePolicyPage() {
  return (
    <>
      <LoadingScreen />

      {/* ── Hero Section ── */}
      <ScrollReveal variant="fade">
        <section
          className="relative -mt-16 md:-mt-20 flex min-h-[40vh] md:min-h-[50vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${textureImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-16 pt-32 sm:pb-20 sm:pt-40 md:pb-24 md:pt-48 text-center sm:px-6 animate-fade-in-up">
            <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold leading-tight text-white">
              Cookie Policy
            </h1>
            <p className="mt-4 max-w-[45rem] text-[clamp(0.85rem,1.5vw,1.1rem)] leading-[1.7] text-gray-300">
              To provide you with the best possible digital experience, Schatzies Events Management
              uses cookies and similar technologies. This Cookie Policy explains what cookies are,
              how we use them to optimize our website performance, and how you can manage your
              preferences.
            </p>
          </div>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-20">
            <svg
              className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                fill="white"
              />
            </svg>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Content Section ── */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[800px] space-y-10">
          <ScrollReveal variant="up">
            <div className="flex items-start gap-4">
              <Cookie className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  What Are Cookies?
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  Cookies are small text files that are placed on your computer or mobile device
                  when you visit our website. They allow us to remember your preferences and improve
                  your browsing experience. Cookies also help us understand how our website is used
                  so we can make improvements.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Settings className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  How We Use Cookies
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8] mb-2">
                  We use cookies for several purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-[0.95rem] leading-[1.8] space-y-1">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the website to function
                    properly, including user authentication and security
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how visitors interact
                    with our website by collecting anonymous information
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your preferences and settings to
                    enhance your experience
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and
                    track campaign effectiveness
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Layers className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Types of Cookies We Use
                </h2>
                <div className="text-gray-700 text-[0.95rem] leading-[1.8] space-y-3">
                  <div>
                    <p className="font-semibold">• Session Cookies</p>
                    <p>
                      Temporary cookies that expire when you close your browser. They help us
                      maintain your session while you navigate our website.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">• Persistent Cookies</p>
                    <p>
                      Cookies that remain on your device for a set period or until you delete them.
                      They help us remember your preferences for future visits.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">• Third-Party Cookies</p>
                    <p>
                      Cookies set by third-party services we use, such as analytics providers or
                      social media platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Wrench className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Managing Cookies
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8] mb-2">
                  You can control and manage cookies in various ways:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-[0.95rem] leading-[1.8] space-y-1">
                  <li>Most web browsers allow you to control cookies through their settings</li>
                  <li>You can delete all cookies that are already on your computer</li>
                  <li>You can set most browsers to prevent cookies from being placed</li>
                  <li>Note that disabling cookies may affect the functionality of our website</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Globe className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Third-Party Services
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8] mb-2">
                  We may use third-party services that have their own cookie policies. These
                  include:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-[0.95rem] leading-[1.8] space-y-1">
                  <li>Google Analytics for website analytics</li>
                  <li>Social media platforms for sharing functionality</li>
                  <li>Payment processors for secure transactions</li>
                </ul>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8] mt-2">
                  Please review the cookie policies of these third parties for more information.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Contacts Us
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  If you have any questions about our use of cookies, please contact us at{' '}
                  <a
                    href="mailto:schatziesevents@gmail.com"
                    className="text-brand hover:underline"
                  >
                    schatziesevents@gmail.com
                  </a>{' '}
                  or through our Contact page.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <RefreshCw className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Updates to Terms
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  We may update this Cookie Policy from time to time to reflect changes in our
                  practices or for other operational, legal, or regulatory reasons. We will notify
                  you of any material changes by posting the updated policy on this page.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade">
            <p className="text-brand text-sm font-semibold pt-4">Last updated: 6/10/2026</p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

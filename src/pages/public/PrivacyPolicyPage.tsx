import { Shield, Database, Share2, Lock, UserCheck, Mail, RefreshCw } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';

const textureImage = '/Pictures/texture.jpg';

export default function PrivacyPolicyPage() {
  return (
    <>
      <LoadingScreen />

      {/* ── Hero Section ── */}
      <ScrollReveal variant="fade">
        <section
          className="relative -mt-[88px] flex min-h-[50vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat sm:-mt-[110px] md:min-h-[60vh] lg:-mt-[173px] lg:min-h-[70vh]"
          style={{ backgroundImage: `url(${textureImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-[140px] sm:py-[200px] md:py-[250px] lg:py-[300px] text-center sm:px-6 animate-fade-in-up">
            <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold leading-tight text-white">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-[45rem] text-[clamp(0.85rem,1.5vw,1.1rem)] leading-[1.7] text-gray-300">
              At Schatzies Events Management, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy Policy explains how
              we collect, use, and safeguard your data when you use our services.
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
              <Database className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Information We Collect
                </h2>
                <ul className="list-disc list-inside text-gray-700 text-[0.95rem] leading-[1.8] space-y-1">
                  <li>
                    Personal information such as name, email address, phone number, and contact
                    details
                  </li>
                  <li>
                    Event-related information including event type, date, venue, and guest details
                  </li>
                  <li>Payment information for processing transactions</li>
                  <li>Communication records and preferences</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  How We Use Your Information
                </h2>
                <ul className="list-disc list-inside text-gray-700 text-[0.95rem] leading-[1.8] space-y-1">
                  <li>To provide and manage event planning services</li>
                  <li>To communicate with you about your events and our services</li>
                  <li>To process payments and maintain financial records</li>
                  <li>To improve our services and customer experience</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Share2 className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Information Sharing
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  We do not sell, trade, or otherwise transfer your personal information to third
                  parties without your consent, except as described in this policy or required by
                  law. We may share information with trusted service providers who assist us in
                  operating our business.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Data Security
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction. However, no
                  method of transmission over the internet is 100% secure.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <UserCheck className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Your Rights
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  You have the right to access, update, or delete your personal information. You may
                  also opt out of marketing communications at any time. To exercise these rights,
                  please contact us using the information provided in our Contact page.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Contact Us
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
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
                  Updates To This Policy
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new policy on this page and updating the effective date.
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

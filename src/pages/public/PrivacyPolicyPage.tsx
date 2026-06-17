import { Shield, Eye, Globe, Lock, Mail, RefreshCw } from 'lucide-react';
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
          className="relative -mt-16 md:-mt-20 flex min-h-[40vh] md:min-h-[50vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${textureImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-16 pt-32 sm:pb-20 sm:pt-40 md:pb-24 md:pt-48 text-center sm:px-6 animate-fade-in-up">
            <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold leading-tight text-white">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-[45rem] text-[clamp(0.85rem,1.5vw,1.1rem)] leading-[1.7] text-gray-300">
              At Schatzies Events Management, your privacy matters to us. This policy explains how
              our website operates and what you can expect when you visit.
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
              <Eye className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  No Personal Data Collection
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  Our website is designed purely for browsing. We do not collect, store, or process
                  any personal information from visitors. There are no sign-up forms, user accounts,
                  newsletter subscriptions, or any other mechanisms that gather your personal data on
                  this website.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Globe className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  How You Use Our Website
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  As a visitor, you can freely browse our services, event packages, gallery, and all
                  other public pages without providing any personal information. Our website serves as
                  an informational showcase of Schatzies Events Management&apos;s offerings.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Cookies &amp; Local Storage
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  Our website may use essential cookies or local storage tokens solely for the
                  technical operation of the site (such as authentication tokens for internal
                  administrative use). These are not used to track, profile, or identify public
                  visitors in any way. For more details, please see our Cookie Policy.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-brand mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Third-Party Services
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  Our website does not integrate third-party analytics, advertising networks, or
                  social media tracking tools that collect visitor data. Any external links on our
                  website will take you to third-party sites that have their own privacy policies,
                  which we encourage you to review.
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
                  We may update this Privacy Policy from time to time. Any changes will be posted on
                  this page with an updated effective date.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade">
            <p className="text-brand text-sm font-semibold pt-4">Last updated: 6/17/2026</p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

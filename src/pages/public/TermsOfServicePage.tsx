import {
  FileText,
  Briefcase,
  ClipboardList,
  CreditCard,
  XCircle,
  Scale,
  Brain,
  Gavel,
  Mail,
  RefreshCw,
} from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';

const textureImage = '/Pictures/texture.jpg';

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="mt-4 max-w-[45rem] text-[clamp(0.85rem,1.5vw,1.1rem)] leading-[1.7] text-gray-300">
              These Terms of Service govern your access to and use of our website, digital tools,
              management services, and event packages. By engaging with Schatzies Events, you agree
              to ensure a safe, fair, and seamless experience for all our clients, guests, and
              partners.
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
              <FileText className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Acceptance of Terms
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  By accessing and using Schatzies Events Management services, you accept and agree
                  to be bound by the terms and provisions of this agreement. If you do not agree to
                  abide by the above, please do not use this service.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Briefcase className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Services
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  Schatzies Events Management provides event planning and management services
                  including but not limited to wedding planning, debut events, corporate events, and
                  other special occasions. Our services include consultation, planning,
                  coordination, and execution of events.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <ClipboardList className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Client Responsibilities
                </h2>
                <ul className="list-disc list-inside text-gray-700 text-[0.95rem] leading-[1.8] space-y-1">
                  <li>Provide accurate and complete information for event planning</li>
                  <li>Communicate changes or updates promptly</li>
                  <li>Respect venue policies and local regulations</li>
                  <li>Ensure timely payments as per agreed schedule</li>
                  <li>Cooperate with our team for successful event execution</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <CreditCard className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Payment Terms
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  Clients agree to pay all fees as outlined in the service agreement. Payments are
                  due according to the schedule specified. Late payments may result in service
                  suspension or additional fees. All payments are non-refundable unless otherwise
                  specified in writing.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <XCircle className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Cancellation Policy
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  Cancellation requests must be submitted in writing. Cancellation fees apply based
                  on the timing of the cancellation relative to the event date. Deposits may be non-
                  refundable depending on the circumstances and timing.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Scale className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Liability
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  Schatzies Events Management will exercise due diligence in planning and executing
                  events. However, we are not liable for unforeseen circumstances, force majeure
                  events, or issues caused by third parties. Our liability is limited to the amount
                  paid for our services.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Brain className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Intellectual Property
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  All materials, concepts, and designs provided by Schatzies Events Management
                  remain our intellectual property unless otherwise agreed upon in writing. Clients
                  may not reproduce or distribute our proprietary materials without permission.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Gavel className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Governing Law
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  These terms are governed by the laws of the Philippines. Any disputes will be
                  resolved through negotiation or legal proceedings in appropriate courts.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={100}>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Contacts Us
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  For questions about these Terms of Service, please contact us at{' '}
                  <a
                    href="mailto:schatziesevents@gmail.com"
                    className="text-[#FF0066] hover:underline"
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
              <RefreshCw className="h-6 w-6 text-[#FF0066] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-heading">
                  Updates to Terms
                </h2>
                <p className="text-gray-700 text-[0.95rem] leading-[1.8]">
                  We reserve the right to modify these terms at any time. Changes will be effective
                  immediately upon posting on our website. Continued use of our services constitutes
                  acceptance of the updated terms.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade">
            <p className="text-[#FF0066] text-sm font-semibold pt-4">Last updated: 6/10/2026</p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

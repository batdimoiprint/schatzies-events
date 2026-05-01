import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, User, Utensils, Scissors, Video, Eye, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { submitInquiry } from '@/api/inquiries';
import { checkOrSendVerification, checkEmailVerified } from '@/api/email-verification';
import { getPackageById, getPackagesByType } from '@/data/packages';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const eventTypes = ['Wedding', 'Debut'];

const defaultPaxOptions = ['100', '150', '200'];
const bloomsPaxOptions = ['50', '100', '150', '200'];

const fieldBase =
  'h-11 w-full rounded-lg border-0 bg-[#e8e8e8] px-4 text-[0.85rem] text-gray-700 outline-none placeholder:text-gray-400 transition focus:ring-2 focus:ring-[#3d2052]/25 [color-scheme:light]';

const errorText = 'text-[0.7rem] text-red-500 mt-1 ml-1 font-medium';
const overlayPopupLayer = 'z-[10001]';

/** Red asterisk for required fields */
function Req() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-bold text-red-500 select-none">
      ✱
    </span>
  );
}

function Field({
  required,
  error,
  children,
}: {
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="relative">
        {children}
        {required && <Req />}
      </div>
      {error && <span className={errorText}>{error}</span>}
    </div>
  );
}

interface InquiryFormProps {
  onClose: () => void;
  selectedPackageId?: number;
  selectedEventType?: string;
}

interface IInquiryForm {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  contactNumber: string;
  eventDate: string;
  eventType: string;
  eventPackage: string;
  eventPax: string;
  message: string;
  termsAccepted: boolean;
}

export function InquiryForm({ onClose, selectedPackageId, selectedEventType }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPackageDetails, setShowPackageDetails] = useState(false);

  // ── Email verification state ──
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSending, setVerificationSending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [verificationCooldown, setVerificationCooldown] = useState(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get the selected package info if available
  const selectedPackage =
    selectedEventType && selectedPackageId
      ? getPackageById(selectedEventType, selectedPackageId)
      : null;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IInquiryForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      contactNumber: '',
      eventDate: '',
      eventType: selectedEventType || '',
      eventPackage: selectedPackage?.name || '',
      eventPax: '',
      message: '',
      termsAccepted: false,
    },
  });

  const watchedEventType = watch('eventType');
  const watchedEventPackage = watch('eventPackage');
  const watchedTermsAccepted = watch('termsAccepted');
  const watchedEmail = watch('email');

  // ── No more localStorage caching, relying purely on backend ──

  // Reset verification state if email changes
  useEffect(() => {
    setVerificationSent(false);
    setVerificationError(null);
    setEmailVerified(false);
  }, [watchedEmail]);

  // Poll backend for verification while waiting
  useEffect(() => {
    if (verificationSent && !emailVerified && watchedEmail) {
      pollingRef.current = setInterval(async () => {
        // Ask backend
        try {
          const { verified } = await checkEmailVerified(watchedEmail);
          if (verified) {
            setEmailVerified(true);
            setVerificationSent(false);
            if (pollingRef.current) clearInterval(pollingRef.current);
            
            // Trigger automatic submit since verification is complete
            setShouldAutoSubmit(true);
          }
        } catch {
          /* ignore polling errors */
        }
      }, 4000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [verificationSent, emailVerified, watchedEmail]);

  // Cooldown timer to prevent spamming verification emails
  useEffect(() => {
    if (verificationCooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setVerificationCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [verificationCooldown]);

  // ── Send verification email handler (called automatically on submit) ──
  const handleSendVerification = async (email: string): Promise<boolean> => {
    setVerificationSending(true);
    setVerificationError(null);
    try {
      const result = await checkOrSendVerification(email);
      if (result.alreadyUsed) {
        setVerificationError('This email is already used. Please use another email.');
        return false;
      }
      if (result.verified) {
        setEmailVerified(true);
        setVerificationSent(false);
        return true; // already verified, can proceed
      } else {
        setVerificationSent(true);
        setVerificationCooldown(30); // 30 second cooldown
        return false; // email sent, do not proceed
      }
    } catch (err) {
      const msg =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setVerificationError(msg || 'Failed to send verification email. Please try again.');
      return false;
    } finally {
      setVerificationSending(false);
    }
  };

  // Reset package and pax when event type changes
  useEffect(() => {
    if (watchedEventType && watchedEventType !== selectedEventType) {
      setValue('eventPackage', '');
      setValue('eventPax', '');
    }
  }, [watchedEventType, setValue, selectedEventType]);

  // Reset pax when package changes
  useEffect(() => {
    if (watchedEventPackage && watchedEventPackage !== selectedPackage?.name) {
      setValue('eventPax', '');
    }
  }, [watchedEventPackage, setValue, selectedPackage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = originalStyle;
    };
  }, []);

  // Get currently selected package details from dropdown
  const currentSelectedPackage =
    watchedEventType && watchedEventPackage
      ? getPackagesByType(watchedEventType).find((pkg) => pkg.name === watchedEventPackage)
      : null;

  // Calculate minimum date (1 month from today)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return minDate;
  };

  const selectedPaxOptions =
    watchedEventPackage === 'Blooms' ? bloomsPaxOptions : defaultPaxOptions;

  // Pick packages based on selected event type
  const packageOptions = watchedEventType
    ? getPackagesByType(watchedEventType).map((pkg) => pkg.name)
    : [];

  const onFormSubmit = async (data: IInquiryForm) => {
    setError(null);

    // ── Automatic email verification check on submit ──
    const email = data.email.trim();
    const canProceed = await handleSendVerification(email);
    if (!canProceed) {
      // Verification email was sent, or there was an error. Do not submit.
      return;
    }
    setIsLoading(true);

    try {
      await submitInquiry({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        middleName: data.middleName.trim() || undefined,
        email: data.email.trim(),
        contactNumber: `+63${data.contactNumber.trim()}`,
        date: data.eventDate,
        eventType: data.eventType,
        eventPackage: data.eventPackage,
        eventPax: Number.parseInt(data.eventPax, 10),
        message: data.message.trim() || undefined,
      });

      setSubmitted(true);
    } catch (submitError) {
      const message =
        typeof submitError === 'object' &&
          submitError !== null &&
          'response' in submitError &&
          typeof (submitError as { response?: { data?: { message?: string } } }).response?.data
            ?.message === 'string'
          ? (submitError as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to submit inquiry. Please try again.';

      setError(message ?? 'Failed to submit inquiry. Please try again.');
      console.error('Error submitting inquiry:', submitError);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle auto-submit after verification
  useEffect(() => {
    if (shouldAutoSubmit) {
      setShouldAutoSubmit(false);
      handleSubmit(onFormSubmit)();
    }
  }, [shouldAutoSubmit, handleSubmit]);

  return (
    <>
      {/* Reusable Loading Screen */}
      <LoadingScreen isLoading={isLoading} />

      {/* Terms and Conditions Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[1.3rem] font-bold text-[#1a1225]">
              Terms and Conditions
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="text-[0.9rem] text-gray-700 space-y-4">
            <section>
              <h4 className="font-bold text-[#1a1225] mb-2">1. Event Booking</h4>
              <p>
                By submitting an inquiry through this form, you are requesting booking services from
                Schatzies Events. All bookings are subject to our availability and confirmation.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-[#1a1225] mb-2">2. Advance Booking Requirement</h4>
              <p>
                Events must be booked at least 1 month in advance. We cannot accommodate booking
                requests for dates within 30 days from today. Event dates must be selected
                accordingly.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-[#1a1225] mb-2">3. Inquiry Process</h4>
              <p>
                After submitting your inquiry, our team will review your request and contact you
                within 2-3 business days with a personalized proposal and available options for your
                event.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-[#1a1225] mb-2">4. Information Accuracy</h4>
              <p>
                You agree to provide accurate and complete information in this form. Any false or
                misleading information may result in cancellation of your booking or inquiry.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-[#1a1225] mb-2">5. Confidentiality</h4>
              <p>
                We are committed to protecting your personal information. Your contact details and
                inquiry information will be used solely for the purpose of processing your event
                inquiry.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-[#1a1225] mb-2">6. Cancellation Policy</h4>
              <p>
                Cancellation policies will be discussed during your booking confirmation. Different
                packages may have different cancellation terms.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-[#1a1225] mb-2">7. Liability</h4>
              <p>
                Schatzies Events shall not be liable for any indirect, incidental, or consequential
                damages arising from the use of this inquiry form or the services provided.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-[#1a1225] mb-2">8. Agreement</h4>
              <p>
                By submitting this inquiry form, you acknowledge that you have read, understood, and
                agree to comply with these Terms and Conditions.
              </p>
            </section>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowTerms(false)}
              className="flex-1 h-10 rounded-full"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setValue('termsAccepted', true, { shouldValidate: true });
                setShowTerms(false);
              }}
              className="flex-1 h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] text-white font-bold hover:brightness-110"
            >
              Accept
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Package Details Modal — Landscape Layout */}
      {showPackageDetails &&
        (currentSelectedPackage || selectedPackage) &&
        (() => {
          const pkg = (currentSelectedPackage || selectedPackage)!;
          const iconMap = { user: User, utensils: Utensils, scissors: Scissors, video: Video };
          return (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm"
                onClick={() => setShowPackageDetails(false)}
              />

              {/* Modal — landscape card */}
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <div
                  className="relative flex w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl"
                  style={{ maxHeight: '88vh' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ── LEFT: Package Image ── */}
                  <div className="relative hidden w-[38%] shrink-0 sm:block">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${pkg.image})` }}
                    />
                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1225]/80 via-transparent to-transparent" />
                    {/* Package name badge at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-pink-300">
                        Package
                      </p>
                      <h2 className="text-[1.6rem] font-bold leading-tight text-white">
                        {pkg.name}
                      </h2>
                      <p className="mt-1 text-[0.78rem] leading-relaxed text-white/75 line-clamp-3">
                        {pkg.description}
                      </p>
                    </div>
                  </div>

                  {/* ── RIGHT: Details ── */}
                  <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
                      <div>
                        {/* Mobile-only title (hidden on sm+) */}
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#c2649b] sm:hidden">
                          Package
                        </p>
                        <h3 className="text-[1.1rem] font-bold text-[#1a1225] sm:text-[1.25rem]">
                          {pkg.name} Inclusions
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowPackageDetails(false)}
                        aria-label="Close"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
                      {/* Note */}
                      <div className="mb-4 rounded-lg border-l-4 border-[#FF0066] bg-[#fff0f7] px-4 py-3">
                        <p className="text-[0.82rem] leading-relaxed text-gray-700">
                          {pkg.modal.note}
                        </p>
                      </div>

                      {/* 2×2 categories grid */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {pkg.modal.categories.map((cat) => {
                          const Icon = iconMap[cat.iconName as keyof typeof iconMap];
                          return (
                            <div key={cat.title} className="rounded-xl bg-[#ede0f5] p-3 sm:p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <Icon className="h-4 w-4 text-[#c2649b]" />
                                <span className="text-[0.82rem] font-bold text-[#3d1a5e]">
                                  {cat.title}
                                </span>
                              </div>
                              <ul className="space-y-1.5">
                                {cat.items.map((item) => {
                                  const isHighlight = typeof item === 'object';
                                  const text = typeof item === 'object' ? item.text : item;
                                  return (
                                    <li key={text} className="flex items-start gap-2">
                                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e61f83]">
                                        <svg
                                          viewBox="0 0 10 10"
                                          className="h-2 w-2 fill-none stroke-white stroke-[2]"
                                        >
                                          <polyline
                                            points="1.5,5 4,7.5 8.5,2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span
                                        className={`text-[0.78rem] leading-snug ${
                                          isHighlight
                                            ? 'font-semibold text-[#e61f83]'
                                            : 'text-[#2d1a3d]'
                                        }`}
                                      >
                                        {text}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
                      <button
                        onClick={() => setShowPackageDetails(false)}
                        className="h-9 rounded-full border-2 border-gray-200 px-5 text-[0.82rem] font-semibold text-gray-500 transition hover:border-gray-300 hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

      <div
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm [scrollbar-gutter:stable]"
        onClick={onClose}
      >
        {/* ── Success confirmation overlay ── */}
        {submitted && !isLoading && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <div
              className="flex w-[340px] flex-col items-center rounded-2xl bg-white px-8 py-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Green check circle */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="mt-5 text-[1.3rem] font-bold text-[#1a1225]">Inquiry Sent!</h3>
              <p className="mt-2 text-center text-[0.88rem] leading-[1.6] text-gray-500">
                Your inquiry has been submitted successfully! Please wait for our response as we
                process your inquiry.
              </p>
              <button
                onClick={onClose}
                className="mt-6 h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] px-8 text-[0.88rem] font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            MAIN MODAL — gradient background wrapper
        ══════════════════════════════════════════ */}
        <div
          className="relative flex w-full max-w-[1100px] overflow-visible rounded-2xl bg-gradient-to-br from-white via-[#fff0f7] to-[#f9a8d4] shadow-[0_32px_80px_rgba(0,0,0,0.25)] sm:rounded-3xl"
          style={{ maxHeight: '92vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── LEFT SIDE — text + image on gradient bg ── */}
          <div className="hidden w-[50%] shrink-0 flex-col px-8 py-8 lg:flex">
            {/* Back button — transparent, dark purple border */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="mb-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2.5px] border-[#3d2052] bg-transparent text-[#3d2052] transition hover:bg-[#3d2052]/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Heading */}
            <h2 className="shrink-0 font-heading text-[2rem] font-bold leading-[1.18] text-[#1a1225]">
              Let&rsquo;s Plan
              <br />
              Your{' '}
              <span className="bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                Milestone
              </span>
            </h2>

            {/* Sub-copy */}
            <p className="mt-3 text-[0.82rem] leading-[1.7] text-[#3d1a50]">
              Tell us a bit about your dream event, and our team will get back to you with a
              personalized proposal as soon as we can.
            </p>

            {/* Envelope illustration — bottom-right weighted, slight tilt */}
            <div className="flex flex-1 items-end justify-center pb-2 pt-4">
              <img
                src="/Pictures/inquiry-form-logo.png"
                alt="Schatzies Events inquiry illustration"
                className="w-full max-w-[270px] rotate-[-6deg] drop-shadow-2xl"
              />
            </div>
          </div>

          {/* ── RIGHT SIDE — Floating white card ── */}
          <div className="flex flex-1 items-stretch p-3 sm:py-5 sm:pr-5 lg:py-5 lg:pr-5">
            <div className="flex w-full flex-col rounded-xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:rounded-2xl">
              {/* Card header */}
              <div className="flex shrink-0 items-center justify-between px-4 pt-5 pb-3 sm:px-7 sm:pt-6 sm:pb-4">
                <h2 className="w-full text-center font-heading text-[1.2rem] font-bold text-[#1a1225] sm:text-[1.5rem]">
                  Inquiry Form
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-7 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-7 sm:pb-6 [scrollbar-gutter:stable]">
                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                  {/* ── Personal Details ── */}
                  <section>
                    <p className="mb-2.5 text-[0.9rem] font-bold text-[#1a1225]">
                      Personal Details
                    </p>

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <Field required error={errors.firstName?.message}>
                          <Input
                            type="text"
                            placeholder="First Name"
                            {...register('firstName', {
                              required: 'First name is required',
                              minLength: { value: 2, message: 'Minimum 2 characters' },
                              maxLength: { value: 50, message: 'Maximum 50 characters' },
                            })}
                            className={fieldBase}
                          />
                        </Field>
                        <Field required error={errors.lastName?.message}>
                          <Input
                            type="text"
                            placeholder="Last Name"
                            {...register('lastName', {
                              required: 'Last name is required',
                              minLength: { value: 2, message: 'Minimum 2 characters' },
                              maxLength: { value: 50, message: 'Maximum 50 characters' },
                            })}
                            className={fieldBase}
                          />
                        </Field>
                      </div>

                      <Field error={errors.middleName?.message}>
                        <Input
                          type="text"
                          placeholder="Middle Name (Optional)"
                          {...register('middleName', {
                            maxLength: { value: 50, message: 'Maximum 50 characters' },
                          })}
                          className={fieldBase}
                        />
                      </Field>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {/* ── Email field ── */}
                        <div className="space-y-2">
                          <Field
                            required
                            error={errors.email?.message || verificationError || undefined}
                          >
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="Email Address"
                                {...register('email', {
                                  required: 'Email is required',
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                  },
                                })}
                                onBlur={(e) => {
                                  // Call standard react-hook-form onBlur
                                  const { onBlur } = register('email');
                                  onBlur(e);
                                }}
                                disabled={emailVerified}
                                className={cn(
                                  fieldBase,
                                  emailVerified && 'opacity-60 cursor-not-allowed'
                                )}
                              />
                            </div>
                          </Field>

                          {/* Verification status — simple badge below input */}
                          {emailVerified && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 border border-emerald-100 mt-1">
                              <span className="text-[0.65rem] font-bold text-emerald-600">
                                Email verified ✅ You can now submit the form.
                              </span>
                            </div>
                          )}
                          {verificationSent && !emailVerified && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 border border-amber-100 mt-1">
                              <span className="text-[0.65rem] font-medium text-amber-600 animate-pulse">
                                Verification link sent. Please check your email before submitting.
                              </span>
                            </div>
                          )}
                        </div>

                        {/* ── Contact number ── */}
                        <Field required error={errors.contactNumber?.message}>
                          <div className="flex items-stretch overflow-hidden rounded-lg bg-[#e8e8e8] focus-within:ring-2 focus-within:ring-[#3d2052]/25">
                            <span className="flex items-center border-r border-gray-300 px-3 text-[0.85rem] font-medium text-gray-600">
                              +63
                            </span>
                            <Controller
                              control={control}
                              name="contactNumber"
                              rules={{
                                required: 'Contact number is required',
                                pattern: {
                                  value: /^9\d{9}$/,
                                  message: 'Must start with 9 and have 10 digits',
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  type="tel"
                                  inputMode="numeric"
                                  placeholder="9XXXXXXXXX"
                                  value={field.value}
                                  onChange={(e) => {
                                    const val = e.target.value
                                      .replace(/\D/g, '')
                                      .replace(/^0+/, '')
                                      .slice(0, 10);
                                    field.onChange(val);
                                  }}
                                  onBlur={field.onBlur}
                                  maxLength={10}
                                  className="h-11 w-full border-0 bg-transparent px-4 text-[0.85rem] text-gray-700 outline-none placeholder:text-gray-400 [color-scheme:light]"
                                />
                              )}
                            />
                          </div>
                        </Field>
                      </div>
                    </div>
                  </section>

                  {/* ── Event Specifications ── */}
                  <section>
                    <p className="mb-2.5 text-[0.9rem] font-bold text-[#1a1225]">
                      Event Specifications <span className="text-red-500">✱</span>
                    </p>

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <Field error={errors.eventDate?.message}>
                          <Controller
                            control={control}
                            name="eventDate"
                            rules={{ required: 'Event date is required' }}
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'h-11 w-full justify-start rounded-lg border-0 bg-[#e8e8e8] px-4 text-left text-[0.85rem] font-normal text-gray-700 outline-none transition focus:ring-2 focus:ring-[#3d2052]/25',
                                      !field.value && 'text-gray-400'
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(new Date(field.value), 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className={cn('w-auto p-0', overlayPopupLayer)}
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value ? new Date(field.value) : undefined}
                                    defaultMonth={
                                      field.value ? new Date(field.value) : getMinDate()
                                    }
                                    onSelect={(date) => field.onChange(date?.toISOString())}
                                    disabled={(date) => date < getMinDate()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                        </Field>
                        <Field error={errors.eventType?.message}>
                          <Controller
                            control={control}
                            name="eventType"
                            rules={{ required: 'Event type is required' }}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className={fieldBase}>
                                  <SelectValue placeholder="Event Type" />
                                </SelectTrigger>
                                <SelectContent className={overlayPopupLayer}>
                                  {eventTypes.map((t) => (
                                    <SelectItem key={t} value={t}>
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <Field error={errors.eventPackage?.message}>
                          <div className="flex items-center gap-1.5">
                            <Controller
                              control={control}
                              name="eventPackage"
                              rules={{ required: 'Event package is required' }}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={!watchedEventType}
                                >
                                  <SelectTrigger className={fieldBase}>
                                    <SelectValue
                                      placeholder={
                                        !watchedEventType
                                          ? 'Select Event Type First'
                                          : 'Event Package'
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent className={overlayPopupLayer}>
                                    {packageOptions.map((p) => (
                                      <SelectItem key={p} value={p}>
                                        {p}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </Field>
                        <Field error={errors.eventPax?.message}>
                          <Controller
                            control={control}
                            name="eventPax"
                            rules={{ required: 'Number of pax is required' }}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!watchedEventPackage}
                              >
                                <SelectTrigger className={fieldBase}>
                                  <SelectValue
                                    placeholder={
                                      !watchedEventPackage
                                        ? 'Select Event Package First'
                                        : 'Event Pax'
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent className={overlayPopupLayer}>
                                  {selectedPaxOptions.map((p) => (
                                    <SelectItem key={p} value={p}>
                                      {p}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>
                      </div>

                      {/* Show selected package info if available */}
                      {(currentSelectedPackage || selectedPackage) && (
                        <div className="mt-3 rounded-lg bg-gradient-to-r from-[#FF0066]/10 to-[#700F81]/10 p-3 border border-[#FF0066]/20">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-[0.8rem] font-semibold text-gray-600">
                                Selected Package
                              </p>
                              <p className="text-[1rem] font-bold text-[#3d2052]">
                                {(currentSelectedPackage || selectedPackage)?.name}
                              </p>
                              <p className="text-[0.8rem] text-gray-600 mt-1 line-clamp-2">
                                {(currentSelectedPackage || selectedPackage)?.description}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowPackageDetails(true)}
                              className="shrink-0 mt-0 flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] text-white transition hover:brightness-110 hover:scale-110"
                              title="View package details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Show "No package selected" message when form is open without a package */}
                      {!(currentSelectedPackage || selectedPackage) && watchedEventType && (
                        <div className="mt-3 rounded-lg bg-blue-50/50 p-3 border border-blue-200/50">
                          <p className="text-[0.8rem] text-blue-600">
                            💡 Select a package from the dropdown to see its details and inclusions
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* ── Message ── */}
                  <section>
                    <p className="mb-2.5 text-[0.9rem] font-bold text-[#1a1225]">Message</p>
                    <Field error={errors.message?.message}>
                      <Textarea
                        {...register('message', {
                          maxLength: { value: 1000, message: 'Maximum 1000 characters' },
                        })}
                        rows={7}
                        placeholder="Write something..."
                        className="w-full resize-none rounded-lg border-0 bg-[#e8e8e8] px-4 py-4 text-[0.85rem] text-gray-700 outline-none placeholder:text-gray-400 transition focus:ring-2 focus:ring-[#3d2052]/25"
                      />
                    </Field>
                  </section>

                  {/* ── Terms and Conditions ── */}
                  <section>
                    <Field error={errors.termsAccepted?.message}>
                      <div className="flex items-start gap-2">
                        <Controller
                          control={control}
                          name="termsAccepted"
                          rules={{ required: 'You must accept the terms and conditions' }}
                          render={({ field }) => (
                            <Checkbox
                              id="termsAccepted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              onBlur={field.onBlur}
                              className="mt-1 h-4 w-4 cursor-pointer accent-[#700F81]"
                            />
                          )}
                        />
                        <label
                          htmlFor="termsAccepted"
                          className="flex-1 text-[0.85rem] text-gray-600"
                        >
                          I have read and agree to the{' '}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-[#700F81] font-bold hover:underline"
                          >
                            Terms and Conditions
                          </button>
                        </label>
                      </div>
                    </Field>
                  </section>

                  {/* ── Submit ── */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        verificationSending ||
                        !watchedTermsAccepted ||
                        verificationCooldown > 0
                      }
                      className="h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] px-12 text-[0.88rem] font-bold tracking-wide text-white shadow-[0_6px_20px_rgba(112,15,129,0.3)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verificationSending ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="31.4"
                              strokeDashoffset="10"
                              strokeLinecap="round"
                            />
                          </svg>
                          Checking…
                        </span>
                      ) : isLoading ? (
                        'Submitting...'
                      ) : verificationCooldown > 0 ? (
                        `Retry in ${verificationCooldown}s`
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

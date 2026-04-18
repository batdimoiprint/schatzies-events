import { useState } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { submitInquiry } from '@/api/inquiries';
import { getPackageById, getPackagesByType } from '@/data/packages';
import { User, Utensils, Scissors, Video, Eye } from 'lucide-react';

const eventTypes = ['Wedding', 'Debut'];

const defaultPaxOptions = ['100', '150', '200'];
const bloomsPaxOptions = ['50', '100', '150', '200'];

/* ── shared styling tokens ── */
const fieldBase =
  'h-11 w-full rounded-lg border-0 bg-[#e8e8e8] px-4 text-[0.85rem] text-gray-700 outline-none placeholder:text-gray-400 transition focus:ring-2 focus:ring-[#3d2052]/25 [color-scheme:light]';

const selectBase =
  'h-11 w-full rounded-lg border-0 bg-[#e8e8e8] px-4 text-[0.85rem] text-gray-700 outline-none transition focus:ring-2 focus:ring-[#3d2052]/25 appearance-none cursor-pointer';

/** Red asterisk for required fields */
function Req() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-bold text-red-500 select-none">
      ✱
    </span>
  );
}

function Field({ required, children }: { required?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      {required && <Req />}
    </div>
  );
}

function SelectChevron() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

interface InquiryFormProps {
  onClose: () => void;
  selectedPackageId?: number;
  selectedEventType?: string;
}

export function InquiryForm({ onClose, selectedPackageId, selectedEventType }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPackageDetails, setShowPackageDetails] = useState(false);

  // Get the selected package info if available
  const selectedPackage =
    selectedEventType && selectedPackageId
      ? getPackageById(selectedEventType, selectedPackageId)
      : null;

  const [form, setForm] = useState({
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
  });

  // Auto-populate form when selected package data changes
  // Note: Form state is already managed through controlled inputs and onChange handlers

  // Get currently selected package details from dropdown
  const currentSelectedPackage =
    form.eventType && form.eventPackage
      ? getPackagesByType(form.eventType).find((pkg) => pkg.name === form.eventPackage)
      : null;

  // Calculate minimum date (1 month from today)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return minDate.toISOString().split('T')[0];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'contactNumber') {
      const digitsOnly = value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10);

      setForm((prev) => ({
        ...prev,
        contactNumber: digitsOnly,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset package when event type changes
      ...(name === 'eventType' ? { eventPackage: '', eventPax: '' } : {}),
      ...(name === 'eventPackage' ? { eventPax: '' } : {}),
    }));
  };

  const selectedPaxOptions = form.eventPackage === 'Blooms' ? bloomsPaxOptions : defaultPaxOptions;

  // Pick packages based on selected event type
  const packageOptions = form.eventType
    ? getPackagesByType(form.eventType).map((pkg) => pkg.name)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate terms acceptance
    if (!termsAccepted) {
      alert('Please accept the Terms and Conditions before submitting.');
      return;
    }

    setIsLoading(true);

    try {
      await submitInquiry({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim() || undefined,
        email: form.email.trim(),
        contactNumber: `+63${form.contactNumber.trim()}`,
        date: form.eventDate,
        eventType: form.eventType,
        eventPackage: form.eventPackage,
        eventPax: Number.parseInt(form.eventPax, 10),
        message: form.message.trim() || undefined,
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

  return (
    <>
      {/* Reusable Loading Screen */}
      <LoadingScreen isLoading={isLoading} />

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="flex w-full max-w-[600px] flex-col rounded-2xl bg-white shadow-2xl"
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-[1.3rem] font-bold text-[#1a1225]">Terms and Conditions</h3>
              <button
                onClick={() => setShowTerms(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 text-[0.9rem] text-gray-700 space-y-4">
              <section>
                <h4 className="font-bold text-[#1a1225] mb-2">1. Event Booking</h4>
                <p>
                  By submitting an inquiry through this form, you are requesting booking services
                  from Schatzies Events. All bookings are subject to our availability and
                  confirmation.
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
                  within 2-3 business days with a personalized proposal and available options for
                  your event.
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
                  Cancellation policies will be discussed during your booking confirmation.
                  Different packages may have different cancellation terms.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-[#1a1225] mb-2">7. Liability</h4>
                <p>
                  Schatzies Events shall not be liable for any indirect, incidental, or
                  consequential damages arising from the use of this inquiry form or the services
                  provided.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-[#1a1225] mb-2">8. Agreement</h4>
                <p>
                  By submitting this inquiry form, you acknowledge that you have read, understood,
                  and agree to comply with these Terms and Conditions.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowTerms(false)}
                className="flex-1 h-10 rounded-full bg-gray-200 text-gray-700 font-bold transition hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTerms(false);
                }}
                className="flex-1 h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] text-white font-bold transition hover:brightness-110"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Details Modal */}
      {showPackageDetails && (currentSelectedPackage || selectedPackage) && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setShowPackageDetails(false)}
        >
          <div
            className="flex w-full max-w-[700px] flex-col rounded-2xl bg-white shadow-2xl"
            style={{ maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <h3 className="text-[1.5rem] font-bold text-[#1a1225]">
                {(currentSelectedPackage || selectedPackage)?.name} Package Details
              </h3>
              <button
                onClick={() => setShowPackageDetails(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Package Note */}
              <div className="mb-6 rounded-lg bg-[#fff0f7] p-4 border-l-4 border-[#FF0066]">
                <p className="text-[0.95rem] text-gray-700 leading-relaxed">
                  {(currentSelectedPackage || selectedPackage)?.modal.note}
                </p>
              </div>

              {/* Package Categories */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {(currentSelectedPackage || selectedPackage)?.modal.categories.map((cat, idx) => {
                  const iconMap = {
                    user: User,
                    utensils: Utensils,
                    scissors: Scissors,
                    video: Video,
                  };
                  const Icon = iconMap[cat.iconName];

                  return (
                    <div key={idx} className="rounded-xl bg-[#ede0f5] p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Icon className="h-5 w-5 text-[#c2649b]" />
                        <span className="font-bold text-[#3d1a5e] text-[0.95rem]">{cat.title}</span>
                      </div>
                      <ul className="space-y-2">
                        {cat.items.map((item) => {
                          const isHighlight = typeof item === 'object';
                          const text = typeof item === 'object' ? item.text : item;
                          return (
                            <li
                              key={text}
                              className={`flex items-start gap-2 text-[0.85rem] ${
                                isHighlight ? 'text-[#FF0066] font-semibold' : 'text-gray-700'
                              }`}
                            >
                              <span className="mt-0.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#e61f83]">
                                <svg
                                  viewBox="0 0 10 10"
                                  className="h-1.5 w-1.5 fill-none stroke-white stroke-[2]"
                                >
                                  <polyline points="2 5 4 7 8 3" />
                                </svg>
                              </span>
                              <span>{text}</span>
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
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowPackageDetails(false)}
                className="w-full h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] text-white font-bold transition hover:brightness-110"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
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
              <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-7 sm:pb-6">
                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* ── Personal Details ── */}
                  <section>
                    <p className="mb-2.5 text-[0.9rem] font-bold text-[#1a1225]">
                      Personal Details
                    </p>

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <Field required>
                          <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className={fieldBase}
                          />
                        </Field>
                        <Field required>
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className={fieldBase}
                          />
                        </Field>
                      </div>
                      <Field>
                        <input
                          type="text"
                          name="middleName"
                          placeholder="Middle Name (Optional)"
                          value={form.middleName}
                          onChange={handleChange}
                          className={fieldBase}
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <Field required>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className={fieldBase}
                          />
                        </Field>
                        <Field required>
                          <div className="flex items-stretch overflow-hidden rounded-lg bg-[#e8e8e8] focus-within:ring-2 focus-within:ring-[#3d2052]/25">
                            <span className="flex items-center border-r border-gray-300 px-3 text-[0.85rem] font-medium text-gray-600">
                              +63
                            </span>
                            <input
                              type="tel"
                              name="contactNumber"
                              inputMode="numeric"
                              placeholder="9XXXXXXXXX"
                              value={form.contactNumber}
                              onChange={handleChange}
                              required
                              maxLength={10}
                              className="h-11 w-full border-0 bg-transparent px-4 text-[0.85rem] text-gray-700 outline-none placeholder:text-gray-400 [color-scheme:light]"
                            />
                          </div>
                        </Field>
                      </div>
                    </div>
                  </section>

                  {/* ── Event Specifications ── */}
                  <section>
                    <p className="mb-2.5 text-[0.9rem] font-bold text-[#1a1225]">
                      Event Specifications
                    </p>

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="relative">
                          <input
                            type="date"
                            name="eventDate"
                            value={form.eventDate}
                            onChange={handleChange}
                            required
                            min={getMinDate()}
                            className={fieldBase}
                          />
                        </div>
                        <div className="relative">
                          <select
                            name="eventType"
                            value={form.eventType}
                            onChange={handleChange}
                            required
                            className={selectBase}
                          >
                            <option value="" disabled hidden>
                              Event Type
                            </option>
                            {eventTypes.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <SelectChevron />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="relative">
                          <select
                            name="eventPackage"
                            value={form.eventPackage}
                            onChange={handleChange}
                            disabled={!form.eventType || (selectedPackage ? true : false)}
                            className={`${selectBase} ${!form.eventType || selectedPackage ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            <option value="" disabled hidden>
                              {!form.eventType ? 'Select Event Type First' : 'Event Package'}
                            </option>
                            {packageOptions.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          <SelectChevron />
                          {/* Eye icon to view package details */}
                          {form.eventPackage && (
                            <button
                              type="button"
                              onClick={() => setShowPackageDetails(true)}
                              className="absolute right-12 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[#FF0066]/20 text-[#FF0066] transition hover:bg-[#FF0066]/40"
                              title="View package details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <select
                            name="eventPax"
                            value={form.eventPax}
                            onChange={handleChange}
                            required
                            disabled={!form.eventPackage}
                            className={`${selectBase} ${!form.eventPackage ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            <option value="" disabled hidden>
                              {!form.eventPackage ? 'Select Event Package First' : 'Event Pax'}
                            </option>
                            {selectedPaxOptions.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          <SelectChevron />
                        </div>
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
                      {!(currentSelectedPackage || selectedPackage) && form.eventType && (
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
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Write something..."
                      className="w-full resize-none rounded-lg border-0 bg-[#e8e8e8] px-4 py-4 text-[0.85rem] text-gray-700 outline-none placeholder:text-gray-400 transition focus:ring-2 focus:ring-[#3d2052]/25"
                    />
                  </section>

                  {/* ── Terms and Conditions ── */}
                  <section>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded cursor-pointer"
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
                  </section>

                  {/* ── Submit ── */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading || !termsAccepted}
                      className="h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] px-12 text-[0.88rem] font-bold tracking-wide text-white shadow-[0_6px_20px_rgba(112,15,129,0.3)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Submitting...' : 'Submit'}
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

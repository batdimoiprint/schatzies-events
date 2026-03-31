import { useState } from 'react';

const eventTypes = ['Wedding', 'Debut'];

const weddingPackages = ['Blooms', 'Fascinating', 'Windy', 'De Luxe', 'Grandezza'];

const debutPackages = ['Charming', 'Irresistible', 'Elegancia', 'Flawless', 'Grandiosa'];

const paxOptions = ['50', '100', '150', '200', '300+'];

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
}

export function InquiryForm({ onClose }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    contactNumber: '',
    eventDate: '',
    eventType: '',
    eventPackage: '',
    eventPax: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset package when event type changes
      ...(name === 'eventType' ? { eventPackage: '' } : {}),
    }));
  };

  // Pick packages based on selected event type
  const packageOptions =
    form.eventType === 'Debut'
      ? debutPackages
      : form.eventType === 'Wedding'
        ? weddingPackages
        : [...weddingPackages, ...debutPackages].filter((v, i, a) => a.indexOf(v) === i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to backend API
    console.log('Inquiry submitted:', form);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* ── Success confirmation overlay ── */}
      {submitted && (
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
              Submit
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
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ── Personal Details ── */}
                <section>
                  <p className="mb-2.5 text-[0.9rem] font-bold text-[#1a1225]">Personal Details</p>

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
                        <input
                          type="tel"
                          name="contactNumber"
                          placeholder="Contact Number"
                          value={form.contactNumber}
                          onChange={handleChange}
                          required
                          className={fieldBase}
                        />
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
                          className={selectBase}
                        >
                          <option value="" disabled hidden>
                            Event Package
                          </option>
                          {packageOptions.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <SelectChevron />
                      </div>
                      <div className="relative">
                        <select
                          name="eventPax"
                          value={form.eventPax}
                          onChange={handleChange}
                          required
                          className={selectBase}
                        >
                          <option value="" disabled hidden>
                            Event Pax
                          </option>
                          {paxOptions.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <SelectChevron />
                      </div>
                    </div>
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

                {/* ── Submit ── */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] px-12 text-[0.88rem] font-bold tracking-wide text-white shadow-[0_6px_20px_rgba(112,15,129,0.3)] transition hover:brightness-110 active:scale-[0.98]"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

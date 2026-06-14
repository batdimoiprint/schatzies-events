import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios-instance';

/**
 * /verify — Handles inquiry confirmation via email link.
 *
 * Two possible flows:
 *
 * Flow A (token in URL — user clicked the link from their email):
 *   ?token=XYZ
 *   → calls backend POST /api/auth/verify-email to verify the token
 *   → on success, redirects to /?inquiry_confirmed=true to show success modal
 *
 * Flow B (result redirect from backend):
 *   ?verified=true&email=user@example.com
 *   ?verified=false&reason=invalid_or_expired_token
 *
 * On success, persists the verified email to localStorage so the
 * InquiryForm can pick it up, then redirects to the landing page.
 */
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const verifiedParam = searchParams.get('verified');
  const emailParam = searchParams.get('email') ?? '';
  const reasonParam = searchParams.get('reason') ?? '';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : verifiedParam === 'true' ? 'success' : 'error'
  );
  const [email, setEmail] = useState(emailParam);
  const [reason, setReason] = useState(reasonParam);
  const [countdown, setCountdown] = useState(6);

  const verifyAttempted = useRef(false);

  /* Flow A: token present → call backend to verify */
  useEffect(() => {
    if (!token) return;
    if (verifyAttempted.current) return;
    verifyAttempted.current = true;

    (async () => {
      try {
        const response = await axiosInstance.post('/auth/verify-email', {
          token,
        });

        if (response.data?.success) {
          setStatus('success');
          setEmail(response.data.email ?? '');
        } else {
          setStatus('error');
          setReason(response.data?.reason ?? 'Verification failed');
        }
      } catch (err: unknown) {
        setStatus('error');

        // Backend returns { success: false, reason: "..." } on 400
        const axiosErr = err as {
          response?: { data?: { reason?: string; error?: string } };
        };
        const apiReason =
          axiosErr?.response?.data?.reason ?? axiosErr?.response?.data?.error ?? null;

        setReason(apiReason ?? 'Something went wrong while confirming your inquiry.');
      }
    })();
  }, [token]);

  /* Persist verified email to localStorage so InquiryForm can read it */
  useEffect(() => {
    if (status !== 'success' || !email) return;

    try {
      const stored = JSON.parse(
        localStorage.getItem('schatzies_verified_emails') || '[]'
      ) as string[];
      const normalised = email.trim().toLowerCase();
      if (!stored.includes(normalised)) {
        stored.push(normalised);
        localStorage.setItem('schatzies_verified_emails', JSON.stringify(stored));
      }
    } catch {
      localStorage.setItem(
        'schatzies_verified_emails',
        JSON.stringify([email.trim().toLowerCase()])
      );
    }
  }, [status, email]);

  /* Auto-redirect countdown (only after loading finishes) */
  useEffect(() => {
    if (status === 'loading') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  /* Navigate when countdown reaches 0 — done outside setCountdown to avoid
     "Cannot update a component while rendering" warnings */
  useEffect(() => {
    if (countdown === 0 && status !== 'loading') {
      if (status === 'success') {
        navigate('/?inquiry_confirmed=true', { replace: true });
      } else {
        navigate('/?inquiry=true', { replace: true });
      }
    }
  }, [countdown, status, navigate]);

  const goHome = () => {
    if (status === 'success') {
      navigate('/?inquiry_confirmed=true', { replace: true });
    } else {
      navigate('/?inquiry=true', { replace: true });
    }
  };

  /* Loading state */
  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-ink via-brand-deep to-ink px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 text-center shadow-2xl backdrop-blur-sm">
          {/* Spinner */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center">
            <svg
              className="h-12 w-12 animate-spin text-brand"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">Confirming your inquiry…</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Please wait while we confirm your inquiry submission.
          </p>
        </div>
      </div>
    );
  }

  const isSuccess = status === 'success';

  const friendlyReason = (() => {
    if (isSuccess) return '';
    const r = reason.toLowerCase().replace(/_/g, ' ');
    if (r.includes('invalid') || r.includes('expired'))
      return 'This confirmation link is invalid or has expired. Please submit a new inquiry.';
    if (r.includes('already been used'))
      return 'This confirmation link has already been used. Your inquiry may already be confirmed.';
    return reason || 'Something went wrong while confirming your inquiry. Please try again.';
  })();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-ink via-brand-deep to-ink px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 text-center shadow-2xl backdrop-blur-sm">
        {/* Icon */}
        {isSuccess ? (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}

        {/* Heading */}
        <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
          {isSuccess ? 'Inquiry Confirmed!' : 'Confirmation Failed'}
        </h1>

        {/* Body text */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {isSuccess ? (
            <>
              Your inquiry has been confirmed and submitted successfully! Our team will review it
              and get back to you shortly.
            </>
          ) : (
            <>{friendlyReason}</>
          )}
        </p>

        {/* Countdown redirect notice */}
        <p className="mt-5 text-xs text-muted-foreground/70">
          Redirecting in <span className="font-bold text-brand-deep">{countdown}</span> seconds…
        </p>

        {/* Manual redirect */}
        <button
          onClick={goHome}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-deep px-8 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.97]"
        >
          {isSuccess ? 'Go to Homepage' : 'Back to Homepage'}
        </button>
      </div>
    </div>
  );
}

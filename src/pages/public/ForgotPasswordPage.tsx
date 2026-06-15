import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { requestPasswordReset, resetPassword, verifyPasswordResetCode } from '@/api/auth';

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordRequirements(value: string) {
  return [
    { label: 'At least 8 characters', test: value.length >= 8 },
    { label: 'One uppercase letter', test: /[A-Z]/.test(value) },
    { label: 'One number', test: /[0-9]/.test(value) },
    { label: 'One special character', test: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) },
  ];
}

const stepLabel: Record<string, string> = {
  request: 'Step 01 — Request',
  verify: 'Step 02 — Verify',
  reset: 'Step 03 — Reset',
  success: 'Complete',
};

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'verify' | 'reset' | 'success'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!emailIsValid(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await requestPasswordReset(email.trim());
      if (response.verificationCode) {
        setOtp(response.verificationCode.slice(0, 6));
      }
      setStep('verify');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await verifyPasswordResetCode(email.trim(), otp.trim());
      setResetToken(response.resetToken);
      setStep('reset');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to verify the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const requirements = passwordRequirements(password);
    const allPassed = requirements.every((item) => item.test);
    if (!allPassed) {
      setError('Please meet all password requirements before continuing.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(resetToken, password);
      setStep('success');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const requirements = passwordRequirements(password);
  const heading =
    step === 'request'
      ? 'Recover password'
      : step === 'verify'
        ? 'Verify your email'
        : step === 'reset'
          ? 'Change password'
          : 'Password changed';

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <img src="/Pictures/hero-5.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand/85 via-ink/70 to-brand-deep/80" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="h-16 w-auto object-contain brightness-0 invert"
            />
            <div className="space-y-4">
              <span className="eyebrow text-gold">Account Recovery</span>
              <h2 className="font-heading text-4xl leading-tight font-semibold text-ivory">
                Let&rsquo;s get you <br />
                back in.
              </h2>
              <p className="max-w-md font-sans text-base leading-relaxed text-ivory/80">
                A few quick steps and you&rsquo;ll be back to planning unforgettable celebrations.
              </p>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="bg-gradient-brand-soft relative flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.12em] text-ink/70 uppercase transition hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" /> Go Back
              </Link>
              <span className="eyebrow text-brand">{stepLabel[step]}</span>
            </div>

            <h1 className="font-heading text-4xl font-semibold text-ink">
              {heading}
              <span className="text-brand">.</span>
            </h1>
            <p className="mt-3 font-sans text-sm leading-relaxed text-ink/60">
              {step === 'request' && 'Enter your email to recover your password.'}
              {step === 'verify' && (
                <>
                  Enter the 6-digit code sent to{' '}
                  <span className="font-semibold text-brand">{email || 'your email'}</span>.
                </>
              )}
              {step === 'reset' && 'Create a new password to secure your account.'}
              {step === 'success' &&
                'Your account is now secure. You can log in with your new credentials.'}
            </p>

            <div className="mt-8">
              {step === 'request' && (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="recover-email" className="font-ui text-xs font-semibold tracking-[0.1em] text-ink/70 uppercase">
                      Email address
                    </Label>
                    <Input
                      id="recover-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  {error && (
                    <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 font-sans text-xs text-destructive">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="bg-gradient-brand h-12 w-full rounded-full font-ui text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:brightness-110"
                  >
                    Send Code
                  </Button>
                </form>
              )}

              {step === 'verify' && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value.replace(/[^0-9]/g, '').slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d*"
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <div className="flex items-center justify-between font-sans text-sm text-ink/60">
                    <span>Code expires in 03:25</span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtp('');
                        setError('');
                      }}
                      className="font-semibold text-brand transition hover:text-brand-deep"
                    >
                      Resend Code
                    </button>
                  </div>
                  {error && (
                    <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 font-sans text-xs text-destructive">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={otp.length !== 6}
                    className="bg-gradient-brand h-12 w-full rounded-full font-ui text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:brightness-110 disabled:opacity-50"
                  >
                    Verify
                  </Button>
                </form>
              )}

              {step === 'reset' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="font-ui text-xs font-semibold tracking-[0.1em] text-ink/70 uppercase">
                      Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="font-ui text-xs font-semibold tracking-[0.1em] text-ink/70 uppercase">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2.5 rounded-xl border border-border bg-card p-4">
                    {requirements.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 font-sans text-sm">
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                            item.test ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.test ? '✓' : ''}
                        </span>
                        <span className={item.test ? 'text-ink' : 'text-ink/55'}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  {error && (
                    <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 font-sans text-xs text-destructive">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="bg-gradient-brand h-12 w-full rounded-full font-ui text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:brightness-110"
                  >
                    Confirm
                  </Button>
                </form>
              )}

              {step === 'success' && (
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="h-8 w-8" />
                  </div>
                  <h2 className="font-heading text-2xl text-ink">Password changed!</h2>
                  <p className="mx-auto mt-3 max-w-xs font-sans text-sm leading-relaxed text-ink/60">
                    Your account is now secure. You can now log in with your new credentials.
                  </p>
                  <Button
                    type="button"
                    onClick={() => navigate('/login', { replace: true })}
                    className="bg-gradient-brand mt-8 h-12 w-full rounded-full font-ui text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:brightness-110"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <div className="relative  overflow-hidden bg-linear-to-b from-[#fff5fb] via-[#ffe3f1] to-[#ffd6e6]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_35%)]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-white via-white/80 to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="w-full rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(177,63,134,0.14)] backdrop-blur-sm sm:p-10">
            <CardHeader className="pb-0">
              <div className="mb-8 flex items-center justify-between gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#4a1053] transition hover:text-[#d63384]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Link>
                <span className="rounded-full bg-[#fff0f9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#d63384] shadow-sm">
                  {step === 'request'
                    ? 'Request'
                    : step === 'verify'
                      ? 'Verify'
                      : step === 'reset'
                        ? 'Reset'
                        : 'Done'}
                </span>
              </div>

              <div className="space-y-3 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-[#24182f] sm:text-4xl">
                  {step === 'request' && 'Recover Password'}
                  {step === 'verify' && 'Verify Your Email'}
                  {step === 'reset' && 'Change Password'}
                  {step === 'success' && 'Password Changed!'}
                </h1>
                <p className="mx-auto max-w-104 text-sm leading-7 text-[#5a3f57] sm:text-base">
                  {step === 'request' && 'Enter your email to recover your password.'}
                  {step === 'verify' && (
                    <>
                      Please enter the 6-digit code sent to{' '}
                      <span className="font-semibold text-[#44264e]">{email || 'your email'}</span>.
                    </>
                  )}
                  {step === 'reset' && 'Create a new password to secure your account.'}
                  {step === 'success' &&
                    'Your account is now secure. You can log in with your new credentials.'}
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-10">
              {step === 'request' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="recover-email"
                      className="block text-sm font-semibold text-[#4a1053]"
                    >
                      Email address
                    </Label>
                    <Input
                      id="recover-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="h-14 rounded-3xl border border-[#f0d7e6] bg-[#faf4f8] px-5 text-sm text-[#392c41] focus:border-[#e460a7] focus:ring-[#e460a7]/20"
                    />
                  </div>

                  {error && (
                    <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-full bg-linear-to-r from-[#ff5fa1] to-[#b049f0] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#da89cd]/20 transition hover:brightness-110"
                  >
                    Send Code
                  </Button>
                </form>
              )}

              {step === 'verify' && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-4">
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

                    <div className="flex items-center justify-between text-sm text-[#6d4b6e]">
                      <span>Code expires in 03:25</span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setOtp('');
                          setError('');
                        }}
                        className="text-sm font-semibold text-[#d63384] transition hover:text-[#b01e64] h-auto p-0"
                      >
                        Resend Code
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={otp.length !== 6}
                    className="w-full rounded-full bg-linear-to-r from-[#ff5fa1] to-[#b049f0] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#da89cd]/20 transition hover:brightness-110"
                  >
                    Verify
                  </Button>
                </form>
              )}

              {step === 'reset' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="block text-sm font-semibold text-[#4a1053]"
                      >
                        Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        className="h-14 rounded-3xl border border-[#f0d7e6] bg-[#faf4f8] px-5 text-sm text-[#392c41] focus:border-[#e460a7] focus:ring-[#e460a7]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="block text-sm font-semibold text-[#4a1053]"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm password"
                        className="h-14 rounded-3xl border border-[#f0d7e6] bg-[#faf4f8] px-5 text-sm text-[#392c41] focus:border-[#e460a7] focus:ring-[#e460a7]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-[#f4dff0] bg-[#fff0f5] p-4 text-sm text-[#5a3f57]">
                    {requirements.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${item.test ? 'bg-[#c8f1d6] text-[#1f6a3e]' : 'bg-[#fbe7f2] text-[#af4a75]'}`}
                        >
                          {item.test ? '✔' : '✕'}
                        </span>
                        <span className={item.test ? 'text-[#3b1940]' : 'text-[#7d5c78]'}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-full bg-linear-to-r from-[#ff5fa1] to-[#b049f0] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#da89cd]/20 transition hover:brightness-110"
                  >
                    Confirm
                  </Button>
                </form>
              )}

              {step === 'success' && (
                <div className="rounded-[1.75rem] border border-[#f7d8ea] bg-[#ffffff] p-8 shadow-[0_20px_50px_rgba(101,45,99,0.15)]">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#d3fde1] text-[#1e6c3c] shadow-sm">
                    <span className="text-3xl">✓</span>
                  </div>
                  <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-bold text-[#281a33]">Password Changed!</h2>
                    <p className="mx-auto max-w-[24rem] text-sm leading-7 text-[#5a3f57]">
                      Your account is now secure. You can now log in with your new credentials.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => navigate('/login', { replace: true })}
                    className="mt-8 w-full rounded-full bg-[#32d77f] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#90e3b0]/30 transition hover:brightness-105"
                  >
                    Done
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

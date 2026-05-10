import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { forceChangePassword } from '@/api/auth';

function passwordRequirements(value: string) {
  return [
    { label: 'At least 8 characters', test: value.length >= 8 },
    { label: 'One uppercase letter', test: /[A-Z]/.test(value) },
    { label: 'One number', test: /[0-9]/.test(value) },
    { label: 'One special character', test: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) },
  ];
}

export function ForceResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = (location.state as { resetToken?: string })?.resetToken;

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const requirements = passwordRequirements(password);

  // If no reset token, redirect to login
  if (!resetToken) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fff5fb] via-[#ffe3f1] to-[#ffd6e6] py-12 sm:py-16 lg:py-24">
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="w-full rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(177,63,134,0.14)] backdrop-blur-sm sm:p-10">
            <CardContent className="pt-10 text-center">
              <h1 className="text-2xl font-bold text-[#24182f] mb-4">Session Expired</h1>
              <p className="text-sm text-[#5a3f57] mb-6">
                Your password reset session has expired or is invalid. Please log in again.
              </p>
              <Button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-full bg-gradient-to-r from-[#ff5fa1] to-[#b049f0] px-6 py-3 text-sm font-bold text-white shadow-xl transition hover:brightness-110"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

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
      await forceChangePassword(resetToken, password);
      setSuccess(true);
    } catch (err: unknown) {
      const apiError =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
          ? (err as { response: { data: { error: string } } }).response.data.error
          : 'Unable to change password. Please try again.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fff5fb] via-[#ffe3f1] to-[#ffd6e6] py-12 sm:py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_transparent_35%)]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white via-white/80 to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="w-full rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(177,63,134,0.14)] backdrop-blur-sm sm:p-10">
            <CardHeader className="pb-0">
              <div className="mb-8 flex items-center justify-end gap-4">
                <span className="rounded-full bg-[#fff0f9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#d63384] shadow-sm">
                  {success ? 'Done' : 'Reset Required'}
                </span>
              </div>

              <div className="space-y-3 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-[#24182f] sm:text-4xl">
                  {success ? 'Password Updated!' : 'Set a New Password'}
                </h1>
                <p className="mx-auto max-w-[26rem] text-sm leading-7 text-[#5a3f57] sm:text-base">
                  {success
                    ? 'Your password has been updated successfully. You can now log in with your new credentials.'
                    : 'Your password needs to be reset. Please create a new password to continue.'}
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-10">
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="force-new-password"
                        className="block text-sm font-semibold text-[#4a1053]"
                      >
                        New Password
                      </Label>
                      <Input
                        id="force-new-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter new password"
                        className="h-14 rounded-3xl border border-[#f0d7e6] bg-[#faf4f8] px-5 text-sm text-[#392c41] focus:border-[#e460a7] focus:ring-[#e460a7]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="force-confirm-password"
                        className="block text-sm font-semibold text-[#4a1053]"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="force-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm new password"
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
                    className="w-full rounded-full bg-gradient-to-r from-[#ff5fa1] to-[#b049f0] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#da89cd]/20 transition hover:brightness-110"
                  >
                    Set Password
                  </Button>
                </form>
              ) : (
                <div className="rounded-[1.75rem] border border-[#f7d8ea] bg-[#ffffff] p-8 shadow-[0_20px_50px_rgba(101,45,99,0.15)]">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#d3fde1] text-[#1e6c3c] shadow-sm">
                    <span className="text-3xl">✓</span>
                  </div>
                  <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-bold text-[#281a33]">You're All Set!</h2>
                    <p className="mx-auto max-w-[24rem] text-sm leading-7 text-[#5a3f57]">
                      Your password has been updated. You can now log in with your new credentials.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="mt-8 w-full rounded-full bg-[#32d77f] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#90e3b0]/30 transition hover:brightness-105"
                  >
                    Go to Login
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

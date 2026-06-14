import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  if (!resetToken) {
    return (
      <div className="bg-gradient-brand-soft flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="font-heading text-3xl font-semibold text-ink">Session expired</h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink/60">
            Your password reset session has expired or is invalid. Please log in again.
          </p>
          <Button
            type="button"
            onClick={() => navigate('/login')}
            className="bg-gradient-brand mt-8 h-12 w-full rounded-full font-ui text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:brightness-110"
          >
            Go to Login
          </Button>
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
        typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error ===
          'string'
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

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <img src="/Pictures/hero-7.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand/85 via-ink/70 to-brand-deep/80" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="h-16 w-auto object-contain brightness-0 invert"
            />
            <div className="space-y-4">
              <span className="eyebrow text-gold">Secure Your Account</span>
              <h2 className="font-heading text-4xl leading-tight font-semibold text-ivory">
                One last step <br />
                before we begin.
              </h2>
              <p className="max-w-md font-sans text-base leading-relaxed text-ivory/80">
                Set a fresh password and you&rsquo;re ready to manage your celebrations.
              </p>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="bg-gradient-brand-soft relative flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="relative z-10 w-full max-w-md">
            <span className="eyebrow text-brand">{success ? 'Complete' : 'Reset Required'}</span>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-ink">
              {success ? 'Password updated' : 'Set a new password'}
              <span className="text-brand">.</span>
            </h1>
            <p className="mt-3 font-sans text-sm leading-relaxed text-ink/60">
              {success
                ? 'Your password has been updated successfully. You can now log in with your new credentials.'
                : 'Your password needs to be reset. Please create a new password to continue.'}
            </p>

            <div className="mt-8">
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="force-new-password" className="font-ui text-xs font-semibold tracking-[0.1em] text-ink/70 uppercase">
                      New Password
                    </Label>
                    <Input
                      id="force-new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="force-confirm-password" className="font-ui text-xs font-semibold tracking-[0.1em] text-ink/70 uppercase">
                      Confirm Password
                    </Label>
                    <Input
                      id="force-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
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
                    Set Password
                  </Button>
                </form>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="h-8 w-8" />
                  </div>
                  <h2 className="font-heading text-2xl text-ink">You&rsquo;re all set!</h2>
                  <p className="mx-auto mt-3 max-w-xs font-sans text-sm leading-relaxed text-ink/60">
                    Your password has been updated. You can now log in with your new credentials.
                  </p>
                  <Button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="bg-gradient-brand mt-8 h-12 w-full rounded-full font-ui text-sm font-semibold tracking-[0.1em] text-white uppercase transition hover:brightness-110"
                  >
                    Go to Login
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

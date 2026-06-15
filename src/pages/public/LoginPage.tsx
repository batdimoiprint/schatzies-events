import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login(values.email, values.password);
    const user = result.user;

    if (result.requiresPasswordReset) {
      navigate('/force-reset-password', {
        replace: true,
        state: {
          email: values.email,
          resetToken: result.resetToken,
        },
      });
      return;
    }

    if (user) {
      switch (user.role) {
        case 'SYSADMIN':
          navigate('/sysadmin', { replace: true });
          break;
        case 'ADMIN':
          navigate('/admin', { replace: true });
          break;
        case 'ORGANIZER':
          navigate('/organizer', { replace: true });
          break;
        case 'CLIENT':
          navigate('/client', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    }
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="/Pictures/hero-3.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-deep/90 via-ink/70 to-brand/70" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="h-16 w-auto object-contain brightness-0 invert"
            />
            <div className="space-y-4">
              <h2 className="font-heading text-4xl leading-tight font-bold text-white">
                Welcome back to <br />
                Schatzies Events.
              </h2>
              <p className="max-w-md font-montserrat text-base leading-relaxed text-white/80">
                Sign in to manage your celebrations — from planning to the final standing ovation.
              </p>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="relative flex items-center justify-center bg-background px-4 py-12 sm:px-8">
          <div className="bg-gradient-brand-soft pointer-events-none absolute inset-0 lg:hidden" />
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 flex flex-col items-center space-y-3 text-center">
              <img
                src="/Pictures/business-logo.png"
                alt="Schatzies Events"
                className="h-16 w-auto sm:h-20"
              />
              <p className="font-montserrat text-sm font-medium text-foreground/70">
                Your <span className="text-gradient-brand font-bold uppercase">MOST TRUSTED</span>{' '}
                team!
              </p>
            </div>

            <h1 className="mb-8 text-center font-heading text-3xl font-bold tracking-wide text-foreground">
              LOGIN
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative">
                <User
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-brand"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="Username"
                  autoComplete="email"
                  className="h-11 rounded-xl pl-10"
                  {...register('email', { required: 'Email is required.' })}
                />
                {errors.email && (
                  <p className="mt-1 font-montserrat text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-brand"
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="h-11 rounded-xl px-10"
                  {...register('password', { required: 'Password is required.' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-brand transition-colors hover:text-brand-deep"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="mt-1 font-montserrat text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="font-montserrat text-xs font-medium text-brand transition-colors hover:text-brand-deep hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 font-montserrat text-xs text-destructive">
                  {error.includes('429')
                    ? 'Too many authentication attempts. Please try again after an hour.'
                    : error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="bg-gradient-brand h-12 w-full rounded-full text-base font-bold tracking-wide text-white uppercase shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl disabled:opacity-50"
              >
                {isLoading || isSubmitting ? 'Signing in...' : 'Login'}
              </Button>
            </form>

            <p className="mt-6 text-center font-montserrat text-xs text-muted-foreground">
              Back to{' '}
              <Link
                to="/"
                className="font-semibold text-brand transition-colors hover:text-brand-deep hover:underline"
              >
                home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

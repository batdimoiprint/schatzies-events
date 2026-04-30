import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

      <div className="relative min-h-screen overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-[#FF589C]/30 via-[#FD78AD]/20 to-transparent" />

        {/* Main content - centered vertically */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-0 bg-white/90 shadow-2xl backdrop-blur-sm">
            <CardContent className="pt-10 pb-8">
              {/* Logo/Brand Section */}
              <div className="mb-6 flex flex-col items-center space-y-3">
                <img
                  src="/Pictures/business-logo.png"
                  alt="Schatzies Events"
                  className="h-16 w-auto sm:h-20 lg:h-24"
                />

                <p className="text-sm font-medium font-sans text-[#3d2052]">
                  Your{' '}
                  <span className="font-bold uppercase bg-linear-to-r from-[#FF0066] to-[#4A1053] bg-clip-text text-transparent">
                    MOST TRUSTED
                  </span>{' '}
                  team!
                </p>
              </div>

              {/* Login Heading */}
              <h1 className="mb-8 text-center text-3xl font-bold font-heading text-black">LOGIN</h1>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF0066]">
                    <User size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Username"
                    autoComplete="email"
                    className="h-11 w-full rounded-xl border-gray-200 bg-white/80 pl-10 text-sm font-sans placeholder:text-gray-400 focus:border-[#FF0066] focus:ring-[#FF0066]/20"
                    {...register('email', {
                      required: 'Email is required.',
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 font-sans">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF0066]">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl border-gray-200 bg-white/80 pl-10 pr-10 text-sm font-sans placeholder:text-gray-400 focus:border-[#FF0066] focus:ring-[#FF0066]/20"
                    {...register('password', {
                      required: 'Password is required.',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF0066] transition-colors hover:text-[#4A1053]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 font-sans">{errors.password.message}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium font-sans text-[#FF0066] transition-colors hover:text-[#4A1053] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 font-sans">
                    {error.includes('429')
                      ? 'Too many authentication attempts. Please try again after an hour.'
                      : error}
                  </p>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="h-12 w-full rounded-full bg-linear-to-b from-[#FF0066] to-[#700F81] text-base font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl disabled:opacity-50 font-sans"
                >
                  {isLoading || isSubmitting ? 'Signing in...' : 'Login'}
                </Button>
              </form>

              {/* Back to Home */}
              <p className="mt-6 text-center text-xs text-gray-600 font-sans">
                Back to{' '}
                <Link
                  to="/"
                  className="font-semibold text-[#FF0066] transition-colors hover:text-[#4A1053] hover:underline"
                >
                  home
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

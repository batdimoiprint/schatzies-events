import { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';
import { replacePassword } from '@/api/users';
import { logout } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';

interface ChangePasswordModalProps {
  onPasswordChanged: () => void;
}

export function ChangePasswordModal({ onPasswordChanged }: ChangePasswordModalProps) {
  const { user, verifyToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const isNewPasswordLongEnough = newPassword.length >= 6;
  const canSubmit =
    currentPassword.trim() !== '' &&
    newPassword.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    passwordsMatch &&
    isNewPasswordLongEnough &&
    !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !user) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await replacePassword(user.user_id, currentPassword, newPassword);
      setSuccess(true);
      // Refresh user data so isPasswordChanged is updated in context
      await verifyToken();
      // Brief delay so user sees the success message
      setTimeout(() => {
        onPasswordChanged();
      }, 1200);
    } catch (err: unknown) {
      const apiError =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error ===
          'string'
          ? (err as { response: { data: { error: string } } }).response.data.error
          : err instanceof Error
            ? err.message
            : 'Unable to change password';
      setError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}
      >
        {/* Header gradient band */}
        <div
          className="px-6 py-5"
          style={{
            backgroundImage: 'linear-gradient(135deg, #700F81 0%, #FF0066 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Change Your Password</h2>
              <p className="text-xs text-white/80">
                For your security, please update your temporary password.
              </p>
            </div>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Error alert */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success alert */}
          {success && (
            <div className="flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 text-sm text-green-700">
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
              <span>Password changed successfully! Redirecting...</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label
              htmlFor="change-pw-current"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Current Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="change-pw-current"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-[#700F81] focus:bg-white focus:ring-2 focus:ring-[#700F81]/20"
                disabled={isSubmitting || success}
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="change-pw-new"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="change-pw-new"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-[#700F81] focus:bg-white focus:ring-2 focus:ring-[#700F81]/20"
                disabled={isSubmitting || success}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword.length > 0 && !isNewPasswordLongEnough && (
              <p className="mt-1 text-xs text-amber-600">
                Password must be at least 6 characters.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="change-pw-confirm"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="change-pw-confirm"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className={`w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition-colors focus:bg-white focus:ring-2 ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-[#700F81] focus:ring-[#700F81]/20'
                }`}
                disabled={isSubmitting || success}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!canSubmit || success}
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
            style={{
              backgroundImage:
                canSubmit && !success
                  ? 'linear-gradient(135deg, #700F81 0%, #FF0066 100%)'
                  : undefined,
              backgroundColor: canSubmit && !success ? undefined : '#a0a0a0',
            }}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Changing Password...
              </span>
            ) : success ? (
              'Password Changed ✓'
            ) : (
              'Change Password'
            )}
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.reload(); // Refresh to trigger redirect to login
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600 active:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>

        {/* Bottom note */}
        <div className="px-6 pb-4">
          <p className="text-center text-[11px] text-gray-400">
            This window cannot be closed until you change your password.
          </p>
        </div>
      </div>

      {/* Inline keyframe animation */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

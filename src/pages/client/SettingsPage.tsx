import { useState } from 'react';
import { Bell, Eye, EyeOff, Shield, Palette, Globe } from 'lucide-react';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        enabled ? 'bg-[#df2b80]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [rsvpAlerts, setRsvpAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-[#2d2834] md:text-4xl">Settings</h1>
        <p className="mt-1 text-sm font-medium text-[#696373]">
          Manage your account preferences and security.
        </p>
      </div>

      {/* Success toast */}
      {saved && (
        <div
          className="mb-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          Settings saved successfully!
        </div>
      )}

      <div className="flex flex-col gap-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {/* ── Notification Preferences ── */}
        <section className="overflow-hidden rounded-xl border border-[#ece7f2] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#ece7f2] px-6 py-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-pink-100 text-[#df2b80]">
              <Bell className="size-4" />
            </div>
            <h2 className="text-base font-bold text-[#2d2834]">Notification Preferences</h2>
          </div>
          <div className="divide-y divide-[#ece7f2] px-6">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-[#2d2834]">Email Notifications</p>
                <p className="text-xs text-[#696373]">Receive event updates via email</p>
              </div>
              <Toggle enabled={emailNotifs} onToggle={() => setEmailNotifs((v) => !v)} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-[#2d2834]">Push Notifications</p>
                <p className="text-xs text-[#696373]">Get real-time browser notifications</p>
              </div>
              <Toggle enabled={pushNotifs} onToggle={() => setPushNotifs((v) => !v)} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-[#2d2834]">RSVP Alerts</p>
                <p className="text-xs text-[#696373]">
                  Notify when guests respond to your invitation
                </p>
              </div>
              <Toggle enabled={rsvpAlerts} onToggle={() => setRsvpAlerts((v) => !v)} />
            </div>
          </div>
        </section>

        {/* ── Privacy & Security ── */}
        <section className="overflow-hidden rounded-xl border border-[#ece7f2] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#ece7f2] px-6 py-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Shield className="size-4" />
            </div>
            <h2 className="text-base font-bold text-[#2d2834]">Privacy & Security</h2>
          </div>
          <div className="divide-y divide-[#ece7f2] px-6">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-[#2d2834]">Two-Factor Authentication</p>
                <p className="text-xs text-[#696373]">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Toggle enabled={twoFactor} onToggle={() => setTwoFactor((v) => !v)} />
            </div>
            <div className="py-4">
              <p className="mb-3 text-sm font-medium text-[#2d2834]">Change Password</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Current password"
                    className="w-full rounded-lg border border-[#ece7f2] px-3.5 py-2.5 pr-10 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80] focus:ring-2 focus:ring-pink-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696373]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <div className="relative flex-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    className="w-full rounded-lg border border-[#ece7f2] px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80] focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Preferences ── */}
        <section className="overflow-hidden rounded-xl border border-[#ece7f2] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#ece7f2] px-6 py-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
              <Palette className="size-4" />
            </div>
            <h2 className="text-base font-bold text-[#2d2834]">Preferences</h2>
          </div>
          <div className="divide-y divide-[#ece7f2] px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-[#696373]" />
                <div>
                  <p className="text-sm font-medium text-[#2d2834]">Language</p>
                  <p className="text-xs text-[#696373]">Choose your preferred language</p>
                </div>
              </div>
              <select className="rounded-lg border border-[#ece7f2] bg-white px-3 py-1.5 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80]">
                <option>English</option>
                <option>Filipino</option>
              </select>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-lg bg-[#df2b80] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c41e6d]"
          >
            Save Settings
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

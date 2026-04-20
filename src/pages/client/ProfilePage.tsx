import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';

const AVATAR_SRC = '/Pictures/organizerpics/Profile Picture.png';

const INITIAL_PROFILE = {
  firstName: 'Cj',
  lastName: 'Herminigildo',
  email: 'cjherminigildo@gmail.com',
  phone: '+63 917 123 4567',
  address: 'Quezon City, Metro Manila',
  birthday: '1998-06-15',
};

export function ProfilePage() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-[#2d2834] md:text-4xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm font-medium text-[#696373]">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile card */}
      <div
        className="overflow-hidden rounded-xl border border-[#ece7f2] bg-white shadow-sm"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Banner */}
        <div className="relative h-28 bg-gradient-to-r from-pink-400 to-purple-500">
          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <img
                src={AVATAR_SRC}
                alt="Profile"
                className="size-24 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <button
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-[#df2b80] text-white shadow-md transition hover:bg-[#c41e6d]"
                aria-label="Change photo"
              >
                <Camera className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Name + Edit */}
        <div className="flex items-end justify-between px-6 pt-14 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#2d2834]">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-[#696373]">Client Account</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg bg-[#df2b80] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c41e6d]"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600"
            >
              <Save className="size-4" />
              Save Changes
            </button>
          )}
        </div>

        {/* Success toast */}
        {saved && (
          <div
            className="mx-6 mb-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700"
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          >
            Profile updated successfully!
          </div>
        )}

        {/* Fields */}
        <div className="border-t border-[#ece7f2] px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#696373]">
                First Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full rounded-lg border border-[#ece7f2] px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80] focus:ring-2 focus:ring-pink-100"
                />
              ) : (
                <p className="text-sm font-medium text-[#2d2834]">{profile.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#696373]">
                Last Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full rounded-lg border border-[#ece7f2] px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80] focus:ring-2 focus:ring-pink-100"
                />
              ) : (
                <p className="text-sm font-medium text-[#2d2834]">{profile.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#696373]">
                <Mail className="size-3.5" /> Email
              </label>
              {editing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full rounded-lg border border-[#ece7f2] px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80] focus:ring-2 focus:ring-pink-100"
                />
              ) : (
                <p className="text-sm font-medium text-[#2d2834]">{profile.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#696373]">
                <Phone className="size-3.5" /> Phone
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full rounded-lg border border-[#ece7f2] px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80] focus:ring-2 focus:ring-pink-100"
                />
              ) : (
                <p className="text-sm font-medium text-[#2d2834]">{profile.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#696373]">
                <MapPin className="size-3.5" /> Address
              </label>
              {editing ? (
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full rounded-lg border border-[#ece7f2] px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80] focus:ring-2 focus:ring-pink-100"
                />
              ) : (
                <p className="text-sm font-medium text-[#2d2834]">{profile.address}</p>
              )}
            </div>

            {/* Birthday */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#696373]">
                <Calendar className="size-3.5" /> Birthday
              </label>
              {editing ? (
                <input
                  type="date"
                  value={profile.birthday}
                  onChange={(e) => handleChange('birthday', e.target.value)}
                  className="w-full rounded-lg border border-[#ece7f2] px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:border-[#df2b80] focus:ring-2 focus:ring-pink-100"
                />
              ) : (
                <p className="text-sm font-medium text-[#2d2834]">
                  {new Date(profile.birthday).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
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

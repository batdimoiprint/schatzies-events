import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';

const AVATAR_SRC = '/Pictures/organizerpics/Profile Picture.png';

const INITIAL_PROFILE = {
  firstName: 'Cj',
  lastName: 'Herminigildo',
  email: 'cjherminigildo@gmail.com',
  phone: '9171234567',
  address: 'Quezon City, Metro Manila',
  birthday: '1998-06-15',
};

export function ProfilePage() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [originalProfile, setOriginalProfile] = useState(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    const isValid = emailRegex.test(email);
    if (!isValid && email !== '') {
      setEmailError('Please enter a valid email address (e.g., name@example.com)');
    } else {
      setEmailError('');
    }
    return isValid;
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    let digits = value.replace(/\D/g, '');

    // Remove leading 63 or 0 if present
    if (digits.startsWith('63')) {
      digits = digits.slice(2);
    }
    if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }

    // Limit to 10 digits (PH mobile number length)
    digits = digits.slice(0, 10);

    return digits;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }

    // Check if exactly 10 digits
    if (phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      return false;
    }

    // Check if starts with 9 (mobile number)
    if (!phone.startsWith('9')) {
      setPhoneError('Must start with 9 (e.g., 9123456789)');
      return false;
    }

    setPhoneError('');
    return true;
  };

  const handleEmailChange = (value: string) => {
    validateEmail(value);
    setProfile((prev) => ({ ...prev, email: value }));
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setProfile((prev) => ({ ...prev, phone: formatted }));
    if (formatted) {
      validatePhoneNumber(formatted);
    } else {
      setPhoneError('');
    }
  };

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const openConfirmModal = () => {
    // Validate email and phone before showing modal
    let isValid = true;

    if (profile.email && !validateEmail(profile.email)) {
      isValid = false;
    }

    if (profile.phone && !validatePhoneNumber(profile.phone)) {
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleSave = () => {
    setOriginalProfile(profile);
    setEditing(false);
    setShowConfirmModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
    setShowConfirmModal(false);
    setEmailError('');
    setPhoneError('');
  };

  // Get changed fields
  const getChangedFields = () => {
    const changes: { field: string; oldValue: string; newValue: string }[] = [];
    const fieldLabels: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      birthday: 'Birthday',
    };

    (Object.keys(profile) as Array<keyof typeof profile>).forEach((key) => {
      if (profile[key] !== originalProfile[key]) {
        let displayOldValue = originalProfile[key];
        let displayNewValue = profile[key];

        if (key === 'birthday') {
          displayOldValue = new Date(originalProfile[key]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          displayNewValue = new Date(profile[key]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }

        if (key === 'phone') {
          displayOldValue = `+63 ${originalProfile[key].slice(0, 3)} ${originalProfile[key].slice(3, 6)} ${originalProfile[key].slice(6)}`;
          displayNewValue = `+63 ${profile[key].slice(0, 3)} ${profile[key].slice(3, 6)} ${profile[key].slice(6)}`;
        }

        changes.push({
          field: fieldLabels[key] || key,
          oldValue: displayOldValue,
          newValue: displayNewValue,
        });
      }
    });
    return changes;
  };

  const changedFields = getChangedFields();
  const hasChanges = changedFields.length > 0;

  // Format phone for display
  const formatDisplayPhone = (phone: string) => {
    if (!phone) return '';
    return `+63 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  };

  return (
    <>
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
                onClick={() => {
                  setOriginalProfile(profile);
                  setEditing(true);
                }}
                className="rounded-lg bg-[#df2b80] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c41e6d]"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={openConfirmModal}
                  disabled={!hasChanges || !!emailError || !!phoneError}
                  className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition ${
                    hasChanges && !emailError && !phoneError
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Save className="size-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
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
                  <div>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:ring-2 ${
                        emailError
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                          : 'border-[#ece7f2] focus:border-[#df2b80] focus:ring-pink-100'
                      }`}
                    />
                    {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                  </div>
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
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        +63
                      </span>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="9123456789"
                        className={`w-full rounded-lg border pl-12 px-3.5 py-2.5 text-sm text-[#2d2834] outline-none transition focus:ring-2 ${
                          phoneError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                            : 'border-[#ece7f2] focus:border-[#df2b80] focus:ring-pink-100'
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400">
                      Enter 10-digit mobile number (e.g., 9123456789)
                    </p>
                    {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-[#2d2834]">
                    {formatDisplayPhone(profile.phone)}
                  </p>
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Save className="size-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2d2834]">Confirm Changes</h3>
                </div>
                <button
                  onClick={closeConfirmModal}
                  className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body - Show Changes */}
              <div className="p-6">
                <p className="mb-4 text-[#4f4a56]">
                  Are you sure you want to make these changes to your profile?
                </p>

                {changedFields.length > 0 && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                    <div className="bg-gray-50 px-4 py-2">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Changes Summary
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {changedFields.map((change, index) => (
                        <div key={index} className="px-4 py-3">
                          <p className="text-sm font-semibold text-[#2d2834]">{change.field}</p>
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            <span className="text-gray-400 line-through">{change.oldValue}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-green-600">{change.newValue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 border-t border-gray-100 p-4">
                <button
                  onClick={closeConfirmModal}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#696373] transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-600"
                >
                  Yes, Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

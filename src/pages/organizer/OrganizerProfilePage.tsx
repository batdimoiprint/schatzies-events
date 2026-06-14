import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { getUserById, updateUser } from '@/api/users';

// Fallback image in case the main avatar fails to load
const FALLBACK_AVATAR = '/Pictures/business-logo.png';

const EMPTY_PROFILE = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  birthday: '',
  profilePic: '',
};

// Simple in-memory cache so repeat visits don't re-fetch
let profileCache: { userId: string; data: typeof EMPTY_PROFILE } | null = null;

function mapUserToProfile(fetchedUser: {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber?: string;
  houseNumber?: string;
  street?: string;
  barangay?: string;
  city?: string;
  country?: string;
  birthDate?: string;
  profilePic?: string;
}) {
  let phone = fetchedUser.contactNumber || '';
  if (phone.startsWith('+63')) phone = phone.slice(3).trim();
  if (phone.startsWith('63')) phone = phone.slice(2);
  if (phone.startsWith('0')) phone = phone.slice(1);
  phone = phone.replace(/\D/g, '').slice(0, 10);

  return {
    firstName: fetchedUser.firstName,
    lastName: fetchedUser.lastName,
    email: fetchedUser.email,
    phone,
    address: [
      fetchedUser.houseNumber,
      fetchedUser.street,
      fetchedUser.barangay,
      fetchedUser.city,
      fetchedUser.country,
    ]
      .filter(Boolean)
      .join(', '),
    birthday: fetchedUser.birthDate || '',
    profilePic: fetchedUser.profilePic || '',
  };
}

export function OrganizerProfilePage() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [originalProfile, setOriginalProfile] = useState(EMPTY_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState(FALLBACK_AVATAR);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user, setAuthenticatedUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track which user ID we've already loaded to prevent duplicate fetches
  const loadedUserIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadProfileData = useCallback(async (userId: string) => {
    // Already loaded for this user — use cache
    if (loadedUserIdRef.current === userId && profileCache?.userId === userId) {
      setProfile(profileCache.data);
      setOriginalProfile(profileCache.data);
      setAvatarSrc(profileCache.data.profilePic || FALLBACK_AVATAR);
      setIsLoading(false);
      return;
    }

    // If there's an in-flight request, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setFetchError(null);

    try {
      const fetchedUser = await getUserById(userId);
      const mapped = mapUserToProfile(fetchedUser);

      // Update cache
      profileCache = { userId, data: mapped };
      loadedUserIdRef.current = userId;

      setProfile(mapped);
      setOriginalProfile(mapped);
      setAvatarSrc(mapped.profilePic || FALLBACK_AVATAR);
    } catch (error: unknown) {
      // Don't update state if aborted
      if (error instanceof DOMException && error.name === 'AbortError') return;

      console.error('Failed to load profile:', error);

      // On rate-limit (429) or server error, show a user-friendly message
      // but do NOT reset loadedUserIdRef — prevent retry loops
      const status =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;

      if (status === 429) {
        setFetchError('Too many requests. Please wait a moment and try again.');
      } else {
        setFetchError('Failed to load profile data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Single effect: react to user changes (covers both initial mount and user switch)
  useEffect(() => {
    if (user?.user_id) {
      loadProfileData(user.user_id);
    } else {
      // User logged out — reset everything
      loadedUserIdRef.current = null;
      profileCache = null;
      setProfile(EMPTY_PROFILE);
      setOriginalProfile(EMPTY_PROFILE);
      setIsLoading(false);
    }

    // Cleanup: abort in-flight fetch if component unmounts or user changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user?.user_id, loadProfileData]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const handleSave = async () => {
    const currentUserId = user?.user_id;
    if (!currentUserId) return;
    setShowConfirmModal(false);
    setIsSaving(true);
    try {
      let result;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('firstName', profile.firstName);
        formData.append('lastName', profile.lastName);
        formData.append('email', profile.email);
        formData.append('contactNumber', `+63${profile.phone}`);
        if (profile.birthday) formData.append('birthDate', profile.birthday);
        formData.append('profilePic', selectedFile);

        result = await updateUser(currentUserId, formData);
      } else {
        result = await updateUser(currentUserId, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          contactNumber: `+63${profile.phone}`,
          birthDate: profile.birthday || undefined,
        });
      }

      const updatedProfile = mapUserToProfile(result);
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setAvatarSrc(updatedProfile.profilePic || FALLBACK_AVATAR);
      setSelectedFile(null);

      // Keep auth context in sync so top bars update immediately.
      if (user) {
        setAuthenticatedUser({
          ...user,
          ...result,
          profilePic: result.profilePic || '',
        });
      }

      // Update cache with saved data
      profileCache = { userId: currentUserId, data: updatedProfile };

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setAvatarSrc(originalProfile.profilePic || FALLBACK_AVATAR);
    setSelectedFile(null);
    setEditing(false);
    setShowConfirmModal(false);
    setEmailError('');
    setPhoneError('');
  };

  const handleRetry = () => {
    if (user?.user_id) {
      // Clear cache so it actually re-fetches
      loadedUserIdRef.current = null;
      profileCache = null;
      loadProfileData(user.user_id);
    }
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
      if (key === 'profilePic') return;

      if (profile[key] !== originalProfile[key]) {
        let displayOldValue = originalProfile[key];
        let displayNewValue = profile[key];

        if (key === 'birthday') {
          displayOldValue = originalProfile[key]
            ? new Date(originalProfile[key]).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Not set';
          displayNewValue = profile[key]
            ? new Date(profile[key]).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Not set';
        }

        if (key === 'phone') {
          displayOldValue = originalProfile[key]
            ? `+63 ${originalProfile[key].slice(0, 3)} ${originalProfile[key].slice(3, 6)} ${originalProfile[key].slice(6)}`
            : 'Not set';
          displayNewValue = profile[key]
            ? `+63 ${profile[key].slice(0, 3)} ${profile[key].slice(3, 6)} ${profile[key].slice(6)}`
            : 'Not set';
        }

        changes.push({
          field: fieldLabels[key] || key,
          oldValue: displayOldValue,
          newValue: displayNewValue,
        });
      }
    });

    if (selectedFile) {
      changes.push({
        field: 'Profile Picture',
        oldValue: originalProfile.profilePic ? 'Current photo' : 'No photo',
        newValue: 'New photo selected',
      });
    }

    return changes;
  };

  const changedFields = getChangedFields();
  const hasChanges = changedFields.length > 0;

  // Format phone for display
  const formatDisplayPhone = (phone: string) => {
    if (!phone) return '';
    return `+63 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="h-9 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="h-28 animate-pulse bg-gradient-to-r from-pink-200 to-purple-200" />
          <div className="px-6 pt-14 pb-6 space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="grid gap-5 sm:grid-cols-2 mt-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200 mb-2" />
                  <div className="h-5 w-36 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with retry button
  if (fetchError) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            My Profile
          </h1>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm p-8 text-center">
          <p className="text-muted-foreground mb-4">{fetchError}</p>
          <button
            onClick={handleRetry}
            className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c41e6d]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingScreen isLoading={isSaving} />
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            My Profile
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile card */}
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          {/* Banner */}
          <div className="relative h-28 bg-gradient-to-r from-pink-400 to-purple-500">
            {/* Avatar */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  className={`relative ${editing ? 'cursor-pointer' : ''}`}
                  onClick={() => editing && fileInputRef.current?.click()}
                >
                  {avatarLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                    </div>
                  )}
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className={`size-24 rounded-full border-4 border-white object-cover shadow-lg transition-opacity duration-300 ${
                      avatarLoading ? 'opacity-0' : 'opacity-100'
                    } ${editing ? 'hover:brightness-90' : ''}`}
                    onError={() => {
                      console.warn('Profile image failed to load, using fallback');
                      setAvatarSrc(FALLBACK_AVATAR);
                      setAvatarLoading(false);
                    }}
                    onLoad={() => {
                      setAvatarLoading(false);
                    }}
                  />
                  {editing && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                      <Camera className="size-6 text-white" />
                    </div>
                  )}
                </div>
                {editing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-brand text-white shadow-md transition hover:bg-[#c41e6d]"
                    aria-label="Change photo"
                  >
                    <Camera className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name + Edit */}
          <div className="flex items-end justify-between px-6 pt-14 pb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">Client Account</p>
            </div>
            {!editing ? (
              <button
                onClick={() => {
                  setOriginalProfile(profile);
                  setEditing(true);
                }}
                className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c41e6d]"
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
            <div className="mx-6 mb-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
              Profile updated successfully!
            </div>
          )}

          {/* Fields */}
          <div className="border-t border-border px-6 py-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  First Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-pink-100"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{profile.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Last Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-pink-100"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{profile.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Mail className="size-3.5" /> Email
                </label>
                {editing ? (
                  <div>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 ${
                        emailError
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                          : 'border-border focus:border-brand focus:ring-pink-100'
                      }`}
                    />
                    {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-foreground">{profile.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                        className={`w-full rounded-lg border pl-12 px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 ${
                          phoneError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                            : 'border-border focus:border-brand focus:ring-pink-100'
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400">
                      Enter 10-digit mobile number (e.g., 9123456789)
                    </p>
                    {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {formatDisplayPhone(profile.phone)}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <MapPin className="size-3.5" /> Address
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-pink-100"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{profile.address}</p>
                )}
              </div>

              {/* Birthday */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="size-3.5" /> Birthday
                </label>
                {editing ? (
                  <input
                    type="date"
                    value={profile.birthday}
                    onChange={(e) => handleChange('birthday', e.target.value)}
                    className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-pink-100"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {profile.birthday
                      ? new Date(profile.birthday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
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
                  <h3 className="text-lg font-semibold text-foreground">Confirm Changes</h3>
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
                <p className="mb-4 text-foreground/80">
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
                          <p className="text-sm font-semibold text-foreground">{change.field}</p>
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
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-gray-50"
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

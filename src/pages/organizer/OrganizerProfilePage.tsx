import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { getUserById, updateUser } from '@/api/users';
import LoadingScreen from '@/components/ui/LoadingScreen';

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

function mapUserToProfile(fetchedUser: any) {
  let phone = fetchedUser.contactNumber || '';
  if (phone.startsWith('+63')) phone = phone.slice(3).trim();
  if (phone.startsWith('63')) phone = phone.slice(2);
  if (phone.startsWith('0')) phone = phone.slice(1);
  phone = phone.replace(/\D/g, '').slice(0, 10);

  return {
    firstName: fetchedUser.firstName || '',
    lastName: fetchedUser.lastName || '',
    email: fetchedUser.email || '',
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
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [originalProfile, setOriginalProfile] = useState(EMPTY_PROFILE);
  const [avatarSrc, setAvatarSrc] = useState(FALLBACK_AVATAR);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [coverUrl, setCoverUrl] = useState(() => {
    return localStorage.getItem('organizer_cover_url') || '';
  });
  
  const [avatarPos] = useState(() => {
    return Number(localStorage.getItem('organizer_avatar_pos')) || 50;
  });
  const [coverPos] = useState(() => {
    return Number(localStorage.getItem('organizer_cover_pos')) || 50;
  });

  const loadProfileData = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const fetchedUser = await getUserById(userId);
      const mapped = mapUserToProfile(fetchedUser);
      setProfile(mapped);
      setOriginalProfile(mapped);
      setAvatarSrc(mapped.profilePic || FALLBACK_AVATAR);
    } catch (error) {
      console.error('Failed to load organizer profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.user_id) {
      loadProfileData(user.user_id);
    }
  }, [user?.user_id, loadProfileData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCoverUrl(base64String);
        localStorage.setItem('organizer_cover_url', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user?.user_id) return;
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
        result = await updateUser(user.user_id, formData);
      } else {
        result = await updateUser(user.user_id, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          contactNumber: `+63${profile.phone}`,
          birthDate: profile.birthday || undefined,
        });
      }

      const updated = mapUserToProfile(result);
      setProfile(updated);
      setOriginalProfile(updated);
      setAvatarSrc(updated.profilePic || FALLBACK_AVATAR);
      setSelectedFile(null);
      
      localStorage.setItem('organizer_avatar_pos', avatarPos.toString());
      localStorage.setItem('organizer_cover_pos', coverPos.toString());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save organizer profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setAvatarSrc(originalProfile.profilePic || FALLBACK_AVATAR);
    setSelectedFile(null);
    setIsEditing(false);
  };

  if (isLoading) return <LoadingScreen isLoading={true} />;

  return (
    <>
      <LoadingScreen isLoading={isSaving} />
      <div className="mx-auto max-w-4xl p-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-hidden rounded-2xl border border-[#ece7f2] bg-white shadow-[0_8px_20px_rgba(46,22,76,0.05)]">
          <div className="relative h-32 w-full group">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt="Cover"
                style={{ objectPosition: `center ${coverPos}%` }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-r from-[#df2b80] to-[#8f1fd1]" />
            )}

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={coverInputRef}
                  onChange={handleCoverChange}
                />
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/70"
                >
                  <Camera className="size-3.5" />
                  Edit Cover
                </button>
              </>
            )}
          </div>

          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6 flex items-end justify-between">
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  style={{ objectPosition: `${avatarPos}% center` }}
                  className="size-24 rounded-full border-4 border-white bg-white object-cover shadow-sm"
                  onError={() => setAvatarSrc(FALLBACK_AVATAR)}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#df2b80] text-white shadow-md transition-colors hover:bg-[#c42871]"
                  title="Change Profile Picture"
                >
                  <Camera className="size-4" />
                </button>
              </div>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="h-9 rounded-lg bg-[#df2b80] px-5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#c42871]"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="h-9 rounded-lg border-[#ece7f2] font-bold text-[#4f4a56] hover:bg-[#f6f5f8]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="h-9 rounded-lg bg-[#e2deea] font-bold text-[#8f879f] hover:bg-[#d7cbe7] hover:text-[#4f4a56]"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
...
            <div className="mb-6 border-b border-[#ece7f2] pb-4">
              <p className="text-[13px] font-bold text-[#696373]">Organizer Account</p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                  First Name
                </Label>
                {isEditing ? (
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[#4f4a56]">
                    {profile.firstName || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                  Last Name
                </Label>
                {isEditing ? (
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[#4f4a56]">
                    {profile.lastName || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                  <Mail className="size-3.5 text-[#a49cb3]" /> Email
                </Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[#4f4a56]">{profile.email || '-'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                  <Phone className="size-3.5 text-[#a49cb3]" /> Phone
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                    />
                    <p className="mt-1.5 text-[10px] text-[#a49cb3]">
                      Enter 10-digit mobile number (e.g., 9123456789)
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-[#4f4a56]">{profile.phone || '-'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                  <MapPin className="size-3.5 text-[#a49cb3]" /> Address
                </Label>
                {isEditing ? (
                  <Input
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Enter your address"
                    className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[#4f4a56]">{profile.address || '-'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                  <Calendar className="size-3.5 text-[#a49cb3]" /> Birthday
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={profile.birthday}
                    onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                    className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#4f4a56] focus-visible:ring-[#df2b80]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-[#4f4a56]">
                    {profile.birthday || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

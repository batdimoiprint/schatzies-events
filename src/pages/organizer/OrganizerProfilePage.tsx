import { useState, useRef } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function OrganizerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState(() => {
    return localStorage.getItem('organizer_cover_url') || '';
  });
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return (
      localStorage.getItem('organizer_avatar_url') || '/Pictures/organizerpics/Profile Picture.png'
    );
  });
  const [avatarPos, setAvatarPos] = useState(() => {
    return Number(localStorage.getItem('organizer_avatar_pos')) || 50;
  });
  const [coverPos, setCoverPos] = useState(() => {
    return Number(localStorage.getItem('organizer_cover_pos')) || 50;
  });

  const [profileData, setProfileData] = useState({
    firstName: 'cj',
    lastName: 'Perandos',
    email: 'cjperandos52@gmail.com',
    phone: '+63 9940216509',
    address: '',
    birthday: '',
  });

  const [draftProfile, setDraftProfile] = useState(profileData);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem('organizer_avatar_url', base64String);
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

  const handleSave = () => {
    setProfileData(draftProfile);
    localStorage.setItem('organizer_avatar_pos', avatarPos.toString());
    localStorage.setItem('organizer_cover_pos', coverPos.toString());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftProfile(profileData);
    setIsEditing(false);
  };

  return (
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
                src={avatarUrl}
                alt="Profile"
                style={{ objectPosition: `${avatarPos}% center` }}
                className="size-24 rounded-full border-4 border-white bg-white object-cover shadow-sm"
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

          {isEditing && (
            <div className="mt-4 p-4 bg-[#f6f5f8] rounded-xl border border-dashed border-[#e2deea] space-y-4">
              <p className="text-[11px] font-bold uppercase text-[#8f879f]">
                Adjust Photo Position
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px]">Profile Position</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={avatarPos}
                    onChange={(e) => setAvatarPos(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#e2deea] rounded-lg appearance-none cursor-pointer accent-[#df2b80]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Cover Position</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={coverPos}
                    onChange={(e) => setCoverPos(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#e2deea] rounded-lg appearance-none cursor-pointer accent-[#8f1fd1]"
                  />
                </div>
              </div>
            </div>
          )}

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
                  value={draftProfile.firstName}
                  onChange={(e) => setDraftProfile({ ...draftProfile, firstName: e.target.value })}
                  className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                />
              ) : (
                <p className="text-sm font-semibold text-[#4f4a56]">
                  {profileData.firstName || '-'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                Last Name
              </Label>
              {isEditing ? (
                <Input
                  value={draftProfile.lastName}
                  onChange={(e) => setDraftProfile({ ...draftProfile, lastName: e.target.value })}
                  className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                />
              ) : (
                <p className="text-sm font-semibold text-[#4f4a56]">
                  {profileData.lastName || '-'}
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
                  value={draftProfile.email}
                  onChange={(e) => setDraftProfile({ ...draftProfile, email: e.target.value })}
                  className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                />
              ) : (
                <p className="text-sm font-semibold text-[#4f4a56]">{profileData.email || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                <Phone className="size-3.5 text-[#a49cb3]" /> Phone
              </Label>
              {isEditing ? (
                <div>
                  <Input
                    value={draftProfile.phone}
                    onChange={(e) => setDraftProfile({ ...draftProfile, phone: e.target.value })}
                    className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                  />
                  <p className="mt-1.5 text-[10px] text-[#a49cb3]">
                    Enter 10-digit mobile number (e.g., 9123456789)
                  </p>
                </div>
              ) : (
                <p className="text-sm font-semibold text-[#4f4a56]">{profileData.phone || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                <MapPin className="size-3.5 text-[#a49cb3]" /> Address
              </Label>
              {isEditing ? (
                <Input
                  value={draftProfile.address}
                  onChange={(e) => setDraftProfile({ ...draftProfile, address: e.target.value })}
                  placeholder="Enter your address"
                  className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#2d2834] focus-visible:ring-[#df2b80]"
                />
              ) : (
                <p className="text-sm font-semibold text-[#4f4a56]">{profileData.address || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8f879f]">
                <Calendar className="size-3.5 text-[#a49cb3]" /> Birthday
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={draftProfile.birthday}
                  onChange={(e) => setDraftProfile({ ...draftProfile, birthday: e.target.value })}
                  className="h-10 rounded-lg border-[#ece7f2] text-sm font-semibold text-[#4f4a56] focus-visible:ring-[#df2b80]"
                />
              ) : (
                <p className="text-sm font-semibold text-[#4f4a56]">
                  {profileData.birthday || '-'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

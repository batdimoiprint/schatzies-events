import { updateUser } from '@/api/users';
import type { UserResponse } from '@/api/users';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface UserDetailsPopoverProps {
  user: UserResponse;
  onUpdate: () => void;
  children: React.ReactNode;
}

export function UserDetailsPopover({ user, onUpdate, children }: UserDetailsPopoverProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (newRole: string) => {
    try {
      setIsUpdating(true);
      setError(null);
      await updateUser(user.user_id, { role: newRole });
      onUpdate();
    } catch (err) {
      console.error('Failed to update role:', err);
      setError('Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  const address =
    [user.houseNumber, user.street, user.barangay, user.city, user.country]
      .filter(Boolean)
      .join(', ') || '-';

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-base leading-none">User Details</h4>
            <p className="text-sm text-muted-foreground">
              Detailed information for the selected user.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-3 items-start gap-4">
              <Label className="text-right pt-1">Name</Label>
              <div className="col-span-2 text-sm font-medium">
                {user.firstName} {user.middleName ? `${user.middleName} ` : ''}
                {user.lastName}
              </div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <Label className="text-right pt-1">Email</Label>
              <div className="col-span-2 text-sm break-all">{user.email}</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <div className="col-span-2 flex items-center gap-2">
                <Select
                  defaultValue={user.role}
                  onValueChange={handleRoleChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger id="role" className="h-8">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="ORGANIZER">Organizer</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <Label className="text-right pt-1">Contact</Label>
              <div className="col-span-2 text-sm">{user.contactNumber || '-'}</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <Label className="text-right pt-1">Address</Label>
              <div className="col-span-2 text-sm">{address}</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <Label className="text-right pt-1">Created</Label>
              <div className="col-span-2 text-sm">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '-'}
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  type UserResponse,
  type UserPayload,
} from '@/api/users';
import { getVerifiedEmails, type VerifiedEmail } from '@/api/email-verification';
import {
  Plus,
  Trash2,
  Users,
  UserCircle,
  Briefcase,
  Shield,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Mail,
  BadgeCheck,
} from 'lucide-react';
import { UserDetailsPopover } from '@/components/admin/UserDetailsPopover';

const initialFormState: UserPayload = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  password: '',
  birthDate: '',
  houseNumber: '',
  street: '',
  barangay: '',
  city: '',
  country: '',
  gender: '',
  contactNumber: '',
  role: 'CLIENT',
};

type UserSortField = 'name' | 'email' | 'role' | 'contact' | 'created';
type TabView = 'users' | 'verified-emails';

export function UsersManagement() {
  const [activeTab, setActiveTab] = useState<TabView>('users');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserPayload>(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  // Search, sort & pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<UserSortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Verified emails state
  const [verifiedEmails, setVerifiedEmails] = useState<VerifiedEmail[]>([]);
  const [veLoading, setVeLoading] = useState(false);
  const [veSearch, setVeSearch] = useState('');
  const [vePage, setVePage] = useState(1);
  const vePerPage = 15;

  // State for role confirmation dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    userId: string;
    userName: string;
    oldRole: string;
    newRole: string;
  } | null>(null);

  // State for delete confirmation dialog
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch verified emails when that tab is activated
  const fetchVerifiedEmails = async () => {
    try {
      setVeLoading(true);
      const data = await getVerifiedEmails();
      setVerifiedEmails(data.emails);
    } catch (err) {
      console.error('Failed to fetch verified emails:', err);
    } finally {
      setVeLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'verified-emails' && verifiedEmails.length === 0) {
      fetchVerifiedEmails();
    }
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createUser(formData);
      setFormData(initialFormState);
      setIsDialogOpen(false);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to create user:', err);
      setError('Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    userName: string,
    currentRole: string,
    newRole: string
  ) => {
    if (currentRole === newRole) return;

    setPendingChange({ userId, userName, oldRole: currentRole, newRole });
    setIsConfirmOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingChange) return;

    try {
      setLoading(true);
      await updateUser(pendingChange.userId, { role: pendingChange.newRole });
      await fetchUsers();
      setIsConfirmOpen(false);
      setPendingChange(null);
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setLoading(true);
      await deleteUser(userToDelete.id);
      await fetchUsers();
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const totalClients = users.filter((u) => u.role === 'CLIENT').length;
  const totalOrganizers = users.filter((u) => u.role === 'ORGANIZER').length;
  const totalAdmins = users.filter((u) => u.role === 'ADMIN').length;

  // Filtered + sorted + paginated users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const fullName = `${u.firstName} ${u.middleName || ''} ${u.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q) ||
        (u.contactNumber || '').toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          cmp = (a.email || '').localeCompare(b.email || '');
          break;
        case 'role':
          cmp = (a.role || '').localeCompare(b.role || '');
          break;
        case 'contact':
          cmp = (a.contactNumber || '').localeCompare(b.contactNumber || '');
          break;
        case 'created':
          cmp = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [filteredUsers, sortBy, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / rowsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedUsers.slice(start, start + rowsPerPage);
  }, [sortedUsers, currentPage, rowsPerPage]);

  const toggleSort = (field: UserSortField) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: UserSortField }) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-[#8f1fd1]" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-[#8f1fd1]" />
    );
  };

  // Verified emails filtered + paginated
  const filteredVe = useMemo(() => {
    const q = veSearch.trim().toLowerCase();
    if (!q) return verifiedEmails;
    return verifiedEmails.filter((v) => v.email.toLowerCase().includes(q));
  }, [verifiedEmails, veSearch]);

  useEffect(() => {
    setVePage(1);
  }, [veSearch]);

  const veTotalPages = Math.max(1, Math.ceil(filteredVe.length / vePerPage));
  const paginatedVe = filteredVe.slice((vePage - 1) * vePerPage, vePage * vePerPage);

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users Management</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="houseNumber">House Number</Label>
                  <Input
                    id="houseNumber"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barangay">Barangay</Label>
                  <Input
                    id="barangay"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="ORGANIZER">Organizer</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl bg-[#f5f0fa] p-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-white text-[#2e2837] shadow-sm'
              : 'text-[#7c7390] hover:text-[#2e2837]'
          }`}
        >
          <Users className="h-4 w-4" />
          Users
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeTab === 'users' ? 'bg-[#f0e8f7] text-[#8f1fd1]' : 'bg-[#e8e0f0] text-[#7c7390]'
            }`}
          >
            {totalUsers}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('verified-emails')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === 'verified-emails'
              ? 'bg-white text-[#2e2837] shadow-sm'
              : 'text-[#7c7390] hover:text-[#2e2837]'
          }`}
        >
          <BadgeCheck className="h-4 w-4" />
          Verified Emails
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeTab === 'verified-emails'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-[#e8e0f0] text-[#7c7390]'
            }`}
          >
            {verifiedEmails.length}
          </span>
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <UserCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClients}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organizers</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrganizers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAdmins}</div>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#eee7f4] bg-white shadow-[0_8px_30px_rgba(53,36,71,0.06)]">
            {/* Search bar */}
            <div className="flex items-center gap-3 border-b border-[#f1eaf7] bg-[#fcf9ff] px-4 py-3">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8a7ca3]" />
                <Input
                  placeholder="Search name, email, role…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 border-[#e5ddee] bg-white pl-8"
                />
              </div>
            </div>

            <Table>
              <TableHeader className="bg-[#faf7fd]">
                <TableRow className="border-b border-[#efe7f6]">
                  <TableHead
                    className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <SortIcon field="name" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                    onClick={() => toggleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <SortIcon field="email" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                    onClick={() => toggleSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      <SortIcon field="role" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                    onClick={() => toggleSort('contact')}
                  >
                    <div className="flex items-center">
                      Contact
                      <SortIcon field="contact" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                    onClick={() => toggleSort('created')}
                  >
                    <div className="flex items-center">
                      Created
                      <SortIcon field="created" />
                    </div>
                  </TableHead>
                  <TableHead className="h-11 w-[100px] text-right text-xs font-black uppercase tracking-[0.06em] text-[#7c7390]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {users.length > 0 ? 'No users match your search.' : 'No users found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <UserDetailsPopover key={user.user_id} user={user} onUpdate={fetchUsers}>
                      <TableRow className="cursor-pointer border-b border-[#f3edf8] hover:bg-[#fcf9ff]">
                        <TableCell className="py-3 font-semibold text-[#2e2837]">
                          {user.firstName} {user.middleName} {user.lastName}
                        </TableCell>
                        <TableCell className="text-sm text-[#635a73]">{user.email}</TableCell>
                        <TableCell>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleRoleChange(
                                  user.user_id,
                                  `${user.firstName} ${user.lastName}`,
                                  user.role,
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="h-7 w-[110px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CLIENT">CLIENT</SelectItem>
                                <SelectItem value="ORGANIZER">ORGANIZER</SelectItem>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-[#635a73]">
                          {user.contactNumber || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-[#4e4560]">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user.user_id, `${user.firstName} ${user.lastName}`);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </UserDetailsPopover>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Bar */}
            {sortedUsers.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-[#f1eaf7] bg-[#fcf9ff] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-[#7c7390]">
                  <span className="font-semibold">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-md border border-[#e5ddee] bg-white px-2 py-1 text-sm font-semibold text-[#2e2837] outline-none focus:ring-2 focus:ring-[#8f1fd1]/30"
                  >
                    {[5, 10, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2 text-[#8a7ca3]">
                    {(currentPage - 1) * rowsPerPage + 1}–
                    {Math.min(currentPage * rowsPerPage, sortedUsers.length)} of{' '}
                    {sortedUsers.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 text-sm font-bold text-[#2e2837]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Verified Emails Tab ── */}
      {activeTab === 'verified-emails' && (
        <div className="overflow-hidden rounded-2xl border border-[#eee7f4] bg-white shadow-[0_8px_30px_rgba(53,36,71,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#f1eaf7] bg-[#fcf9ff] px-4 py-3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8a7ca3]" />
              <Input
                placeholder="Search verified emails…"
                value={veSearch}
                onChange={(e) => setVeSearch(e.target.value)}
                className="h-9 border-[#e5ddee] bg-white pl-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchVerifiedEmails} disabled={veLoading}>
              {veLoading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>

          {veLoading ? (
            <div className="flex items-center justify-center py-16 text-[#7c7390]">
              Loading verified emails…
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#faf7fd]">
                <TableRow className="border-b border-[#efe7f6]">
                  <TableHead className="h-11 w-12 text-center text-xs font-black uppercase tracking-[0.06em] text-[#7c7390]">
                    #
                  </TableHead>
                  <TableHead className="h-11 text-xs font-black uppercase tracking-[0.06em] text-[#7c7390]">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </div>
                  </TableHead>
                  <TableHead className="h-11 text-xs font-black uppercase tracking-[0.06em] text-[#7c7390]">
                    Status
                  </TableHead>
                  <TableHead className="h-11 text-xs font-black uppercase tracking-[0.06em] text-[#7c7390]">
                    Verified At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVe.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      {verifiedEmails.length > 0
                        ? 'No emails match your search.'
                        : 'No verified emails found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVe.map((ve, idx) => (
                    <TableRow
                      key={ve.email}
                      className="border-b border-[#f3edf8] hover:bg-[#fcf9ff]"
                    >
                      <TableCell className="text-center text-sm text-[#8a7ca3]">
                        {(vePage - 1) * vePerPage + idx + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-[#2e2837]">{ve.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          <BadgeCheck className="h-3 w-3" />
                          Verified
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-[#4e4560]">
                        {ve.verifiedAt
                          ? new Date(ve.verifiedAt).toLocaleString('en-PH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {filteredVe.length > vePerPage && (
            <div className="flex items-center justify-between border-t border-[#f1eaf7] bg-[#fcf9ff] px-4 py-3">
              <span className="text-sm text-[#7c7390]">
                {(vePage - 1) * vePerPage + 1}–{Math.min(vePage * vePerPage, filteredVe.length)} of{' '}
                {filteredVe.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                  onClick={() => setVePage(1)}
                  disabled={vePage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                  onClick={() => setVePage((p) => Math.max(1, p - 1))}
                  disabled={vePage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="mx-2 text-sm font-bold text-[#2e2837]">
                  Page {vePage} of {veTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                  onClick={() => setVePage((p) => Math.min(veTotalPages, p + 1))}
                  disabled={vePage === veTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                  onClick={() => setVePage(veTotalPages)}
                  disabled={vePage === veTotalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Role Change Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the role of <strong>{pendingChange?.userName}</strong>{' '}
              from <span className="font-semibold">{pendingChange?.oldRole}</span> to{' '}
              <span className="font-semibold">{pendingChange?.newRole}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRoleChange}>Confirm Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

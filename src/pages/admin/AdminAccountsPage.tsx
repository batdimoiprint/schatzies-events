import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MoreVertical } from 'lucide-react';

const mockAccounts = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joined: 'Jan 15, 2024' },
  { id: '2', name: 'Sarah Smith', email: 'sam@events.com', role: 'Organizer', status: 'Active', joined: 'Feb 02, 2024' },
  { id: '3', name: 'Mike Johnson', email: 'mike@client.com', role: 'Client', status: 'Inactive', joined: 'Mar 10, 2024' },
  { id: '4', name: 'Emma Wilson', email: 'emma@events.com', role: 'Organizer', status: 'Active', joined: 'Mar 22, 2024' },
  { id: '5', name: 'Chris Evans', email: 'chris@example.com', role: 'Client', status: 'Active', joined: 'Apr 05, 2024' },
];

export function AdminAccountsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#2e2837]">Accounts & Users</h1>
          <p className="font-semibold text-[#8f879f]">Manage system users, roles, and permissions</p>
        </div>
        <Button className="bg-[#51a3f0] hover:bg-[#3b7cde] text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-bold">{account.name}</TableCell>
                  <TableCell className="text-muted-foreground">{account.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold bg-[#f0e8f5] text-[#8f1fd0] border-none">
                      {account.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={account.status === 'Active' ? 'bg-[#e6f8ea] text-[#29bf4c]' : 'bg-[#fee2e2] text-[#ef4444]'}>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{account.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

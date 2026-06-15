import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DatabaseBackup,
  Download,
  Upload,
  Trash2,
  RefreshCcw,
  Clock,
  HardDrive,
  FileJson,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { listBackups, createBackup, restoreBackup, deleteBackup } from '@/api/backups';
import type { Backup } from '@/api/backups';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatDate(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return timestamp;
  }
}

function timeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
}

export function AdminDataBackupPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'restore' | 'delete';
    backup: Backup | null;
  }>({ open: false, type: 'restore', backup: null });
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = (type: ToastType, title: string, message: string) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  };

  const fetchBackups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listBackups();
      setBackups(data);
    } catch (error) {
      console.error('Failed to fetch backups:', error);
      showToast('error', 'Failed to Load', 'Could not retrieve backup list from S3.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      await createBackup();
      showToast('success', 'Backup Created', 'DynamoDB data has been saved to S3 successfully.');
      await fetchBackups();
    } catch (error) {
      console.error('Failed to create backup:', error);
      showToast('error', 'Backup Failed', 'Could not create backup. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backup: Backup) => {
    try {
      setRestoring(backup.key);
      await restoreBackup(backup.key);
      showToast(
        'success',
        'Restore Complete',
        `DynamoDB has been restored from backup: ${formatDate(backup.timestamp)}`
      );
      setConfirmDialog({ open: false, type: 'restore', backup: null });
    } catch (error) {
      console.error('Failed to restore backup:', error);
      showToast('error', 'Restore Failed', 'Could not restore from this backup. Please try again.');
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (backup: Backup) => {
    try {
      setDeleting(backup.key);
      await deleteBackup(backup.key);
      showToast('success', 'Backup Deleted', 'The backup has been removed from S3.');
      setConfirmDialog({ open: false, type: 'delete', backup: null });
      await fetchBackups();
    } catch (error) {
      console.error('Failed to delete backup:', error);
      showToast('error', 'Delete Failed', 'Could not delete this backup. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const latestBackup = backups.length > 0 ? backups[0] : null;

  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-start gap-3 rounded-xl border px-5 py-4 shadow-2xl transition-all duration-500 animate-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : toast.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-blue-200 bg-blue-50 text-blue-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          ) : toast.type === 'error' ? (
            <XCircle className="mt-0.5 size-5 shrink-0" />
          ) : (
            <Info className="mt-0.5 size-5 shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold">{toast.title}</p>
            <p className="text-xs opacity-80">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-4 text-lg leading-none opacity-50 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-lg shadow-pink-200">
              <DatabaseBackup className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">Data Backup</h1>
              <p className="text-sm font-semibold text-muted-foreground">
                DynamoDB → S3 archival & disaster recovery
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchBackups}
            disabled={loading}
            variant="outline"
            className="gap-2 rounded-xl border-pink-200 text-pink-700 hover:border-pink-300 hover:bg-pink-50/30"
          >
            <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleCreateBackup}
            disabled={creating}
            className="gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-deep text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300"
          >
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {creating ? 'Creating Backup...' : 'Save Backup Now'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-none bg-gradient-to-br from-[#fef7ff] to-[#f8f0fc] shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#f0e3f7]">
              <HardDrive className="size-5 text-[#9a1eb9]" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{backups.length}</p>
              <p className="text-xs font-semibold text-muted-foreground">Total Backups</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#dcfce7]">
              <ShieldCheck className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {latestBackup ? timeAgo(latestBackup.timestamp) : '—'}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">Latest Backup</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-[#eff6ff] to-[#e0f2fe] shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#dbeafe]">
              <FileJson className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {latestBackup ? formatBytes(latestBackup.sizeBytes) : '—'}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">Latest Size</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-[#fefce8] to-[#fef9c3] shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fef08a]">
              <Clock className="size-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">Weekly</p>
              <p className="text-xs font-semibold text-muted-foreground">Auto Schedule</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Table */}
      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-[#f0eaf5] bg-gradient-to-r from-[#fefaff] to-[#fcf7ff]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <DatabaseBackup className="size-5 text-[#9a1eb9]" />
              Backup History
            </CardTitle>
            <Badge className="border-none bg-[#f0e3f7] text-[#9a1eb9]">S3 Archival Storage</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <Loader2 className="size-8 animate-spin text-[#9a1eb9]" />
              <p className="text-sm font-semibold text-muted-foreground">Loading backups...</p>
            </div>
          ) : backups.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#f8f2fc]">
                <DatabaseBackup className="size-7 text-[#c4b5d0]" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-foreground">No Backups Yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first backup to start archiving DynamoDB data.
                </p>
              </div>
              <Button
                onClick={handleCreateBackup}
                disabled={creating}
                className="mt-2 gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-deep text-white"
              >
                <Upload className="size-4" />
                Create First Backup
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#f0eaf5] bg-[#faf7fd]">
                    <TableHead className="py-3.5 pl-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Backup Date
                    </TableHead>
                    <TableHead className="py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Time Ago
                    </TableHead>
                    <TableHead className="py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Size
                    </TableHead>
                    <TableHead className="py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="py-3.5 pr-6 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup, index) => (
                    <TableRow
                      key={backup.key}
                      className={`group border-b border-[#f5f0fa] transition-colors hover:bg-[#fdf9ff] ${
                        index === 0 ? 'bg-[#fefcff]' : ''
                      }`}
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-9 items-center justify-center rounded-lg ${
                              index === 0
                                ? 'bg-gradient-to-br from-brand to-brand-deep'
                                : 'bg-[#f0e3f7]'
                            }`}
                          >
                            <FileJson
                              className={`size-4 ${index === 0 ? 'text-white' : 'text-[#9a1eb9]'}`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {formatDate(backup.timestamp)}
                            </p>
                            <p className="text-xs text-[#a89fb5]">
                              {backup.key.split('/').slice(0, 2).join('/')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-[#6b5f7b]">
                          {timeAgo(backup.timestamp)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-foreground">
                          {formatBytes(backup.sizeBytes)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {index === 0 ? (
                          <Badge className="border-none bg-emerald-50 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="mr-1 size-3" />
                            Latest
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-[#e0d6ea] text-xs font-semibold text-muted-foreground"
                          >
                            Archived
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                type: 'restore',
                                backup,
                              })
                            }
                            disabled={!!restoring}
                            className="gap-1.5 rounded-lg border-[#e0d6ea] text-xs font-semibold text-[#6b5f7b] hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Download className="size-3.5" />
                            Restore
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                type: 'delete',
                                backup,
                              })
                            }
                            disabled={!!deleting}
                            className="gap-1.5 rounded-lg text-xs font-semibold text-[#a89fb5] hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="border-none bg-gradient-to-r from-[#eff6ff] via-[#f0f9ff] to-[#ecfdf5] shadow-sm">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <Info className="size-5 text-blue-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">How Backups Work</p>
            <p className="text-xs leading-relaxed text-[#6b5f7b]">
              Backups are automatically created <strong>every Sunday at midnight (UTC)</strong> via
              AWS EventBridge. You can also create manual backups at any time. Each backup is a full
              snapshot of all DynamoDB items stored as JSON in S3. Backups older than 90 days are
              automatically transitioned to <strong>S3 Glacier</strong> for cost-effective long-term
              archival. To recover from data corruption, click <strong>Restore</strong> on any
              backup to replace all current DynamoDB data with that snapshot.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !restoring && !deleting && setConfirmDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={`flex size-11 items-center justify-center rounded-xl ${
                  confirmDialog.type === 'restore' ? 'bg-amber-100' : 'bg-red-100'
                }`}
              >
                {confirmDialog.type === 'restore' ? (
                  <AlertTriangle className="size-5 text-amber-600" />
                ) : (
                  <Trash2 className="size-5 text-red-600" />
                )}
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {confirmDialog.type === 'restore' ? 'Confirm Restore' : 'Confirm Delete'}
              </DialogTitle>
            </div>
            <DialogDescription className="mt-3 text-sm text-[#6b5f7b]">
              {confirmDialog.type === 'restore' ? (
                <>
                  This will <strong className="text-red-600">replace ALL current data</strong> in
                  DynamoDB with the backup from{' '}
                  <strong>
                    {confirmDialog.backup ? formatDate(confirmDialog.backup.timestamp) : ''}
                  </strong>
                  . This action cannot be undone. Make sure to create a new backup of the current
                  data first if needed.
                </>
              ) : (
                <>
                  This will permanently delete the backup from{' '}
                  <strong>
                    {confirmDialog.backup ? formatDate(confirmDialog.backup.timestamp) : ''}
                  </strong>
                  . This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, type: 'restore', backup: null })}
              disabled={!!restoring || !!deleting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!confirmDialog.backup) return;
                if (confirmDialog.type === 'restore') {
                  handleRestore(confirmDialog.backup);
                } else {
                  handleDelete(confirmDialog.backup);
                }
              }}
              disabled={!!restoring || !!deleting}
              className={`gap-2 rounded-xl text-white ${
                confirmDialog.type === 'restore'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {(confirmDialog.type === 'restore' ? restoring : deleting) ? (
                <Loader2 className="size-4 animate-spin" />
              ) : confirmDialog.type === 'restore' ? (
                <Download className="size-4" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {confirmDialog.type === 'restore'
                ? restoring
                  ? 'Restoring...'
                  : 'Restore Backup'
                : deleting
                  ? 'Deleting...'
                  : 'Delete Backup'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

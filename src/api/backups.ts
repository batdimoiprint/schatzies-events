import axiosInstance from './axios-instance';

export interface Backup {
  key: string;
  timestamp: string;
  sizeBytes: number;
  lastModified?: string;
  triggeredBy?: string;
  itemCount?: number;
}

export interface BackupDetails {
  key: string;
  timestamp: string;
  triggeredBy: string;
  itemCount: number;
  tableName: string;
  sizeBytes: number;
}

export interface RestoreResult {
  restoredFrom: string;
  backupTimestamp: string;
  itemsDeleted: number;
  itemsRestored: number;
  restoredAt: string;
}

/** List all available backups */
export async function listBackups(): Promise<Backup[]> {
  const { data } = await axiosInstance.get('/backups');
  return data.backups;
}

/** Create a manual backup */
export async function createBackup(): Promise<Backup> {
  const { data } = await axiosInstance.post('/backups');
  return data.backup;
}

/** Get backup details */
export async function getBackupDetails(
  backupKey: string
): Promise<BackupDetails> {
  const { data } = await axiosInstance.get(
    `/backups/details/${encodeURIComponent(backupKey)}`
  );
  return data.backup;
}

/** Restore a backup into DynamoDB */
export async function restoreBackup(
  backupKey: string
): Promise<RestoreResult> {
  const { data } = await axiosInstance.post('/backups/restore', { backupKey });
  return data.result;
}

/** Delete a backup */
export async function deleteBackup(backupKey: string): Promise<void> {
  await axiosInstance.delete(`/backups/${encodeURIComponent(backupKey)}`);
}

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const targetDbPath = process.env.NGINDA_SHARED_DB_PATH || path.join(__dirname, '..', 'data', 'nginda-warriors-db.json');
const backupDir = path.join(__dirname, '..', 'data', 'backups');

const specificBackup = process.argv[2];
let backupToRestore: string | null = null;

if (specificBackup) {
  backupToRestore = path.isAbsolute(specificBackup) ? specificBackup : path.join(backupDir, specificBackup);
} else {
  if (fs.existsSync(backupDir)) {
    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.startsWith('backup-') && f.endsWith('.json') && !f.endsWith('.meta.json'))
      .sort()
      .reverse();
    if (files.length > 0) {
      backupToRestore = path.join(backupDir, files[0]);
    }
  }
}

if (!backupToRestore || !fs.existsSync(backupToRestore)) {
  console.error(`No valid backup found to restore.`);
  process.exit(1);
}

const rawData = fs.readFileSync(backupToRestore, 'utf8');
const metaPath = backupToRestore.replace(/\.json$/, '.meta.json');

if (fs.existsSync(metaPath)) {
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const actualChecksum = crypto.createHash('sha256').update(rawData).digest('hex');
  if (meta.checksum && meta.checksum !== actualChecksum) {
    console.error(`CORRUPT BACKUP: Checksum mismatch! Expected ${meta.checksum}, got ${actualChecksum}`);
    process.exit(1);
  }
  console.log(`Backup checksum verified: ${actualChecksum}`);
}

// Validate database JSON schema integrity
const parsed = JSON.parse(rawData);
if (!parsed.clubSettings || !Array.isArray(parsed.users) || !Array.isArray(parsed.players)) {
  console.error(`INVALID BACKUP: Crucial tables missing in archive.`);
  process.exit(1);
}

fs.writeFileSync(targetDbPath, rawData, 'utf8');
console.log(`Database successfully restored from ${backupToRestore} to ${targetDbPath}`);

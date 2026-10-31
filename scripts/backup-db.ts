import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dbPath = process.env.NGINDA_SHARED_DB_PATH || path.join(__dirname, '..', 'data', 'nginda-warriors-db.json');
const backupDir = path.join(__dirname, '..', 'data', 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found at ${dbPath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(dbPath, 'utf8');
const checksum = crypto.createHash('sha256').update(rawData).digest('hex');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
const metaFile = path.join(backupDir, `backup-${timestamp}.meta.json`);

fs.writeFileSync(backupFile, rawData, 'utf8');
fs.writeFileSync(
  metaFile,
  JSON.stringify(
    {
      timestamp,
      checksum,
      sizeBytes: Buffer.byteLength(rawData),
      rpoHours: 24,
      rtoMinutes: 15,
      version: '1.0.0',
    },
    null,
    2
  ),
  'utf8'
);

console.log(`Backup completed successfully!`);
console.log(`Archive: ${backupFile}`);
console.log(`SHA-256 Checksum: ${checksum}`);

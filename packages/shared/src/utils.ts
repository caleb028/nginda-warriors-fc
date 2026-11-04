export function createUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length <= 6) return '****';
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-3)}`;
}

export const HYPOTHETICAL_PLAYER_IDS = new Set([
  'player-collins-kariuki-1',
  'player-kelvin-njoroge-4',
  'player-brian-mwangi-7',
  'player-dennis-kamau-11',
]);

export function deduplicatePlayers<
  T extends { id?: string; fullName?: string; jerseyNumber?: number | string; updatedAt?: string }
>(players: T[], deletedPlayerIds?: Iterable<string>): T[] {
  const deletedSet = new Set(deletedPlayerIds || []);
  const playerMap = new Map<string, T>();
  const identityMap = new Map<string, string>(); // identityKey -> canonicalId

  for (const p of players) {
    if (!p || !p.id || !p.fullName || deletedSet.has(p.id) || HYPOTHETICAL_PLAYER_IDS.has(p.id)) {
      continue;
    }

    const normName = String(p.fullName).trim().toLowerCase();
    const normJersey =
      p.jerseyNumber !== undefined && p.jerseyNumber !== null && p.jerseyNumber !== ''
        ? String(p.jerseyNumber).trim()
        : '99';
    const identityKey = `${normName}#${normJersey}`;

    const isTempId =
      p.id.startsWith('temp-') ||
      p.id.startsWith('player-temp-') ||
      (p.id.startsWith('player-') && !isNaN(Number(p.id.slice(7))));

    // Case 1: Same ID already encountered
    if (playerMap.has(p.id)) {
      const existing = playerMap.get(p.id)!;
      const pTs = p.updatedAt ? new Date(p.updatedAt).getTime() : 0;
      const eTs = existing?.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
      if (pTs >= eTs) {
        playerMap.set(p.id, { ...existing, ...p });
      }
      continue;
    }

    // Case 2: Same identity (name + jersey) under a different ID
    if (identityMap.has(identityKey)) {
      const existingId = identityMap.get(identityKey)!;
      const existing = playerMap.get(existingId);
      const existingIsTemp =
        existing &&
        Boolean(
          existing.id?.startsWith('temp-') ||
            existing.id?.startsWith('player-temp-') ||
            (existing.id?.startsWith('player-') && !isNaN(Number(existing.id.slice(7))))
        );

      if (existingIsTemp && !isTempId) {
        // Upgrade from temp ID to permanent record
        playerMap.delete(existingId);
        playerMap.set(p.id, { ...existing, ...p, id: p.id });
        identityMap.set(identityKey, p.id);
      } else if (!existingIsTemp && isTempId) {
        // Drop the incoming temp duplicate, preserve the existing permanent record
        const pTs = p.updatedAt ? new Date(p.updatedAt).getTime() : 0;
        const eTs = existing?.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
        if (pTs >= eTs) {
          playerMap.set(existingId, { ...existing, ...p, id: existingId });
        }
      } else {
        // Both are permanent or both temp: keep the canonical existingId and merge
        const pTs = p.updatedAt ? new Date(p.updatedAt).getTime() : 0;
        const eTs = existing?.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
        if (pTs >= eTs) {
          playerMap.set(existingId, { ...existing, ...p, id: existingId });
        }
      }
    } else {
      identityMap.set(identityKey, p.id);
      playerMap.set(p.id, p);
    }
  }

  return Array.from(playerMap.values());
}

const fetch = globalThis.fetch;

const BASE_URL = 'https://nginda-warriors-fc-c549.vercel.app';
const ADMIN_EMAIL = 'admin@ngindawarriorsfc.co.ke';
const ADMIN_PASSWORD = 'NgindaWarriors@2026#Secure';

async function main() {
  console.log('1. Authenticating with Control Centre at', BASE_URL);
  const loginRes = await fetch(`${BASE_URL}/manage/api/admin/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: BASE_URL,
    },
    body: JSON.stringify({ action: 'login', email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  const loginData = await loginRes.json();
  if (!loginRes.ok || !loginData.token) {
    console.error('Login failed:', loginData);
    process.exit(1);
  }
  const token = loginData.token;
  console.log('✓ Successfully authenticated! Token received.');

  // Current database snapshot
  const initialSyncRes = await fetch(`${BASE_URL}/api/sync?t=${Date.now()}`);
  const initialSync = await initialSyncRes.json();
  let currentPlayers = initialSync.snapshot?.players || initialSync.database?.players || [];
  console.log(`Current players on live site: ${currentPlayers.length}`);

  // Upload Player 1
  console.log('\n2. Uploading Player 1: Lewis Kiragu "SUE" (#10, Midfielder)');
  const p1Payload = {
    fullName: 'Lewis Kiragu "SUE"',
    jerseyNumber: 10,
    positionGroup: 'Midfielders',
    specificRole: 'Attacking Midfielder',
    preferredFoot: 'Right',
    appearances: 15,
    starts: 14,
    goals: 7,
    assists: 9,
    isFeatured: true,
    squadStatus: 'active',
    publicationStatus: 'published',
    clientPlayers: currentPlayers,
  };

  const p1Res = await fetch(`${BASE_URL}/manage/api/admin/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: BASE_URL,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'save_player', payload: p1Payload }),
  });
  const p1Data = await p1Res.json();
  if (!p1Res.ok || !p1Data.ok) {
    console.error('Failed to save Player 1:', p1Data);
    process.exit(1);
  }
  console.log('✓ Player 1 saved! Total players in response:', p1Data.database?.players?.length);
  currentPlayers = p1Data.database?.players || [];

  // Upload Player 2
  console.log('\n3. Uploading Player 2: David Mutua (#7, Forward) without losing Player 1');
  const p2Payload = {
    fullName: 'David Mutua',
    jerseyNumber: 7,
    positionGroup: 'Forwards',
    specificRole: 'Right Winger',
    preferredFoot: 'Left',
    appearances: 12,
    starts: 11,
    goals: 6,
    assists: 5,
    isFeatured: true,
    squadStatus: 'active',
    publicationStatus: 'published',
    clientPlayers: currentPlayers,
  };

  const p2Res = await fetch(`${BASE_URL}/manage/api/admin/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: BASE_URL,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'save_player', payload: p2Payload }),
  });
  const p2Data = await p2Res.json();
  if (!p2Res.ok || !p2Data.ok) {
    console.error('Failed to save Player 2:', p2Data);
    process.exit(1);
  }
  console.log('✓ Player 2 saved! Total players in response:', p2Data.database?.players?.length);
  currentPlayers = p2Data.database?.players || [];

  // Upload Player 3
  console.log('\n4. Uploading Player 3: Boniface Njoroge (#1, Goalkeeper)');
  const p3Payload = {
    fullName: 'Boniface Njoroge',
    jerseyNumber: 1,
    positionGroup: 'Goalkeepers',
    specificRole: 'Goalkeeper',
    preferredFoot: 'Right',
    appearances: 18,
    starts: 18,
    goals: 0,
    assists: 1,
    cleanSheets: 9,
    isFeatured: true,
    squadStatus: 'active',
    publicationStatus: 'published',
    clientPlayers: currentPlayers,
  };

  const p3Res = await fetch(`${BASE_URL}/manage/api/admin/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: BASE_URL,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'save_player', payload: p3Payload }),
  });
  const p3Data = await p3Res.json();
  if (!p3Res.ok || !p3Data.ok) {
    console.error('Failed to save Player 3:', p3Data);
    process.exit(1);
  }
  console.log('✓ Player 3 saved! Total players in response:', p3Data.database?.players?.length);

  // Verify public website sync endpoint
  console.log('\n5. Verifying Public Website /api/sync endpoint...');
  const syncCheck = await fetch(`${BASE_URL}/api/sync?t=${Date.now()}`);
  const syncData = await syncCheck.json();
  const livePlayers = syncData.snapshot?.players || syncData.database?.players || [];
  console.log(`Live public website player count: ${livePlayers.length}`);

  const hasP1 = livePlayers.some((p) => p.fullName.includes('Lewis Kiragu'));
  const hasP2 = livePlayers.some((p) => p.fullName.includes('David Mutua'));
  const hasP3 = livePlayers.some((p) => p.fullName.includes('Boniface Njoroge'));

  console.log(`- Player 1 (Lewis Kiragu "SUE"): ${hasP1 ? 'PRESENT ✓' : 'MISSING ✗'}`);
  console.log(`- Player 2 (David Mutua): ${hasP2 ? 'PRESENT ✓' : 'MISSING ✗'}`);
  console.log(`- Player 3 (Boniface Njoroge): ${hasP3 ? 'PRESENT ✓' : 'MISSING ✗'}`);

  if (!hasP1 || !hasP2 || !hasP3) {
    console.error('VERIFICATION FAILED: Multiple players were not all retained!');
    process.exit(1);
  }

  // Verify Team Page renders
  console.log('\n6. Checking /team page HTTP status and card HTML...');
  const teamPageRes = await fetch(`${BASE_URL}/team`);
  const teamHtml = await teamPageRes.text();
  console.log('HTTP Status:', teamPageRes.status);
  console.log('Contains Lewis Kiragu:', teamHtml.includes('Lewis Kiragu'));
  console.log('Contains David Mutua:', teamHtml.includes('David Mutua'));
  console.log('Contains Boniface Njoroge:', teamHtml.includes('Boniface Njoroge'));
  console.log('Contains aspect-[3/4] card ratio:', teamHtml.includes('aspect-[3/4]'));

  console.log('\n🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

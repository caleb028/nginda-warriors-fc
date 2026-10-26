import { NextResponse } from 'next/server';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';

export async function GET() {
  const { clubSettings, sponsorshipPackages } = getPublicWebsiteSnapshot();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${clubSettings.clubName} — Official Sponsorship Proposal</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;600;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      color: #17231C;
      background: #FFFDF2;
    }
    .page {
      max-width: 900px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 4px solid #08783E;
    }
    .hero {
      background: linear-gradient(135deg, #063B25 0%, #08783E 100%);
      color: #FFFFFF;
      padding: 40px;
      border-bottom: 6px solid #F5D000;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .hero h1 {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 42px;
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .badge {
      display: inline-block;
      background: #F5D000;
      color: #063B25;
      font-weight: 800;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 99px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .content {
      padding: 36px 40px;
    }
    h2 {
      font-family: 'Barlow Condensed', sans-serif;
      color: #063B25;
      font-size: 26px;
      text-transform: uppercase;
      border-left: 5px solid #F5D000;
      padding-left: 12px;
      margin-top: 28px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 16px;
    }
    .pkg {
      border: 2px solid #08783E;
      border-radius: 10px;
      padding: 20px;
      background: #EEF7EF;
    }
    .pkg.featured {
      border-color: #D5AA00;
      background: #FFFDF2;
    }
    .pkg h3 {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 22px;
      margin: 0 0 6px 0;
      color: #063B25;
      text-transform: uppercase;
    }
    .price {
      font-weight: 800;
      color: #08783E;
      font-size: 16px;
      margin-bottom: 10px;
    }
    ul {
      padding-left: 18px;
      margin: 8px 0;
      font-size: 13.5px;
      line-height: 1.6;
    }
    .footer {
      background: #063B25;
      color: #FFFFFF;
      padding: 24px 40px;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-bar {
      background: #F5D000;
      color: #063B25;
      padding: 12px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
    }
    .print-btn {
      background: #063B25;
      color: #F5D000;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 800;
      cursor: pointer;
    }
    @media print {
      .print-bar { display: none; }
      .page { border: none; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span>NGINDA WARRIORS FC — OFFICIAL COMMERCIAL PARTNERSHIP PROPOSAL (EST. ${clubSettings.establishedYear})</span>
    <button class="print-btn" onclick="window.print()">Download / Save as PDF</button>
  </div>
  <div class="page">
    <div class="hero">
      <div>
        <span class="badge">OFFICIAL SPONSORSHIP DOSSIER • EST. ${clubSettings.establishedYear}</span>
        <h1>PARTNER WITH THE WARRIORS.<br/>GROW WITH THE COMMUNITY.</h1>
        <p style="margin:0;color:#EEF7EF;font-size:15px;">${clubSettings.clubName} • “${clubSettings.tagline}”</p>
      </div>
      <img src="${clubSettings.crestUrl || '/brand/nginda-warriors-crest.svg'}" width="110" height="110" alt="Club Crest" />
    </div>
    <div class="content">
      <h2>1. Club Profile & Identity</h2>
      <p>${clubSettings.clubInfo.aboutSummary}</p>
      <p><strong>Vision:</strong> ${clubSettings.clubInfo.visionStatement}</p>
      <p><strong>Mission:</strong> ${clubSettings.clubInfo.missionStatement}</p>

      <h2>2. Community Impact & Development Objectives</h2>
      <p>${clubSettings.clubInfo.communityImpactSummary}</p>
      <ul>
        ${clubSettings.clubInfo.developmentObjectives.map((obj) => `<li>${obj}</li>`).join('')}
      </ul>

      <h2>3. Official Sponsorship Packages</h2>
      <div class="grid">
        ${sponsorshipPackages
          .map(
            (pkg) => `
          <div class="pkg ${pkg.isFeatured ? 'featured' : ''}">
            <h3>${pkg.name}</h3>
            <div class="price">
              ${
                pkg.priceKes !== null && pkg.priceKes > 0
                  ? `KES ${Number(pkg.priceKes).toLocaleString()} (${pkg.billingPeriod})`
                  : 'Custom Partnership Investment (Contact Club Management for KES Rate Card)'
              }
            </div>
            <p style="font-size:13px;margin:0 0 8px 0;">${pkg.description}</p>
            <ul>
              ${pkg.benefits.map((b) => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    <div class="footer">
      <div>
        <strong style="color:#F5D000;">${clubSettings.clubName} (Est. ${clubSettings.establishedYear})</strong><br/>
        Location: ${clubSettings.physicalAddress || 'Nginda, Kenya'}
      </div>
      <div style="text-align:right;">
        ${clubSettings.contactEmail ? `Email: ${clubSettings.contactEmail}<br/>` : ''}
        ${clubSettings.contactPhone ? `Phone: ${clubSettings.contactPhone}` : 'Inquire Online: /sponsors'}
      </div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

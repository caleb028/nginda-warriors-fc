import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  ContactMessageSchema,
  FanMembershipSchema,
  MpesaContributionSchema,
  RecruitmentApplicationSchema,
  SponsorInquirySchema,
  createNotification,
  createUuid,
  initiateDarajaStkPush,
  readDatabase,
  recordAuditLog,
  writeDatabase,
} from '@nginda-warriors/shared/server';

async function notifyControlCentre(event: { type: string; payload?: unknown }) {
  const controlCentreUrl = process.env.CONTROL_CENTRE_URL;
  if (!controlCentreUrl) return;
  try {
    await fetch(new URL('/api/admin/notify', controlCentreUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch {
    // Non-blocking notification over internal service binding
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, payload } = body;
    await notifyControlCentre({ type, payload });

    if (type === 'sponsor_inquiry') {
      const parsed = SponsorInquirySchema.parse({
        ...payload,
        budgetKes: payload.budgetKes ? Number(payload.budgetKes) : null,
      });

      const db = readDatabase();
      const now = new Date().toISOString();
      const inquiry = {
        id: createUuid(),
        contactName: parsed.contactName,
        businessName: parsed.businessName,
        phoneNumber: parsed.phoneNumber,
        email: parsed.email,
        packageOfInterest: parsed.packageOfInterest,
        budgetKes: parsed.budgetKes ?? null,
        message: parsed.message,
        inquiryStatus: 'new' as const,
        privateAdminNotes: '',
        createdAt: now,
        updatedAt: now,
      };

      db.sponsorInquiries.unshift(inquiry);

      createNotification(db, {
        title: `New Sponsor Inquiry: ${inquiry.businessName}`,
        message: `${inquiry.contactName} inquired about ${inquiry.packageOfInterest}.`,
        category: 'sponsor',
        actionHref: '/sponsor-inquiries',
      });

      recordAuditLog(db, {
        actorUserId: 'public',
        actorName: inquiry.contactName,
        actorRole: 'PUBLIC_VISITOR',
        action: 'SUBMIT_SPONSOR_INQUIRY',
        module: 'sponsor-inquiries',
        targetId: inquiry.id,
        summary: `Received sponsorship inquiry from ${inquiry.businessName} (${inquiry.packageOfInterest})`,
      });

      writeDatabase(db);
      return NextResponse.json({
        ok: true,
        message:
          'Thank you! Your sponsorship inquiry has been received by Nginda Warriors FC leadership.',
        id: inquiry.id,
      });
    }

    if (type === 'mpesa_contribution') {
      const parsed = MpesaContributionSchema.parse({
        ...payload,
        amountKes: Number(payload.amountKes),
      });

      const result = await initiateDarajaStkPush({
        campaignId: parsed.campaignId,
        campaignTitle: parsed.campaignTitle,
        donorName: parsed.donorName,
        donorPhone: parsed.donorPhone,
        isAnonymous: parsed.isAnonymous,
        amountKes: parsed.amountKes,
        paymentMethod: parsed.paymentMethod,
        manualReceiptReference: payload.manualReceiptReference,
      });

      revalidatePath('/support');
      revalidatePath('/transparency');

      return NextResponse.json({
        ok: true,
        message: result.customerMessage,
        checkoutRequestId: result.checkoutRequestId,
        status: result.donation.status,
      });
    }

    if (type === 'fan_membership') {
      const parsed = FanMembershipSchema.parse(payload);
      const db = readDatabase();
      const member = {
        id: createUuid(),
        fullName: parsed.fullName,
        phoneNumber: parsed.phoneNumber,
        email: parsed.email || undefined,
        wardOrLocation: parsed.wardOrLocation || undefined,
        membershipTier: parsed.membershipTier,
        commSms: parsed.commSms,
        commWhatsapp: parsed.commWhatsapp,
        commEmail: parsed.commEmail,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      };
      db.fanMemberships.unshift(member);

      createNotification(db, {
        title: 'New Supporter Member Registered',
        message: `${member.fullName} joined as a ${member.membershipTier}.`,
        category: 'community',
        actionHref: '/membership',
      });

      recordAuditLog(db, {
        actorUserId: 'public',
        actorName: member.fullName,
        actorRole: 'PUBLIC_VISITOR',
        action: 'REGISTER_FAN_MEMBERSHIP',
        module: 'membership',
        targetId: member.id,
        summary: `Supporter membership registered: ${member.fullName}`,
      });

      writeDatabase(db);
      return NextResponse.json({
        ok: true,
        message: 'Welcome to the Warriors family! Your supporter membership is now registered.',
      });
    }

    if (type === 'recruitment_application') {
      const parsed = RecruitmentApplicationSchema.parse({
        ...payload,
        age: Number(payload.age),
      });

      const db = readDatabase();
      const now = new Date().toISOString();
      const application = {
        id: createUuid(),
        fullName: parsed.fullName,
        age: parsed.age,
        isMinor: parsed.age < 18,
        guardianName: parsed.guardianName || undefined,
        guardianPhone: parsed.guardianPhone || undefined,
        guardianConsentConfirmed: Boolean(parsed.guardianConsentConfirmed),
        preferredPosition: parsed.preferredPosition,
        preferredFoot: parsed.preferredFoot,
        playingExperience: parsed.playingExperience,
        county: parsed.county,
        phoneNumber: parsed.phoneNumber,
        email: parsed.email || undefined,
        achievements: parsed.achievements || undefined,
        highlightVideoUrl: parsed.highlightVideoUrl || undefined,
        applicationStatus: 'submitted' as const,
        reviewerNotes: '',
        createdAt: now,
        updatedAt: now,
      };

      db.recruitmentApplications.unshift(application);

      createNotification(db, {
        title: `New Trial Application: ${application.fullName}`,
        message: `${application.preferredPosition} (Age ${application.age}) submitted a trial application.`,
        category: 'recruitment',
        actionHref: '/recruitment',
      });

      recordAuditLog(db, {
        actorUserId: 'public',
        actorName: application.fullName,
        actorRole: 'PUBLIC_VISITOR',
        action: 'SUBMIT_RECRUITMENT_APPLICATION',
        module: 'recruitment',
        targetId: application.id,
        summary: `Private trial recruitment application submitted (${application.preferredPosition}, age ${application.age})`,
      });

      writeDatabase(db);
      return NextResponse.json({
        ok: true,
        message:
          'Your trial application has been securely submitted to the Nginda Warriors FC Technical Bench. Private applications are strictly confidential.',
      });
    }

    if (type === 'contact_message') {
      const parsed = ContactMessageSchema.parse(payload);
      const db = readDatabase();
      const msg = {
        id: createUuid(),
        senderName: parsed.senderName,
        senderEmail: parsed.senderEmail,
        senderPhone: parsed.senderPhone || undefined,
        subject: parsed.subject,
        message: parsed.message,
        status: 'unread' as const,
        createdAt: new Date().toISOString(),
      };
      db.contactMessages.unshift(msg);

      createNotification(db, {
        title: `Contact Message: ${msg.subject}`,
        message: `From ${msg.senderName} (${msg.senderEmail})`,
        category: 'community',
        actionHref: '/messages',
      });

      writeDatabase(db);
      return NextResponse.json({
        ok: true,
        message: 'Your message has been delivered to Nginda Warriors FC.',
      });
    }

    if (type === 'motm_vote') {
      const { fixtureId, playerId, voterKey } = payload;
      if (!fixtureId || !playerId) {
        return NextResponse.json({ ok: false, error: 'Fixture and player are required.' }, { status: 400 });
      }
      const db = readDatabase();
      const fingerprint = voterKey || req.headers.get('x-forwarded-for') || 'local-supporter';
      const duplicate = db.fanVotes.find(
        (v) => v.fixtureId === fixtureId && v.voterFingerprint === fingerprint
      );
      if (duplicate) {
        return NextResponse.json(
          { ok: false, error: 'You have already recorded your Man of the Match vote for this fixture.' },
          { status: 400 }
        );
      }
      const player = db.players.find((p) => p.id === playerId);
      db.fanVotes.push({
        id: createUuid(),
        fixtureId,
        playerId,
        playerName: player?.fullName || 'Squad Player',
        voterFingerprint: fingerprint,
        createdAt: new Date().toISOString(),
      });
      writeDatabase(db);
      revalidatePath('/fixtures');
      revalidatePath(`/fixtures/${fixtureId}`);
      return NextResponse.json({
        ok: true,
        message: 'Your Man of the Match vote has been recorded!',
      });
    }

    if (type === 'merchandise_order') {
      const { productId, selectedSize, quantity, customerName, customerPhone } = payload;
      const db = readDatabase();
      const product = db.products.find((p) => p.id === productId);
      if (!product) {
        return NextResponse.json({ ok: false, error: 'Product not found.' }, { status: 404 });
      }
      const qty = Math.max(1, Number(quantity || 1));
      const order = {
        id: createUuid(),
        productId: product.id,
        productName: product.name,
        selectedSize: selectedSize || 'L',
        quantity: qty,
        customerName: String(customerName || '').trim(),
        customerPhone: String(customerPhone || '').trim(),
        totalKes: product.priceKes * qty,
        orderChannel: 'whatsapp' as const,
        orderStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      db.orders.unshift(order);
      createNotification(db, {
        title: `New Merchandise Order: ${product.name}`,
        message: `${order.customerName} ordered ${qty}x (${order.selectedSize}) — KES ${order.totalKes.toLocaleString()}`,
        category: 'finance',
        actionHref: '/merchandise',
      });
      writeDatabase(db);
      return NextResponse.json({
        ok: true,
        order,
        message: 'Order logged! Proceeding to WhatsApp confirmation.',
      });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported submission type' }, { status: 400 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'issues' in err) {
      const issues = (err as { issues: Array<{ message: string }> }).issues;
      return NextResponse.json(
        { ok: false, error: issues.map((i) => i.message).join(' • ') },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : 'Validation failed';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

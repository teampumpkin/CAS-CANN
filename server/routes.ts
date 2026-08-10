import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { storage, type ResourceFilters } from "./storage";
import { insertResourceSchema, dynamicFormSubmissionSchema, InsertFormSubmission, insertTownhallRegistrationSchema, loginSchema, forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema, changePasswordSchema, updateProfileSchema } from "@shared/schema";
import { fieldSyncEngine } from "./field-sync-engine";
import { zohoCRMService, buildCentralizedZohoData } from "./zoho-crm-service";
import { retryService } from "./retry-service";
import { oauthService } from "./oauth-service";
import { dedicatedTokenManager } from "./dedicated-token-manager";
import { reportingService, reportFiltersSchema } from "./reporting-service";
import { fieldMetadataCacheService } from "./field-metadata-cache-service";
import { requireAutomationAuth, requireMemberAuth, requireAdmin, type AuthenticatedRequest } from "./auth-middleware";
import { verifyPassword, hashPassword, generateOTP, hashOTP, verifyOTP, getOTPExpiryDate, sendPasswordResetEmail } from "./auth-service";
import multerLib from "multer";
import { recordingStorage, RECORDINGS_TMP_DIR } from "./recording-storage";

// Multer for member-recording uploads (temp dir; the storage adapter persists the file).
const recordingUpload = multerLib({
  storage: multerLib.diskStorage({
    destination: (_req, _file, cb) => cb(null, RECORDINGS_TMP_DIR),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5 GB
});
// import { notificationService, notificationConfigSchema } from "./notification-service"; // Disabled for production
// REMOVED: formScalabilityService - No longer used after endpoint consolidation
import { errorHandlingService, errorClassificationSchema } from "./error-handling-service";
// REMOVED: streamlinedFormProcessor - No longer used after endpoint consolidation
import { emailNotificationService } from "./email-notification-service";
import { zohoWorkflowService } from "./zoho-workflow-service";
import { formConfigEngine } from "./form-config-engine";
import { z } from "zod";
import { runSSOTValidation, buildHumanReadableSummary, applySSOTChanges, applyFieldCorrections } from "./ssot-validation-service";

const SSOT_LOG_MAX_ENTRIES = 500;
const SSOT_LOG_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const SSOT_LOG_RETURN_LIMIT = 200;

function trimSSOTLog(logPath: string): void {
  try {
    const stat = fs.statSync(logPath);
    const raw = fs.readFileSync(logPath, 'utf8');
    const lines = raw.split('\n').filter(l => l.trim().length > 0);
    if (lines.length > SSOT_LOG_MAX_ENTRIES || stat.size > SSOT_LOG_MAX_BYTES) {
      const kept = lines.slice(-SSOT_LOG_MAX_ENTRIES);
      fs.writeFileSync(logPath, kept.join('\n') + '\n', 'utf8');
      console.log(`[Admin] SSOT audit log trimmed: kept ${kept.length} of ${lines.length} entries`);
    }
  } catch (trimErr) {
    console.error('[Admin] SSOT audit log trim failed (non-fatal):', trimErr);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic ping endpoint for deployment verification
  app.get('/ping', (_req, res) => {
    res.status(200).send('pong');
  });

  // ===== Member auth & portal routes (restored + hardened) =====
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const member = await storage.getMemberByEmail(validatedData.email);
      if (!member) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      if (member.status !== "active") {
        return res.status(403).json({
          success: false,
          message: "Your account is not active. Please contact support.",
        });
      }

      const isValidPassword = await verifyPassword(validatedData.password, member.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      await storage.updateMemberLastLogin(member.id);

      req.session.memberId = member.id;
      req.session.memberEmail = member.email;
      req.session.memberRole = member.role;

      res.json({
        success: true,
        message: "Login successful",
        member: {
          id: member.id,
          email: member.email,
          fullName: member.fullName,
          role: member.role,
          isCASMember: member.isCASMember,
          isCANNMember: member.isCANNMember,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("[Auth] Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed. Please try again.",
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("[Auth] Logout error:", err);
        return res.status(500).json({
          success: false,
          message: "Logout failed.",
        });
      }
      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logged out successfully.",
      });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.memberId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const member = await storage.getMember(req.session.memberId);
      if (!member || member.status !== "active") {
        req.session.destroy(() => {});
        return res.status(401).json({
          success: false,
          message: "Session expired. Please log in again.",
        });
      }

      res.json({
        success: true,
        member: {
          id: member.id,
          email: member.email,
          fullName: member.fullName,
          role: member.role,
          discipline: member.discipline,
          subspecialty: member.subspecialty,
          institution: member.institution,
          isCASMember: member.isCASMember,
          isCANNMember: member.isCANNMember,
          wantsCommunications: member.wantsCommunications,
          wantsCANNCommunications: member.wantsCANNCommunications,
        },
      });
    } catch (error) {
      console.error("[Auth] Get current user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get user data.",
      });
    }
  });

  // Forgot password - request OTP
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      
      const member = await storage.getMemberByEmail(validatedData.email);
      if (!member) {
        return res.json({
          success: true,
          message: "If an account exists with this email, you will receive a verification code.",
        });
      }

      const otp = generateOTP();
      const otpHash = await hashOTP(otp);
      const expiresAt = getOTPExpiryDate();

      await storage.createPasswordReset({
        memberId: member.id,
        email: member.email,
        otpHash,
        expiresAt,
        maxAttempts: 3,
      });

      await sendPasswordResetEmail(member.email, member.fullName, otp);

      res.json({
        success: true,
        message: "If an account exists with this email, you will receive a verification code.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("[Auth] Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process request. Please try again.",
      });
    }
  });

  // Verify OTP
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const validatedData = verifyOtpSchema.parse(req.body);
      
      const resetRequest = await storage.getActivePasswordReset(validatedData.email);
      if (!resetRequest) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification code. Please request a new one.",
        });
      }

      if (resetRequest.attempts >= resetRequest.maxAttempts) {
        return res.status(400).json({
          success: false,
          message: "Too many attempts. Please request a new verification code.",
        });
      }

      const isValidOTP = await verifyOTP(validatedData.otp, resetRequest.otpHash);
      if (!isValidOTP) {
        await storage.incrementPasswordResetAttempts(resetRequest.id);
        return res.status(400).json({
          success: false,
          message: "Invalid verification code. Please try again.",
        });
      }

      res.json({
        success: true,
        message: "Verification code confirmed. You can now reset your password.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("[Auth] Verify OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Verification failed. Please try again.",
      });
    }
  });

  // Reset password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      
      const resetRequest = await storage.getActivePasswordReset(validatedData.email);
      if (!resetRequest) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset request. Please request a new verification code.",
        });
      }

      const isValidOTP = await verifyOTP(validatedData.otp, resetRequest.otpHash);
      if (!isValidOTP) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification code.",
        });
      }

      const newPasswordHash = await hashPassword(validatedData.newPassword);
      await storage.updateMemberPassword(resetRequest.memberId, newPasswordHash);
      await storage.markPasswordResetUsed(resetRequest.id);

      res.json({
        success: true,
        message: "Password reset successful. You can now log in with your new password.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("[Auth] Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Password reset failed. Please try again.",
      });
    }
  });

  // ============================================
  // Member Portal API Routes (Protected)
  // ============================================

  // Get member profile
  app.get("/api/members/profile", requireMemberAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.member) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const member = await storage.getMember(req.member.id);
      if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }

      res.json({
        success: true,
        profile: {
          id: member.id,
          email: member.email,
          fullName: member.fullName,
          role: member.role,
          status: member.status,
          discipline: member.discipline,
          subspecialty: member.subspecialty,
          institution: member.institution,
          amyloidosisType: member.amyloidosisType,
          isCASMember: member.isCASMember,
          isCANNMember: member.isCANNMember,
          wantsCommunications: member.wantsCommunications,
          wantsCANNCommunications: member.wantsCANNCommunications,
          wantsServicesMapInclusion: member.wantsServicesMapInclusion,
          createdAt: member.createdAt,
          lastLoginAt: member.lastLoginAt,
        },
      });
    } catch (error) {
      console.error("[Portal] Get profile error:", error);
      res.status(500).json({ success: false, message: "Failed to get profile" });
    }
  });

  // Update member profile
  app.put("/api/members/profile", requireMemberAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.member) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const validatedData = updateProfileSchema.parse(req.body);
      
      const updatedMember = await storage.updateMember(req.member.id, validatedData);
      if (!updatedMember) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        profile: {
          fullName: updatedMember.fullName,
          discipline: updatedMember.discipline,
          subspecialty: updatedMember.subspecialty,
          institution: updatedMember.institution,
          wantsCommunications: updatedMember.wantsCommunications,
          wantsCANNCommunications: updatedMember.wantsCANNCommunications,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("[Portal] Update profile error:", error);
      res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  });

  // Change password
  app.put("/api/members/password", requireMemberAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.member) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const validatedData = changePasswordSchema.parse(req.body);
      
      const member = await storage.getMember(req.member.id);
      if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }

      const isValidPassword = await verifyPassword(validatedData.currentPassword, member.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect.",
        });
      }

      const newPasswordHash = await hashPassword(validatedData.newPassword);
      await storage.updateMemberPassword(req.member.id, newPasswordHash);

      res.json({
        success: true,
        message: "Password changed successfully.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("[Portal] Change password error:", error);
      res.status(500).json({ success: false, message: "Failed to change password" });
    }
  });

  // Get member events
  app.get("/api/members/events", requireMemberAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.member) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const events = await storage.getMemberEvents({ isPublished: true });
      
      const filteredEvents = events.filter(event => {
        if (event.eventType === "recording") return false; // recordings live in the Recordings tab
        if (req.member!.role === "admin") return true;
        if (event.accessLevel === "cas_member") return true;
        if (event.accessLevel === "cann_member" && req.member!.isCANNMember) return true;
        if (event.accessLevel === "cas_cann_member" && req.member!.isCASMember && req.member!.isCANNMember) return true;
        return false;
      });

      res.json({
        success: true,
        events: filteredEvents.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          eventDate: event.eventDate,
          eventType: event.eventType,
          location: event.location,
          meetingLink: event.meetingLink,
          duration: event.duration,
          speakers: event.speakers,
          tags: event.tags,
          accessLevel: event.accessLevel,
          presentationTitle: (event as any).presentationTitle,
          speaker: (event as any).speaker,
          topic: (event as any).topic,
          timeLabel: (event as any).timeLabel,
          format: (event as any).format,
          cmeCredits: (event as any).cmeCredits,
          registrationUrl: (event as any).registrationUrl,
          registrationStatus: (event as any).registrationStatus,
          requiresCannMembership: (event as any).requiresCannMembership,
        })),
      });
    } catch (error) {
      console.error("[Portal] Get events error:", error);
      res.status(500).json({ success: false, message: "Failed to get events" });
    }
  });

  // Get event recordings
  app.get("/api/members/recordings", requireMemberAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.member) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const events = await storage.getMemberEvents({ isPublished: true });
      
      const recordings = events.filter(event => {
        if (!event.recordingUrl && !event.recordingStorageKey) return false;
        if (req.member!.role === "admin") return true;
        if (event.accessLevel === "cas_member") return true;
        if (event.accessLevel === "cann_member" && req.member!.isCANNMember) return true;
        if (event.accessLevel === "cas_cann_member" && req.member!.isCASMember && req.member!.isCANNMember) return true;
        return false;
      });

      res.json({
        success: true,
        recordings: recordings.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          eventDate: event.eventDate,
          eventType: event.eventType,
          recordingUrl: event.recordingUrl,
          streamUrl: event.recordingStorageKey ? `/api/members/recordings/${event.id}/stream` : null,
          thumbnailUrl: event.thumbnailUrl,
          duration: event.duration,
          speakers: event.speakers,
          tags: event.tags,
        })),
      });
    } catch (error) {
      console.error("[Portal] Get recordings error:", error);
      res.status(500).json({ success: false, message: "Failed to get recordings" });
    }
  });

  // ===================== Admin portal routes (requireAdmin) =====================
  const PROVINCE_CODE: Record<string, string> = {
    "british columbia": "BC", bc: "BC", alberta: "AB", ab: "AB", saskatchewan: "SK", sk: "SK",
    manitoba: "MB", mb: "MB", ontario: "ON", on: "ON", quebec: "QC", qc: "QC", "québec": "QC",
    "new brunswick": "NB", nb: "NB", "nova scotia": "NS", ns: "NS", "prince edward island": "PE", pe: "PE", pei: "PE",
    "newfoundland and labrador": "NL", nl: "NL", newfoundland: "NL", yukon: "YT", yt: "YT",
    "northwest territories": "NT", nt: "NT", nunavut: "NU", nu: "NU",
  };
  const toProvinceCode = (v?: string): string => {
    if (!v) return "";
    const k = String(v).trim().toLowerCase();
    return PROVINCE_CODE[k] || (String(v).trim().length === 2 ? String(v).trim().toUpperCase() : "");
  };
  const firstVal = (obj: any, keys: string[]): string | undefined => {
    for (const k of keys) {
      const val = obj?.[k];
      if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
    }
    return undefined;
  };
  const wantsMap = (data: any): boolean => {
    const v = firstVal(data, ["servicesMapConsent", "wantsServicesMapInclusion", "wantsServicesMap", "mapInclusion"]);
    return v === "Yes" || v === "yes" || v === "true";
  };
  const extractClinic = (sub: any) => {
    const d = sub.submissionData || {};
    const name = firstVal(d, ["mapClinicName", "mapInstitutionName", "centerName", "institutionName", "clinicName", "institution"]) || firstVal(d, ["fullName"]) || "Clinic";
    const city = firstVal(d, ["mapCity", "city"]);
    const province = toProvinceCode(firstVal(d, ["mapProvince", "province"]));
    const address = firstVal(d, ["mapClinicAddress", "institutionAddress", "streetName", "address"]);
    const phone = firstVal(d, ["mapClinicPhone", "centerPhone", "institutionPhone", "phoneNumber", "phone"]);
    const email = firstVal(d, ["primaryEmail", "emailAddress", "email"]);
    const discipline = firstVal(d, ["discipline"]);
    return { name, city, province, address, phone, email, discipline };
  };
  const leadName = (d: any) => firstVal(d, ["fullName", "name"]) || [firstVal(d, ["firstName"]), firstVal(d, ["lastName"])].filter(Boolean).join(" ") || "—";
  const leadEmail = (d: any) => firstVal(d, ["primaryEmail", "emailAddress", "email", "noMemberEmail"]) || "—";

  // --- Leads ---
  app.get("/api/admin/leads", requireMemberAuth, requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try {
      const subs = await storage.getFormSubmissions();
      const yesish = (v?: string) => (v ? /^(yes|true)/i.test(v) : false);
      const leads = subs.map((s) => {
        const d = (s.submissionData || {}) as any;
        return {
          id: s.id,
          name: leadName(d),
          email: leadEmail(d),
          phone: firstVal(d, ["institutionPhone", "phoneNumber", "phone", "centerPhone", "mapClinicPhone"]) || null,
          discipline: firstVal(d, ["discipline"]) || null,
          subspecialty: firstVal(d, ["subspecialty"]) || null,
          institution: firstVal(d, ["institutionName", "institution", "mapClinicName", "centerName"]) || null,
          amyloidosisType: firstVal(d, ["amyloidosisType", "amyloidosis_type"]) || null,
          wantsCAS: yesish(firstVal(d, ["wantsMembership", "membershipRequest"])) || /cas/i.test(firstVal(d, ["membershipRequest"]) || ""),
          wantsCANN: yesish(firstVal(d, ["wantsCANNMembership"])) || /cann/i.test(firstVal(d, ["membershipRequest"]) || ""),
          wantsMap: wantsMap(d),
          communications: yesish(firstVal(d, ["wantsCommunications", "followUpConsent", "cannCommunications"])),
          formName: s.formName,
          sourceForm: s.sourceForm,
          syncStatus: s.syncStatus,
          zohoCrmId: s.zohoCrmId || null,
          createdAt: s.createdAt,
        };
      });
      res.json({ success: true, leads });
    } catch (e) { console.error("[Admin] leads error", e); res.status(500).json({ success: false, message: "Failed to load leads" }); }
  });
  app.get("/api/admin/leads/:id", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const sub = await storage.getFormSubmission(parseInt(req.params.id));
      if (!sub) return res.status(404).json({ success: false, message: "Lead not found" });
      res.json({ success: true, lead: sub });
    } catch (e) { res.status(500).json({ success: false, message: "Failed to load lead" }); }
  });

  // --- Events / recordings ---
  app.get("/api/admin/events", requireMemberAuth, requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try { res.json({ success: true, events: await storage.getMemberEvents() }); }
    catch (e) { res.status(500).json({ success: false, message: "Failed to load events" }); }
  });
  app.post("/api/admin/events", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const b = req.body || {};
      if (!b.title || !b.eventDate || !b.eventType) return res.status(400).json({ success: false, message: "title, eventDate and eventType are required" });
      const created = await storage.createMemberEvent({
        title: b.title, description: b.description || null, eventDate: new Date(b.eventDate), eventType: b.eventType,
        location: b.location || null, meetingLink: b.meetingLink || null, recordingUrl: b.recordingUrl || null,
        thumbnailUrl: b.thumbnailUrl || null, duration: b.duration ? parseInt(b.duration) : null,
        speakers: Array.isArray(b.speakers) ? b.speakers : (b.speakers ? String(b.speakers).split(",").map((x: string) => x.trim()) : null),
        tags: Array.isArray(b.tags) ? b.tags : null, accessLevel: b.accessLevel || "cas_member", isPublished: b.isPublished ?? false,
        // public CAS/CANN card fields
        presentationTitle: b.presentationTitle || null, speaker: b.speaker || null, topic: b.topic || null,
        timeLabel: b.timeLabel || null, format: b.format || null, cmeCredits: b.cmeCredits || null,
        registrationUrl: b.registrationUrl || null, registrationStatus: b.registrationStatus || null,
        requiresCannMembership: b.requiresCannMembership ?? false, audience: b.audience || "members",
      } as any);
      res.json({ success: true, event: created });
    } catch (e) { console.error("[Admin] create event error", e); res.status(500).json({ success: false, message: "Failed to create event" }); }
  });
  app.put("/api/admin/events/:id", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const b = req.body || {}; const updates: any = { ...b };
      if (b.eventDate) updates.eventDate = new Date(b.eventDate);
      if (b.duration !== undefined) updates.duration = b.duration ? parseInt(b.duration) : null;
      if (typeof b.speakers === "string") updates.speakers = b.speakers.split(",").map((x: string) => x.trim()).filter(Boolean);
      const updated = await storage.updateMemberEvent(parseInt(req.params.id), updates);
      if (!updated) return res.status(404).json({ success: false, message: "Event not found" });
      res.json({ success: true, event: updated });
    } catch (e) { res.status(500).json({ success: false, message: "Failed to update event" }); }
  });
  app.delete("/api/admin/events/:id", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const ev = await storage.getMemberEvent(parseInt(req.params.id));
      if (ev?.recordingStorageKey) await recordingStorage.delete(ev.recordingStorageKey);
      res.json({ success: await storage.deleteMemberEvent(parseInt(req.params.id)) });
    } catch (e) { res.status(500).json({ success: false, message: "Failed to delete event" }); }
  });

  // --- Services map ---
  app.get("/api/admin/map/candidates", requireMemberAuth, requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try {
      const subs = await storage.getFormSubmissions();
      const existing = await storage.getMapClinics();
      const used = new Set(existing.map((c) => c.submissionId).filter(Boolean));
      const candidates = subs.filter((s) => wantsMap(s.submissionData)).filter((s) => !used.has(s.id))
        .map((s) => ({ submissionId: s.id, ...extractClinic(s), createdAt: s.createdAt }));
      res.json({ success: true, candidates });
    } catch (e) { console.error("[Admin] map candidates error", e); res.status(500).json({ success: false, message: "Failed to load candidates" }); }
  });
  app.get("/api/admin/map/clinics", requireMemberAuth, requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try { res.json({ success: true, clinics: await storage.getMapClinics() }); }
    catch (e) { res.status(500).json({ success: false, message: "Failed to load clinics" }); }
  });
  app.post("/api/admin/map/clinics", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const b = req.body || {}; let payload: any;
      if (b.submissionId) {
        const sub = await storage.getFormSubmission(parseInt(b.submissionId));
        if (!sub) return res.status(404).json({ success: false, message: "Lead not found" });
        const c = extractClinic(sub);
        payload = { submissionId: sub.id, name: c.name, city: c.city || null, province: c.province || b.province || "", address: c.address || null, phone: c.phone || null, email: c.email || null, type: "clinic", specialties: c.discipline ? [c.discipline] : null, isPublished: true };
      } else {
        payload = { name: b.name, city: b.city || null, province: toProvinceCode(b.province) || b.province, address: b.address || null, phone: b.phone || null, email: b.email || null, type: b.type || "clinic", specialties: b.specialties || null, isPublished: b.isPublished ?? true };
      }
      if (!payload.name || !payload.province) return res.status(400).json({ success: false, message: "name and a valid province are required" });
      res.json({ success: true, clinic: await storage.createMapClinic(payload) });
    } catch (e) { console.error("[Admin] add clinic error", e); res.status(500).json({ success: false, message: "Failed to add clinic" }); }
  });
  app.put("/api/admin/map/clinics/:id", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const updated = await storage.updateMapClinic(parseInt(req.params.id), req.body || {});
      if (!updated) return res.status(404).json({ success: false, message: "Clinic not found" });
      res.json({ success: true, clinic: updated });
    } catch (e) { res.status(500).json({ success: false, message: "Failed to update clinic" }); }
  });
  app.delete("/api/admin/map/clinics/:id", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try { res.json({ success: await storage.deleteMapClinic(parseInt(req.params.id)) }); }
    catch (e) { res.status(500).json({ success: false, message: "Failed to delete clinic" }); }
  });

  // --- Recording uploads (member-only files, persisted via the storage adapter) ---
  app.post("/api/admin/recordings", requireMemberAuth, requireAdmin, recordingUpload.single("file"), async (req: AuthenticatedRequest, res) => {
    const file = (req as any).file;
    try {
      const b: any = req.body || {};
      if (!file) return res.status(400).json({ success: false, message: "A recording file is required" });
      if (!b.title) { fs.unlink(file.path, () => {}); return res.status(400).json({ success: false, message: "title is required" }); }
      const key = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      const info = await recordingStorage.put(key, file.path, file.mimetype);
      fs.unlink(file.path, () => {});
      const ev = await storage.createMemberEvent({
        title: b.title, description: b.description || null,
        eventDate: b.eventDate ? new Date(b.eventDate) : new Date(), eventType: "recording",
        location: null, meetingLink: null, recordingUrl: null, thumbnailUrl: b.thumbnailUrl || null,
        duration: b.duration ? parseInt(b.duration) : null, speakers: null, tags: null,
        accessLevel: b.accessLevel || "cas_member",
        isPublished: b.isPublished === "true" || b.isPublished === true,
        recordingStorageKey: key, recordingFileName: file.originalname, recordingMimeType: file.mimetype, recordingSizeBytes: info.size,
      } as any);
      res.json({ success: true, recording: ev });
    } catch (e) {
      if (file) fs.unlink(file.path, () => {});
      console.error("[Admin] recording upload error", e);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  });

  app.post("/api/admin/recordings/:id/file", requireMemberAuth, requireAdmin, recordingUpload.single("file"), async (req: AuthenticatedRequest, res) => {
    const file = (req as any).file;
    try {
      const ev = await storage.getMemberEvent(parseInt(req.params.id));
      if (!ev) { if (file) fs.unlink(file.path, () => {}); return res.status(404).json({ success: false, message: "Recording not found" }); }
      if (!file) return res.status(400).json({ success: false, message: "A file is required" });
      if (ev.recordingStorageKey) await recordingStorage.delete(ev.recordingStorageKey);
      const key = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      const info = await recordingStorage.put(key, file.path, file.mimetype);
      fs.unlink(file.path, () => {});
      const updated = await storage.updateMemberEvent(ev.id, { recordingStorageKey: key, recordingFileName: file.originalname, recordingMimeType: file.mimetype, recordingSizeBytes: info.size } as any);
      res.json({ success: true, recording: updated });
    } catch (e) {
      if (file) fs.unlink(file.path, () => {});
      console.error("[Admin] replace recording error", e);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  });

  // Member-only recording stream with HTTP Range support
  app.get("/api/members/recordings/:id/stream", requireMemberAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const ev = await storage.getMemberEvent(parseInt(req.params.id));
      if (!ev || !ev.recordingStorageKey) return res.status(404).json({ success: false, message: "Recording not found" });
      const m = req.member!;
      if (!ev.isPublished && m.role !== "admin") return res.status(404).json({ success: false, message: "Not found" });
      const allowed = m.role === "admin" || ev.accessLevel === "cas_member" ||
        (ev.accessLevel === "cann_member" && m.isCANNMember) ||
        (ev.accessLevel === "cas_cann_member" && m.isCASMember && m.isCANNMember);
      if (!allowed) return res.status(403).json({ success: false, message: "You don't have access to this recording." });
      const info = await recordingStorage.stat(ev.recordingStorageKey);
      if (!info) return res.status(404).json({ success: false, message: "File missing" });
      const total = info.size;
      const ct = ev.recordingMimeType || "application/octet-stream";
      const range = req.headers.range;
      if (range) {
        const match = /bytes=(\d+)-(\d*)/.exec(range);
        const start = match ? parseInt(match[1]) : 0;
        const end = match && match[2] ? Math.min(parseInt(match[2]), total - 1) : total - 1;
        res.status(206).set({ "Content-Range": `bytes ${start}-${end}/${total}`, "Accept-Ranges": "bytes", "Content-Length": String(end - start + 1), "Content-Type": ct });
        recordingStorage.createReadStream(ev.recordingStorageKey, { start, end }).pipe(res);
      } else {
        res.set({ "Content-Length": String(total), "Content-Type": ct, "Accept-Ranges": "bytes" });
        recordingStorage.createReadStream(ev.recordingStorageKey).pipe(res);
      }
    } catch (e) { console.error("[Member] stream error", e); res.status(500).json({ success: false, message: "Stream failed" }); }
  });


  // Public: published map clinics (consumed by the Canada services map)
  app.get("/api/map-clinics", async (_req, res) => {
    try { res.json({ success: true, clinics: await storage.getMapClinics(true) }); }
    catch (e) { res.status(500).json({ success: false, clinics: [] }); }
  });

  // Public: events flagged for everyone (consumed by the public CAS/CANN event pages)
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getMemberEvents({ isPublished: true });
      res.json({ success: true, events: events.filter((e: any) => e.audience === "everyone" || e.audience === "both") });
    } catch (e) { res.status(500).json({ success: false, events: [] }); }
  });


  // ===================== Member resources library (videos + study materials) =====================
  const detectKind = (mime?: string) => (mime && mime.startsWith("video/") ? "video" : "document");

  app.get("/api/admin/member-resources", requireMemberAuth, requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try { res.json({ success: true, resources: await storage.getMemberResources() }); }
    catch (e) { res.status(500).json({ success: false, message: "Failed to load resources" }); }
  });

  app.post("/api/admin/member-resources", requireMemberAuth, requireAdmin, recordingUpload.single("file"), async (req: AuthenticatedRequest, res) => {
    const file = (req as any).file;
    try {
      const b: any = req.body || {};
      if (!file) return res.status(400).json({ success: false, message: "A file is required" });
      if (!b.title) { fs.unlink(file.path, () => {}); return res.status(400).json({ success: false, message: "title is required" }); }
      const key = `resources/${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      const info = await recordingStorage.put(key, file.path, file.mimetype);
      fs.unlink(file.path, () => {});
      const created = await storage.createMemberResource({
        title: b.title, description: b.description || null,
        kind: (b.kind && b.kind !== "auto") ? b.kind : detectKind(file.mimetype), category: b.category || null,
        storageKey: key, fileName: file.originalname, mimeType: file.mimetype, sizeBytes: info.size,
        accessLevel: b.accessLevel || "cas_member", isPublished: b.isPublished === "true" || b.isPublished === true,
      } as any);
      res.json({ success: true, resource: created });
    } catch (e) {
      if (file) fs.unlink(file.path, () => {});
      console.error("[Admin] resource upload error", e);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  });

  app.put("/api/admin/member-resources/:id", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const updated = await storage.updateMemberResource(parseInt(req.params.id), req.body || {});
      if (!updated) return res.status(404).json({ success: false, message: "Resource not found" });
      res.json({ success: true, resource: updated });
    } catch (e) { res.status(500).json({ success: false, message: "Failed to update resource" }); }
  });

  app.delete("/api/admin/member-resources/:id", requireMemberAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const r = await storage.getMemberResource(parseInt(req.params.id));
      if (r?.storageKey) await recordingStorage.delete(r.storageKey);
      res.json({ success: await storage.deleteMemberResource(parseInt(req.params.id)) });
    } catch (e) { res.status(500).json({ success: false, message: "Failed to delete resource" }); }
  });

  // Member: list resources (access-filtered)
  app.get("/api/members/resources", requireMemberAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const m = req.member!;
      const all = await storage.getMemberResources(true);
      const allowed = all.filter((r) =>
        m.role === "admin" || r.accessLevel === "cas_member" ||
        (r.accessLevel === "cann_member" && m.isCANNMember) ||
        (r.accessLevel === "cas_cann_member" && m.isCASMember && m.isCANNMember));
      res.json({
        success: true,
        resources: allowed.map((r) => ({
          id: r.id, title: r.title, description: r.description, kind: r.kind, category: r.category,
          fileName: r.fileName, mimeType: r.mimeType, sizeBytes: r.sizeBytes, thumbnailUrl: r.thumbnailUrl,
          accessLevel: r.accessLevel, createdAt: r.createdAt,
          fileUrl: `/api/members/resources/${r.id}/file`,
        })),
      });
    } catch (e) { res.status(500).json({ success: false, message: "Failed to load resources" }); }
  });

  // Member-only file serving (Range for video; inline for PDF; attachment otherwise)
  app.get("/api/members/resources/:id/file", requireMemberAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const r = await storage.getMemberResource(parseInt(req.params.id));
      if (!r || !r.storageKey) return res.status(404).json({ success: false, message: "Resource not found" });
      const m = req.member!;
      if (!r.isPublished && m.role !== "admin") return res.status(404).json({ success: false, message: "Not found" });
      const allowed = m.role === "admin" || r.accessLevel === "cas_member" ||
        (r.accessLevel === "cann_member" && m.isCANNMember) ||
        (r.accessLevel === "cas_cann_member" && m.isCASMember && m.isCANNMember);
      if (!allowed) return res.status(403).json({ success: false, message: "You don't have access to this resource." });
      const stat = await recordingStorage.stat(r.storageKey);
      if (!stat) return res.status(404).json({ success: false, message: "File missing" });
      const total = stat.size;
      const ct = r.mimeType || "application/octet-stream";
      const isVideo = r.kind === "video" || ct.startsWith("video/");
      const inline = isVideo || ct === "application/pdf" || ct.startsWith("image/");
      const disp = `${inline ? "inline" : "attachment"}; filename="${(r.fileName || "resource").replace(/"/g, "")}"`;
      const range = req.headers.range;
      if (range && isVideo) {
        const mt = /bytes=(\d+)-(\d*)/.exec(range);
        const start = mt ? parseInt(mt[1]) : 0;
        const end = mt && mt[2] ? Math.min(parseInt(mt[2]), total - 1) : total - 1;
        res.status(206).set({ "Content-Range": `bytes ${start}-${end}/${total}`, "Accept-Ranges": "bytes", "Content-Length": String(end - start + 1), "Content-Type": ct, "Content-Disposition": disp });
        recordingStorage.createReadStream(r.storageKey, { start, end }).pipe(res);
      } else {
        res.set({ "Content-Length": String(total), "Content-Type": ct, "Accept-Ranges": "bytes", "Content-Disposition": disp });
        recordingStorage.createReadStream(r.storageKey).pipe(res);
      }
    } catch (e) { console.error("[Member] resource file error", e); res.status(500).json({ success: false, message: "Failed" }); }
  });


  // User API routes
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  });

  // Resource API routes
  app.get("/api/resources", async (req, res) => {
    try {
      const filters: ResourceFilters = {
        amyloidosisType: req.query.amyloidosisType as string,
        resourceType: req.query.resourceType as string,
        category: req.query.category as string,
        audience: req.query.audience as string,
        language: req.query.language as string,
        region: req.query.region as string,
        search: req.query.search as string,
      };

      // Handle boolean filters separately to properly handle 'false' strings
      if (req.query.isPublic !== undefined) {
        filters.isPublic = req.query.isPublic === 'true';
      }
      if (req.query.isApproved !== undefined) {
        filters.isApproved = req.query.isApproved === 'true';
      }

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof ResourceFilters] === undefined) {
          delete filters[key as keyof ResourceFilters];
        }
      });

      const resources = await storage.getResources(filters);
      res.json(resources);
    } catch (error) {
      console.error(`Error fetching resources: ${error}`);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.getResource(parseInt(req.params.id));
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error(`Error fetching resource: ${error}`);
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      console.error(`Error creating resource: ${error}`);
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  app.put("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const resource = await storage.updateResource(id, updates);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error(`Error updating resource: ${error}`);
      res.status(500).json({ message: "Failed to update resource" });
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteResource(id);
      if (!deleted) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting resource: ${error}`);
      res.status(500).json({ message: "Failed to delete resource" });
    }
  });

  app.post("/api/resources/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementDownloadCount(id);
      res.status(200).json({ message: "Download count incremented" });
    } catch (error) {
      console.error(`Error incrementing download count: ${error}`);
      res.status(500).json({ message: "Failed to increment download count" });
    }
  });

  // Membership API routes
  app.post("/api/membership", async (req, res) => {
    try {
      // In a real implementation, this would save to a membership table
      // For now, we'll just acknowledge the submission
      console.log("Membership application received:", req.body);
      res.status(201).json({ message: "Membership application submitted successfully" });
    } catch (error) {
      console.error(`Error submitting membership: ${error}`);
      res.status(500).json({ message: "Failed to submit membership application" });
    }
  });

  // Stories API routes
  app.post("/api/stories", async (req, res) => {
    try {
      // In a real implementation, this would save to a stories table
      // For now, we'll just acknowledge the submission
      console.log("Story submission received:", req.body);
      res.status(201).json({ message: "Story submitted successfully" });
    } catch (error) {
      console.error(`Error submitting story: ${error}`);
      res.status(500).json({ message: "Failed to submit story" });
    }
  });

  // Rate limiting store (in production, use Redis or similar)
  const rateLimitStore = new Map();
  
  // Contact form API route with anti-spam protection
  app.post("/api/contact", async (req, res) => {
    try {
      // Rate limiting: max 3 submissions per IP per hour
      const clientIP = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const hourWindow = 60 * 60 * 1000; // 1 hour
      
      if (!rateLimitStore.has(clientIP)) {
        rateLimitStore.set(clientIP, []);
      }
      
      const submissions = rateLimitStore.get(clientIP);
      const recentSubmissions = submissions.filter((time: number) => now - time < hourWindow);
      
      if (recentSubmissions.length >= 3) {
        return res.status(429).json({ 
          message: "Too many submissions. Please wait before submitting again.",
          retryAfter: hourWindow 
        });
      }
      
      // Update rate limit store
      recentSubmissions.push(now);
      rateLimitStore.set(clientIP, recentSubmissions);

      const contactSchema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        organization: z.string().optional(),
        inquiryType: z.string().min(1),
        subject: z.string().min(5),
        message: z.string().min(20),
        privacyConsent: z.boolean().refine(val => val === true, {
          message: 'Privacy consent is required'
        }),
        captchaToken: z.string().min(1, 'CAPTCHA verification required'),
      });

      const validatedData = contactSchema.parse(req.body);
      
      // Additional spam checks
      const spamKeywords = ['viagra', 'lottery', 'winner', 'bitcoin', 'crypto', 'investment opportunity'];
      const messageText = `${validatedData.subject} ${validatedData.message}`.toLowerCase();
      const hasSpamContent = spamKeywords.some(keyword => messageText.includes(keyword));
      
      if (hasSpamContent) {
        return res.status(400).json({ 
          message: "Message content flagged for review. Please contact us directly if this is a legitimate inquiry." 
        });
      }
      
      // Validate CAPTCHA token format (basic check)
      if (!validatedData.captchaToken.startsWith('captcha_')) {
        return res.status(400).json({ 
          message: "Invalid security verification. Please complete the CAPTCHA." 
        });
      }
      
      // In a real implementation, this would:
      // 1. Save to a contacts/messages database table with consent timestamp
      // 2. Send an email notification to the admin team
      // 3. Send an auto-reply confirmation to the sender
      // 4. Log the privacy consent for compliance
      console.log("Secure contact form submission received:", {
        ...validatedData,
        privacyConsentTimestamp: new Date().toISOString(),
        clientIP: clientIP,
        captchaVerified: true
      });
      
      res.status(201).json({ 
        message: "Contact form submitted successfully",
        timestamp: new Date().toISOString(),
        referenceId: `CAS-${Date.now()}`
      });
    } catch (error) {
      console.error(`Error submitting contact form: ${error}`);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to submit contact form" });
      }
    }
  });

  // BULLETPROOF: CAS/CANN Registration endpoint - ALWAYS succeeds by saving locally first
  app.post("/api/cas-cann-registration", async (req, res) => {
    try {
      console.log("[CAS/CANN Registration] Received:", req.body);
      
      const { formData, formName } = req.body;
      
      // Validate form data (basic validation)
      if (!formData || !formName) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid request: missing form data or form name" 
        });
      }
      
      // STEP 1: Save to local database FIRST (this ALWAYS succeeds)
      const submission = await storage.createFormSubmission({
        formName: formName,
        submissionData: formData,
        sourceForm: "CAS/CANN Registration Form",
        zohoModule: "Leads",
      });
      
      // STEP 2: Log receipt
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "received",
        status: "success",
        details: { 
          message: "Form submission received and queued for Zoho sync",
          formType: formName,
        },
      });

      // STEP 2b: CASL / PIPEDA / Law 25 — write an immutable consent audit row
      // if the submission carried granular consent fields. Failure here must
      // NOT block the registration response — log and move on.
      //
      // IMPORTANT (CASL s.13 burden of proof): we REFUSE to write a consent
      // audit row unless the client also sent the exact legal text snapshot
      // (`_consentLegalText`). A row without the wording the user actually saw
      // is not defensible evidence — better to log the gap loudly and tag the
      // submission for remediation than to pollute the audit log.
      try {
        const hasGranularConsent =
          formData.consentCASNewsletter !== undefined ||
          formData.consentCASEvents !== undefined ||
          formData.consentCASResearch !== undefined ||
          formData.consentCASFundraising !== undefined ||
          formData.consentCANNNewsletter !== undefined ||
          formData.consentCANNEvents !== undefined;
        const submitterEmail =
          formData.primaryEmail || formData.email || formData.noMemberEmail || null;
        const legalText = formData._consentLegalText;
        const hasValidLegalText =
          legalText && typeof legalText === "object" && Object.keys(legalText).length > 0;

        if (hasGranularConsent && submitterEmail && hasValidLegalText) {
          await storage.createConsentRecord({
            submissionId: submission.id,
            email: String(submitterEmail).toLowerCase(),
            source: "join-cas",
            formVersion: formData._consentFormVersion || "v1",
            consents: {
              cas_newsletter: !!formData.consentCASNewsletter,
              cas_events: !!formData.consentCASEvents,
              cas_research: !!formData.consentCASResearch,
              cas_fundraising: !!formData.consentCASFundraising,
              cann_newsletter: !!formData.consentCANNNewsletter,
              cann_events: !!formData.consentCANNEvents,
            },
            legalTextShown: legalText,
            ipAddress:
              (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
              req.socket?.remoteAddress ||
              null,
            userAgent: req.headers["user-agent"] || null,
            locale: formData._consentLocale || "en",
          });
          console.log(`[Consent] ✅ Audit row written for ${submitterEmail} (submission #${submission.id})`);
        } else if (hasGranularConsent && submitterEmail && !hasValidLegalText) {
          // Loud signal: the form sent consent flags but no legal-text snapshot.
          // Tag the submission so an admin can remediate before relying on it.
          console.error(
            `[Consent] ⛔ Refusing to write audit row for submission #${submission.id}: ` +
            `_consentLegalText missing/empty. The granular consent flags are still ` +
            `stored on the form submission, but this submission is NOT a defensible ` +
            `CASL record until the legal-text snapshot is supplied. Fix the client.`
          );
          // Note: we intentionally skip writing to submission_logs here because
          // both `operation` and `status` are Postgres enums that don't include
          // a "warning" / "consent_audit_skipped" value. Console.error above is
          // a loud signal, and the original submission row already carries the
          // raw consent flags as evidence the gap occurred.
        }
      } catch (consentErr) {
        console.error("[Consent] ⚠️ Failed to write consent audit row (registration still succeeds):", consentErr);
      }
      
      console.log(`[CAS/CANN Registration] ✅ Saved locally with ID: ${submission.id}, queued for Zoho sync`);
      
      // STEP 3: Return success immediately (user never sees Zoho failures)
      res.status(201).json({
        success: true,
        message: "Registration submitted successfully",
        submissionId: submission.id,
        formName: formName,
      });
      
      // Background worker will sync to Zoho asynchronously
      console.log(`[CAS/CANN Registration] ℹ️  Submission #${submission.id} will be synced to Zoho by background worker`);
      
    } catch (error) {
      console.error("[CAS/CANN Registration] ❌ Error saving submission:", error);
      // Even database errors should be rare, but log them
      res.status(500).json({ 
        success: false,
        message: "Failed to save registration. Please try again or contact support." 
      });
    }
  });

  // Join CAS application API route
  app.post("/api/join", async (req, res) => {
    try {
      const joinSchema = z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 characters"),
        city: z.string().min(2, "City must be at least 2 characters"),
        province: z.string().min(2, "Province is required"),
        role: z.enum(["clinician", "researcher", "administrator", "patient", "caregiver", "advocate", "other"], {
          required_error: "Role is required"
        }),
        specialty: z.string().optional(),
        organization: z.string().optional(),
        interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
        howHeard: z.string().min(1, "Please tell us how you heard about CAS"),
        message: z.string().optional(),
        newsletter: z.boolean().default(false),
        termsOfParticipation: z.boolean().refine(val => val === true, {
          message: 'Terms of Participation must be accepted'
        }),
        privacyPolicy: z.boolean().refine(val => val === true, {
          message: 'Privacy Policy must be accepted'
        })
      });

      const validatedData = joinSchema.parse(req.body);
      
      console.log("Enhanced CAS membership application received:", {
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email,
        role: validatedData.role,
        specialty: validatedData.specialty,
        organization: validatedData.organization,
        interests: validatedData.interests,
        province: validatedData.province,
        newsletter: validatedData.newsletter,
        timestamp: new Date().toISOString()
      });

      // In a real implementation, save to database:
      // await storage.createMembershipApplication(validatedData);

      res.status(200).json({ 
        message: "Thank you for your membership application! We'll review your application and get back to you within 2-3 weeks.",
        applicationId: `CAS-${Date.now()}`,
        estimatedReviewTime: "2-3 weeks"
      });
    } catch (error) {
      console.error("Join CAS application error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      res.status(500).json({ message: "Failed to process application" });
    }
  });

  // Dynamic Multi-Form Lead Capture API endpoint
  app.post("/api/submit-form", async (req, res) => {
    const startTime = Date.now();
    let submissionId: number | null = null;

    try {
      console.log("[Form Submission] Received form submission:", req.body);

      // Step 1: Validate the incoming request
      const validatedData = dynamicFormSubmissionSchema.parse(req.body);
      const { form_name, data } = validatedData;

      // Step 2: Set target module (all forms go to Leads)
      const targetModule = "Leads";
      console.log(`[Form Submission] Processing form "${form_name}" → Zoho ${targetModule}`);

      // Step 3: Create form submission record
      const submissionData: InsertFormSubmission = {
        formName: form_name,
        submissionData: data,
        sourceForm: form_name,
        zohoModule: targetModule
      };

      const submission = await storage.createFormSubmission(submissionData);
      submissionId = submission.id;

      console.log(`[Form Submission] Created submission record with ID: ${submissionId}`);

      // Step 4: Log the receipt
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "received",
        status: "success",
        details: {
          formName: form_name,
          fieldCount: Object.keys(data).length,
          targetModule
        },
        duration: Date.now() - startTime
      });

      // Step 5: Start processing asynchronously
      setImmediate(async () => {
        try {
          console.log(`[Form Submission] Starting async processing for submission ${submissionId}`);
          
          // Update status to processing
          await storage.updateFormSubmission(submission.id, {
            // processingStatus: "processing" // Already set by default
          });

          // Step 5a: Sync fields with Zoho CRM
          console.log(`[Form Submission] Starting field sync for submission ${submissionId}`);
          const fieldSyncResult = await fieldSyncEngine.syncFieldsForSubmission(submission);
          
          if (!fieldSyncResult.success) {
            console.error(`[Form Submission] Field sync failed for submission ${submissionId}:`, fieldSyncResult.errors);
            await storage.updateFormSubmission(submission.id, {
              processingStatus: "failed" as any,
              syncStatus: "failed" as any,
              errorMessage: `Field sync failed: ${fieldSyncResult.errors.join("; ")}`
            });
            return;
          }

          // Step 5b: Push data to Zoho CRM
          console.log(`[Form Submission] Starting CRM push for submission ${submissionId}`);
          const pushStartTime = Date.now();
          
          // Hoist excludedFieldsList to outer scope so both success and failure logs can access it
          let excludedFieldsList: string[] = [];
          
          try {
            // Load form configuration to determine field mapping strategy
            const formConfig = await formConfigEngine.getFormConfiguration(form_name);
            let zohoData: Record<string, any>;
            
            if (formConfig && formConfig.submitFields && Object.keys(formConfig.submitFields as object).length > 0) {
              // Use configuration-based field formatting (new system)
              console.log(`[Form Submission] Using config-based formatting for form "${form_name}"`);
              const result = await zohoCRMService.formatFieldDataForZohoWithConfig(data, formConfig);
              zohoData = result.zohoData;
              excludedFieldsList = result.excludedFields;
              
              // Log excluded fields for diagnostics (always log for visibility)
              console.log(`[Form Submission] Formatting result: ${Object.keys(zohoData).length} fields included, ${excludedFieldsList.length} excluded`);
              if (excludedFieldsList.length > 0) {
                console.log(`[Form Submission] Excluded unmapped fields (strictMapping):`, excludedFieldsList);
              }
            } else {
              // Smart auto-mapping for unconfigured forms - matches fields to existing Zoho fields
              console.log(`[Form Submission] Using SMART auto-mapping for form "${form_name}" (no config)`);
              const { smartFieldMapper } = await import("./smart-field-mapper");
              const smartResult = await smartFieldMapper.mapFormDataToZoho(data, form_name, targetModule);
              zohoData = smartResult.zohoData;
              excludedFieldsList = smartResult.unmappedFields;
              
              console.log(`[Form Submission] Smart mapping result: ${smartResult.mappedFields.length} mapped, ${excludedFieldsList.length} excluded`);
              if (excludedFieldsList.length > 0) {
                console.log(`[Form Submission] Excluded unmapped fields (smart mapping):`, excludedFieldsList);
              }
            }
            
            console.log(`[Form Submission] Pushing data to Zoho ${targetModule}:`, zohoData);
            
            // Create record in Zoho CRM
            const zohoRecord = await zohoCRMService.createRecord(targetModule, zohoData);
            
            // Update submission with success
            await storage.updateFormSubmission(submission.id, {
              processingStatus: "completed" as any,
              syncStatus: "synced" as any,
              zohoCrmId: zohoRecord.id || null
            });

            // Log successful CRM push with excluded fields for audit visibility
            await storage.createSubmissionLog({
              submissionId: submission.id,
              operation: "crm_push",
              status: "success",
              details: {
                zohoRecordId: zohoRecord.id,
                targetModule,
                fieldsSubmitted: Object.keys(zohoData).length,
                excludedFields: excludedFieldsList,
                excludedFieldsCount: excludedFieldsList.length
              },
              duration: Date.now() - pushStartTime
            });

            console.log(`[Form Submission] Successfully completed processing for submission ${submissionId}, Zoho record ID: ${zohoRecord.id}`);

          } catch (crmError) {
            console.error(`[Form Submission] CRM push failed for submission ${submissionId}:`, crmError);
            
            await storage.updateFormSubmission(submission.id, {
              processingStatus: "failed" as any,
              syncStatus: "failed" as any,
              errorMessage: `CRM push failed: ${crmError instanceof Error ? crmError.message : 'Unknown error'}`
            });

            // Log failed CRM push with excluded fields for audit parity
            await storage.createSubmissionLog({
              submissionId: submission.id,
              operation: "crm_push",
              status: "failed",
              details: { 
                error: crmError instanceof Error ? crmError.message : 'Unknown error',
                excludedFields: excludedFieldsList,
                excludedFieldsCount: excludedFieldsList.length
              },
              duration: Date.now() - pushStartTime,
              errorMessage: crmError instanceof Error ? crmError.message : 'Unknown error'
            });
          }

        } catch (processingError) {
          console.error(`[Form Submission] Processing failed for submission ${submissionId}:`, processingError);
          
          if (submissionId) {
            await storage.updateFormSubmission(submissionId, {
              processingStatus: "failed" as any,
              syncStatus: "failed" as any,
              errorMessage: `Processing failed: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`
            });
          }
        }
      });

      // Step 6: Return immediate response to the client
      res.status(201).json({
        success: true,
        message: "Form submission received successfully",
        submissionId: submission.id,
        formName: form_name,
        status: "processing",
        timestamp: new Date().toISOString(),
        targetModule,
        estimatedProcessingTime: "30-60 seconds"
      });

    } catch (error) {
      console.error("[Form Submission] Error processing form submission:", error);

      // Log the error if we have a submission ID
      if (submissionId) {
        try {
          await storage.createSubmissionLog({
            submissionId,
            operation: "received",
            status: "failed",
            details: { error: error instanceof Error ? error.message : 'Unknown error' },
            duration: Date.now() - startTime,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          });
        } catch (logError) {
          console.error("[Form Submission] Failed to log error:", logError);
        }
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid form submission data",
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to process form submission",
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Bulk Import API endpoint for historical data
  app.post("/api/bulk-import", async (req, res) => {
    try {
      const { filePath, dataSource } = req.body;

      if (!filePath || !dataSource) {
        return res.status(400).json({
          success: false,
          message: "Both filePath and dataSource are required"
        });
      }

      if (!['CANN Contacts', 'CAS Registration'].includes(dataSource)) {
        return res.status(400).json({
          success: false,
          message: "dataSource must be either 'CANN Contacts' or 'CAS Registration'"
        });
      }

      const { BulkImportService } = await import('./bulk-import-service');
      const bulkImportService = new BulkImportService(storage);

      const result = await bulkImportService.importFromExcel(filePath, dataSource as "CANN Contacts" | "CAS Registration");

      res.json({
        success: true,
        message: "Bulk import completed",
        ...result
      });
    } catch (error) {
      console.error("[Bulk Import] Error:", error);
      res.status(500).json({
        success: false,
        message: "Bulk import failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get form submission status endpoint
  app.get("/api/submit-form/:id", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }

      const submission = await storage.getFormSubmission(submissionId);
      
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Get logs for this submission
      const logs = await storage.getLogsBySubmissionId(submissionId);

      res.json({
        id: submission.id,
        formName: submission.formName,
        // processingStatus: submission.processingStatus, // Removed - access via submission directly
        syncStatus: submission.syncStatus,
        zohoModule: submission.zohoModule,
        zohoCrmId: submission.zohoCrmId,
        errorMessage: submission.errorMessage,
        retryCount: submission.retryCount,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        logs: logs.map(log => ({
          operation: log.operation,
          status: log.status,
          details: log.details,
          duration: log.duration,
          createdAt: log.createdAt,
          errorMessage: log.errorMessage
        }))
      });

    } catch (error) {
      console.error("Error fetching submission status:", error);
      res.status(500).json({ message: "Failed to fetch submission status" });
    }
  });

  // Zoho CRM connection test endpoint
  app.get("/api/zoho/test-connection", async (req, res) => {
    try {
      const result = await zohoCRMService.testConnection();
      res.json(result);
    } catch (error) {
      console.error("Zoho connection test failed:", error);
      res.status(500).json({
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  // Zoho CRM layouts endpoint - fetch all layouts for a module
  app.get("/api/zoho/layouts", async (req, res) => {
    try {
      const moduleName = (req.query.module as string) || "Leads";
      const layouts = await zohoCRMService.getLayouts(moduleName);
      
      res.json({
        success: true,
        module: moduleName,
        layoutCount: layouts.length,
        layouts: layouts.map(layout => ({
          id: layout.id,
          name: layout.name,
          sections: layout.sections?.map(s => ({ id: s.id, name: s.name, displayLabel: s.display_label, fields: (s as any).fields?.map((f: any) => ({ apiName: f.api_name, label: f.field_label, dataType: f.data_type, customField: f.custom_field || false })) || [] })) || []
        }))
      });
    } catch (error) {
      console.error("Failed to fetch Zoho layouts:", error);
      res.status(500).json({
        success: false,
        message: `Failed to fetch layouts: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  // Zoho CRM layout fields endpoint - fetch all fields for a specific layout
  app.get("/api/zoho/layouts/:layoutName/fields", async (req, res) => {
    try {
      const { layoutName } = req.params;
      const moduleName = (req.query.module as string) || "Leads";
      
      // Get layout ID
      const layoutId = await zohoCRMService.getLayoutIdByName(layoutName, moduleName);
      if (!layoutId) {
        return res.status(404).json({
          success: false,
          message: `Layout "${layoutName}" not found in module ${moduleName}`
        });
      }
      
      // Get all fields for the module
      const fields = await zohoCRMService.getModuleFields(moduleName);
      
      res.json({
        success: true,
        layout: { id: layoutId, name: layoutName },
        module: moduleName,
        fieldCount: fields.length,
        fields: fields.map(f => ({
          apiName: f.api_name,
          label: f.field_label,
          dataType: f.data_type,
          required: f.required || false,
          customField: f.custom_field || false,
          picklistValues: f.pick_list_values?.map(p => p.display_value) || []
        }))
      });
    } catch (error) {
      console.error("Failed to fetch layout fields:", error);
      res.status(500).json({
        success: false,
        message: `Failed to fetch layout fields: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  // Retry failed submission endpoint
  app.post("/api/retry/submission/:id", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }

      const result = await retryService.retrySubmission(submissionId);
      
      if (result.success) {
        res.json({
          success: true,
          message: `Submission ${submissionId} retried successfully`,
          retryCount: result.retryCount,
          finalStatus: result.finalStatus
        });
      } else {
        res.status(500).json({
          success: false,
          message: `Retry failed: ${result.errorMessage}`,
          retryCount: result.retryCount,
          finalStatus: result.finalStatus
        });
      }

    } catch (error) {
      console.error("Error retrying submission:", error);
      res.status(500).json({ 
        success: false,
        message: `Failed to retry submission: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // Retry all failed submissions endpoint
  app.post("/api/retry/all", async (req, res) => {
    try {
      if (retryService.isRetryProcessing()) {
        return res.status(409).json({
          success: false,
          message: "Retry process is already running"
        });
      }

      const stats = await retryService.retryAllFailedSubmissions();
      
      res.json({
        success: true,
        message: "Bulk retry completed",
        stats
      });

    } catch (error) {
      console.error("Error during bulk retry:", error);
      res.status(500).json({ 
        success: false,
        message: `Bulk retry failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // System monitoring and statistics endpoint
  app.get("/api/monitor/stats", async (req, res) => {
    try {
      // Get form submission statistics
      const allSubmissions = await storage.getFormSubmissions();
      const pendingSubmissions = await storage.getFormSubmissionsByStatus("pending", "pending");
      const processingSubmissions = await storage.getFormSubmissionsByStatus("processing", "pending");
      const completedSubmissions = await storage.getFormSubmissionsByStatus("completed", "synced");
      const failedSubmissions = await storage.getFormSubmissionsByStatus("failed", "failed");

      // Get retry statistics
      const retryStats = await retryService.getRetryStatistics();

      // Get recent logs (last 50)
      const recentLogs = await storage.getSubmissionLogs();
      const lastLogs = recentLogs.slice(-50).reverse();

      // Calculate success rate
      const totalProcessed = completedSubmissions.length + failedSubmissions.length;
      const successRate = totalProcessed > 0 ? (completedSubmissions.length / totalProcessed) * 100 : 0;

      // Get field mappings count
      const fieldMappings = await storage.getFieldMappings();
      const formConfigurations = await storage.getFormConfigurations();

      res.json({
        systemStatus: {
          totalSubmissions: allSubmissions.length,
          pendingSubmissions: pendingSubmissions.length,
          processingSubmissions: processingSubmissions.length,
          completedSubmissions: completedSubmissions.length,
          failedSubmissions: failedSubmissions.length,
          successRate: Math.round(successRate * 100) / 100,
          retryProcessing: retryService.isRetryProcessing()
        },
        retryStatistics: retryStats,
        configurationStatus: {
          fieldMappings: fieldMappings.length,
          formConfigurations: formConfigurations.length
        },
        recentActivity: lastLogs.map(log => ({
          submissionId: log.submissionId,
          operation: log.operation,
          status: log.status,
          duration: log.duration,
          createdAt: log.createdAt,
          errorMessage: log.errorMessage
        }))
      });

    } catch (error) {
      console.error("Error getting system statistics:", error);
      res.status(500).json({ 
        message: `Failed to get statistics: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      const testSubmissions = await storage.getFormSubmissions();
      
      // Test Zoho connection
      const zohoTest = await zohoCRMService.testConnection();

      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: "connected",
            submissionCount: testSubmissions.length
          },
          zoho: {
            status: zohoTest.success ? "connected" : "disconnected",
            message: zohoTest.message
          },
          retryService: {
            status: retryService.isRetryProcessing() ? "processing" : "idle"
          }
        }
      });

    } catch (error) {
      console.error("Health check failed:", error);
      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ============================================================
  // Audit System API - Track submissions, identify issues, enable re-sync
  // ============================================================

  // GET /api/audit/submissions - List submissions with filtering
  app.get("/api/audit/submissions", async (req, res) => {
    try {
      const { formName, status, syncStatus, limit: limitParam, offset: offsetParam } = req.query;
      const limit = parseInt(limitParam as string) || 100;
      const offset = parseInt(offsetParam as string) || 0;

      let submissions = await storage.getFormSubmissions();

      // Apply filters
      if (formName) {
        submissions = submissions.filter(s => s.formName === formName);
      }
      if (status) {
        submissions = submissions.filter(s => s.processingStatus === status);
      }
      if (syncStatus) {
        submissions = submissions.filter(s => s.syncStatus === syncStatus);
      }

      // Sort by newest first
      submissions.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      // Paginate
      const total = submissions.length;
      const paginated = submissions.slice(offset, offset + limit);

      res.json({
        success: true,
        total,
        limit,
        offset,
        submissions: paginated.map(s => {
          const data = s.submissionData as any;
          return {
            id: s.id,
            formName: s.formName,
            fullName: data?.fullName || data?.noMemberName || '',
            email: data?.email || data?.noMemberEmail || '',
            discipline: data?.discipline || '',
            institution: data?.institution || '',
            wantsMembership: data?.wantsMembership,
            wantsCANNMembership: data?.wantsCANNMembership,
            processingStatus: s.processingStatus,
            syncStatus: s.syncStatus,
            zohoCrmId: s.zohoCrmId,
            retryCount: s.retryCount,
            errorMessage: s.errorMessage,
            createdAt: s.createdAt,
            lastSyncAt: s.lastSyncAt,
          };
        }),
      });
    } catch (error) {
      console.error('[Audit API] Error listing submissions:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list submissions',
      });
    }
  });

  // GET /api/audit/failed - List failed submissions eligible for resync
  app.get("/api/audit/failed", async (req, res) => {
    try {
      const failedSubmissions = await storage.getFormSubmissionsByStatus("failed", "failed");
      const maxRetries = 5;

      const eligibleForRetry = failedSubmissions.filter(s => s.retryCount < maxRetries);
      const exhaustedRetries = failedSubmissions.filter(s => s.retryCount >= maxRetries);

      res.json({
        success: true,
        summary: {
          totalFailed: failedSubmissions.length,
          eligibleForRetry: eligibleForRetry.length,
          exhaustedRetries: exhaustedRetries.length,
        },
        eligibleForRetry: eligibleForRetry.map(s => ({
          id: s.id,
          formName: s.formName,
          retryCount: s.retryCount,
          errorMessage: s.errorMessage,
          createdAt: s.createdAt,
          lastRetryAt: s.lastRetryAt,
        })),
        exhaustedRetries: exhaustedRetries.map(s => ({
          id: s.id,
          formName: s.formName,
          retryCount: s.retryCount,
          errorMessage: s.errorMessage,
          createdAt: s.createdAt,
          lastRetryAt: s.lastRetryAt,
        })),
      });
    } catch (error) {
      console.error('[Audit API] Error listing failed submissions:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list failed submissions',
      });
    }
  });

  // GET /api/audit/submission/:id - Get detailed submission info with logs
  app.get("/api/audit/submission/:id", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid submission ID',
        });
      }

      const submission = await storage.getFormSubmission(submissionId);
      
      if (!submission) {
        return res.status(404).json({
          success: false,
          error: `Submission not found: ${submissionId}`,
        });
      }

      const logs = await storage.getSubmissionLogs({ submissionId });

      res.json({
        success: true,
        submission: {
          id: submission.id,
          formName: submission.formName,
          submissionData: submission.submissionData,
          sourceForm: submission.sourceForm,
          zohoModule: submission.zohoModule,
          zohoCrmId: submission.zohoCrmId,
          processingStatus: submission.processingStatus,
          syncStatus: submission.syncStatus,
          errorMessage: submission.errorMessage,
          retryCount: submission.retryCount,
          lastRetryAt: submission.lastRetryAt,
          nextRetryAt: submission.nextRetryAt,
          lastSyncAt: submission.lastSyncAt,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
        },
        logs: logs.map(log => ({
          id: log.id,
          operation: log.operation,
          status: log.status,
          details: log.details,
          errorMessage: log.errorMessage,
          duration: log.duration,
          createdAt: log.createdAt,
        })),
      });
    } catch (error) {
      console.error('[Audit API] Error getting submission details:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get submission details',
      });
    }
  });

  // POST /api/audit/submission/:id/resync - Force resync a submission
  app.post("/api/audit/submission/:id/resync", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const { resetRetryCount } = req.body;

      if (isNaN(submissionId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid submission ID',
        });
      }

      const submission = await storage.getFormSubmission(submissionId);
      
      if (!submission) {
        return res.status(404).json({
          success: false,
          error: `Submission not found: ${submissionId}`,
        });
      }

      // Optionally reset retry count to allow more retries
      if (resetRetryCount) {
        await storage.updateFormSubmission(submissionId, {
          retryCount: 0,
          errorMessage: null,
          processingStatus: 'pending' as any,
          syncStatus: 'pending' as any,
        });
      }

      // Trigger retry
      const result = await retryService.retrySubmission(submissionId);

      res.json({
        success: result.success,
        message: result.success 
          ? `Resync successful for submission ${submissionId}` 
          : `Resync failed: ${result.errorMessage}`,
        retryCount: result.retryCount,
        finalStatus: result.finalStatus,
      });
    } catch (error) {
      console.error('[Audit API] Error resyncing submission:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resync submission',
      });
    }
  });

  // GET /api/audit/sync-gaps - Identify potential missed syncs
  app.get("/api/audit/sync-gaps", async (req, res) => {
    try {
      const allSubmissions = await storage.getFormSubmissions();
      
      // Get submissions older than 5 minutes that are still pending/processing
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const stuckPending = allSubmissions.filter(s => {
        const createdAt = s.createdAt ? new Date(s.createdAt) : null;
        return s.processingStatus === 'pending' && 
               createdAt && createdAt < fiveMinutesAgo;
      });

      const stuckProcessing = allSubmissions.filter(s => {
        const createdAt = s.createdAt ? new Date(s.createdAt) : null;
        return s.processingStatus === 'processing' && 
               createdAt && createdAt < fiveMinutesAgo;
      });

      // Submissions with no Zoho ID despite being "completed"
      const completedNoZohoId = allSubmissions.filter(s => 
        s.processingStatus === 'completed' && 
        s.syncStatus === 'synced' && 
        !s.zohoCrmId
      );

      res.json({
        success: true,
        summary: {
          stuckPending: stuckPending.length,
          stuckProcessing: stuckProcessing.length,
          completedNoZohoId: completedNoZohoId.length,
          totalIssues: stuckPending.length + stuckProcessing.length + completedNoZohoId.length,
        },
        stuckPending: stuckPending.map(s => ({
          id: s.id,
          formName: s.formName,
          createdAt: s.createdAt,
        })),
        stuckProcessing: stuckProcessing.map(s => ({
          id: s.id,
          formName: s.formName,
          createdAt: s.createdAt,
        })),
        completedNoZohoId: completedNoZohoId.map(s => ({
          id: s.id,
          formName: s.formName,
          createdAt: s.createdAt,
        })),
      });
    } catch (error) {
      console.error('[Audit API] Error checking sync gaps:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check sync gaps',
      });
    }
  });

  // Setup endpoint for CAS/CANN form configurations with proper submitFields
  app.post("/api/setup-form-configurations", async (req, res) => {
    try {
      console.log("[Setup] Setting up CAS/CANN Form Configurations with submitFields...");
      const results: any[] = [];

      // Configuration for "CAS Registration"
      const casConfig = {
        formName: "CAS Registration",
        zohoModule: "Leads",
        leadSourceTag: "Website - CAS Registration",
        description: "CAS-only registration form",
        strictMapping: false,
        autoCreateFields: false,
        submitFields: {
          fullName: { zohoField: "Full_Name", label: "Full Name", required: true, fieldType: "text" },
          email: { zohoField: "Email", label: "Email", required: true, fieldType: "email" },
          discipline: { zohoField: "Designation", label: "Discipline", required: false, fieldType: "text" },
          subspecialty: { zohoField: "Description", label: "Subspecialty", required: false, fieldType: "text" },
          amyloidosisType: { zohoField: "Amyloidosis_Type", label: "Amyloidosis Type", required: false, fieldType: "picklist" },
          institution: { zohoField: "Company", label: "Institution", required: false, fieldType: "text" },
          wantsServicesMapInclusion: { zohoField: "Services_Map_Inclusion", label: "Services Map", required: false, fieldType: "picklist" },
          centerName: { zohoField: "Map_Clinic_Name", label: "Map Clinic Name", required: false, fieldType: "text" },
          centerAddress: { zohoField: "Map_Clinic_Address", label: "Map Clinic Address", required: false, fieldType: "text" },
          centerPhone: { zohoField: "Map_Clinic_Phone", label: "Map Clinic Phone", required: false, fieldType: "text" },
          centerFax: { zohoField: "Map_Clinic_Fax", label: "Map Clinic Fax", required: false, fieldType: "text" },
          wantsCommunications: { zohoField: "CAS_Communications", label: "CAS Communications", required: false, fieldType: "picklist" },
        },
      };

      // Configuration for "CAS & CANN Registration"  
      const casCANNConfig = {
        formName: "CAS & CANN Registration",
        zohoModule: "Leads",
        leadSourceTag: "Website - CAS & CANN Registration",
        description: "Combined CAS and CANN registration form",
        strictMapping: false,
        autoCreateFields: false,
        submitFields: {
          fullName: { zohoField: "Full_Name", label: "Full Name", required: true, fieldType: "text" },
          email: { zohoField: "Email", label: "Email", required: true, fieldType: "email" },
          discipline: { zohoField: "Designation", label: "Discipline", required: false, fieldType: "text" },
          subspecialty: { zohoField: "Description", label: "Subspecialty", required: false, fieldType: "text" },
          amyloidosisType: { zohoField: "Amyloidosis_Type", label: "Amyloidosis Type", required: false, fieldType: "picklist" },
          institution: { zohoField: "Company", label: "Institution", required: false, fieldType: "text" },
          wantsServicesMapInclusion: { zohoField: "Services_Map_Inclusion", label: "Services Map", required: false, fieldType: "picklist" },
          centerName: { zohoField: "Map_Clinic_Name", label: "Map Clinic Name", required: false, fieldType: "text" },
          centerAddress: { zohoField: "Map_Clinic_Address", label: "Map Clinic Address", required: false, fieldType: "text" },
          centerPhone: { zohoField: "Map_Clinic_Phone", label: "Map Clinic Phone", required: false, fieldType: "text" },
          centerFax: { zohoField: "Map_Clinic_Fax", label: "Map Clinic Fax", required: false, fieldType: "text" },
          wantsCommunications: { zohoField: "CAS_Communications", label: "CAS Communications", required: false, fieldType: "picklist" },
          wantsCANNMembership: { zohoField: "CANN_Member", label: "CANN Membership", required: false, fieldType: "picklist" },
          cannCommunications: { zohoField: "CANN_Communications", label: "CANN Communications", required: false, fieldType: "picklist" },
        },
      };

      // Configuration for "Join CANN Today"
      const cannConfig = {
        formName: "Join CANN Today",
        zohoModule: "Leads",
        leadSourceTag: "Website - CANN Membership",
        description: "CANN membership application form",
        strictMapping: false,
        autoCreateFields: false,
        submitFields: {
          fullName: { zohoField: "Full_Name", label: "Full Name", required: true, fieldType: "text" },
          email: { zohoField: "Email", label: "Email", required: true, fieldType: "email" },
          discipline: { zohoField: "Designation", label: "Discipline", required: false, fieldType: "text" },
          subspecialty: { zohoField: "Description", label: "Subspecialty", required: false, fieldType: "text" },
          institution: { zohoField: "Company", label: "Institution", required: false, fieldType: "text" },
          cannCommunications: { zohoField: "CANN_Communications", label: "CANN Communications", required: false, fieldType: "picklist" },
        },
      };

      for (const configData of [casConfig, casCANNConfig, cannConfig]) {
        const existing = await formConfigEngine.getFormConfiguration(configData.formName);
        if (existing) {
          const updated = await formConfigEngine.updateFormConfiguration(configData.formName, {
            submitFields: configData.submitFields as any,
            leadSourceTag: configData.leadSourceTag,
            strictMapping: configData.strictMapping,
            autoCreateFields: configData.autoCreateFields,
          });
          results.push({ formName: configData.formName, action: "updated", config: updated });
        } else {
          const created = await formConfigEngine.createFormConfiguration(configData);
          results.push({ formName: configData.formName, action: "created", config: created });
        }
      }

      res.json({
        success: true,
        message: "Form configurations set up successfully",
        results,
      });

    } catch (error) {
      console.error("[Setup] Error setting up form configurations:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to setup form configurations',
      });
    }
  });

  // Setup endpoint for CANN form configuration (legacy)
  app.post("/api/setup-cann-form", async (req, res) => {
    try {
      console.log("[Setup] Setting up CANN Membership Form Configuration...");

      // Check if configuration already exists
      const existingConfig = await storage.getFormConfiguration("Join CANN Today");
      
      if (existingConfig) {
        console.log("[Setup] CANN form configuration already exists:", existingConfig.id);
        return res.json({
          success: true,
          message: "CANN form configuration already exists",
          configId: existingConfig.id,
          config: existingConfig
        });
      }

      // Create CANN form configuration
      const cannFormConfig = {
        formName: "Join CANN Today",
        zohoModule: "Leads", // Map to Leads module in Zoho CRM
        description: "Canadian Amyloidosis Nursing Network membership application form",
        isActive: true,
        fieldMappings: {
          // Basic membership info
          "membershipRequest": {
            "zohoField": "membershipRequest",
            "fieldType": "picklist",
            "isRequired": true,
            "description": "Whether user wants CAS membership"
          },
          "fullName": {
            "zohoField": "fullName", 
            "fieldType": "text",
            "isRequired": false,
            "description": "Full name of the applicant"
          },
          "emailAddress": {
            "zohoField": "emailAddress",
            "fieldType": "email", 
            "isRequired": false,
            "description": "Email address of the applicant"
          },
          "discipline": {
            "zohoField": "discipline",
            "fieldType": "text",
            "isRequired": false,
            "description": "Professional discipline (nurse, physician, etc.)"
          },
          "subspecialty": {
            "zohoField": "subspecialty",
            "fieldType": "text",
            "isRequired": false,
            "description": "Sub-specialty area of focus"
          },
          "institutionName": {
            "zohoField": "institutionName",
            "fieldType": "text",
            "isRequired": false,
            "description": "Center or clinic name/institution"
          },
          "communicationConsent": {
            "zohoField": "communicationConsent",
            "fieldType": "picklist",
            "isRequired": false,
            "description": "Consent for communication from CAS"
          },
          // Services map related fields
          "servicesMapConsent": {
            "zohoField": "servicesMapConsent",
            "fieldType": "picklist",
            "isRequired": true,
            "description": "Consent for including center in services map"
          },
          "mapInstitutionName": {
            "zohoField": "mapInstitutionName",
            "fieldType": "text",
            "isRequired": false,
            "description": "Institution name for services map"
          },
          "institutionAddress": {
            "zohoField": "institutionAddress",
            "fieldType": "text",
            "isRequired": false,
            "description": "Full address of institution"
          },
          "institutionPhone": {
            "zohoField": "institutionPhone",
            "fieldType": "phone",
            "isRequired": false,
            "description": "Institution phone number"
          },
          "institutionFax": {
            "zohoField": "institutionFax",
            "fieldType": "text",
            "isRequired": false,
            "description": "Institution fax number"
          },
          "followUpConsent": {
            "zohoField": "followUpConsent",
            "fieldType": "picklist",
            "isRequired": false,
            "description": "Consent for follow-up contact by CAS"
          }
        },
        settings: {
          "autoCreateFields": true,
          "enableRetries": true,
          "maxRetries": 3,
          "syncRequired": true,
          "trackingEnabled": true,
          "notificationEmail": "admin@amyloid.ca"
        }
      };

      // Create the configuration
      const createdConfig = await storage.createFormConfiguration(cannFormConfig);
      console.log("[Setup] CANN form configuration created successfully!");
      console.log("[Setup] Configuration ID:", createdConfig.id);
      console.log("[Setup] Zoho Module:", createdConfig.zohoModule);
      console.log("[Setup] Field Mappings Count:", Object.keys(createdConfig.fieldMappings as Record<string, any>).length);

      res.json({
        success: true,
        message: "CANN form configuration created successfully!",
        configId: createdConfig.id,
        config: createdConfig,
        summary: {
          formName: createdConfig.formName,
          zohoModule: createdConfig.zohoModule,
          fieldCount: Object.keys(createdConfig.fieldMappings as Record<string, any>).length,
          isActive: createdConfig.isActive
        }
      });

    } catch (error) {
      console.error("[Setup] Error setting up CANN form configuration:", error);
      res.status(500).json({
        success: false,
        message: "Failed to setup CANN form configuration",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Helper function to normalize production domain
  const getProductionDomain = (req: express.Request): { isProduction: boolean; baseUrl: string } => {
    const forwardedHost = req.get('x-forwarded-host') || req.get('host') || '';
    const host = req.get('host') || '';
    
    // Check if this is a production domain (with or without www)
    const isProductionDomain = 
      forwardedHost.includes('amyloid.ca') || 
      host.includes('amyloid.ca') ||
      process.env.NODE_ENV === 'production';
    
    // Use www.amyloid.ca for production OAuth — the bare amyloid.ca domain
    // 404s on /oauth/zoho/callback (only the root path is 301-redirected to www
    // by AWS ALB), which broke the entire OAuth flow. The www. URL must also be
    // registered in Zoho Developer Console as an authorised redirect URI.
    const baseUrl = isProductionDomain 
      ? 'https://www.amyloid.ca' 
      : `${req.protocol}://${host}`;
    
    return { isProduction: isProductionDomain, baseUrl };
  };

  // Debug endpoint to show OAuth authorization URL with dynamic scope support
  app.get("/oauth/zoho/debug", (req, res) => {
    try {
      const { isProduction, baseUrl } = getProductionDomain(req);
      const redirectUri = `${baseUrl}/oauth/zoho/callback`;
      
      // Support custom scopes via query parameter
      const scopesParam = req.query.scopes as string | undefined;
      const customScopes = scopesParam ? scopesParam.split(',').map(s => s.trim()) : undefined;
      
      const authUrl = oauthService.getAuthorizationUrl('zoho_crm', redirectUri, customScopes);
      
      res.send(`
        <html>
          <head><title>OAuth Debug</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <h2>🔍 OAuth Authorization URL Debug</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Production Mode:</strong> ${isProduction}</p>
              <p><strong>Base URL:</strong> ${baseUrl}</p>
              <p><strong>Redirect URI:</strong> ${redirectUri}</p>
              <p><strong>Client ID:</strong> ${(process.env.ZOHO_SELF_CLIENT_ID || process.env.ZOHO_CLIENT_ID)?.substring(0, 20)}...</p>
              <p><strong>Scopes:</strong> ${customScopes ? 'Custom' : 'Default'}</p>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
              <h3>Authorization URL:</h3>
              <p style="word-break: break-all; font-family: monospace; font-size: 12px;">${authUrl}</p>
            </div>
            <div style="margin: 20px 0;">
              <a href="${authUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Click Here to Authorize with Zoho
              </a>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
              <h4>💡 Dynamic Scopes</h4>
              <p>You can customize scopes by adding <code>?scopes=</code> parameter:</p>
              <p style="font-family: monospace; font-size: 12px;">
                /oauth/zoho/debug?scopes=ZohoCRM.modules.ALL,ZohoCRM.settings.workflow_rules.ALL
              </p>
            </div>
            <p style="color: #666; font-size: 14px;">
              <strong>Instructions:</strong> Click the button above to be redirected to Zoho's authorization page. 
              You should see a page asking you to grant permissions. If you're immediately redirected back here, 
              there may be an issue with your Zoho OAuth configuration.
            </p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("[OAuth Debug] Error:", error);
      res.status(500).json({ 
        error: "Failed to generate OAuth URL", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Zoho OAuth connect endpoint - starts the authorization flow with dynamic scopes
  app.get("/oauth/zoho/connect", (req, res) => {
    try {
      const { isProduction, baseUrl } = getProductionDomain(req);
      const redirectUri = `${baseUrl}/oauth/zoho/callback`;
      
      console.log(`[OAuth Connect] Host: ${req.get('host')}, X-Forwarded-Host: ${req.get('x-forwarded-host')}`);
      console.log(`[OAuth Connect] Production mode: ${isProduction}`);
      console.log(`[OAuth Connect] Base URL: ${baseUrl}`);
      console.log(`[OAuth Connect] Redirect URI: ${redirectUri}`);
      
      // Support dynamic scopes via query parameter
      // Example: /oauth/zoho/connect?scopes=ZohoCRM.modules.ALL,ZohoCRM.settings.fields.ALL
      const scopesParam = req.query.scopes as string | undefined;
      const customScopes = scopesParam ? scopesParam.split(',').map(s => s.trim()) : undefined;
      
      if (customScopes) {
        console.log(`[OAuth Connect] Using custom scopes: ${customScopes.join(', ')}`);
      } else {
        console.log(`[OAuth Connect] Using default scopes from environment or hardcoded defaults`);
      }
      
      const authUrl = oauthService.getAuthorizationUrl('zoho_crm', redirectUri, customScopes);
      console.log(`[OAuth Connect] Authorization URL: ${authUrl}`);
      console.log(`[OAuth Connect] Redirecting to Zoho...`);
      
      res.redirect(authUrl);
    } catch (error) {
      console.error("[OAuth Connect] Error:", error);
      res.status(500).json({ 
        error: "Failed to initiate OAuth flow", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Test OAuth token validity by calling Zoho API
  app.get("/api/test-oauth-token", async (req, res) => {
    try {
      console.log("[Test OAuth] Checking token validity...");
      const token = await dedicatedTokenManager.getValidAccessToken('zoho_crm');
      
      if (!token) {
        return res.json({
          success: false,
          error: "No token found in database",
          solution: "Visit /oauth/zoho/connect to authorize"
        });
      }

      console.log("[Test OAuth] Token found, testing against Zoho API...");
      console.log("[Test OAuth] Token preview:", token.substring(0, 20) + "...");
      
      // Test the token by calling Zoho's users API
      const zohoResponse = await fetch("https://www.zohoapis.com/crm/v8/users?type=CurrentUser", {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${token}`
        }
      });

      console.log("[Test OAuth] Zoho API response status:", zohoResponse.status);
      const responseData = await zohoResponse.json();
      
      if (zohoResponse.ok) {
        return res.json({
          success: true,
          message: "✅ OAuth token is valid and working!",
          zohoUser: responseData.users?.[0],
          tokenPreview: token.substring(0, 20) + "..."
        });
      } else {
        return res.json({
          success: false,
          error: `Zoho API returned ${zohoResponse.status}`,
          details: responseData,
          solution: "Token exists but is invalid. Visit /oauth/zoho/connect to re-authorize"
        });
      }
    } catch (error) {
      console.error("[Test OAuth] Error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Test endpoint to manually create workflow
  app.get("/api/create-workflow", async (req, res) => {
    try {
      console.log("[Test] Manually triggering workflow creation...");
      const result = await zohoWorkflowService.setupRegistrationEmailWorkflows(false);
      res.json({ success: true, message: "Workflows created successfully!", result });
    } catch (error) {
      console.error("[Test] Workflow creation failed:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      });
    }
  });

  // OAuth callback endpoint for Zoho authorization
  app.get("/oauth/zoho/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      // Log debug info for troubleshooting
      console.log("[OAuth Callback] Full query parameters:", req.query);
      console.log("[OAuth Callback] Request URL:", req.url);
      
      const { error, error_description } = req.query;
      
      // Handle OAuth errors from Zoho
      if (error) {
        console.error("[OAuth Callback] Zoho OAuth error:", error, error_description);
        return res.status(400).send(`
          <html>
            <head><title>OAuth Error</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>❌ OAuth Authorization Failed</h2>
              <p><strong>Error:</strong> ${error}</p>
              <p><strong>Description:</strong> ${error_description || 'No description provided'}</p>
              <p><a href="/oauth/zoho/connect">← Try Again</a></p>
            </body>
          </html>
        `);
      }
      
      if (!code) {
        console.error("[OAuth Callback] No authorization code provided. Query params:", req.query);
        return res.status(400).send(`
          <html>
            <head><title>OAuth Error</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>❌ Authorization code not provided</h2>
              <p>Zoho did not provide an authorization code. Please check your OAuth configuration.</p>
              <p><strong>Query parameters received:</strong> ${JSON.stringify(req.query)}</p>
              <p><a href="/oauth/zoho/connect">← Try Again</a></p>
            </body>
          </html>
        `);
      }

      console.log("[OAuth Callback] Received Zoho authorization code");
      
      // Use the same domain normalization as the connect endpoint
      const { baseUrl } = getProductionDomain(req);
      const redirectUri = `${baseUrl}/oauth/zoho/callback`;
      
      console.log("[OAuth Callback] Using redirect URI:", redirectUri);
      
      // Exchange code for access token
      const tokenResponse = await fetch("https://accounts.zoho.com/oauth/v2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: (process.env.ZOHO_SELF_CLIENT_ID || process.env.ZOHO_CLIENT_ID)!,
          client_secret: (process.env.ZOHO_SELF_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET)!,
          redirect_uri: redirectUri,
          code: code as string,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        console.error("Token exchange error:", tokenData);
        return res.status(400).json({ error: tokenData.error, details: tokenData });
      }

      console.log("Successfully obtained access token!");
      
      // Store tokens automatically using the dedicated token manager
      const stored = await dedicatedTokenManager.storeToken('zoho_crm', tokenData);
      
      if (stored) {
        console.log("✅ Tokens stored automatically in database");
        
        // NOTE: Email notification workflow creation requires Zoho CRM Enterprise API access
        // and special OAuth scopes that are not available with standard OAuth.
        // Workflows must be configured manually in Zoho CRM Settings > Automation > Workflow Rules
        // or via the admin endpoint /api/admin/setup-zoho-workflows if you have enterprise access.
        
        res.send(`
          <html>
            <head><title>Zoho OAuth Success</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>✅ Zoho Authorization Successful!</h2>
              <p>Your Zoho CRM integration is now <strong>automatically configured</strong>!</p>
              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
                <h3>✅ Automatic Token Management Active</h3>
                <ul>
                  <li>Access tokens will automatically refresh before expiring</li>
                  <li>Your CANN membership forms will sync continuously with Zoho CRM</li>
                  <li>No manual token management required</li>
                  <li>Form submissions are saved locally first, then synced to Zoho in the background</li>
                </ul>
              </div>
              <p><strong>Token expires in:</strong> ${tokenData.expires_in} seconds (${Math.floor(tokenData.expires_in / 3600)} hours)</p>
              <p><strong>API Domain:</strong> ${tokenData.api_domain}</p>
              <p><strong>Scopes granted:</strong> Full CRM module access + Settings management</p>
              <p><strong>Next Steps:</strong> Your integration is ready! Test your membership forms - they will automatically sync to Zoho CRM.</p>
              <p><a href="/">← Return to Website</a></p>
            </body>
          </html>
        `);
      } else {
        console.error("❌ Failed to store tokens automatically");
        res.status(500).send(`
          <html>
            <head><title>Token Storage Error</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>❌ Error Storing Tokens</h2>
              <p>Authentication succeeded but token storage failed. Please try again.</p>
              <p><a href="/oauth/zoho/connect">← Retry Authentication</a></p>
            </body>
          </html>
        `);
      }

    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).json({ error: "Failed to process OAuth callback", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Comprehensive Reporting API endpoints
  app.get("/api/reports", async (req, res) => {
    try {
      const filters = reportFiltersSchema.parse({
        formName: req.query.formName as string,
        zohoModule: req.query.zohoModule as string,
        processingStatus: req.query.processingStatus as string,
        syncStatus: req.query.syncStatus as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        includeCustomFields: req.query.includeCustomFields === 'true',
        groupBy: req.query.groupBy as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      console.log('[API] Generating report with filters:', filters);
      const report = await reportingService.generateReport(filters);
      
      res.json({
        success: true,
        report,
        generatedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Reports endpoint error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Export report as CSV
  app.get("/api/reports/export/csv", async (req, res) => {
    try {
      const filters = reportFiltersSchema.parse({
        formName: req.query.formName as string,
        zohoModule: req.query.zohoModule as string,
        processingStatus: req.query.processingStatus as string,
        syncStatus: req.query.syncStatus as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        includeCustomFields: req.query.includeCustomFields === 'true',
        groupBy: req.query.groupBy as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      console.log('[API] Exporting report as CSV:', filters);
      const csvContent = await reportingService.exportReportAsCSV(filters);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `form_submissions_report_${timestamp}.csv`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);

    } catch (error) {
      console.error('[API] CSV export error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      });
    }
  });

  // Get CRM lead summary using COQL
  app.get("/api/reports/crm-summary", async (req, res) => {
    try {
      const filters = {
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        sourceForm: req.query.sourceForm as string,
      };

      console.log('[API] Fetching CRM summary:', filters);
      const summary = await reportingService.getLeadSummaryFromCRM(filters);
      
      res.json({
        success: true,
        summary,
        generatedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] CRM summary error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'CRM summary failed',
        suggestion: 'Ensure OAuth tokens are valid and CRM access is working',
      });
    }
  });

  // Field metadata cache management endpoints
  app.get("/api/metadata/cache-stats", async (req, res) => {
    try {
      const stats = await fieldMetadataCacheService.getCacheStats();
      
      res.json({
        success: true,
        stats,
        retrievedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Cache stats error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get cache stats',
      });
    }
  });

  // Notification System API endpoints (DISABLED for production)
  /*
  app.get("/api/notifications/config", async (req, res) => {
    try {
      // const config = notificationService.getConfiguration();
      
      res.json({
        success: true,
        config,
        retrievedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Get notification config error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get config',
      });
    }
  });

  app.post("/api/notifications/config", async (req, res) => {
    try {
      const newConfig = notificationConfigSchema.partial().parse(req.body);
      
      await notificationService.updateConfiguration(newConfig);
      
      res.json({
        success: true,
        config: notificationService.getConfiguration(),
        updatedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Update notification config error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid configuration data',
          details: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update config',
      });
    }
  });

  app.post("/api/notifications/test-weekly-report", async (req, res) => {
    try {
      console.log('[API] Manual weekly report generation requested');
      const report = await notificationService.generateWeeklyReportNow();
      
      res.json({
        success: true,
        report,
        message: 'Weekly report generated successfully (check server logs for email content)',
        generatedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Test weekly report error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate report',
      });
    }
  });

  app.post("/api/notifications/test-alerts", async (req, res) => {
    try {
      console.log('[API] Manual alert check requested');
      await notificationService.checkAlertsNow();
      
      res.json({
        success: true,
        message: 'Alert check completed (check server logs for any alerts)',
        checkedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Test alerts error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check alerts',
      });
    }
  });

  app.post("/api/notifications/send-csv-report", async (req, res) => {
    try {
      const filters = req.body.filters || {};
      
      console.log('[API] CSV report email requested');
      await notificationService.sendCSVReport(filters);
      
      res.json({
        success: true,
        message: 'CSV report prepared for email delivery (check server logs)',
        sentAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Send CSV report error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send CSV report',
      });
    }
  });
  */

  // Form Scalability System API endpoints - REMOVED: Duplicate of /api/submit-form

  // REMOVED: /api/forms/analyze - Management endpoint not needed for production

  // REMOVED: /api/forms/configure - Management endpoint not needed for production

  // REMOVED: /api/forms/configs - Management endpoint not needed for production

  // REMOVED: /api/forms/configs/:formName GET - Management endpoint not needed

  // REMOVED: /api/forms/configs/:formName PUT - Management endpoint not needed

  // REMOVED: /api/forms/configs/:formName DELETE - Management endpoint not needed

  // REMOVED: /api/forms/stats - Management endpoint not needed for production

  // Error Handling & Retry System API endpoints
  app.post("/api/errors/handle", async (req, res) => {
    try {
      const { submissionId, error, operation, context } = req.body;
      
      if (!submissionId || !error) {
        return res.status(400).json({
          success: false,
          error: 'submissionId and error are required',
        });
      }

      console.log(`[API] Handling error for submission ${submissionId}`);
      const result = await errorHandlingService.handleError(
        parseInt(submissionId),
        error,
        operation || 'unknown',
        context
      );
      
      res.json({
        success: true,
        result,
        handledAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Error handling failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error handling failed',
      });
    }
  });

  app.post("/api/errors/classify", async (req, res) => {
    try {
      const { error, context } = req.body;
      
      if (!error) {
        return res.status(400).json({
          success: false,
          error: 'error is required',
        });
      }

      const analysis = errorHandlingService.classifyError(error, context);
      
      res.json({
        success: true,
        analysis,
        classifiedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Error classification failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Classification failed',
      });
    }
  });

  app.get("/api/errors/stats", async (req, res) => {
    try {
      const stats = await errorHandlingService.getErrorStatistics();
      
      res.json({
        success: true,
        stats,
        retrievedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Error stats failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get error statistics',
      });
    }
  });

  app.post("/api/errors/retry/:submissionId", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.submissionId);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid submission ID',
        });
      }

      console.log(`[API] Manual retry requested for submission ${submissionId}`);
      
      // This would trigger a manual retry - for now we'll just log it
      console.log(`[Error Handler] Manual retry triggered for submission ${submissionId}`);
      
      res.json({
        success: true,
        message: `Manual retry scheduled for submission ${submissionId}`,
        triggeredAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Manual retry failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Manual retry failed',
      });
    }
  });

  // REMOVED: All duplicate form processing endpoints
  // Only /api/submit-form is the canonical form submission endpoint

  // ============================================================
  // Form Configuration API - CRUD for form-to-CRM mappings
  // ============================================================
  
  // GET /api/form-configurations - List all form configurations
  app.get("/api/form-configurations", async (req, res) => {
    try {
      const activeOnly = req.query.active === 'true';
      const configs = activeOnly 
        ? await formConfigEngine.getActiveFormConfigurations()
        : await formConfigEngine.getAllFormConfigurations();
      
      res.json({
        success: true,
        count: configs.length,
        configurations: configs,
      });
    } catch (error) {
      console.error('[Form Config API] Error listing configurations:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list configurations',
      });
    }
  });

  // GET /api/form-configurations/:formName - Get specific form configuration
  app.get("/api/form-configurations/:formName", async (req, res) => {
    try {
      const { formName } = req.params;
      const config = await formConfigEngine.getFormConfiguration(formName);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          error: `Form configuration not found: ${formName}`,
        });
      }
      
      res.json({
        success: true,
        configuration: config,
      });
    } catch (error) {
      console.error('[Form Config API] Error getting configuration:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get configuration',
      });
    }
  });

  // POST /api/form-configurations - Create new form configuration
  app.post("/api/form-configurations", async (req, res) => {
    try {
      const { formName, zohoModule, leadSourceTag, displayFields, submitFields, strictMapping, autoCreateFields, description } = req.body;
      
      if (!formName) {
        return res.status(400).json({
          success: false,
          error: 'Form name is required',
        });
      }

      // Check if configuration already exists
      const existing = await formConfigEngine.getFormConfiguration(formName);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: `Form configuration already exists: ${formName}`,
        });
      }

      const config = await formConfigEngine.createFormConfiguration({
        formName,
        zohoModule,
        leadSourceTag,
        displayFields,
        submitFields,
        strictMapping,
        autoCreateFields,
        description,
      });

      res.status(201).json({
        success: true,
        message: `Form configuration created: ${formName}`,
        configuration: config,
      });
    } catch (error) {
      console.error('[Form Config API] Error creating configuration:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create configuration',
      });
    }
  });

  // PUT /api/form-configurations/:formName - Update form configuration
  app.put("/api/form-configurations/:formName", async (req, res) => {
    try {
      const { formName } = req.params;
      const { zohoModule, leadSourceTag, displayFields, submitFields, strictMapping, autoCreateFields, isActive, description } = req.body;

      // Check if configuration exists
      const existing = await formConfigEngine.getFormConfiguration(formName);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Form configuration not found: ${formName}`,
        });
      }

      const updates: Record<string, any> = {};
      if (zohoModule !== undefined) updates.zohoModule = zohoModule;
      if (leadSourceTag !== undefined) updates.leadSourceTag = leadSourceTag;
      if (displayFields !== undefined) updates.displayFields = displayFields;
      if (submitFields !== undefined) updates.submitFields = submitFields;
      if (strictMapping !== undefined) updates.strictMapping = strictMapping;
      if (autoCreateFields !== undefined) updates.autoCreateFields = autoCreateFields;
      if (isActive !== undefined) updates.isActive = isActive;
      if (description !== undefined) updates.description = description;

      const config = await formConfigEngine.updateFormConfiguration(formName, updates);

      res.json({
        success: true,
        message: `Form configuration updated: ${formName}`,
        configuration: config,
      });
    } catch (error) {
      console.error('[Form Config API] Error updating configuration:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update configuration',
      });
    }
  });

  // DELETE /api/form-configurations/:formName - Delete form configuration
  app.delete("/api/form-configurations/:formName", async (req, res) => {
    try {
      const { formName } = req.params;

      const existing = await formConfigEngine.getFormConfiguration(formName);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Form configuration not found: ${formName}`,
        });
      }

      const deleted = await formConfigEngine.deleteFormConfiguration(formName);

      if (deleted) {
        res.json({
          success: true,
          message: `Form configuration deleted: ${formName}`,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete configuration',
        });
      }
    } catch (error) {
      console.error('[Form Config API] Error deleting configuration:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete configuration',
      });
    }
  });

  // POST /api/form-configurations/:formName/validate - Validate form configuration
  app.post("/api/form-configurations/:formName/validate", async (req, res) => {
    try {
      const { formName } = req.params;
      const configData = req.body;
      
      // Merge formName from URL
      configData.formName = configData.formName || formName;
      
      const validation = formConfigEngine.validateFormConfiguration(configData);
      
      res.json({
        success: validation.valid,
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
      });
    } catch (error) {
      console.error('[Form Config API] Error validating configuration:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to validate configuration',
      });
    }
  });

  // Admin endpoint to reload tokens from database
  app.post("/api/admin/reload-tokens", async (req, res) => {
    try {
      console.log('[Admin] Reloading tokens from database...');
      await dedicatedTokenManager.initialize();
      res.json({
        success: true,
        message: 'Tokens reloaded from database',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[Admin] Failed to reload tokens:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reload tokens',
      });
    }
  });

  // Admin endpoint to create required custom fields in Zoho CRM
  app.post("/api/admin/create-zoho-fields", async (req, res) => {
    try {
      console.log('[Admin] Creating custom fields in Zoho CRM Leads module...');
      
      const fieldsToCreate = [
        {
          api_name: "CAS_Communications",
          field_label: "CAS Communications",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        },
        {
          api_name: "Services_Map_Inclusion",
          field_label: "Services Map Inclusion",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        },
        {
          api_name: "Amyloidosis_Type",
          field_label: "Amyloidosis Type",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "ATTR", actual_value: "ATTR" },
            { display_value: "AL", actual_value: "AL" },
            { display_value: "Both ATTR and AL", actual_value: "Both ATTR and AL" },
            { display_value: "Other", actual_value: "Other" }
          ]
        },
        {
          api_name: "CANN_Communications",
          field_label: "CANN Communications",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        },
        {
          api_name: "Educational_Interests",
          field_label: "Educational Interests",
          data_type: "multiselectpicklist" as const,
          pick_list_values: [
            { display_value: "Diagnostic Techniques", actual_value: "Diagnostic Techniques" },
            { display_value: "Treatment Pathways", actual_value: "Treatment Pathways" },
            { display_value: "Patient Care", actual_value: "Patient Care" },
            { display_value: "Research Updates", actual_value: "Research Updates" },
            { display_value: "Case Studies", actual_value: "Case Studies" },
            { display_value: "Networking Opportunities", actual_value: "Networking Opportunities" }
          ]
        },
        {
          api_name: "Interested_in_Presenting",
          field_label: "Interested in Presenting",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        },
        {
          api_name: "Record_Type",
          field_label: "Record Type",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Member", actual_value: "Member" },
            { display_value: "Inquiry", actual_value: "Inquiry" }
          ]
        },
        {
          api_name: "CANN_Communication_Consent",
          field_label: "CANN Communication Consent",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        },
        {
          api_name: "Source_Form",
          field_label: "Source Form",
          data_type: "text" as const,
        }
      ];

      const results = [];
      const errors = [];

      for (const fieldData of fieldsToCreate) {
        try {
          console.log(`[Admin] Creating field: ${fieldData.api_name}...`);
          const createdField = await zohoCRMService.createCustomField("Leads", fieldData);
          results.push({
            field: fieldData.api_name,
            status: 'created',
            id: createdField.id
          });
          console.log(`[Admin] ✅ Successfully created field: ${fieldData.api_name}`);
        } catch (error: any) {
          // Check if field already exists
          if (error.message?.includes('already exists') || error.message?.includes('DUPLICATE')) {
            results.push({
              field: fieldData.api_name,
              status: 'already_exists'
            });
            console.log(`[Admin] ℹ️ Field already exists: ${fieldData.api_name}`);
          } else {
            errors.push({
              field: fieldData.api_name,
              error: error.message || 'Unknown error'
            });
            console.error(`[Admin] ❌ Failed to create field ${fieldData.api_name}:`, error);
          }
        }
      }

      res.json({
        success: errors.length === 0,
        message: `Created ${results.filter(r => r.status === 'created').length} fields, ${results.filter(r => r.status === 'already_exists').length} already existed`,
        results,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('[Admin] Failed to create custom fields:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create custom fields'
      });
    }
  });

  // Health monitoring status endpoint
  app.get("/api/admin/monitoring-status", async (req, res) => {
    try {
      const status = dedicatedTokenManager.getMonitoringStatus();
      const tokenHealth = await dedicatedTokenManager.checkTokenHealth('zoho_crm');
      
      res.json({
        monitoring: status,
        tokenHealth,
        serverTime: new Date().toISOString(),
        timeSinceLastCheck: status.lastCheckTime 
          ? Math.round((Date.now() - new Date(status.lastCheckTime).getTime()) / 1000)
          : null,
      });
    } catch (error) {
      console.error('[Admin] Failed to get monitoring status:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get monitoring status',
      });
    }
  });

  // Setup Email Notification Workflows
  app.post("/api/admin/setup-email-workflows", async (req, res) => {
    try {
      console.log('[Admin] Setting up email notification workflows in Zoho CRM...');
      
      const result = await zohoWorkflowService.setupRegistrationEmailWorkflows();
      
      res.json({
        success: result.success,
        message: result.success 
          ? `Successfully created ${result.workflows.length} email notification workflows`
          : `Created ${result.workflows.length} workflows with ${result.errors.length} errors`,
        workflows: result.workflows,
        errors: result.errors.length > 0 ? result.errors : undefined,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Admin] Failed to setup email workflows:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to setup email workflows'
      });
    }
  });

  // Batch update Zoho records with correct field mappings (protected admin endpoint)
  app.post("/api/admin/fix-zoho-records", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Starting batch update of Zoho records with correct field mappings...');
      
      const { dryRun = true, limit = 10 } = req.body;
      const layoutId = '6999043000002392001'; // CAS / CANN - v2 layout
      
      // Get all synced submissions that need fixing
      const submissions = await storage.getFormSubmissions();
      const syncedSubmissions = submissions.filter(s => 
        s.syncStatus === 'synced' && 
        s.zohoCrmId && 
        ['CAS & CANN Registration', 'CAS Registration', 'Excel Import - CAS Registration', 'Excel Import - PANN Membership'].includes(s.formName)
      ).slice(0, limit);
      
      console.log(`[Admin] Found ${syncedSubmissions.length} records to update (limit: ${limit})`);
      
      const results: { id: number; zohoId: string; status: string; error?: string }[] = [];
      
      for (const submission of syncedSubmissions) {
        try {
          const formData = submission.submissionData as Record<string, any>;
          
          // Use centralized field mapping with business rules
          const mappingResult = buildCentralizedZohoData({
            formData,
            formName: submission.formName,
            layoutId,
            isExcelImport: submission.formName.includes('Excel'),
          });
          const updateData = mappingResult.zohoData;
          
          console.log(`[Admin] Centralized mapping for submission #${submission.id}: ${mappingResult.appliedRules.join('; ')}`);
          
          if (dryRun) {
            console.log(`[Admin DryRun] Would update Zoho record ${submission.zohoCrmId}:`, JSON.stringify(updateData, null, 2));
            results.push({ id: submission.id, zohoId: submission.zohoCrmId!, status: 'dry_run', error: undefined });
          } else {
            await zohoCRMService.updateRecord('Leads', submission.zohoCrmId!, updateData);
            console.log(`[Admin] Updated Zoho record ${submission.zohoCrmId} successfully`);
            results.push({ id: submission.id, zohoId: submission.zohoCrmId!, status: 'updated', error: undefined });
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[Admin] Failed to update record ${submission.id}:`, errorMsg);
          
          // Check if record is orphaned (Zoho ID no longer exists)
          const isOrphaned = errorMsg.includes('the id given seems to be invalid');
          
          if (isOrphaned && !dryRun) {
            // Mark as failed with orphaned message in database
            await storage.updateFormSubmission(submission.id, {
              syncStatus: 'failed',
              errorMessage: 'ORPHANED: Zoho record no longer exists - ID was deleted from Zoho CRM'
            });
            results.push({ id: submission.id, zohoId: submission.zohoCrmId!, status: 'orphaned', error: errorMsg });
          } else {
            results.push({ id: submission.id, zohoId: submission.zohoCrmId!, status: 'failed', error: errorMsg });
          }
        }
      }
      
      const successCount = results.filter(r => r.status === 'updated' || r.status === 'dry_run').length;
      const orphanedCount = results.filter(r => r.status === 'orphaned').length;
      const failedCount = results.filter(r => r.status === 'failed').length;
      
      res.json({
        success: true,
        message: dryRun 
          ? `Dry run completed: ${successCount} records would be updated`
          : `Updated ${successCount} records, ${orphanedCount} orphaned (marked in DB), ${failedCount} failed`,
        dryRun,
        totalProcessed: results.length,
        successCount,
        orphanedCount,
        failedCount,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Admin] Batch update failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Batch update failed'
      });
    }
  });

  // Re-sync orphaned records back to Zoho CRM as new leads
  app.post("/api/admin/resync-orphaned-records", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Starting re-sync of orphaned records to Zoho CRM...');
      
      const { dryRun = true, limit = 100 } = req.body;
      const layoutId = '6999043000002392001'; // CAS / CANN - v2 layout
      
      // Get orphaned submissions (failed with ORPHANED message)
      const submissions = await storage.getFormSubmissions();
      const orphanedSubmissions = submissions.filter(s => 
        s.syncStatus === 'failed' && 
        s.errorMessage?.includes('ORPHANED') &&
        ['CAS & CANN Registration', 'CAS Registration', 'Excel Import - CAS Registration', 'Excel Import - PANN Membership'].includes(s.formName)
      ).slice(0, limit);
      
      console.log(`[Admin] Found ${orphanedSubmissions.length} orphaned records to re-sync (limit: ${limit})`);
      
      const results: { id: number; oldZohoId: string | null; newZohoId?: string; status: string; error?: string }[] = [];
      
      for (const submission of orphanedSubmissions) {
        try {
          const formData = submission.submissionData as Record<string, any>;
          
          // Get layout from form configuration (falls back to CAS and CANN layout)
          const formConfig = await formConfigEngine.getFormConfiguration(submission.formName);
          const resolvedLayoutId = formConfig?.zohoLayoutId || layoutId;
          
          // Use centralized field mapping with business rules
          const mappingResult = buildCentralizedZohoData({
            formData,
            formName: submission.formName,
            layoutId: resolvedLayoutId,
            isExcelImport: submission.formName.includes('Excel'),
            isResync: true,
          });
          const recordData = mappingResult.zohoData;
          
          console.log(`[Admin] Centralized mapping for orphaned submission #${submission.id}: ${mappingResult.appliedRules.join('; ')}`);
          
          if (dryRun) {
            console.log(`[Admin DryRun] Would create new Zoho lead for orphaned record ${submission.id}`);
            results.push({ id: submission.id, oldZohoId: submission.zohoCrmId, status: 'dry_run' });
          } else {
            // Create new lead in Zoho
            const newLead = await zohoCRMService.createRecord('Leads', recordData);
            const newZohoId = newLead.id || newLead.details?.id;
            
            // Update database with new Zoho ID
            await storage.updateFormSubmission(submission.id, {
              syncStatus: 'synced',
              zohoCrmId: newZohoId,
              errorMessage: null
            });
            
            console.log(`[Admin] Re-synced orphaned record ${submission.id} -> new Zoho ID: ${newZohoId}`);
            results.push({ id: submission.id, oldZohoId: submission.zohoCrmId, newZohoId, status: 'resynced' });
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[Admin] Failed to re-sync record ${submission.id}:`, errorMsg);
          results.push({ id: submission.id, oldZohoId: submission.zohoCrmId, status: 'failed', error: errorMsg });
        }
      }
      
      const successCount = results.filter(r => r.status === 'resynced' || r.status === 'dry_run').length;
      const failedCount = results.filter(r => r.status === 'failed').length;
      
      res.json({
        success: true,
        message: dryRun 
          ? `Dry run: ${successCount} orphaned records would be re-synced to Zoho`
          : `Re-synced ${successCount} orphaned records to Zoho, ${failedCount} failed`,
        dryRun,
        totalProcessed: results.length,
        successCount,
        failedCount,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Admin] Re-sync failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Re-sync failed'
      });
    }
  });

  // Data remediation: Fix CANN→CAS dependency violations and add Record_Type to existing records
  app.post("/api/admin/zoho/fix-membership-dependencies", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Starting membership dependency remediation...');
      
      const { dryRun = true, limit = 100 } = req.body;
      
      const submissions = await storage.getFormSubmissions();
      const targetSubmissions = submissions.filter(s => 
        s.syncStatus === 'synced' && 
        s.zohoCrmId &&
        ['CAS & CANN Registration', 'CAS Registration', 'Excel Import - CAS Registration', 'Excel Import - PANN Membership'].includes(s.formName)
      ).slice(0, limit);
      
      console.log(`[Admin] Scanning ${targetSubmissions.length} synced records for dependency violations...`);
      
      const results: { 
        id: number; 
        zohoId: string; 
        status: string; 
        issues: string[];
        error?: string;
      }[] = [];
      
      let violationCount = 0;
      let missingRecordTypeCount = 0;
      
      for (const submission of targetSubmissions) {
        try {
          const formData = submission.submissionData as Record<string, any>;
          const issues: string[] = [];
          const updateData: Record<string, any> = {};
          
          const wantsCAS = formData.wantsMembership === 'Yes' || formData.wantsMembership === true;
          const wantsCANN = formData.wantsCANNMembership === 'Yes' || formData.wantsCANNMembership === true;
          
          // Fix layout assignment from form configuration
          const formConfig = await formConfigEngine.getFormConfiguration(submission.formName);
          if (formConfig?.zohoLayoutId) {
            updateData.Layout = { id: formConfig.zohoLayoutId };
            issues.push(`Layout set to "${formConfig.zohoLayoutName || formConfig.zohoLayoutId}"`);
          }
          
          // Check CANN→CAS dependency violation
          if (wantsCANN && !wantsCAS) {
            issues.push('CANN→CAS violation: CANN_Member=true but CAS_Member=false');
            updateData.CAS_Member = true;
            violationCount++;
          }
          
          // Add Record_Type classification (always apply — this field was never sent before)
          const isMember = wantsCAS || wantsCANN;
          updateData.Record_Type = isMember ? 'Member' : 'Inquiry';
          issues.push(`Record_Type set to "${isMember ? 'Member' : 'Inquiry'}"`);
          missingRecordTypeCount++;
          
          // Fix Lead_Source for non-member inquiries
          if (!isMember && !submission.formName.includes('Excel')) {
            updateData.Lead_Source = 'Website - Contact Inquiry';
            issues.push('Lead_Source corrected to "Website - Contact Inquiry"');
          }
          
          if (Object.keys(updateData).length === 0) {
            results.push({ id: submission.id, zohoId: submission.zohoCrmId!, status: 'no_changes_needed', issues });
            continue;
          }
          
          if (dryRun) {
            console.log(`[Admin DryRun] Would fix record ${submission.zohoCrmId}: ${issues.join('; ')}`);
            results.push({ id: submission.id, zohoId: submission.zohoCrmId!, status: 'dry_run', issues });
          } else {
            await zohoCRMService.updateRecord('Leads', submission.zohoCrmId!, updateData);
            console.log(`[Admin] Fixed record ${submission.zohoCrmId}: ${issues.join('; ')}`);
            results.push({ id: submission.id, zohoId: submission.zohoCrmId!, status: 'fixed', issues });
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          results.push({ id: submission.id, zohoId: submission.zohoCrmId!, status: 'failed', issues: [], error: errorMsg });
        }
      }
      
      const fixedCount = results.filter(r => r.status === 'fixed' || r.status === 'dry_run').length;
      const failedCount = results.filter(r => r.status === 'failed').length;
      
      res.json({
        success: true,
        message: dryRun 
          ? `Dry run: ${fixedCount} records would be remediated (${violationCount} CANN→CAS violations, ${missingRecordTypeCount} Record_Type additions)`
          : `Remediated ${fixedCount} records (${violationCount} CANN→CAS violations fixed, ${missingRecordTypeCount} Record_Type added), ${failedCount} failed`,
        dryRun,
        totalScanned: targetSubmissions.length,
        violationCount,
        missingRecordTypeCount,
        fixedCount,
        failedCount,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Admin] Remediation failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Remediation failed'
      });
    }
  });

  // SSOT vs CRM Validation Report (Phase 1 - read-only comparison)
  app.get("/api/admin/zoho/ssot-validation-report", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Running SSOT vs CRM validation report...');
      const format = (req.query.format as string) || 'json';

      const report = await runSSOTValidation();

      if (format === 'text') {
        const summary = buildHumanReadableSummary(report);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.send(summary);
      }

      res.json({
        success: true,
        report,
      });
    } catch (error) {
      console.error('[Admin] SSOT validation failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'SSOT validation failed',
      });
    }
  });

  // SSOT Apply Changes (Phase 2 - deletions and new record creation)
  app.post("/api/admin/zoho/apply-ssot-changes", requireAutomationAuth, async (req, res) => {
    try {
      const schema = z.object({
        dryRun: z.boolean().default(true),
        confirmConsentDeletion: z.boolean().default(false),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: 'Invalid request body', details: parsed.error.issues });
      }
      const { dryRun, confirmConsentDeletion } = parsed.data;
      console.log(`[Admin] apply-ssot-changes called: dryRun=${dryRun}, confirmConsentDeletion=${confirmConsentDeletion}`);
      const result = await applySSOTChanges({ dryRun, confirmConsentDeletion });

      let logWriteFailed = false;
      if (!dryRun) {
        const logEntry = {
          timestamp: new Date().toISOString(),
          dryRun,
          confirmConsentDeletion,
          counts: result.counts,
          deleted: result.deleted,
          created: result.created,
          skipped: result.skipped,
          errors: result.errors,
        };
        try {
          const logPath = path.resolve('docs/ssot-apply-log.jsonl');
          fs.mkdirSync(path.dirname(logPath), { recursive: true });
          fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n', 'utf8');
          trimSSOTLog(logPath);
          console.log(`[Admin] apply-ssot-changes audit log written to ${logPath}`);
        } catch (logErr) {
          logWriteFailed = true;
          console.error('[Admin] apply-ssot-changes audit log write FAILED — changes were still applied:', logErr);
        }
      }

      res.json({ success: true, result, ...(logWriteFailed ? { logWriteFailed: true } : {}) });
    } catch (error) {
      console.error('[Admin] apply-ssot-changes failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'apply-ssot-changes failed',
      });
    }
  });

  // SSOT Apply Field Corrections (Phase 2b — patch matched records with field-level discrepancies)
  app.post("/api/admin/zoho/apply-ssot-field-corrections", requireAutomationAuth, async (req, res) => {
    try {
      const schema = z.object({
        dryRun: z.boolean().default(true),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: 'Invalid request body', details: parsed.error.issues });
      }
      const { dryRun } = parsed.data;
      console.log(`[Admin] apply-ssot-field-corrections called: dryRun=${dryRun}`);

      const result = await applyFieldCorrections({ dryRun });

      let logWriteFailed = false;
      if (!dryRun) {
        const logEntry = {
          timestamp: new Date().toISOString(),
          action: 'field-corrections',
          dryRun,
          counts: result.counts,
          updated: result.updated,
          skipped: result.skipped,
          errors: result.errors,
        };
        try {
          const logPath = path.resolve('docs/ssot-apply-log.jsonl');
          fs.mkdirSync(path.dirname(logPath), { recursive: true });
          fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n', 'utf8');
          trimSSOTLog(logPath);
          console.log(`[Admin] apply-ssot-field-corrections audit log written to ${logPath}`);
        } catch (logErr) {
          logWriteFailed = true;
          console.error('[Admin] apply-ssot-field-corrections audit log write FAILED — changes were still applied:', logErr);
        }
      }

      res.json({ success: true, result, ...(logWriteFailed ? { logWriteFailed: true } : {}) });
    } catch (error) {
      console.error('[Admin] apply-ssot-field-corrections failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'apply-ssot-field-corrections failed',
      });
    }
  });

  // SSOT Apply Log — return all past runs
  app.get("/api/admin/zoho/apply-ssot-log", requireAutomationAuth, async (_req, res) => {
    try {
      const logPath = path.resolve('docs/ssot-apply-log.jsonl');
      if (!fs.existsSync(logPath)) {
        return res.json({ success: true, runs: [], total: 0 });
      }
      const raw = fs.readFileSync(logPath, 'utf8');
      const runs: unknown[] = [];
      const parseErrors: string[] = [];
      for (const line of raw.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          runs.push(JSON.parse(trimmed));
        } catch {
          parseErrors.push(trimmed.slice(0, 80));
        }
      }
      if (parseErrors.length > 0) {
        console.warn(`[Admin] apply-ssot-log: ${parseErrors.length} malformed line(s) skipped`);
      }
      const recentRuns = runs.slice(-SSOT_LOG_RETURN_LIMIT);
      res.json({ success: true, runs: recentRuns, total: runs.length, ...(parseErrors.length > 0 ? { skippedMalformedLines: parseErrors.length } : {}) });
    } catch (error) {
      console.error('[Admin] apply-ssot-log read failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read apply-ssot-log',
      });
    }
  });

  // Analyze Zoho CRM data - get breakdown by Lead_Source and Layout
  app.get("/api/admin/zoho-crm-analysis", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Fetching Zoho CRM data for analysis...');
      
      // Fetch all leads from Zoho with pagination
      const allLeads: any[] = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore && page <= 10) { // Max 10 pages (2000 records)
        const response = await zohoCRMService.getRecords('Leads', {
          page,
          per_page: 200,
          fields: 'id,Last_Name,Email,Lead_Source,Layout,Company,Created_Time'
        });
        
        if (response && response.length > 0) {
          allLeads.push(...response);
          page++;
          hasMore = response.length === 200;
        } else {
          hasMore = false;
        }
      }
      
      // Categorize by Lead_Source
      const byLeadSource: Record<string, number> = {};
      const byLayout: Record<string, number> = {};
      const testRecords: any[] = [];
      
      for (const lead of allLeads) {
        const source = lead.Lead_Source || 'Unknown';
        const layout = lead.Layout?.name || 'Unknown';
        
        byLeadSource[source] = (byLeadSource[source] || 0) + 1;
        byLayout[layout] = (byLayout[layout] || 0) + 1;
        
        // Check if test record
        const email = lead.Email?.toLowerCase() || '';
        const name = lead.Last_Name?.toLowerCase() || '';
        if (email.includes('test') || email.includes('debug') || 
            email.includes('vasi') || email.endsWith('@example.com') ||
            name.includes('test')) {
          testRecords.push({
            id: lead.id,
            name: lead.Last_Name,
            email: lead.Email,
            source: lead.Lead_Source
          });
        }
      }
      
      // Find duplicates by email
      const emailCounts: Record<string, { count: number; ids: string[]; names: string[] }> = {};
      for (const lead of allLeads) {
        const email = lead.Email?.toLowerCase();
        if (email) {
          if (!emailCounts[email]) {
            emailCounts[email] = { count: 0, ids: [], names: [] };
          }
          emailCounts[email].count++;
          emailCounts[email].ids.push(lead.id);
          emailCounts[email].names.push(lead.Last_Name || '');
        }
      }
      const duplicates = Object.entries(emailCounts)
        .filter(([_, data]) => data.count > 1)
        .map(([email, data]) => ({ email, ...data }))
        .sort((a, b) => b.count - a.count);
      
      res.json({
        success: true,
        totalRecords: allLeads.length,
        byLeadSource,
        byLayout,
        testRecordsCount: testRecords.length,
        testRecords: testRecords.slice(0, 50),
        duplicatesCount: duplicates.length,
        duplicates: duplicates.slice(0, 30),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Admin] Zoho analysis failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      });
    }
  });

  // Deduplicate Zoho CRM records (keep newest, delete older duplicates)
  app.post("/api/admin/zoho-deduplicate", requireAutomationAuth, async (req, res) => {
    try {
      const { dryRun = true } = req.body;
      console.log(`[Admin] ${dryRun ? 'DRY RUN: ' : ''}Deduplicating Zoho CRM records...`);
      
      // Fetch all leads
      const allLeads: any[] = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore && page <= 10) {
        const response = await zohoCRMService.getRecords('Leads', { page, per_page: 200, fields: 'id,Last_Name,Email,Created_Time' });
        if (response && response.length > 0) {
          allLeads.push(...response);
          page++;
          hasMore = response.length === 200;
        } else {
          hasMore = false;
        }
      }
      
      // Group by email
      const emailGroups: Record<string, any[]> = {};
      for (const lead of allLeads) {
        const email = lead.Email?.toLowerCase();
        if (email) {
          if (!emailGroups[email]) emailGroups[email] = [];
          emailGroups[email].push(lead);
        }
      }
      
      // Find IDs to delete (keep the one with highest ID = newest)
      const idsToDelete: string[] = [];
      for (const [email, leads] of Object.entries(emailGroups)) {
        if (leads.length > 1) {
          // Sort by ID descending, keep first (highest ID = newest)
          leads.sort((a, b) => b.id.localeCompare(a.id));
          for (let i = 1; i < leads.length; i++) {
            idsToDelete.push(leads[i].id);
          }
        }
      }
      
      console.log(`[Admin] Found ${idsToDelete.length} duplicate records to delete`);
      
      if (dryRun) {
        res.json({
          success: true,
          message: `Dry run: Would delete ${idsToDelete.length} duplicate records`,
          dryRun: true,
          duplicateCount: idsToDelete.length,
          idsToDelete: idsToDelete.slice(0, 50)
        });
      } else {
        // Delete in batches
        const results: any[] = [];
        for (let i = 0; i < idsToDelete.length; i += 100) {
          const batch = idsToDelete.slice(i, i + 100);
          try {
            await zohoCRMService['makeRequest'](`/Leads?ids=${batch.join(',')}`, 'DELETE');
            results.push({ batch: i / 100 + 1, count: batch.length, status: 'deleted' });
            console.log(`[Admin] Deleted duplicate batch ${i / 100 + 1}: ${batch.length} records`);
          } catch (error) {
            results.push({ batch: i / 100 + 1, count: batch.length, status: 'failed' });
          }
        }
        
        res.json({
          success: true,
          message: `Deleted ${idsToDelete.length} duplicate records from Zoho CRM`,
          results
        });
      }
    } catch (error) {
      console.error('[Admin] Deduplication failed:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
    }
  });

  // Delete test records from Zoho CRM
  app.post("/api/admin/zoho-delete-test-records", requireAutomationAuth, async (req, res) => {
    try {
      const { dryRun = true, testRecordIds } = req.body;
      console.log(`[Admin] ${dryRun ? 'DRY RUN: ' : ''}Deleting test records from Zoho CRM...`);
      
      if (!testRecordIds || !Array.isArray(testRecordIds) || testRecordIds.length === 0) {
        return res.status(400).json({ success: false, error: 'testRecordIds array required' });
      }
      
      if (dryRun) {
        res.json({
          success: true,
          message: `Dry run: Would delete ${testRecordIds.length} test records from Zoho`,
          dryRun: true,
          recordCount: testRecordIds.length
        });
      } else {
        // Delete in batches of 100 (Zoho limit)
        const results: any[] = [];
        for (let i = 0; i < testRecordIds.length; i += 100) {
          const batch = testRecordIds.slice(i, i + 100);
          const idsParam = batch.join(',');
          
          try {
            await zohoCRMService['makeRequest'](`/Leads?ids=${idsParam}`, 'DELETE');
            results.push({ batch: i / 100 + 1, count: batch.length, status: 'deleted' });
            console.log(`[Admin] Deleted batch ${i / 100 + 1}: ${batch.length} records`);
          } catch (error) {
            results.push({ batch: i / 100 + 1, count: batch.length, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }
        
        res.json({
          success: true,
          message: `Deleted ${testRecordIds.length} test records from Zoho CRM`,
          results
        });
      }
    } catch (error) {
      console.error('[Admin] Zoho delete failed:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Delete failed' });
    }
  });

  app.post("/api/admin/zoho/create-views", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Creating operational Zoho CRM views...');
      const result = await zohoCRMService.createOperationalViews();
      res.json({
        success: result.failed.length === 0,
        created: result.created,
        failed: result.failed,
        summary: `${result.created.length} views created, ${result.failed.length} failed`
      });
    } catch (error) {
      console.error('[Admin] Zoho view creation failed:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'View creation failed' });
    }
  });

  app.post("/api/admin/zoho/create-january-views", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Recreating registration views in Zoho CRM Leads module...');
      const result = await zohoCRMService.recreateRegistrationViews();
      res.json({
        success: result.failed.length === 0,
        deleted: result.deleted,
        created: result.created,
        failed: result.failed,
        summary: `Deleted ${result.deleted.length}, created ${result.created.length} registration views, ${result.failed.length} failed`,
        views: [
          { name: "2025 Registrations", filter: "Lead_Source contains '2025'" },
          { name: "2026 Registrations", filter: "Created_Time within 2026" }
        ]
      });
    } catch (error) {
      console.error('[Admin] Registration view recreation failed:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Registration view recreation failed' });
    }
  });

  app.post("/api/admin/zoho/recreate-registration-views", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Recreating registration views in Zoho CRM Leads module...');
      const result = await zohoCRMService.recreateRegistrationViews();
      res.json({
        success: result.failed.length === 0,
        deleted: result.deleted,
        created: result.created,
        failed: result.failed,
        summary: `Deleted ${result.deleted.length}, created ${result.created.length} registration views, ${result.failed.length} failed`,
        views: [
          { name: "2025 Registrations", filter: "Lead_Source contains '2025'" },
          { name: "2026 Registrations", filter: "Created_Time within 2026" }
        ]
      });
    } catch (error) {
      console.error('[Admin] Registration view recreation failed:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Registration view recreation failed' });
    }
  });

  // Exchange a Zoho Self Client grant code for new access+refresh tokens with expanded scope
  app.post("/api/admin/zoho/regrant-token", requireAutomationAuth, async (req, res) => {
    try {
      const { grantCode } = req.body;
      if (!grantCode) {
        return res.status(400).json({ success: false, error: "grantCode is required in the request body" });
      }

      const clientId = process.env.ZOHO_SELF_CLIENT_ID || process.env.ZOHO_CLIENT_ID;
      const clientSecret = process.env.ZOHO_SELF_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.status(500).json({ success: false, error: "Zoho client credentials not configured (need ZOHO_SELF_CLIENT_ID/SECRET or ZOHO_CLIENT_ID/SECRET)" });
      }

      console.log('[Admin] Exchanging Zoho grant code for new token with automation scope...');

      const params = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: grantCode,
      });

      const tokenResp = await fetch("https://accounts.zoho.com/oauth/v2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
      });

      const tokenData = await tokenResp.json();

      if (!tokenData.access_token || !tokenData.refresh_token) {
        console.error('[Admin] Token exchange failed:', tokenData);
        return res.status(400).json({
          success: false,
          error: tokenData.error || tokenData.message || "Token exchange failed — grant code may be expired (must be used within 3 minutes)",
          zohoResponse: tokenData
        });
      }

      await dedicatedTokenManager.storeToken('zoho_crm', {
        access_token:  tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in:    tokenData.expires_in || 3600,
        scope:         tokenData.scope || '',
        token_type:    tokenData.token_type || 'Bearer',
      });

      console.log(`[Admin] ✅ Token updated successfully. New scope: ${tokenData.scope}`);
      const hasWorkflowScope = (tokenData.scope || '').includes('workflow_rules') || (tokenData.scope || '').includes('settings.ALL');
      const expiresAt = new Date(Date.now() + (tokenData.expires_in || 3600) * 1000);

      res.json({
        success: true,
        scope: tokenData.scope,
        hasWorkflowScope,
        expiresAt,
        message: hasWorkflowScope
          ? "Token updated with workflow rules scope — ready to create workflow rules"
          : "Token updated but workflow rules scope may be missing — regenerate with ZohoCRM.settings.workflow_rules.ALL included"
      });
    } catch (error) {
      console.error('[Admin] Token regrant failed:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Token regrant failed' });
    }
  });

  // Create Zoho CRM workflow rules for email automation
  app.post("/api/admin/zoho/create-workflow-rules", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Creating Zoho CRM workflow rules...');
      const results = await zohoCRMService.createWorkflowRules();
      const created = results.filter(r => r.created).length;
      const failed = results.filter(r => !r.created).length;
      res.json({
        success: failed === 0,
        results,
        summary: `${created}/${results.length} workflow rules created`
      });
    } catch (error) {
      console.error('[Admin] Workflow rule creation failed:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Workflow rule creation failed' });
    }
  });

  // Fix broken merge fields in Zoho CRM admin notification email templates
  app.post("/api/admin/zoho/fix-email-templates", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Fixing Zoho CRM email template merge fields...');
      const results = await zohoCRMService.fixEmailTemplates();
      const allFixed = results.every(r => r.fixed);
      const totalChanges = results.reduce((sum, r) => sum + r.changes.length, 0);
      res.json({
        success: allFixed,
        results,
        summary: `${results.filter(r => r.fixed).length}/${results.length} templates fixed, ${totalChanges} total changes applied`
      });
    } catch (error) {
      console.error('[Admin] Email template fix failed:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Template fix failed' });
    }
  });

  // Clean up test/debug records from database
  app.post("/api/admin/cleanup-test-records", requireAutomationAuth, async (req, res) => {
    try {
      console.log('[Admin] Cleaning up test/debug records from database...');
      
      const { dryRun = true } = req.body;
      
      // List of test form names to delete
      const testFormPatterns = [
        'oauth_test%',
        'test_%',
        'pipeline%',
        'database-pipeline%',
        'production%test%',
        'routing%test%',
        'simple-crm%',
        'verification%',
        'contact'
      ];
      
      // Get all submissions
      const submissions = await storage.getFormSubmissions();
      const testSubmissions = submissions.filter(s => {
        const name = s.formName.toLowerCase();
        return testFormPatterns.some(pattern => {
          const regex = new RegExp('^' + pattern.replace(/%/g, '.*') + '$', 'i');
          return regex.test(s.formName);
        });
      });
      
      console.log(`[Admin] Found ${testSubmissions.length} test records to delete`);
      
      if (dryRun) {
        res.json({
          success: true,
          message: `Dry run: Would delete ${testSubmissions.length} test records`,
          dryRun: true,
          recordsToDelete: testSubmissions.map(s => ({ id: s.id, formName: s.formName })),
          timestamp: new Date().toISOString()
        });
      } else {
        // Delete each test record
        let deletedCount = 0;
        for (const submission of testSubmissions) {
          try {
            await storage.deleteFormSubmission(submission.id);
            deletedCount++;
          } catch (error) {
            console.error(`[Admin] Failed to delete record ${submission.id}:`, error);
          }
        }
        
        res.json({
          success: true,
          message: `Deleted ${deletedCount} test records`,
          dryRun: false,
          deletedCount,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('[Admin] Cleanup failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Cleanup failed'
      });
    }
  });

  // Data Sync Admin Routes
  // Import the data sync services
  const path = await import('path');
  const fs = await import('fs');
  const multer = (await import('multer')).default;
  const { importHandler } = await import('../services/zoho-data-sync/import/import-handler');
  const { fileParser } = await import('../services/zoho-data-sync/import/file-parser');

  // Configure multer for file uploads
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'services/zoho-data-sync/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: multerStorage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Only CSV and Excel files are allowed'));
      }
    }
  });

  // Upload file endpoint
  app.post('/api/data-sync/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const moduleName = req.body.moduleName as 'Accounts' | 'Contacts' | 'Resources';
      if (!moduleName || !['Accounts', 'Contacts', 'Resources'].includes(moduleName)) {
        return res.status(400).json({ error: 'Invalid module name' });
      }

      const filePath = req.file.path;
      const sheetName = req.body.sheetName;

      // Get sheets if Excel
      let sheets: string[] = [];
      if (path.extname(req.file.originalname).toLowerCase() !== '.csv') {
        sheets = fileParser.getExcelSheets(filePath);
      }

      // Preview the file
      const preview = await importHandler.previewImport({
        moduleName,
        filePath,
        sheetName
      });

      res.json({
        fileId: path.basename(filePath),
        fileName: req.file.originalname,
        filePath,
        moduleName,
        sheets,
        preview
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Upload failed' 
      });
    }
  });

  // Execute import endpoint
  app.post('/api/data-sync/import', async (req, res) => {
    try {
      const { filePath, moduleName, sheetName, customMappings, dryRun } = req.body;

      if (!filePath || !moduleName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!['Accounts', 'Contacts', 'Resources'].includes(moduleName)) {
        return res.status(400).json({ error: 'Invalid module name' });
      }

      const result = await importHandler.importFile({
        moduleName: moduleName as 'Accounts' | 'Contacts' | 'Resources',
        filePath,
        sheetName,
        customMappings,
        dryRun: dryRun === true
      });

      res.json(result);
    } catch (error) {
      console.error('Import error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Import failed' 
      });
    }
  });

  // Get import history/checkpoints
  app.get('/api/data-sync/history', async (req, res) => {
    try {
      const checkpointsDir = path.join(process.cwd(), 'services/zoho-data-sync/logs/checkpoints');
      
      if (!fs.existsSync(checkpointsDir)) {
        return res.json({ checkpoints: [] });
      }

      const files = fs.readdirSync(checkpointsDir);
      const checkpoints = files
        .filter(f => f.endsWith('.json'))
        .map(f => {
          const content = fs.readFileSync(path.join(checkpointsDir, f), 'utf-8');
          return JSON.parse(content);
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json({ checkpoints });
    } catch (error) {
      console.error('History error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch history' 
      });
    }
  });

  // Workflow Templates API Routes
  app.get("/api/workflow-templates", requireAutomationAuth, async (req, res) => {
    try {
      const { getAllTemplates } = await import("./workflow-templates");
      const templates = getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching workflow templates:", error);
      res.status(500).json({ message: "Failed to fetch workflow templates" });
    }
  });

  app.post("/api/workflow-templates/:templateName/create", requireAutomationAuth, async (req, res) => {
    try {
      const { getTemplate } = await import("./workflow-templates");
      const template = getTemplate(req.params.templateName);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      const customConfig = req.body.config || {};
      const workflowData = { ...template, ...customConfig };
      
      const workflow = await storage.createAutomationWorkflow(workflowData);
      res.status(201).json(workflow);
    } catch (error) {
      console.error("Error creating workflow from template:", error);
      res.status(500).json({ message: "Failed to create workflow from template" });
    }
  });

  // Automation Workflows API Routes
  app.get("/api/workflows", requireAutomationAuth, async (req, res) => {
    try {
      const { status, triggerType } = req.query;
      const workflows = await storage.getAutomationWorkflows({
        status: status as string,
        triggerType: triggerType as string,
      });
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });

  app.get("/api/workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const workflow = await storage.getAutomationWorkflow(parseInt(req.params.id));
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      console.error("Error fetching workflow:", error);
      res.status(500).json({ message: "Failed to fetch workflow" });
    }
  });

  app.post("/api/workflows", requireAutomationAuth, async (req, res) => {
    try {
      const workflow = await storage.createAutomationWorkflow(req.body);
      res.status(201).json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  });

  app.put("/api/workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const workflow = await storage.updateAutomationWorkflow(parseInt(req.params.id), req.body);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ message: "Failed to update workflow" });
    }
  });

  app.delete("/api/workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteAutomationWorkflow(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting workflow:", error);
      res.status(500).json({ message: "Failed to delete workflow" });
    }
  });

  app.post("/api/workflows/:id/execute", requireAutomationAuth, async (req, res) => {
    try {
      const { workflowExecutionEngine } = await import("./workflow-execution-engine");
      const executionId = await workflowExecutionEngine.executeWorkflow(
        parseInt(req.params.id),
        req.body.context || {}
      );
      res.json({ executionId, message: "Workflow execution started" });
    } catch (error) {
      console.error("Error executing workflow:", error);
      res.status(500).json({ 
        message: "Failed to execute workflow",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/workflows/:id/executions", requireAutomationAuth, async (req, res) => {
    try {
      const executions = await storage.getWorkflowExecutions({
        workflowId: parseInt(req.params.id)
      });
      res.json(executions);
    } catch (error) {
      console.error("Error fetching executions:", error);
      res.status(500).json({ message: "Failed to fetch executions" });
    }
  });

  app.get("/api/executions/:id", requireAutomationAuth, async (req, res) => {
    try {
      const execution = await storage.getWorkflowExecution(parseInt(req.params.id));
      if (!execution) {
        return res.status(404).json({ message: "Execution not found" });
      }
      const actions = await storage.getActionExecutions({ executionId: execution.id });
      res.json({ ...execution, actions });
    } catch (error) {
      console.error("Error fetching execution:", error);
      res.status(500).json({ message: "Failed to fetch execution" });
    }
  });

  // Zoho Campaigns API Routes
  app.get("/api/campaigns/lists", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const lists = await zohoCampaignsService.getLists();
      res.json(lists);
    } catch (error) {
      console.error("Error fetching campaign lists:", error);
      res.status(500).json({ 
        message: "Failed to fetch campaign lists",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns/lists", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const { listName, ...additionalInfo } = req.body;
      const list = await zohoCampaignsService.createList(listName, additionalInfo);
      res.status(201).json(list);
    } catch (error) {
      console.error("Error creating campaign list:", error);
      res.status(500).json({ 
        message: "Failed to create campaign list",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns/lists/:listKey/subscribers", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const result = await zohoCampaignsService.addSubscriber(req.params.listKey, req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding subscriber:", error);
      res.status(500).json({ 
        message: "Failed to add subscriber",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns/lists/:listKey/subscribers/bulk", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const { contacts } = req.body;
      const result = await zohoCampaignsService.addSubscribersBulk(req.params.listKey, contacts);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding subscribers in bulk:", error);
      res.status(500).json({ 
        message: "Failed to add subscribers in bulk",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/campaigns", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const campaigns = await zohoCampaignsService.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ 
        message: "Failed to fetch campaigns",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const campaign = await zohoCampaignsService.createEmailCampaign(req.body);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ 
        message: "Failed to create campaign",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns/:campaignKey/send", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const { scheduleTime } = req.body;
      const result = await zohoCampaignsService.sendCampaign(
        req.params.campaignKey,
        scheduleTime ? new Date(scheduleTime) : undefined
      );
      res.json(result);
    } catch (error) {
      console.error("Error sending campaign:", error);
      res.status(500).json({ 
        message: "Failed to send campaign",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Chat Command API Routes - for easy manual control
  app.post("/api/commands/crm/leads", requireAutomationAuth, async (req, res) => {
    try {
      const { limit = 20, ...filters } = req.body;
      const records = await zohoCRMService.getRecords("Leads", filters, limit);
      res.json({ 
        module: "Leads", 
        count: records.length, 
        records 
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ 
        message: "Failed to fetch leads",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/commands/crm/contacts", requireAutomationAuth, async (req, res) => {
    try {
      const { limit = 20, ...filters } = req.body;
      const records = await zohoCRMService.getRecords("Contacts", filters, limit);
      res.json({ 
        module: "Contacts", 
        count: records.length, 
        records 
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ 
        message: "Failed to fetch contacts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/commands/sync-to-campaign", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const { crmModule, listKey, filters, limit = 100 } = req.body;
      
      const records = await zohoCRMService.getRecords(crmModule, filters, limit);
      
      const contacts = records.map((record: any) => ({
        email: record.Email,
        firstName: record.First_Name,
        lastName: record.Last_Name,
      })).filter((c: any) => c.email);

      if (contacts.length === 0) {
        return res.json({ message: "No contacts with email addresses found", synced: 0 });
      }

      const result = await zohoCampaignsService.addSubscribersBulk(listKey, contacts);
      
      res.json({ 
        message: `Synced ${contacts.length} contacts to campaign list`,
        crmModule,
        listKey,
        synced: contacts.length,
        result
      });
    } catch (error) {
      console.error("Error syncing to campaign:", error);
      res.status(500).json({ 
        message: "Failed to sync to campaign",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Zoho Workflow Setup - Create automated email notification workflows
  app.post("/api/admin/setup-email-workflows", requireAutomationAuth, async (req, res) => {
    try {
      console.log("[Admin] Setting up Zoho email notification workflows...");
      
      const result = await zohoWorkflowService.setupRegistrationEmailWorkflows();
      
      if (result.success) {
        res.json({
          success: true,
          message: `Successfully created ${result.workflows.length} email notification workflows`,
          workflows: result.workflows,
          details: result
        });
      } else {
        res.status(500).json({
          success: false,
          message: `Failed to create some workflows. ${result.workflows.length} succeeded, ${result.errors.length} failed`,
          workflows: result.workflows,
          errors: result.errors,
          details: result
        });
      }
    } catch (error) {
      console.error("[Admin] Error setting up email workflows:", error);
      res.status(500).json({
        success: false,
        message: "Failed to setup email workflows",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get list of existing workflow rules
  app.get("/api/admin/email-workflows", requireAutomationAuth, async (req, res) => {
    try {
      const module = req.query.module as string | undefined;
      const workflows = await zohoWorkflowService.getWorkflowRules(module);
      res.json({
        success: true,
        count: workflows.length,
        workflows,
        module: module || 'all'
      });
    } catch (error) {
      console.error("[Admin] Error fetching workflows:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch workflows",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get a specific workflow rule by ID
  app.get("/api/admin/email-workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const workflow = await zohoWorkflowService.getWorkflowRule(req.params.id);
      if (!workflow) {
        return res.status(404).json({
          success: false,
          message: "Workflow not found"
        });
      }
      res.json({
        success: true,
        workflow
      });
    } catch (error) {
      console.error("[Admin] Error fetching workflow:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch workflow",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update an existing workflow rule
  app.put("/api/admin/email-workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const success = await zohoWorkflowService.updateWorkflowRule(id, updates);
      
      if (success) {
        res.json({
          success: true,
          message: `Workflow ${id} updated successfully`
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update workflow"
        });
      }
    } catch (error) {
      console.error("[Admin] Error updating workflow:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update workflow",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete workflow rules
  app.delete("/api/admin/email-workflows", requireAutomationAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide workflow IDs to delete"
        });
      }
      
      const success = await zohoWorkflowService.deleteWorkflowRules(ids);
      
      if (success) {
        res.json({
          success: true,
          message: `Deleted ${ids.length} workflow(s)`,
          deletedCount: ids.length
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to delete workflows"
        });
      }
    } catch (error) {
      console.error("[Admin] Error deleting workflows:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete workflows",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all email notification actions
  app.get("/api/admin/email-notifications", requireAutomationAuth, async (req, res) => {
    try {
      const notifications = await zohoWorkflowService.getEmailNotifications();
      res.json({
        success: true,
        count: notifications.length,
        notifications
      });
    } catch (error) {
      console.error("[Admin] Error fetching email notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch email notifications",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete email notification actions
  app.delete("/api/admin/email-notifications", requireAutomationAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide notification IDs to delete"
        });
      }
      
      const success = await zohoWorkflowService.deleteEmailNotifications(ids);
      
      if (success) {
        res.json({
          success: true,
          message: `Deleted ${ids.length} email notification(s)`,
          deletedCount: ids.length
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to delete email notifications"
        });
      }
    } catch (error) {
      console.error("[Admin] Error deleting email notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete email notifications",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get workflow statistics
  app.get("/api/admin/workflow-stats", requireAutomationAuth, async (req, res) => {
    try {
      const stats = await zohoWorkflowService.getWorkflowStats();
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error("[Admin] Error fetching workflow stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch workflow stats",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ========================================
  // CANN Townhall Event Registration Routes
  // ========================================

  // Admin credentials for event registration (environment-based)
  const EVENT_ADMIN_USERNAME = process.env.EVENT_ADMIN_USERNAME || "cannAdmin";
  const EVENT_ADMIN_PASSWORD = process.env.EVENT_ADMIN_PASSWORD || "Townhall2025!";

  // Middleware for basic auth on event admin routes
  const requireEventAdminAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    if (username === EVENT_ADMIN_USERNAME && password === EVENT_ADMIN_PASSWORD) {
      next();
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  };

  // Public endpoint: Register for CANN Townhall event
  app.post("/api/events/cann-townhall/register", async (req, res) => {
    try {
      const validatedData = insertTownhallRegistrationSchema.parse(req.body);
      const registration = await storage.createTownhallRegistration(validatedData);
      
      console.log(`[Townhall] New registration from: ${registration.email}`);
      
      res.status(201).json({
        success: true,
        message: "Registration successful",
        registrationId: registration.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid registration data", 
          errors: error.errors 
        });
      }
      console.error(`[Townhall] Error creating registration: ${error}`);
      res.status(500).json({ 
        success: false,
        message: "Failed to create registration" 
      });
    }
  });

  // Admin endpoint: Verify login credentials
  app.post("/api/admin/events/login", (req, res) => {
    const { username, password } = req.body;
    
    if (username === EVENT_ADMIN_USERNAME && password === EVENT_ADMIN_PASSWORD) {
      res.json({ 
        success: true, 
        message: "Login successful",
        token: Buffer.from(`${username}:${password}`).toString("base64")
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Invalid username or password" 
      });
    }
  });

  // Admin endpoint: Get all townhall registrations
  app.get("/api/admin/events/townhall/registrations", requireEventAdminAuth, async (req, res) => {
    try {
      const registrations = await storage.getTownhallRegistrations();
      res.json({
        success: true,
        registrations,
        count: registrations.length
      });
    } catch (error) {
      console.error(`[Townhall Admin] Error fetching registrations: ${error}`);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch registrations" 
      });
    }
  });

  // Admin endpoint: Export registrations as CSV
  app.get("/api/admin/events/townhall/registrations/export", requireEventAdminAuth, async (req, res) => {
    try {
      const registrations = await storage.getTownhallRegistrations();
      const format = req.query.format || "csv";

      // RFC 4180 compliant CSV field escaping
      const escapeCSVField = (field: string | null | undefined): string => {
        if (field === null || field === undefined) return '""';
        const str = String(field);
        // Escape double quotes by doubling them, then wrap in quotes
        const escaped = str.replace(/"/g, '""').replace(/\r?\n/g, ' ');
        return `"${escaped}"`;
      };

      if (format === "csv") {
        // Generate CSV with proper RFC 4180 escaping
        const headers = ["ID", "First Name", "Last Name", "Email", "Institution", "CANN Member", "Registration Date"];
        const csvRows = [
          headers.join(","),
          ...registrations.map(r => [
            r.id,
            escapeCSVField(r.firstName),
            escapeCSVField(r.lastName),
            escapeCSVField(r.email),
            escapeCSVField(r.institution),
            r.isCannMember ? "Yes" : "No",
            r.createdAt ? new Date(r.createdAt).toISOString() : ""
          ].join(","))
        ];
        
        const csvContent = csvRows.join("\n");
        
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="cann-townhall-registrations-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csvContent);
      } else {
        // Return JSON for other formats
        res.json({
          success: true,
          registrations,
          count: registrations.length
        });
      }
    } catch (error) {
      console.error(`[Townhall Admin] Error exporting registrations: ${error}`);
      res.status(500).json({ 
        success: false,
        message: "Failed to export registrations" 
      });
    }
  });

  // Admin endpoint: Delete a registration
  app.delete("/api/admin/events/townhall/registrations/:id", requireEventAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTownhallRegistration(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false,
          message: "Registration not found" 
        });
      }
      
      res.json({ 
        success: true,
        message: "Registration deleted successfully" 
      });
    } catch (error) {
      console.error(`[Townhall Admin] Error deleting registration: ${error}`);
      res.status(500).json({ 
        success: false,
        message: "Failed to delete registration" 
      });
    }
  });

  // ============================================================
  // CASL / PIPEDA / Law 25 — Consent audit admin endpoints
  // ============================================================
  // Auth: requires explicit environment-provided credentials. We do NOT reuse
  // the event-admin fallback creds because consent data is more sensitive
  // (emails, IPs, withdrawal history). If CONSENT_ADMIN_USERNAME / _PASSWORD
  // are not set the endpoints fail closed with HTTP 503 rather than accepting
  // any default.
  const requireConsentAdminAuth = (req: any, res: any, next: any) => {
    const u = process.env.CONSENT_ADMIN_USERNAME;
    const p = process.env.CONSENT_ADMIN_PASSWORD;
    if (!u || !p) {
      console.error("[Consent Admin] CONSENT_ADMIN_USERNAME / CONSENT_ADMIN_PASSWORD env vars are not set — endpoints disabled");
      return res.status(503).json({
        message: "Consent admin endpoints are disabled. Set CONSENT_ADMIN_USERNAME and CONSENT_ADMIN_PASSWORD environment variables to enable.",
      });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = Buffer.from(authHeader.split(" ")[1], "base64").toString("utf-8");
    const [username, password] = decoded.split(":");
    if (username === u && password === p) return next();
    return res.status(401).json({ message: "Invalid credentials" });
  };

  // List consent records (paginated, optional date / source filters)
  app.get("/api/admin/consent-records", requireConsentAdminAuth, async (req, res) => {
    try {
      const { from, to, source, limit } = req.query as Record<string, string>;
      const records = await storage.listConsentRecords({
        dateFrom: from ? new Date(from) : undefined,
        dateTo: to ? new Date(to) : undefined,
        source: source || undefined,
        limit: limit ? Number(limit) : 500,
      });
      res.json({ success: true, count: records.length, records });
    } catch (error) {
      console.error("[Consent Admin] Error listing records:", error);
      res.status(500).json({ success: false, message: "Failed to list consent records" });
    }
  });

  // Lookup all consent history for a given email (chronological)
  app.get("/api/admin/consent-records/email/:email", requireConsentAdminAuth, async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email).toLowerCase();
      const records = await storage.getConsentRecordsByEmail(email);
      res.json({ success: true, email, count: records.length, records });
    } catch (error) {
      console.error("[Consent Admin] Error looking up email:", error);
      res.status(500).json({ success: false, message: "Failed to look up consent records" });
    }
  });

  // CSV export — for legal/audit hand-off
  app.get("/api/admin/consent-records/export", requireConsentAdminAuth, async (req, res) => {
    try {
      const records = await storage.listConsentRecords({ limit: 10000 });
      const escape = (v: any) => {
        if (v === null || v === undefined) return "";
        const s = typeof v === "object" ? JSON.stringify(v) : String(v);
        return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const header = [
        "id", "submission_id", "email", "source", "form_version",
        "cas_newsletter", "cas_events", "cas_research", "cas_fundraising",
        "cann_newsletter", "cann_events",
        "ip_address", "user_agent", "locale",
        "withdrawn_at", "withdrawn_via", "withdrawn_reason",
        "created_at", "legal_text_shown",
      ];
      const lines = [header.join(",")];
      for (const r of records) {
        const c = (r.consents as any) || {};
        lines.push([
          r.id, r.submissionId, r.email, r.source, r.formVersion,
          c.cas_newsletter, c.cas_events, c.cas_research, c.cas_fundraising,
          c.cann_newsletter, c.cann_events,
          r.ipAddress, r.userAgent, r.locale,
          r.withdrawnAt, r.withdrawnVia, r.withdrawnReason,
          r.createdAt, r.legalTextShown,
        ].map(escape).join(","));
      }
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="consent-records-${new Date().toISOString().slice(0, 10)}.csv"`);
      res.send(lines.join("\r\n"));
    } catch (error) {
      console.error("[Consent Admin] Error exporting CSV:", error);
      res.status(500).json({ success: false, message: "Failed to export CSV" });
    }
  });

  // Record a full withdrawal (called by future unsubscribe page / admin action)
  app.post("/api/admin/consent-records/withdraw", requireConsentAdminAuth, async (req, res) => {
    try {
      const { email, via, reason } = req.body || {};
      if (!email || !via) {
        return res.status(400).json({ success: false, message: "email and via are required" });
      }
      const record = await storage.withdrawConsent(String(email).toLowerCase(), String(via), reason);
      res.json({ success: true, record });
    } catch (error) {
      console.error("[Consent Admin] Error recording withdrawal:", error);
      res.status(500).json({ success: false, message: "Failed to record withdrawal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

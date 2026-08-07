/**
 * Seed a member account for the Members Portal.
 *
 * Usage (run in the target environment, with its DATABASE_URL set):
 *   tsx scripts/seed-member.ts
 *
 * Override the demo defaults via env vars:
 *   MEMBER_EMAIL=you@example.com MEMBER_PASSWORD='Str0ngPass' MEMBER_NAME='Jane Doe' \
 *     MEMBER_ROLE=cas_cann_member tsx scripts/seed-member.ts
 *
 * Roles: cas_member | cann_member | cas_cann_member | admin
 */
import { hashPassword } from "../server/auth-service";
import { storage } from "../server/storage";
import { ensureMemberTables } from "../server/migrations/add-member-tables";

async function main() {
  const email = (process.env.MEMBER_EMAIL || "test@amyloid.ca").toLowerCase();
  const password = process.env.MEMBER_PASSWORD || "TestPass123";
  const fullName = process.env.MEMBER_NAME || "Test Member";
  const role = (process.env.MEMBER_ROLE || "cas_cann_member") as any;

  // Make sure the tables exist even if the app hasn't booted in this environment yet.
  await ensureMemberTables();

  const existing = await storage.getMemberByEmail(email);
  if (existing) {
    console.log(`ℹ️  Member already exists: ${email} (id ${existing.id}, role ${existing.role})`);
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);
  const member = await storage.createMember({
    email,
    fullName,
    passwordHash,
    role,
    status: "active" as any,
    isCASMember: role === "cas_member" || role === "cas_cann_member" || role === "admin",
    isCANNMember: role === "cann_member" || role === "cas_cann_member" || role === "admin",
    emailVerified: true,
  } as any);

  console.log(`✅ Created member: ${member.email} (id ${member.id}, role ${member.role})`);
  console.log(`   Log in at /login with:  ${email}  /  ${password}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

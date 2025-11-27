import { hashPassword } from "../server/auth-service";
import { db } from "../server/db";
import { members } from "../shared/schema";
import { eq } from "drizzle-orm";

async function createTestMember() {
  const email = "test@example.com";
  const password = "TestPassword123!";
  
  const passwordHash = await hashPassword(password);
  
  try {
    const existingMember = await db.select().from(members).where(eq(members.email, email)).limit(1);
    
    if (existingMember.length > 0) {
      console.log("Test member already exists!");
      console.log("Email:", email);
      console.log("Password:", password);
      process.exit(0);
    }
    
    const [newMember] = await db.insert(members).values({
      email,
      passwordHash,
      fullName: "Test User",
      status: "active",
      role: "cas_cann_member",
      isCASMember: true,
      isCANNMember: true,
      formSubmissionId: null,
    }).returning();
    
    console.log("✅ Test member created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Member ID:", newMember.id);
  } catch (error) {
    console.error("Error creating test member:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

createTestMember();

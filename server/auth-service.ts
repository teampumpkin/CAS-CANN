import crypto from "crypto";
import nodemailer from "nodemailer";
import { storage } from "./storage";

const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 15;
const PASSWORD_LENGTH = 12;

export function generateSecurePassword(): string {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghjkmnpqrstuvwxyz";
  const numbers = "23456789";
  const special = "!@#$%&*";
  
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = "";
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += special[crypto.randomInt(special.length)];
  
  for (let i = password.length; i < PASSWORD_LENGTH; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }
  
  return password.split("").sort(() => crypto.randomInt(3) - 1).join("");
}

export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
}

export async function hashOTP(otp: string): Promise<string> {
  return hashPassword(otp);
}

export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return verifyPassword(otp, hash);
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

function getEmailTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[Email Service] SMTP credentials not configured. Emails will be logged to console.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendWelcomeEmail(
  email: string,
  fullName: string,
  password: string
): Promise<boolean> {
  const transporter = getEmailTransporter();
  const fromEmail = process.env.SMTP_FROM || "noreply@canadianamyloidosis.org";

  const emailContent = {
    from: `"Canadian Amyloidosis Society" <${fromEmail}>`,
    to: email,
    subject: "Welcome to the CAS & CANN Members Portal",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #00AFE6 0%, #00DD89 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CAS & CANN</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Canadian Amyloidosis Society</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${fullName},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Thank you for joining the Canadian Amyloidosis Society. Your membership has been activated and you now have access to our exclusive Members Portal.
          </p>
          
          <div style="background: #f0f9ff; border: 1px solid #00AFE6; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #00AFE6; margin: 0 0 15px 0; font-size: 18px;">Your Login Credentials</h3>
            <p style="margin: 8px 0; font-size: 15px;">
              <strong>Email:</strong> ${email}
            </p>
            <p style="margin: 8px 0; font-size: 15px;">
              <strong>Temporary Password:</strong> 
              <code style="background: #e8f4f8; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #333;">${password}</code>
            </p>
          </div>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            <strong>Important:</strong> For security, we recommend changing your password after your first login. You can do this in the Password Settings section of your profile.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.BASE_URL || "https://canadianamyloidosis.org"}/login" 
               style="background: linear-gradient(135deg, #00AFE6 0%, #00DD89 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
              Login to Members Portal
            </a>
          </div>
          
          <p style="font-size: 14px; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            If you have any questions, please contact us at support@canadianamyloidosis.org
          </p>
        </div>
        
        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
          © ${new Date().getFullYear()} Canadian Amyloidosis Society. All rights reserved.
        </p>
      </body>
      </html>
    `,
    text: `
Welcome to CAS & CANN Members Portal

Dear ${fullName},

Thank you for joining the Canadian Amyloidosis Society. Your membership has been activated.

Your Login Credentials:
Email: ${email}
Temporary Password: ${password}

Please login at: ${process.env.BASE_URL || "https://canadianamyloidosis.org"}/login

For security, we recommend changing your password after your first login.

If you have any questions, please contact us at support@canadianamyloidosis.org

© ${new Date().getFullYear()} Canadian Amyloidosis Society
    `,
  };

  if (!transporter) {
    console.log("[Email Service] Would send welcome email to:", email);
    console.log("[Email Service] Credentials - Email:", email, "Password:", password);
    return true;
  }

  try {
    await transporter.sendMail(emailContent);
    console.log("[Email Service] Welcome email sent to:", email);
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send welcome email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  fullName: string,
  otp: string
): Promise<boolean> {
  const transporter = getEmailTransporter();
  const fromEmail = process.env.SMTP_FROM || "noreply@canadianamyloidosis.org";

  const emailContent = {
    from: `"Canadian Amyloidosis Society" <${fromEmail}>`,
    to: email,
    subject: "Password Reset - CAS & CANN Members Portal",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #00AFE6 0%, #00DD89 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">CAS & CANN Members Portal</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${fullName},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            We received a request to reset your password. Use the verification code below to complete the process:
          </p>
          
          <div style="background: #f0f9ff; border: 1px solid #00AFE6; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Verification Code</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00AFE6; font-family: monospace;">
              ${otp}
            </div>
            <p style="margin: 15px 0 0 0; font-size: 13px; color: #888;">
              This code expires in ${OTP_EXPIRY_MINUTES} minutes
            </p>
          </div>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
          
          <p style="font-size: 14px; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            For security, never share this code with anyone.
          </p>
        </div>
        
        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
          © ${new Date().getFullYear()} Canadian Amyloidosis Society. All rights reserved.
        </p>
      </body>
      </html>
    `,
    text: `
Password Reset - CAS & CANN Members Portal

Dear ${fullName},

We received a request to reset your password.

Your Verification Code: ${otp}

This code expires in ${OTP_EXPIRY_MINUTES} minutes.

If you didn't request a password reset, please ignore this email.

© ${new Date().getFullYear()} Canadian Amyloidosis Society
    `,
  };

  if (!transporter) {
    console.log("[Email Service] Would send password reset email to:", email);
    console.log("[Email Service] OTP:", otp);
    return true;
  }

  try {
    await transporter.sendMail(emailContent);
    console.log("[Email Service] Password reset email sent to:", email);
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send password reset email:", error);
    return false;
  }
}

export function getOTPExpiryDate(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + OTP_EXPIRY_MINUTES);
  return expiry;
}

export async function createMemberFromRegistration(
  formData: {
    email: string;
    fullName: string;
    discipline?: string;
    subspecialty?: string;
    institution?: string;
    amyloidosisType?: string;
    wantsMembership: string;
    wantsCANNMembership: string;
    wantsCommunications?: string;
    cannCommunications?: string;
    wantsServicesMapInclusion?: string;
  },
  formSubmissionId?: number
): Promise<{ success: boolean; member?: any; password?: string; error?: string }> {
  try {
    const existingMember = await storage.getMemberByEmail(formData.email);
    if (existingMember) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    const password = generateSecurePassword();
    const passwordHash = await hashPassword(password);

    const isCASMember = formData.wantsMembership === "Yes";
    const isCANNMember = formData.wantsCANNMembership === "Yes";
    
    let role: "cas_member" | "cann_member" | "cas_cann_member" = "cas_member";
    if (isCASMember && isCANNMember) {
      role = "cas_cann_member";
    } else if (isCANNMember) {
      role = "cann_member";
    }

    const member = await storage.createMember({
      email: formData.email,
      fullName: formData.fullName,
      passwordHash,
      role,
      status: "active",
      discipline: formData.discipline || null,
      subspecialty: formData.subspecialty || null,
      institution: formData.institution || null,
      amyloidosisType: formData.amyloidosisType || null,
      isCASMember,
      isCANNMember,
      wantsCommunications: formData.wantsCommunications === "Yes",
      wantsCANNCommunications: formData.cannCommunications === "Yes",
      wantsServicesMapInclusion: formData.wantsServicesMapInclusion === "Yes",
      formSubmissionId: formSubmissionId || null,
      emailVerified: false,
    });

    await sendWelcomeEmail(formData.email, formData.fullName, password);

    return {
      success: true,
      member,
      password,
    };
  } catch (error) {
    console.error("[Auth Service] Error creating member:", error);
    return {
      success: false,
      error: "Failed to create member account.",
    };
  }
}

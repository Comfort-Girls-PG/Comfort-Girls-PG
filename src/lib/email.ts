import nodemailer from "nodemailer";
import crypto from "crypto";

const otpCache = new Map<string, { code: string; expiresAt: number }>();
const verificationTokens = new Map<string, { email: string; expiresAt: number }>();

function cleanExpiredCaches() {
  const now = Date.now();
  for (const [email, data] of otpCache.entries()) {
    if (now > data.expiresAt) {
      otpCache.delete(email);
    }
  }
  for (const [token, data] of verificationTokens.entries()) {
    if (now > data.expiresAt) {
      verificationTokens.delete(token);
    }
  }
}

// Check every 2 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanExpiredCaches, 2 * 60 * 1000);
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export function generateOtp(email: string): string {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
  otpCache.set(email.toLowerCase().trim(), { code: otp, expiresAt });
  console.log(`🚨 [OTP DISPATCH] Generated OTP code: ${otp} for email target: ${email}`);
  return otp;
}

export function verifyOtp(email: string, code: string): boolean {
  const cleanedEmail = email.toLowerCase().trim();
  const cached = otpCache.get(cleanedEmail);

  if (!cached) {
    return false;
  }

  if (Date.now() > cached.expiresAt) {
    otpCache.delete(cleanedEmail);
    return false;
  }

  const isValid = cached.code === code;
  if (isValid) {
    otpCache.delete(cleanedEmail);
  }
  return isValid;
}

export async function sendOtpEmail(email: string, code: string, name: string): Promise<boolean> {
  const transporter = getTransporter();
  const from = "Comfort Girls PG <contact@comfortgirlspg.live>";

  const textContent = `Hello ${name},\n\nYour onboarding validation code for Comfort Girls PG is: ${code}\n\nThis security PIN is valid for the next 10 minutes. Please enter this code in your browser dashboard to activate your resident profile.\n\nWarm regards,\nManagement Team\nComfort Girls PG`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px;">🏰</span>
        <h2 style="color: #0f172a; margin-top: 8px; font-weight: 700; background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Comfort Girls PG</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: -4px;">Identity Verification Layer</p>
      </div>
      
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hello <strong>${name}</strong>,</p>
      
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Welcome to our community! To activate your digital resident onboarding, please input the following 4-digit verification PIN inside your screen:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #db2777; background-color: #fdf2f8; padding: 12px 32px; border-radius: 12px; border: 1px solid #fbcfe8;">
          ${code}
        </div>
      </div>
      
      <p style="color: #334155; font-size: 14px; line-height: 1.5;">This PIN is secure and expires in <strong>10 minutes</strong>. Please do not share this passcode with anyone, including staff members.</p>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      
      <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.4;">
        Received in error? If you did not register for an account at Comfort Girls PG, you can safely ignore this automated message.<br />
        © 2026 Comfort Girls PG. All rights reserved.
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: `[Comfort Girls PG] OTP Verification Code: ${code}`,
        text: textContent,
        html: htmlContent,
      });
      return true;
    } catch (err) {
      console.error(`Failed to dispatch SMTP email to ${email}:`, err);
    }
  }

  console.log(`
================================================================
📧 [CONSOLE EMAIL FALLBACK - SMTP NOT CONFIGURED]
To: ${email}
Subject: [Comfort Girls PG] OTP Verification Code: ${code}
Hello ${name}, your verification code is ${code}
================================================================
  `);

  return false;
}

export function generateVerificationToken(email: string): string {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  verificationTokens.set(token, { email: email.toLowerCase().trim(), expiresAt });
  return token;
}

export function verifyVerificationToken(token: string): string | null {
  const cached = verificationTokens.get(token);
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    verificationTokens.delete(token);
    return null;
  }
  verificationTokens.delete(token);
  return cached.email;
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string,
  requestHost: string,
  requestProtocol: string
): Promise<{ sent: boolean; verificationLink: string }> {
  const transporter = getTransporter();
  const from = "Comfort Girls PG <contact@comfortgirlspg.live>";
  const verificationLink = `${requestProtocol}://${requestHost}/api/auth/verify?token=${token}`;

  const textContent = `Hello ${name},\n\nThank you for choosing Comfort Girls PG! To activate your digital resident profile, please verify your email address by clicking on the link below:\n\n${verificationLink}\n\nThis link is active for 24 hours.\n\nWarm regards,\nManagement Team\nComfort Girls PG`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px;">🏰</span>
        <h2 style="color: #0f172a; margin-top: 8px; font-weight: 700; background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Comfort Girls PG</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: -4px;">Secure Email Verification Link</p>
      </div>
      
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hello <strong>${name}</strong>,</p>
      
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Welcome to our community! To activate your digital resident onboarding, please verify your email address by clicking on the secure confirmation button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="display: inline-block; font-size: 14px; font-weight: 600; color: #ffffff; background: linear-gradient(135deg, #db2777 0%, #7c3aed 100%); padding: 12px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.15);">
          Verify Email Address
        </a>
      </div>
      
      <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center; margin-top: 10px;">
        Link not working? Copy and paste this URL into your browser:<br />
        <a href="${verificationLink}" style="color: #7c3aed; word-break: break-all;">${verificationLink}</a>
      </p>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      
      <p style="color: #94a3b8; font-size: 11px; text-align: center; line-height: 1.4;">
        Received in error? If you did not register at Comfort Girls PG, please ignore this email.<br />
        © 2026 Comfort Girls PG. All rights reserved.
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: `[Comfort Girls PG] Action Required: Verify your email address`,
        text: textContent,
        html: htmlContent,
      });
      return { sent: true, verificationLink };
    } catch (err) {
      console.error(`Failed to dispatch SMTP verification email to ${email}:`, err);
    }
  }

  console.log(`
================================================================
📧 [CONSOLE EMAIL FALLBACK - SMTP NOT CONFIGURED]
To: ${email}
Subject: [Comfort Girls PG] Action Required: Verify your email address
Link: ${verificationLink}
================================================================
  `);

  return { sent: false, verificationLink };
}

export async function sendNotificationEmail(
  to: string,
  subject: string,
  title: string,
  message: string
): Promise<boolean> {
  const transporter = getTransporter();
  const from = "Comfort Girls PG <contact@comfortgirlspg.live>";

  const textContent = `[Comfort Girls PG Notification]\n\n${title}\n\n${message}\n\nWarm regards,\nManagement Team\nComfort Girls PG`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px;">🏰</span>
        <h2 style="color: #0f172a; margin-top: 8px; font-weight: 700; background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Comfort Girls PG</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: -4px;">Account Notification</p>
      </div>
      
      <div style="padding: 16px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9; margin-bottom: 20px;">
        <h3 style="color: #0f172a; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">${title}</h3>
        <p style="color: #334155; font-size: 14px; line-height: 1.5; margin: 0;">${message}</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      
      <p style="color: #94a3b8; font-size: 11px; text-align: center; line-height: 1.4;">
        This is an automated notification from your resident profile portal.<br />
        © 2026 Comfort Girls PG. All rights reserved.
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to,
        subject: `[Comfort Girls PG] ${subject}`,
        text: textContent,
        html: htmlContent,
      });
      return true;
    } catch (err) {
      console.error(`Failed to dispatch notification email to ${to}:`, err);
    }
  }

  console.log(`
================================================================
📧 [CONSOLE EMAIL FALLBACK - SMTP NOT CONFIGURED]
To: ${to}
Subject: [Comfort Girls PG] ${subject}
Title: ${title}
Message: ${message}
================================================================
  `);

  return false;
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Simple in-memory store for reset tokens (dev only — use DB or Redis in production)
const resetTokens = new Map<string, { email: string; expires: number; token: string }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user exists — always return success to prevent email enumeration
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (user) {
      // Generate a reset token (in dev, we'll log it to console)
      const token = crypto.randomBytes(32).toString("hex");
      const resetCode = token.slice(0, 8).toUpperCase();

      // Store token with 1-hour expiry
      resetTokens.set(user.email, {
        email: user.email,
        token: resetCode,
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      // In production, send email via a service like SendGrid/Resend/Nodemailer
      // For dev, log the reset code so it can be tested
      console.log(`[PASSWORD RESET] Email: ${user.email}, Code: ${resetCode}`);
    }

    return NextResponse.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Email, reset code, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetEntry = resetTokens.get(email.toLowerCase().trim());

    if (!resetEntry) {
      return NextResponse.json(
        { error: "Invalid or expired reset code" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (Date.now() > resetEntry.expires) {
      resetTokens.delete(email.toLowerCase().trim());
      return NextResponse.json(
        { error: "Reset code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify code
    if (resetEntry.token !== code.toUpperCase()) {
      return NextResponse.json(
        { error: "Invalid reset code" },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { email: email.toLowerCase().trim() },
      data: { passwordHash },
    });

    // Remove used token
    resetTokens.delete(email.toLowerCase().trim());

    return NextResponse.json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
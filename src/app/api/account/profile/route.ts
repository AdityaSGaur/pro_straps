import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateUser, updateUser } from "@/lib/file-db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user in local file database
    const user = getOrCreateUser(session.user.email, session.user.name);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone } = body;

    const user = getOrCreateUser(session.user.email, session.user.name);
    const updatedUser = updateUser(
      user.id,
      name !== undefined ? name?.trim() || null : undefined,
      phone !== undefined ? phone?.trim() || null : undefined
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

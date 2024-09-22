import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb/mongodb";
import authOptions from "../auth/auth-options";

// Get all adventures that the requestor is associated with
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  console.log(session.user);
  return NextResponse.json([]);
}

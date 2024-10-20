import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb/mongodb";
import { UserModel } from "../../../../../lib/schemas/user.schema";
import authOptions from "../../../auth/auth-options";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const _id = params.userId;

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const user = await UserModel.findById(_id).select("notifications");
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      }); // User not found, return 404 status code. 401 would be Unauthorized.
    }
    return NextResponse.json({
      status: 200,
      notifications: user.notifications,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: `failed to get notifications: ${err}`,
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const _id = params.userId;

  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return NextResponse.json({ error: "Unauthorized", status: 401 });

  if (_id !== session!.user!._id)
    return NextResponse.json({ error: "Invalid request", status: 400 });

  await dbConnect();

  try {
    const user = await UserModel.findByIdAndUpdate(_id, {
      notifications: [],
    });

    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      });
    }

    return NextResponse.json(
      { message: "Notifications dismissed" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: `Failed to dismiss notifications: ${error}`,
    });
  }
}

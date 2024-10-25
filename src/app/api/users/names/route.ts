import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { UserInfoAPIResponse } from "../../../../lib/definitions/user-info-api-response";
import dbConnect from "../../../../lib/mongodb/mongodb";
import { UserModel } from "../../../../lib/schemas/user.schema";
import authOptions from "../../auth/auth-options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userIds = searchParams.getAll("userIds");

  await dbConnect();
  try {
    const users = await UserModel.find({ _id: { $in: userIds } });
    if (!users) {
      return NextResponse.json({
        status: 404,
        message: "Users not found",
      });
    }

    const dict: Record<string, UserInfoAPIResponse> = {};
    users.forEach((user) => {
      dict[user._id] = { name: user.name, email: user.email };
    });
    return NextResponse.json({
      status: 200,
      users: dict,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Server error",
    });
  }
}

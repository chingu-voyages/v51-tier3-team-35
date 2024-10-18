import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../lib/models/user.model";
import dbConnect from "../../../../lib/mongodb/mongodb";
import { UserModel } from "../../../../lib/schemas/user.schema";
import authOptions from "../../auth/auth-options";

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
    const user = await UserModel.findOne({ _id }).select("-hashedPassword");
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      });
    }
    return NextResponse.json({
      status: 200,
      user: user.toObject(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Server error",
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (params.userId !== "me")
    return NextResponse.json({ status: 400, message: "Bad request" });

  // This automatically updates the requestors own user profile
  const requestBody = await req.json();
  const { name, password } = requestBody;

  const dataToUpdate: Partial<User> = {};

  if (name && name.length > 1) {
    dataToUpdate.name = requestBody.name;
  } else {
    return NextResponse.json({
      status: 400,
      message: "Name must be at least 2 characters",
    });
  }

  let hashedPassword: string;

  if (password && password.length > 7) {
    hashedPassword = await hash(password, 10);
    dataToUpdate.hashedPassword = hashedPassword;
  }

  await dbConnect();

  const updatedUser = await UserModel.findByIdAndUpdate(
    session.user?._id.toString(),
    dataToUpdate
  ).select("-hashedPassword");

  if (!updatedUser) {
    return NextResponse.json({
      status: 404,
      message: "User not found",
    });
  }

  return NextResponse.json({
    status: 200,
    user: updatedUser.toObject(),
  });
}

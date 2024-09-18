import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb/mongodb";
import { UserModel } from "../../../../lib/schemas/user.schema";

// This route handles signup with credentials
export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  const { email, password, name } = requestBody;

  await dbConnect();

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    return NextResponse.json({
      status: 400,
      error: "User already exists",
    });
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await UserModel.create({
    email,
    name,
    hashedPassword,
  });

  return NextResponse.json({ id: newUser._id }, { status: 201 });
}

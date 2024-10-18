import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../../lib/models/user.model";
import dbConnect from "../../../../../lib/mongodb/mongodb";
import { UserModel } from "../../../../../lib/schemas/user.schema";
import authOptions from "../../../auth/auth-options";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const _id = params.userId;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try{
      const user = await UserModel.findById(_id).select('notifications');
      if (!user) {
        return NextResponse.json({
            status: 404,
            message: 'User not found' });  // User not found, return 404 status code. 401 would be Unauthorized.
      }
      return NextResponse.json({
        status: 200,
        notifications: user.notifications});
  } catch (err) {
    return NextResponse.json({
        status: 500,
        message: `failed to get notifications: ${err}`,
      });
  }
}
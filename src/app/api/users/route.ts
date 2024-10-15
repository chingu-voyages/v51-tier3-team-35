import dbConnect from "../../../lib/mongodb/mongodb";
import { UserModel } from "../../../lib/schemas/user.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../auth/auth-options";

export async function GET(req: NextRequest){
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    await dbConnect(); 
    try {
        const data = await req.json();
        const email = data.email;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }
        return NextResponse.json({ user });
       
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Server error' });
    }
}
import dbConnect from "../../../../lib/mongodb/mongodb";
import { UserModel } from "../../../../lib/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";


 export async function GET(req: NextRequest, {params}:{ params: { userId: string }}){
    const id = params.userId;
    await dbConnect(); 
    try {
        const user = await UserModel.findOne({id});
        if (!user) {
            return NextResponse.json({ 
                status: 404,
                message: 'User not found' });
        }
        NextResponse.json({
            status: 200,
            user: user.toObject()
        });
    } catch (error) {
        NextResponse.json({
            status: 500,
            message: 'Server error' });
    }
}
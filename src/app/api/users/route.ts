import dbConnect from "../../../lib/mongodb/mongodb";
import { UserModel } from "../../../lib/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    
    await dbConnect(); 
    try {
        const users = await UserModel.find();
        if (!users) {
            return NextResponse.json({ 
                status: 404,
                message: 'No users found' });
        }
        NextResponse.json({
            status: 200,
            users: users
        });
    } catch (error) {
        NextResponse.json({
            status: 500,
            message: 'Server error' });
    }
}
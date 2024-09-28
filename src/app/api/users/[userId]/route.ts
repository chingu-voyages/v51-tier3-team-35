import dbConnect from "../../../../lib/mongodb/mongodb";
import { UserModel } from "../../../../lib/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";


 export async function GET(req: NextRequest, {params}:{ params: { userId: string }}){
    const _id = params.userId;
    await dbConnect(); 
    try {
        const user = await UserModel.findOne({_id});
        if (!user) {
            return NextResponse.json({ 
                status: 404,
                message: 'User not found' });
        }
        return NextResponse.json({
            status: 200,
            user: user.toObject()
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Server error' });
    }
}

export async function PATCH(req: NextRequest, {params}:{ params: { userId: string }}){
    const id = params.userId;
    const data = await req.json();
    const hashedPassword = await hash(data.password, 10);
    const requestBody = {
        name: data.name,
        password: hashedPassword
    }
    console.log("request body looks like: ", requestBody)
    
    await dbConnect();
    const updatedUser = await UserModel.findByIdAndUpdate(id, requestBody, {new: true});
    if (!updatedUser) {
        return NextResponse.json({ 
            status: 404,
            message: 'User not found' });
    }
   return NextResponse.json({
        status: 200,
        user: updatedUser.toObject()
    });
}
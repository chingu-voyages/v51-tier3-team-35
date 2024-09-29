import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../../lib/schemas/adventure.schema";

export async function PUT(
  req: NextRequest,
  { params }: { params: { adventureId: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await req.json();
  console.info(requestBody);

  await dbConnect();
  try {
    // Find the adventure, make sure it exists
    const adventure = await AdventureModel.findById(params.adventureId);
    if (!adventure) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

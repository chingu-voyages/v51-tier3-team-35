import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../lib/schemas/adventure.schema";
import authOptions from "../auth/auth-options";

// Get all adventures that the requestor is associated with
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    // the MongoDb query should find all adventures where the user is a participant or the creator
    // TODO: How do we sort this?
    const adventures = await AdventureModel.find({
      $or: [
        { createdBy: session.user!._id },
        { participants: session.user!._id },
      ],
    });
    return NextResponse.json(adventures);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to get adventures: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const requestBody = await req.json();
  const { name, description, startDate, endDate } = requestBody;

  await dbConnect();
  // This creates a new blank adventure document and returns the adventure id
  try {
    const newAdventure = await AdventureModel.create({
      name,
      description,
      startDate,
      endDate,
      createdBy: session.user!._id,
      participants: [session.user!._id],
    });

    return NextResponse.json({ id: newAdventure._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create adventure: ${error}` },
      { status: 500 }
    );
  }
}

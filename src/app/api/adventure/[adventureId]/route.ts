import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../lib/schemas/adventure.schema";
import authOptions from "../../auth/auth-options";

export async function GET(
  req: NextRequest,
  { params }: { params: { adventureId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  // Find the adventure by id
  try {
    const adventure = await AdventureModel.findById(params.adventureId);

    if (!adventure) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }

    // Strictly enforce access to the adventure to only participants.
    // The adventure creator should already be in the participants list.
    if (!adventure.participants.includes(session.user!._id)) {
      return NextResponse.json(
        { error: "Access not allowed. Ask the creator for an invite." },
        { status: 401 }
      );
    }

    return NextResponse.json(adventure, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to get adventure: ${error}` },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { adventureId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await req.json();

  const { description, startDate, endDate, name } = requestBody;

  await dbConnect();
  try {
    const adventure = await AdventureModel.findByIdAndUpdate(
      params.adventureId,
      { description, startDate, endDate, name }
    );

    if (!adventure) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Adventure properties were patched successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to update adventure: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { adventureId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Make sure the person that is deleting the adventure is the creator

  await dbConnect();
  try {
    const adventure = await AdventureModel.findById(params.adventureId);

    if (!adventure) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }

    if (adventure.createdBy.toString() !== session.user!._id) {
      return NextResponse.json(
        { error: "Only the creator can delete the adventure" },
        { status: 401 }
      );
    }

    await AdventureModel.findByIdAndDelete(params.adventureId);
    return NextResponse.json(
      { message: "Adventure was deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Server Error: failed to delete adventure: ${error}` },
      { status: 500 }
    );
  }
}

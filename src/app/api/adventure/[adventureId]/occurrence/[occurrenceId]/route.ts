import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../../../lib/schemas/adventure.schema";
import authOptions from "../../../../auth/auth-options";

export async function GET(
  req: NextRequest,
  { params }: { params: { adventureId: string; occurrenceId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find an occurrence by its associated adventure event by ud
  await dbConnect();

  try {
    const adventure = await AdventureModel.findOne({
      _id: params.adventureId,
      "occurrences._id": params.occurrenceId,
    });
    if (!adventure) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }

    // Return the specific occurrence by looking up the occurrence id
    const occurrence = adventure.occurrences.find(
      (occurrence) => occurrence._id?.toString() === params.occurrenceId
    );

    return NextResponse.json(occurrence, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

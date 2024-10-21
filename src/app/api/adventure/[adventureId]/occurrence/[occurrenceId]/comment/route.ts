import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { UserComment } from "../../../../../../../lib/models/user-comment.model";
import dbConnect from "../../../../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../../../../lib/schemas/adventure.schema";
import authOptions from "../../../../../auth/auth-options";

export async function PUT(
  req: NextRequest,
  { params }: { params: { adventureId: string; occurrenceId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await req.json();
  // Find the occurrence
  await dbConnect();

  try {
    const adventure = await AdventureModel.findOne({
      _id: params.adventureId,
      "occurrences._id": params.occurrenceId,
    });

    if (!adventure)
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );

    // Find the occurence from the adventure
    const occIdx = adventure.occurrences.findIndex(
      (occurrence) => occurrence._id?.toString() === params.occurrenceId
    );

    if (occIdx < 0)
      return NextResponse.json(
        { error: `Occurrence with id ${params.occurrenceId} not found` },
        { status: 404 }
      );

    const occurrence = adventure.occurrences[occIdx];

    // Push the notes onto the occurrence
    const comment: UserComment = {
      text: requestBody.text,
      createdBy: session.user!._id.toString()!,
      adventureId: params.adventureId,
      occurrenceId: params.occurrenceId,
    };
    occurrence.userComments?.push(comment);
    adventure.occurrences[occIdx] = occurrence;
    await adventure.save();
    return NextResponse.json({ message: "Comment added" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

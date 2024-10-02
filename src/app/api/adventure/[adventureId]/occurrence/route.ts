import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../../lib/schemas/adventure.schema";
import authOptions from "../../../auth/auth-options";
import { OccurrencePutRequestHandlerFactory } from "../../../lib/occurrence-put-request-handler-factory";

export async function PUT(
  req: NextRequest,
  { params }: { params: { adventureId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await req.json();

  await dbConnect();
  try {
    // Find the adventure, make sure it exists
    const adventureDocument = await AdventureModel.findById(params.adventureId);
    if (!adventureDocument) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }

    // Handle the request
    await OccurrencePutRequestHandlerFactory.create(
      requestBody.eventType
    ).handle(session.user!._id, adventureDocument, requestBody);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

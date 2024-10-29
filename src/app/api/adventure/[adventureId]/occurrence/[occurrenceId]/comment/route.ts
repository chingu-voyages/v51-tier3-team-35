import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { EventType } from "../../../../../../../lib/models/occurrence.model";
import { UserComment } from "../../../../../../../lib/models/user-comment.model";
import { UserNotification } from "../../../../../../../lib/models/user-notification.model";
import dbConnect from "../../../../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../../../../lib/schemas/adventure.schema";
import { UserModel } from "../../../../../../../lib/schemas/user.schema";
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

    // send notifications to all users on this adventure (except the user who added the comment)
    const userIdsToNotify = adventure.participants.filter(
      (user) => user.toString() !== session.user!._id.toString()
    );

    await generateMultipleCommentNotifications(
      {
        sourceUser: {
          id: session.user!._id.toString(),
          name: session.user!.name!,
        },
        adventureDetails: { id: params.adventureId, name: adventure.name },
        occurrenceDetails: {
          id: params.occurrenceId,
          occurrenceType: occurrence.eventType,
        },
      },
      userIdsToNotify
    );
    return NextResponse.json({ message: "Comment added" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function generateMultipleCommentNotifications(
  {
    sourceUser,
    adventureDetails,
    occurrenceDetails,
  }: {
    sourceUser: { id: string; name: string };
    adventureDetails: { id: string; name: string };
    occurrenceDetails: {
      id?: string;
      name?: string;
      occurrenceType: EventType;
    };
  },
  userIdsToNotifiy: string[]
): Promise<void> {
  const users = await UserModel.find({ _id: { $in: userIdsToNotifiy } });

  if (!users) {
    throw new Error("Error generating notifications: Users not found");
  }

  for await (const user of users) {
    const notification: UserNotification = {
      sourceUser: {
        id: sourceUser.id,
        name: sourceUser.name,
      },
      targetUser: {
        id: user._id.toString(),
        name: user.name,
      },
      notificationType: "occurrenceComment",
      link: {
        href: `/adventure/view/${adventureDetails.id}`,
        label: adventureDetails.name,
      },
      messageBody: `${occurrenceDetails.occurrenceType}`,
    };
    if (user.notifications.length >= 3) {
      user.notifications.shift(); // Remove the oldest notification
    }
    user.notifications.push(notification);
    await user.save();
  }
}

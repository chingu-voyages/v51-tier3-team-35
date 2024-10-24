import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { UserNotification } from "../../../../../lib/models/user-notification.model";
import dbConnect from "../../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../../lib/schemas/adventure.schema";
import { UserModel } from "../../../../../lib/schemas/user.schema";
import authOptions from "../../../auth/auth-options";
import { AdventureDocument } from "../../../lib/definitions/definitions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { adventureId: string } }
) {
  const session = await getServerSession(authOptions);
  const data = await req.json();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!data.action)
    return NextResponse.json({ error: "Action is required" }, { status: 400 });

  await dbConnect();

  try {
    const adventure = await AdventureModel.findById(params.adventureId);

    if (!adventure) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }

    if (data.action === "add") {
      await addUserToAdventure(
        adventure,
        data.email,
        session?.user?._id!,
        session?.user?.name!
      );
      return NextResponse.json(
        { message: "User added successfully" },
        { status: 200 }
      );
    } else if (data.action === "remove") {
      if (!data.userId) {
        return NextResponse.json(
          { error: "userId is required for remove action" },
          { status: 400 }
        );
      }
      await removeUserFromAdventure(adventure, data.userId);
      return NextResponse.json({ message: "User removed" }, { status: 200 });
    } else if (data.action === "removeAll") {
      await removeAllParticipants(adventure);
      return NextResponse.json(
        { message: "All participants removed" },
        { status: 200 }
      );
    }

    // Handle the request

    return NextResponse.json(
      {
        error: `Action ${data.action} not supported`,
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to add adventure user: ${error}` },
      { status: 500 }
    );
  }
}

async function addUserToAdventure(
  adventure: AdventureDocument,
  userEmail: string,
  sessionUserId: string,
  sessionUserName: string
) {
  const user = await UserModel.findOne({ email: userEmail });

  if (!user) {
    throw new Error(`User not found ${userEmail}`);
  }

  // We could give an error that the user is already in the adventure, but let's just filter dupes
  adventure.participants = [
    ...adventure.participants.filter((p) => p !== user._id.toString()),
    user._id,
  ];
  await adventure.save();

  if (!user.notifications) {
    user.notifications = [];
  }
  if (user.notifications.length >= 3) {
    user.notifications.shift(); // Remove the oldest notification
  }
  const addToAdventureNotification: UserNotification = {
    sourceUser: {
      id: sessionUserId,
      name: sessionUserName,
    },
    targetUser: {
      id: user._id,
      name: user.name,
    },
    link: {
      href: `/adventure/view/${adventure._id}`,
      label: adventure.name,
    },
    messageBody: "",
    notificationType: "addToAdventure",
  };
  user.notifications.push(addToAdventureNotification);

  await user.save();
}

async function removeUserFromAdventure(
  adventure: AdventureDocument,
  userId: string
) {
  adventure.participants = adventure.participants.filter((p) => p !== userId);
  await adventure.save();
}

async function removeAllParticipants(adventure: AdventureDocument) {
  // Remove all participants except the creator
  adventure.participants = [adventure.createdBy.toString()];
  await adventure.save();
}

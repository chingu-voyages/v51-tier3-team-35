import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { UserNotification } from "../../../../../lib/models/user-notification.model";
import dbConnect from "../../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../../lib/schemas/adventure.schema";
import { UserModel } from "../../../../../lib/schemas/user.schema";
import authOptions from "../../../auth/auth-options";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { adventureId: string } }
) {
  const session = await getServerSession(authOptions);
  const data = await req.json();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const adventure = await AdventureModel.findById(params.adventureId);
    const user = await UserModel.findOne({ email: data.email });
    if (!adventure) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }
    if (!user) {
      return NextResponse.json(
        { error: `User with ${data.email} not found` },
        { status: 404 }
      );
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
        id: session?.user?._id!,
        name: session?.user?.name!,
      },
      targetUser: {
        id: user._id,
        name: user.name,
      },
      link: {
        href: `/adventure/${adventure._id}/view`,
        label: adventure.name,
      },
      messageBody: "",
      notificationType: "addToAdventure",
    };
    user.notifications.push(addToAdventureNotification);

    await user.save();

    return NextResponse.json(
      { message: "User added successfully" },
      { status: 200 }
    );
    // Handle the request
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to add adventure user: ${error}` },
      { status: 500 }
    );
  }
}

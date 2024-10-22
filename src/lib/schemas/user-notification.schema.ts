import { Schema } from "mongoose";
import { UserNotification } from "../models/user-notification.model";

export const userNotificationSchema = new Schema<UserNotification>(
  {
    sourceUser: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    targetUser: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    link: {
      href: {
        type: String,
        required: false,
      },
      label: {
        type: String,
        required: false,
      },
    },
    messageBody: {
      type: String,
      required: false,
    },
    notificationType: {
      type: String,
      enum: ["addToAdventure", "comment"],
      required: true,
    },
  },
  { timestamps: true }
);

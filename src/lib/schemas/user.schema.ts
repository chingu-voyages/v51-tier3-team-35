import mongoose, { Schema } from "mongoose";
import { User } from "../models/user.model";
import { userNotificationSchema } from "./user-notification.schema";

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    oAuth: {
      type: Boolean,
      required: true,
      default: false,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    notifications: {
      type: [userNotificationSchema],
      default: [],
      validate: [notificationLimit, "Cannot have more than 3 notifications"],
    },
  },
  { timestamps: true }
);
function notificationLimit(val: []) {
  return val.length <= 3;
}
export const UserModel: mongoose.Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

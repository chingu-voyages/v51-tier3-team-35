import mongoose, { Schema } from "mongoose";
import { User } from "../models/user.model";

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
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel: mongoose.Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

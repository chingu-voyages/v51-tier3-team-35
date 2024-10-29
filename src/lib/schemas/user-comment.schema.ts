import { Schema } from "mongoose";
import { UserComment } from "../models/user-comment.model";

export const userCommentSchema = new Schema<UserComment>(
  {
    text: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    adventureId: {
      type: String,
      required: true,
    },
    occurrenceId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

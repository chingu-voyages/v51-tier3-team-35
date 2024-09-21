import mongoose, { Schema } from "mongoose";
import { Adventure } from "../models/adventure.model";
import { occurrenceSchema } from "./occurrence.schema";

const adventureSchema = new Schema<Adventure>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    createdBy: {
      type: String,
      ref: "User",
      required: true,
    },
    occurrences: { type: [occurrenceSchema], default: [] },
  },
  { timestamps: true }
);

export const AdventureModel =
  mongoose.models.Adventure ||
  mongoose.model<Adventure>("Adventure", adventureSchema);

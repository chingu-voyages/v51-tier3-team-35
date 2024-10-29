import { Schema } from "mongoose";
import { Occurrence } from "../models/occurrence.model";
import { addressSchema } from "./address.schema";
import { userCommentSchema } from "./user-comment.schema";

const baseOccurrenceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    userComments: {
      type: [userCommentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const travelOccurrenceSchema = new Schema({
  method: {
    type: String,
    enum: ["train", "plane", "car", "bus", "watercraft"],
  },
  startLocation: { type: addressSchema },
  endLocation: { type: addressSchema },
});

// This will include accommodation, activity, and food occurrences
const addressBasedOccurrence = new Schema({
  location: { type: addressSchema },
});

export const occurrenceSchema = new Schema<Occurrence>()
  .add(baseOccurrenceSchema)
  .add(travelOccurrenceSchema)
  .add(addressBasedOccurrence);

import { Document } from "mongoose";
import { Adventure } from "../../../../lib/models/adventure.model";
import { Occurrence } from "../../../../lib/models/occurrence.model";
export type AdventureDocument = Document<unknown, {}, Adventure> &
  Adventure &
  Required<{ _id: string }>;

export type OccurrenceDocument = Document<unknown, {}, Occurrence> &
  Occurrence &
  Required<{ _id: string }>;

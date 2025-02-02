import { Document } from "mongoose";
import { Adventure } from "../../../../lib/models/adventure.model";
import { Occurrence } from "../../../../lib/models/occurrence.model";
import { User } from "../../../../lib/models/user.model";
export type AdventureDocument = Document<unknown, object, Adventure> &
  Adventure &
  Required<{ _id: string }>;

export type OccurrenceDocument = Document<unknown, object, Occurrence> &
  Occurrence &
  Required<{ _id: string }>;

export type UserDocument = Document<unknown, object, User> &
  User &
  Required<{ _id: string }>;

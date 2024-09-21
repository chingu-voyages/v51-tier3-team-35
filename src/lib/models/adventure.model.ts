import { Occurrence } from "./occurrence.model";

export type Adventure = {
  _id?: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  occurrences: Occurrence[];
  imageUrl?: string;
};

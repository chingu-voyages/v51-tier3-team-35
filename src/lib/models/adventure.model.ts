import { Occurrence } from "./occurrence.model";

export type Adventure = {
  _id?: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  participants: string[]; // userIds
  occurrences: Occurrence[];
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
};

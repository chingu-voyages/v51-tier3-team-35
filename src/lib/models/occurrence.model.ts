import { Address } from "./address.model";
import { UserComment } from "./user-comment.model";

type BaseOccurrence = {
  _id?: string;
  title: string;
  eventType: EventType;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  comments?: UserComment[];
};

type AddressBasedOccurence = {
  location: Address;
  alternateLocation?: Address;
};

export type EventType = "travel" | "accommodation" | "activity" | "food";

export type TravelOccurrence = BaseOccurrence & {
  method: "train" | "plane" | "car" | "bus" | "watercraft";
  startLocation: Address;
  endLocation?: Address;
};

export type AccommodationOccurrence = BaseOccurrence & AddressBasedOccurence;

export type ActivityOccurrence = BaseOccurrence & AddressBasedOccurence;
export type FoodOccurrence = BaseOccurrence & AddressBasedOccurence;

export type Occurrence =
  | TravelOccurrence
  | AccommodationOccurrence
  | ActivityOccurrence
  | FoodOccurrence;

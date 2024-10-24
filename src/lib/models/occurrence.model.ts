import { Address } from "./address.model";
import { UserComment } from "./user-comment.model";

type BaseOccurrence = {
  _id?: string;
  title: string;
  eventType: EventType;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: string;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  userComments?: UserComment[];
};

type AddressBasedOccurence = {
  location: Address;
  alternateLocation?: Address;
};

export type EventType = "travel" | "accommodation" | "activity" | "food";

export type TravelOccurrence = BaseOccurrence & {
  method: TravelOccurrenceMethod;
  startLocation?: Address;
  endLocation?: Address;
};

export enum TravelOccurrenceMethod {
  Train = "train",
  Plane = "plane",
  Car = "car",
  Bus = "bus",
  Watercraft = "watercraft",
}

export type AccommodationOccurrence = BaseOccurrence &
  AddressBasedOccurence & {
    accommodationName: string;
    checkIn: Date;
    checkOut: Date;
  };

export type ActivityOccurrence = BaseOccurrence & AddressBasedOccurence;
export type FoodOccurrence = BaseOccurrence & AddressBasedOccurence;

export type Occurrence =
  | TravelOccurrence
  | AccommodationOccurrence
  | ActivityOccurrence
  | FoodOccurrence;

export type StackerComment = UserComment & { name: string };

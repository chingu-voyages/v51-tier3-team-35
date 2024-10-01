import { TravelOccurrenceMethod } from "../../lib/models/occurrence.model";

export interface TravelOccurrenceSubmitData {
  travelMethod: TravelOccurrenceMethod;
  startLocation: google.maps.places.PlaceResult;
  endLocation: google.maps.places.PlaceResult | null;
}

export interface AccommodationOccurrenceSubmitData {
  location: google.maps.places.PlaceResult;
  checkIn: Date;
  checkOut: Date;
  accommodationName: string;
}

export interface ActivityOccurrenceSubmitData {
  location: google.maps.places.PlaceResult;
}

export interface FoodOccurrenceSubmitData
  extends ActivityOccurrenceSubmitData {}

export type OccurrenceSubmissionData =
  | TravelOccurrenceSubmitData
  | AccommodationOccurrenceSubmitData
  | ActivityOccurrenceSubmitData
  | FoodOccurrenceSubmitData;

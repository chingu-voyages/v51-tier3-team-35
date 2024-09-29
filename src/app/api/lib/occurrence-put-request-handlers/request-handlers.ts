import {
  AccommodationOccurrenceSubmitData,
  ActivityOccurrenceSubmitData,
  FoodOccurrenceSubmitData,
  TravelOccurrenceSubmitData,
} from "../../../../components/occurrence-modal/definitions";
import {
  AccommodationOccurrence,
  ActivityOccurrence,
  TravelOccurrence,
} from "../../../../lib/models/occurrence.model";
import { OccurrenceApiPutRequest } from "../../../services/definitions";
import {
  AdventureDocument,
  BaseOccurrencePutRequestHandler,
} from "./base-occurrence-put-request-handler";

export const TravelOccurrenceApiPutRequestHandler: BaseOccurrencePutRequestHandler<TravelOccurrenceSubmitData> =
  {
    handle: async (
      userId: string,
      adventureDocument: AdventureDocument,
      requestBody: OccurrenceApiPutRequest<TravelOccurrenceSubmitData>
    ): Promise<AdventureDocument> => {
      // Get the start and end date ranges for the calendar
      const { startDate, endDate, eventType, data, description, title, notes } =
        requestBody;

      const travelOccurrence: TravelOccurrence = {
        title,
        startTime: startDate!,
        endTime: endDate!,
        eventType,
        description,
        createdBy: userId,
        method: data.travelMethod,
        notes,
        startLocation: {
          formatted_address: data.startLocation.formatted_address!,
          address_components: data.startLocation.address_components!,
          latlng: {
            lat: (data.startLocation?.geometry?.location as any)?.lat,
            lng: (data.startLocation?.geometry?.location as any)?.lng,
          },
        },
        endLocation: {
          formatted_address: data.endLocation?.formatted_address!,
          address_components: data.endLocation?.address_components!,
          latlng: {
            lat: (data.endLocation?.geometry?.location as any)?.lat,
            lng: (data.endLocation?.geometry?.location as any)?.lng,
          },
        },
      };

      adventureDocument.occurrences.push(travelOccurrence);
      await adventureDocument.save();
      return adventureDocument;
    },
  };

export const AccommodationOccurrenceApiPutRequestHandler: BaseOccurrencePutRequestHandler<AccommodationOccurrenceSubmitData> =
  {
    handle: async (
      userId: string,
      adventureDocument: AdventureDocument,
      requestBody: OccurrenceApiPutRequest<AccommodationOccurrenceSubmitData>
    ) => {
      const { startDate, endDate, data, notes, title } = requestBody;

      const accommodationOccurrence: AccommodationOccurrence = {
        title,
        eventType: requestBody.eventType,
        createdBy: userId,
        startTime: startDate!,
        endTime: endDate!,
        notes,
        location: {
          formatted_address: data.location.formatted_address!,
          address_components: data.location.address_components!,
          latlng: {
            lat: (data.location?.geometry?.location as any)?.lat,
            lng: (data.location?.geometry?.location as any)?.lng,
          },
        },
        accommodationName: data.accommodationName,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
      };

      adventureDocument.occurrences.push(accommodationOccurrence);
      await adventureDocument.save();
      return adventureDocument;
    },
  };

export const ActivityOccurrenceApiPutRequestHandler: BaseOccurrencePutRequestHandler<ActivityOccurrenceSubmitData> =
  {
    handle: async (
      userId: string,
      adventureDocument: AdventureDocument,
      requestBody: OccurrenceApiPutRequest<ActivityOccurrenceSubmitData>
    ) => {
      const { startDate, endDate, data, description, notes, title } =
        requestBody;

      const activityOccurrence: ActivityOccurrence = {
        title,
        eventType: requestBody.eventType,
        createdBy: userId,
        startTime: startDate!,
        endTime: endDate!,
        description,
        notes,
        location: {
          formatted_address: data.location.formatted_address!,
          address_components: data.location.address_components!,
          latlng: {
            lat: (data.location?.geometry?.location as any)?.lat,
            lng: (data.location?.geometry?.location as any)?.lng,
          },
        },
      };

      adventureDocument.occurrences.push(activityOccurrence);
      await adventureDocument.save();
      return adventureDocument;
    },
  };

// Right now, the food is same as activity, but it could be different in the future
export const FoodOccurrenceApiPutRequestHandler: BaseOccurrencePutRequestHandler<FoodOccurrenceSubmitData> =
  ActivityOccurrenceApiPutRequestHandler;

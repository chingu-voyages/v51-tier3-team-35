import {
  AccommodationOccurrenceSubmitData,
  ActivityOccurrenceSubmitData,
  FoodOccurrenceSubmitData,
  TravelOccurrenceSubmitData,
} from "../../../../../components/occurrence-modal/definitions";
import {
  AccommodationOccurrence,
  ActivityOccurrence,
  TravelOccurrence,
} from "../../../../../lib/models/occurrence.model";
import { OccurrenceApiWriteRequest } from "../../../../services/definitions";
import { AdventureDocument } from "../../definitions/definitions";
import { BaseOccurrencePatchRequestHandler } from "./base-occurrence-patch-request-handler";

export const TravelOccurrenceApiPatchRequestHandler: BaseOccurrencePatchRequestHandler<TravelOccurrenceSubmitData> =
  {
    handle: async (
      userId: string,
      adventureDocument: AdventureDocument,
      occurrenceDocument: TravelOccurrence,
      requestBody: OccurrenceApiWriteRequest<TravelOccurrenceSubmitData>
    ): Promise<AdventureDocument> => {
      const { data, description, title, notes, startTime, endTime } =
        requestBody;

      console.info("TravelOccurrenceApiPatchRequestHandler", requestBody);
      occurrenceDocument.title = title;
      occurrenceDocument.description = description;
      occurrenceDocument.notes = notes;
      occurrenceDocument.method = data.travelMethod;

      occurrenceDocument.startTime = startTime;
      occurrenceDocument.endTime = endTime;

      if (data?.startLocation) {
        occurrenceDocument.startLocation = {
          formatted_address: data.startLocation.formatted_address!,
          address_components: data.startLocation.address_components!,
          latlng: {
            lat: (data.startLocation?.geometry?.location as any)?.lat,
            lng: (data.startLocation?.geometry?.location as any)?.lng,
          },
        };
      }

      if (data?.endLocation) {
        occurrenceDocument.endLocation = {
          formatted_address: data.endLocation?.formatted_address!,
          address_components: data.endLocation?.address_components!,
          latlng: {
            lat: (data.endLocation?.geometry?.location as any)?.lat,
            lng: (data.endLocation?.geometry?.location as any)?.lng,
          },
        };
      }
      const occurrenceIndex = adventureDocument.occurrences.findIndex(
        (o) => o._id === occurrenceDocument._id
      );

      if (occurrenceIndex === -1) {
        throw new Error("Occurrence not found in adventure");
      }

      adventureDocument.occurrences[occurrenceIndex] = occurrenceDocument;
      await adventureDocument.save();
      return adventureDocument;
    },
  };

export const ActivityOccurrencceApiPatchRequestHandler: BaseOccurrencePatchRequestHandler<ActivityOccurrenceSubmitData> =
  {
    handle: async (
      userId: string,
      adventureDocument: AdventureDocument,
      occurrenceDocument: ActivityOccurrence,
      requestBody: OccurrenceApiWriteRequest<ActivityOccurrenceSubmitData>
    ): Promise<AdventureDocument> => {
      const { data, description, title, notes, startTime, endTime } =
        requestBody;

      occurrenceDocument.title = title;
      occurrenceDocument.description = description;
      occurrenceDocument.notes = notes;

      occurrenceDocument.startTime = startTime;
      occurrenceDocument.endTime = endTime;

      if (data?.location) {
        occurrenceDocument.location = {
          formatted_address: data.location.formatted_address!,
          address_components: data.location.address_components!,
          latlng: {
            lat: (data.location?.geometry?.location as any)?.lat,
            lng: (data.location?.geometry?.location as any)?.lng,
          },
        };
      }

      const occurrenceIndex = adventureDocument.occurrences.findIndex(
        (o) => o._id === occurrenceDocument._id
      );

      if (occurrenceIndex === -1) {
        throw new Error("Occurrence not found in adventure");
      }

      adventureDocument.occurrences[occurrenceIndex] = occurrenceDocument;
      await adventureDocument.save();
      return adventureDocument;
    },
  };

export const AccommodationOccurrenceApiPatchRequestHandler: BaseOccurrencePatchRequestHandler<AccommodationOccurrenceSubmitData> =
  {
    handle: async (
      userId: string,
      adventureDocument: AdventureDocument,
      occurrenceDocument: AccommodationOccurrence,
      requestBody: OccurrenceApiWriteRequest<AccommodationOccurrenceSubmitData>
    ): Promise<AdventureDocument> => {
      const { data, description, title, notes, startTime, endTime } =
        requestBody;

      occurrenceDocument.title = title;
      occurrenceDocument.description = description;
      occurrenceDocument.notes = notes;

      occurrenceDocument.startTime = startTime;
      occurrenceDocument.endTime = endTime;

      occurrenceDocument.accommodationName = data.accommodationName;
      occurrenceDocument.checkIn = data.checkIn;
      occurrenceDocument.checkOut = data.checkOut;

      const occurrenceIndex = adventureDocument.occurrences.findIndex(
        (o) => o._id === occurrenceDocument._id
      );

      if (occurrenceIndex === -1) {
        throw new Error("Occurrence not found in adventure");
      }

      adventureDocument.occurrences[occurrenceIndex] = occurrenceDocument;
      await adventureDocument.save();
      return adventureDocument;
    },
  };

export const FoodOccurrenceApiPatchRequestHandler: BaseOccurrencePatchRequestHandler<FoodOccurrenceSubmitData> =
  ActivityOccurrencceApiPatchRequestHandler;

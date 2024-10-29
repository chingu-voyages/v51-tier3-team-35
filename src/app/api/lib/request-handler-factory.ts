import { EventType } from "../../../lib/models/occurrence.model";
import {
  AccommodationOccurrenceApiPatchRequestHandler,
  ActivityOccurrencceApiPatchRequestHandler,
  FoodOccurrenceApiPatchRequestHandler,
  TravelOccurrenceApiPatchRequestHandler,
} from "./request-handlers/occurrence-patch-request-handlers/request-handlers";
import {
  AccommodationOccurrenceApiPutRequestHandler,
  ActivityOccurrenceApiPutRequestHandler,
  FoodOccurrenceApiPutRequestHandler,
  TravelOccurrenceApiPutRequestHandler,
} from "./request-handlers/occurrence-put-request-handlers/request-handlers";

export const OccurrencePutRequestHandlerFactory = {
  create: (type: EventType) => {
    switch (type) {
      case "travel":
        return TravelOccurrenceApiPutRequestHandler;
      case "accommodation":
        return AccommodationOccurrenceApiPutRequestHandler;
      case "activity":
        return ActivityOccurrenceApiPutRequestHandler;
      case "food":
        return FoodOccurrenceApiPutRequestHandler;
      default:
        throw new Error("Invalid request handler type");
    }
  },
};

export const OccurrencePatchRequestHandlerFactory = {
  update: (type: EventType) => {
    switch (type) {
      case "travel":
        return TravelOccurrenceApiPatchRequestHandler;
      case "activity":
        return ActivityOccurrencceApiPatchRequestHandler;
      case "accommodation":
        return AccommodationOccurrenceApiPatchRequestHandler;
      case "food":
        return FoodOccurrenceApiPatchRequestHandler;
      default:
        throw new Error("Invalid request handler type");
    }
  },
};

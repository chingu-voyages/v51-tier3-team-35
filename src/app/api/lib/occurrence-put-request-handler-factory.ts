import { EventType } from "../../../lib/models/occurrence.model";
import {
  AccommodationOccurrenceApiPutRequestHandler,
  ActivityOccurrenceApiPutRequestHandler,
  FoodOccurrenceApiPutRequestHandler,
  TravelOccurrenceApiPutRequestHandler,
} from "./occurrence-put-request-handlers/request-handlers";

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

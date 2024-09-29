import { Document } from "mongoose";
import { Adventure } from "../../../../lib/models/adventure.model";
import { OccurrenceApiPutRequest } from "../../../services/definitions";

export type AdventureDocument = Document<unknown, {}, Adventure> &
  Adventure &
  Required<{ _id: string }>;

export interface BaseOccurrencePutRequestHandler<T> {
  handle(
    userId: string,
    adventureDocument: AdventureDocument,
    requestBody: OccurrenceApiPutRequest<T>
  ): Promise<any>;
}

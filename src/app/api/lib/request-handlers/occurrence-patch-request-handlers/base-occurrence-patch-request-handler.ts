import { OccurrenceApiWriteRequest } from "../../../../services/definitions";
import { AdventureDocument } from "../../definitions/definitions";

export interface BaseOccurrencePatchRequestHandler<T> {
  handle(
    userId: string,
    adventureDocument: AdventureDocument,
    occurrenceDocument: any,
    requestBody: OccurrenceApiWriteRequest<T>
  ): Promise<AdventureDocument>;
}

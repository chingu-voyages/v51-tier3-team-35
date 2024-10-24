import { OccurrenceApiWriteRequest } from "../../../../services/definitions";
import { AdventureDocument } from "../../definitions/definitions";

export interface BaseOccurrencePutRequestHandler<T> {
  handle(
    userId: string,
    adventureDocument: AdventureDocument,
    requestBody: OccurrenceApiWriteRequest<T>
  ): Promise<AdventureDocument>;
}

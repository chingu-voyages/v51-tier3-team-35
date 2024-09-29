import { OccurrenceSubmissionData } from "../../components/occurrence-modal/definitions";
import { EventType } from "../../lib/models/occurrence.model";

export type OccurrenceApiPutRequest = {
  eventType: EventType;
  startDate?: Date;
  endDate?: Date;
  adventureId: string;
  data: OccurrenceSubmissionData;
  notes?: string;
  description?: string;
};

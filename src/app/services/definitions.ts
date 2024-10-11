import { EventType } from "../../lib/models/occurrence.model";

export type OccurrenceApiWriteRequest<T> = {
  eventType: EventType;
  startDate?: Date;
  endDate?: Date;
  adventureId: string;
  data: T;
  notes?: string;
  description?: string;
  title: string;
};

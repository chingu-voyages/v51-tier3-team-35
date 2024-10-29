import { EventType } from "../../lib/models/occurrence.model";

export type OccurrenceApiWriteRequest<T> = {
  eventType: EventType;
  startTime?: Date;
  endTime?: Date;
  adventureId: string;
  data: T;
  notes?: string;
  description?: string;
  title: string;
};

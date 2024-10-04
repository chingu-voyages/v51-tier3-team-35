import dayjs from "dayjs";
import { Occurrence } from "../../../../lib/models/occurrence.model";
import { ReactBigCalendarEvent } from "../definitions/definitions";

export function adaptToReactBigCalendarEvent(
  occ: Occurrence
): ReactBigCalendarEvent {
  return {
    _id: occ._id!,
    title: occ.title,
    start: dayjs(occ.startTime!).toDate(),
    end: dayjs(occ.endTime!).toDate(),
  };
}

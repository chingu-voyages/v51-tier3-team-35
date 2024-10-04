"use client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { OccurrenceSubmissionData } from "../../../../components/occurrence-modal/definitions";
import { OccurrenceModal } from "../../../../components/occurrence-modal/Occurrence-modal";
import { OccurrenceToolbar } from "../../../../components/occurrence-toolbar/Occurrence-toolbar";
import { Adventure } from "../../../../lib/models/adventure.model";
import { EventType } from "../../../../lib/models/occurrence.model";
import { AdventureService } from "../../../services/adventure-service";
import { ReactBigCalendarEvent } from "../definitions/definitions";
import { adaptToReactBigCalendarEvent } from "../utils/adapt-to-big-calendar";

export default function ViewEditAdventurePage() {
  const params = useParams<{ adventureId: string }>();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [activeTabOption, setActiveTabOption] = useState<EventType>("travel");
  const [modalOpen, setModalOpen] = useState(false);
  const [slotStartDate, setSlotStartDate] = useState<Date | null>(null);
  const [slotEndDate, setSlotEndDate] = useState<Date | null>(null);
  const router = useRouter();
  const { status } = useSession();

  const [eventOccurrences, setEventOccurrences] = useState<
    ReactBigCalendarEvent[]
  >([]);
  useEffect(() => {
    fetchAdventureById();
  }, []);

  const localizer = dayjsLocalizer(dayjs);

  const fetchAdventureById = async () => {
    try {
      const result = await AdventureService.getAdventureById(
        params.adventureId
      );

      setAdventure(result);
      const mappedEvents = result.occurrences.map((occurrence) =>
        adaptToReactBigCalendarEvent(occurrence)
      );
      setEventOccurrences(mappedEvents);
    } catch (error) {
      // TODO: Redirect to an error page?
      console.error(error);
    }
  };

  const handleSelectEvent = useCallback((event: any) => {
    console.log(event);
  }, []);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setSlotStartDate(start);
      setSlotEndDate(end);
      setModalOpen(true);
    },
    []
  );

  // Here is where we send the post request to the server
  const submitData = async (
    data: OccurrenceSubmissionData,
    {
      notes,
      description,
      title,
    }: { notes?: string; description?: string; title: string }
  ) => {
    await AdventureService.createOccurrence({
      eventType: activeTabOption,
      data,
      startDate: slotStartDate!,
      endDate: slotEndDate!,
      adventureId: params.adventureId,
      notes,
      description,
      title,
    });

    // Refresh the adventure data
    await fetchAdventureById();
  };

  const handleNavigate = (date: Date, view: string, action: string) => {
    if (action === "NEXT") {
      if (view === "week") {
        setCurrentDate(dayjs(currentDate).add(1, "week"));
      } else {
        setCurrentDate(dayjs(currentDate).add(1, "month"));
      }
    } else if (action === "PREV") {
      if (view === "week") {
        setCurrentDate(dayjs(currentDate).subtract(1, "week"));
      } else {
        setCurrentDate(dayjs(currentDate).subtract(1, "month"));
      }
    }
  };

  if (status === "unauthenticated") {
    // Only authenticated users can access this page
    router.replace("/signin");
    return null;
  }
  // This is a placeholder to get basic functionality working
  return (
    <div>
      <OccurrenceToolbar
        onTabChange={(eventType: EventType) => {
          // We set the current active option to the selected tab
          // When the modal opens, it opens to the correct occurrence (event) type
          setActiveTabOption(eventType);
        }}
      />
      <h1>View edit an adventure with id {params.adventureId}</h1>
      <h1>{adventure?.description}</h1>
      <div>
        <Calendar
          date={currentDate.toDate()}
          defaultView="week"
          localizer={localizer}
          events={eventOccurrences}
          onNavigate={(date, view, action) => {
            // Navigate back or next one week at a time
            handleNavigate(date, view, action);
          }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onView={(view) => console.log(view)}
          style={{ height: 800 }}
          selectable
          startAccessor={"start"}
        />
      </div>
      <OccurrenceModal
        id="ocmodal"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        occurrenceType={activeTabOption}
        onSubmit={(data, { notes, description, title }) => {
          setModalOpen(false);
          submitData(data, { notes, description, title });
        }}
      />
    </div>
  );
}

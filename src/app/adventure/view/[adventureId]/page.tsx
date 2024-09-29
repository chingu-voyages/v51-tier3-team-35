"use client";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { OccurrenceSubmissionData } from "../../../../components/occurrence-modal/definitions";
import { OccurrenceModal } from "../../../../components/occurrence-modal/Occurrence-modal";
import { OccurrenceToolbar } from "../../../../components/occurrence-toolbar/Occurrence-toolbar";
import { Adventure } from "../../../../lib/models/adventure.model";
import { EventType } from "../../../../lib/models/occurrence.model";
import { AdventureService } from "../../../services/adventure-service";

interface EventOccurrenceData {
  _id: string;
  title: string;
  start: Date;
  end: Date;
}
export default function ViewEditAdventurePage() {
  const params = useParams<{ adventureId: string }>();
  const [currentDate, setCurrentDate] = useState(dayjs("2024-09-22"));
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [activeTabOption, setActiveTabOption] = useState<EventType>("travel");
  const [modalOpen, setModalOpen] = useState(false);
  const [slotStartDate, setSlotStartDate] = useState<Date | null>(null);
  const [slotEndDate, setSlotEndDate] = useState<Date | null>(null);

  const [eventOccurrences, setEventOccurrences] = useState<
    EventOccurrenceData[]
  >([
    {
      _id: "3",
      title: "Direct Object",
      start: dayjs().hour(4).minute(0).toDate(),
      end: dayjs().hour(5).minute(0).toDate(),
    },
    {
      _id: "4",
      title: "Test2",
      start: dayjs().add(1, "day").hour(4).minute(0).toDate(),
      end: dayjs().add(1, "day").hour(5).minute(0).toDate(),
    },
  ]);
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
    { notes, description }: { notes?: string; description?: string }
  ) => {
    await AdventureService.putUpdateAdventure({
      eventType: activeTabOption,
      data,
      startDate: slotStartDate!,
      endDate: slotEndDate!,
      adventureId: params.adventureId,
      notes,
      description,
    });
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
        />
      </div>
      <OccurrenceModal
        id="ocmodal"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        occurrenceType={activeTabOption}
        onSubmit={(data, { notes, description }) => {
          setModalOpen(false);
          submitData(data, { notes, description });
        }}
      />
    </div>
  );
}

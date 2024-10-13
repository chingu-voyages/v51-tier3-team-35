"use client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MdOutlineModeEdit } from "react-icons/md";
import { OccurrenceSubmissionData } from "../../../../components/occurrence-modal/definitions";
import { OccurrenceModal } from "../../../../components/occurrence-modal/Occurrence-modal";
import { OccurrenceToolbar } from "../../../../components/occurrence-toolbar/Occurrence-toolbar";
import { Adventure } from "../../../../lib/models/adventure.model";
import { EventType } from "../../../../lib/models/occurrence.model";
import { usePageVisibility } from "../../../hooks/use-page-visibility";
import { AdventureService } from "../../../services/adventure-service";
import { ReactBigCalendarEvent } from "../definitions/definitions";
import { adaptToReactBigCalendarEvent } from "../utils/adapt-to-big-calendar";

export default function ViewEditAdventurePage() {
  const params = useParams<{ adventureId: string }>();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [activeTabOption, setActiveTabOption] = useState<EventType>("travel");

  const [modalOpen, setModalOpen] = useState(false);
  const [existingEventModalOpen, setExistingEventModalOpen] = useState(false);

  const [slotStartDate, setSlotStartDate] = useState<Date | null>(null);
  const [slotEndDate, setSlotEndDate] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null
  );
  const router = useRouter();
  const { status } = useSession();

  const [eventOccurrences, setEventOccurrences] = useState<
    ReactBigCalendarEvent[]
  >([]);

  const [toastVisible, setToastVisible] = useState(false);
  const [isEditingOccurrenceDesc, setIsEditingOccurrenceDesc] = useState(false);
  const [
    adventureDescriptionEditableText,
    setAdventureDescriptionEditableText,
  ] = useState("");

  const [isBusy, setIsBusy] = useState(false);

  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const isPageVisible = usePageVisibility();
  const timerIdRef = useRef<any>(null);

  useEffect(() => {
    fetchAdventureById();
  }, []);

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        setToastVisible(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [toastVisible]);

  useEffect(() => {
    setAdventureDescriptionEditableText(adventure?.description ?? "");
  }, [adventure?.description]);

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
    // TODO: Fix any type
    if (event._id) {
      setSelectedEventId(event._id);
      setSelectedEventType(event.eventType);
      setExistingEventModalOpen(true);
    }
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
    }: { notes?: string; description?: string; title: string },
    args?: { editing: boolean }
  ) => {
    if (!args?.editing) {
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
    } else {
      try {
        await AdventureService.patchOccurrenceById(
          params.adventureId,
          selectedEventId!,
          selectedEventType!,
          { notes, title, description, ...data }
        );
        setToastVisible(true);
      } catch (error: any) {
        console.error(error);
      }
    }

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

  const handleUpdateOccDescription = async () => {
    // Send request to patch the adventure description
    try {
      setIsBusy(true);
      await AdventureService.patchAdventureById(params.adventureId, {
        description: adventureDescriptionEditableText,
      });
      setToastVisible(true);
      setIsEditingOccurrenceDesc(false);
      await fetchAdventureById();
      setIsBusy(false);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const pollingCallBack = async () => {
      try {
        await fetchAdventureById();
      } catch (error: any) {
        console.error("polling stopped due to error:", error.message);
        setIsPollingEnabled(false);
      }
    };

    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallBack, 3000);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPageVisible && isPollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => {
      stopPolling();
    };
  }, [isPageVisible, isPollingEnabled]);

  if (status === "unauthenticated") {
    // Only authenticated users can access this page
    router.replace("/signin");
    return null;
  }
  // This is a placeholder to get basic functionality working
  return (
    <div className="p-4">
      <OccurrenceToolbar
        onTabChange={(eventType: EventType) => {
          // We set the current active option to the selected tab
          // When the modal opens, it opens to the correct occurrence (event) type
          setActiveTabOption(eventType);
        }}
      />
      <div className="p-4 mb-4">
        {/* Event description - editable */}
        {!isEditingOccurrenceDesc ? (
          <div
            className="flex gap-2 hover:cursor-pointer"
            onClick={() => setIsEditingOccurrenceDesc(true)}
          >
            <h1 className="text-xl mb-4">{adventure?.description}</h1>
            <MdOutlineModeEdit className="text-2xl" />
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              className="w-[300px] px-2"
              type="text"
              value={adventureDescriptionEditableText}
              onChange={(e) =>
                setAdventureDescriptionEditableText(e.target.value)
              }
              maxLength={80}
            />
            <button
              disabled={isBusy}
              className="btn"
              onClick={handleUpdateOccDescription}
            >
              Update
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                setIsEditingOccurrenceDesc(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
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
      {modalOpen && (
        <OccurrenceModal
          id="create-occurrence-modal"
          key="create-occurrence-modal"
          onClose={() => setModalOpen(false)}
          adventureId={params.adventureId}
          occurrenceType={activeTabOption}
          title={`New ${selectedEventId} event`}
          newEvent
          onSubmit={(data, { notes, description, title }) => {
            setModalOpen(false);
            submitData(data, { notes, description, title });
          }}
        />
      )}
      {existingEventModalOpen && (
        <OccurrenceModal
          id="existing-occurrence-modal"
          key="existing-occurrence-modal"
          onClose={() => setExistingEventModalOpen(false)}
          adventureId={params.adventureId}
          occurrenceType={selectedEventType!}
          currentEventId={selectedEventId}
          title={`Edit ${selectedEventType} event`}
          onSubmit={(data, { notes, description, title }) => {
            setExistingEventModalOpen(false);
            submitData(data, { notes, description, title }, { editing: true });
          }}
        />
      )}
      {toastVisible && (
        <div className="toast toast-end opacity-60">
          <div className="alert alert-success">
            <span>Successfully updated.</span>
          </div>
        </div>
      )}
    </div>
  );
}

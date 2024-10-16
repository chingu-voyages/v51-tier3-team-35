"use client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiSettings } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { AdventureSetupComponent } from "../../../../components/advebture-setup-component/Adeventure-setup-component";
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

  const [
    adventureDescriptionEditableText,
    setAdventureDescriptionEditableText,
  ] = useState("");

  const [isBusy, setIsBusy] = useState(false);

  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [adventureConfigModalOpen, setAdventureConfigModalOpen] =
    useState(false);
  const isPageVisible = usePageVisibility();
  const timerIdRef = useRef<any>(null);

  useEffect(() => {
    try {
      fetchAdventureById();
    } catch (error: any) {
      console.error("Error fetching adventure", error);
    }
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
    const result = await AdventureService.getAdventureById(params.adventureId);

    setAdventure(result);

    const mappedEvents = result.occurrences.map((occurrence) =>
      adaptToReactBigCalendarEvent(occurrence)
    );
    setEventOccurrences(mappedEvents);

    // TODO: Redirect to an error page?
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
    try {
      await fetchAdventureById();
    } catch (error: any) {
      console.error("Error fetching/refreshing adventureData", error);
    }
  };

  const handleNavigate = (date: Date, view: string, action: string) => {
    // We need navigation logic that navigates to the next or previous week, but won't allow the user to navigate past the start date and end date of the adventure

    if (action === "NEXT") {
      if (view === "week") {
        const targetDate = dayjs(currentDate).add(1, "week");
        if (targetDate.isAfter(dayjs(adventure?.endDate))) {
          setCurrentDate(dayjs(adventure?.endDate));
        } else {
          setCurrentDate(targetDate);
        }
      } else {
        setCurrentDate(dayjs(currentDate).add(1, "month"));
      }
    } else if (action === "PREV") {
      if (view === "week") {
        const targetDate = dayjs(currentDate).subtract(1, "week");
        if (targetDate.isBefore(dayjs(adventure?.startDate))) {
          setCurrentDate(dayjs(adventure?.startDate));
        } else {
          setCurrentDate(targetDate);
        }
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
      await fetchAdventureById();
      setIsBusy(false);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handlePatchAdventure = async () => {
    try {
      await fetchAdventureById();
      setAdventureConfigModalOpen(false);
    } catch (error: any) {
      console.error("Error fetching/refreshing adventureData", error);
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
      <div className="flex justify-between">
        <OccurrenceToolbar
          onTabChange={(eventType: EventType) => {
            // We set the current active option to the selected tab
            // When the modal opens, it opens to the correct occurrence (event) type
            setActiveTabOption(eventType);
          }}
        />
        <div className="items-center">
          <p className="text-lg">{adventure?.name}</p>
        </div>
        <div className="p-4">
          {/* Event description - editable */}
          <button onClick={() => setAdventureConfigModalOpen(true)}>
            <div className="flex items-center gap-x-2">
              <p>Configure</p>
              <CiSettings className="text-2xl" />
            </div>
          </button>
        </div>
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
          onSelecting={(range: { start: Date; end: Date }) => {
            if (
              range.start <
              dayjs(adventure?.startDate)
                .set("hour", 0)
                .set("minute", 0)
                .toDate()
            ) {
              return false;
            }

            if (range.end > dayjs(adventure?.endDate).toDate()) {
              return false;
            }
          }}
          onView={(view) => console.log(view)}
          style={{ height: 800 }}
          selectable
          startAccessor={"start"}
          min={dayjs(adventure?.startDate)
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .toDate()}
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
      {adventureConfigModalOpen && (
        <div className="absolute w-full top-[0] modal-container">
          <div className="modal-box w-full max-w-[800px] lg:ml-[30%]">
            <div className="flex justify-end">
              <button onClick={() => setAdventureConfigModalOpen(false)}>
                <MdClose />
              </button>
            </div>
            {adventure?.name && adventure.description && (
              <AdventureSetupComponent
                title="Configure adventure"
                name={adventure.name}
                description={adventure.description}
                startDate={adventure.startDate}
                endDate={adventure.endDate}
                id={adventure._id!}
                onEventPatched={handlePatchAdventure}
              />
            )}
          </div>
        </div>
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

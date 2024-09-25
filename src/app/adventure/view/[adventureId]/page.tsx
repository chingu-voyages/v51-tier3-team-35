"use client";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Calendar, dayjsLocalizer, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Adventure } from "../../../../lib/models/adventure.model";
import { AdventureService } from "../../../services/adventure-service";

export default function ViewEditAdventurePage() {
  const params = useParams<{ adventureId: string }>();
  const [currentDate, setCurrentDate] = useState(dayjs("2024-09-22"));
  const [adventure, setAdventure] = useState<Adventure | null>(null);

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

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    console.log(slotInfo);
  }, []);

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
      <h1>View edit an adventure with id {params.adventureId}</h1>
      <h1>{adventure?.description}</h1>
      <div>
        <Calendar
          date={currentDate.toDate()}
          defaultView="week"
          localizer={localizer}
          events={[
            {
              _id: "3",
              title: "Direct Object",
              start: dayjs().hour(4).minute(0).toDate(),
              end: dayjs().hour(5).minute(0).toDate(),
            },
            {
              title: "Test2",
              start: dayjs().add(1, "day").hour(4).minute(0).toDate(),
              end: dayjs().add(1, "day").hour(5).minute(0).toDate(),
            },
          ]}
          onNavigate={(date, view, action) => {
            // Navigate back or next one week at a time
            handleNavigate(date, view, action);
          }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onView={(view) => console.log(view)}
          className=""
          style={{ height: 800 }}
          selectable
        />
      </div>
    </div>
  );
}

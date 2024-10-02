import { useState } from "react";
import { FaTruckPlane } from "react-icons/fa6";
import {
  MdOutlineLocalDining,
  MdOutlineLocalHotel,
  MdOutlineSportsHandball,
} from "react-icons/md";
import { EventType } from "../../lib/models/occurrence.model";
// This is the toolbar that allows user to select between different tabs/occurrence types

interface OccurrenceToolbarProps {
  onTabChange?: (eventType: EventType) => void;
}
export const OccurrenceToolbar = ({ onTabChange }: OccurrenceToolbarProps) => {
  const [activeTab, setActiveTab] = useState<EventType>("travel");

  const handleTabClick = (eventType: EventType) => {
    setActiveTab(eventType);
    onTabChange && onTabChange(eventType);
  };

  const getActiveTabClass = (eventType: EventType) => {
    if (eventType === activeTab) {
      return "tab-active";
    }
    return "";
  };

  return (
    <div role="tablist" className="tabs tabs-bordered p-4 max-w-fit flex">
      <a
        role="tab"
        className={`tab ${getActiveTabClass("travel")}`}
        onClick={() => handleTabClick("travel")}
      >
        <div className="flex gap-x-2">
          <FaTruckPlane className="text-2xl" />
          <p className="text-lg">Travel</p>
        </div>
      </a>
      <a
        role="tab"
        className={`tab ${getActiveTabClass("accommodation")}`}
        onClick={() => handleTabClick("accommodation")}
      >
        <div className="flex gap-x-2">
          <MdOutlineLocalHotel className="text-2xl" />
          <p className="text-lg">Accomodation</p>
        </div>
      </a>
      <a
        role="tab"
        className={`tab ${getActiveTabClass("activity")}`}
        onClick={() => handleTabClick("activity")}
      >
        <div className="flex gap-x-2">
          <MdOutlineSportsHandball className="text-2xl" />
          <p className="text-lg">Activity</p>
        </div>
      </a>
      <a
        role="tab"
        className={`tab ${getActiveTabClass("food")}`}
        onClick={() => handleTabClick("food")}
      >
        <div className="flex gap-x-2">
          <MdOutlineLocalDining className="text-2xl" />
          <p className="text-lg">Food</p>
        </div>
      </a>
    </div>
  );
};

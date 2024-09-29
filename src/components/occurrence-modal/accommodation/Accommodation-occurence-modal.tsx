import dayjs from "dayjs";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { AddressAutoComplete } from "../../address-autocomplete/Address-autocomplete";
import { AccommodationOccurrenceSubmitData } from "../definitions";
import { ModalButtonControls } from "../modal-button-controls/Modal-button-controls";
interface AccommodationModalProps {
  onCloseModal: () => void;
  onSubmit: ({
    checkIn,
    checkOut,
    location,
    accommodationName,
  }: AccommodationOccurrenceSubmitData) => void;
}

export const accommodationOccurrence = (
  props: AccommodationModalProps,
  children?: JSX.Element[]
) => {
  const [location, setLocation] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [dateRange, setDateRange] = useState<Record<string, Date>>({
    checkIn: dayjs().minute(0).toDate(),
    checkOut: dayjs().add(7, "day").minute(0).toDate(),
  });

  const [accommodationName, setAccommodationName] = useState<string>("");

  const handleCalendarChange = (e: any, controlName: string) => {
    // Validate so that the start date is before the end date
    if (controlName === "checkIn" && e > dateRange.checkOut) {
      return;
    }

    setDateRange((prev) => {
      return {
        ...prev,
        [controlName]: e,
      };
    });
  };
  return (
    <div>
      <div>
        <h4 className="font-bold text-lg">Name of accommodation</h4>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Accommodation name"
          value={accommodationName}
          onChange={(e) => setAccommodationName(e.target.value)}
        />

        <div className="formatted-address pt-2 pb-2">
          {/* TODO: fix this so it shows a place name and not just the address */}

          {location?.formatted_address || ""}
        </div>
        <h4 className="font-bold text-lg">Address</h4>
        <AddressAutoComplete
          onPlaceSelected={(place) => {
            setLocation(place);
          }}
        />
      </div>
      <div className="divider"></div>
      <div>
        <h4 className="font-bold text-lg">Check in</h4>
        <DatePicker
          selected={dateRange.checkIn}
          name="checkIn"
          onChange={(e) => handleCalendarChange(e, "checkIn")}
        />
        <h4 className="font-bold text-lg">Check out</h4>
        <DatePicker
          selected={dateRange.checkOut}
          name="checkOut"
          onChange={(e) => handleCalendarChange(e, "checkOut")}
        />
        {children}
        <ModalButtonControls
          onSubmit={() => {
            props.onSubmit({
              checkIn: dateRange.checkIn,
              checkOut: dateRange.checkOut,
              location: location as google.maps.places.PlaceResult,
              accommodationName: accommodationName,
            });
          }}
          onCloseModal={() => {
            props.onCloseModal();
          }}
        />
      </div>
    </div>
  );
};

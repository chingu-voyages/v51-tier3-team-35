import { useState } from "react";
import { TravelOccurrenceMethod } from "../../../lib/models/occurrence.model";
import { AddressAutoComplete } from "../../address-autocomplete/Address-autocomplete";
import { TravelOccurrenceSubmitData } from "../definitions";
import { ModalButtonControls } from "../modal-button-controls/Modal-button-controls";

interface TravelOccurrenceModalProps {
  onCloseModal: () => void;
  onSubmit: ({
    travelMethod,
    startLocation,
    endLocation,
  }: TravelOccurrenceSubmitData) => void;
}
export const travelOccurrence = (
  props: TravelOccurrenceModalProps,
  children?: JSX.Element[]
) => {
  const [selectedTravelMethod, setSelectedTravelMethod] =
    useState<TravelOccurrenceMethod | null>(null);
  const [startAddress, setStartAddress] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [endAddress, setEndAddress] =
    useState<google.maps.places.PlaceResult | null>(null);
  /* 
    method,
    startLocation
    endLocation

    (the start end time should be calculated from the calendar UI)
  */
  return (
    <div>
      <div>
        <h4 className="font-bold text-lg">Travel Method</h4>

        {Object.keys(TravelOccurrenceMethod).map((method) => {
          return (
            <div className="form-control pt-2 pb-2" key={method}>
              <label htmlFor={method} className="cursor-pointer">
                <div className="flex justify-between">
                  <p className=" text-lg">{method}</p>
                  <input
                    type="radio"
                    name="method"
                    value={selectedTravelMethod as string}
                    className="w-[20px]"
                    onChange={() => {
                      setSelectedTravelMethod(
                        (TravelOccurrenceMethod as any)[method]
                      );
                    }}
                  />
                </div>
              </label>
            </div>
          );
        })}
      </div>
      {/* Divider */}
      <div className="divider"></div>
      <h4 className="font-bold text-lg">Start location</h4>
      <div>
        {/* Start location */}
        <div className="formatted-address pt-2 pb-2">
          {startAddress?.formatted_address || ""}
        </div>
        <AddressAutoComplete
          onPlaceSelected={(place) => {
            setStartAddress(place);
          }}
        />
      </div>
      <h4 className="font-bold text-lg">End location</h4>
      <div>
        {/* Start location */}
        <div className="formatted-address pt-2 pb-2">
          {endAddress?.formatted_address || ""}
        </div>
        <AddressAutoComplete
          onPlaceSelected={(place) => {
            setEndAddress(place);
          }}
        />
      </div>
      {children}
      <ModalButtonControls
        onSubmit={() => {
          if (selectedTravelMethod) {
            props.onSubmit({
              travelMethod: selectedTravelMethod,
              startLocation: startAddress!,
              endLocation: endAddress,
            });
          }
        }}
        onCloseModal={() => {
          props.onCloseModal();
        }}
      />
    </div>
  );
};

import { useEffect, useState } from "react";
import { ActivityOccurrence } from "../../../lib/models/occurrence.model";
import { AddressAutoComplete } from "../../address-autocomplete/Address-autocomplete";
import { ActivityOccurrenceSubmitData } from "../definitions";
import { ModalButtonControls } from "../modal-button-controls/Modal-button-controls";

interface ActivityOccurrenceModalProps {
  onCloseModal: () => void;
  onSubmit: ({ location }: ActivityOccurrenceSubmitData) => void;
  existingEventData?: ActivityOccurrence;
}
export const activityOccurrenceModal = (
  props: ActivityOccurrenceModalProps,
  children?: JSX.Element[]
) => {
  const [location, setLocation] =
    useState<google.maps.places.PlaceResult | null>(null);

  useEffect(() => {
    setLocation(props.existingEventData?.location! as any);
  }, [props.existingEventData]);

  return (
    <div>
      <h4 className="font-bold text-lg">Address</h4>
      <div className="formatted-address pt-2 pb-2">
        {location?.formatted_address || ""}
      </div>
      <AddressAutoComplete
        onPlaceSelected={(place) => {
          setLocation(place);
        }}
      />
      {children}
      <ModalButtonControls
        onSubmit={() => {
          props.onSubmit({
            location: location as google.maps.places.PlaceResult,
          });
        }}
        onCloseModal={() => {
          props.onCloseModal();
        }}
      />
    </div>
  );
};

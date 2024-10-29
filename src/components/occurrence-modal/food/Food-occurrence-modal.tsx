import { useEffect, useState } from "react";
import { FoodOccurrence } from "../../../lib/models/occurrence.model";
import { AddressAutoComplete } from "../../address-autocomplete/Address-autocomplete";
import { ModalButtonControls } from "../modal-button-controls/Modal-button-controls";

interface FoodOccurrenceModalProps {
  onCloseModal: () => void;
  onSubmit: ({ location }: any) => void;
  existingEventData?: FoodOccurrence;
}
export const foodOccurrenceModal = (
  props: FoodOccurrenceModalProps,
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
        {/* TODO: fix this so it shows a place name and not just the address */}

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

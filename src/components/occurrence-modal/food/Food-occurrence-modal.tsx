import { useState } from "react";
import { AddressAutoComplete } from "../../address-autocomplete/Address-autocomplete";
import { ModalButtonControls } from "../modal-button-controls/Modal-button-controls";

export const foodOccurrenceModal = (props: any, children?: JSX.Element[]) => {
  const [location, setLocation] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <div>
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

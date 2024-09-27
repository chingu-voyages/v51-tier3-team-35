import { useState } from "react";
import { AddressAutoComplete } from "../../address-autocomplete/Address-autocomplete";
import { ModalButtonControls } from "../modal-button-controls/Modal-button-controls";

export const foodOccurrenceModal = (props: any, children?: JSX.Element[]) => {
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <div>
      <h3 className="font-bold text-2xl mb-4">{`New Food Event`}</h3>
      <div className="divider"></div>
      <div>
        <h4 className="font-bold text-lg">Title</h4>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Food title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="divider"></div>
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
            title: title,
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

import { usePlacesWidget } from "react-google-autocomplete";
import { IoIosSearch } from "react-icons/io";
interface AddressAutoCompleteProps {
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
}

export function AddressAutoComplete(props: AddressAutoCompleteProps) {
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    options: {
      types: ["geocode", "establishment"],
    },
    onPlaceSelected: (place) => {
      props.onPlaceSelected && props.onPlaceSelected(place);
    },
  });

  return (
    <>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          ref={ref as any}
        />
        <IoIosSearch className="text-[30px]" />
      </label>
    </>
  );
}

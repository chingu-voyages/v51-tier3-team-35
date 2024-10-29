export type Address = {
  _id?: string;
  formatted_address: string;
  address_components: GoogleMapsAddressComponent[];
  latlng?: {
    lat: number;
    lng: number;
  };
  // We can also add google maps coordinates here
};

export type GoogleMapsAddressComponent = {
  long_name?: string;
  short_name?: string;
  types?: string[];
};

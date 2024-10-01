import mongoose, { Schema } from "mongoose";
import { Address, GoogleMapsAddressComponent } from "../models/address.model";

const GoogleMapAddressComponentSchema = new Schema<GoogleMapsAddressComponent>({
  long_name: {
    type: String,
  },
  short_name: {
    type: String,
  },
  types: {
    type: [String],
  },
});
export const addressSchema = new Schema<Address>(
  {
    formatted_address: {
      type: String,
    },
    address_components: {
      type: [GoogleMapAddressComponentSchema],
    },
    latlng: {
      lat: mongoose.Types.Decimal128,
      lng: mongoose.Types.Decimal128,
    },
  },
  { timestamps: true }
);

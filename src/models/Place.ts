import type { OpenHours } from "./OpenHours";
import type { Service } from "./Service";

export interface Place {
  placeId: number;
  placeTypeId: number;
  name: string;
  lat: number;
  lng: number;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  ownerName: string;
  phone: string;
  openHours: OpenHours[];
  services: Service[];
}

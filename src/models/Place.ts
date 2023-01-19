import type { OpenHours } from "./OpenHours";
import type { Service } from "./Service";

export interface Place {
  id: number;
  place_type_id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  owner: string;
  phone: string;
  openHours: { [day: string]: OpenHours | null };
  services: Service[];
}

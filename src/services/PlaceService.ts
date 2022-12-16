import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";
import { reactive } from "vue";
import L from "leaflet";

import places from "./places.json";
import placeTypes from "./placeTypes.json";
import { store } from "@/state/store";

interface PlaceService {
  populated: boolean;
  places: { [key: number]: Place };
  placeTypes: { [key: number]: PlaceType };

  /** Get all places */
  getPlaces(): Place[];

  /** Get place by ID */
  getPlaceById(id: number): Place;

  /** Get places in <radius(m)> of  point[lat, lng] */
  getPlacesByRadius(lat: number, lng: number, radius: number): Place[];

  /** Get all places types */
  getTypes(): PlaceType[];

  /** Get type by ID */
  getTypeById(id: number): PlaceType;

  toggleTypeSelection(placeTypeId: number): void;

  selectPlace(place: Place): void;
}

export const placeService: PlaceService = reactive({
  populated: false,
  places: {},
  placeTypes: {},

  getPlaces() {
    const places: Place[] = [];
    for (const key in this.places) {
      places.push(this.places[key]);
    }
    return places;
  },

  getPlaceById(id) {
    return this.places[id];
  },

  getPlacesByRadius(lat, lng, radius) {
    const places: Place[] = [];
    const center: L.LatLng = new L.LatLng(lat, lng);
    for (const key in this.places) {
      const place = this.places[key];
      const dist = center.distanceTo([place.lat, place.lng]);
      if (dist <= radius) {
        places.push(place);
      }
    }
    return places;
  },

  getTypes() {
    const placeTypes: PlaceType[] = [];
    for (const placeTypeId in this.placeTypes) {
      placeTypes.push(this.placeTypes[placeTypeId]);
    }
    return placeTypes;
  },

  getTypeById(id) {
    return this.placeTypes[id];
  },

  toggleTypeSelection(placeTypeId) {
    this.placeTypes[placeTypeId].selected =
      !this.placeTypes[placeTypeId].selected;
  },

  selectPlace(place) {
    store.selectedPlace = place;
    store.hideSearchInterface = true;
  },
} as PlaceService);

if (!placeService.populated) {
  places.forEach((place) => {
    placeService.places[place.placeId] = place;
  });
  placeTypes.forEach((placeType) => {
    placeService.placeTypes[placeType.placeTypeId] = placeType;
  });
  placeService.populated = true;
}

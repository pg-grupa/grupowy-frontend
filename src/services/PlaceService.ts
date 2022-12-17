import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";
import { reactive } from "vue";
import L from "leaflet";

import placesJson from "./places.json";
import placeTypesJson from "./placeTypes.json";
import { Mode, store } from "@/state/store";
import { mapService } from "./MapService";

interface PlaceService {
  populated: boolean;
  places: { [key: number]: Place };
  placeTypes: { [key: number]: PlaceType };

  /** Get all places */
  getPlaces(): Place[];

  /** Get place by ID */
  getPlaceById(id: number): Place;

  getPlacesByType(placeType: PlaceType): Place[];

  /** Get places in <radius(m)> of  point[lat, lng] */
  getPlacesByRadius(lat: number, lng: number, radius: number): Place[];

  /** Get all places types */
  getTypes(): PlaceType[];

  /** Get type by ID */
  getTypeById(id: number): PlaceType;

  toggleTypeSelection(placeTypeId: number): void;

  selectPlace(place: Place): void;
  clearSelection(): void;

  showPlaceInfo(): void;

  hidePlaceInfo(): void;

  getFilteredTypes(): PlaceType[];
  getFilteredPlaces(): Place[];
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

  getPlacesByType(placeType) {
    const places: Place[] = [];
    for (const key in this.places) {
      const place = this.places[key];
      if (place.placeTypeId == placeType.placeTypeId) {
        places.push(place);
      }
    }
    return places;
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
    mapService.clearMarkers();
    mapService.addMarkers(this.getFilteredPlaces());
  },

  selectPlace(place) {
    store.selectedPlace = place;
    store.selectedPlaceType = this.getTypeById(place.placeTypeId);
    if (store.appMode == Mode.Search) {
      store.appMode = Mode.Info;
    }
  },

  clearSelection() {
    store.selectedPlace = null;
    store.selectedPlaceType = null;
    if (store.appMode == Mode.Info) this.hidePlaceInfo();
  },

  showPlaceInfo() {
    if (store.selectedPlace && store.appMode == Mode.Search) {
      store.appMode = Mode.Info;
    }
  },

  hidePlaceInfo() {
    if (store.appMode == Mode.Info) store.appMode = Mode.Search;
  },

  getFilteredTypes() {
    const placeTypes: PlaceType[] = [];
    for (const placeTypeId in this.placeTypes) {
      if (this.placeTypes[placeTypeId].selected)
        placeTypes.push(this.placeTypes[placeTypeId]);
    }
    return placeTypes;
  },

  getFilteredPlaces() {
    let places: Place[] = [];
    const placeTypes = this.getFilteredTypes();
    if (placeTypes.length == 0) return this.getPlaces();
    placeTypes.forEach((placeType) => {
      const temp_places = this.getPlacesByType(placeType);
      places = places.concat(temp_places);
    });
    return places;
  },
} as PlaceService);

if (!placeService.populated) {
  placesJson.forEach((place) => {
    placeService.places[place.placeId] = place;
  });
  placeTypesJson.forEach((placeType) => {
    placeService.placeTypes[placeType.placeTypeId] = placeType;
  });
  placeService.populated = true;
}

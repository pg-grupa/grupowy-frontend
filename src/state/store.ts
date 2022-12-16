import { reactive } from "vue";
import type { PlaceMarker } from "@/models/PlaceMarker";
import type { PlaceType } from "@/models/PlaceType";
import type { Place } from "@/models/Place";
import places from "./places.json";
import placeTypes from "./placeTypes.json";

interface State {
  selectedPlace: Place | null;
  hideSearchInterface: Boolean;
  places: { [key: number]: Place };
  placeTypes: { [key: number]: PlaceType };
}

export const store: State = reactive({
  selectedPlace: null,
  hideSearchInterface: false,
  places: {},
  placeTypes: {},
});

export const populate = () => {
  places.forEach((place) => {
    store.places[place.placeId] = place;
  });
  placeTypes.forEach((placeType) => {
    store.placeTypes[placeType.placeTypeId] = placeType;
  });
  // console.log(store.placeTypes);
};

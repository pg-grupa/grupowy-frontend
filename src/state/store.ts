import { reactive } from "vue";
import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";

export enum Mode {
  Loading,
  FreeMove,
  Search,
  Filter,
  Info,
  Navigation,
}

interface State {
  appMode: Mode;
  appModeStack: Mode[];
  selectedPlace: Place | null;
  selectedPlaceType: PlaceType | null;
  selectedFilterType: PlaceType | null;
  placeTypes: PlaceType[];
  loadedPlaces: Place[];
  routeStart: [number, number] | null;
  routeEnd: [number, number] | null;
  myLocation: [number, number] | null;
}

export const store: State = reactive({
  appMode: Mode.Loading,
  appModeStack: [],
  selectedPlace: null,
  selectedPlaceType: null,
  selectedFilterType: null,
  placeTypes: [],
  loadedPlaces: [],
  routeStart: null,
  routeEnd: null,
  myLocation: null,
});

export function changeMode(mode: Mode) {
  store.appModeStack.push(store.appMode);
  store.appMode = mode;
}

export function exitMode() {
  const mode = store.appModeStack.pop() || Mode.FreeMove;
  store.appMode = mode;
}

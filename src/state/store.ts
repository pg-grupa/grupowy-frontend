import { reactive } from "vue";
import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";
import type AdvancedSearchOptions from "@/interfaces/AdvancedSearchOptions";
import type NavPoint from "@/interfaces/NavPoint";

export enum Mode {
  Loading,
  FreeMove,
  Search,
  Filter,
  Info,
  NavigationSetup,
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
  routeStart: NavPoint | null;
  routeEnd: NavPoint | null;
  myLocation: [number, number] | null;
  advancedSearchQuery: string;
  advancedSearchOptions: AdvancedSearchOptions | null;
}

export const store: State = reactive({
  appMode: Mode.Loading,
  appModeStack: [],
  myLocation: null,
  selectedPlace: null,
  selectedPlaceType: null,
  selectedFilterType: null,
  placeTypes: [],
  loadedPlaces: [],
  routeStart: null,
  routeEnd: null,
  advancedSearchQuery: "",
  advancedSearchOptions: null,
});

export function changeMode(mode: Mode) {
  store.appModeStack.push(store.appMode);
  store.appMode = mode;
}

export function exitMode() {
  const mode = store.appModeStack.pop() || Mode.FreeMove;
  store.appMode = mode;
}

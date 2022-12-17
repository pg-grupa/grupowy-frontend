import { reactive } from "vue";
import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";

interface State {
  appMode: Mode;
  selectedPlace: Place | null;
  selectedPlaceType: PlaceType | null;
}

export enum Mode {
  Search,
  Info,
  Navigation,
}

export const store: State = reactive({
  appMode: Mode.Search,
  selectedPlace: null,
  selectedPlaceType: null,
});

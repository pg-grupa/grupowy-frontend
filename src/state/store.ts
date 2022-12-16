import { reactive } from "vue";
import type { Place } from "@/models/Place";

interface State {
  selectedPlace: Place | null;
  hideSearchInterface: Boolean;
}

export const store: State = reactive({
  selectedPlace: null,
  hideSearchInterface: false,
});

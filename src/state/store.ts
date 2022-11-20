import { reactive } from "vue";
import type { PlaceMarker } from "@/models/PlaceMarker";

interface State {
  placeMarkers: PlaceMarker[];
}

export const store: State = reactive({
  placeMarkers: [
    {
      placeId: 1,
      lat: 54.352024,
      lng: 18.646639,
      name: "ACO Wiesiek",
      icon: "wrench",
    },
  ],
});

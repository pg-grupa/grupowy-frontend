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
      icon: "fa-wrench",
    },
    {
      placeId: 2,
      lat: 54.372324,
      lng: 18.646649,
      name: "Fryzjer Jolanta",
      icon: "fa-scissors",
    },
  ],
});

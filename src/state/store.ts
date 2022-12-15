import { reactive } from "vue";
import type { PlaceMarker } from "@/models/PlaceMarker";
import type { PlaceType } from "@/models/PlaceType";

interface State {
  hideSearchInterface: Boolean;
  placeMarkers: PlaceMarker[];
  placeTypes: PlaceType[];
}

export const store: State = reactive({
  hideSearchInterface: false,
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
  placeTypes: [
    {
      typeId: 1,
      name: "Księgarnia",
      icon: "fa-solid fa-book-bookmark",
      selected: false,
    },
    {
      typeId: 2,
      name: "Kwiaciarnia",
      icon: "fa-solid fa-fan",
      selected: false,
    },
    {
      typeId: 3,
      name: "Restauracja",
      icon: "fa-solid fa-utensils",
      selected: false,
    },
    {
      typeId: 4,
      name: "Warsztat",
      icon: "fa-solid fa-wrench",
      selected: false,
    },
    {
      typeId: 5,
      name: "Bar",
      icon: "fa-solid fa-martini-glass-citrus",
      selected: false,
    },
    {
      typeId: 6,
      name: "Kawiarnia",
      icon: "fa-solid fa-mug-hot",
      selected: false,
    },
  ],
});

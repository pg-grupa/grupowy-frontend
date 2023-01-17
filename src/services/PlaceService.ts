import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";
import { reactive } from "vue";
import { Mode, store } from "@/state/store";
import { apiService } from "./ApiService";

class PlaceService {
  constructor() {
    // store.placeTypes = apiService.getTypes();
    apiService.getTypes((types: PlaceType[]) => {
      store.placeTypes = types;
      store.appMode = Mode.FreeMove;
    });
  }

  getTypeById(id: number) {
    return store.placeTypes.find((p) => p.id === id);
  }

  selectPlace(place: Place) {
    store.selectedPlaceType = this.getTypeById(place.place_type_id)!;
    apiService.getPlaceById((data) => {
      store.selectedPlace = data;
    }, place.id);
    // if (store.appMode == Mode.Search) {
    //   store.appMode = Mode.Info;
    // }
  }

  clearSelection() {
    store.selectedPlace = null;
    store.selectedPlaceType = null;
  }

  toggleTypeSelection(placeType: PlaceType) {
    if (store.selectedFilterType === placeType) store.selectedFilterType = null;
    else store.selectedFilterType = placeType;
  }
}

export const placeService: PlaceService = reactive(new PlaceService());

import type { Map, LayerGroup } from "leaflet";
import L from "leaflet";
import { reactive } from "vue";
import type { Ref } from "vue";
import type { Place } from "@/models/Place";
import { store } from "@/state/store";

interface MapState {
  map: Map | undefined;
  marksGroup: LayerGroup | undefined;
}

// map and marks singleton
export const mapState: MapState = reactive({
  map: undefined,
  marksGroup: undefined,
});

/**
 *  Initialize Map object and Marks LayerGroup
 * */
export const initMap = (
  mapContainer: Ref<any>,
  center: [number, number],
  zoom: number
) => {
  const map = L.map(mapContainer.value, { zoomControl: false });
  map.addLayer(
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  );
  map.setView(center, zoom);
  mapState.map = map;

  const marksGroup: LayerGroup = L.layerGroup().addTo(map);
  mapState.marksGroup = marksGroup;
  return { map, marksGroup };
};

export const clearMarkers = () => {
  mapState.marksGroup?.clearLayers();
};

export const addMarkers = (places: Place[]) => {
  places.forEach((place) => {
    // create icon for marker
    const iconName = store.placeTypes[place.placeTypeId].icon;
    const icon = new L.ExtraMarkers.Icon({
      icon: iconName,
      markerColor: "cyan",
      prefix: "fa",
    });

    // create marker
    const marker = L.marker([place.lat, place.lng], { icon: icon });
    marker.bindTooltip(place.name, {
      offset: [15, -22.5],
      permanent: true,
    });

    // add marker to LayerGroup
    mapState.marksGroup?.addLayer(marker);
  });
};

export const addMarkersDict = (places: { [key: number]: Place }) => {
  for (const key in places) {
    const place = store.places[key];
    // create icon for marker
    const iconName = store.placeTypes[place.placeTypeId].icon;
    const icon = new L.ExtraMarkers.Icon({
      icon: iconName,
      markerColor: "cyan",
      prefix: "fa",
    });

    // create marker
    const marker = L.marker([place.lat, place.lng], { icon: icon });
    marker.bindTooltip(place.name, {
      offset: [15, -22.5],
      permanent: true,
    });

    // add marker to LayerGroup
    mapState.marksGroup?.addLayer(marker);
  }
};

export const setView = (center: [number, number], zoom: number) => {
  mapState.map?.setView(center, zoom);
};

import type { Map, LayerGroup } from "leaflet";
import L from "leaflet";
import { reactive } from "vue";
import type { Ref } from "vue";
import type { PlaceMarker } from "@/models/PlaceMarker";

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

export const addMarkers = (placeMarkers: PlaceMarker[]) => {
  placeMarkers.forEach((placeMarker) => {
    // create icon for marker
    const icon = new L.ExtraMarkers.Icon({
      icon: placeMarker.icon,
      markerColor: "cyan",
      prefix: "fa",
    });

    // create marker
    const marker = L.marker([placeMarker.lat, placeMarker.lng], { icon: icon });
    marker.bindTooltip(placeMarker.name, {
      offset: [15, -22.5],
      permanent: true,
    });

    // add marker to LayerGroup
    mapState.marksGroup?.addLayer(marker);
  });
};

export const setView = (center: [number, number], zoom: number) => {
  mapState.map?.setView(center, zoom);
};

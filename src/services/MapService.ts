import type { Map, LayerGroup } from "leaflet";
import L from "leaflet";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers";
import { reactive } from "vue";
import type { Ref } from "vue";
import type { Place } from "@/models/Place";
import { placeService } from "./PlaceService";

interface MapService {
  center: [number, number];
  zoom: number;
  radius: number;
  map: any;
  markersGroup: any;

  /** Initialize Map object and Marks LayerGroup */
  initMap(mapContainer: Ref<any>): void;
  addMarkers(places: Place[]): void;
  clearMarkers(): void;
  setView(center: [number, number], zoom: number): void;
}

// map and marks singleton
export const mapService: MapService = reactive({
  center: [54.352024, 18.646639],
  zoom: 12,
  radius: 50000,
  map: undefined,
  markersGroup: undefined,

  initMap(mapContainer) {
    const map = L.map(mapContainer.value, { zoomControl: false });
    map.addLayer(
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    );
    map.setView(this.center, this.zoom);
    this.map = map;

    const markersGroup: LayerGroup = L.layerGroup().addTo(map);
    mapService.markersGroup = markersGroup;

    const places = placeService.getPlacesByRadius(
      mapService.center[0],
      mapService.center[1],
      mapService.radius
    );
    // const places = placeService.getPlaces();
    this.addMarkers(places);
  },

  addMarkers(places) {
    places.forEach((place) => {
      // create icon for marker
      // TODO: create icons for per type (not per marker) and reuse them
      // TODO: make 2 sets for selected and unselected markers
      const iconName = placeService.getTypeById(place.placeTypeId).icon;
      const icon = new L.ExtraMarkers.Icon({
        icon: iconName,
        markerColor: "cyan",
        prefix: "fa",
      });

      // create marker
      const marker = L.marker([place.lat, place.lng], { icon: icon }).on(
        "click",
        () => {
          // TODO: change marker icon on selection
          placeService.selectPlace(place);
        }
      );
      marker.bindTooltip(place.name, {
        offset: [15, -22.5],
        permanent: true,
      });

      // add marker to LayerGroup
      mapService.markersGroup?.addLayer(marker);
    });
  },

  clearMarkers() {
    mapService.markersGroup?.clearLayers();
  },

  setView(center, zoom) {
    mapService.map?.setView(center, zoom);
  },
} as MapService);

import type { Map, LayerGroup, LatLng } from "leaflet";
import L from "leaflet";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { reactive } from "vue";
import type { Ref } from "vue";
import type { Place } from "@/models/Place";
import { placeService } from "./PlaceService";
import { Mode, store } from "@/state/store";

interface MapService {
  center: [number, number];
  zoom: number;
  radius: number;
  map: any;
  markersGroup: any;
  routingControl: any;

  /** Initialize Map object and Marks LayerGroup */
  initMap(mapContainer: Ref<any>): void;
  addMarkers(places: Place[]): void;
  clearMarkers(): void;
  startRoute(start: [number, number], stop: [number, number]): void;
  startFromGeoLocation(stop: [number, number]): void;
  stopNavigation(): void;
  setView(center: [number, number], zoom: number): void;
}

// map and marks singleton
export const mapService: MapService = reactive({
  center: [54.352024, 18.646639],
  zoom: 12,
  radius: 50000,
  map: null,
  markersGroup: null,
  routingControl: null,

  initMap(mapContainer) {
    const map = L.map(mapContainer.value, { zoomControl: false });
    map.addLayer(
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    );
    map.setView(this.center, this.zoom);
    this.map = map;

    const markersGroup: LayerGroup = L.layerGroup().addTo(map);
    this.markersGroup = markersGroup;

    const places = placeService.getPlacesByRadius(
      this.center[0],
      this.center[1],
      this.radius
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
      this.markersGroup?.addLayer(marker);
    });
  },
  clearMarkers() {
    this.markersGroup?.clearLayers();
  },

  startRoute(start, stop) {
    if (this.routingControl) this.map.removeControl(this.routingControl);
    store.appMode = Mode.Navigation;
    if (this.map.hasLayer(this.markersGroup))
      this.map.removeLayer(this.markersGroup);
    this.routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(stop[0], stop[1])],
      routeWhileDragging: true,
      lineOptions: {
        styles: [
          { color: "black", opacity: 0.15, weight: 9 },
          { color: "white", opacity: 0.8, weight: 6 },
          { color: "RoyalBlue", opacity: 1, weight: 5 },
        ],
      } as any,
    });
    this.map.addControl(this.routingControl);
  },

  stopNavigation() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
      this.map.addLayer(this.markersGroup);
      store.appMode = Mode.Info;
    }
  },

  startFromGeoLocation(stop) {
    navigator.geolocation.getCurrentPosition((position) => {
      const start: [number, number] = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      console.log(start);
      this.startRoute(start, stop);
    });
  },

  setView(center, zoom) {
    this.map?.setView(center, zoom);
  },
} as MapService);

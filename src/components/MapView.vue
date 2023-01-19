<script setup lang="ts">
import L, { FeatureGroup } from "leaflet";
import type { Map, LayerGroup, LatLng, LatLngBounds } from "leaflet";
import "leaflet-extra-markers";
import "leaflet-routing-machine";
import { onMounted, ref } from "vue";
import { Mode, store, changeMode, exitMode } from "@/state/store";
import { Api } from "@/services/ApiService";
import { placeService } from "@/services/PlaceService";
import SearchBar from "./Search/SearchBar.vue";
import PlaceInfo from "./PlaceInfo/PlaceInfo.vue";

const INIT_ZOOM: number = 12;
const INIT_CENTER: [number, number] = [54.352024, 18.646639];

let map!: Map;
let markersGroup!: FeatureGroup;
let routingControl: any = null;
const mapContainer = ref();
let fitting = false;

function clearMarkers() {
  markersGroup.clearLayers();
}

function drawMarkers() {
  const places = store.loadedPlaces;
  places.forEach((place) => {
    const iconName = placeService.getTypeById(place.place_type_id)!.icon;
    const icon = new L.ExtraMarkers.Icon({
      icon: iconName,
      markerColor: "cyan",
      prefix: "fa",
    });

    const marker = L.marker([place.latitude, place.longitude], { icon: icon });
    marker.bindTooltip(place.name, {
      offset: [15, -22.5],
    });
    marker.addTo(markersGroup);
    marker.on("click", () => {
      placeService.selectPlace(place);
    });
  });
}

function redrawMarkers() {
  clearMarkers();
  drawMarkers();
}

function fitToMarkers() {
  if (markersGroup.getLayers().length) {
    fitting = true;
    map.fitBounds(markersGroup.getBounds(), { paddingTopLeft: [400, 0] });
    fitting = false;
  }
}

function startNavigation() {
  const start = store.routeStart;
  const end = store.routeEnd;
  if (start && end) {
    if (routingControl) map.removeControl(routingControl);
    if (map.hasLayer(markersGroup)) map.removeLayer(markersGroup);
    routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: true,
      lineOptions: {
        styles: [
          { color: "black", opacity: 0.15, weight: 9 },
          { color: "white", opacity: 0.8, weight: 6 },
          { color: "RoyalBlue", opacity: 1, weight: 5 },
        ],
      } as any,
    });
    map.addControl(routingControl);
    changeMode(Mode.Navigation);
  }
}

function stopNavigation() {
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
    map.addLayer(markersGroup);
    exitMode();
  }
}

function onModeChange() {
  if (store.appMode == Mode.FreeMove) {
    clearMarkers();
    const bounds = map.getBounds();
    Api.getPlacesByBounds((places) => {
      store.loadedPlaces = places;
      if (places.length) {
        drawMarkers();
        fitToMarkers();
        // map.fitBounds(markersGroup.getBounds(), { paddingTopLeft: [400, 0] });
      }
    }, bounds);
  } else if (store.appMode == Mode.Filter) {
    clearMarkers();
    const bounds = map.getBounds();
    const options: { [key: string]: any } = {};
    if (store.selectedFilterType)
      options.serviceType = store.selectedFilterType.id;
    Api.getPlacesByBounds(
      (places) => {
        store.loadedPlaces = places;
        if (places.length) {
          drawMarkers();
          fitToMarkers();
          // map.fitBounds(markersGroup.getBounds(), { paddingTopLeft: [400, 0] });
        }
      },
      bounds,
      options
    );
  } else if (store.appMode == Mode.Search) {
    redrawMarkers();
    fitToMarkers();
  }
}

const onFilterChange = onModeChange;

function onBoundsChange() {
  if (store.appMode == Mode.FreeMove) {
    const bounds = map.getBounds();
    Api.getPlacesByBounds((places) => {
      store.loadedPlaces = places;
      redrawMarkers();
    }, bounds);
  } else if (store.appMode == Mode.Filter) {
    const bounds = map.getBounds();
    const options: { [key: string]: any } = {};
    if (store.selectedFilterType)
      options.serviceType = store.selectedFilterType.id;
    Api.getPlacesByBounds(
      (places) => {
        store.loadedPlaces = places;
        redrawMarkers();
      },
      bounds,
      options
    );
  }
}

function changeView(center: [number, number], zoom: number = 17) {
  map.setView(center, zoom);
  onBoundsChange();
}

// const startFromGeoLocation = (stop: [number, number]) => {
//   navigator.geolocation.getCurrentPosition((position) => {
//     const start: [number, number] = [
//       position.coords.latitude,
//       position.coords.longitude,
//     ];
//     console.log(start);
//     startRoute(start, stop);
//   });
// };

onMounted(() => {
  // mapService.initMap(mapContainer);
  map = L.map(mapContainer.value, { zoomControl: false });
  map.addLayer(
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  );
  map.setView(INIT_CENTER, INIT_ZOOM);

  markersGroup = L.featureGroup().addTo(map);

  map.on("moveend zoomend", () => {
    if (!fitting) {
      onBoundsChange();
    }
  });

  onBoundsChange();
});
</script>
<template>
  <div>
    <!-- <search-bar /> -->
    <div class="map-container" ref="mapContainer"></div>
    <search-bar
      @mode-changed="onModeChange"
      @filter-changed="onFilterChange"
      @change-view="changeView"
    />
    <place-info v-if="store.selectedPlace" />
  </div>
</template>
<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
}
</style>

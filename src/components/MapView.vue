<script setup lang="ts">
import L, { FeatureGroup, Marker } from "leaflet";
import type { Map, LayerGroup, LatLng, LatLngBounds } from "leaflet";
import "leaflet-extra-markers";
import "leaflet-routing-machine";
import { onMounted, ref } from "vue";
import { Mode, store, changeMode, exitMode } from "@/state/store";
import { Api } from "@/services/ApiService";
import { placeService } from "@/services/PlaceService";
import SearchBar from "./Search/SearchBar.vue";
import PlaceInfo from "./PlaceInfo/PlaceInfo.vue";
import NavSetup from "./Navigation/NavSetup.vue";

const INIT_ZOOM: number = 15;
const INIT_CENTER: [number, number] = [54.352024, 18.646639];

let map!: Map;
let markersGroup!: FeatureGroup;
let myLocationMarker: Marker | undefined;
let routeStartMarker: Marker | undefined;
let routeEndMarker: Marker | undefined;
let routingControl: any = null;
const mapContainer = ref();
let fitting = false;

function clearMarkers() {
  markersGroup.clearLayers();
  if (myLocationMarker && map.hasLayer(myLocationMarker))
    map.removeLayer(myLocationMarker);

  if (routeStartMarker && map.hasLayer(routeStartMarker))
    map.removeLayer(routeStartMarker);

  if (routeEndMarker && map.hasLayer(routeEndMarker))
    map.removeLayer(routeEndMarker);
}

function drawMyLocationMarker() {
  if (store.myLocation) {
    if (!myLocationMarker) {
      const icon = new L.ExtraMarkers.Icon({
        icon: "fa-location-crosshairs",
        markerColor: "black",
        prefix: "fa",
      });
      myLocationMarker = L.marker([store.myLocation[0], store.myLocation[1]], {
        icon: icon,
      });
    }
    if (myLocationMarker) {
      map.addLayer(myLocationMarker);
    }
  }
}

function createStartMarker(
  location: [number, number] | LatLng,
  color: L.ExtraMarkers.IconOptions["markerColor"] = "green"
) {
  const icon = new L.ExtraMarkers.Icon({
    icon: "fa-location-crosshairs",
    markerColor: color,
    prefix: "fa",
  });
  return L.marker(location, {
    icon: icon,
  });
}

function createEndMarker(
  location: [number, number] | LatLng,
  color: L.ExtraMarkers.IconOptions["markerColor"] = "red"
) {
  const icon = new L.ExtraMarkers.Icon({
    icon: "fa-flag-checkered",
    markerColor: color,
    prefix: "fa",
  });
  return L.marker(location, {
    icon: icon,
  });
}

function drawRouteMarkers() {
  clearMarkers();
  // console.log("markers cleared");

  if (store.routeStart) {
    // const icon = new L.ExtraMarkers.Icon({
    //   icon: "fa-circle",
    //   markerColor: "green",
    //   prefix: "fa",
    // });
    // routeStartMarker = L.marker(
    //   [store.routeStart.location[0], store.routeStart.location[1]],
    //   {
    //     icon: icon,
    //   }
    // );
    routeStartMarker = createStartMarker(store.routeStart.location);
    map.addLayer(routeStartMarker);
  }
  // console.log(store.routeEnd);
  if (store.routeEnd) {
    // const icon = new L.ExtraMarkers.Icon({
    //   icon: "fa-flag-checkered",
    //   markerColor: "red",
    //   prefix: "fa",
    // });
    // routeEndMarker = L.marker(
    //   [store.routeEnd.location[0], store.routeEnd.location[1]],
    //   {
    //     icon: icon,
    //   }
    // );
    routeEndMarker = createEndMarker(store.routeEnd.location);
    map.addLayer(routeEndMarker);
  }

  if (store.routeStart && store.routeEnd) {
    fitting = true;
    const bounds = L.latLngBounds(
      store.routeStart.location,
      store.routeEnd.location
    );
    map.fitBounds(bounds, { paddingTopLeft: [450, 100] });
  }
}

function drawMarkers() {
  // console.log("drawing markers");
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
  drawMyLocationMarker();
}

function redrawMarkers() {
  clearMarkers();
  drawMarkers();
}

function fitToMarkers() {
  if (markersGroup.getLayers().length) {
    fitting = true;
    map.fitBounds(markersGroup.getBounds(), { paddingTopLeft: [450, 100] });
    fitting = false;
  }
}

function setupNavigation() {
  clearMarkers();
  changeMode(Mode.NavigationSetup);
}

function startNavigation() {
  const start = store.routeStart;
  const end = store.routeEnd;
  if (start && end) {
    if (routingControl) map.removeControl(routingControl);
    clearMarkers();
    routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.location[0], start.location[1]),
        L.latLng(end.location[0], end.location[1]),
      ],
      routeWhileDragging: true,
      show: false,
      createMarker: (i: number, waypoint: any, n: number) => {
        switch (i + 1) {
          case 1:
            return createStartMarker(waypoint.latLng, "blue");
          case n:
            return createEndMarker(waypoint.latLng, "red");
          default:
            return L.marker(waypoint.latLng);
        }
      },
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
    exitMode();
    onModeChange();
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
  } else if (store.appMode == Mode.NavigationSetup) {
    // console.log("Mode changed - navigation setup");

    drawRouteMarkers();
  }
}

const onFilterChange = onModeChange;

function onBoundsChange() {
  if (store.appMode == Mode.FreeMove) {
    // console.log("onBoundsChange - free move");
    const bounds = map.getBounds();
    Api.getPlacesByBounds((places) => {
      store.loadedPlaces = places;
      redrawMarkers();
    }, bounds);
  } else if (store.appMode == Mode.Filter) {
    // console.log("onBoundsChange - filter");
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
  // map.setView(center, zoom);
  // map.panInside(center, { paddingTopLeft: [450, 100] });
  map.flyTo(center, zoom);
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

  map.on("moveend", () => {
    if (!fitting) {
      onBoundsChange();
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      store.myLocation = [position.coords.latitude, position.coords.longitude];
      onBoundsChange();
    });
  }

  onBoundsChange();
});
</script>
<template>
  <div>
    <!-- <search-bar /> -->
    <div class="map-container" ref="mapContainer"></div>
    <template
      v-if="
        store.appMode != Mode.Navigation &&
        store.appMode != Mode.NavigationSetup
      "
    >
      <search-bar
        @mode-changed="onModeChange"
        @filter-changed="onFilterChange"
        @change-view="changeView"
      />
      <place-info v-if="store.selectedPlace" @setup-nav="setupNavigation" />
    </template>
    <nav-setup
      v-if="store.appMode == Mode.NavigationSetup"
      @mode-changed="onModeChange"
      @route-changed="drawRouteMarkers"
      @start-navigation="startNavigation"
    ></nav-setup>
    <button
      id="stopNav"
      @click="stopNavigation()"
      v-if="store.appMode == Mode.Navigation"
    >
      Zakończ
    </button>
  </div>
</template>
<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
}

#stopNav {
  position: fixed;
  left: 30px;
  top: 30px;
  font-size: 1.5rem;
  z-index: 3000;
}
</style>

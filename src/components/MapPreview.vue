<script setup lang="ts">
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, Map as LeafletMap } from "leaflet";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers";
import { onMounted, ref } from "vue";
import { store } from "@/state/store";

interface Props {
  center: LatLngExpression;
  zoom: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "move", value: LatLngExpression): void;
  (e: "moveend", value: LatLngExpression): void;
  (e: "zoom", value: Number): void;
}>();

const mapDiv = ref();

let map: LeafletMap | undefined;

onMounted(() => {
  map = L.map(mapDiv.value);

  map.addLayer(
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  );

  store.placeMarkers.forEach((placeMarker) => {
    const icon = new L.ExtraMarkers.Icon({
      icon: placeMarker.icon,
      markerColor: "cyan",
      prefix: "fa",
    });

    const marker = L.marker([placeMarker.lat, placeMarker.lng], { icon: icon });
    marker.bindTooltip(placeMarker.name, {
      offset: [15, -22.5],
      permanent: true,
    });

    map!.addLayer(marker);
  });

  map.setView(props.center, props.zoom);

  map.on("move", () => emit("move", map?.getCenter() ?? [0, 0]));
  map.on("moveend", () => emit("moveend", map?.getCenter() ?? [0, 0]));
  map.on("zoom", () => emit("zoom", map?.getZoom() ?? 0));
});
</script>

<template>
  <div ref="mapDiv"></div>
</template>

<style scoped></style>

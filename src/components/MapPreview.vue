<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import leaflet, { LatLngExpression, Map as LeafletMap } from "leaflet";
import { onMounted, ref } from "vue";

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

let map: LeafletMap | null;

onMounted(() => {
  map = leaflet.map(mapDiv.value);

  map.addLayer(
    leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  );

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

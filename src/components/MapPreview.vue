<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import leaflet, { LatLngExpression, Map as LeafletMap } from "leaflet";
import { onMounted, reactive, ref } from "vue";

interface Props {
  center: LatLngExpression;
  zoom: number;
}

interface State {
  map: LeafletMap | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:center", value: LatLngExpression): void;
  (e: "update:zoom", value: Number): void;
}>();

const mapDiv = ref();
const state: State = reactive({
  map: null,
});

onMounted(() => {
  state.map = leaflet.map(mapDiv.value);

  state.map.addLayer(
    leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  );

  state.map.setView(props.center, props.zoom);

  state.map.on("moveend", () =>
    emit("update:center", state.map?.getCenter() ?? [0, 0])
  );
  state.map.on("zoomend", () => emit("update:zoom", state.map?.getZoom() ?? 0));
});
</script>

<template>
  <div ref="mapDiv"></div>
</template>

<style scoped></style>

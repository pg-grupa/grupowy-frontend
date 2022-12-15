<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as MapService from "@/state/map-service";
import { store } from "@/state/store";

const mapContainer = ref();

onMounted(() => {
  MapService.initMap(mapContainer, [54.372158, 18.638306], 12);
  MapService.addMarkers(store.placeMarkers);
});
</script>
<template>
  <div class="map-container" ref="mapContainer"></div>
</template>
<style scoped></style>

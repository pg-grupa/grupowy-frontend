<script setup lang="ts">
import { store, populate } from "@/state/store";
import { onMounted, ref } from "vue";
import * as MapService from "@/services/map-service";

const mapContainer = ref();

onMounted(() => {
  populate();
  MapService.initMap(mapContainer, [54.372158, 18.638306], 12);
  MapService.addMarkersDict(store.places);
});
</script>
<template>
  <div class="map-container" ref="mapContainer"></div>
</template>
<style scoped></style>

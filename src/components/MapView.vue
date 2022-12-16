<script setup lang="ts">
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers";
import { onMounted, ref } from "vue";
import { mapService } from "@/services/MapService";

const mapContainer = ref();

onMounted(() => {
  mapService.initMap(mapContainer);
});
</script>
<template>
  <div class="map-container" ref="mapContainer"></div>
</template>
<style scoped></style>

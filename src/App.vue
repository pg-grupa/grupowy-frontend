<script setup lang="ts">
import MapPreview from "@/components/MapPreview.vue";
import SearchBar from "@/components/SearchBar.vue";
import MapView from "@/components/MapView.vue";
import type { LatLngExpression } from "leaflet";

function onMove(center: LatLngExpression) {
  console.log(center);
}
</script>

<template>
  <search-bar />
  <map-view id="map" />
</template>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>

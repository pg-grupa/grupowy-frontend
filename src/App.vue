<script setup lang="ts">
import MapPreview from "@/components/MapPreview.vue";
import SearchBar from "@/components/SearchBar.vue";
import type { LatLngExpression } from "leaflet";

function onMove(center: LatLngExpression) {
  console.log(center);
}
</script>

<template plate>
  <search-bar />
  <map-preview
    id="map"
    :center="[54.372158, 18.638306]"
    :zoom="12"
    @moveend="onMove"
  />
</template>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>

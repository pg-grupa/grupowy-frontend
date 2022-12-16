<script setup lang="ts">
// import MapPreview from "@/components/MapPreview.vue";
import SearchBar from "@/components/SearchBar.vue";
import MapView from "@/components/MapView.vue";
import PlaceInfo from "@/components/PlaceInfo.vue";
import { store } from "./state/store";
</script>

<template>
  <search-bar />
  <map-view id="map" />
  <place-info v-if="store.selectedPlace" />
</template>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>

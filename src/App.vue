<script setup lang="ts">
// import MapPreview from "@/components/MapPreview.vue";
import MapView from "@/components/MapView.vue";
import { Mode, store } from "./state/store";
</script>

<template>
  <map-view id="map" v-if="store.appMode != Mode.Loading" />
</template>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>

<script setup lang="ts">
import MapPreview from "@/components/MapPreview.vue";
import { reactive } from "vue";

const state = reactive({
  center: [54.372158, 18.638306],
  zoom: 12,
});
</script>

<template>
  <map-preview
    id="map"
    v-model:center="state.center"
    v-model:zoom="state.zoom"
  />
</template>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>

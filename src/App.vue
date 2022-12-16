<script>
import MapPreview from "@/components/MapPreview.vue";

import LRoutingMachine from "@/components/LRoutingMachine.vue";

import SearchBar from "@/components/SearchBar.vue";
import MapView from "@/components/MapView.vue";

import type { LatLngExpression } from "leaflet";
import { onMounted } from "vue";

function onMove(center: LatLngExpression) {
  console.log(center);
}
</script>
<template>

  <search-bar />
  <map-view id="map" />

</template>

<script>
  export default {
    data(){
      mapObject: null
    },
    mounted(){
      this.mapObject = L.map(mapDiv.value)
    }
  }
</script>

<style scoped>y
#map {
  width: 100vw;
  height: 100vh;
}
</style>

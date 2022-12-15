<script>
import MapPreview from "@/components/MapPreview.vue";
import LRoutingMachine from "@/components/LRoutingMachine.vue";
import type { LatLngExpression } from "leaflet";
import { onMounted } from "vue";

function onMove(center: LatLngExpression) {
  console.log(center);
}
</script>
<template>
  <div>
    <map-preview
      id="map"
      :center="[54.372158, 18.638306]"
      :zoom="12"
      @moveend="onMove"
    />
    <LRoutingMachine/>
  </div>
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

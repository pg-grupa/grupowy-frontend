
<template>
  <div id="app">
    <div :id="mapId" class="map"></div>
    <LRoutingMachine :mapObject="mapObject" :waypoints="waypoints" />
  </div>
</template>

<script>
import LRoutingMachine from "./components/LRoutingMachine.vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const waypoints = [
  { lat: 54.352024, lng: 18.646639 },
  { lat: 54.372324, lng: 18.646649 },
];

export default {
  components: {
    LRoutingMachine,
  },
  data() {
    return {
      mapId: "map",
      mapObject: null,
      zoom: 6,
      center: { lat: 54.352024, lng: 18.646639},
      osmUrl: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      waypoints,
    };
  },
  mounted() {
    this.mapObject = L.map(this.mapId, {
      zoom: this.zoom,
      center: this.center,
    });

    L.tileLayer(this.osmUrl, {
      attribution: this.attribution,
    }).addTo(this.mapObject);
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

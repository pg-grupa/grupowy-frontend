<script>
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import { IRouter, IGeocoder, LineOptions } from "leaflet-routing-machine";

export default {
  name: "LRoutingMachine",
  props: {
    mapObject:Object 
  },
  data() {
    
    return {
        waypoints:[
        { lat: 54.352024, lng: 18.646639 },
        { lat: 54.372324, lng: 18.646649 },
        ],
      ready: false,
      mapObject: null,
      map: null,
      layer: null,
    };
  },
  watch: {
    mapObject() {
      if (this.mapObject == null) {
        return;
      }
      this.add();
    },
  },
  mounted() {
    this.add();
    this.mapObject = L.map("map", {
      zoom: this.zoom,
      center: this.center,
    });
  },
  beforeUnmount() {
    return this.layer ? this.layer.remove() : null;
  },
  methods: {
    add() {
      if (this.mapObject == null) {
        return;
      }
      const {
        waypoints,
        fitSelectedRoutes,
        autoRoute,
        routeWhileDragging,
        routeDragInterval,
        waypointMode,
        useZoomParameter,
        showAlternatives,
      } = this;

      const options = {
        waypoints,
        fitSelectedRoutes,
        autoRoute,
        routeWhileDragging,
        routeDragInterval,
        waypointMode,
        useZoomParameter,
        showAlternatives,
      };

      const routingLayer = L.Routing.control(options);
      routingLayer.addTo(this.mapObject);
      this.layer = routingLayer;

      this.ready = true;
    },
  },
};
</script>
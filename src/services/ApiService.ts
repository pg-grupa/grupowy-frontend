import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";
import { reactive } from "vue";
import type L from "leaflet";
import axios from "axios";

import placesJson from "./places.json";
import placeTypesJson from "./placeTypes.json";
import { Mode, store } from "@/state/store";

const API_URL = "http://localhost/api/v1/";

interface ApiService {
  populated: boolean;
  places: { [key: number]: Place };
  placeTypes: { [key: number]: PlaceType };

  getPlaceServices(id: number): any;
  getPlaceDetails(id: number): any;

  /** Get place by ID */
  getPlaceById(callback: (place: Place) => any, id: number): Place;

  getPlacesByType(placeType: PlaceType): Place[];

  /** Get places in <radius(m)> of  point[lat, lng] */
  // getPlacesByRadius(lat: number, lng: number, radius: number): Place[];

  getPlacesByBounds(
    callback: (places: Place[]) => any,
    bounds: L.LatLngBounds,
    options?: { [key: string]: any }
  ): any;

  /** Get all places types */
  getTypes(callback: (placeTypes: PlaceType[]) => any): void;

  /** Get type by ID */
  // getTypeById(id: number): PlaceType;
}

export const apiService: ApiService = reactive({
  populated: false,
  places: {},
  placeTypes: {},

  // getPlaces() {
  //   const places: Place[] = [];
  //   for (const key in this.places) {
  //     places.push(this.places[key]);
  //   }
  //   return places;
  // },
  getPlaceServices(id) {
    const url = `${API_URL}place/${id}/services`;
    return axios.get(url);
  },

  getPlaceDetails(id) {
    const url = `${API_URL}place/${id}/details`;
    return axios.get(url);
  },

  getPlaceById(callback, id) {
    // const url = `${API_URL}place/${id}/details`;
    Promise.all([this.getPlaceDetails(id), this.getPlaceServices(id)])
      .then((response) => {
        const place: Place = response[0].data;
        place.services = response[1].data;
        callback(place);
      })
      .catch(console.error);
  },

  // getPlacesByType(placeType) {
  //   const places: Place[] = [];
  //   for (const key in this.places) {
  //     const place = this.places[key];
  //     if (place.place_type_id == placeType.id) {
  //       places.push(place);
  //     }
  //   }
  //   return places;
  // },

  getPlacesByBounds(callback, bounds, options) {
    const lat1 = bounds.getSouth();
    const lng1 = bounds.getEast();
    const lat2 = bounds.getNorth();
    const lng2 = bounds.getWest();
    let url = `${API_URL}places?lat1=${lat1}&lat2=${lat2}&lng1=${lng1}&lng2=${lng2}`;
    for (const option in options) {
      url += `&${option}=${options[option]}`;
    }
    axios
      .get(url)
      .then((response) => {
        callback(response.data.data);
      })
      .catch((error) => console.error(error));
  },

  getTypes(callback) {
    axios
      .get(API_URL + "placeTypes")
      .then((response) => {
        callback(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  // getTypeById(id) {
  //   return this.placeTypes[id];
  // },
} as ApiService);

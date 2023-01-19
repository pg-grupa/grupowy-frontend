import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";
import type L from "leaflet";
import axios from "axios";
import { ref } from "vue";

axios.defaults.headers.get["Accept"] = "application/json";
const API_URL = "http://localhost/api/v1/";
const requestId = ref(0);

function getPlaceServices(id: number) {
  const url = `${API_URL}location/${id}/services`;
  console.debug(`[Api][${requestId.value++}] GET request: `, {
    method: "getPlaceServices",
    url: url,
  });
  return axios.get(url);
}

function getPlaceDetails(id: number) {
  const url = `${API_URL}location/${id}/details`;
  console.debug(`[Api][${requestId.value++}] GET request: `, {
    method: "getPlaceDetails",
    url: url,
  });
  return axios.get(url);
}

export namespace Api {
  export function getPlaceById(callback: (place: Place) => any, id: number) {
    Promise.all([getPlaceDetails(id), getPlaceServices(id)])
      .then((response) => {
        console.debug("[Server] Response [0]", response[0]);
        console.debug("[Server] Response [1]", response[1]);
        const place: Place = response[0].data;
        place.services = response[1].data;
        callback(place);
      })
      .catch(console.error);
  }

  export function getPlacesByBounds(
    callback: (places: Place[]) => any,
    bounds: L.LatLngBounds,
    options?: { [key: string]: any }
  ) {
    const lat1 = bounds.getSouth();
    const lng1 = bounds.getEast();
    const lat2 = bounds.getNorth();
    const lng2 = bounds.getWest();
    let url = `${API_URL}locations?lat1=${lat1}&lat2=${lat2}&lng1=${lng1}&lng2=${lng2}`;
    for (const option in options) {
      url += `&${option}=${options[option]}`;
    }
    console.debug(`[Api][${requestId.value++}] GET request: `, {
      method: "getPlacesByBounds",
      url: url,
    });
    axios
      .get(url)
      .then((response) => {
        console.debug("[Server] Response", response);
        callback(response.data);
      })
      .catch((error) => console.error(error));
  }

  export function getTypes(callback: (placeTypes: PlaceType[]) => any) {
    const url = API_URL + "serviceTypes";
    console.debug(`[Api][${requestId.value++}] GET request: `, {
      method: "getTypes",
      url: url,
    });
    axios
      .get(url)
      .then((response) => {
        console.debug("[Server] Response", response);
        callback(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  export function postComment(
    callback: () => any,
    data: { objectId: number; comment: string }
  ) {
    const config = {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };
    const url = API_URL + "comment";
    console.debug(`[Api][${requestId.value++}] POST request: `, {
      method: "postComment",
      url: url,
      data: data,
      config: config,
    });
    axios
      .post(url, data, config)
      .then((response) => {
        console.debug("[Server] Response", response);
        callback();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

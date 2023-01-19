import type { Place } from "@/models/Place";
import type { PlaceType } from "@/models/PlaceType";
import type L from "leaflet";
import axios from "axios";

axios.defaults.headers.get["Accept"] = "application/json";
const API_URL = "http://localhost/api/v1/";

function getPlaceServices(id: number) {
  const url = `${API_URL}location/${id}/services`;
  return axios.get(url);
}

function getPlaceDetails(id: number) {
  const url = `${API_URL}location/${id}/details`;
  return axios.get(url);
}

export namespace Api {
  export function getPlaceById(callback: (place: Place) => any, id: number) {
    Promise.all([getPlaceDetails(id), getPlaceServices(id)])
      .then((response) => {
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
    axios
      .get(url)
      .then((response) => {
        callback(response.data);
      })
      .catch((error) => console.error(error));
  }

  export function getTypes(callback: (placeTypes: PlaceType[]) => any) {
    axios
      .get(API_URL + "serviceTypes")
      .then((response) => {
        console.debug("ApiService.getTypes: ", response.data);
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
    axios
      .post(API_URL + "comment", data, config)
      .then((response) => {
        callback();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

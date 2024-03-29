<script setup lang="ts">
import { OpenStreetMapProvider } from "leaflet-geosearch";
import type { SearchResult } from "leaflet-geosearch/dist/providers/provider";
import { type Ref, ref, onMounted, onUnmounted } from "vue";
import { store } from "@/state/store";
import type { Place } from "@/models/Place";
import { Api } from "@/services/ApiService";
import L from "leaflet";
import type AdvancedSearchOptions from "@/interfaces/AdvancedSearchOptions";
import ListPin from "../Shared/ListPin.vue";
import { placeService } from "@/services/PlaceService";

const emit = defineEmits<{
  (e: "advancedFilterChanged"): void;
  (e: "changeView", center: [number, number]): void;
}>();

const startResults: Ref<SearchResult[] | null> = ref(null);
const showStartResults = ref(false);
const searchQuery = ref("");
const showResults = ref(false);
const searchResults: Ref<Place[] | null> = ref(null);

let timeout: number | undefined;

const options: Ref<AdvancedSearchOptions> = ref({
  searchCenterLat: null,
  searchCenterLng: null,
  searchRadius: null,
  serviceType: null,
});

const provider = new OpenStreetMapProvider({
  params: {
    "accept-language": "pl", // render results in Dutch
    countrycodes: "pl", // limit search results to the Netherlands
  },
});

function onStartChange() {
  clearTimeout(timeout);
  timeout = setTimeout(onStartSearch, 1000);
}

function onStartSearch() {
  provider
    .search({ query: searchQuery.value })
    .then((response) => {
      startResults.value = response;
      showStartResults.value = true;
    })
    .catch(console.error);
}

function onStartResultSelected(result: SearchResult) {
  startResults.value = null;
  showStartResults.value = false;
  searchQuery.value = result.label;
  options.value.searchCenterLat = result.y;
  options.value.searchCenterLng = result.x;
}

function onSearch() {
  if (
    options.value.searchCenterLat &&
    options.value.searchCenterLng &&
    options.value.serviceType &&
    options.value.searchRadius &&
    options.value.searchRadius > 0
  ) {
    // options.value.searchRadius = options.value.searchRadius * 1000;
    const bounds = new L.LatLngBounds([49, 25], [55, 14]);
    Api.getPlacesByBounds(
      (places) => {
        store.loadedPlaces = places;
        searchResults.value = places;
        emit("advancedFilterChanged");
        showResults.value = true;
      },
      bounds,
      options.value
    );
  }
}

function onResultSelected(place: Place) {
  emit("changeView", [place.latitude, place.longitude]);
}

function setToLocation() {
  if (store.myLocation) {
    startResults.value = null;
    showStartResults.value = false;
    searchQuery.value = "Moja lokalizacja";
    options.value.searchCenterLat = store.myLocation[0];
    options.value.searchCenterLng = store.myLocation[1];
  }
}

function getIconName(place: Place): string {
  return placeService.getTypeById(place.place_type_id)!.icon;
}

onMounted(() => {
  if (store.advancedSearchOptions) {
    options.value = store.advancedSearchOptions;
  }
  if (store.advancedSearchQuery) {
    searchQuery.value = store.advancedSearchQuery;
  }

  onSearch();
});

onUnmounted(() => {
  store.advancedSearchOptions = options.value;
  store.advancedSearchQuery = searchQuery.value;
});
</script>

<template>
  <div id="advancedSearch" class="container flex-col">
    <h3>Szukaj obiekty o wybranym typie na zadanym obszarze</h3>

    <div class="input-group">
      <div class="input-icon">
        <i class="fa-solid fa-map-location" />
      </div>
      <input
        type="text"
        placeholder="Adres początkowy"
        v-model="searchQuery"
        @input="onStartChange"
      />
      <button
        id="locationButton"
        @click="setToLocation"
        v-if="store.myLocation"
      >
        <i class="fa-solid fa-location-crosshairs"></i>
      </button>
    </div>
    <form @submit.prevent="onSearch">
      <div class="input-group">
        <div class="input-icon">
          <i class="fa-solid fa-wrench" />
        </div>
        <select v-model="options.serviceType">
          <option
            v-for="placeType in store.placeTypes"
            :value="placeType.id"
            :key="placeType.id"
          >
            {{ placeType.name }}
          </option>
        </select>
        <!-- <input type="text" placeholder="Typ obiektu" /> -->
      </div>
      <div class="input-group">
        <div class="input-icon">
          <i class="fa-solid fa-ruler" />
        </div>
        <input
          type="number"
          placeholder="Zasięg (m)"
          v-model="options.searchRadius"
        />
        <button id="searchButton" @click="onSearch">
          <i class="fa-solid fa-magnifying-glass" />
        </button>
      </div>
    </form>
    <div id="searchResults" v-if="showResults">
      <template v-if="searchResults && searchResults.length">
        <a
          class="search-result flex-row"
          v-for="result in searchResults"
          :key="result.name"
          @click="onResultSelected(result)"
        >
          <list-pin :fa-class="getIconName(result)"></list-pin>
          <div>
            <h4>{{ result.name }}</h4>
            <h5>{{ result.address }}</h5>
          </div>
        </a>
      </template>
      <template v-else>
        <h3>Brak wyników.</h3>
      </template>
    </div>
  </div>

  <div
    id="startSearchResults"
    class="container flex-col"
    v-if="showStartResults"
  >
    <template v-if="startResults && startResults.length">
      <a
        class="search-result"
        v-for="result in startResults"
        :key="result.label"
        @click="onStartResultSelected(result)"
      >
        <h4>{{ result.label }}</h4>
      </a>
    </template>
    <template v-else>
      <h3>Brak wyników.</h3>
      <a class="search-result" @click="showStartResults = false">Zamknij</a>
    </template>
  </div>
</template>

<style scoped>
#advancedSearch {
  position: fixed;
  width: 350px;
  height: calc(100vh - 200px);
  left: 50px;
  top: 150px;
  z-index: 1000;
  padding-top: 20px;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 19px;
}

#startSearchResults {
  position: fixed;
  width: 500px;
  left: 50px;
  top: 280px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 2000;
}

.search-result {
  cursor: pointer;
  padding: 5px 0 10px;
}

.search-result:hover {
  background-color: rgb(194, 194, 194);
}

#searchResults {
  max-height: calc(100vh - 430px);
  overflow-y: auto;
}

#searchResults h4 {
  margin-bottom: 10px;
}

#searchResults h5 {
  color: rgb(110, 110, 110);
}

#searchResults .search-result {
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(150, 150, 150, 0.5);
}

#locationButton,
#searchButton {
  margin-left: 0.5rem;
  font-size: 1.2rem;
}
</style>

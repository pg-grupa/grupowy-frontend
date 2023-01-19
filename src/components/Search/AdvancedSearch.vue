<script setup lang="ts">
import { OpenStreetMapProvider } from "leaflet-geosearch";
import type { SearchResult } from "leaflet-geosearch/dist/providers/provider";
import { type Ref, ref, onMounted, onUnmounted } from "vue";
import { store } from "@/state/store";
import type { Place } from "@/models/Place";
import { Api } from "@/services/ApiService";
import L from "leaflet";
import type AdvancedSearchOptions from "@/interfaces/AdvancedSearchOptions";

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
  console.log(options.value);
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

onMounted(() => {
  if (store.advancedSearchOptions) {
    options.value = store.advancedSearchOptions;
  }
  if (store.advancedSearchQuery) {
    searchQuery.value = store.advancedSearchQuery;
  }
});

onUnmounted(() => {
  store.advancedSearchOptions = options.value;
  store.advancedSearchQuery = searchQuery.value;
});
</script>

<template>
  <div id="advancedSearch">
    <h4>Szukaj obiekty o wybranym typie na zadanym obszarze</h4>

    <div class="input-group">
      <i class="fa-solid fa-map-location" />
      <input
        type="text"
        placeholder="Adres początkowy"
        v-model="searchQuery"
        @input="onStartChange"
      />
    </div>
    <form @submit.prevent="onSearch">
      <div class="input-group">
        <i class="fa-solid fa-wrench" />
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
        <i class="fa-solid fa-ruler" />
        <input
          type="number"
          placeholder="Zasięg (m)"
          v-model="options.searchRadius"
        />
      </div>
    </form>
    <div id="searchResults" v-if="showResults">
      <template v-if="searchResults && searchResults.length">
        <a
          class="search-result"
          v-for="result in searchResults"
          :key="result.name"
          @click="onResultSelected(result)"
        >
          <h4>{{ result.name }}</h4>
          {{ result.address }}
        </a>
      </template>
      <template v-else>
        <h3>Brak wyników.</h3>
      </template>
    </div>
  </div>

  <div id="startSearchResults" v-if="showStartResults">
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
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 1000;
  padding: 20px;
}

h4 {
  text-align: center;
  margin-bottom: 20px;
}

/* form {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid #c2c2c2;
} */

.input-group {
  display: flex;
  flex-direction: row;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

input,
select {
  margin-left: 20px;
  flex-grow: 1;
  background-color: #f8f8f8;
  border: none;
  border-radius: 5px;
  box-shadow: var(--small-shadow);
  padding: 0.5rem 0.5rem;
}

#startSearchResults {
  position: fixed;
  width: 500px;
  left: 50px;
  top: 280px;
  max-height: 500px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 2000;
  padding: 20px 0;
}

.search-result {
  display: block;
  cursor: pointer;
  padding: 5px 20px;
}

.search-result:hover {
  background-color: rgb(194, 194, 194);
}
</style>

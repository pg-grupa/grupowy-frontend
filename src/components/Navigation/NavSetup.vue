<script setup lang="ts">
import { exitMode, store } from "@/state/store";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import type { SearchResult } from "leaflet-geosearch/dist/providers/provider";
import { ref, onMounted, type Ref } from "vue";

const emit = defineEmits<{
  (e: "startNavigation"): void;
  (e: "modeChanged"): void;
  (e: "routeChanged"): void;
}>();

const startResults: Ref<SearchResult[] | null> = ref(null);
const showStartResults = ref(false);
const searchQuery = ref("");
const routeEnd = ref("");

let timeout: number | undefined;

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
  store.routeStart = {
    name: result.label,
    location: [result.y, result.x],
  };
  emit("routeChanged");
}

function onCloseButton(): void {
  store.routeStart = null;
  exitMode();
  emit("modeChanged");
}

function setToLocation() {
  if (store.myLocation) {
    store.routeStart = {
      name: "Moja lokalizacja",
      location: store.myLocation,
    };
    searchQuery.value = "Moja lokalizacja";
    emit("routeChanged");
  }
}

function startNavigation() {
  if (store.routeStart && store.routeEnd) {
    emit("startNavigation");
  }
}

onMounted(() => {
  routeEnd.value = store.routeEnd!.name;
  if (store.routeStart) {
    searchQuery.value = store.routeStart.name;
  }
  emit("modeChanged");
});
</script>

<template>
  <div id="navSetup">
    <a class="close-button" @click="onCloseButton()">
      <i class="fa-solid fa-x" />
    </a>
    <h3>Nawiguj do obiektu</h3>
    <div class="input-group">
      <i class="fa-solid fa-location-dot" />
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
    <div class="input-group">
      <i class="fa-solid fa-flag-checkered" />
      <input
        type="text"
        placeholder="Adres końcowy"
        v-model="routeEnd"
        disabled
      />
    </div>
    <div class="nav-footer">
      <button @click="startNavigation">
        <i class="fa-solid fa-route" />Nawiguj
      </button>
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
#navSetup {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 400px;
  left: 50px;
  top: 50px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 1000;
  padding: 10px 20px;
}

.close-button {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 1.3rem;
  z-index: 1001;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
}

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

#locationButton {
  /* padding: 0.1rem 0.5rem; */
  /* cursor: pointer; */
  margin-left: 0.5rem;
  /* background-color: #f8f8f8; */
  /* border: none; */
  /* border-radius: 5px; */
  /* box-shadow: var(--small-shadow); */
  font-size: 1.2rem;
}

#startSearchResults {
  position: fixed;
  width: 500px;
  left: 50px;
  top: 150px;
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

.nav-footer {
  display: flex;
  justify-content: flex-end;
}

.nav-footer button {
  font-size: 1.1rem;
}
</style>
